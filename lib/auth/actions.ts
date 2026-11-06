'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { getCurrentUser } from '@/lib/auth/session';
import {
  registerSchema,
  roleUpdateSchema,
  type AuthFormState,
} from '@/lib/auth/schemas';

/**
 * Server actions for authentication.
 *
 * These run ONLY on the server (note the 'use server' directive). They are
 * called from client forms via `useActionState`, so each one receives
 * `(prevState, formData)` and returns the next state object.
 */

// ---------------------------------------------------------------------------
// REGISTER
// ---------------------------------------------------------------------------

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    company: formData.get('company'),
    email: formData.get('email'),
    password: formData.get('password'),
    contactNumber: formData.get('contactNumber'),
    gstNumber: formData.get('gstNumber'),
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { name, company, email, password, contactNumber, gstNumber } = parsed.data;

  // Make sure the email is not already taken.
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, errors: { email: ['An account with this email already exists'] } };
  }

  // New accounts always start as USER. The DEVELOPER account is created
  // manually in the database (only a DEVELOPER can promote other users).
  await prisma.user.create({
    data: {
      name,
      company,
      email,
      passwordHash: await hashPassword(password),
      contactNumber,
      gstNumber,
      role: 'USER',
    },
  });

  // Send the new user to the login page to sign in.
  redirect('/login?registered=1');
}

// ---------------------------------------------------------------------------
// ROLE UPDATE (DEVELOPER only)
// ---------------------------------------------------------------------------

export async function updateRoleAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  // Only a DEVELOPER may change roles.
  const caller = await getCurrentUser();
  if (!caller || caller.role !== 'DEVELOPER') {
    return { ok: false, message: 'Forbidden: DEVELOPER role required' };
  }

  const parsed = roleUpdateSchema.safeParse({
    userId: formData.get('userId'),
    role: formData.get('role'),
  });
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { userId, role } = parsed.data;

  // Never allow a developer to demote themselves — that would lock everyone
  // out of the role-management page.
  if (userId === caller.id && role !== 'DEVELOPER') {
    return { ok: false, message: 'You cannot change your own role' };
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) {
    return { ok: false, message: 'User not found' };
  }

  // Update the role. Note: we only allow ADMIN <-> USER <-> DEVELOPER
  // transitions for everyone except self (handled above).
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  // Refresh the /admin/users page so the dropdown reflects the change.
  revalidatePath('/admin/users');

  return { ok: true, message: `Role updated to ${role}` };
}
