'use client';

const logos = [
  { id: 1, src: '/uploads/2025/04/logo6.png', alt: 'Client Logo 6' },
  { id: 2, src: '/uploads/2025/04/logo8.png', alt: 'Client Logo 8' },
  { id: 3, src: '/uploads/2025/04/logo9.png', alt: 'Client Logo 9' },
  { id: 4, src: '/uploads/2025/04/logo10.png', alt: 'Client Logo 10' },
  { id: 5, src: '/uploads/2025/04/logo-7.png', alt: 'Client Logo 7' },
  { id: 6, src: '/uploads/2025/04/logo11-1.jpg', alt: 'Client Logo 11' },
  { id: 7, src: '/uploads/2025/04/logo12.jpg', alt: 'Client Logo 12' },
  { id: 8, src: '/uploads/2025/04/logo13-4.jpg', alt: 'Client Logo 13 Detail' },
  { id: 9, src: '/uploads/2025/04/logo14.jpg', alt: 'Client Logo 14' },
  { id: 10, src: '/uploads/2025/04/logo13.jpg', alt: 'Client Logo 13' },
  { id: 11, src: '/uploads/2025/04/logo2-1.png', alt: 'Client Logo 2' },
  { id: 12, src: '/uploads/2025/04/logo3-1.png', alt: 'Client Logo 3' },
  { id: 13, src: '/uploads/2025/04/logo5-1.png', alt: 'Client Logo 5' },
  { id: 14, src: '/uploads/2025/04/logo1-1.png', alt: 'Client Logo 1' },
  { id: 15, src: '/uploads/2025/04/logo-16-1.jpg', alt: 'Client Logo 16 Detail' },
  { id: 16, src: '/uploads/2025/04/images-1.jpg', alt: 'Client Images 1' },
  { id: 17, src: '/uploads/2025/04/logo16-1.jpg', alt: 'Client Logo 16' },
  { id: 18, src: '/uploads/2025/04/logo17-1.jpg', alt: 'Client Logo 17' },
];

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
