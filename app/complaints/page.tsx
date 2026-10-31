import type { Metadata } from 'next';
import ComplaintsPage from '@/components/pages/ComplaintsPage';

export const metadata: Metadata = {
  title: 'Register a Valve Complaint',
  description:
    'Report a problem with a GM Dalui valve or order. Our support team logs every complaint and responds with a corrective action plan.',
  alternates: { canonical: '/complaints' },
};

export default function Page() {
  return <ComplaintsPage />;
}
