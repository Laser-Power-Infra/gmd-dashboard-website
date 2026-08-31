import Link from 'next/link';
import ManualsHero from '@/components/manuals/ManualsHero';
import ManualsFooterPrompt from '@/components/manuals/ManualsFooterPrompt';
import ValveManualSection from '@/components/manuals/ValveManualSection';

export default function ManualDetailPage({ valveId }: { valveId: string }) {
  return (
    <div className="warranty-page-wrapper">
      <ManualsHero />

      {/* Main content body */}
      <section className="warranty-content-section">
        <div className="container">
          <div className="warranty-details-view">
            <div className="details-header-nav">
              <Link href="/manuals" className="btn-back-link">
                <i className="fas fa-arrow-left"></i> Back to Manuals List
              </Link>
            </div>

            <ValveManualSection valveId={valveId} />
          </div>
        </div>
      </section>

      <ManualsFooterPrompt />
    </div>
  );
}
