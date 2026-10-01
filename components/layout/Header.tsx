'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuote } from './QuoteProvider';

function activePage(pathname: string): string {
  if (pathname === '/' || pathname === '') return 'home';
  const first = pathname.split('/')[1];
  if (first === 'valve-detail') return 'valve-detail';
  return first || 'home';
}

export default function Header({
  desktopAdminSlot,
  mobileAdminSlot,
  desktopAuthSlot,
  mobileAuthSlot,
}: {
  desktopAdminSlot?: ReactNode;
  mobileAdminSlot?: ReactNode;
  desktopAuthSlot?: ReactNode;
  mobileAuthSlot?: ReactNode;
}) {
  const { openQuote } = useQuote();
  const pathname = usePathname();
  const currentPage = activePage(pathname);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    closeMobileMenu();
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
          <Link href="/" className="site-logo" onClick={handleLinkClick}>
            <img src="/uploads/2025/04/header-final-logo.png" alt="GM Dalui & Sons Logo" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="nav-menu">
            <ul>
              <li>
                <Link
                  href="/"
                  className={currentPage === 'home' ? 'active-nav-link' : ''}
                  onClick={handleLinkClick}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={currentPage === 'about' ? 'active-nav-link' : ''}
                  onClick={handleLinkClick}
                >
                  About Us
                </Link>
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
                      <Link href="/valves" onClick={handleLinkClick}>
                        Types
                      </Link>
                    </li>
                    <li>
                      <Link href="/purchase" onClick={handleLinkClick}>
                        Purchase Now
                      </Link>
                    </li>
                    <li>
                      <Link href="/product-industry" onClick={handleLinkClick}>
                        Industry
                      </Link>
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
                      <Link
                        href="/amc"
                        onClick={handleLinkClick}
                        className={currentPage === 'amc' ? 'active' : ''}
                      >
                        AMC
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/cmc"
                        onClick={handleLinkClick}
                        className={currentPage === 'cmc' ? 'active' : ''}
                      >
                        CMC
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/complaints"
                        onClick={handleLinkClick}
                        className={currentPage === 'complaints' ? 'active' : ''}
                      >
                        Complaints
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/performance-review"
                        onClick={handleLinkClick}
                        className={currentPage === 'performance-review' ? 'active' : ''}
                      >
                        Performance Review
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/development"
                        onClick={handleLinkClick}
                        className={currentPage === 'development' ? 'active' : ''}
                      >
                        Development
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/engineering-data"
                        onClick={handleLinkClick}
                        className={currentPage === 'engineering-data' ? 'active' : ''}
                      >
                        Engineering Data
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="nav-dropdown-item">
                <a
                  href="#technical"
                  onClick={(e) => e.preventDefault()}
                  className={`dropdown-toggle ${currentPage === 'risk-management' || currentPage === 'usages' || currentPage === 'safety-plan' || currentPage === 'manuals' || currentPage === 'development' || currentPage === 'engineering-data' ? 'active-nav-link' : ''}`}
                >
                  Technical <i className="fas fa-chevron-down caret-icon"></i>
                </a>
                <div className="nav-dropdown-menu">
                  <ul>
                    <li>
                      <Link
                        href="/usages"
                        onClick={handleLinkClick}
                        className={currentPage === 'usages' ? 'active' : ''}
                      >
                        Usages
                      </Link>
                    </li>
                    <li className="nav-submenu-item">
                      <Link
                        href="/risk-management"
                        onClick={handleLinkClick}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        Risk Management <i className="fas fa-chevron-right sub-caret-icon"></i>
                      </Link>
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
                      <Link href="/safety-plan" onClick={handleLinkClick}>
                        Safety Plan
                      </Link>
                    </li>
                    <li>
                      <Link href="/manuals" onClick={handleLinkClick}>
                        Manuals of Valve
                      </Link>
                    </li>
                    <li>
                      <Link href="/development" onClick={handleLinkClick}>
                        Development
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={currentPage === 'contact' ? 'active-nav-link' : ''}
                  onClick={handleLinkClick}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/cost"
                  className={currentPage === 'cost' ? 'active-nav-link' : ''}
                  onClick={handleLinkClick}
                >
                  Cost
                </Link>
              </li>
            </ul>
          </nav>

          {/* Get Quote button and Hamburger Menu Toggler */}
          <div className="nav-actions">
            {desktopAuthSlot}
            {desktopAdminSlot}
            <button className="btn-quote" onClick={() => { closeMobileMenu(); openQuote(); }}>
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
            <li><Link href="/" onClick={handleLinkClick}>Home</Link></li>
            <li><Link href="/about" onClick={handleLinkClick}>About Us</Link></li>
            <li className="mobile-dropdown-item">
              <Link href="/valves" onClick={handleLinkClick}>Types</Link>
            </li>
            <li className="mobile-dropdown-item">
              <Link href="/usages" onClick={handleLinkClick}>Usages</Link>
            </li>

            <li><Link href="/#services" onClick={handleLinkClick}>Services</Link></li>
            <li className="mobile-dropdown-item">
              <Link href="/amc" onClick={handleLinkClick}>AMC</Link>
            </li>
            <li className="mobile-dropdown-item">
              <Link href="/cmc" onClick={handleLinkClick}>CMC</Link>
            </li>
            <li className="mobile-dropdown-item">
              <Link href="/complaints" onClick={handleLinkClick}>Complaints</Link>
            </li>
            <li className="mobile-dropdown-item">
              <Link href="/performance-review" onClick={handleLinkClick}>Performance Review</Link>
            </li>
            <li className="mobile-dropdown-item">
              <Link href="/apply-amc" onClick={handleLinkClick}>Apply AMC</Link>
            </li>
            <li><Link href="/manuals" onClick={handleLinkClick}>Manuals of Valve</Link></li>
            <li><Link href="/#why-choose-us" onClick={handleLinkClick}>Technical</Link></li>
            <li className="mobile-dropdown-item">
              <Link href="/risk-management" onClick={handleLinkClick}>Risk Management</Link>
            </li>
            <li className="mobile-dropdown-item">
              <a href="/Quality_Manual.pdf" target="_blank" rel="noopener noreferrer">Quality Manual PDF</a>
            </li>
            <li className="mobile-dropdown-item">
              <Link href="/engineering-data" onClick={handleLinkClick}>Engineering Data</Link>
            </li>
            <li><Link href="/#footer" onClick={handleLinkClick}>Contact</Link></li>
            <li><Link href="/cost" onClick={handleLinkClick}>Cost</Link></li>
            {mobileAuthSlot}
            {mobileAdminSlot}
            <li className="mobile-action-li">
              <button className="btn-mobile-quote" onClick={() => { closeMobileMenu(); openQuote(); }}>
                Get Quote
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
