import { existsSync } from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { manualsData } from '@/data/manuals';
import { valvesData } from '@/data/valves';
import ManualDetailPage from '@/components/pages/ManualDetailPage';
import { clamp, pageTitle } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ valveId: string }>;
}): Promise<Metadata> {
  const { valveId } = await params;
  const manual = manualsData[valveId];
  if (!manual) return { title: 'Valve Manual' };

  const name =
    valvesData.find((v) => v.id === valveId)?.name ??
    valveId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const description = clamp(
    `Installation, operation and maintenance manual for GM Dalui ${name} — scope, applications, commissioning, inspection, troubleshooting, spares and warranty.`
  );

  return {
    title: pageTitle(`${name} Manual`),
    description,
    alternates: { canonical: `/manuals/${valveId}` },
  };
}

export function generateStaticParams() {
  return Object.keys(manualsData).map((valveId) => ({ valveId }));
}

export default async function Page({ params }: { params: Promise<{ valveId: string }> }) {
  const { valveId } = await params;
  // Checked on the server: a missing /manuals/<slug>.pdf is served as HTML by this
  // same dynamic route, so a client-side HEAD probe can never detect its absence.
  const pdfHref = existsSync(path.join(process.cwd(), 'public', 'manuals', `${valveId}.pdf`))
    ? `/manuals/${valveId}.pdf`
    : null;
  return <ManualDetailPage valveId={valveId} pdfHref={pdfHref} />;
}
