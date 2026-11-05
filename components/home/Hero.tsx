'use client';

import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';

// The hero's LCP element is one of slide 0's two hexagons. They are CSS background
// images in Hero.css, so the browser only discovers them after it has parsed the
// stylesheet and laid the section out; preloading puts them in flight from <head>.
// They are now the only above-the-fold images, so there is no other candidate to
// starve. shortcut: the two URLs are duplicated from Hero.css .img-blue-valve /
// .img-welder — if those rules change, change these too. Move both to <Image> with
// preload if the hexagons ever stop being CSS backgrounds.
const SLIDE_0_IMAGES = [
  '/uploads/2025/04/product1-1.webp',
  '/uploads/2025/09/IMG_4648.webp',
];

export default function Hero() {
  SLIDE_0_IMAGES.forEach((href) =>
    ReactDOM.preload(href, { as: 'image', fetchPriority: 'high' })
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  // Slides 1-3 are ~340 KB of CSS background images. They sit above the fold but are
  // invisible (opacity 0, not display:none), so the browser used to fetch all of them
  // in the LCP race against slide 0. Hold their classes back until the page has loaded
  // — the first rotation is 4.5 s away, so they are always in place in time.
  const [preloadRest, setPreloadRest] = useState(false);
  const totalSlides = 4;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4500); // Auto rotate every 4.5 seconds
    return () => clearInterval(timer);
  }, [totalSlides]);

  useEffect(() => {
    const reveal = () => setPreloadRest(true);
    // 'load' has already fired when readyState is 'complete', so it would never arrive.
    if (document.readyState === 'complete') {
      const id = setTimeout(reveal, 0);
      return () => clearTimeout(id);
    }
    window.addEventListener('load', reveal);
    return () => window.removeEventListener('load', reveal);
  }, []);

  // Image class is withheld until load; a dot click still forces its slide's image in.
  const inner = (imgClass: string, slide: number) =>
    `hexagon-inner ${preloadRest || currentSlide === slide ? imgClass : ''}`;

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
                <div className={inner('img-tech-assembly', 1)}></div>
              </div>
            </div>

            {/* Slide 2: Valve Workshop + Quality Check (Overlapping) */}
            <div className={`hero-slide ${currentSlide === 2 ? 'active' : ''}`}>
              <div className="hexagon-wrapper blue shape-top-right">
                <div className={inner('img-valve-workshop', 2)}></div>
              </div>
              <div className="hexagon-wrapper yellow shape-bottom-left">
                <div className={inner('img-quality-check', 2)}></div>
              </div>
            </div>

            {/* Slide 3: Blue & Yellow Pipes (Overlapping) */}
            <div className={`hero-slide ${currentSlide === 3 ? 'active' : ''}`}>
              <div className="hexagon-wrapper yellow shape-top-right">
                <div className={inner('img-blue-pipes', 3)}></div>
              </div>
              <div className="hexagon-wrapper blue shape-bottom-left">
                <div className={inner('img-yellow-pipes', 3)}></div>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="hero-slider-dots">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                // A span with role="button" is not keyboard reachable; a real button is.
                <button
                  key={idx}
                  type="button"
                  className={`hero-slider-dot ${currentSlide === idx ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={currentSlide === idx}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
