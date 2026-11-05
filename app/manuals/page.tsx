import type { Metadata } from 'next';
import ManualsCatalogPage from '@/components/pages/ManualsCatalogPage';

export const metadata: Metadata = {
  title: 'Valve Installation and Maintenance Manuals',
  description:
    'Download installation, operation, maintenance and warranty manuals for butterfly, sluice, air release, check, globe, ball and safety relief valves.',
  alternates: { canonical: '/manuals' },
};

export default function Page() {
  return <ManualsCatalogPage />;
}
