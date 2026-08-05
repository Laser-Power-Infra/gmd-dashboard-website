import Link from 'next/link';
import { valvesData } from '@/data/valves';
import ManualsHero from '@/components/manuals/ManualsHero';
import ManualsFooterPrompt from '@/components/manuals/ManualsFooterPrompt';

export default function ManualsCatalogPage() {
  return (
    <div className="warranty-page-wrapper">
      <ManualsHero />

      {/* Main content body */}
      <section className="warranty-content-section">
        <div className="container">
          <div className="warranty-intro-text">
            <h2>Manuals of Valve</h2>
            <p className="subtitle">Select a valve category below to view specific manual instructions</p>
          </div>

          <div className="warranty-catalog-grid">
            {valvesData.map((valve) => (
              <Link href={`/manuals/${valve.id}`} className="warranty-catalog-card" key={valve.id}>
                <div className="catalog-card-img-box">
                  <img src={valve.image} alt={valve.name} className="catalog-card-img" />
                </div>
                <h3 className="catalog-card-title">{valve.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ManualsFooterPrompt />
    </div>
  );
}
