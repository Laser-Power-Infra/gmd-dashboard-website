'use client';

import { useEffect, useState, useRef } from 'react';

// Counter Hook to animate numbers smoothly
function useCountUp(target: number, duration = 2000, trigger = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start = 0;
    const end = target;
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
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      // threshold 0: this section is taller than a small viewport, so 20% of it may never be visible at once and the counters would stay at 0
      { threshold: 0 }
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

  // Counts below are the site's own catalogue figures, not marketing claims
  const valveTypesCount = useCountUp(11, 1500, isInView);
  const clientLogosCount = useCountUp(18, 1500, isInView);

  return (
    <section id="about-us" className="about-section" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          {/* Left Column: Overlapping images and decorative panel */}
          <div className="about-graphics">
            <div className="graphics-container">
              <div className="deco-block"></div>
              <div className="about-image-card">
                <img src="/uploads/2025/04/banner-image3.webp" alt="Industrial piping system layout" loading="lazy" />
              </div>
            </div>
          </div>

          {/* Right Column: Text block */}
          <div className="about-content">
            <div className="section-badge">ABOUT US</div>
            <h2 className="section-title">We Have Been Working Very Efficiently</h2>
            <p className="about-text">
              At GM Dalui &amp; Sons Pvt. Ltd., we believe in engineering, in excellence and in redefining industry standards. With decades of expertise in manufacturing and innovation, our journey has been one of relentless progress and commitment to quality.
            </p>
            <p className="about-text">
              GM Dalui &amp; Sons Pvt. Ltd. is transforming! With cutting-edge modernization, innovation and an unwavering commitment to excellence, we are redefining industry standards. The future is here - bigger, bolder, and better than ever! Stay with us on this journey of growth and success.
            </p>
            <blockquote className="about-quote">
              &quot;We are entering a bold new era - one driven by modernization, advanced technology, and customer-centric solutions.&quot;
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
                <h3>{valveTypesCount}</h3>
                <p>Valve Types Manufactured</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>{clientLogosCount}</h3>
                <p>Client Organisations Served</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
