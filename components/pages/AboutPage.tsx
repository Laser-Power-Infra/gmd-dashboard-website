'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

// Custom Count Up hook for stats counter animation
function useCountUp(endVal: number, duration = 1500, trigger = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const end = endVal;
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

// alt is the organisation each mark belongs to, read off the artwork; width/height are
// the files' intrinsic pixel sizes, used only to reserve the right aspect ratio.
// Government Client Logos
const govLogos = [
  { src: '/uploads/2025/04/logo6.webp', alt: 'Tata Steel', width: 262, height: 155 },
  { src: '/uploads/2025/04/logo8.webp', alt: 'Power Grid Corporation of India', width: 262, height: 155 },
  { src: '/uploads/2025/04/logo9.webp', alt: 'ISCO', width: 262, height: 155 },
  { src: '/uploads/2025/04/logo10.webp', alt: 'GAIL (India) Limited', width: 262, height: 155 },
  { src: '/uploads/2025/04/logo-7.webp', alt: 'SAIL — Steel Authority of India Limited', width: 262, height: 155 },
  { src: '/uploads/2025/04/logo11-1.webp', alt: 'NTPC Limited', width: 281, height: 165 },
  { src: '/uploads/2025/04/logo12.webp', alt: 'BHEL — Bharat Heavy Electricals Limited', width: 250, height: 200 },
  { src: '/uploads/2025/04/logo13-4.webp', alt: 'FCIL — Fertiliser Corporation of India Limited', width: 124, height: 132 },
  { src: '/uploads/2025/04/logo14.webp', alt: 'Vizag Steel — Rashtriya Ispat Nigam Limited', width: 157, height: 138 },
];

// Private Client Logos
const privateLogos = [
  { src: '/uploads/2025/04/logo1-1.webp', alt: 'Tata Projects', width: 250, height: 131 },
  { src: '/uploads/2025/04/logo5-1.webp', alt: 'LCC Projects Pvt. Ltd.', width: 262, height: 132 },
  { src: '/uploads/2025/04/logo14-1.webp', alt: 'L&T Construction', width: 380, height: 95 },
  { src: '/uploads/2025/04/logo2-1.webp', alt: 'Adani Power', width: 250, height: 131 },
  { src: '/uploads/2025/04/logo3-1.webp', alt: 'NCC Limited', width: 250, height: 131 },
  { src: '/uploads/2025/04/logo16-1.webp', alt: 'GVPR Engineers', width: 178, height: 64 },
  { src: '/uploads/2025/04/images-1.webp', alt: 'Blue Star', width: 218, height: 63 },
  { src: '/uploads/2025/04/logo-16-1.webp', alt: 'Shapoorji Pallonji', width: 225, height: 93 },
  { src: '/uploads/2025/04/logo17-1.webp', alt: 'Wilo', width: 192, height: 93 },
];

// Certificates
const certificates = [
  { src: '/uploads/2025/04/certified-logo-5-1.webp', alt: 'WRAS — Water Regulations Advisory Scheme approval', width: 250, height: 81 },
  { src: '/uploads/2025/04/certified-logo-5.webp', alt: 'ISO 9001:2015 certified company', width: 134, height: 134 },
  { src: '/uploads/2025/04/certified-logo-6.webp', alt: 'American Water Works Association membership', width: 234, height: 109 },
  { src: '/uploads/2025/04/certified-logo-7-1.webp', alt: 'BIS — Bureau of Indian Standards certification', width: 175, height: 119 },
  { src: '/uploads/2025/04/certified-logo1-1.webp', alt: 'CE marking', width: 250, height: 179 },
  { src: '/uploads/2025/04/certified-logo3.webp', alt: 'BSI certification', width: 250, height: 122 },
  { src: '/uploads/2025/04/certified-logo4.webp', alt: 'ASTM International membership', width: 250, height: 122 },
];

// Map Locator Pins (Coordinates in percentage: left, top)
const mapPins = [
  { name: 'Kolkata (HQ)', left: '80%', top: '48%', delay: '0s' },
  { name: 'Delhi', left: '40%', top: '28%', delay: '0.2s' },
  { name: 'Mumbai', left: '28%', top: '62%', delay: '0.4s' },
  { name: 'Chennai', left: '54%', top: '78%', delay: '0.6s' },
  { name: 'Bengaluru', left: '44%', top: '76%', delay: '0.8s' },
];

export default function AboutPage({ valveTypesCount: valveTypes }: { valveTypesCount: number }) {
  const [statsTriggered, setStatsTriggered] = useState(false);

  const statsRef = useRef<HTMLDivElement | null>(null);

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

    if (statsRef.current) statsObserver.observe(statsRef.current);

    return () => {
      revealObserver.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  // Counts below are the site's own catalogue figures, not marketing claims
  const valveTypesCount = useCountUp(valveTypes, 1500, statsTriggered);
  const clientLogosCount = useCountUp(govLogos.length + privateLogos.length, 1500, statsTriggered);

  return (
    <div className="about-page-wrapper bg-[#f8f9fa]">
      {/* 1. Header Banner */}
      <section
        className="about-banner"
        style={{ backgroundImage: "url('/uploads/2025/04/service5.webp')" }}
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
                  {/* fill: the wrapper is already position:absolute and sized by its parent. */}
                  <Image
                    src="/uploads/2025/04/banner-image3.webp"
                    alt="Valves and pipework at the GM Dalui & Sons manufacturing plant"
                    fill
                    sizes="(max-width: 992px) 100vw, 45vw"
                  />
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
                  &quot;We are entering a bold new era - one driven by modernization, advanced technology, and customer-centric solutions.&quot;
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
                  {valveTypesCount}
                </div>
                <div className="about-stat-label">
                  Valve Types Manufactured
                </div>
              </div>

              <div className="about-stat-item reveal" style={{ transitionDelay: '0.25s' }}>
                <div className="about-stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="about-stat-number">
                  {clientLogosCount}
                </div>
                <div className="about-stat-label">
                  Client Organisations Served
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
      <section className="about-page-section bg-slate">
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
            </div>

            {/* Right: Side Graphic Image */}
            <div className="reveal reveal-right">
              <div className="relative">
                <div className="absolute top-4 left-4 w-full h-full bg-[#8a4f50]/5 rounded-xl -z-10"></div>
                <Image
                  src="/uploads/2025/04/MISSION.webp"
                  alt="Rows of finished valves on the GM Dalui assembly floor"
                  width={814}
                  height={543}
                  sizes="(max-width: 992px) 100vw, 45vw"
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
                  <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} sizes="160px" />
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
                  <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} sizes="160px" />
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
            {certificates.map((cert, idx) => (
              <div
                key={cert.src}
                className="about-cert-item reveal"
                style={{ transitionDelay: `${idx * 0.1}s` }}
              >
                <Image src={cert.src} alt={cert.alt} width={cert.width} height={cert.height} sizes="130px" />
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
                <Image
                  src="/uploads/2025/05/Untitled-design-2.webp"
                  alt="Map of India marking GM Dalui & Sons sites in Kolkata, Delhi, Mumbai, Chennai and Bengaluru"
                  width={500}
                  height={500}
                  sizes="(max-width: 992px) 100vw, 45vw"
                />

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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
