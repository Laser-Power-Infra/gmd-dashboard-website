import type { Metadata } from 'next';
import IndustryPage from '@/components/pages/IndustryPage';

export const metadata: Metadata = {
  title: 'Valve Types, Sizes and Standards Table',
  description:
    'Master reference table of every valve type we manufacture with size range, material of construction and the Indian, British and AWWA standards met.',
  alternates: { canonical: '/usages' },
};

export default function Page() {
  return <IndustryPage />;
}
