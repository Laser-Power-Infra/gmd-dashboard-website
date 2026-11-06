import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import { costItemLines } from '@/lib/schemas/cost';
import QuoteAmountForm from '@/components/admin/QuoteAmountForm';
import { canPayOnline, formatRupees } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Cost Requests',
  robots: { index: false, follow: false },
};

const STATUS_BADGE: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-amber-100 text-amber-700',
  QUOTED: 'bg-green-100 text-green-700',
  PAID: 'bg-emerald-600 text-white',
  CLOSED: 'bg-slate-200 text-slate-600',
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function ItemList({ items }: { items: unknown }) {
  const lines = costItemLines(items);
  if (lines.length === 0) return <span className="text-xs italic text-red-500">No items</span>;
  return (
    <ul className="list-disc space-y-0.5 pl-4 text-xs">
      {lines.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );
}

export default async function CostRequestsPage() {
  const requests = await prisma.costRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cost Requests</h1>
          <p className="text-sm text-slate-500">Submissions from the /cost page</p>
        </div>
        <span className="rounded-full bg-[#8a4f50]/10 px-4 py-1.5 text-sm font-bold text-[#8a4f50]">
          {requests.length} total
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center">
          <i className="fas fa-inbox mb-4 text-4xl text-slate-300"></i>
          <p className="text-slate-500">No cost requests yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">GSTIN</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Submitted</th>
                <th className="px-4 py-3 font-semibold">Quote / Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{req.name}</td>
                  <td className="px-4 py-3 text-slate-600">{req.company}</td>
                  <td className="px-4 py-3 text-slate-600">{req.email}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{req.gst}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <ItemList items={req.items} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_BADGE[req.status] ?? 'bg-slate-100 text-slate-600'}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(req.createdAt)}</td>
                  <td className="px-4 py-3">
                    {req.status === 'PAID' ? (
                      <div className="text-xs text-slate-600">
                        <div>Paid {formatRupees(req.quotedAmount ?? 0)}</div>
                        <div className="font-mono text-slate-500">{req.razorpayPaymentId}</div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <QuoteAmountForm id={req.id} quotedPaise={req.quotedAmount} />
                        {req.status === 'QUOTED' && req.quotedAmount && (
                          <span className="text-xs text-slate-500">
                            {canPayOnline(req.quotedAmount) ? 'Customer can pay online' : 'Over 20 lakh: send quotation by email'}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
