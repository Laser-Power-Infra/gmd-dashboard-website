'use client';

import { clientLogos as logos } from '@/data/clients';


// Double the logos list to make the infinite scroll loop seamless
const duplicatedLogos = [...logos, ...logos];

export default function Clients() {
  return (
    <section className="clients-section">
      <div className="container text-center">
        <div className="section-badge centered">OUR ESTEEMED CLIENTS</div>
        <h2 className="section-title">End User / Government Clients / Private Clients</h2>
      </div>

      {/* Infinite scrolling marquee */}
      <div className="marquee-container">
        <div className="marquee-content">
          {duplicatedLogos.map((logo, index) => (
            <div className="marquee-item" key={`${logo.id}-${index}`}>
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                onError={(e) => {
                  // If logo fails to load (e.g. not copied or missing), fallback to simple text
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentNode) {
                    (target.parentNode as HTMLElement).innerHTML = `<span class="client-fallback">${logo.alt}</span>`;
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
