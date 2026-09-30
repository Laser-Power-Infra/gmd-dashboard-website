import { Suspense } from 'react';
import type { Metadata } from 'next';
import EngineeringDataPage from '@/components/technical/EngineeringDataPage';

export const metadata: Metadata = {
  title: 'Engineering Data',
  description:
    'Live engineering tables for raw material, bills of material, contract review, supply history, BIS status and physical stock.',
  icons: {
    icon: '/uploads/2025/04/header-final-logo.png',
  },
};

/**
 * /engineering-data — the six GMD tables, one per subtab.
 *
 * The page component reads `?tab=` through `useSearchParams`, which opts the
 * subtree out of static rendering, so it is wrapped in Suspense here. Everything
 * inside renders the same on the server and the client.
 */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <EngineeringDataPage />
    </Suspense>
  );
}
