import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

import { cleanItemName, isExcludedItem, stockKey, type MasterRow } from '@/app/purchase/catalog';
import { recordEnquiry } from '@/lib/enquiryStore';

/**
 * POST /api/purchase-enquiry
 *
 * Receives a stock enquiry from /purchase: buyer contact details plus the item
 * list they built. Buyer fields are validated with zod, and the item lines are
 * re-resolved against `public/purchaseItems.json` on the server, so the emailed
 * description/category/stock figure is ours and not whatever the browser sent.
 *
 * The enquiry is saved through lib/enquiryStore.ts and only then emailed, so a
 * server with no ENQUIRY_* credentials still keeps every enquiry.
 */

const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  company: z.string().trim().max(150).optional().default(''),
  email: z.string().trim().email('Enter a valid email address').max(254),
  phone: z
    .string()
    .trim()
    .min(6, 'Enter a valid phone number')
    .max(20)
    .regex(/^[0-9+\-()\s]+$/, 'Enter a valid phone number'),
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
    .max(100, 'Please split enquiries of more than 100 items'),
});

type StockEntry = { name: string; category: string; unit: string; inStock: number };

let stockCache: Map<string, StockEntry> | null = null;

async function loadStock(): Promise<Map<string, StockEntry>> {
  if (stockCache) return stockCache;

  const file = await fs.readFile(path.join(process.cwd(), 'public', 'purchaseItems.json'), 'utf8');
  const rows: MasterRow[] = JSON.parse(file);

  const map = new Map<string, StockEntry>();
  for (const row of rows) {
    if (isExcludedItem(row.itemName)) continue;
    const name = cleanItemName(row.itemName);
    if (!name) continue;
    const key = stockKey(row.itemCode, name);
    const existing = map.get(key);
    if (existing) existing.inStock += 1;
    else map.set(key, { name, category: row.category, unit: row.unit, inStock: 1 });
  }

  stockCache = map;
  return map;
}

export async function POST(request: Request) {
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

  const stock = await loadStock();

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

  const { name, company, email, phone, message } = parsed.data;
  const text = [
    'New stock enquiry from the /purchase catalogue.',
    '',
    `Name:    ${name}`,
    `Company: ${company || '-'}`,
    `Email:   ${email}`,
    `Phone:   ${phone}`,
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
  ].join('\n');

  const { saved, sent } = await recordEnquiry({
    kind: 'purchase',
    name,
    company,
    email,
    phone,
    message,
    subject: `Stock enquiry: ${lines.length} item(s) - ${name}`,
    details: text,
  });

  // Only a lost enquiry is an error to the customer: a saved row is enough.
  if (!saved && !sent.ok) {
    return Response.json(
      {
        ok: false,
        error:
          sent.reason === 'not-configured'
            ? 'Enquiries cannot be sent from this server yet. Please contact us directly so your request is not lost.'
            : 'We could not send your enquiry just now. Please try again, or contact us directly.',
      },
      { status: 503 }
    );
  }

  return Response.json({ ok: true, items: lines.length });
}
