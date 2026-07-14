import React from 'react';
import './Footer.css';

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
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
              <li><a href="#home">Home</a></li>
              <li><a href="#about-us">About Us</a></li>
              <li><a href="#/valves">Valves</a></li>
              <li><a href="#/other-valves">Other Valves</a></li>
              <li><a href="#/other-products">Other Products</a></li>
              <li><a href="#/feedback">Feedback</a></li>
            </ul>
          </div>

          {/* Column 3: Products links */}
          <div className="footer-col products-col">
            <h3>Products</h3>
            <ul className="footer-links-list">
              <li><a href="#products">Butterfly Valves</a></li>
              <li><a href="#products">Air Valves</a></li>
              <li><a href="#products">Sluice Valves</a></li>
              <li><a href="#products">Manual Valves</a></li>
              <li><a href="#products">Non-Return Valves</a></li>
              <li><a href="#products">Control Valves</a></li>
              <li><a href="#products">Regulating Valves</a></li>
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
