import React, { useState, useEffect } from 'react';
import { valvesData } from './valvesData';
import { valveDetailsData } from './valveDetailsData';
import { otherProducts } from './otherProductsData';
import './ValveDetailPage.css';



export default function ValveDetailPage({ valveId, onBackToCatalog, onOpenQuote }) {
  // Find current valve by ID, fallback to butterfly if not found
  const rawValve = valvesData.find((v) => v.id === valveId) || otherProducts.find((p) => p.id === valveId) || valvesData[0];

  // normalize valve object so ValveDetailPage can render accessories too
  const valve = {
    features: [],
    standards: [],
    moc: [],
    pressure: [],
    operation: ['Manual'],
    endConnection: rawValve.endConnection || 'N/A',
    size: rawValve.size || 'Various',
    description: rawValve.description || (rawValve.usage ? rawValve.usage.join(' ') : ''),
    application: rawValve.application || '',
    image: rawValve.image,
    name: rawValve.name,
    category: rawValve.category || 'Other Accessories',
    id: rawValve.id,
    ...rawValve
  };

  const customDetail = valveDetailsData[valve.id];

  // Inquiry Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    valveSize: valve.size.split('Up to ')[1] || valve.size || '',
    pressure: valve.pressure[0] || '',
    operation: valve.operation[0].split(' (')[0] || '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Reset form when valve changes
  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      valveSize: valve.size.split('Up to ')[1] || valve.size || '',
      pressure: valve.pressure[0] || '',
      operation: valve.operation[0].split(' (')[0] || '',
      message: ''
    });
    setIsSubmitted(false);
    setValidationErrors({});
    window.scrollTo(0, 0);
  }, [valve]);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for that field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Form Submit Validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.valveSize.trim()) errors.valveSize = 'Required size is required';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Scroll to form error
      const formEl = document.getElementById('inquiry-form-container');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Submit Success Simulation
    setIsSubmitted(true);
  };

  return (
    <div className="valve-detail-page-wrapper">
      {/* Top Breadcrumb Navigation */}
      <div className="detail-breadcrumb-bar">
        <div className="container">
          <div className="breadcrumb-nav">
            <button className="back-catalog-btn" onClick={onBackToCatalog}>
              <i className="fas fa-arrow-left"></i> Back to Valve Catalog
            </button>
            <div className="breadcrumb-links">
              <span>Home</span>
              <i className="fas fa-chevron-right separator"></i>
              <span className="link-hover" onClick={onBackToCatalog}>Valves Catalog</span>
              <i className="fas fa-chevron-right separator"></i>
              <span className="current-page">{valve.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Valve Overview & Graphic */}
      <section className="detail-hero-section">
        <div className="container">
          <div className="detail-hero-grid">
            {/* Left Column: Valve Product Image */}
            <div className="detail-hero-graphic-col">
              <div className="detail-valve-image-container">
                <img src={valve.image} alt={valve.name} className="detail-valve-img" />
              </div>
              <div className="datasheet-downloads-row">
                <a href="#inquiry-form-container" className="download-btn-v2" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('inquiry-form-container').scrollIntoView({ behavior: 'smooth' });
                }}>
                  <i className="fas fa-file-pdf icon"></i> Request Datasheet PDF
                </a>
                <a href="#inquiry-form-container" className="download-btn-v2 border-only" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('inquiry-form-container').scrollIntoView({ behavior: 'smooth' });
                }}>
                  <i className="fas fa-file-alt icon"></i> Request CAD Drawing
                </a>
              </div>
            </div>

            {/* Right Column: Valve Basic Info */}
            <div className="detail-hero-info-col">
              <span className="detail-badge">{valve.category}</span>
              <h1 className="detail-title">{valve.name}</h1>
              
              <p className="detail-desc">{valve.description}</p>

              {customDetail && (
                <div className="custom-intro-box">
                  <h3>Introduction</h3>
                  <p>{customDetail.introduction}</p>
                </div>
              )}

              <div className="detail-key-features">
                <h3>Key Features</h3>
                <ul>
                  {valve.features.map((feature, idx) => (
                    <li key={idx}>
                      <i className="fas fa-check-circle check-icon"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="detail-quick-cta-row">
                <a 
                  href="#inquiry-form-container" 
                  className="btn-primary-detail"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('inquiry-form-container').scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <i className="fas fa-envelope"></i> Request Quick Quote
                </a>
                <button className="btn-secondary-detail" onClick={onOpenQuote}>
                  <i className="fas fa-phone-alt"></i> Speak to Sales Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications Tables */}
      <section className="detail-specs-section">
        <div className="container">
          <h2 className="section-heading-v2">Technical Specifications</h2>
          <div className="specs-table-wrapper">
            <table className="specs-table">
              <thead>
                <tr>
                  <th>Design Feature</th>
                  <th>Standard Parameters / Range Options</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Nominal Size Range</strong></td>
                  <td>{valve.size}</td>
                </tr>
                <tr>
                  <td><strong>Manufacturing Standards</strong></td>
                  <td>{valve.standards.join(', ')}</td>
                </tr>
                <tr>
                  <td><strong>Material of Construction (MOC)</strong></td>
                  <td>
                    <ul className="table-inline-list">
                      {valve.moc.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td><strong>Pressure Ratings</strong></td>
                  <td>{valve.pressure.join(' / ')}</td>
                </tr>
                <tr>
                  <td><strong>Modes of Operation</strong></td>
                  <td>{valve.operation.join(', ')}</td>
                </tr>
                <tr>
                  <td><strong>End Connections</strong></td>
                  <td>{valve.endConnection}</td>
                </tr>
                <tr>
                  <td><strong>Application Media</strong></td>
                  <td>{valve.application}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Custom Valve Sections (Applications and Types) */}
      {customDetail ? (
        <>
          {/* Applications Grid */}
          {customDetail.applications && customDetail.applications.length > 0 && (
            <section className="butterfly-custom-section grey-bg">
              <div className="container">
                <h2 className="section-heading-v2">Application & Usage of {valve.name}</h2>
                <div className="butterfly-app-grid">
                  {customDetail.applications.map((app, idx) => (
                    <div className="butterfly-app-card" key={idx}>
                      <div className="app-card-icon-num">{app.num || (idx + 1)}</div>
                      <h4>{app.title}</h4>
                      <p>{app.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Custom Subtype Sections (e.g. Connection Type, Disc Design) */}
          {customDetail.sections && customDetail.sections.map((sec, secIdx) => (
            <section 
              className={`butterfly-custom-section ${secIdx % 2 === 1 ? 'grey-bg' : ''}`} 
              key={secIdx}
            >
              <div className="container">
                <h2 className="section-heading-v2">{sec.title}</h2>
                <div className={`butterfly-type-grid ${sec.gridClass || 'col-3'}`}>
                  {sec.cards.map((card, cardIdx) => (
                    <div className="butterfly-type-card" key={cardIdx}>
                      {card.image && (
                        <div className="type-card-img-wrapper">
                          <img src={card.image} alt={card.title} />
                        </div>
                      )}
                      <div className="type-card-content">
                        <h4>{card.title}</h4>
                        <p>{card.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}

          {/* Certificates & Inspection (Common for all) */}
          <section className="detail-applications-section">
            <div className="container">
              <div className="app-grid">
                <div className="app-content-box">
                  <h2 className="section-heading-v2">Certificates & Inspection</h2>
                  <p>
                    All valves are subjected to rigorous hydrostatic shell and seat pressure testing in accordance with standard codes (e.g., API 598 / IS 14846) prior to delivery.
                  </p>
                  <ul className="inspections-list">
                    <li><i className="fas fa-microscope inspection-check"></i> Physical dimension and wall-thickness checks</li>
                    <li><i className="fas fa-shield-alt inspection-check"></i> Hydrostatic seat and shell test validation</li>
                    <li><i className="fas fa-certificate inspection-check"></i> Manufacturer Test Certificate (MTC) and third-party inspection (SGS, TUV, RINA, IRS etc.) available</li>
                    <li><i className="fas fa-paint-roller inspection-check"></i> Epoxy powder coating inspection (DFT test)</li>
                  </ul>
                </div>
                
                <div className="app-content-box">
                  <h2 className="section-heading-v2">Quality Assurance</h2>
                  <p>
                    GM Dalui & Sons Pvt. Ltd. is an ISO 9001:2015 certified manufacturer. Our commitment to safety, reliable sealing, and long service life is backed by rigorous material inspection, ultrasonic wall thickness checks, and design calculations.
                  </p>
                  <p>
                    We customize flow control systems to meet specific requirements for municipal waterworks, agricultural pumping wells, chemical distribution loops, and thermal power plant grids.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Default Industries Served for other valves */
        <section className="detail-applications-section">
          <div className="container">
            <div className="app-grid">
              <div className="app-content-box">
                <h2 className="section-heading-v2">Industries Served</h2>
                <p>
                  Our industrial valves are field-proven and qualified for deployment across rigorous industrial sectors requiring high durability and precise fluid dynamics.
                </p>
                <div className="industries-icons-grid">
                  <div className="industry-icon-card">
                    <i className="fas fa-water icon"></i>
                    <span>Water Works</span>
                  </div>
                  <div className="industry-icon-card">
                    <i className="fas fa-fire icon"></i>
                    <span>Power Plants</span>
                  </div>
                  <div className="industry-icon-card">
                    <i className="fas fa-oil-can icon"></i>
                    <span>Petrochemicals</span>
                  </div>
                  <div className="industry-icon-card">
                    <i className="fas fa-seedling icon"></i>
                    <span>Irrigation</span>
                  </div>
                </div>
              </div>
              
              <div className="app-content-box">
                <h2 className="section-heading-v2">Certificates & Inspection</h2>
                <p>
                  All valves are subjected to rigorous hydrostatic shell and seat pressure testing in accordance with standard codes (e.g., API 598 / IS 14846) prior to delivery.
                </p>
                <ul className="inspections-list">
                  <li><i className="fas fa-microscope inspection-check"></i> Physical dimension and wall-thickness checks</li>
                  <li><i className="fas fa-shield-alt inspection-check"></i> Hydrostatic seat and shell test validation</li>
                  <li><i className="fas fa-certificate inspection-check"></i> Manufacturer Test Certificate (MTC) and third-party inspection (SGS, TUV, RINA, IRS etc.) available</li>
                  <li><i className="fas fa-paint-roller inspection-check"></i> Epoxy powder coating inspection (DFT test)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Inquiry Form */}
      <section id="inquiry-form-container" className="detail-inquiry-section">
        <div className="container">
          <div className="inquiry-card-wrapper">
            <div className="inquiry-card-sidebar">
              <h3>Get a Technical Proposal</h3>
              <p>
                Provide your requirements below, and our engineering department will formulate a customized technical and commercial proposal within 24 hours.
              </p>
              <div className="sidebar-contacts">
                <div className="contact-item-v2">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <span>Sales Email</span>
                    <strong>info@gmdalui.co.in</strong>
                  </div>
                </div>
                <div className="contact-item-v2">
                  <i className="fas fa-building"></i>
                  <div>
                    <span>Headquarters</span>
                    <strong>Kolkata, WB, India</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="inquiry-card-form">
              {isSubmitted ? (
                <div className="form-submit-success">
                  <div className="success-icon-badge">
                    <i className="fas fa-check"></i>
                  </div>
                  <h2>Proposal Request Received!</h2>
                  <p>
                    Thank you, <strong>{formData.name}</strong>. Your inquiry regarding the <strong>{valve.name}</strong> has been logged. Our technical sales engineers are compiling the specifications sheets and will email you at <strong>{formData.email}</strong> shortly.
                  </p>
                  <button className="reset-form-btn" onClick={() => setIsSubmitted(false)}>
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h3 className="form-title">Send Inquiry: {valve.name}</h3>
                  
                  <div className="form-grid-fields">
                    {/* Name */}
                    <div className="form-group-v2">
                      <label htmlFor="name">Full Name <span className="req">*</span></label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={validationErrors.name ? 'input-error' : ''}
                        placeholder="John Doe"
                      />
                      {validationErrors.name && <span className="error-text">{validationErrors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-group-v2">
                      <label htmlFor="email">Email Address <span className="req">*</span></label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={validationErrors.email ? 'input-error' : ''}
                        placeholder="john@company.com"
                      />
                      {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
                    </div>

                    {/* Phone */}
                    <div className="form-group-v2">
                      <label htmlFor="phone">Phone / Mobile <span className="req">*</span></label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={validationErrors.phone ? 'input-error' : ''}
                        placeholder="+91 9876543210"
                      />
                      {validationErrors.phone && <span className="error-text">{validationErrors.phone}</span>}
                    </div>

                    {/* Company */}
                    <div className="form-group-v2">
                      <label htmlFor="company">Company Name</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Industrial Enterprises Pvt Ltd"
                      />
                    </div>

                    {/* Required Size */}
                    <div className="form-group-v2">
                      <label htmlFor="valveSize">Required Size Range <span className="req">*</span></label>
                      <input
                        type="text"
                        id="valveSize"
                        name="valveSize"
                        value={formData.valveSize}
                        onChange={handleChange}
                        className={validationErrors.valveSize ? 'input-error' : ''}
                        placeholder="e.g. DN 300, DN 600, 24 inch"
                      />
                      {validationErrors.valveSize && <span className="error-text">{validationErrors.valveSize}</span>}
                    </div>

                    {/* Operating Pressure */}
                    <div className="form-group-v2">
                      <label htmlFor="pressure">Operating Pressure / Rating</label>
                      <select
                        id="pressure"
                        name="pressure"
                        value={formData.pressure}
                        onChange={handleChange}
                      >
                        {valve.pressure.map((p, idx) => (
                          <option key={idx} value={p}>{p}</option>
                        ))}
                        <option value="Custom">Other / Custom Rating</option>
                      </select>
                    </div>

                    {/* Operation Type */}
                    <div className="form-group-v2 full-width-field">
                      <label htmlFor="operation">Operation Mode</label>
                      <select
                        id="operation"
                        name="operation"
                        value={formData.operation}
                        onChange={handleChange}
                      >
                        {valve.operation.map((op, idx) => {
                          const opVal = op.split(' (')[0];
                          return <option key={idx} value={opVal}>{opVal}</option>;
                        })}
                        <option value="Custom">Custom / Actuated Spec</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="form-group-v2 full-width-field">
                      <label htmlFor="message">Detailed Specifications / Requirements</label>
                      <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please write sizing requirements, application medium (water, chemical, gas), operating temperature, bypass valve requirements, third-party inspection, or target delivery timelines."
                      ></textarea>
                    </div>
                  </div>

                  <button type="submit" className="submit-inquiry-btn">
                    Submit Proposal Request <i className="fas fa-paper-plane send-icon"></i>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
