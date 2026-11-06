// On a manual detail page the manual's own title is the h1, so the banner drops to h2.
export default function ManualsHero({ heading = 'h1' }: { heading?: 'h1' | 'h2' }) {
  const Heading = heading;
  return (
    <section className="warranty-hero">
      <div className="hero-decor-shape-top-left"></div>
      <div className="hero-decor-shape-bottom-right"></div>

      <div className="container hero-new-container">
        {/* Left: Hexagon image container */}
        <div className="hero-left-hex">
          <div className="hexagon-border-blue">
            <div className="hexagon-inner-valves"></div>
          </div>
        </div>

        {/* Center: Styled title */}
        <div className="hero-center-title">
          <Heading className="warranty-title-text">MANUALS OF VALVE</Heading>
        </div>
      </div>
    </section>
  );
}
