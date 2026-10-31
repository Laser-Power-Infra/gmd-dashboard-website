import type { Metadata } from 'next';
import './globals.css';

// Global component styles (ported from the original Vite app)
import '@/styles/Header.css';
import '@/styles/Hero.css';
import '@/styles/AboutUs.css';
import '@/styles/Services.css';
import '@/styles/Products.css';
import '@/styles/WhyChooseUs.css';
import '@/styles/VisionMission.css';
import '@/styles/Clients.css';
import '@/styles/Footer.css';
import '@/styles/GetQuoteModal.css';
import '@/styles/AboutPage.css';
import '@/styles/ValvesPage.css';
import '@/styles/ValveDetailPage.css';
import '@/styles/ContactPage.css';
import '@/styles/OtherValvesPage.css';
import '@/styles/OtherProductsPage.css';
import '@/styles/IndustryPage.css';
import '@/styles/WarrantyPage.css';
import '@/styles/RiskManagementPage.css';
import '@/styles/ProductIndustryPage.css';
import '@/styles/SafetyPlanPage.css';
import '@/styles/DevelopmentPage.css';
import '@/styles/CmcPage.css';
import '@/styles/AmcPage.css';
import '@/styles/FormPage.css';
import '@/styles/ModernManualLayout.css';
import '@/styles/PrintableManual.css';
import '@/styles/ValveManualSection.css';
import '@/styles/Purchase.css';

import { QuoteProvider } from '@/components/layout/QuoteProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import QuoteModalHost from '@/components/layout/QuoteModalHost';
import AdminNavSlot from '@/components/layout/AdminNavSlot';
import AuthNavSlot from '@/components/layout/AuthNavSlot';
import { Toaster } from 'sonner';
import { Suspense } from 'react';
import JsonLd, {
  SITE_URL,
  SITE_NAME,
  OG_IMAGE,
  organizationJsonLd,
} from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'GM Dalui & Sons | Industrial Valve Manufacturer, Kolkata',
    template: '%s | GM Dalui & Sons',
  },
  description:
    'Industrial valve manufacturer in Kolkata, India. Butterfly, sluice, air release, check, globe, ball, control and pressure relief valves, custom built to your design.',
  icons: {
    icon: '/uploads/2025/04/header-final-logo.webp',
  },
  // No title/description here: Next fills og:title and og:description from each
  // page's own title/description, so leaving them unset keeps shares per-page.
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_IN',
    images: [
      {
        url: OG_IMAGE,
        width: 1199,
        height: 672,
        alt: 'GM Dalui & Sons industrial valves',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <JsonLd data={organizationJsonLd} />
        <QuoteProvider>
          <div className="app-wrapper">
            <Header
              desktopAuthSlot={
                <Suspense fallback={null}>
                  <AuthNavSlot variant="desktop" />
                </Suspense>
              }
              mobileAuthSlot={
                <Suspense fallback={null}>
                  <AuthNavSlot variant="mobile" />
                </Suspense>
              }
              desktopAdminSlot={
                <Suspense fallback={null}>
                  <AdminNavSlot variant="desktop" />
                </Suspense>
              }
              mobileAdminSlot={
                <Suspense fallback={null}>
                  <AdminNavSlot variant="mobile" />
                </Suspense>
              }
            />
            <main>{children}</main>
            <Footer />
            <QuoteModalHost />
            {/* Excel export / clipboard feedback on the Engineering Data tables. */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                classNames: {
                  toast: 'font-sans',
                },
              }}
            />
          </div>
        </QuoteProvider>
      </body>
    </html>
  );
}
