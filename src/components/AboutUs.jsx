import React, { useEffect, useState, useRef } from 'react';
import './AboutUs.css';

// Counter Hook to animate numbers smoothly
function useCountUp(target, duration = 2000, trigger = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    
    let start = 0;
    const end = parseInt(target, 10);
    if (start === end) return;

    // Find step interval
    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration, trigger]);

  return count;
}

export default function AboutUs() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // Set up counts
  const supplyHistoryCount = useCountUp(70, 1500, isInView);
  const productionCount = useCountUp(7500, 1800, isInView);
  const clientsCount = useCountUp(98, 1500, isInView);

  return (
    <section id="about-us" className="about-section" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          {/* Left Column: Overlapping images and decorative panel */}
          <div className="about-graphics">
            <div className="graphics-container">
              <div className="deco-block"></div>
              <div className="about-image-card">
                <img src="/uploads/2025/04/banner-image3.jpg" alt="Industrial piping system layout" />
              </div>
            </div>
          </div>

          {/* Right Column: Text block */}
          <div className="about-content">
            <div className="section-badge">ABOUT US</div>
            <h2 className="section-title">We Have Been Working Very Efficiently</h2>
            <p className="about-text">
              At GM Dalui &amp; Sons Pvt. Ltd. We believe in engineering and excellence and redefining industry standards. Decades of expertise in manufacturing and innovation, our journey has been one of relentless progress and commitment to quality.
            </p>
            <p className="about-text">
              GM Dalui &amp; Sons Pvt.Ltd. is transforming! With cutting-edge modernization, innovation, unwavering commitment to excellence, we are redefining industry standards. The future is here - bigger, bolder, and better than ever! Stay with us on this journey of growth and success.
            </p>
            <blockquote className="about-quote">
              "We are entering a bold new era - one driven by modernization, advanced technology, and customer-centric solutions."
            </blockquote>
          </div>
        </div>

        {/* Bottom Crimson Stats Banner */}
        <div className="stats-banner">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <div className="stat-info">
                <h3>{supplyHistoryCount}%</h3>
                <p>Supply History</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-hands"></i>
              </div>
              <div className="stat-info">
                <h3>{productionCount}+</h3>
                <p>Our Production</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>{clientsCount}%</h3>
                <p>Happy Clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
