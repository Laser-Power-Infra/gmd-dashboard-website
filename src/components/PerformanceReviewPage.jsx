import React, { useState, useEffect } from 'react';
import './FormPage.css';

export default function PerformanceReviewPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    rating: '5',
    review: ''
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
    setFormData({ name: '', company: '', email: '', rating: '5', review: '' });
  };

  return (
    <div className="form-page-container">
      <div className="container">
        <h1 className="form-page-title">Performance Review</h1>
        <p className="form-page-description">
          We constantly strive to exceed expectations. Share your experience with our products and services to help us improve.
        </p>

        <div className="form-card">
          {isSubmitted && (
            <div className="success-message">
              Thank you! Your performance review has been submitted successfully. We appreciate your valuable feedback.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input type="text" id="name" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="company">Company / Organization *</label>
              <input type="text" id="company" name="company" className="form-control" value={formData.company} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input type="email" id="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="rating">Overall Satisfaction Rating *</label>
              <select id="rating" name="rating" className="form-control" value={formData.rating} onChange={handleChange} required>
                <option value="5">Excellent - 5 Stars</option>
                <option value="4">Good - 4 Stars</option>
                <option value="3">Average - 3 Stars</option>
                <option value="2">Poor - 2 Stars</option>
                <option value="1">Terrible - 1 Star</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="review">Detailed Review *</label>
              <textarea id="review" name="review" className="form-control" value={formData.review} onChange={handleChange} placeholder="Tell us what you liked and how we can improve..." required></textarea>
            </div>

            <button type="submit" className="submit-btn">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  );
}
