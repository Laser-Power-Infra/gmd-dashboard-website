import type { Metadata } from 'next';
import CmcPage from '@/components/pages/CmcPage';

export const metadata: Metadata = {
  title: 'Comprehensive Maintenance Contract',
  description:
    'Comprehensive Maintenance Contract for industrial valves, covering labour, spare parts, breakdown repair and scheduled preventive maintenance.',
  alternates: { canonical: '/cmc' },
};

export default function Page() {
  return <CmcPage />;
}
