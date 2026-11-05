import { z } from 'zod';

import { QUOTE_VALVE_TYPES } from '@/app/api/enquiry/schema';

const required = (label: string) =>
  z.string().trim().min(1, { message: `${label} is required` }).max(100, { message: `${label} is too long` });

export const costItemSchema = z.object({
  valveType: z.enum(QUOTE_VALVE_TYPES, { message: 'Select a valve type' }),
  size: required('Size'),
  pressure: required('Pressure rating'),
  material: required('Material'),
  endConnection: required('End connection'),
  quantity: z.coerce
    .number({ message: 'Quantity is required' })
    .int({ message: 'Quantity must be a whole number' })
    .min(1, { message: 'Quantity must be at least 1' })
    .max(9999, { message: 'Quantity must be 9999 or less' }),
  remarks: z.string().trim().max(500, { message: 'Remarks must be 500 characters or fewer' }).optional().default(''),
});

export type CostItem = z.infer<typeof costItemSchema>;

/** One line per item for tables; rows saved before items existed hold []. */
export function costItemLines(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return (items as CostItem[]).map(
    (i) =>
      `${i.valveType} · ${i.size} · ${i.pressure} · ${i.material} · ${i.endConnection} · qty ${i.quantity}` +
      (i.remarks ? ` (${i.remarks})` : '')
  );
}

// Official GSTIN format: 2-digit state code + 10-char PAN + entity code + "Z" + check digit
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export const costRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name is required' })
    .max(100, { message: 'Name must be 100 characters or fewer' }),
  company: z
    .string()
    .trim()
    .min(2, { message: 'Company is required' })
    .max(150, { message: 'Company must be 150 characters or fewer' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Enter a valid email address' })
    .max(254, { message: 'Email must be 254 characters or fewer' }),
  gst: z
    .string()
    .trim()
    .toUpperCase()
    .regex(GSTIN_REGEX, { message: 'Enter a valid 15-character GSTIN' }),
  items: z
    .array(costItemSchema)
    .min(1, { message: 'Add at least one item' })
    .max(50, { message: 'Please split requests of more than 50 items' }),
});

export type CostRequestInput = z.input<typeof costRequestSchema>;

/** Field errors keyed by zod path: "name", "items" (list-level), "items.0.size", ... */
export type CostRequestFormState = {
  ok: boolean;
  errors?: Record<string, string>;
};

export function costErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    out[key] ??= issue.message;
  }
  return out;
}
