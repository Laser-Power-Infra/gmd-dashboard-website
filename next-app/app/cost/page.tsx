import type { Metadata } from 'next';
import CostForm from '@/components/cost/CostForm';

export const metadata: Metadata = {
  title: 'Request a Cost Estimate',
  description:
    'Request a tailored cost quotation for our high-performance valves and accessories.',
  icons: {
    icon: '/uploads/2025/04/header-final-logo.png',
  },
};

export default function CostPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f3f5f8] px-4 py-12">
      <div className="w-full max-w-4xl flex items-center justify-center flex-col gap-10">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex items-center rounded-full bg-gray-200 px-5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-700">
              <span className="mx-3 h-0.5 w-10 bg-orange-500" />
              VALUE ENGINEERING EXCELLENCE
              <span className="mx-3 h-0.5 w-10 bg-orange-500" />
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold text-[#1e293b] md:text-5xl">
            Request a Cost Estimate
          </h1>

          <p className="mx-auto max-w-2xl text-base text-[#64748b] md:text-lg">
            Share your details below and our sales team will prepare a custom cost quotation for
            your valve and accessory requirements.
          </p>
        </div>

        {/* Form Card */}
        <CostForm />
        
      </div>
    </section>
  );
}