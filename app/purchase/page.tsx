import type { Metadata } from 'next';
import PurchasePage from '@/components/purchase/PurchasePage';
import { getCurrentUser } from '@/lib/auth/session';
import { catalogQuery, parseCatalogParams } from '@/app/purchase/catalog';
import { countCatalog, getCatalogOptions, getCatalogPage, getTypeShowcase } from '@/app/purchase/data';

const PAGE_SIZE = 24;

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const titleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = parseCatalogParams(await searchParams);
  const pageCount = Math.max(1, Math.ceil((await countCatalog(f)) / PAGE_SIZE));
  const subject = [f.type[0] && titleCase(f.type[0]), f.size[0], f.pn[0], f.moc[0]].filter(Boolean).join(' ');
  return {
    title: subject ? `${subject} - Ready Stock Valves` : 'Ready Stock Valves & Spares Catalogue',
    description: `Browse ${subject || 'GM Dalui industrial valves, spares and pipeline accessories'} in ready stock at our Howrah works. Build a list and request a quotation.`,
    // Filter pages are real landing pages; free-text search and out-of-range pages are not.
    alternates: { canonical: `/purchase${catalogQuery({ ...f, q: '' })}` },
    ...(f.q || f.page > pageCount ? { robots: { index: false, follow: true } } : {}),
  };
}

/**
 * /purchase - public, server-rendered catalogue: filter sidebar, cards and the
 * list drawer. The database filters (multi-select per facet) and paginates
 * (see app/purchase/data.ts); filters and page live in the URL so every view
 * is crawlable. Signing in is only needed to buy or send a quote request
 * (enforced again by startPurchase and /api/purchase-enquiry).
 */
export default async function Page({ searchParams }: Props) {
  const filters = parseCatalogParams(await searchParams);
  const [{ items, total, page, pageCount }, { catalogSize, ...options }, showcase, user] = await Promise.all([
    getCatalogPage(filters, PAGE_SIZE),
    getCatalogOptions(),
    getTypeShowcase(),
    getCurrentUser(),
  ]);

  return (
    <PurchasePage
      items={items}
      total={total}
      catalogSize={catalogSize}
      options={options}
      showcase={showcase}
      filters={{ ...filters, page }}
      pageCount={pageCount}
      isSignedIn={!!user}
    />
  );
}
