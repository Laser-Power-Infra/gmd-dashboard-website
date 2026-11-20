import type { Metadata } from 'next';
import Link from 'next/link';

import CostOrders from '@/components/cost/CostOrders';
import EstimateForm from '@/components/cost/EstimateForm';
import s from '@/components/cost/cost.module.css';
import { requireAuth } from '@/lib/auth/require-auth';
import { archivo } from '@/lib/fonts';
import { getCostFormOptions } from '@/lib/lookupOptions';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Quotes and orders',
  description: 'Track your orders and quotes, pay quoted orders online, or request an estimate for a made-to-order valve.',
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ tab?: string | string[] }> };

/**
 * /cost - the signed-in buyer's quotes and orders.
 *
 * Orders: every request this user made (from /purchase or the estimate form),
 * with the next step - pay a quote online (PayButton), wait for a quote, or done.
 * New estimate: a made-to-order request through submitCostRequest; name and
 * email come from the account. `requireAuth` redirects anonymous visitors to
 * /login?next=/cost. Admins see everything at /admin/cost-requests.
 */
export default async function Page({ searchParams }: Props) {
  const session = await requireAuth('/cost');
  const [{ tab }, rows, account, options] = await Promise.all([
    searchParams,
    prisma.costRequest.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, status: true, items: true, quotedAmount: true, createdAt: true, paidAt: true },
    }),
    prisma.user.findUnique({
      where: { id: session.id },
      select: { name: true, email: true, company: true, gstNumber: true },
    }),
    getCostFormOptions(),
  ]);

  // Orders first when there are any; a first-time visitor lands on the form.
  const active = tab === 'new' || (tab !== 'orders' && rows.length === 0) ? 'new' : 'orders';
  const toPay = rows.filter((r) => r.status === 'QUOTED').length;

  return (
    <div className={`${archivo.variable} ${s.page}`}>
      <div className={s.shell}>
        <header className={s.intro}>
          <h1 className={s.title}>Quotes and orders</h1>
          <p className={s.lede}>
            {toPay > 0
              ? `${toPay} ${toPay === 1 ? 'quote is' : 'quotes are'} ready for you.`
              : 'Track what you have ordered, or ask us to estimate a made-to-order valve.'}
          </p>
        </header>

        <nav className={s.tabs} aria-label="Quotes and orders">
          <Link href="/cost?tab=orders" aria-current={active === 'orders' ? 'page' : undefined} className={s.tab}>
            Orders <span className={s.tabCount}>{rows.length}</span>
          </Link>
          <Link href="/cost?tab=new" aria-current={active === 'new' ? 'page' : undefined} className={s.tab}>
            New estimate
          </Link>
        </nav>

        {active === 'orders' ? (
          <CostOrders rows={rows} />
        ) : (
          <EstimateForm
            options={options}
            account={{
              name: account?.name ?? null,
              email: account?.email ?? session.email ?? '',
              company: account?.company ?? null,
              gst: account?.gstNumber ?? null,
            }}
          />
        )}

        <p className={s.aside}>
          Looking for ready stock? <Link href="/purchase">Browse the catalogue</Link>
        </p>
      </div>
    </div>
  );
}
