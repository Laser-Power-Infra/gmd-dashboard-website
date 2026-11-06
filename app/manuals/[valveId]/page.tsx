import { existsSync } from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { manualsData } from '@/data/manuals';
import { valvesData } from '@/data/valves';
import ManualDetailPage from '@/components/pages/ManualDetailPage';
import JsonLd, { breadcrumbJsonLd, clamp, pageTitle } from '@/components/seo/JsonLd';

function manualName(valveId: string) {
  return (
    valvesData.find((v) => v.id === valveId)?.name ??
    valveId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ valveId: string }>;
}): Promise<Metadata> {
  const { valveId } = await params;
  const manual = manualsData[valveId];
  // Unknown slug still renders a shell page, so keep it out of the index.
  if (!manual)
    return { title: 'Valve Manual', robots: { index: false, follow: false } };

  const name = manualName(valveId);
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
  // Unknown slug rendered an empty shell under a 200. 404 instead — this also makes
  // a missing /manuals/<slug>.pdf return a real 404 rather than this page as HTML.
  if (!manualsData[valveId]) notFound();
  // Checked on the server: a missing /manuals/<slug>.pdf is served as HTML by this
  // same dynamic route, so a client-side HEAD probe can never detect its absence.
  const pdfHref = existsSync(path.join(process.cwd(), 'public', 'manuals', `${valveId}.pdf`))
    ? `/manuals/${valveId}.pdf`
    : null;
  return (
    <>
      {manualsData[valveId] && (
        <JsonLd
          data={breadcrumbJsonLd([
            { name: 'Manuals', path: '/manuals' },
            { name: `${manualName(valveId)} Manual`, path: `/manuals/${valveId}` },
          ])}
        />
      )}
      <ManualDetailPage valveId={valveId} pdfHref={pdfHref} />
    </>
  );
}
