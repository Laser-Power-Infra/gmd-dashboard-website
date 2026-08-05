import Link from 'next/link';
import { requireAuth } from '@/lib/auth/require-auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // NOTE: currently a no-op; wired to redirect to /login once auth is implemented.
  requireAuth();

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
            </nav>
          </div>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
            <i className="fas fa-arrow-left mr-1"></i> Back to Site
          </Link>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
