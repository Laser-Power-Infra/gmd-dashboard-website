import { Suspense } from 'react';
import Purchase from '@/components/pages/Purchase';
import AuthNavSlot from '@/components/layout/AuthNavSlot';

/**
 * /purchase — catalog + purchase request flow.
 *
 * The Sign In / Sign Out control is rendered here (inside the purchase hero)
 * rather than in the site header. Purchase is a client component, so the
 * server-rendered AuthNavSlot is passed in as a slot prop, the same pattern the
 * header previously used.
 */
export default function Page() {
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