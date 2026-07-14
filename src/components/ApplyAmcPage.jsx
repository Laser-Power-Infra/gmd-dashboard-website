import React, { useState, useEffect } from 'react';
import './FormPage.css';

export default function ApplyAmcPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    valveTypes: '',
    requirements: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({ name: '', company: '', email: '', phone: '', valveTypes: '', requirements: '' });
  };

  return (
    <div className="form-page-container">
      <div className="container">
        <h1 className="form-page-title">Apply for AMC</h1>
        <p className="form-page-description">
          Secure the longevity and reliability of your industrial valves with our Comprehensive Annual Maintenance Contract.
        </p>

        <div className="form-card">
          {isSubmitted && (
            <div className="success-message">
              Application submitted! Our technical sales team will review your requirements and contact you with a proposal.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Contact Person *</label>
              <input type="text" id="name" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="company">Company / Plant Name *</label>
              <input type="text" id="company" name="company" className="form-control" value={formData.company} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input type="email" id="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input type="tel" id="phone" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="valveTypes">Types of Valves Required for AMC *</label>
              <input type="text" id="valveTypes" name="valveTypes" className="form-control" value={formData.valveTypes} onChange={handleChange} placeholder="e.g. Sluice Valves, Butterfly Valves..." required />
            </div>

            <div className="form-group">
              <label htmlFor="requirements">Specific Requirements / Site Details</label>
              <textarea id="requirements" name="requirements" className="form-control" value={formData.requirements} onChange={handleChange} placeholder="Provide any details about the site conditions or specific maintenance needs..."></textarea>
            </div>

            <button type="submit" className="submit-btn">Submit Application</button>
          </form>
        </div>
      </div>
    </div>
  );
}
