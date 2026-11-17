import { Suspense } from 'react';
import type { Metadata } from 'next';
import Purchase from '@/components/pages/Purchase';
import AuthNavSlot from '@/components/layout/AuthNavSlot';
import { getCurrentUser } from '@/lib/auth/session';
import { catalogQuery, parseCatalogParams } from '@/app/purchase/catalog';
import { countCatalog, getCatalogOptions, getCatalogPage } from '@/app/purchase/data';

const PAGE_SIZE = 24;

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const titleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = parseCatalogParams(await searchParams);
  const pageCount = Math.max(1, Math.ceil((await countCatalog(f)) / PAGE_SIZE));
  const subject = [f.type && titleCase(f.type), f.size, f.pn, f.moc].filter(Boolean).join(' ');
  return {
    title: subject ? `${subject} - Ready Stock Valves` : 'Ready Stock Valves & Spares Catalogue',
    description: `Browse ${subject || 'GM Dalui industrial valves, spares and pipeline accessories'} in ready stock at our Howrah works. Build a list and request a quotation.`,
    // Filter pages are real landing pages; free-text search and out-of-range pages are not.
    alternates: { canonical: `/purchase${catalogQuery({ ...f, q: '' })}` },
    ...(f.q || f.page > pageCount ? { robots: { index: false, follow: true } } : {}),
  };
}

/**
 * /purchase - public, server-rendered catalogue. The database filters and
 * paginates (see app/purchase/data.ts); filters and page live in the URL so
 * every view is crawlable. Signing in is only needed to send the request
 * (enforced again by /api/purchase-enquiry).
 */
export default async function Page({ searchParams }: Props) {
  const filters = parseCatalogParams(await searchParams);
  const [{ items, total, page, pageCount }, { catalogSize, ...options }, user] = await Promise.all([
    getCatalogPage(filters, PAGE_SIZE),
    getCatalogOptions(),
    getCurrentUser(),
  ]);

  return (
    <Purchase
      items={items}
      total={total}
      catalogSize={catalogSize}
      options={options}
      filters={{ ...filters, page }}
      pageCount={pageCount}
      isSignedIn={!!user}
      authSlot={
        <Suspense fallback={null}>
          <AuthNavSlot variant="desktop" />
        </Suspense>
      }
    />
  );
}
