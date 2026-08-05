import Link from 'next/link';
import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

/**
 * /login — public page where users sign in.
 *
 * `searchParams` carries `?next=...` (set by requireAuth when an anonymous
 * user was redirected here) and `?registered=1` (after a successful signup).
 * The LoginForm includes `next` as a hidden field so the login action knows
 * where to return the user afterwards.
 */

// searchParams is a Promise in Next.js 16 server components.
type LoginPageProps = {
  searchParams: Promise<{ next?: string; registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, registered } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Sign In</h1>
          <p className="mt-1 text-sm text-slate-500">
            Access your dashboard
          </p>
        </div>

        {registered === '1' && (
          <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Account created! Please sign in.
          </p>
        )}

        <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-xl">
          {/* Suspense keeps the client form isolated from the searchParams await */}
          <Suspense fallback={null}>
            <LoginForm next={next ?? null} />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-[#7b3e41] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
