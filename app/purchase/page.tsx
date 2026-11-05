import type { Metadata } from 'next';
import Purchase from '@/components/pages/Purchase';

export const metadata: Metadata = {
  title: 'Request to Purchase Valves',
  description:
    'Build a purchase request for GM Dalui industrial valves and pipeline accessories. Select items, quantities and sizes and send it to our sales desk.',
  alternates: { canonical: '/purchase' },
};

export default function Page() {
  return <Purchase />;
}
