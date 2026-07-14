import React, { useState, useEffect, useRef } from 'react';
import { valvesData } from './valvesData';
import ValveManualSection from './ValveManualSection';
import './WarrantyPage.css';

export default function WarrantyPage() {
  const [selectedValveId, setSelectedValveId] = useState(null);

  const observerRef = useRef(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/manual-of-')) {
        const id = hash.replace('#/manual-of-', '');
        setSelectedValveId(id);
      } else {
        setSelectedValveId(null);
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    // Only set up observer if we are on a details view
    if (!selectedValveId) return;

    // Small timeout to allow DOM to render the sections before observing
    const timer = setTimeout(() => {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, { threshold: 0.15 });

      const rows = document.querySelectorAll('.valve-cards-container');
      rows.forEach((row) => {
        if (observerRef.current) observerRef.current.observe(row);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [selectedValveId]);

  const navigateToValve = (id) => {
    window.location.hash = `#/manual-of-${id}`;
  };

  const navigateBack = (e) => {
    e.preventDefault();
    window.location.hash = '#/manuals';
  };

  // Find the selected valve object
  const activeValve = valvesData.find((v) => v.id === selectedValveId);

  return (
    <div className="warranty-page-wrapper">
      {/* Hero Header Banner with Hexagon layout */}
      <section className="warranty-hero">
        <div className="hero-decor-shape-top-left"></div>
        <div className="hero-decor-shape-bottom-right"></div>
        
        <div className="container hero-new-container">
          {/* Left: Hexagon image container */}
          <div className="hero-left-hex">
            <div className="hexagon-border-blue">
              <div className="hexagon-inner-valves"></div>
            </div>
          </div>

          {/* Center: Styled title */}
          <div className="hero-center-title">
            <h1 className="warranty-title-text">MANUALS OF VALVE</h1>
          </div>
        </div>
      </section>

      {/* Main content body */}
      <section className="warranty-content-section">
        <div className="container">
          
          {/* VIEW 1: Grid Catalog of 12 Valves */}
          {!activeValve ? (
            <>
              <div className="warranty-intro-text">
                <h2>Manuals of Valve</h2>
                <p className="subtitle">Select a valve category below to view specific manual instructions</p>
              </div>

              <div className="warranty-catalog-grid">
                {valvesData.map((valve) => (
                  <div 
                    className="warranty-catalog-card" 
                    key={valve.id}
                    onClick={() => navigateToValve(valve.id)}
                  >
                    <div className="catalog-card-img-box">
                      <img src={valve.image} alt={valve.name} className="catalog-card-img" />
                    </div>
                    <h3 className="catalog-card-title">{valve.name}</h3>
                  </div>
                ))}
              </div>
            </>
          ) : (
            
            /* VIEW 2: Detailed inclusions & exclusions for selected valve */
            <div className="warranty-details-view">
              <div className="details-header-nav">
                <a href="#/manuals" onClick={navigateBack} className="btn-back-link">
                  <i className="fas fa-arrow-left"></i> Back to Manuals List
                </a>
              </div>

              <div className="warranty-details-title-block" style={{ display: 'none' }}>
                {/* Title and generic Inclusions/Exclusions removed per user request */}
              </div>

              {/* Render Valve Manual Section */}
              <ValveManualSection valveId={activeValve.id} />
              
            </div>
          )}

        </div>
      </section>

      {/* Corporate support prompt */}
      <section className="warranty-footer-prompt">
        <div className="container">
          <div className="prompt-card">
            <h3>Need More Clarifications on the Manual?</h3>
            <p>Our technical team is ready to assist you with specific operational and compatibility parameters.</p>
            <a href="#contact" className="btn-technical-inquiry">
              Contact Tech Support <i className="fas fa-headset"></i>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
