import { z } from 'zod';

/**
 * Zod schemas for all auth-related inputs.
 *
 * Zod validates untrusted input coming from the client BEFORE it touches
 * the database, so a malformed/hostile request never reaches Prisma.
 */

/** Role values allowed in the system. */
export const ROLES = ['USER', 'ADMIN', 'DEVELOPER'] as const;
export type Role = (typeof ROLES)[number];

/** Login form: email + password. */
export const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});
export type LoginInput = z.infer<typeof loginSchema>;

/** Indian mobile number: 10 digits starting 6-9. */
const CONTACT_RE = /^[6-9][0-9]{9}$/;

/** GSTIN: 15 chars = 2-digit state + 5-letter PAN + 4-digit entity + 1 letter + 1 alnum + Z + 1 alnum. */
const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

/** Treat a blank form field as "not provided" so optional fields accept ''. */
const blankToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

/** Registration form: name + email + password + contact number (+ optional GSTIN). */
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must be 100 characters or fewer' }),
  email: z.string().trim().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  contactNumber: z.preprocess(
    (v) => (typeof v === 'string' ? v.replace(/[\s-]/g, '') : v),
    z
      .string()
      .trim()
      .regex(CONTACT_RE, { message: 'Enter a valid 10-digit contact number' })
  ),
  gstNumber: z.preprocess(
    blankToUndefined,
    z
      .string()
      .trim()
      .toUpperCase()
      .regex(GSTIN_RE, { message: 'Enter a valid 15-character GST number' })
      .optional()
  ),
});
export type RegisterInput = z.infer<typeof registerSchema>;

/** Role-change action: which user, and which new role. */
export const roleUpdateSchema = z.object({
  userId: z.string().min(1, { message: 'User is required' }),
  role: z.enum(ROLES, { message: 'Invalid role' }),
});
export type RoleUpdateInput = z.infer<typeof roleUpdateSchema>;

/** Return shape for the login / register / role actions. */
export type AuthFormState = {
  ok: boolean;
  errors?: Partial<
    Record<
      'name' | 'email' | 'password' | 'contactNumber' | 'gstNumber' | 'role',
      string[]
    >
  >;
  message?: string;
};
