import type { Metadata } from 'next';
import AmcPage from '@/components/pages/AmcPage';

export const metadata: Metadata = {
  title: 'Annual Maintenance Contract for Valves',
  description:
    'Annual Maintenance Contract covering scheduled inspection, servicing and preventive maintenance of industrial valves across your plant or pipeline.',
  alternates: { canonical: '/amc' },
};

export default function Page() {
  return <AmcPage />;
}
