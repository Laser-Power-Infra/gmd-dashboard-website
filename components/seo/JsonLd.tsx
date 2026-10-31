export const SITE_URL = 'https://gmdalui.co.in';
export const SITE_NAME = 'GM Dalui & Sons Pvt. Ltd.';

/** Default share image: the widest landscape hero slide we already ship (1199x672). */
export const OG_IMAGE = '/uploads/2025/09/IMG_4648.webp';

const LOGO = `${SITE_URL}/uploads/2025/04/header-final-logo.webp`;

// Only facts that exist in the repo (Footer.tsx, ContactPage.tsx, ValveDetailPage.tsx).
// No GST, social profiles or founding year — those must come from the client.
const ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress:
    'Adventz Infinity@5, BN Block, 19th Floor - North Wing, Salt Lake, Sector-5',
  addressLocality: 'Kolkata',
  addressRegion: 'West Bengal',
  postalCode: '700091',
  addressCountry: 'IN',
} as const;

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: 'GM Dalui Valves',
      url: SITE_URL,
      logo: LOGO,
      image: LOGO,
      email: 'info@gmdalui.co.in',
      telephone: '+91-9147176248',
      address: ADDRESS,
      description:
        'ISO 9001:2015 certified manufacturer of industrial valves — butterfly, sluice, air release, check, globe, ball, control and pressure relief valves — based in Kolkata, India.',
      hasCredential: 'ISO 9001:2015',
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#localbusiness`,
      name: SITE_NAME,
      url: SITE_URL,
      image: LOGO,
      email: 'info@gmdalui.co.in',
      telephone: '+91-9147176248',
      address: ADDRESS,
      areaServed: 'IN',
      parentOrganization: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export function productJsonLd({
  name,
  description,
  image,
  path,
  category,
}: {
  name: string;
  description: string;
  image?: string;
  path: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url: `${SITE_URL}${path}`,
    ...(image ? { image: `${SITE_URL}${encodeURI(image)}` } : {}),
    ...(category ? { category } : {}),
    brand: { '@type': 'Brand', name: SITE_NAME },
    manufacturer: { '@id': `${SITE_URL}/#organization` },
  };
}

/** Trim a description to the ~155 chars search engines show. */
export function clamp(text: string, max = 155) {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[.,;:]$/, '') + '…';
}

/** Title that stays under 60 chars once the layout's "| GM Dalui & Sons" template is applied. */
export function pageTitle(name: string) {
  return name.length + ' | GM Dalui & Sons'.length <= 60
    ? name
    : { absolute: name };
}

export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escaping "<" blocks </script> injection from data strings.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
