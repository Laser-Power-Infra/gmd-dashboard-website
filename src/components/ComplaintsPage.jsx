import React, { useState, useEffect } from 'react';
import './FormPage.css';

export default function ComplaintsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    invoiceNumber: '',
    complaintDetails: ''
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
    setFormData({ name: '', email: '', phone: '', invoiceNumber: '', complaintDetails: '' });
  };

  return (
    <div className="form-page-container">
      <div className="container">
        <h1 className="form-page-title">Register a Complaint</h1>
        <p className="form-page-description">
          We take all feedback seriously. If you're experiencing issues with our products or services, please let us know so we can resolve them promptly.
        </p>

        <div className="form-card">
          {isSubmitted && (
            <div className="success-message">
              Thank you for reaching out. We have received your complaint and our support team will contact you shortly.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input type="text" id="name" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
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
              <label htmlFor="invoiceNumber">Invoice / Order Number (Optional)</label>
              <input type="text" id="invoiceNumber" name="invoiceNumber" className="form-control" value={formData.invoiceNumber} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="complaintDetails">Complaint Details *</label>
              <textarea id="complaintDetails" name="complaintDetails" className="form-control" value={formData.complaintDetails} onChange={handleChange} placeholder="Please provide specific details regarding the issue..." required></textarea>
            </div>

            <button type="submit" className="submit-btn">Submit Complaint</button>
          </form>
        </div>
      </div>
    </div>
  );
}
