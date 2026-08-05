import Link from 'next/link';
import { Suspense } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

/**
 * /register — public page for creating a USER account.
 *
 * New accounts always get role 'USER'. The DEVELOPER account is created
 * manually in the database (a DEVELOPER promotes others via /admin/users).
 * After registering, the user is redirected to /login to sign in.
 */
export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Register to submit cost estimate requests
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-xl">
          <Suspense fallback={null}>
            <RegisterForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#7b3e41] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
