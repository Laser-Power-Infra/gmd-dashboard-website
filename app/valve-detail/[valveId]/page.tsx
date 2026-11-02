import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { valvesData } from '@/data/valves';
import { otherProducts } from '@/data/otherProducts';
import ValveDetailPage from '@/components/pages/ValveDetailPage';
import { getValveImageMap } from '@/lib/valveImages';
import JsonLd, {
  SITE_NAME,
  breadcrumbJsonLd,
  clamp,
  pageTitle,
  productJsonLd,
} from '@/components/seo/JsonLd';

export function generateStaticParams() {
  const ids = [
    ...valvesData.map((v) => v.id),
    ...otherProducts.map((p) => p.id),
  ];
  return ids.map((id) => ({ valveId: id }));
}

// Mirrors the lookup inside ValveDetailPage, including its fallback to the first valve.
function findProduct(valveId: string) {
  const valve = valvesData.find((v) => v.id === valveId);
  if (valve) {
    return {
      name: valve.name,
      category: valve.category,
      image: valve.image,
      description: valve.description,
      parent: { name: 'Valves', path: '/valves' },
    };
  }
  const product = otherProducts.find((p) => p.id === valveId);
  if (product) {
    return {
      name: product.name,
      category: product.category,
      image: product.image,
      description: product.usage.join(' '),
      parent: { name: 'Valve Accessories', path: '/other-products' },
    };
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ valveId: string }>;
}): Promise<Metadata> {
  const { valveId } = await params;
  const product = findProduct(valveId);
  // Unknown slug: ValveDetailPage falls back to the first valve, so keep that
  // duplicate out of the index instead of letting any URL rank as a soft 404.
  if (!product)
    return { title: 'Valve Details', robots: { index: false, follow: false } };

  const description = clamp(
    `${product.name} manufacturer in Kolkata. ${product.description}`
  );
  const path = `/valve-detail/${valveId}`;

  return {
    title: pageTitle(product.name),
    description,
    alternates: { canonical: path },
    // openGraph is replaced, not merged, so siteName/locale are repeated here.
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_IN',
      url: path,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ valveId: string }> }) {
  const { valveId } = await params;
  const imageMap = getValveImageMap();
  const product = findProduct(valveId);
  // Unknown slug: 404 rather than letting ValveDetailPage fall back to the first
  // valve, which served the wrong product under a 200.
  if (!product) notFound();
  return (
    <>
      {product && (
        <>
          <JsonLd
            data={productJsonLd({
              name: product.name,
              description: clamp(product.description, 300),
              image: product.image,
              path: `/valve-detail/${valveId}`,
              category: product.category,
            })}
          />
          <JsonLd
            data={breadcrumbJsonLd([
              product.parent,
              { name: product.name, path: `/valve-detail/${valveId}` },
            ])}
          />
        </>
      )}
      <ValveDetailPage valveId={valveId} imageMap={imageMap} />
    </>
  );
}
