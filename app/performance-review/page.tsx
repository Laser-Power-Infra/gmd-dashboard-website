import type { Metadata } from 'next';
import PerformanceReviewPage from '@/components/pages/PerformanceReviewPage';

export const metadata: Metadata = {
  title: 'Valve Performance Review',
  description:
    'Submit a performance review of GM Dalui valves in service so we can track field reliability and feed findings back into design and manufacture.',
  alternates: { canonical: '/performance-review' },
};

export default function Page() {
  return <PerformanceReviewPage />;
}
