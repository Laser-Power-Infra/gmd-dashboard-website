export default function VisionMission() {
  return (
    <section id="vision-mission" className="vision-mission-section">
      {/* Background Overlay */}
      <div className="section-overlay"></div>

      <div className="container vision-mission-container">
        {/* Left Column: Sustainable Future Banner */}
        <div className="sustainable-banner">
          <h2>Sustainable Future For Better Tomorrow</h2>
          <a href="#about-us" className="btn-primary">
            Discover More <i className="fas fa-search-plus"></i>
          </a>
        </div>

        {/* Right Column: Unified Vision & Mission Card (Light background) */}
        <div className="vision-mission-card">
          {/* Vision Part */}
          <div className="vision-block">
            <div className="section-badge">OUR VISION</div>
            <p className="vision-mission-text">
              Our vision is to be a globally recognized leader in industrial manufacturing, setting benchmarks for quality, innovation, and service excellence. We aim to continuously evolve, expand, and innovate to meet the changing demands of the industry while maintaining a strong ethical foundation and a commitment to sustainable and responsible business practices. Through strategic growth and operational excellence, we envision a future where GM Dalui &amp; Sons Pvt. Ltd. stands as a symbol of trust, performance, and technological advancement.
            </p>
          </div>

          <hr className="card-divider" />

          {/* Mission Part */}
          <div className="mission-block">
            <div className="section-badge">OUR MISSION</div>
            <p className="vision-mission-text">
              At GM Dalui &amp; Sons Pvt. Ltd. our mission is to deliver high-quality, technologically advanced, and reliable engineering solutions that empower industries to operate efficiently. We are committed to innovation, excellence, and customer satisfaction, ensuring that our products and services consistently exceed industry standards. By integrating cutting-edge technology, sustainable practices, and a customer-centric approach, we strive to build long-lasting partnerships and industrial growth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
