export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="choose-section">
      <div className="container choose-container">
        {/* Left Column: Strengths */}
        <div className="choose-content">
          <div className="section-badge">Why Choose Us</div>
          <h2 className="section-title">Fast Growing Valves Manufacturer, Supplier &amp; Exporter</h2>
          <p className="choose-desc">
            We never compromise on the quality of our precision-engineered products, ensuring they meet and exceed global standards. Our forward-thinking approach drives innovation and technology for advanced industrial solutions. Additionally, our dedicated customer-centric teams provide seamless support.
          </p>
          <p className="choose-desc">
            With a strong legacy and an even stronger future, we continue to push boundaries and set new benchmarks in the industry. Whether you are looking for reliable products or innovative solutions, GM Dalui &amp; Sons Pvt. Ltd. is your trusted partner in progress.
          </p>
        </div>

        {/* Right Column: Industrial image and overlapping block */}
        <div className="choose-graphics">
          <div className="choose-graphics-container">
            <div className="choose-deco-block"></div>
            <div className="choose-image-card">
              <img src="/uploads/2025/04/MISSION.webp" alt="Industrial valve installation grid" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
