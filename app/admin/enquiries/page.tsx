import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Enquiries',
  robots: { index: false, follow: false },
};

const STATUS_BADGE: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-amber-100 text-amber-700',
  QUOTED: 'bg-green-100 text-green-700',
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

export default async function EnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Mail is unconfigured, so these rows are the manual chase list.
  const notMailed = enquiries.filter((e) => !e.mailed).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Enquiries</h1>
          <p className="text-sm text-slate-500">
            Quote, valve and purchase submissions from the website
          </p>
        </div>
        <div className="flex items-center gap-2">
          {notMailed > 0 && (
            <span className="rounded-full bg-red-100 px-4 py-1.5 text-sm font-bold text-red-700">
              <i className="fas fa-triangle-exclamation mr-1"></i>
              {notMailed} not emailed
            </span>
          )}
          <span className="rounded-full bg-[#8a4f50]/10 px-4 py-1.5 text-sm font-bold text-[#8a4f50]">
            {enquiries.length} total
          </span>
        </div>
      </div>

      {enquiries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center">
          <i className="fas fa-inbox mb-4 text-4xl text-slate-300"></i>
          <p className="text-slate-500">No enquiries yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Received</th>
                <th className="px-4 py-3 font-semibold">Kind</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Subject</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-slate-50 align-top">
                  <td className="px-4 py-3 text-slate-500">{formatDate(enq.createdAt)}</td>
                  <td className="px-4 py-3 text-slate-600">{enq.kind}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{enq.name}</td>
                  <td className="px-4 py-3 text-slate-600">{enq.company}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <a href={`mailto:${enq.email}`} className="hover:text-[#8a4f50]">
                      {enq.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <a href={`tel:${enq.phone}`} className="hover:text-[#8a4f50]">
                      {enq.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <details>
                      <summary className="cursor-pointer text-slate-800">{enq.subject}</summary>
                      <pre className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 p-3 font-mono text-xs text-slate-600">
                        {enq.details}
                      </pre>
                    </details>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_BADGE[enq.status] ?? 'bg-slate-100 text-slate-600'}`}
                    >
                      {enq.status}
                    </span>
                    {!enq.mailed && (
                      <span className="mt-1 block rounded-full bg-red-100 px-2.5 py-0.5 text-center text-xs font-bold text-red-700">
                        Not emailed
                      </span>
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
