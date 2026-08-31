'use client';

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  valveType: string;
  quantity: string;
  message: string;
}

const INITIAL_FORM: QuoteFormData = {
  name: '',
  email: '',
  phone: '',
  valveType: 'Sluice Valve',
  quantity: '1',
  message: '',
};

export default function GetQuoteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState<QuoteFormData>(INITIAL_FORM);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simulate API request
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData(INITIAL_FORM);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        {isSubmitted ? (
          <div className="modal-success">
            <i className="fas fa-check-circle success-icon"></i>
            <h2>Thank You!</h2>
            <p>Your quotation request has been received. Our sales team will get back to you shortly.</p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <h2 className="modal-title">Request a Quote</h2>
            <p className="modal-subtitle">Provide details about your project needs, and we&apos;ll generate a custom quote.</p>

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Alok Das"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="valveType">Select Valve Type</label>
                <select
                  id="valveType"
                  name="valveType"
                  value={formData.valveType}
                  onChange={handleChange}
                >
                  <option value="Sluice Valve">Sluice Valve</option>
                  <option value="Butterfly Valve">Butterfly Valve</option>
                  <option value="Air Valve">Air Valve</option>
                  <option value="Manual Valve">Manual Valve</option>
                  <option value="Non-Return Valve">Non-Return Valve</option>
                  <option value="Control Valve">Control Valve</option>
                  <option value="Regulating Valve">Regulating Valve</option>
                  <option value="Other">Other / Special Order</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity Required</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message / Custom Requirements</label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                placeholder="Please describe size, material, or custom specifications..."
              ></textarea>
            </div>

            <button type="submit" className="btn-submit">
              Submit Request <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
