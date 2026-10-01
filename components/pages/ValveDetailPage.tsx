'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Valve, OtherProduct, DetailValve } from '@/types';
import { valvesData } from '@/data/valves';
import { valveDetailsData } from '@/data/valveDetails';
import { otherProducts } from '@/data/otherProducts';
import { normalizeName } from '@/lib/valveName';
import { useQuote } from '@/components/layout/QuoteProvider';
import ValveInquiryForm from '@/components/valves/ValveInquiryForm';

export default function ValveDetailPage({ valveId, imageMap = {} }: { valveId: string; imageMap?: Record<string, string> }) {
  const router = useRouter();
  const { openQuote } = useQuote();

  // Find current valve by ID, fallback to butterfly if not found
  const valve = useMemo<DetailValve>(() => {
    const rawValve = (
      valvesData.find((v) => v.id === valveId) ||
      otherProducts.find((p) => p.id === valveId) ||
      valvesData[0]
    ) as Valve & Partial<OtherProduct>;

    // normalize valve object so ValveDetailPage can render accessories too
    return {
      id: rawValve.id,
      name: rawValve.name,
      category: rawValve.category || 'Other Accessories',
      image: rawValve.image,
      size: rawValve.size || 'Various',
      standards: rawValve.standards || [],
      moc: rawValve.moc || [],
      pressure: rawValve.pressure || [],
      operation: rawValve.operation?.length ? rawValve.operation : ['Manual'],
      endConnection: rawValve.endConnection || 'N/A',
      application: rawValve.application || '',
      description: rawValve.description || (rawValve.usage ? rawValve.usage.join(' ') : ''),
      features: rawValve.features || [],
      usage: rawValve.usage,
    };
  }, [valveId]);

  const customDetail = valveDetailsData[valve.id];

  // Scroll to top when switching valve
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [valve.id]);

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('inquiry-form-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="valve-detail-page-wrapper">
      {/* Top Breadcrumb Navigation */}
      <div className="detail-breadcrumb-bar">
        <div className="container">
          <div className="breadcrumb-nav">
            <button className="back-catalog-btn" onClick={() => router.push('/valves')}>
              <i className="fas fa-arrow-left"></i> Back to Valve Catalog
            </button>
            <div className="breadcrumb-links">
              <span>Home</span>
              <i className="fas fa-chevron-right separator"></i>
              <span className="link-hover" onClick={() => router.push('/valves')}>Valves Catalog</span>
              <i className="fas fa-chevron-right separator"></i>
              <span className="current-page">{valve.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Valve Overview & Graphic */}
      <section className="detail-hero-section">
        <div className="container">
          <div className="detail-hero-grid">
            {/* Left Column: Valve Product Image */}
            <div className="detail-hero-graphic-col">
              <div className="detail-valve-image-container">
                {imageMap[normalizeName(valve.name)] || valve.image ? (
                  <img
                    src={imageMap[normalizeName(valve.name)] || valve.image}
                    alt={valve.name}
                    className="detail-valve-img"
                  />
                ) : (
                  <div className="detail-valve-img-placeholder">
                    <i className="fas fa-image placeholder-icon"></i>
                    <span>Image coming soon</span>
                  </div>
                )}
              </div>
              <div className="datasheet-downloads-row">
                <a href="#inquiry-form-container" className="download-btn-v2" onClick={scrollToForm}>
                  <i className="fas fa-file-pdf icon"></i> Request Datasheet PDF
                </a>
                <a href="#inquiry-form-container" className="download-btn-v2 border-only" onClick={scrollToForm}>
                  <i className="fas fa-file-alt icon"></i> Request CAD Drawing
                </a>
              </div>
            </div>

            {/* Right Column: Valve Basic Info */}
            <div className="detail-hero-info-col">
              <span className="detail-badge">{valve.category}</span>
              <h1 className="detail-title">{valve.name}</h1>

              <p className="detail-desc">{valve.description}</p>

              {customDetail && (
                <div className="custom-intro-box">
                  <h3>Introduction</h3>
                  <p>{customDetail.introduction}</p>
                </div>
              )}

              <div className="detail-key-features">
                <h3>Key Features</h3>
                <ul>
                  {valve.features.map((feature, idx) => (
                    <li key={idx}>
                      <i className="fas fa-check-circle check-icon"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="detail-quick-cta-row">
                <a href="#inquiry-form-container" className="btn-primary-detail" onClick={scrollToForm}>
                  <i className="fas fa-envelope"></i> Request Quick Quote
                </a>
                <button className="btn-secondary-detail" onClick={openQuote}>
                  <i className="fas fa-phone-alt"></i> Speak to Sales Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications Tables */}
      <section className="detail-specs-section">
        <div className="container">
          <h2 className="section-heading-v2">Technical Specifications</h2>
          <div className="specs-table-wrapper">
            <table className="specs-table">
              <thead>
                <tr>
                  <th>Design Feature</th>
                  <th>Standard Parameters / Range Options</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Nominal Size Range</strong></td>
                  <td>{valve.size}</td>
                </tr>
                <tr>
                  <td><strong>Manufacturing Standards</strong></td>
                  <td>{valve.standards.join(', ')}</td>
                </tr>
                <tr>
                  <td><strong>Material of Construction (MOC)</strong></td>
                  <td>
                    <ul className="table-inline-list">
                      {valve.moc.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td><strong>Pressure Ratings</strong></td>
                  <td>{valve.pressure.join(' / ')}</td>
                </tr>
                <tr>
                  <td><strong>Modes of Operation</strong></td>
                  <td>{valve.operation.join(', ')}</td>
                </tr>
                <tr>
                  <td><strong>End Connections</strong></td>
                  <td>{valve.endConnection}</td>
                </tr>
                <tr>
                  <td><strong>Application Media</strong></td>
                  <td>{valve.application}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Custom Valve Sections (Applications and Types) */}
      {customDetail ? (
        <>
          {/* Applications Grid */}
          {customDetail.applications && customDetail.applications.length > 0 && (
            <section className="butterfly-custom-section grey-bg">
              <div className="container">
                <h2 className="section-heading-v2">Application &amp; Usage of {valve.name}</h2>
                <div className="butterfly-app-grid">
                  {customDetail.applications.map((app, idx) => (
                    <div className="butterfly-app-card" key={idx}>
                      <div className="app-card-icon-num">{app.num || idx + 1}</div>
                      <h4>{app.title}</h4>
                      <p>{app.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Custom Subtype Sections (e.g. Connection Type, Disc Design) */}
          {customDetail.sections &&
            customDetail.sections.map((sec, secIdx) => (
              <section
                className={`butterfly-custom-section ${secIdx % 2 === 1 ? 'grey-bg' : ''}`}
                key={secIdx}
              >
                <div className="container">
                  <h2 className="section-heading-v2">{sec.title}</h2>
                  <div className={`butterfly-type-grid ${sec.gridClass || 'col-3'}`}>
                    {sec.cards.map((card, cardIdx) => (
                      <div className="butterfly-type-card" key={cardIdx}>
                        {card.image && (
                          <div className="type-card-img-wrapper">
                            <img src={card.image} alt={card.title} />
                          </div>
                        )}
                        <div className="type-card-content">
                          <h4>{card.title}</h4>
                          <p>{card.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}

          {/* Certificates & Inspection (Common for all) */}
          <section className="detail-applications-section">
            <div className="container">
              <div className="app-grid">
                <div className="app-content-box">
                  <h2 className="section-heading-v2">Certificates &amp; Inspection</h2>
                  <p>
                    All valves are subjected to rigorous hydrostatic shell and seat pressure testing in accordance with standard codes (e.g., API 598 / IS 14846) prior to delivery.
                  </p>
                  <ul className="inspections-list">
                    <li><i className="fas fa-microscope inspection-check"></i> Physical dimension and wall-thickness checks</li>
                    <li><i className="fas fa-shield-alt inspection-check"></i> Hydrostatic seat and shell test validation</li>
                    <li><i className="fas fa-certificate inspection-check"></i> Manufacturer Test Certificate (MTC) and third-party inspection (SGS, TUV, RINA, IRS etc.) available</li>
                    <li><i className="fas fa-paint-roller inspection-check"></i> Epoxy powder coating inspection (DFT test)</li>
                  </ul>
                </div>

                <div className="app-content-box">
                  <h2 className="section-heading-v2">Quality Assurance</h2>
                  <p>
                    GM Dalui &amp; Sons Pvt. Ltd. is an ISO 9001:2015 certified manufacturer. Our commitment to safety, reliable sealing, and long service life is backed by rigorous material inspection, ultrasonic wall thickness checks, and design calculations.
                  </p>
                  <p>
                    We customize flow control systems to meet specific requirements for municipal waterworks, agricultural pumping wells, chemical distribution loops, and thermal power plant grids.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Default Industries Served for other valves */
        <section className="detail-applications-section">
          <div className="container">
            <div className="app-grid">
              <div className="app-content-box">
                <h2 className="section-heading-v2">Industries Served</h2>
                <p>
                  Our industrial valves are field-proven and qualified for deployment across rigorous industrial sectors requiring high durability and precise fluid dynamics.
                </p>
                <div className="industries-icons-grid">
                  <div className="industry-icon-card">
                    <i className="fas fa-water icon"></i>
                    <span>Water Works</span>
                  </div>
                  <div className="industry-icon-card">
                    <i className="fas fa-fire icon"></i>
                    <span>Power Plants</span>
                  </div>
                  <div className="industry-icon-card">
                    <i className="fas fa-oil-can icon"></i>
                    <span>Petrochemicals</span>
                  </div>
                  <div className="industry-icon-card">
                    <i className="fas fa-seedling icon"></i>
                    <span>Irrigation</span>
                  </div>
                </div>
              </div>

              <div className="app-content-box">
                <h2 className="section-heading-v2">Certificates &amp; Inspection</h2>
                <p>
                  All valves are subjected to rigorous hydrostatic shell and seat pressure testing in accordance with standard codes (e.g., API 598 / IS 14846) prior to delivery.
                </p>
                <ul className="inspections-list">
                  <li><i className="fas fa-microscope inspection-check"></i> Physical dimension and wall-thickness checks</li>
                  <li><i className="fas fa-shield-alt inspection-check"></i> Hydrostatic seat and shell test validation</li>
                  <li><i className="fas fa-certificate inspection-check"></i> Manufacturer Test Certificate (MTC) and third-party inspection (SGS, TUV, RINA, IRS etc.) available</li>
                  <li><i className="fas fa-paint-roller inspection-check"></i> Epoxy powder coating inspection (DFT test)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Inquiry Form */}
      <section id="inquiry-form-container" className="detail-inquiry-section">
        <div className="container">
          <div className="inquiry-card-wrapper">
            <div className="inquiry-card-sidebar">
              <h3>Get a Technical Proposal</h3>
              <p>
                Provide your requirements below, and our engineering department will formulate a customized technical and commercial proposal within 24 hours.
              </p>
              <div className="sidebar-contacts">
                <div className="contact-item-v2">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <span>Sales Email</span>
                    <strong>info@gmdalui.co.in</strong>
                  </div>
                </div>
                <div className="contact-item-v2">
                  <i className="fas fa-building"></i>
                  <div>
                    <span>Headquarters</span>
                    <strong>Kolkata, WB, India</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="inquiry-card-form">
              <ValveInquiryForm key={valve.id} valve={valve} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
