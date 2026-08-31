'use client';

import { useState, useEffect, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';

interface FeedbackFormData {
  name: string;
  email: string;
  phone: string;
  comments: string;
  rating: number;
}

const INITIAL_FEEDBACK: FeedbackFormData = {
  name: '',
  email: '',
  phone: '',
  comments: '',
  rating: 0,
};

export default function FeedbackPage() {
  const [formData, setFormData] = useState<FeedbackFormData>(INITIAL_FEEDBACK);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (ratingVal: number) => {
    setFormData((prev) => ({ ...prev, rating: ratingVal }));
  };

  const handleRatingHover = (ratingVal: number) => {
    setHoverRating(ratingVal);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || formData.rating === 0) {
      alert('Please fill all required fields and provide a rating.');
      return;
    }
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="feedback-page-wrapper">
      {/* Banner */}
      <section className="feedback-hero-banner" style={{ backgroundImage: "url('/uploads/2025/04/White-Purple-Modern-Website-Design-And-Development-Outdoor-Banner-2-scaled.jpg')" }}>
        <div className="banner-overlay"></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="feedback-banner-title">Feedback</h1>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="feedback-content-section" ref={contentRef}>
        <div className="container">
          <div className="feedback-grid">
            {/* Left: Feedback Form */}
            <div className={`feedback-form-col ${isVisible ? 'visible' : ''}`}>
              <h2 className="form-card-title">Feedback Form</h2>

              {isSubmitted ? (
                <div className="feedback-success-state">
                  <h3>Thank You!</h3>
                  <p>Your feedback has been successfully submitted.</p>
                  <button
                    className="btn-submit-feedback mt-3"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData(INITIAL_FEEDBACK);
                    }}
                  >
                    Submit Another
                  </button>
                </div>
              ) : (
                <form className="feedback-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-col-label">Your Name</div>
                    <div className="form-col-input">
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-col-label">Your E-Mail</div>
                    <div className="form-col-input">
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-col-label">Your Phone No.</div>
                    <div className="form-col-input">
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-col-label">Your Comment</div>
                    <div className="form-col-input">
                      <textarea name="comments" value={formData.comments} onChange={handleChange} rows={5}></textarea>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-col-label">Rate Us</div>
                    <div className="form-col-input">
                      <div className="star-rating-container">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className="star-btn"
                            onClick={() => handleRatingClick(star)}
                            onMouseEnter={() => handleRatingHover(star)}
                            onMouseLeave={handleRatingLeave}
                          >
                            <i className={`fa-star ${(hoverRating || formData.rating) >= star ? 'fas active' : 'far'}`}></i>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="form-submit-row">
                    <button type="submit" className="btn-submit-feedback">Submit Rating</button>
                  </div>
                </form>
              )}
            </div>

            {/* Right: Image */}
            <div className={`feedback-image-col ${isVisible ? 'visible' : ''}`}>
              <img src="/uploads/2025/05/pexels-rdne-7564196-scaled.jpg" alt="Feedback Worker" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
