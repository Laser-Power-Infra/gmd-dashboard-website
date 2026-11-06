// alt text is each client's real name, read off the artwork — "Client Logo 6" told a
// screen-reader user nothing.
// Kept out of Clients.tsx: that file is 'use client', so its exports become client
// references and a server component can't read the array length from it.
export const clientLogos = [
  { id: 1, src: '/uploads/2025/04/logo6.webp', alt: 'Tata Steel logo' },
  { id: 2, src: '/uploads/2025/04/logo8.webp', alt: 'Power Grid Corporation of India logo' },
  { id: 3, src: '/uploads/2025/04/logo9.webp', alt: 'ISCO logo' },
  { id: 4, src: '/uploads/2025/04/logo10.webp', alt: 'GAIL (India) Limited logo' },
  { id: 5, src: '/uploads/2025/04/logo-7.webp', alt: 'SAIL logo' },
  { id: 6, src: '/uploads/2025/04/logo11-1.webp', alt: 'NTPC Limited logo' },
  { id: 7, src: '/uploads/2025/04/logo12.webp', alt: 'BHEL logo' },
  { id: 8, src: '/uploads/2025/04/logo13-4.webp', alt: 'FCIL logo' },
  { id: 9, src: '/uploads/2025/04/logo14.webp', alt: 'Vizag Steel (RINL) logo' },
  { id: 10, src: '/uploads/2025/04/logo13.webp', alt: 'ONGC MRPL logo' },
  { id: 11, src: '/uploads/2025/04/logo2-1.webp', alt: 'Adani Power logo' },
  { id: 12, src: '/uploads/2025/04/logo3-1.webp', alt: 'NCC Limited logo' },
  { id: 13, src: '/uploads/2025/04/logo5-1.webp', alt: 'LCC Projects logo' },
  { id: 14, src: '/uploads/2025/04/logo1-1.webp', alt: 'Tata Projects logo' },
  { id: 15, src: '/uploads/2025/04/logo-16-1.webp', alt: 'Shapoorji Pallonji logo' },
  { id: 16, src: '/uploads/2025/04/images-1.webp', alt: 'Blue Star logo' },
  { id: 17, src: '/uploads/2025/04/logo16-1.webp', alt: 'GVPR Engineers logo' },
  { id: 18, src: '/uploads/2025/04/logo17-1.webp', alt: 'Wilo logo' },
];
