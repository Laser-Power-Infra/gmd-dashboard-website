'use client';

import { useState } from 'react';
import { industryData } from '@/data/industry';
import { useQuote } from '@/components/layout/QuoteProvider';
import ValveCarouselSection from '@/components/industry/ValveCarouselSection';

export default function IndustryPage() {
  const { openQuote } = useQuote();
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="industry-page-wrapper">
      <section className="industry-hero">
        <div className="container">
          <h1 className="industry-hero-title">Master Table of All Valve Types</h1>
          <p className="industry-hero-subtitle">
            Comprehensive reference for valve categories, sizes, materials, and international standards.
          </p>
        </div>
      </section>

      <section className="industry-content-section">
        <div className="container">
          <div className="table-accordion-wrapper">
            {industryData.map((section, idx) => (
              <div className={`accordion-item ${openSections[idx] ? 'open' : ''}`} key={idx}>
                <div className="accordion-header" onClick={() => toggleSection(idx)}>
                  <h2>{section.category}</h2>
                  <i className={`fas fa-chevron-${openSections[idx] ? 'up' : 'down'}`}></i>
                </div>

                {openSections[idx] && (
                  <div className="accordion-body">
                    {section.isImageCards ? (
                      <ValveCarouselSection section={section} />
                    ) : (
                      <div className="table-responsive">
                        <table className="industry-data-table">
                          <thead>
                            <tr>
                              {section.headers.map((header, hIdx) => (
                                <th key={hIdx}>{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {(row as unknown as string[]).map((cell, cIdx) => (
                                  <td key={cIdx}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="industry-cta">
            <p>Need more information about a specific valve type or standard?</p>
            <button className="btn-primary" onClick={openQuote}>
              Request a Technical Proposal <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
