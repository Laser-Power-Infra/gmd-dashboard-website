'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { sendEnquiry } from '@/lib/notify';
import { getCostFormOptions, type CostLookupField } from '@/lib/lookupOptions';
import { costErrors, costRequestSchema, type CostRequestFormState } from '@/lib/schemas/cost';

/**
 * Server action that handles a cost request submission from the /cost form.
 *
 * The signed-in user is resolved from the session cookie and stored on the
 * CostRequest row (userId), so each submission is linked to its owner. A
 * normal user later sees only their own rows on /cost, while admins/developers
 * see everything on /admin/cost-requests.
 *
 * Items arrive as one JSON field and are re-validated here with the same
 * schema the page uses, so a request without items cannot be saved even if
 * the page check is bypassed. The row is the record; mail is best-effort.
 */
export async function submitCostRequest(
  _prevState: CostRequestFormState,
  formData: FormData
): Promise<CostRequestFormState> {
  let items: unknown = [];
  try {
    items = JSON.parse(formData.get('items')?.toString() || '[]');
  } catch {
    return { ok: false, errors: { items: 'Add at least one item' } };
  }

  const parsed = costRequestSchema.safeParse({
    name: formData.get('fullName')?.toString() ?? '',
    company: formData.get('company')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    gst: formData.get('gstNumber')?.toString() ?? '',
    items,
  });

  if (!parsed.success) {
    return { ok: false, errors: costErrors(parsed.error) };
  }

  // Dropdown values must still be live lookup options (the page check is bypassable).
  const options = await getCostFormOptions();
  const optionErrors: Record<string, string> = {};
  parsed.data.items.forEach((item, n) => {
    for (const field of Object.keys(options) as CostLookupField[]) {
      if (!options[field].includes(item[field])) optionErrors[`items.${n}.${field}`] = 'Select a value from the list';
    }
  });
  if (Object.keys(optionErrors).length) return { ok: false, errors: optionErrors };

  // Only signed-in users can submit (the /cost page is gated by requireAuth).
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, errors: { name: 'You must be signed in to submit a request.' } };
  }

  const data = parsed.data;
  try {
    await prisma.costRequest.create({ data: { ...data, userId: user.id } });
  } catch (err) {
    console.error('Failed to save cost request:', err);
    return {
      ok: false,
      errors: { name: 'Something went wrong while saving your request. Please try again.' },
    };
  }

  // sendEnquiry logs the full request itself on failure; the saved row is enough for the customer.
  await sendEnquiry(
    `Cost estimate request: ${data.items.length} item(s) - ${data.company}`,
    [
      'New cost estimate request from /cost.',
      '',
      `Name:    ${data.name}`,
      `Company: ${data.company}`,
      `Email:   ${data.email}`,
      `GSTIN:   ${data.gst}`,
      '',
      `Items (${data.items.length}):`,
      ...data.items.map(
        (i, n) =>
          `  ${n + 1}. ${i.valveType}, ${i.size}, ${i.pressure}, ${i.material}, ${i.endConnection} - qty ${i.quantity}` +
          (i.remarks ? `  remarks: ${i.remarks}` : '')
      ),
      '',
      `Received: ${new Date().toISOString()}`,
    ].join('\n')
  );

  return { ok: true };
}
