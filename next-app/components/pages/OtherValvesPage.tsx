'use client';

import { useState } from 'react';
import { useQuote } from '@/components/layout/QuoteProvider';

const otherValves = [
  {
    id: 'foot-valve',
    name: 'Foot Valve',
    image: '/uploads/2025/05/others-valve.jpg',
    features: 'A mesh strainer and spring-loaded mechanism.',
    application: 'Used at the inlet of a pump to maintain prime and prevent backflow, commonly used in well systems.',
    sizeRange: '26-600',
  },
  {
    id: 'lift-check-valve',
    name: 'Lift',
    image: '/uploads/2025/05/pn16-lift-check-valve20446160388.webp',
    features: 'Feature a movable disc or ball for precise one-way flow control.',
    application: 'Using high-pressure applications like steam and gas system.',
    sizeRange: '50-1200',
  },
  {
    id: 'ball-check-valve',
    name: 'Ball',
    image: '/uploads/2025/05/threaded-ball-check-valve-500x500-1.webp',
    features: 'Precision-engineered spherical ball for reliable one-way flow control.',
    application: 'Commonly used in water and waste water systems, and pump discharge lines.',
    sizeRange: '25-1200',
  },
];

export default function OtherValvesPage() {
  const { openQuote } = useQuote();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredValves = otherValves.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.features.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.application.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="other-valves-page-wrapper">
      {/* Title block */}
      <section className="types-heading-section">
        <div className="container">
          <h2 className="types-section-title">Types Of Other Valves</h2>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="other-valves-filter-bar">
        <div className="container">
          <div className="search-box-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search other valves by name, features, or application..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              id="other-valves-search-input"
            />
          </div>
        </div>
      </section>

      {/* Grid Section with 5 columns layout */}
      <section className="other-valves-grid-section-new">
        <div className="container">
          {filteredValves.map((v) => (
            <div className="other-valve-row-grid" key={v.id}>
              {/* Card 1: Type of Valve */}
              <div className="other-valve-grid-card">
                <div className="grid-card-badge">Type of Valve</div>
                <div className="grid-card-content valve-name-bold">{v.name}</div>
              </div>

              {/* Card 2: Illustration */}
              <div className="other-valve-grid-card">
                <div className="grid-card-badge">Illustration</div>
                <div className="grid-card-content img-content-box">
                  <img src={v.image} alt={v.name} className="grid-card-img" />
                </div>
              </div>

              {/* Card 3: Features */}
              <div className="other-valve-grid-card">
                <div className="grid-card-badge">Features</div>
                <div className="grid-card-content desc-text">{v.features}</div>
              </div>

              {/* Card 4: Application */}
              <div className="other-valve-grid-card">
                <div className="grid-card-badge">Application</div>
                <div className="grid-card-content desc-text">{v.application}</div>
              </div>

              {/* Card 5: Size Range (mm) */}
              <div className="other-valve-grid-card">
                <div className="grid-card-badge">Size Range (mm)</div>
                <div className="grid-card-content size-range-bold">{v.sizeRange}</div>
              </div>
            </div>
          ))}
          {filteredValves.length === 0 && (
            <p className="no-results-text">No valves match your search criteria.</p>
          )}
        </div>
      </section>

      {/* Brand Statement Bar */}
      <section className="brand-statement-bar">
        <div className="container">
          <div className="brand-statement-card">
            <p>
              At <strong>GM Dalui &amp; Sons Pvt. Ltd.</strong> our valves are delivered in an extensive variety of materials and compositions and we can custom produce your design.
            </p>
            <button className="btn-brand-quote-new" onClick={openQuote}>
              Request Technical Proposal <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
