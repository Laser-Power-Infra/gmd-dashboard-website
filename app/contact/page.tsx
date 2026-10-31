import type { Metadata } from 'next';
import ContactPage from '@/components/pages/ContactPage';

export const metadata: Metadata = {
  title: 'Contact Our Kolkata Valve Works',
  description:
    'Contact GM Dalui & Sons at Salt Lake Sector-5, Kolkata 700091. Factories at Kharagpur and Howrah. Call +91 9147176248 or email info@gmdalui.co.in.',
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return <ContactPage />;
}
