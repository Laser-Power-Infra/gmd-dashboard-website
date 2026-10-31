import type { Metadata } from 'next';
import RiskManagementPage from '@/components/pages/RiskManagementPage';

export const metadata: Metadata = {
  title: 'Risk Management in Valve Supply',
  description:
    'Our approach to managing technical, supply chain, environmental and safety risk across valve design, manufacture, testing and site commissioning.',
  alternates: { canonical: '/risk-management' },
};

export default function Page() {
  return <RiskManagementPage />;
}
