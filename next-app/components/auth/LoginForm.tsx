'use client';

import { useActionState } from 'react';
import { loginAction } from '@/lib/auth/actions';
import type { AuthFormState } from '@/lib/auth/schemas';
import PasswordInput from '@/components/auth/PasswordInput';

/**
 * Client-side login form.
 *
 * Uses React 19's `useActionState` to call the `loginAction` server action:
 *   - The server validates, verifies the password, creates the session, and
 *     redirects (role-aware) on success.
 *   - On failure it returns an error state which we render below the form.
 *
 * `next` is carried as a hidden input so the action knows where to redirect.
 * It is sanitized on the server (must be an internal path starting with '/').
 */

const INITIAL_STATE: AuthFormState = { ok: false };

export default function LoginForm({ next }: { next: string | null }) {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* Hidden field so the server knows where to send the user back. */}
      {next && <input type="hidden" name="next" value={next} />}

      {/* Global error (e.g. wrong credentials) */}
      {state.message && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.message}
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
        {state.errors?.email && (
          <p className="mt-1 text-xs font-medium text-red-500">{state.errors.email[0]}</p>
        )}
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
        {state.errors?.password && (
          <p className="mt-1 text-xs font-medium text-red-500">{state.errors.password[0]}</p>
        )}
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
