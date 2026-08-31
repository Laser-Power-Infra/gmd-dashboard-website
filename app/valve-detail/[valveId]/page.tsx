import { valvesData } from '@/data/valves';
import { otherProducts } from '@/data/otherProducts';
import ValveDetailPage from '@/components/pages/ValveDetailPage';

export function generateStaticParams() {
  const ids = [
    ...valvesData.map((v) => v.id),
    ...otherProducts.map((p) => p.id),
  ];
  return ids.map((id) => ({ valveId: id }));
}

export default async function Page({ params }: { params: Promise<{ valveId: string }> }) {
  const { valveId } = await params;
  return <ValveDetailPage valveId={valveId} />;
}
