import type { Metadata } from 'next';
import ProductIndustryPage from '@/components/pages/ProductIndustryPage';

export const metadata: Metadata = {
  title: 'Valve Applications by Industry',
  description:
    'Which GM Dalui valves suit water treatment, power plants, oil and gas, chemical processing, irrigation, HVAC and fire protection pipelines.',
  alternates: { canonical: '/product-industry' },
};

export default function Page() {
  return <ProductIndustryPage />;
}
