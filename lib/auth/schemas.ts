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

/** Registration form: name + email + password (min 8 chars). */
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
  errors?: Partial<Record<'name' | 'email' | 'password' | 'role', string[]>>;
  message?: string;
};
