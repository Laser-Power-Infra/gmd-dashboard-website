import { z } from 'zod';

/**
 * Validation for POST /api/enquiry - the Get a Quote modal and the valve
 * detail page inquiry form. Kept in its own module (no `fs`, no data imports)
 * so `scripts/check-enquiry.mjs` can exercise it directly.
 *
 * Same rigour as app/api/purchase-enquiry/route.ts: the client may choose
 * *which* product and *how many*, never what the product is called or what it
 * costs. Product identity is re-resolved from data/ in the route handler.
 */

/** Must stay in sync with the <option> values in GetQuoteModal; the self-check asserts it. */
export const QUOTE_VALVE_TYPES = [
  'Sluice Valve',
  'Butterfly Valve',
  'Air Valve',
  'Manual Valve',
  'Non-Return Valve',
  'Control Valve',
  'Regulating Valve',
  'Other',
] as const;

const contact = {
  name: z.string().trim().min(2, 'Name is required').max(100),
  email: z.string().trim().email('Enter a valid email address').max(254),
  phone: z
    .string()
    .trim()
    .min(6, 'Enter a valid phone number')
    .max(20)
    .regex(/^[0-9+\-()\s]+$/, 'Enter a valid phone number'),
  company: z.string().trim().max(150).optional().default(''),
  message: z.string().trim().max(2000).optional().default(''),
};

export const quoteEnquirySchema = z.object({
  kind: z.literal('quote'),
  ...contact,
  valveType: z.enum(QUOTE_VALVE_TYPES),
  quantity: z.coerce.number().int().min(1).max(9999),
});

export const valveEnquirySchema = z.object({
  kind: z.literal('valve'),
  ...contact,
  // The id is the only product field we trust - name/category/specs come from data/.
  valveId: z.string().trim().min(1).max(80),
  valveSize: z.string().trim().min(1, 'Required size is required').max(100),
  pressure: z.string().trim().max(80).optional().default(''),
  operation: z.string().trim().max(80).optional().default(''),
});

export const enquirySchema = z.discriminatedUnion('kind', [quoteEnquirySchema, valveEnquirySchema]);

export type EnquiryInput = z.infer<typeof enquirySchema>;
