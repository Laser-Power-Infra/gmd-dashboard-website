import type { MetadataRoute } from 'next';
import { valvesData } from '@/data/valves';
import { otherProducts } from '@/data/otherProducts';
import { manualsData } from '@/data/manuals';
import { SITE_URL } from '@/components/seo/JsonLd';

// Public routes only — /login, /register, /admin, /cost and /api are excluded
// here and disallowed in app/robots.ts.
const staticRoutes: [path: string, priority: number][] = [
  ['/', 1],
  ['/about', 0.8],
  ['/valves', 0.9],
  ['/other-valves', 0.8],
  ['/other-products', 0.8],
  ['/usages', 0.7],
  ['/product-industry', 0.7],
  ['/manuals', 0.7],
  ['/engineering-data', 0.5],
  ['/contact', 0.8],
  ['/purchase', 0.6],
  ['/amc', 0.6],
  ['/apply-amc', 0.5],
  ['/cmc', 0.6],
  ['/development', 0.5],
  ['/risk-management', 0.5],
  ['/safety-plan', 0.5],
  ['/complaints', 0.4],
  ['/performance-review', 0.4],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...staticRoutes.map(([path, priority]) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...[...valvesData.map((v) => v.id), ...otherProducts.map((p) => p.id)].map(
      (id) => ({
        url: `${SITE_URL}/valve-detail/${id}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      })
    ),
    ...Object.keys(manualsData).map((id) => ({
      url: `${SITE_URL}/manuals/${id}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
