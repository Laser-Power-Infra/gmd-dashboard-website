import React, { useState, useEffect } from 'react';
import './Hero.css';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4500); // Auto rotate every 4.5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="hero-section">
      <div className="container hero-container">
        {/* Left Column: Welcome text */}
        <div className="hero-content">
          <div className="heading-badge">
            Value Engineering Excellence
          </div>
          <h1 className="hero-welcome">WELCOME TO</h1>
          <h2 className="hero-company">GM DALUI &amp; SONS PVT. LTD</h2>
          <p className="hero-subtitle">
            Our valves are delivered in an extensive variety of materials and compositions and we can custom produce your design.
          </p>
          <a href="#about-us" className="btn-primary btn-skew">
            KNOW MORE
          </a>
        </div>

        {/* Right Column: Hexagonal auto-carousel */}
        <div className="hero-graphics">
          <div className="hero-shapes-container">
            {/* Slide 0: Blue Valve + Welder (Overlapping) */}
            <div className={`hero-slide ${currentSlide === 0 ? 'active' : ''}`}>
              <div className="hexagon-wrapper yellow shape-top-left">
                <div className="hexagon-inner img-blue-valve"></div>
              </div>
              <div className="hexagon-wrapper blue shape-bottom-right">
                <div className="hexagon-inner img-welder"></div>
              </div>
            </div>

            {/* Slide 1: Tech Assembling (Single Large Center) */}
            <div className={`hero-slide ${currentSlide === 1 ? 'active' : ''}`}>
              <div className="hexagon-wrapper green shape-center-large">
                <div className="hexagon-inner img-tech-assembly"></div>
              </div>
            </div>

            {/* Slide 2: Valve Workshop + Quality Check (Overlapping) */}
            <div className={`hero-slide ${currentSlide === 2 ? 'active' : ''}`}>
              <div className="hexagon-wrapper blue shape-top-right">
                <div className="hexagon-inner img-valve-workshop"></div>
              </div>
              <div className="hexagon-wrapper yellow shape-bottom-left">
                <div className="hexagon-inner img-quality-check"></div>
              </div>
            </div>

            {/* Slide 3: Blue & Yellow Pipes (Overlapping) */}
            <div className={`hero-slide ${currentSlide === 3 ? 'active' : ''}`}>
              <div className="hexagon-wrapper yellow shape-top-right">
                <div className="hexagon-inner img-blue-pipes"></div>
              </div>
              <div className="hexagon-wrapper blue shape-bottom-left">
                <div className="hexagon-inner img-yellow-pipes"></div>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="hero-slider-dots">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <span
                  key={idx}
                  className={`hero-slider-dot ${currentSlide === idx ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                  role="button"
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
