import type { Metadata } from 'next';
import { valvesData } from '@/data/valves';
import { otherProducts } from '@/data/otherProducts';
import ValveDetailPage from '@/components/pages/ValveDetailPage';
import { getValveImageMap } from '@/lib/valveImages';
import JsonLd, {
  SITE_NAME,
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
    };
  }
  const product = otherProducts.find((p) => p.id === valveId);
  if (product) {
    return {
      name: product.name,
      category: product.category,
      image: product.image,
      description: product.usage.join(' '),
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
  if (!product) return { title: 'Valve Details' };

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
  return (
    <>
      {product && (
        <JsonLd
          data={productJsonLd({
            name: product.name,
            description: clamp(product.description, 300),
            image: product.image,
            path: `/valve-detail/${valveId}`,
            category: product.category,
          })}
        />
      )}
      <ValveDetailPage valveId={valveId} imageMap={imageMap} />
    </>
  );
}
