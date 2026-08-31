'use client';

import { otherProducts } from '@/data/otherProducts';
import { useQuote } from '@/components/layout/QuoteProvider';

export default function OtherProductsPage() {
  const { openQuote } = useQuote();

  return (
    <div className="other-products-page-wrapper">
      {/* Grid Section */}
      <section className="other-products-grid-section">
        <div className="container">
          <p className="results-count">Showing {otherProducts.length} industrial products</p>
          <div className="other-products-grid">
            {otherProducts.map((p) => (
              <div className="other-product-card" key={p.id}>
                <div className="card-image-wrapper">
                  <img src={p.image} alt={p.name} className="card-product-img" />
                </div>
                <div className="card-content-wrapper">
                  <span className="card-category-badge">Piping & Controls</span>
                  <h3 className="card-product-name">{p.name}</h3>

                  <div className="card-spec-list">
                    <div className="spec-item">
                      <span className="spec-label">Usage / Functions:</span>
                      <ul className="spec-bullet-list">
                        {p.usage.map((u, i) => (
                          <li key={i}>{u}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="card-actions-row">
                    <button className="btn-card-quote" onClick={openQuote} id={`quote-btn-${p.id}`}>
                      Request Technical Proposal <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
