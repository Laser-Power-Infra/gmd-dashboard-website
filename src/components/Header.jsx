import React, { useState } from 'react';
import './Header.css';

export default function Header({ onOpenQuote, currentPage, onNavigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = (e, page, sectionId = null) => {
    e.preventDefault();
    closeMobileMenu();
    onNavigate(page, sectionId);
  };

  return (
    <header className="site-header">
      {/* Top Bar info */}
      <div className="top-bar">
        <div className="container top-bar-container">
          <div className="contact-info">
            <a href="mailto:info@gmdalui.co.in" className="contact-link">
              <i className="fas fa-envelope"></i> info@gmdalui.co.in
            </a>
            <span className="contact-divider">|</span>
            <span className="contact-address">
              <i className="fas fa-map-marker-alt"></i> ADVENTZ INFINITY@5 BN Block, 19 Floor-North Wing, Saltlake, Sector-5, Kolkata-700091
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a href="/Quality_Manual.pdf" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#fb923c', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <i className="fas fa-download"></i> Download QA
            </a>
            <div className="social-links">
              <a href="https://twitter.com/sitepad" target="_blank" rel="noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://facebook.com/sitepad" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://linkedin.com/sitepad" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="main-nav-bar">
        <div className="container nav-container">
          <a href="#" className="site-logo" onClick={(e) => handleLinkClick(e, 'home')}>
            <img src="/uploads/2025/04/header-final-logo.png" alt="GM Dalui & Sons Logo" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="nav-menu">
            <ul>
              <li>
                <a 
                  href="#home" 
                  className={currentPage === 'home' ? 'active-nav-link' : ''} 
                  onClick={(e) => handleLinkClick(e, 'home')}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#about-us" 
                  className={currentPage === 'about' ? 'active-nav-link' : ''} 
                  onClick={(e) => handleLinkClick(e, 'about')}
                >
                  About Us
                </a>
              </li>
              <li className="nav-dropdown-item">
                <a 
                  href="#products" 
                  onClick={(e) => e.preventDefault()}
                  className={`dropdown-toggle ${currentPage === 'valves' || currentPage === 'valve-detail' || currentPage === 'other-valves' || currentPage === 'other-products' || currentPage === 'product-industry' ? 'active-nav-link' : ''}`}
                >
                  Products <i className="fas fa-chevron-down caret-icon"></i>
                </a>
                <div className="nav-dropdown-menu">
                  <ul>
                    <li>
                      <a 
                        href="#valves" 
                        onClick={(e) => handleLinkClick(e, 'valves')}
                      >
                        Types
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#purchase" 
                        onClick={(e) => handleLinkClick(e, 'purchase')}
                      >
                        Purchase Now
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#product-industry" 
                        onClick={(e) => handleLinkClick(e, 'product-industry')}
                      >
                        Industry
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="nav-dropdown-item services-dropdown">
                <a 
                  href="#services" 
                  onClick={(e) => e.preventDefault()}
                  className={`dropdown-toggle ${currentPage === 'services' || currentPage === 'cmc' || currentPage === 'amc' ? 'active-nav-link' : ''}`}
                >
                  Services <i className="fas fa-chevron-down caret-icon"></i>
                </a>
                <div className="nav-dropdown-menu">
                  <ul>
                    <li>
                      <a 
                        href="#/amc" 
                        onClick={(e) => handleLinkClick(e, 'amc')}
                        className={currentPage === 'amc' ? 'active' : ''}
                      >
                        AMC
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#/cmc" 
                        onClick={(e) => handleLinkClick(e, 'cmc')}
                        className={currentPage === 'cmc' ? 'active' : ''}
                      >
                        CMC
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#/complaints" 
                        onClick={(e) => handleLinkClick(e, 'complaints')}
                        className={currentPage === 'complaints' ? 'active' : ''}
                      >
                        Complaints
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#/performance-review" 
                        onClick={(e) => handleLinkClick(e, 'performance-review')}
                        className={currentPage === 'performance-review' ? 'active' : ''}
                      >
                        Performance Review
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#/apply-amc" 
                        onClick={(e) => handleLinkClick(e, 'apply-amc')}
                        className={currentPage === 'apply-amc' ? 'active' : ''}
                      >
                        Apply AMC
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="nav-dropdown-item">
                <a 
                  href="#technical" 
                  onClick={(e) => e.preventDefault()}
                  className={`dropdown-toggle ${currentPage === 'risk-management' || currentPage === 'usages' || currentPage === 'safety-plan' || currentPage === 'manuals' || currentPage === 'development' ? 'active-nav-link' : ''}`}
                >
                  Technical <i className="fas fa-chevron-down caret-icon"></i>
                </a>
                <div className="nav-dropdown-menu">
                  <ul>
                    <li>
                      <a 
                        href="#/usages" 
                        onClick={(e) => handleLinkClick(e, 'usages')}
                        className={currentPage === 'usages' ? 'active' : ''}
                      >
                        Usages
                      </a>
                    </li>
                      <li className="nav-submenu-item">
                        <a 
                          href="#/risk-management" 
                          onClick={(e) => handleLinkClick(e, 'risk-management')}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          Risk Management <i className="fas fa-chevron-right sub-caret-icon"></i>
                        </a>
                        <div className="nav-submenu-menu">
                          <ul>
                            <li>
                              <a href="/Quality_Manual.pdf" target="_blank" rel="noopener noreferrer">
                                Quality Manual
                              </a>
                            </li>
                          </ul>
                        </div>
                      </li>
                    <li>
                      <a 
                        href="#/safety-plan" 
                        onClick={(e) => handleLinkClick(e, 'safety-plan')}
                      >
                        Safety Plan
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#/manuals" 
                        onClick={(e) => handleLinkClick(e, 'manuals')}
                      >
                        Manuals of Valve
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#/development" 
                        onClick={(e) => handleLinkClick(e, 'development')}
                      >
                        Development
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <a 
                  href="#/contact" 
                  className={currentPage === 'contact' ? 'active-nav-link' : ''} 
                  onClick={(e) => handleLinkClick(e, 'contact')}
                >
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="#feedback" 
                  className={currentPage === 'feedback' ? 'active-nav-link' : ''} 
                  onClick={(e) => handleLinkClick(e, 'feedback')}
                >
                  Feedback
                </a>
              </li>
            </ul>
          </nav>

          {/* Get Quote button and Hamburger Menu Toggler */}
          <div className="nav-actions">
            <button className="btn-quote" onClick={() => { closeMobileMenu(); onOpenQuote(); }}>
              <span className="btn-quote-inner">Get Quote</span>
            </button>
            <button className="hamburger-menu" onClick={toggleMobileMenu} aria-label="Toggle navigation">
              <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <ul>
            <li><a href="#home" onClick={(e) => handleLinkClick(e, 'home')}>Home</a></li>
            <li><a href="#about-us" onClick={(e) => handleLinkClick(e, 'about')}>About Us</a></li>
            <li className="mobile-dropdown-item">
              <a href="#valves" onClick={(e) => handleLinkClick(e, 'valves')}>Types</a>
            </li>
            <li className="mobile-dropdown-item">
              <a href="#usages" onClick={(e) => handleLinkClick(e, 'usages')}>Usages</a>
            </li>

            <li><a href="#services" onClick={(e) => handleLinkClick(e, 'home', 'services')}>Services</a></li>
            <li className="mobile-dropdown-item">
              <a href="#/amc" onClick={(e) => handleLinkClick(e, 'amc')}>AMC</a>
            </li>
            <li className="mobile-dropdown-item">
              <a href="#/cmc" onClick={(e) => handleLinkClick(e, 'cmc')}>CMC</a>
            </li>
            <li className="mobile-dropdown-item">
              <a href="#/complaints" onClick={(e) => handleLinkClick(e, 'complaints')}>Complaints</a>
            </li>
            <li className="mobile-dropdown-item">
              <a href="#/performance-review" onClick={(e) => handleLinkClick(e, 'performance-review')}>Performance Review</a>
            </li>
            <li className="mobile-dropdown-item">
              <a href="#/apply-amc" onClick={(e) => handleLinkClick(e, 'apply-amc')}>Apply AMC</a>
            </li>
            <li><a href="#warranty" onClick={(e) => handleLinkClick(e, 'warranty')}>Manuals of Valve</a></li>
            <li><a href="#why-choose-us" onClick={(e) => handleLinkClick(e, 'home', 'why-choose-us')}>Technical</a></li>
            <li className="mobile-dropdown-item">
              <a href="#/risk-management" onClick={(e) => handleLinkClick(e, 'risk-management')}>Risk Management</a>
            </li>
            <li className="mobile-dropdown-item">
              <a href="/Quality_Manual.pdf" target="_blank" rel="noopener noreferrer">Quality Manual PDF</a>
            </li>
            <li><a href="#footer" onClick={(e) => handleLinkClick(e, 'home', 'footer')}>Contact</a></li>
            <li><a href="#feedback" onClick={(e) => handleLinkClick(e, 'feedback')}>Feedback</a></li>
            <li className="mobile-action-li">
              <button className="btn-mobile-quote" onClick={() => { closeMobileMenu(); onOpenQuote(); }}>
                Get Quote
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
