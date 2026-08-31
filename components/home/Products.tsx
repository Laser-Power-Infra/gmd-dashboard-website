const products = [
  {
    id: 1,
    image: '/uploads/2025/04/product1-1.jpg',
    title: 'Sluice Valves',
    desc: 'Our sluice valves offer exceptional performance for various applications. Constructed from Cast Iron, Cast Steel, S.G. Iron or mild steel fabricated.',
  },
  {
    id: 2,
    image: '/uploads/2025/04/product3-1.jpg',
    title: 'Air Valves',
    desc: 'An air valve from DALUI is designed to manage air within pipelines, addressing both air release and vacuum conditions.',
  },
  {
    id: 3,
    image: '/uploads/2025/04/product4.jpg',
    title: 'Strainers',
    desc: 'Our strainers filter out debris, particles & contaminants from the fluid stream to improve overall system efficiency and reliability.',
  },
];

export default function Products() {
  return (
    <section id="products" className="products-section">
      <div className="container">
        {/* Section Header */}
        <div className="products-header">
          <div>
            <div className="section-badge">OUR PRODUCT</div>
            <h2 className="section-title">Product That We Sale</h2>
          </div>
          <a href="#about-us" className="btn-primary btn-skew desktop-only">
            Know More
          </a>
        </div>

        {/* 3-Column Static Grid */}
        <div className="products-grid-v2">
          {products.map((product) => (
            <div className="product-card-v2" key={product.id}>
              <div className="product-image-v2">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-info-overlay">
                <h3>{product.title}</h3>
                <p>{product.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
