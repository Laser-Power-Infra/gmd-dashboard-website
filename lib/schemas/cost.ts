import { z } from 'zod';

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
});

export type CostRequestInput = z.infer<typeof costRequestSchema>;

export type CostRequestFormState = {
  ok: boolean;
  errors?: Partial<Record<keyof CostRequestInput, string[]>>;
};
