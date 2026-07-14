import React, { useState, useEffect, useRef } from 'react';
import './AboutPage.css';

// Custom Count Up hook for stats counter animation
function useCountUp(endVal, duration = 1500, trigger = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const end = parseInt(endVal, 10);
    if (isNaN(end)) {
      setCount(endVal);
      return;
    }
    const totalMiliseconds = duration;
    const incrementTime = 30;
    const totalSteps = totalMiliseconds / incrementTime;
    const stepVal = end / totalSteps;

    const timer = setInterval(() => {
      start += stepVal;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [endVal, duration, trigger]);

  return count;
}

export default function AboutPage() {
  const [statsTriggered, setStatsTriggered] = useState(false);
  const [progressTriggered, setProgressTriggered] = useState(false);
  
  const statsRef = useRef(null);
  const progressRef = useRef(null);

  // Intersection Observer to trigger reveals and hook updates
  useEffect(() => {
    // 1. Reveal on scroll observer
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    reveals.forEach((el) => revealObserver.observe(el));

    // 2. Observer for triggering count-up counters
    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsTriggered(true);
          statsObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    // 3. Observer for triggering progress bars fill
    const progressObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProgressTriggered(true);
          progressObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) statsObserver.observe(statsRef.current);
    if (progressRef.current) progressObserver.observe(progressRef.current);

    return () => {
      revealObserver.disconnect();
      if (statsRef.current) statsObserver.disconnect();
      if (progressRef.current) progressObserver.disconnect();
    };
  }, []);

  // Stats values
  const supplyHistoryCount = useCountUp(70, 1500, statsTriggered);
  const productionCount = useCountUp(7500, 1500, statsTriggered);
  const happyClientsCount = useCountUp(98, 1500, statsTriggered);

  // Government Client Logos
  const govLogos = [
    { src: "/uploads/2025/04/logo6.png", alt: "Client Logo 6" },
    { src: "/uploads/2025/04/logo8.png", alt: "Client Logo 8" },
    { src: "/uploads/2025/04/logo9.png", alt: "Client Logo 9" },
    { src: "/uploads/2025/04/logo10.png", alt: "Client Logo 10" },
    { src: "/uploads/2025/04/logo-7.png", alt: "Client Logo 7" },
    { src: "/uploads/2025/04/logo11-1.jpg", alt: "Client Logo 11" },
    { src: "/uploads/2025/04/logo12.jpg", alt: "Client Logo 12" },
    { src: "/uploads/2025/04/logo13-4.jpg", alt: "Client Logo 13" },
    { src: "/uploads/2025/04/logo14.jpg", alt: "Client Logo 14" }
  ];

  // Private Client Logos
  const privateLogos = [
    { src: "/uploads/2025/04/logo1-1.png", alt: "Client Logo 1" },
    { src: "/uploads/2025/04/logo5-1.png", alt: "Client Logo 5" },
    { src: "/uploads/2025/04/logo14-1.png", alt: "Client Logo 14-1" },
    { src: "/uploads/2025/04/logo2-1.png", alt: "Client Logo 2" },
    { src: "/uploads/2025/04/logo3-1.png", alt: "Client Logo 3" },
    { src: "/uploads/2025/04/logo16-1.jpg", alt: "Client Logo 16" },
    { src: "/uploads/2025/04/images-1.jpg", alt: "Client Logo Images 1" },
    { src: "/uploads/2025/04/logo-16-1.jpg", alt: "Client Logo 16-1" },
    { src: "/uploads/2025/04/logo17-1.jpg", alt: "Client Logo 17" }
  ];

  // Certificates
  const certificates = [
    "/uploads/2025/04/certified-logo-5-1.png",
    "/uploads/2025/04/certified-logo-5.png",
    "/uploads/2025/04/certified-logo-6.png",
    "/uploads/2025/04/certified-logo-7-1.png",
    "/uploads/2025/04/certified-logo1-1.png",
    "/uploads/2025/04/certified-logo3.png",
    "/uploads/2025/04/certified-logo4.png"
  ];

  // Map Locator Pins (Coordinates in percentage: left, top)
  const mapPins = [
    { name: "Kolkata (HQ)", left: "80%", top: "48%", delay: "0s" },
    { name: "Delhi", left: "40%", top: "28%", delay: "0.2s" },
    { name: "Mumbai", left: "28%", top: "62%", delay: "0.4s" },
    { name: "Chennai", left: "54%", top: "78%", delay: "0.6s" },
    { name: "Bengaluru", left: "44%", top: "76%", delay: "0.8s" }
  ];

  return (
    <div className="about-page-wrapper bg-[#f8f9fa]">
      
      {/* 1. Header Banner */}
      <section 
        className="about-banner"
        style={{ backgroundImage: "url('/uploads/2025/04/service5.jpg')" }}
      >
        <div className="about-banner-content reveal reveal-fade">
          <h1 className="about-banner-title">
            About Us
          </h1>
          <div className="about-banner-bar"></div>
        </div>
      </section>

      {/* 2. Main About Section */}
      <section className="about-page-section bg-slate">
        <div className="container">
          <div className="about-two-col-grid">
            
            {/* Left: Overlapping Image Display */}
            <div className="about-graphics-wrapper reveal reveal-left">
              <div className="about-graphics-inner">
                <div className="about-graphics-deco"></div>
                <div className="about-graphics-img">
                  <img src="/uploads/2025/04/banner-image3.jpg" alt="GM Dalui & Sons Plant" />
                </div>
              </div>
            </div>

            {/* Right: Copywriting Block */}
            <div className="about-content reveal reveal-right">
              <div className="section-badge">About Us</div>
              <h2 className="section-title">We Have Been Working Very Efficiently</h2>
              <div className="about-text text-justify">
                <p className="mb-4 text-slate-600">
                  At <strong>GM Dalui &amp; Sons Pvt. Ltd.</strong> We believe in engineering and excellence and redefining industry standards. With decades of expertise in manufacturing and innovation, our journey has been one of relentless progress and commitment to quality.
                </p>
                <p className="mb-4 text-slate-600">
                  GM Dalui &amp; Sons Pvt. Ltd. is transforming! With cutting-edge modernization, innovation, and an unwavering commitment to excellence, we are redefining industry standards. The future is here - bigger, bolder, and better than ever! Stay with us on this journey of growth and success.
                </p>
                <blockquote className="about-quote">
                  "We are entering a bold new era - one driven by modernization, advanced technology, and customer-centric solutions."
                </blockquote>
              </div>
            </div>

          </div>

          {/* Counter Stats crimson bar */}
          <div 
            ref={statsRef}
            className="about-stats-banner reveal reveal-fade"
          >
            <div className="about-stats-grid">
              
              <div className="about-stat-item reveal" style={{ transitionDelay: '0.1s' }}>
                <div className="about-stat-icon">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <div className="about-stat-number">
                  {supplyHistoryCount}%
                </div>
                <div className="about-stat-label">
                  Supply History
                </div>
              </div>

              <div className="about-stat-item reveal" style={{ transitionDelay: '0.25s' }}>
                <div className="about-stat-icon">
                  <i className="fas fa-hands"></i>
                </div>
                <div className="about-stat-number">
                  {productionCount}+
                </div>
                <div className="about-stat-label">
                  Our Production
                </div>
              </div>

              <div className="about-stat-item reveal" style={{ transitionDelay: '0.4s' }}>
                <div className="about-stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="about-stat-number">
                  {happyClientsCount}%
                </div>
                <div className="about-stat-label">
                  Happy Clients
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. Vision & Mission Side-by-Side Grid */}
      <section className="about-page-section bg-white">
        <div className="container">
          <div className="text-center mb-12 reveal">
            <div className="section-badge centered">Our Core Principles</div>
            <h2 className="section-title text-center">Redefining Future Industry Standards</h2>
          </div>

          <div className="about-cards-grid">
            
            {/* Vision Card */}
            <div className="about-card reveal reveal-left">
              <div className="about-card-header">
                <div className="about-card-icon">
                  <i className="fas fa-eye"></i>
                </div>
                <h3 className="about-card-title">Our Vision</h3>
              </div>
              <p className="about-card-body">
                Our vision is to be a globally recognized leader in industrial manufacturing, setting benchmarks for quality, innovation, and service excellence. We aim to continuously evolve, expand, and innovate to meet the changing demands of the industry while maintaining a strong ethical foundation and a commitment to sustainable and responsible business practice. Through strategic growth and operational excellence, we envision a future where GM Dalui &amp; Sons Pvt. Ltd. stands as a symbol of trust, performance, and technological advancement.
              </p>
            </div>

            {/* Mission Card */}
            <div className="about-card accent reveal reveal-right">
              <div className="about-card-header">
                <div className="about-card-icon">
                  <i className="fas fa-rocket"></i>
                </div>
                <h3 className="about-card-title">Our Mission</h3>
              </div>
              <p className="about-card-body">
                At GM Dalui &amp; Sons Pvt. Ltd. our mission is to deliver high-quality, technologically advanced, and reliable engineering solutions that empower industries to operate efficiently. We are committed to innovation, excellence, and customer satisfaction, ensuring that our products and services consistently exceed industry standards. By integrating cutting-edge technology, sustainable practices, and a customer-centric approach, we strive to build long-lasting partnerships and drive industrial growth.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. What We Stand For Section (Progress bars & Strengths) */}
      <section ref={progressRef} className="about-page-section bg-slate">
        <div className="container">
          <div className="about-two-col-grid">
            
            {/* Left: Text and Progress Bars */}
            <div className="reveal reveal-left">
              <div className="section-badge">What We Stand For</div>
              <h2 className="section-title">Fast Growing Valves Manufacturer, Supplier &amp; Exporter</h2>
              
              <ul className="about-strengths-list">
                <li className="about-strength-item reveal" style={{ transitionDelay: '0.1s' }}>
                  <span className="about-strength-num">1</span>
                  <span>We never compromising quality precision engineered products that meet global standards.</span>
                </li>
                <li className="about-strength-item reveal" style={{ transitionDelay: '0.2s' }}>
                  <span className="about-strength-num">2</span>
                  <span>Innovation &amp; Technology a forward-thinking approach to industrial solutions.</span>
                </li>
                <li className="about-strength-item reveal" style={{ transitionDelay: '0.3s' }}>
                  <span className="about-strength-num">3</span>
                  <span>Customer centric approach dedicated service teams for seamless support.</span>
                </li>
              </ul>

              {/* Progress Bars container */}
              <div className="about-progress-container">
                <div className="about-progress-group reveal" style={{ transitionDelay: '0.4s' }}>
                  <div className="about-progress-labels">
                    <span>Production Excellence</span>
                    <span>75%</span>
                  </div>
                  <div className="about-progress-bar-bg">
                    <div 
                      className="about-progress-bar-fill"
                      style={{ width: progressTriggered ? "75%" : "0%" }}
                    ></div>
                  </div>
                </div>

                <div className="about-progress-group reveal" style={{ transitionDelay: '0.5s' }}>
                  <div className="about-progress-labels">
                    <span>Supply History Success</span>
                    <span>93%</span>
                  </div>
                  <div className="about-progress-bar-bg">
                    <div 
                      className="about-progress-bar-fill"
                      style={{ width: progressTriggered ? "93%" : "0%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Side Graphic Image */}
            <div className="reveal reveal-right">
              <div className="relative">
                <div className="absolute top-4 left-4 w-full h-full bg-[#8a4f50]/5 rounded-xl -z-10"></div>
                <img 
                  src="/uploads/2025/04/MISSION.jpg" 
                  alt="Industrial valves network installation" 
                  className="rounded-lg shadow-xl w-full object-cover max-h-[400px]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Government & Private Clients Grids */}
      <section className="about-page-section bg-white about-logos-section">
        <div className="container">
          
          {/* Government Clients */}
          <div className="mb-16">
            <div className="text-center mb-8 reveal">
              <div className="section-badge centered">Official Partners</div>
              <h3 className="section-title text-center">Government Clients</h3>
            </div>
            
            <div className="about-logos-grid">
              {govLogos.map((logo, index) => (
                <div 
                  key={index} 
                  className="about-logo-item reveal"
                  style={{ transitionDelay: `${index * 0.08}s` }}
                >
                  <img src={logo.src} alt={logo.alt} />
                </div>
              ))}
            </div>
          </div>

          {/* Private Clients */}
          <div className="pt-8 border-t border-slate-100">
            <div className="text-center mb-8 reveal">
              <div className="section-badge centered">Industrial Footprint</div>
              <h3 className="section-title text-center">Private Clients</h3>
            </div>
            
            <div className="about-logos-grid">
              {privateLogos.map((logo, index) => (
                <div 
                  key={index} 
                  className="about-logo-item reveal"
                  style={{ transitionDelay: `${index * 0.08}s` }}
                >
                  <img src={logo.src} alt={logo.alt} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 6. Certifications & Approvals image slider */}
      <section className="about-page-section bg-slate">
        <div className="container">
          <div className="text-center mb-12 reveal">
            <div className="section-badge centered">Accreditation &amp; Quality</div>
            <h2 className="section-title text-center">Our awards and certificates represent our commitment to providing top-quality service</h2>
          </div>

          <div className="about-certs-slider">
            {certificates.map((certSrc, idx) => (
              <div 
                key={idx} 
                className="about-cert-item reveal"
                style={{ transitionDelay: `${idx * 0.1}s` }}
              >
                <img src={certSrc} alt={`Accreditation Badge ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. India Footprints Map Section */}
      <section className="about-page-section bg-white">
        <div className="container">
          <div className="about-two-col-grid">
            
            {/* Map Image with Pulsing Pins */}
            <div className="about-map-container reveal reveal-left">
              <div className="about-map-inner">
                <img src="/uploads/2025/05/Untitled-design-2.jpg" alt="GM Dalui Footprints Across India" />
                
                {/* Interactive Pulsing Map Pins */}
                {mapPins.map((pin, index) => (
                  <div 
                    key={index} 
                    className="about-map-pin"
                    style={{ left: pin.left, top: pin.top }}
                  >
                    <span className="about-map-pin-dot"></span>
                    <div className="about-map-pin-tooltip">
                      {pin.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Copywrite Details */}
            <div className="reveal reveal-right">
              <div className="section-badge">Sales Network</div>
              <h2 className="section-title">Our Footprints Across India</h2>
              <div className="about-text leading-relaxed space-y-4">
                <p>
                  We have built a strong network of distribution partners, distributors, and representatives across all key industrial hubs in India.
                </p>
                <p>
                  Our high-performance industrial valves are successfully installed in large water supplies, steel manufacturing complexes, petrochemical plants, and infrastructure installations nationwide.
                </p>
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#f8f9fa] border-l-4 border-[#8a4f50] rounded-r-lg">
                    <div className="font-extrabold text-[#8a4f50] text-2xl">25+</div>
                    <div className="text-slate-500 text-xs uppercase font-bold mt-1">States Covered</div>
                  </div>
                  <div className="p-4 bg-[#f8f9fa] border-l-4 border-[#f59019] rounded-r-lg">
                    <div className="font-extrabold text-[#f59019] text-2xl">500+</div>
                    <div className="text-slate-500 text-xs uppercase font-bold mt-1">Major Installs</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
