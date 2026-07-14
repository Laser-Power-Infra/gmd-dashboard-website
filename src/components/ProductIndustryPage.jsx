import React, { useEffect } from 'react';
import './ProductIndustryPage.css'; 

export default function ProductIndustryPage({ onOpenQuote }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="product-industry-page">
      <div className="industry-header">
        <div className="container">
          <h1 className="animate-fade-up">Product Applications & Industries</h1>
          <p className="animate-fade-up delay-1">
            Valve Applications Across Various Industries
          </p>
        </div>
      </div>

      <div className="container industry-content">
        <div className="industry-section">
          <h2>Valve Applications</h2>
          
          <div className="industry-content-wrapper">
            
            {/* Overview Table */}
            <h3 className="industry-sub-title">Valves Applications Overview</h3>
            <div className="table-responsive mb-5">
              <table className="industry-table">
                <thead>
                  <tr>
                    <th>Place/Industry</th>
                    <th>Common Valve Types</th>
                    <th>Usage Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Water treatment & supply</td><td>Butterfly (double flanged, lug), Gate, Globe, Ball</td><td>Flow control, isolation, pressure regulation</td></tr>
                  <tr><td>HVAC & Building Systems</td><td>Butterfly (concentric, resilient seated), Ball, Globe</td><td>Heating, cooling, and ventilation flow regulation</td></tr>
                  <tr><td>Fire Protection & Air/Gas</td><td>Plug, Ball, Butterfly</td><td>Isolation and control for safety and gas systems</td></tr>
                  <tr><td>Power Plants & Steam Systems</td><td>Globe, Gate, Butterfly</td><td>Steam and cooling water flow control and regulation</td></tr>
                  <tr><td>Chemical, Pharma & Food</td><td>Diaphragm, Pinch, Resilient seated Butterfly</td><td>Sanitary flow control, precise throttling</td></tr>
                  <tr><td>Shipbuilding & Marine</td><td>Globe, Ball, Gate, Diaphragm, Butterfly</td><td>Fuel, water, and fluid system control on board</td></tr>
                  <tr><td>Oil and Gas</td><td>Ball, Gate, Plug, Check</td><td>Pipeline flow control and shutoff under high pressure and corrosive fluids</td></tr>
                </tbody>
              </table>
            </div>

            {/* Replacements Section */}
            <h3 className="industry-sub-title">Valve Replacements Matrix</h3>
            
            <div className="replacements-grid">
              {/* Marine Replacements Card */}
              <div className="replacement-card">
                <div className="rc-header bg-marine">
                  <i className="fas fa-ship"></i> Marine
                </div>
                <div className="rc-body">
                  <ul>
                    <li><strong>Ball Valve (marine)</strong> → Replace with Flanged/wafer Gate or Butterfly (marine spec). <br/><small>Feasible: On/off isolation, ≤PN40, clean seawater, moderate temp.</small></li>
                    <li><strong>Gate Valve</strong> → Replace with Ball Valve (full bore) or Lug Butterfly.<br/><small>Feasible: Large systems, low-frequency on/off isolation.</small></li>
                    <li><strong>Butterfly Valve</strong> → Replace with Triple-Offset Metal Seated or Ball Valve.<br/><small>Feasible: Large lines, cooling seawater, firewater.</small></li>
                    <li><strong>Check Valve</strong> → Replace with Flanged Wafer or Lift Check Valve.<br/><small>Feasible: Non-return in seawater lines, proper orientation.</small></li>
                  </ul>
                </div>
              </div>

              {/* Oil Replacements Card */}
              <div className="replacement-card">
                <div className="rc-header bg-oil">
                  <i className="fas fa-oil-can"></i> Oil & Gas
                </div>
                <div className="rc-body">
                  <ul>
                    <li><strong>Gate Valve</strong> → Replace with Ball Valve (full bore), Globe or Plug Valve.<br/><small>Feasible: On/off isolation, similar/higher pressure rating (API 6D class 150+).</small></li>
                    <li><strong>Ball Valve (API 6D)</strong> → Replace with Gate or Plug Valve.<br/><small>Feasible: Full bore flow, high-cycle on/off duty, moderate pressure.</small></li>
                    <li><strong>Globe Valve</strong> → Replace with Control Valve (automated).<br/><small>Feasible: Flow regulation and throttling within rating.</small></li>
                    <li><strong>Plug Valve</strong> → Replace with Ball or Gate Valve (isolation).<br/><small>Feasible: Low erosion slurry, on/off service, pressure rating matching.</small></li>
                  </ul>
                </div>
              </div>

              {/* Hygienic Replacements Card */}
              <div className="replacement-card">
                <div className="rc-header bg-hygienic">
                  <i className="fas fa-flask"></i> Hygienic / Pharma
                </div>
                <div className="rc-body">
                  <ul>
                    <li><strong>Diaphragm Valve</strong> → Replace with Globe Valve (sanitary/control).<br/><small>Feasible: When precise throttling/modulation required, compatible materials.</small></li>
                    <li><strong>Pinch Valve</strong> → Replace with Diaphragm Valve.<br/><small>Feasible: Slurry, viscous fluids, shear sensitive; low pressure.</small></li>
                    <li><strong>Plug Valve</strong> → Replace with Ball or Butterfly Valve.<br/><small>Feasible: Low erosion, on/off use; clean fluids.</small></li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
