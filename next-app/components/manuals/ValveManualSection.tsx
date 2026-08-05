'use client';

import { useEffect, useRef } from 'react';
import { manualsData } from '@/data/manuals';
import type { Manual } from '@/types';
import ModernManualLayout from './ModernManualLayout';
import PrintableManual from './PrintableManual';

// Shape of legacy "classic" manuals (none exist in the current dataset, kept for parity)
interface ClassicManual {
  title: string;
  isModern: boolean;
  transportation: {
    image1?: string;
    image2?: string;
    items: string[];
    storageItems: string[];
  };
  installation: {
    preInstallation: string[];
    guidelines: string[];
    image2?: string;
  };
  troubleshooting: { num: number; issue: string; cause: string; solution: string; image?: string }[];
  maintenance: { schedule: { type: string; frequency: string }[] };
  safety: string[] | { items: string[]; image?: string } | null;
}

export default function ValveManualSection({ valveId }: { valveId: string }) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.15 }
    );

    const rows = document.querySelectorAll('.manual-row');
    rows.forEach((row) => {
      if (observerRef.current) observerRef.current.observe(row);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [valveId]);

  const data: Manual | undefined = manualsData[valveId];

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

  if (data.isModern) {
    return <ModernManualLayout data={data} />;
  }

  // Legacy classic layout (kept for parity; no classic manuals in current data)
  const classic = data as unknown as ClassicManual;

  return (
    <div className="manual-page-wrapper">
      <section className="manual-content-body">
        <div className="container">
          <div
            className="manual-section-title-container"
            style={{ marginBottom: '60px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60px' }}
          >
            <h1 className="manual-title-text" style={{ fontSize: '2.5rem', margin: '0', padding: '0 180px', textAlign: 'center' }}>
              {classic.title}
            </h1>
            <div className="no-print" style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>
              <button
                onClick={() => window.print()}
                className="btn-download-qa"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#fb923c',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: '0 4px 10px rgba(251, 146, 60, 0.3)',
                }}
              >
                <i className="fas fa-file-pdf"></i> Download PDF
              </button>
            </div>
          </div>

          {/* Section 1: Transportation and Storage */}
          <div className="manual-section">
            <h2 className="section-main-heading">1. Transportation And Storage</h2>

            <div className="manual-row alternating-row">
              <div className="manual-image-col">
                <div className="manual-img-container">
                  <img
                    src={classic.transportation.image1 || '/uploads/2025/06/logistics-transportation-container-cargo-ship-cargo-plane-with-working-crane-bridge-shipyard-sunrise-logistic-import-export-transport-industry-background-ai-generative-scaled.jpg'}
                    alt="Transportation"
                    className="manual-asset-img"
                  />
                  <div className="img-frame-accent"></div>
                </div>
              </div>
              <div className="manual-text-col">
                <h3 className="section-sub-heading">1.1 Transportation</h3>
                <ul className="manual-bullet-list">
                  {classic.transportation.items.map((item, idx) => (
                    <li key={idx}>
                      <i className="fas fa-chevron-right list-arrow"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="manual-row alternating-row reverse-row">
              <div className="manual-text-col">
                <h3 className="section-sub-heading">1.2 Storage</h3>
                <ul className="manual-bullet-list">
                  {classic.transportation.storageItems.map((item, idx) => (
                    <li key={idx}>
                      <i className="fas fa-chevron-right list-arrow"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="manual-image-col">
                <div className="manual-img-container">
                  <img
                    src={classic.transportation.image2 || '/uploads/2025/06/54a382b8-fa1e-4110-b69d-c67f142bbf5c.jpg'}
                    alt="Storage"
                    className="manual-asset-img"
                  />
                  <div className="img-frame-accent"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Installation */}
          <div className="manual-section">
            <h2 className="section-main-heading">2. Installation</h2>

            <div className="manual-row alternating-row">
              <div className="manual-image-col">
                <div className="manual-img-container">
                  <img
                    src="/uploads/2025/06/male-asian-engineer-professional-having-discussion-standing-by-machine-factory-two-asian-coworker-brainstorm-explaining-solves-process-curcuit-mother-board-machine-scaled.jpg"
                    alt="Pre-Installation Checks"
                    className="manual-asset-img"
                  />
                  <div className="img-frame-accent"></div>
                </div>
              </div>
              <div className="manual-text-col">
                <h3 className="section-sub-heading">2.1 Pre-Installation Checks</h3>
                <ul className="manual-bullet-list">
                  {classic.installation.preInstallation.map((item, idx) => (
                    <li key={idx}>
                      <i className="fas fa-chevron-right list-arrow"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="manual-row alternating-row reverse-row">
              <div className="manual-text-col">
                <h3 className="section-sub-heading">2.2 Installation Guidelines</h3>
                <ul className="manual-bullet-list">
                  {classic.installation.guidelines.map((item, idx) => (
                    <li key={idx}>
                      <i className="fas fa-chevron-right list-arrow"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="manual-image-col">
                <div className="manual-img-container">
                  <img
                    src={classic.installation.image2 || '/uploads/2025/06/construction-site-inspector-making-report-scaled.jpg'}
                    alt="Installation Guidelines"
                    className="manual-asset-img"
                  />
                  <div className="img-frame-accent"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Troubleshooting */}
          <div className="manual-section">
            <h2 className="section-main-heading">3. Troubleshooting</h2>
            <div className="troubleshooting-alternating-list">
              {classic.troubleshooting.map((item, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div className={`manual-row alternating-row ${!isEven ? 'reverse-row' : ''}`} key={idx} style={{ marginBottom: '40px' }}>
                    <div className="manual-image-col">
                      <div className="manual-img-container">
                        <img src={item.image || '/uploads/2025/06/view-male-engineer-work-engineers-day-celebration-scaled.jpg'} alt={item.issue} className="manual-asset-img" />
                        <div className="img-frame-accent"></div>
                      </div>
                    </div>
                    <div className="manual-text-col">
                      <div className="troubleshoot-row-card">
                        <div className="troubleshoot-card-badge">
                          <i className="fas fa-exclamation-triangle troubleshoot-icon"></i>
                          <span>Issue #{item.num}</span>
                        </div>
                        <h3 className="troubleshoot-heading">{item.issue}</h3>
                        <div className="troubleshoot-details">
                          <p><strong>Possible Cause:</strong> {item.cause}</p>
                          <p><strong>Solution:</strong> {item.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Maintenance */}
          <div className="manual-section">
            <h2 className="section-main-heading">4. Maintenance</h2>
            <div className="manual-row alternating-row reverse-row">
              <div className="manual-text-col">
                <h3 className="section-sub-heading">Routine Maintenance Schedule</h3>
                <div className="table-wrapper">
                  <table className="maintenance-table">
                    <thead>
                      <tr>
                        <th>Type of Inspection</th>
                        <th>Recommended Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classic.maintenance.schedule.map((row, idx) => (
                        <tr key={idx}>
                          <td>{row.type}</td>
                          <td>{row.frequency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="manual-image-col">
                <div className="manual-img-container">
                  <img src="/uploads/2025/05/GettyImages-886057348.webp" alt="Routine Maintenance" className="manual-asset-img" />
                  <div className="img-frame-accent"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Safety Production */}
          <div className="manual-section safety-section">
            <div className="manual-row alternating-row reverse-row">
              <div className="manual-text-col">
                <div className="safety-callout-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="safety-badge">
                    <i className="fas fa-shield-alt shield-icon"></i>
                    <h3>Safety Production Guidelines</h3>
                  </div>
                  <ul className="safety-bullet-list">
                    {(Array.isArray(classic.safety) ? classic.safety : (classic.safety?.items || [])).map((item, idx) => (
                      <li key={idx}>
                        <i className="fas fa-exclamation-circle alert-icon"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="manual-image-col">
                <div className="manual-img-container">
                  <img src={classic.safety && !Array.isArray(classic.safety) && classic.safety.image ? classic.safety.image : '/uploads/2025/06/colleagues-with-safety-equipment-working-with-blueprints.jpg'} alt="Safety Production Site" className="manual-asset-img" />
                  <div className="img-frame-accent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PrintableManual data={data} />
    </div>
  );
}
