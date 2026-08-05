'use client';

import { useEffect } from 'react';

export default function AmcPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="amc-page">
      <div className="container amc-container">
        <h1 className="page-title">📝 Annual Maintenance Contract (AMC) for Valves</h1>

        <div className="amc-content-box">
          <p className="amc-intro"><strong>This Agreement is made on [Date] between:</strong></p>
          <div className="parties-section">
            <p><strong>G.M. DALUI &amp; SONS PRIVATE LIMITED</strong> (&quot;Supplier/Service Provider&quot;), having its registered office at [address],</p>
            <p className="and-text">and</p>
            <p><strong>[Client Name]</strong> (&quot;Client&quot;), having its office at [address].</p>
          </div>

          <h2 className="section-heading">1. Scope of Services</h2>
          <p>This AMC covers operation, preventive maintenance, and inspection of valves supplied and installed by G.M. DALUI &amp; SONS PRIVATE LIMITED at [Site/Plant Name].</p>

          <h3 className="sub-heading">Covered valve types (tick/apply as relevant):</h3>
          <ul className="amc-list">
            <li>Sluice Valves (Rising / Non-Rising)</li>
            <li>Butterfly Valves (Resilient / Metal Seated / Wafer Type)</li>
            <li>Check Valves (Swing / Dual Plate / Non-Slam / Wafer / Spring Type)</li>
            <li>Pressure Reducing Valves (PRV)</li>
            <li>Altitude Control Valves</li>
            <li>Knife Gate Valves</li>
            <li>Other special valves supplied under PO [number]</li>
          </ul>

          <h2 className="section-heading">2. Services Included</h2>
          <div className="sub-section">
            <h3 className="sub-heading">Preventive Maintenance Visits</h3>
            <ul className="amc-list">
              <li>[X visits per year] at scheduled intervals.</li>
              <li>Activities include lubrication, tightening of fasteners, inspection of seats/seals, operation check, and minor adjustments.</li>
            </ul>

            <h3 className="sub-heading">Corrective Maintenance</h3>
            <ul className="amc-list">
              <li>Attending to breakdowns reported by the Client within [24/48 hrs] of notification.</li>
              <li>Repairs/replacement of defective parts (subject to warranty/AMC terms).</li>
            </ul>

            <h3 className="sub-heading">Documentation</h3>
            <ul className="amc-list">
              <li>Submission of detailed Service Reports after each visit.</li>
              <li>Maintenance log update with valve-wise observations.</li>
            </ul>
          </div>

          <h2 className="section-heading">3. Exclusions</h2>
          <ul className="amc-list">
            <li>Damage due to misuse, mishandling, or operation outside design parameters.</li>
            <li>Replacement of consumables (gaskets, seals, O-rings, rubber seats) unless covered under AMC terms.</li>
            <li>Structural modifications or upgrades.</li>
            <li>Labour/parts required due to third-party tampering.</li>
          </ul>

          <h2 className="section-heading">4. Client Responsibilities</h2>
          <ul className="amc-list">
            <li>Ensure safe access to valves during maintenance.</li>
            <li>Provide line isolation/permit-to-work where required.</li>
            <li>Maintain cleanliness of surrounding pipeline/equipment.</li>
          </ul>

          <h2 className="section-heading">5. Duration</h2>
          <p>This AMC shall remain in force for 12 months from [start date] to [end date], renewable annually upon mutual consent.</p>

          <h2 className="section-heading">6. Commercial Terms</h2>
          <ul className="amc-list">
            <li><strong>Annual Charges:</strong> ₹ [amount] (exclusive of GST).</li>
            <li><strong>Payment Terms:</strong> 50% advance, 50% after mid-term service OR as mutually agreed.</li>
            <li><strong>Extra Services (beyond AMC scope):</strong> Billed at actuals with prior approval.</li>
          </ul>

          <h2 className="section-heading">7. Warranty &amp; Liability</h2>
          <ul className="amc-list">
            <li>Parts replaced under AMC carry a warranty of 6 months against manufacturing defects.</li>
            <li>Supplier is not liable for consequential damages, process losses, or downtime beyond contract scope.</li>
          </ul>

          <h2 className="section-heading">8. Termination</h2>
          <ul className="amc-list">
            <li>Either party may terminate the contract with 30 days written notice.</li>
            <li>Refunds (if any) will be on pro-rata service completion basis.</li>
          </ul>

          <h2 className="section-heading">9. Jurisdiction</h2>
          <p>Any disputes shall be subject to the jurisdiction of courts at [City].</p>
        </div>
      </div>
    </div>
  );
}
