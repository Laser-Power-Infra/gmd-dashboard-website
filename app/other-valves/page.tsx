import type { Metadata } from 'next';
import OtherValvesPage from '@/components/pages/OtherValvesPage';

export const metadata: Metadata = {
  title: 'Other Industrial Valve Types',
  description:
    'Plug, needle, pressure release, zero velocity and ball check valves in cast iron, ductile iron and stainless steel, sizes 25 to 1200 mm.',
  alternates: { canonical: '/other-valves' },
};

export default function Page() {
  return <OtherValvesPage />;
}
