import type { Metadata } from 'next';
import ValvesPage from '@/components/pages/ValvesPage';
import { getValveImageMap } from '@/lib/valveImages';

export const metadata: Metadata = {
  title: 'Industrial Valve Catalogue',
  description:
    'Full catalogue of industrial valves made in Kolkata: butterfly, sluice gate, air release, dual plate check, non-return, globe, ball, PRV and control valves.',
  alternates: { canonical: '/valves' },
};

export default function Page() {
  const imageMap = getValveImageMap();
  return <ValvesPage imageMap={imageMap} />;
}
