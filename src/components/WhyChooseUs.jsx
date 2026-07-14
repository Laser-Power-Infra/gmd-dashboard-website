import React, { useEffect, useState, useRef } from 'react';
import './WhyChooseUs.css';

export default function WhyChooseUs() {
  const [animate, setAnimate] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <section id="why-choose-us" className="choose-section" ref={elementRef}>
      <div className="container choose-container">
        {/* Left Column: Strengths and Progress Bars */}
        <div className="choose-content">
          <div className="section-badge">Why Choose Us</div>
          <h2 className="section-title">Fast Growing Valves Manufacturer, Supplier &amp; Exporter</h2>
          <p className="choose-desc">
            We never compromise on the quality of our precision-engineered products, ensuring they meet and exceed global standards. Our forward-thinking approach drives innovation and technology for advanced industrial solutions. Additionally, our dedicated customer-centric teams provide seamless support.
          </p>
          <p className="choose-desc">
            With a strong legacy and an even stronger future, we continue to push boundaries and set new benchmarks in the industry. Whether you are looking for reliable products or innovative solutions, GM Dalui &amp; Sons Pvt. Ltd. is your trusted partner in progress.
          </p>

          {/* Animated Progress Bars */}
          <div className="progress-bars-container">
            <div className="progress-bar-item">
              <div className="progress-bar-header">
                <span className="progress-bar-title">Production</span>
                <span className="progress-bar-val">75%</span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: animate ? '75%' : '0%' }}
                ></div>
              </div>
            </div>

            <div className="progress-bar-item">
              <div className="progress-bar-header">
                <span className="progress-bar-title">Supply History</span>
                <span className="progress-bar-val">93%</span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: animate ? '93%' : '0%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Industrial image and overlapping block */}
        <div className="choose-graphics">
          <div className="choose-graphics-container">
            <div className="choose-deco-block"></div>
            <div className="choose-image-card">
              <img src="/uploads/2025/04/MISSION.jpg" alt="Industrial valve installation grid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
