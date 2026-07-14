import React, { useEffect } from 'react';
import './RiskManagementPage.css';

export default function RiskManagementPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="risk-page-wrapper">
      {/* Hero Section */}
      <section className="risk-hero-section">
        <div className="container">
          <h1 className="animate-fade-up">Risk Management</h1>
          <p className="animate-fade-up delay-1">
            Section 11 • Quality Manual • G.M.DALUI & SONS PRIVATE LIMITED
          </p>
          <div className="animate-fade-up delay-2" style={{ marginTop: '25px' }}>
            <a 
              href="/Quality_Manual.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fb923c',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 4px 15px rgba(251, 146, 60, 0.4)',
                transition: 'transform 0.2s, background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fb923c'}
            >
              <i className="fas fa-download"></i> Download QA
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="risk-main-content">
        
        {/* Block 1: Left Image, Right Text */}
        <section className="risk-block block-alternate container">
          <div className="risk-image animate-slide-right">
            <img src="/uploads/2025/06/futuristic-industry-engineering-concept-scaled.jpg" alt="Industrial Risk Management" />
          </div>
          <div className="risk-text animate-slide-left">
            <div className="section-badge">11.1 General</div>
            <h2>Two-Tier Risk Management System</h2>
            <p>
              G.M.DALUI & SONS PRIVATE LIMITED has developed a comprehensive risk management system structured in two distinct tiers to ensure both high-level business integrity and daily operational safety.
            </p>
            <div className="tier-cards">
              <div className="tier-card">
                <i className="fas fa-chess-king"></i>
                <h4>Tier One</h4>
                <p>Governs high-level business risks and opportunities. Controlled through executive-level Risk and Opportunities Management.</p>
              </div>
              <div className="tier-card">
                <i className="fas fa-hard-hat"></i>
                <h4>Tier Two</h4>
                <p>Deals directly with operational, day-to-day HSE risk management. Controlled strictly through Hazard & Risk Management.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="risk-divider container" />

        {/* Block 2: Left Text (Table), Right Image */}
        <section className="risk-block container">
          <div className="risk-text animate-slide-right">
            <div className="section-badge">11.2 Environmental Aspects</div>
            <h2>ERIC: Eliminate, Reduce, Isolate, Control</h2>
            <p>
              Our core objective is to apply the <strong>ERIC</strong> principle to all environmental aspects and impacts. We measure significance based on a strict numerical and color-coded sequence:
            </p>
            
            <div className="table-responsive">
              <table className="risk-table">
                <thead>
                  <tr>
                    <th>Condition</th>
                    <th>Value Range</th>
                    <th>Indicator</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Low Conditions</td>
                    <td>1 - 2</td>
                    <td><span className="indicator-badge badge-green">Green</span></td>
                    <td><strong>Acceptable</strong></td>
                  </tr>
                  <tr>
                    <td>Medium Conditions</td>
                    <td>3 - 5</td>
                    <td><span className="indicator-badge badge-yellow">Yellow</span></td>
                    <td><strong>Tolerable</strong></td>
                  </tr>
                  <tr>
                    <td>High Conditions</td>
                    <td>6 - 9</td>
                    <td><span className="indicator-badge badge-blue">Blue</span></td>
                    <td><strong>Moderate</strong></td>
                  </tr>
                  <tr>
                    <td>High Conditions</td>
                    <td>10 - 15</td>
                    <td><span className="indicator-badge badge-grey">Grey</span></td>
                    <td><strong>Substantial</strong></td>
                  </tr>
                  <tr>
                    <td>Very High Conditions</td>
                    <td>16 - 25</td>
                    <td><span className="indicator-badge badge-red">Red</span></td>
                    <td><strong>Unacceptable</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="risk-image animate-slide-left">
            {/* Using another available image for visual variety */}
            <img src="/uploads/2025/06/logistics-transportation-container-cargo-ship-cargo-plane-with-working-crane-bridge-shipyard-sunrise-logistic-import-export-transport-industry-background-ai-generative-scaled.jpg" alt="Environmental Safety" />
          </div>
        </section>

        {/* Block 3: Centered Grid for Mitigation Measures */}
        <section className="risk-mitigation-section">
          <div className="container">
            <div className="text-center">
              <div className="section-badge center-badge">Environmental Impact</div>
              <h2 className="section-title">Mitigation Measures</h2>
              <p className="section-subtitle">
                Regular monitoring is strictly enforced during construction to guarantee total compliance with environmental standards.
              </p>
            </div>

            <div className="mitigation-grid">
              <div className="m-card">
                <div className="m-icon"><i className="fas fa-wind"></i></div>
                <h4>Air Quality</h4>
                <p>Precautions to minimize air emissions (NO2, SO2) and dust. Mandatory regular inspection and maintenance of all construction machinery.</p>
              </div>
              <div className="m-card">
                <div className="m-icon"><i className="fas fa-tint"></i></div>
                <h4>Soil & Groundwater</h4>
                <p>Employed control measures to prevent contamination. Emergency soil and groundwater monitoring during any spill incidents.</p>
              </div>
              <div className="m-card">
                <div className="m-icon"><i className="fas fa-gas-pump"></i></div>
                <h4>Fuel & Electricity</h4>
                <p>Tracking weekly fuel consumption. Utilizing energy-efficient practices such as maximizing natural light and replacing dirty filters.</p>
              </div>
              <div className="m-card">
                <div className="m-icon"><i className="fas fa-recycle"></i></div>
                <h4>Waste Management</h4>
                <p>Strict hierarchy: <strong>Avoidance/reduction → Reuse → Recycle</strong>. Proper waste storage, treatment, and disposal options are prioritized.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Block 4: Left Image, Right Text (Hazard & Emergency) */}
        <section className="risk-block block-alternate container">
          <div className="risk-image animate-slide-right">
            <img src="/uploads/2025/06/worker-indoors-with-pipes-repairs-industrial-water-supply-system-water-supply-diagnostics-600x400.jpg" alt="Emergency Response" />
          </div>
          <div className="risk-text animate-slide-left">
            <div className="section-badge">11.3 - 11.6 Protocol</div>
            <h2>Hazards & Emergency Response</h2>
            
            <div className="hazard-levels">
              <div className="h-level">
                <h5>Extreme</h5>
                <p>Potential for fatality or extensive loss. Work halts immediately.</p>
              </div>
              <div className="h-level">
                <h5>High</h5>
                <p>Potential for permanent disability or severe structural damage.</p>
              </div>
              <div className="h-level">
                <h5>Medium & Low</h5>
                <p>Serious injury to minor damage. Disruption controlled and minimized.</p>
              </div>
            </div>

            <div className="emergency-alert">
              <h4><i className="fas fa-ambulance"></i> Emergency Response Protocol</h4>
              <p>
                <strong>Priority:</strong> Tackle emergencies without endangering personnel.<br/>
                <strong>Action:</strong> Assess seriousness, eliminate hazards, administer First Aid, and secure area. Reportable incidents strictly notified within 24 hours.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
