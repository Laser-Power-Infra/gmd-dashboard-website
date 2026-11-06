import type { Metadata } from 'next';
import DevelopmentPage from '@/components/pages/DevelopmentPage';

export const metadata: Metadata = {
  title: 'Valve Product Development and R&D',
  description:
    'How GM Dalui & Sons designs, prototypes and tests new valve products, from material selection and casting to flow testing and standards compliance.',
  alternates: { canonical: '/development' },
};

export default function Page() {
  return <DevelopmentPage />;
}
