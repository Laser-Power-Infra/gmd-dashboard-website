import type { Metadata } from 'next';
import SafetyPlanPage from '@/components/pages/SafetyPlanPage';

export const metadata: Metadata = {
  title: 'Safety, Health and Quality Plan',
  description:
    'The safety, health, environment and quality plan governing our valve foundry, machine shop, assembly, testing and site installation work.',
  alternates: { canonical: '/safety-plan' },
};

export default function Page() {
  return <SafetyPlanPage />;
}
