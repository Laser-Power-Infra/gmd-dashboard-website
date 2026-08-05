export default function ManualsHero() {
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
          <h1 className="warranty-title-text">MANUALS OF VALVE</h1>
        </div>
      </div>
    </section>
  );
}
