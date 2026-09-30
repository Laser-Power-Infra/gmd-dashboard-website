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
import '@/styles/FeedbackPage.css';
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

export const metadata: Metadata = {
  title: 'GM Dalui & Sons Pvt. Ltd. | Value Engineering Excellence',
  description:
    'GM Dalui & Sons Pvt. Ltd. - manufacturers of valves. Our valves are delivered in an extensive variety of materials and compositions and we can custom produce your design.',
  icons: {
    icon: '/uploads/2025/04/header-final-logo.png',
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
