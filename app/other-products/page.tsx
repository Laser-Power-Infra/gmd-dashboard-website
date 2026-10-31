import type { Metadata } from 'next';
import OtherProductsPage from '@/components/pages/OtherProductsPage';

export const metadata: Metadata = {
  title: 'Valve Accessories and Pipeline Products',
  description:
    'Dismantling joints, strainers, flanges, actuators, positioners, gaskets, gauges and valve position indicators for industrial pipelines.',
  alternates: { canonical: '/other-products' },
};

export default function Page() {
  return <OtherProductsPage />;
}
