import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import type { Role } from '@/lib/auth/schemas';

/**
 * Route guards — the security gate for every protected page.
 *
 * Each guard is called from a server component (layout or page) and:
 *   1. Resolves the signed-in user from the session cookie.
 *   2. Redirects to /login if not signed in.
 *   3. Redirects to '/' if the user's role is too low.
 *   4. Returns the user so the page can use their data.
 *
 * Usage:
 *   const user = await requireAuth();       // any signed-in user
 *   const user = await requireAdmin();      // ADMIN or DEVELOPER
 *   const user = await requireDeveloper();  // DEVELOPER only
 */

/** Any signed-in user (e.g. the /cost page). */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/cost');
  return user;
}

/** ADMIN or DEVELOPER — the /admin/* area. */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'ADMIN' && user.role !== 'DEVELOPER') {
    redirect('/');
  }
  return user;
}

/** DEVELOPER only — the role-management page. */
export async function requireDeveloper() {
  const user = await requireAdmin();
  if (user.role !== 'DEVELOPER') {
    redirect('/admin/cost-requests');
  }
  return user;
}

/** True if the given role is an elevated role. */
export function isElevatedRole(role: string): boolean {
  return role === 'ADMIN' || role === 'DEVELOPER';
}

export type { Role };
