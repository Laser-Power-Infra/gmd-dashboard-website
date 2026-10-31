import type { Metadata } from 'next';
import ApplyAmcPage from '@/components/pages/ApplyAmcPage';

export const metadata: Metadata = {
  title: 'Apply for a Valve AMC',
  description:
    'Apply for an Annual Maintenance Contract on your GM Dalui valves. Tell us your site, valve types and quantities and we will prepare a quotation.',
  alternates: { canonical: '/apply-amc' },
};

export default function Page() {
  return <ApplyAmcPage />;
}
