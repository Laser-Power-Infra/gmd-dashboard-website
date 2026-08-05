import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-auth';
import { logoutAction } from '@/lib/auth/actions';
import { getCurrentUser } from '@/lib/auth/session';

/**
 * Shared layout for every /admin/* page.
 *
 * `requireAdmin()` runs on every admin request: an anonymous visitor is
 * redirected to /login, and a plain USER is redirected to /. Only ADMIN and
 * DEVELOPER roles can see this area.
 *
 * The DEVELOPER also gets a "Users" link (role management). The header shows
 * the signed-in user's name/email and a Sign out button.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Security gate: ADMIN or DEVELOPER required.
  await requireAdmin();

  // Fetch the current user for the header display + role check.
  const user = await getCurrentUser();
  const isDeveloper = user?.role === 'DEVELOPER';

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin/cost-requests" className="text-lg font-bold text-slate-800">
              Admin Dashboard
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/admin/cost-requests"
                className="font-medium text-[#8a4f50] hover:text-[#6e3e3f]"
              >
                Cost Requests
              </Link>
              {/* Role management is DEVELOPER-only. */}
              {isDeveloper && (
                <Link
                  href="/admin/users"
                  className="font-medium text-[#8a4f50] hover:text-[#6e3e3f]"
                >
                  Users
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-700">{user.name ?? user.email}</p>
                <p className="text-xs text-slate-400">{user.role}</p>
              </div>
            )}

            {/* Sign out is a server action invoked from a plain form. */}
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Sign out
              </button>
            </form>

            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
              <i className="fas fa-arrow-left mr-1"></i> Back to Site
            </Link>
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
