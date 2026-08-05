'use client';

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { DetailValve } from '@/types';

interface InquiryFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  valveSize: string;
  pressure: string;
  operation: string;
  message: string;
}

type ValidationErrors = Partial<Record<keyof InquiryFormData, string | null>>;

export default function ValveInquiryForm({ valve }: { valve: DetailValve }) {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    valveSize: valve.size.split('Up to ')[1] || valve.size || '',
    pressure: valve.pressure[0] || '',
    operation: valve.operation[0].split(' (')[0] || '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Handle Form Change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for that field
    if (validationErrors[name as keyof InquiryFormData]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Form Submit Validation
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: ValidationErrors = {};
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
    <>
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
              <select id="pressure" name="pressure" value={formData.pressure} onChange={handleChange}>
                {valve.pressure.map((p, idx) => (
                  <option key={idx} value={p}>{p}</option>
                ))}
                <option value="Custom">Other / Custom Rating</option>
              </select>
            </div>

            {/* Operation Type */}
            <div className="form-group-v2 full-width-field">
              <label htmlFor="operation">Operation Mode</label>
              <select id="operation" name="operation" value={formData.operation} onChange={handleChange}>
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
                rows={4}
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
    </>
  );
}
