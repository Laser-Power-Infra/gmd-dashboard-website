'use client';

import { useActionState } from 'react';
import { setQuoteAction } from '@/app/admin/cost-requests/actions';

/** Per-row quote input on /admin/cost-requests (ADMIN/DEVELOPER). */
export default function QuoteAmountForm({ id, quotedPaise }: { id: string; quotedPaise: number | null }) {
  const [state, formAction, isPending] = useActionState(setQuoteAction, { ok: false });

  return (
    <form action={formAction} className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <input type="hidden" name="id" value={id} />
        <span className="text-slate-500">₹</span>
        <input
          type="number"
          name="amount"
          min="0.01"
          step="0.01"
          required
          defaultValue={quotedPaise == null ? '' : quotedPaise / 100}
          aria-label="Quote amount in rupees"
          className="w-28 rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-[#7b3e41] focus:outline-none focus:ring-2 focus:ring-[#7b3e41]"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-[#7b3e41] px-3 py-1 text-xs font-semibold text-white disabled:opacity-60"
        >
          {isPending ? 'Saving' : 'Save'}
        </button>
      </div>
      {state.message && (
        <span className={`text-xs ${state.ok ? 'text-green-600' : 'text-red-600'}`}>{state.message}</span>
      )}
    </form>
  );
}
