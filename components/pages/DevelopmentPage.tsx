'use client';

import { useEffect } from 'react';

export default function DevelopmentPage() {
  useEffect(() => {
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const hiddenElements = document.querySelectorAll('.hidden-slide-left, .hidden-slide-right, .hidden-fade-up');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="development-page-wrapper">
      {/* Header Section */}
      <div className="development-header hidden-fade-up">
        <div className="container">
          <h1 className="animate-fade-up">Developments at GM Dalui Valves</h1>
          <p className="animate-fade-up delay-1">
            Engineering &amp; Product Innovation
          </p>
        </div>
      </div>

      {/* Intro Section */}
      <section className="development-intro container hidden-fade-up">
        <div className="dev-intro-text">
          <p>
            At <strong>GM Dalui Valves</strong>, continuous development is at the core of our manufacturing philosophy. Our engineering team consistently works on design upgrades, performance enhancement, and application-specific customization to meet evolving industry requirements across water supply, infrastructure, industrial, and utility sectors.
          </p>
          <p className="highlight-text">Below are key development initiatives undertaken:</p>
        </div>
      </section>

      {/* Initiatives Grid Section */}
      <section className="development-initiatives bg-light">
        <div className="container">
          <div className="dev-grid">
            <div className="dev-card hidden-slide-left">
              <div className="dev-card-icon"><i className="fas fa-wind"></i></div>
              <h3>1. Development of TPAV (Air Valves) – Standard Office Model</h3>
              <p>We have successfully developed TPAV (Triple Purpose Air Valve) standard configurations suitable for general utility and office-approved specifications. These designs ensure reliable air release, vacuum break, and air admission during pipeline operations, improving system efficiency and pipeline safety.</p>
            </div>

            <div className="dev-card hidden-slide-right">
              <div className="dev-card-icon"><i className="fas fa-industry"></i></div>
              <h3>2. TPAV – Large Office / Heavy-Duty Configuration</h3>
              <p>A specialized large-size TPAV variant has been engineered for high-capacity pipelines and critical infrastructure projects. This model is designed for enhanced airflow handling, better pressure balancing, and improved durability under high operational loads, making it suitable for large municipal and industrial networks.</p>
            </div>

            <div className="dev-card hidden-slide-left">
              <div className="dev-card-icon"><i className="fas fa-drafting-compass"></i></div>
              <h3>3. Design Development Enhancements</h3>
              <p>Our ongoing design development program focuses on improving valve geometry, flow efficiency, sealing performance, and lifecycle durability. These refinements are carried out using field feedback, hydraulic performance analysis, and application-based customization.</p>
            </div>

            <div className="dev-card hidden-slide-right">
              <div className="dev-card-icon"><i className="fas fa-tachometer-alt"></i></div>
              <h3>4. PRV (Pressure Reducing Valve) Development</h3>
              <p>We have strengthened our PRV product line to ensure stable downstream pressure control in variable inlet conditions. The improved design ensures:</p>
              <ul>
                <li><i className="fas fa-check"></i> Consistent pressure regulation</li>
                <li><i className="fas fa-check"></i> Reduced wear and cavitation</li>
                <li><i className="fas fa-check"></i> Enhanced diaphragm/spring response accuracy</li>
                <li><i className="fas fa-check"></i> Longer operational life in water distribution systems</li>
              </ul>
            </div>

            <div className="dev-card hidden-slide-left">
              <div className="dev-card-icon"><i className="fas fa-shield-alt"></i></div>
              <h3>5. Safety Valve – Enclosed / Sealed Spring Type</h3>
              <p>A new-generation safety valve design with enclosed and sealed spring mechanism has been developed to improve reliability and protection. This configuration prevents external contamination, enhances spring life, and ensures precise pressure relief operation in critical systems.</p>
            </div>

            <div className="dev-card hidden-slide-right">
              <div className="dev-card-icon"><i className="fas fa-water"></i></div>
              <h3>6. Air Cushion Valve Development</h3>
              <p>We have introduced improvements in air cushion valve technology, focusing on mitigating water hammer effects in pipelines. The upgraded design helps absorb sudden pressure surges, thereby protecting pipeline integrity and reducing maintenance requirements.</p>
            </div>

            <div className="dev-card hidden-slide-left">
              <div className="dev-card-icon"><i className="fas fa-cogs"></i></div>
              <h3>7. Metal Seated vs Resilient Seated Valve Optimization</h3>
              <p>GM Dalui Valves offers optimized solutions in both:</p>
              <ul>
                <li><i className="fas fa-check"></i> <strong>Metal Seated Valves</strong> – for high-temperature, abrasive, and heavy-duty applications</li>
                <li><i className="fas fa-check"></i> <strong>Resilient Seated Valves</strong> – for leak-proof, low-torque, and water distribution applications</li>
              </ul>
              <p>Our development work ensures correct selection and performance optimization based on application environment.</p>
            </div>

            <div className="dev-card hidden-slide-right">
              <div className="dev-card-icon"><i className="fas fa-barcode"></i></div>
              <h3>8. Heat Number Traceability Marking</h3>
              <p>We have implemented Heat Number (Heat No.) marking systems for better material traceability. This ensures full transparency in manufacturing, enabling:</p>
              <ul>
                <li><i className="fas fa-check"></i> Batch-wise material tracking</li>
                <li><i className="fas fa-check"></i> Quality assurance compliance</li>
                <li><i className="fas fa-check"></i> Enhanced reliability for critical infrastructure projects</li>
              </ul>
            </div>

            <div className="dev-card hidden-fade-up full-width">
              <div className="dev-card-icon"><i className="fas fa-certificate"></i></div>
              <h3>9. Certification &amp; Compliance Clarification (Manufacturing Scope)</h3>
              <p>Our manufacturing documentation clearly defines certification applicability and scope compliance requirements. This ensures that customers receive accurate documentation aligned with project specifications, inspection standards, and regulatory frameworks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="development-conclusion container hidden-fade-up">
        <h2>Conclusion</h2>
        <p>
          These developments reflect GM Dalui Valves&apos; commitment to engineering excellence, product reliability, and continuous innovation. Each enhancement is driven by real-world field performance requirements and customer-centric engineering improvements.
        </p>
      </section>
    </div>
  );
}
