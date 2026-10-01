'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { valvesData } from '@/data/valves';
import { otherProducts } from '@/data/otherProducts';
import type { Valve } from '@/types';
import { normalizeName } from '@/lib/valveName';
import OtherProductsPage from './OtherProductsPage';

interface CatalogItem extends Valve {
  usage?: string[];
}

const CATEGORIES = ['All', 'Isolation Valves', 'Check Valves', 'Safety & Control Valves', 'Other Accessories'];

const CATEGORY_ORDER = ['Isolation Valves', 'Check Valves', 'Safety & Control Valves', 'Other Accessories'];

const ITEM_ORDER: Record<string, number> = {
  // Safety & Control Valves ordering
  'Tamper Proof / Air Valve': 0,
  'Air Valve (Kinetic/Double Act)': 1,
  'Pressure Reducing Valve (PRV)': 2,
  'Pressure Relief Valve (Safety Valve)': 3,
  'Pressure Release Valve': 4,
  'Control Valve': 5,
  'Flow Control Valve (Plunger Type)': 6,
  'Wide Type Strainer': 7,
  // Other Accessories ordering (must match otherProductsData.js sequence)
  'Single-Flanged Dismantling Joints': 100,
  'Rubber Bellows (Stainless Steel Bellows)': 101,
  'Basket Strainers': 102,
  'Temporary Cone or Tee Strainers': 103,
  'Weld-Neck Flanges': 104,
  'Slip-On Flanges': 105,
  'Blind Flanges': 106,
  'Threaded Flanges': 107,
  'Mechanical Indicators (Lever/Scale type)': 108,
  'Electrical Indicators (Limit switches with LED displays)': 109,
  'Mechanical Switches': 110,
  'Proximity Sensors (Magnetic or Inductive)': 111,
  'Direct-Acting Solenoid Valves': 112,
  'Pilot-Operated Solenoid Valves': 113,
  'Pneumatic Actuators (Air-Operated)': 114,
  'Hydraulic Actuators (Fluid-Operated)': 115,
  'Electric Actuators (Motor-Driven)': 116,
  'Pneumatic Valve Positioners': 117,
  'Electro-Pneumatic Valve Positioners': 118,
  'Spiral Wound Gaskets': 119,
  'Ring-Type Joint (RTJ) Gaskets': 120,
  'Plugged or Capped Connections': 121,
  'Integrated Drain or Vent Valves': 122,
  'Inline Silencers': 123,
  'Exhaust Mufflers': 124,
  'Analog Pressure Gauges': 125,
  'Digital Flowmeters': 126,
  'Fixed-Length Extension Stems': 127,
  'Chain-Operated Extensions': 128,
  'Removable Thermal Insulation Covers': 129,
  'Custom-Molded Insulation Jackets': 130,
  'Padlockable Handles': 131,
  'Interlocking Systems': 132,
  'Analog Feedback Systems (4-20mA signals)': 133,
  'Digital Feedback Systems (HART or Fieldbus)': 134,
  'Y Strainer': 135,
};

