import { manualsData } from '@/data/manuals';
import ManualDetailPage from '@/components/pages/ManualDetailPage';

export function generateStaticParams() {
  return Object.keys(manualsData).map((valveId) => ({ valveId }));
}

export default async function Page({ params }: { params: Promise<{ valveId: string }> }) {
  const { valveId } = await params;
  return <ManualDetailPage valveId={valveId} />;
}
