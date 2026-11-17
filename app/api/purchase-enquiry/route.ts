import { z } from 'zod';

import { cleanItemName, stockKey } from '@/app/purchase/catalog';
import { getCurrentUser } from '@/lib/auth/session';
import { sendEnquiry } from '@/lib/notify';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/purchase-enquiry
 *
 * Receives the item list a signed-in customer built on /purchase. The item
 * lines are re-resolved against the PurchaseItemPrice catalogue on the server, so
 * the saved description/category/stock figure is ours and not whatever the
 * browser sent. Buyer identity comes from the account, not the form.
 *
 * The list is saved as a CostRequest (same table as /cost), so the admin can
 * quote it on /admin/cost-requests and the customer can pay on /cost. The row
 * is the record; the email is best-effort on top.
 */

const enquirySchema = z.object({
  message: z.string().trim().max(2000).optional().default(''),
  items: z
    .array(
      z.object({
        itemCode: z.string().trim().min(1).max(40),
        itemName: z.string().trim().min(1).max(300),
        quantity: z.coerce.number().int().min(1).max(9999),
        remarks: z.string().trim().max(500).optional().default(''),
      })
    )
    .min(1, 'Add at least one item to your list')
    .max(50, 'Please split requests of more than 50 items'),
});

type StockEntry = { name: string; category: string; unit: string; inStock: number };

/** Looks up only the submitted lines in PurchaseItemPrice (max 50), keyed by stockKey. */
async function loadStock(lines: { itemCode: string; itemName: string }[]): Promise<Map<string, StockEntry>> {
  const rows = await prisma.purchaseItemPrice.findMany({
    where: {
      OR: lines.map((l) => ({
        itemCode: l.itemCode,
        itemName: { equals: cleanItemName(l.itemName), mode: 'insensitive' as const },
      })),
    },
    select: { itemCode: true, itemName: true, metadata: true },
  });
  return new Map(
    rows.map((r) => {
      const m = r.metadata as { category?: string; unit?: string; rowCount?: number };
      const entry = { name: r.itemName, category: m.category ?? '', unit: m.unit ?? '', inStock: m.rowCount ?? 1 };
      return [stockKey(r.itemCode, r.itemName), entry];
    })
  );
}

export async function POST(request: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return Response.json({ ok: false, error: 'Please sign in to submit a request.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Malformed request body.' }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, errors: z.flattenError(parsed.error).fieldErrors },
      { status: 400 }
    );
  }

  const stock = await loadStock(parsed.data.items);

  // Never trust the client's description or stock figure - look each line up.
  const lines = [];
  const unknown: string[] = [];
  for (const line of parsed.data.items) {
    const entry = stock.get(stockKey(line.itemCode, cleanItemName(line.itemName)));
    if (!entry) {
      unknown.push(line.itemCode);
      continue;
    }
    lines.push({
      itemCode: line.itemCode,
      itemName: entry.name,
      category: entry.category,
      unit: entry.unit,
      inStock: entry.inStock,
      quantity: line.quantity,
      remarks: line.remarks,
    });
  }

  if (unknown.length > 0) {
    return Response.json(
      { ok: false, error: `Unknown item code(s): ${unknown.join(', ')}` },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true, company: true, gstNumber: true, contactNumber: true },
  });
  if (!user) {
    return Response.json({ ok: false, error: 'Please sign in to submit a request.' }, { status: 401 });
  }

  const name = user.name ?? user.email;
  const company = user.company ?? '';
  try {
    await prisma.costRequest.create({
      data: { name, company, email: user.email, gst: user.gstNumber ?? '', items: lines, userId: session.id },
    });
  } catch (err) {
    console.error('Failed to save purchase request:', err);
    return Response.json(
      { ok: false, error: 'We could not save your request just now. Please try again.' },
      { status: 500 }
    );
  }

  const { message } = parsed.data;
  // Best-effort notification; the saved row is the record and the customer sees it on /cost.
  await sendEnquiry(
    `Stock request: ${lines.length} item(s) - ${company || name}`,
    [
      'New stock request from the /purchase catalogue. Quote it on /admin/cost-requests.',
      '',
      `Name:    ${name}`,
      `Company: ${company || '-'}`,
      `Email:   ${user.email}`,
      `Phone:   ${user.contactNumber ?? '-'}`,
      `GSTIN:   ${user.gstNumber ?? '-'}`,
      '',
      'Message:',
      message || '-',
      '',
      `Items (${lines.length}):`,
      ...lines.map(
        (l) =>
          `  ${l.itemCode}  ${l.itemName}  [${l.category}]  qty ${l.quantity} ${l.unit}  ` +
          `(in stock: ${l.inStock})${l.remarks ? `  remarks: ${l.remarks}` : ''}`
      ),
      '',
      `Received: ${new Date().toISOString()}`,
    ].join('\n')
  );

  return Response.json({ ok: true, items: lines.length });
}
