import React, { useEffect } from 'react';
import './SafetyPlanPage.css';

export default function SafetyPlanPage({ onOpenQuote }) {
  useEffect(() => {
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.hidden-slide-left, .hidden-slide-right, .hidden-fade-up');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="safety-plan-page">
      <div className="safety-header hidden-fade-up">
        <div className="container">
          <h1 className="animate-fade-up">Safety, Health & Quality Plan</h1>
          <p className="animate-fade-up delay-1">
            G.M.DALUI & SONS PRIVATE LIMITED Quality Management System (QMS)
          </p>
        </div>
      </div>

      {/* Safety and Health Program */}
      <section className="safety-section bg-light container">
        <div className="safety-content">
          <div className="safety-text hidden-slide-left">
            <h2>Safety and Health Program</h2>
            <p>
              The main goal of this program is to keep and protect the life and the physical situation of every worker, reaching <strong>Zero accident</strong> in each and every project activity. There is no gain in any project financially or mortally if any accident exists. Normally accidents appear through simple, silly mistakes; keeping strict regulation by the Safety Officer reduces injuries at work.
            </p>
            <h3>Safety Officer Responsibilities:</h3>
            <div className="safety-grid-list">
              <div className="safety-grid-item">
                <div className="safety-icon"><i className="fas fa-chalkboard-teacher"></i></div>
                <div className="safety-item-text">
                  <strong>Orientations</strong>
                  <p>Conduction Safety and Health orientations to acquaint employees with project conditions, safe work, practices and procedures.</p>
                </div>
              </div>
              <div className="safety-grid-item">
                <div className="safety-icon"><i className="fas fa-search"></i></div>
                <div className="safety-item-text">
                  <strong>Monitoring</strong>
                  <p>Monitoring employees & contractors’ compliance with the applicable environmental safety and health requirements.</p>
                </div>
              </div>
              <div className="safety-grid-item">
                <div className="safety-icon"><i className="fas fa-user-graduate"></i></div>
                <div className="safety-item-text">
                  <strong>Educating</strong>
                  <p>Educating, advising and coaching personnel on environmental, safety and health regulations, inspections and activities.</p>
                </div>
              </div>
              <div className="safety-grid-item">
                <div className="safety-icon"><i className="fas fa-first-aid"></i></div>
                <div className="safety-item-text">
                  <strong>Emergency Response</strong>
                  <p>Providing information to employees regarding their emergency response responsibilities.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="safety-image hidden-slide-right">
            <img src="/uploads/2025/03/aboutus01-600x480.jpg" alt="Safety and Health" />
          </div>
        </div>
      </section>

      {/* Emergency Preparedness */}
      <section className="safety-section container">
        <div className="safety-content row-reverse">
          <div className="safety-text hidden-slide-right">
            <h2>Emergency Preparedness & Response</h2>
            <p>
              The main priority in tackling emergencies is not to endanger the personnel safety of the people involved. A well-planned emergency response procedure saves lives and protects company assets.
            </p>
            <h3>Key Objectives & Actions:</h3>
            <div className="safety-grid-list two-cols">
              <div className="safety-grid-item">
                <div className="safety-icon"><i className="fas fa-shield-alt"></i></div>
                <div className="safety-item-text">
                  <strong>Limit Impact</strong>
                  <p>Avoid or limit the impact of the emergency to personnel, property and the environment.</p>
                </div>
              </div>
              <div className="safety-grid-item">
                <div className="safety-icon"><i className="fas fa-sitemap"></i></div>
                <div className="safety-item-text">
                  <strong>Framework</strong>
                  <p>Increase and effectively maintain an organizational framework and the environment.</p>
                </div>
              </div>
              <div className="safety-grid-item">
                <div className="safety-icon"><i className="fas fa-clipboard-list"></i></div>
                <div className="safety-item-text">
                  <strong>Instructions</strong>
                  <p>Provide a list of actions with clear instructions to be taken in an emergency.</p>
                </div>
              </div>
              <div className="safety-grid-item">
                <div className="safety-icon"><i className="fas fa-user-shield"></i></div>
                <div className="safety-item-text">
                  <strong>Assign Roles</strong>
                  <p>Assign and authorize personnel responsible for taking specific responsibilities.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="safety-image hidden-slide-left">
            <img src="/uploads/2025/03/blog01-600x400.jpg" alt="Emergency Preparedness" />
          </div>
        </div>
      </section>

      {/* Quality Assurance Program */}
      <section className="safety-section bg-light container">
        <div className="safety-content">
          <div className="safety-text hidden-slide-left">
            <h2>Quality Assurance Program</h2>
            <p>
              G.M.DALUI & SONS PRIVATE LIMITED is committed to providing superior quality projects to its clients at the highest level of competence. This goal is achieved through the efforts of each employee taking responsibility for the quality of their work and by them expecting and demanding the same high-quality work from other team members. A formal Quality system ensures requirements are met in an efficient and effective manner.
            </p>
            <h3>Our Quality System Ensures:</h3>
            <div className="quality-list">
              <div className="quality-item"><i className="fas fa-check-circle"></i> Safe, economic, efficient and effective, productive methods for working.</div>
              <div className="quality-item"><i className="fas fa-check-circle"></i> Compliance with Codes of Ethics.</div>
              <div className="quality-item"><i className="fas fa-check-circle"></i> Compliance with clients’ obligations, needs and specifications.</div>
              <div className="quality-item"><i className="fas fa-check-circle"></i> Protecting the project’s environmental issues.</div>
              <div className="quality-item"><i className="fas fa-check-circle"></i> Maintenance of a high level of quality, performance and professionalism.</div>
              <div className="quality-item"><i className="fas fa-check-circle"></i> Continuous improvement in the methods of operation.</div>
            </div>
          </div>
          <div className="safety-image hidden-slide-right">
            <img src="/uploads/2025/03/blog02-1024x576.jpg" alt="Quality Assurance" />
          </div>
        </div>
      </section>

    </div>
  );
}
