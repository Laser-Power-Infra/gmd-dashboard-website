import React, { useEffect, useRef } from 'react';
import './ModernManualLayout.css';
import PrintableManual from './PrintableManual';

export default function ModernManualLayout({ data }) {
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('visible');
      } else {
        if (observerRef.current) observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [data]);

  const renderBlock = (block, idx) => {
    switch (block.type) {
      case 'subtitle':
        return <h3 key={idx} className="modern-subtitle">{block.text}</h3>;
      case 'text':
        return <p key={idx} className="modern-text">{block.text}</p>;
      case 'list':
        return (
          <ul key={idx} className="modern-list">
            {block.items.map((item, i) => (
              <li key={i}>
                <i className="fas fa-check-circle list-icon"></i>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      case 'ordered-list':
        return (
          <ol key={idx} className="modern-ordered-list">
            {block.items.map((item, i) => (
              <li key={i}>
                <span className="step-number">{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        );
      case 'table':
        return (
          <div key={idx} className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  {block.headers.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modern-manual-container">
      <div className="modern-manual-header" style={{ position: 'relative' }}>
        <h1 className="modern-main-title">{data.title}</h1>
        <div className="title-underline"></div>
        <div className="no-print" style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>
          <button 
            onClick={() => window.print()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#fb923c',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 4px 10px rgba(251, 146, 60, 0.3)'
            }}
          >
            <i className="fas fa-file-pdf"></i> Download PDF
          </button>
        </div>
      </div>

      <div className="modern-manual-content">
        {data.sections.map((section, sIdx) => {
          return (
            <div key={sIdx} className="modern-section-card animate-on-scroll">
              <h2 className="modern-section-title">
                <span className="section-icon"><i className="fas fa-bookmark"></i></span>
                {section.title}
              </h2>
              <div className="section-body-content">
                {section.blocks.map((block, bIdx) => renderBlock(block, bIdx))}
              </div>
            </div>
          );
        })}
        {/* End of content */}
      </div>
      <PrintableManual data={data} />
    </div>
  );
}
