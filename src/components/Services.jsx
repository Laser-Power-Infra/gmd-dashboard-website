import React from 'react';
import './Services.css';

export default function Services() {
  const servicesData = [
    {
      id: 1,
      image: '/uploads/2025/04/service.jpg',
      title: 'LEAK REPAIR SERVICES',
      desc: 'Immediate sealing of leaks in valves connections or body. Online leak sealing without shutting down operations.'
    },
    {
      id: 2,
      image: '/uploads/2025/09/IMG_4648.jpg',
      title: 'PREVENTIVE MAINTENANCE SERVICES',
      desc: 'Scheduled maintenance to ensure valve longevity and prevent unexpected failures. Cleaning, lubrication, and part replacement.'
    },
    {
      id: 3,
      image: '/uploads/2025/04/service5.jpg',
      title: 'EMERGENCY REPAIR SERVICES',
      desc: 'Immediate troubleshooting and repair of valve failures to minimize downtime.'
    }
  ];

  return (
    <section id="services" className="services-section">
      <div className="container text-center">
        <div className="section-badge centered">OUR SERVICES</div>
        <h2 className="section-title">FOR AFTER SALE SUPPORT</h2>

        <div className="services-grid">
          {servicesData.map((service) => (
            <div className="service-card" key={service.id}>
              <div className="service-image">
                <img src={service.image} alt={service.title} />
              </div>
              <div className="service-body">
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <a href="#products" className="btn-text-arrow">
          SEE MORE <i className="fas fa-arrow-right"></i>
        </a>
      </div>
    </section>
  );
}
