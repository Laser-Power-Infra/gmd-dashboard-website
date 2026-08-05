'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { createSession, destroySession, getCurrentUser } from '@/lib/auth/session';
import {
  loginSchema,
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
// LOGIN
// ---------------------------------------------------------------------------

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  // Look the user up by email.
  const user = await prisma.user.findUnique({ where: { email } });

  // Same message whether the user is missing OR the password is wrong,
  // so attackers can't learn which emails are registered.
  const fail = (): AuthFormState => ({
    ok: false,
    message: 'Invalid email or password',
  });

  if (!user?.passwordHash) return fail();

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return fail();

  // Create the session (DB row + httpOnly cookie).
  await createSession(user.id);

  // Decide where to send the user based on role:
  //  - Normal USER  -> the /cost page (submit + see their own requests)
  //  - ADMIN/DEV    -> the admin page (see ALL submissions)
  const next = formData.get('next')?.toString() ?? '';
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : null;
  const target =
    safeNext ?? (user.role === 'USER' ? '/cost' : '/admin/cost-requests');

  redirect(target);
}

// ---------------------------------------------------------------------------
// REGISTER
// ---------------------------------------------------------------------------

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

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
      email,
      passwordHash: await hashPassword(password),
      role: 'USER',
    },
  });

  // Send the new user to the login page to sign in.
  redirect('/login?registered=1');
}

// ---------------------------------------------------------------------------
// LOGOUT
// ---------------------------------------------------------------------------

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/');
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
