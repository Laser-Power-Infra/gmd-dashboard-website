import { z } from 'zod';

import { otherProducts } from '@/data/otherProducts';
import { valvesData } from '@/data/valves';
import { sendEnquiry } from '@/lib/notify';

import { enquirySchema, type EnquiryInput } from './schema';

/**
 * POST /api/enquiry
 *
 * Two enquiry shapes, discriminated by `kind`:
 *   - "quote"  the site-wide Get a Quote modal
 *   - "valve"  the inquiry form on a valve detail page
 *
 * Contact fields are validated with zod; the product is re-resolved from
 * data/valves.ts and data/otherProducts.ts by id, and the pressure/operation
 * the browser sends must be one this product actually offers. Nothing the
 * client calls the product is used in the email.
 */

function resolveValve(valveId: string) {
  const valve = valvesData.find((v) => v.id === valveId) ?? otherProducts.find((p) => p.id === valveId);
  if (!valve) return null;

  // Accessories carry no pressure/operation - ValveDetailPage defaults them the same way.
  const pressure = 'pressure' in valve && valve.pressure?.length ? valve.pressure : [];
  const operation =
    'operation' in valve && valve.operation?.length ? valve.operation.map((op) => op.split(' (')[0]) : ['Manual'];

  return {
    name: valve.name,
    category: valve.category || 'Other Accessories',
    catalogueSize: valve.size || 'Various',
    pressure,
    operation,
  };
}

function quoteBody(data: Extract<EnquiryInput, { kind: 'quote' }>) {
  return [
    'New quotation request from the website.',
    '',
    `Name:     ${data.name}`,
    `Company:  ${data.company || '-'}`,
    `Email:    ${data.email}`,
    `Phone:    ${data.phone}`,
    `Valve:    ${data.valveType}`,
    `Quantity: ${data.quantity}`,
    '',
    'Message:',
    data.message || '-',
    '',
    `Received: ${new Date().toISOString()}`,
  ].join('\n');
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
    return Response.json({ ok: false, errors: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }

  const data = parsed.data;
  let subject: string;
  let text: string;

  if (data.kind === 'quote') {
    subject = `Quote request: ${data.valveType} x${data.quantity} - ${data.name}`;
    text = quoteBody(data);
  } else {
    const valve = resolveValve(data.valveId);
    if (!valve) {
      return Response.json({ ok: false, error: 'Unknown product.' }, { status: 400 });
    }
    // "Custom" is an explicit option on both selects; anything else must be on the product's own list.
    if (data.pressure && data.pressure !== 'Custom' && !valve.pressure.includes(data.pressure)) {
      return Response.json({ ok: false, error: 'Unknown pressure rating for this product.' }, { status: 400 });
    }
    if (data.operation && data.operation !== 'Custom' && !valve.operation.includes(data.operation)) {
      return Response.json({ ok: false, error: 'Unknown operation mode for this product.' }, { status: 400 });
    }

    subject = `Proposal request: ${valve.name} - ${data.name}`;
    text = [
      'New proposal request from a valve detail page.',
      '',
      `Name:       ${data.name}`,
      `Company:    ${data.company || '-'}`,
      `Email:      ${data.email}`,
      `Phone:      ${data.phone}`,
      '',
      `Product:    ${valve.name} (${valve.category}, id ${data.valveId})`,
      `Catalogue:  ${valve.catalogueSize}`,
      `Size asked: ${data.valveSize}`,
      `Pressure:   ${data.pressure || '-'}`,
      `Operation:  ${data.operation || '-'}`,
      '',
      'Requirements:',
      data.message || '-',
      '',
      `Received: ${new Date().toISOString()}`,
    ].join('\n');
  }

  const sent = await sendEnquiry(subject, text);
  if (!sent.ok) {
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

  return Response.json({ ok: true });
}
