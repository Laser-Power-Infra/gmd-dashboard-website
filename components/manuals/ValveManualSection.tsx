import { manualsData } from '@/data/manuals';
import ModernManualLayout from './ModernManualLayout';

// Server component on purpose: manualsData is ~275KB, so only the one manual
// this page needs is serialised to the client, not the whole map.
export default function ValveManualSection({
  valveId,
  pdfHref,
}: {
  valveId: string;
  pdfHref: string | null;
}) {
  const data = manualsData[valveId];

  if (!data) {
    return (
      <div className="manual-page-wrapper">
        <section className="manual-content-body">
          <div className="container">
            <div className="hero-center-title" style={{ marginBottom: '60px', textAlign: 'center', padding: '60px 0' }}>
              <h1 className="manual-title-text" style={{ fontSize: '2.5rem' }}>Manual Content Coming Soon</h1>
              <p style={{ marginTop: '20px', color: '#666' }}>The manual for this valve is currently being updated.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return <ModernManualLayout data={data} pdfHref={pdfHref} />;
}
