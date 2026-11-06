'use client';

import { useActionState } from 'react';
import { registerAction } from '@/lib/auth/actions';
import type { AuthFormState } from '@/lib/auth/schemas';
import PasswordInput from '@/components/auth/PasswordInput';

/**
 * Client-side registration form.
 *
 * Calls the `registerAction` server action via useActionState. On success the
 * server redirects to /login?registered=1; on failure we show the errors.
 */

const INITIAL_STATE: AuthFormState = { ok: false };

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* Global error */}
      {state.message && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.message}
        </p>
      )}

      {/* Full name */}
      <div className="flex flex-col">
        <label htmlFor="name" className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Alok Das"
          className="w-full rounded-md border border-gray-300 bg-slate-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#7b3e41] focus:outline-none focus:ring-2 focus:ring-[#7b3e41]"
        />
        {state.errors?.name && (
          <p className="mt-1 text-xs font-medium text-red-500">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Company */}
      <div className="flex flex-col">
        <label htmlFor="company" className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-700">
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          maxLength={150}
          placeholder="Company name"
          className="w-full rounded-md border border-gray-300 bg-slate-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#7b3e41] focus:outline-none focus:ring-2 focus:ring-[#7b3e41]"
        />
        {state.errors?.company && (
          <p className="mt-1 text-xs font-medium text-red-500">{state.errors.company[0]}</p>
        )}
      </div>

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

      {/* Contact Number */}
      <div className="flex flex-col">
        <label htmlFor="contactNumber" className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-700">
          Contact Number
        </label>
        <input
          id="contactNumber"
          name="contactNumber"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          placeholder="10-digit mobile number"
          className="w-full rounded-md border border-gray-300 bg-slate-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#7b3e41] focus:outline-none focus:ring-2 focus:ring-[#7b3e41]"
        />
        {state.errors?.contactNumber && (
          <p className="mt-1 text-xs font-medium text-red-500">{state.errors.contactNumber[0]}</p>
        )}
      </div>

      {/* GST Number */}
      <div className="flex flex-col">
        <label htmlFor="gstNumber" className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-700">
          GST Number
        </label>
        <input
          id="gstNumber"
          name="gstNumber"
          type="text"
          maxLength={15}
          placeholder="15-character GSTIN, e.g. 19ABCDE1234F1Z5"
          className="w-full rounded-md border border-gray-300 bg-slate-50 px-4 py-3 uppercase text-gray-900 placeholder:normal-case placeholder:text-gray-400 focus:border-[#7b3e41] focus:outline-none focus:ring-2 focus:ring-[#7b3e41]"
        />
        {state.errors?.gstNumber && (
          <p className="mt-1 text-xs font-medium text-red-500">{state.errors.gstNumber[0]}</p>
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
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
        {isPending ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
}
