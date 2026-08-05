// Central authentication gate for protected routes.
//
// Authentication (Auth.js v5) is NOT wired up yet by design. When it lands:
//   import { auth } from '@/auth';
//   export async function requireAuth() {
//     const session = await auth();
//     if (!session?.user) redirect('/login');
//     if (session.user.role !== 'ADMIN') redirect('/');
//     return session;
//   }
//
// For now this is a no-op so the app builds and admin pages remain accessible.
export function requireAuth(): null {
  return null;
}