export default function ValvesPage({ imageMap = {} }: { imageMap?: Record<string, string> }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const allItems = useMemo<CatalogItem[]>(() => {
    return [
      ...valvesData,
      ...otherProducts.map((product) => ({
        ...product,
        category: 'Other Accessories',
        iconName: '',
        size: product.size || 'Various',
        standards: ['Other Accessories'],
        moc: ['Various'],
        pressure: ['Various'],
        operation: ['Manual / Accessories'],
        endConnection: 'N/A',
        application: '',
        description: '',
        features: [],
      })),
    ];
  }, []);

  const filteredValves = useMemo(() => {
    const matchesSearch = (valve: CatalogItem) => {
      const query = searchTerm.toLowerCase();
      const nameMatch = valve.name.toLowerCase().includes(query);
      const standardMatch = Array.isArray(valve.standards) && valve.standards.some((s) => s.toLowerCase().includes(query));
      const mocMatch = Array.isArray(valve.moc) && valve.moc.some((m) => m.toLowerCase().includes(query));
      const usageMatch = Array.isArray(valve.usage) && valve.usage.some((u) => u.toLowerCase().includes(query));
      return nameMatch || standardMatch || mocMatch || usageMatch;
    };

    return allItems
      .filter((valve) => {
        const matchesCategory = activeCategory === 'All' || valve.category === activeCategory;
        return matchesCategory && matchesSearch(valve);
      })
      .sort((a, b) => {
        const aIndex = CATEGORY_ORDER.indexOf(a.category);
        const bIndex = CATEGORY_ORDER.indexOf(b.category);
        if (aIndex !== bIndex) {
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        }

        const aOrder = ITEM_ORDER[a.name];
        const bOrder = ITEM_ORDER[b.name];
        if (aOrder !== undefined || bOrder !== undefined) {
          if (aOrder === undefined) return 1;
          if (bOrder === undefined) return -1;
          return aOrder - bOrder;
        }

        return 0;
      });
  }, [searchTerm, activeCategory, allItems]);

  return (
    <div className="valves-catalog-page">
      {/* Hero Banner Section */}
      <section className="catalog-hero">
        <div className="catalog-hero-overlay"></div>
        <div className="container catalog-hero-container">
          <div className="catalog-hero-badge">Industrial Grade Quality</div>
          <h1 className="catalog-hero-title">Valves and Other accessories </h1>
          <p className="catalog-hero-subtitle">
            Explore our comprehensive range of high-performance flow control solutions designed for dams, power stations, municipal grids, and chemical process pipelines.
          </p>
        </div>
      </section>

      {/* Catalog Search & Category Filters */}
      <section className="catalog-controls-section">
        <div className="container">
          <div className="catalog-controls-wrapper">
            {/* Search Bar */}
            <div className="search-bar-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search valves by name, material, standard..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="category-pills-wrapper">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="results-count">
            Showing {filteredValves.length} valve{filteredValves.length === 1 ? '' : 's'}
          </div>
        </div>
      </section>

      {/* Valves Grid */}
      {activeCategory !== 'Other Accessories' && (
        <section className="catalog-grid-section">
          <div className="container">
            {filteredValves.length > 0 ? (
              <div className="valves-grid">
                {filteredValves.map((valve, index) => (
                  <div
                    className="valve-card"
                    key={valve.id}
                    onClick={() => router.push(`/valve-detail/${valve.id}`)}
                    style={{ '--card-index': index } as React.CSSProperties}
                  >
                    {/* Image Wrapper */}
                    <div className="valve-card-image-container">
                      {imageMap[normalizeName(valve.name)] || valve.image ? (
                        <img
                          src={imageMap[normalizeName(valve.name)] || valve.image}
                          alt={valve.name}
                          className="valve-card-img"
                        />
                      ) : (
                        <div className="valve-card-img-placeholder">
                          <i className="fas fa-image placeholder-icon"></i>
                          <span>Image coming soon</span>
                        </div>
                      )}
                    </div>

                    {/* Body Content */}
                    <div className="valve-card-body">
                      <h3 className="valve-card-title">{valve.name}</h3>

                      {/* Specs Checkmark List */}
                      <ul className="valve-card-specs-list">
                        <li>
                          <i className="fas fa-check-circle spec-check-icon"></i>
                          <span><strong>Size:</strong> {valve.size}</span>
                        </li>
                        <li>
                          <i className="fas fa-check-circle spec-check-icon"></i>
                          <span><strong>Standard:</strong> {valve.standards.slice(0, 2).join(', ')}</span>
                        </li>
                        <li>
                          <i className="fas fa-check-circle spec-check-icon"></i>
                          <span><strong>MOC:</strong> {valve.moc.join(' / ')}</span>
                        </li>
                        <li>
                          <i className="fas fa-check-circle spec-check-icon"></i>
                          <span><strong>Pressure:</strong> {valve.pressure.join(', ')}</span>
                        </li>
                        <li>
                          <i className="fas fa-check-circle spec-check-icon"></i>
                          <span><strong>End Connection:</strong> {valve.endConnection}</span>
                        </li>
                        <li>
                          <i className="fas fa-check-circle spec-check-icon"></i>
                          <span><strong>Operation:</strong> {valve.operation[0]}</span>
                        </li>
                      </ul>
                    </div>

                    {/* Card Action */}
                    <div className="valve-card-footer">
                      <button className="valve-details-btn">
                        View Details <i className="fas fa-arrow-right arrow-icon"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results-panel">
                <i className="fas fa-search-minus empty-icon"></i>
                <h3>No valves found matching your search.</h3>
                <p>Try refining your search text or switching the category filter.</p>
                <button
                  className="reset-filters-btn"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('All');
                  }}
                >
                  Reset Search & Filters
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {activeCategory === 'Other Accessories' && (
        <OtherProductsPage />
      )}
    </div>
  );
}
