'use client';

import Link from 'next/link';

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer id="footer" className="site-footer-sec">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: About company */}
          <div className="footer-col about-col">
            <img src="/uploads/2025/04/header-final-logo.png" alt="GM Dalui Logo" className="footer-logo" />
            <p className="footer-about-text">
              At GM Dalui &amp; Sons Pvt. Ltd. our valves are delivered in an extensive variety of materials and compositions and we can custom produce your design.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com/sitepad" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/sitepad" target="_blank" rel="noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com/sitepad" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://facebook.com/sitepad" target="_blank" rel="noreferrer" aria-label="Pinterest">
                <i className="fab fa-pinterest-p"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col links-col">
            <h3>Quick Links</h3>
            <ul className="footer-links-list">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/valves">Valves</Link></li>
              <li><Link href="/other-valves">Other Valves</Link></li>
              <li><Link href="/other-products">Other Products</Link></li>
            </ul>
          </div>

          {/* Column 3: Products links */}
          <div className="footer-col products-col">
            <h3>Products</h3>
            <ul className="footer-links-list">
              <li><Link href="/#products">Butterfly Valves</Link></li>
              <li><Link href="/#products">Air Valves</Link></li>
              <li><Link href="/#products">Sluice Valves</Link></li>
              <li><Link href="/#products">Manual Valves</Link></li>
              <li><Link href="/#products">Non-Return Valves</Link></li>
              <li><Link href="/#products">Control Valves</Link></li>
              <li><Link href="/#products">Regulating Valves</Link></li>
            </ul>
          </div>

          {/* Column 4: Get In Touch */}
          <div className="footer-col contact-col">
            <h3>Get In Touch</h3>
            <div className="footer-contact-item">
              <div className="contact-icon-box">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="contact-info-text">
                <p className="contact-label">Phone Support</p>
                <a href="tel:+919147176248">+91 9147176248</a>
              </div>
            </div>

            <div className="footer-contact-item">
              <div className="contact-icon-box">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="contact-info-text">
                <p className="contact-label">Email Support</p>
                <a href="mailto:info@gmdalui.co.in">info@gmdalui.co.in</a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom copyright bar */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GM Dalui &amp; Sons Pvt. Ltd. All Rights Reserved.</p>
          <button className="btn-scroll-top" onClick={handleScrollToTop} aria-label="Scroll to top">
            <i className="fas fa-arrow-up"></i>
          </button>
        </div>
      </div>
    </footer>
  );
}
