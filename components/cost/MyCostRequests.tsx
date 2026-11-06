import { prisma } from '@/lib/prisma';
import { costItemLines } from '@/lib/schemas/cost';
import PayButton from './PayButton';
import { canPayOnline, formatRupees } from '@/lib/razorpay';

/**
 * "My Requests" — the signed-in USER's own cost submissions, shown on the
 * /cost page beneath the submission form. Normal users only ever see their
 * own rows here; admins/developers see everything on /admin/cost-requests.
 */

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

export default async function MyCostRequests({ userId }: { userId: string }) {
  // Only the current user's requests.
  const requests = await prisma.costRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  if (requests.length === 0) return null;

  return (
    <div className="w-full max-w-4xl">
      <h2 className="mb-4 text-2xl font-bold text-[#1e293b]">My Requests</h2>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">GSTIN</th>
              <th className="px-4 py-3 font-semibold">Items</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Submitted</th>
              <th className="px-4 py-3 font-semibold">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{req.company}</td>
                <td className="px-4 py-3 font-mono text-gray-600">{req.gst}</td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {costItemLines(req.items).map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_BADGE[req.status] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(req.createdAt)}</td>
                <td className="px-4 py-3">
                  {req.status === 'QUOTED' && canPayOnline(req.quotedAmount) ? (
                    <PayButton costRequestId={req.id} amountPaise={req.quotedAmount} />
                  ) : req.status === 'QUOTED' && req.quotedAmount ? (
                    <span className="text-xs text-gray-600">
                      Quoted {formatRupees(req.quotedAmount)}. Our team will send the quotation by email.
                    </span>
                  ) : req.status === 'PAID' ? (
                    <span className="text-xs text-gray-600">
                      Paid {formatRupees(req.quotedAmount ?? 0)}
                      {req.paidAt && ` on ${formatDate(req.paidAt)}`}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
