'use client';

import { useEffect } from 'react';

export default function CmcPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cmc-page">
      <div className="container cmc-container">
        <h1 className="page-title">📝 Comprehensive Maintenance Contract (CMC) for Valves</h1>

        <div className="cmc-content-box">
          <p className="cmc-intro"><strong>This Agreement is made on [Date] between:</strong></p>
          <div className="parties-section">
            <p><strong>G.M. DALUI &amp; SONS PRIVATE LIMITED</strong> (&quot;Supplier/Service Provider&quot;), having its registered office at [address],</p>
            <p className="and-text">and</p>
            <p><strong>[Client Name]</strong> (&quot;Client&quot;), having its office at [address].</p>
          </div>

          <h2 className="section-heading">1. Scope of Services</h2>
          <p>This CMC covers complete maintenance including preventive, corrective, and replacement of defective parts for valves supplied by G.M. DALUI &amp; SONS PRIVATE LIMITED at [Site/Plant Name].</p>

          <h3 className="sub-heading">Covered Valves:</h3>
          <ul className="cmc-list">
            <li>Sluice Valves (Rising/Non-Rising)</li>
            <li>Butterfly Valves (Resilient/Metal Seated/Wafer)</li>
            <li>Check Valves (Swing/Dual Plate/Non-Slam/Wafer/Spring)</li>
            <li>Pressure Reducing Valves (PRV)</li>
            <li>Altitude Control Valves</li>
            <li>Knife Gate Valves</li>
            <li>Other special valves as per PO [number]</li>
          </ul>

          <h2 className="section-heading">2. Services Included</h2>
          <div className="sub-section">
            <h3 className="sub-heading">Preventive Maintenance</h3>
            <ul className="cmc-list">
              <li>[X visits/year] as per agreed schedule.</li>
              <li>Lubrication, inspection, torque checks, seat/seal condition check, and valve operation verification.</li>
            </ul>

            <h3 className="sub-heading">Corrective Maintenance &amp; Breakdown Support</h3>
            <ul className="cmc-list">
              <li>Unlimited service calls for breakdowns during contract period.</li>
              <li>Attending site within [24–48 hrs] of intimation.</li>
            </ul>

            <h3 className="sub-heading">Replacement of Parts</h3>
            <ul className="cmc-list">
              <li>All defective parts/components replaced free of cost during contract tenure (covered under CMC).</li>
              <li>Includes seats, seals, gaskets, discs, stems, fasteners, bearings, springs.</li>
            </ul>

            <h3 className="sub-heading">Documentation &amp; Reporting</h3>
            <ul className="cmc-list">
              <li>Service reports after each visit.</li>
              <li>Valve-wise maintenance logbook updated.</li>
              <li>Annual performance report submitted at contract closure.</li>
            </ul>
          </div>

          <h2 className="section-heading">3. Exclusions</h2>
          <ul className="cmc-list">
            <li>Damage due to mishandling, unauthorized modification, or operating outside design parameters.</li>
            <li>Force majeure conditions (fire, flood, earthquake, etc.).</li>
            <li>Consumables not part of valve design (e.g., pipeline gaskets outside valve scope).</li>
          </ul>

          <h2 className="section-heading">4. Client Responsibilities</h2>
          <ul className="cmc-list">
            <li>Provide safe access, lifting equipment, and line isolation for maintenance.</li>
            <li>Ensure proper operating conditions (pressure, temperature, fluid medium within design limits).</li>
            <li>Nominate a coordinator for reporting &amp; joint inspections.</li>
          </ul>

          <h2 className="section-heading">5. Duration</h2>
          <p>This CMC shall remain valid for 12 months from [start date] to [end date], renewable annually upon mutual agreement.</p>

          <h2 className="section-heading">6. Commercial Terms</h2>
          <ul className="cmc-list">
            <li><strong>CMC Charges (Annual):</strong> ₹ [amount] (exclusive of GST).</li>
            <li><strong>Payment Terms:</strong> 50% advance, 50% balance after 6 months OR as mutually agreed.</li>
            <li><strong>Extra Services (if beyond scope):</strong> Charged at actuals with prior consent.</li>
          </ul>

          <h2 className="section-heading">7. Warranty &amp; Liability</h2>
          <ul className="cmc-list">
            <li>All replaced parts carry a warranty for the remaining CMC period.</li>
            <li>Supplier not liable for indirect losses, downtime, or process interruptions.</li>
          </ul>

          <h2 className="section-heading">8. Termination</h2>
          <ul className="cmc-list">
            <li>Either party may terminate with 60 days written notice.</li>
            <li>Refund (if applicable) will be calculated on pro-rata service completion basis.</li>
          </ul>

          <h2 className="section-heading">9. Jurisdiction</h2>
          <p>Any dispute shall fall under the jurisdiction of courts at [City].</p>
        </div>
      </div>
    </div>
  );
}
