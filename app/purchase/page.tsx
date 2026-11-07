import { Suspense } from 'react';
import type { Metadata } from 'next';
import Purchase from '@/components/pages/Purchase';
import AuthNavSlot from '@/components/layout/AuthNavSlot';
import { requireAuth } from '@/lib/auth/require-auth';

export const metadata: Metadata = {
  title: 'Request to Purchase Valves',
  description:
    'Build a purchase request for GM Dalui industrial valves and pipeline accessories. Select items, quantities and sizes and send it to our sales desk.',
  alternates: { canonical: '/purchase' },
};

/**
 * /purchase — catalog + purchase request flow. Sign-in required: a submitted
 * list becomes a CostRequest the admin quotes and the customer pays on /cost.
 *
 * The Sign In / Sign Out control is rendered here (inside the purchase hero)
 * rather than in the site header. Purchase is a client component, so the
 * server-rendered AuthNavSlot is passed in as a slot prop, the same pattern the
 * header previously used.
 */
export default async function Page() {
  await requireAuth('/purchase');
  return (
    <Purchase
      authSlot={
        <Suspense fallback={null}>
          <AuthNavSlot variant="desktop" />
        </Suspense>
      }
    />
  );
}