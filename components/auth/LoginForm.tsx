'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import PasswordInput from '@/components/auth/PasswordInput';

/**
 * Client-side login form using NextAuth's credentials sign-in.
 * On success, routes to `next` (internal paths only) or a role-based default.
 */
export default function LoginForm({ next }: { next: string | null }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    });
    if (!res?.ok) {
      setError('Invalid email or password');
      setPending(false);
      return;
    }
    const session = await getSession();
    const safeNext = next?.startsWith('/') && !next.startsWith('//') ? next : null;
    router.push(safeNext ?? (session?.user.role === 'USER' ? '/cost' : '/admin/cost-requests'));
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Email */}
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          className="w-full rounded-md border border-gray-300 bg-slate-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#7b3e41] focus:outline-none focus:ring-2 focus:ring-[#7b3e41]"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col">
        <label htmlFor="password" className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-700">
          Password
        </label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-[#7b3e41] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#5a2c2f] focus:outline-none focus:ring-2 focus:ring-[#7b3e41] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75"
      >
        {isPending ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}
