import React, { useState } from 'react';
import './OtherProductsPage.css';
import { otherProducts } from './otherProductsData';

export default function OtherProductsPage({ onOpenQuote }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = otherProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.usage.some(u => u.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="other-products-page-wrapper">



      {/* Grid Section */}
      <section className="other-products-grid-section">
        <div className="container">
          <p className="results-count">Showing {filteredProducts.length} industrial products</p>
          <div className="other-products-grid">
            {filteredProducts.map((p) => (
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
                    <button 
                      className="btn-card-quote" 
                      onClick={onOpenQuote}
                      id={`quote-btn-${p.id}`}
                    >
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
