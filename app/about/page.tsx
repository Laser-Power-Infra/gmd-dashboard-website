import type { Metadata } from 'next';
import AboutPage from '@/components/pages/AboutPage';

export const metadata: Metadata = {
  title: 'About Our Valve Manufacturing Company',
  description:
    'GM Dalui & Sons Pvt. Ltd. is an ISO 9001:2015 certified industrial valve manufacturer in Kolkata serving water, power, oil and process industries.',
  alternates: { canonical: '/about' },
};

export default function Page() {
  return <AboutPage />;
}
