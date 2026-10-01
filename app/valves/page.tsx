import ValvesPage from '@/components/pages/ValvesPage';
import { getValveImageMap } from '@/lib/valveImages';

export default function Page() {
  const imageMap = getValveImageMap();
  return <ValvesPage imageMap={imageMap} />;
}
