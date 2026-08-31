'use client';

import { useState, useActionState, startTransition } from 'react';
import type { FormEvent } from 'react';
import { Send, Loader2, Check } from 'lucide-react';
import { costRequestSchema, type CostRequestFormState } from '@/lib/schemas/cost';
import { submitCostRequest } from '@/app/cost/actions';

type FieldErrors = Partial<Record<'name' | 'company' | 'email' | 'gst', string[]>>;

const INITIAL_STATE: CostRequestFormState = { ok: false };

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="mt-1 text-xs font-medium text-red-500">{error}</p>;
}

export default function CostForm() {
  const [state, formAction, isPending] = useActionState(submitCostRequest, INITIAL_STATE);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [dismissed, setDismissed] = useState(false);

  const errors: FieldErrors = {
    name: clientErrors.name ?? state.errors?.name,
    company: clientErrors.company ?? state.errors?.company,
    email: clientErrors.email ?? state.errors?.email,
    gst: clientErrors.gst ?? state.errors?.gst,
  };

  const showSuccess = state.ok && !dismissed;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = costRequestSchema.safeParse({
      name: fd.get('fullName'),
      company: fd.get('company'),
      email: fd.get('email'),
      gst: fd.get('gstNumber'),
    });

    if (!parsed.success) {
      setClientErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setClientErrors({});
    setDismissed(false);
    startTransition(() => {
      formAction(fd);
    });
  };

  if (showSuccess) {
    return (
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl border border-gray-100 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-800">Request Submitted!</h2>
        <p className="mb-6 text-gray-500">
          Thank you for your interest. Our team will contact you shortly to provide your custom quotation.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-30! text-sm font-bold text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7b3e41] focus:ring-offset-2"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl border border-gray-100 bg-white p-6 sm:p-8! shadow-lg">
      <h2 className="mb-6 border-b border-gray-200 pb-4 text-center text-2xl font-bold text-gray-800">
        Request a Cost Estimate
      </h2>
      
      {/* action={formAction} enables progressive enhancement: even without
          JS (e.g. a blocked/hydration-failed client) the form POSTs to the
          server action instead of doing a native GET with query params. The
          onSubmit handler runs first when JS is present. */}
      <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        
        {/* Full Name */}
        <div className="flex flex-col">
          <label htmlFor="fullName" className="mb-1 text-xs font-bold uppercase text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="e.g. Alok Das"
            className={`w-full rounded-md border px-4 py-3 text-gray-900 bg-slate-50 placeholder-gray-400 shadow-sm transition-colors focus:border-[#7b3e41] focus:outline-none focus:ring-2 focus:ring-[#7b3e41] ${
              errors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
            }`}
          />
          <FieldError error={errors.name?.[0]} />
        </div>

        {/* Company */}
        <div className="flex flex-col">
          <label htmlFor="company" className="mb-1 text-xs font-bold uppercase text-gray-700">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="e.g. Industrial Enterprises Pvt Ltd"
            className={`w-full rounded-md border px-4 py-3 text-gray-900 bg-slate-50 placeholder-gray-400 shadow-sm transition-colors focus:border-[#7b3e41] focus:outline-none focus:ring-2 focus:ring-[#7b3e41] ${
              errors.company ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
            }`}
          />
          <FieldError error={errors.company?.[0]} />
        </div>

        {/* Email Address */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 text-xs font-bold uppercase text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@company.com"
            className={`w-full rounded-md border px-4 py-3 text-gray-900 bg-slate-50 placeholder-gray-400 shadow-sm transition-colors focus:border-[#7b3e41] focus:outline-none focus:ring-2 focus:ring-[#7b3e41] ${
              errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
            }`}
          />
          <FieldError error={errors.email?.[0]} />
        </div>

        {/* GST Number */}
        <div className="flex flex-col">
          <label htmlFor="gstNumber" className="mb-1 text-xs font-bold uppercase text-gray-700">
            GST Number <span className="text-red-500">*</span>
          </label>
          <input
            id="gstNumber"
            name="gstNumber"
            maxLength={15}
            placeholder="e.g. 19ABCDE1234F1Z5"
            className={`w-full uppercase rounded-md border px-4 py-3 text-gray-900 bg-slate-50 placeholder-gray-400 shadow-sm transition-colors focus:border-[#7b3e41] focus:outline-none focus:ring-2 focus:ring-[#7b3e41] ${
              errors.gst ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
            }`}
          />
          {errors.gst ? (
            <FieldError error={errors.gst?.[0]} />
          ) : (
            <p className="mt-1 text-xs text-gray-500">15-character GSTIN, e.g. 19ABCDE1234F1Z5</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-[#7b3e41] px-4 py-3 text-sm font-bold text-white shadow-sm transition duration-150 ease-in-out hover:bg-[#5a2c2f] focus:outline-none focus:ring-2 focus:ring-[#7b3e41] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Request</span>
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}