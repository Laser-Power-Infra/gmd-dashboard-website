import React from 'react';
import './PrintableManual.css';

export default function PrintableManual({ data }) {
  if (!data) return null;

  return (
    <div className="printable-manual">
      {/* Cover Page */}
      <div className="print-cover-page">
        <div className="print-logo-container">
          <img src="/logo.png" alt="G.M.DALUI & SONS" className="print-logo" />
        </div>
        <h1 className="print-main-title">{data.title}</h1>
        <h2 className="print-subtitle">Installation, Operation & Maintenance Manual</h2>
        <div className="print-company-info">
          <p><strong>G.M.DALUI & SONS PRIVATE LIMITED</strong></p>
          <p>ADVENTZ INFINITY@5 BN Block, 19 Floor-North Wing, Saltlake, Sector-5, Kolkata-700091</p>
        </div>
      </div>

      {/* Content Pages */}
      <div className="print-content-pages">
        {data.sections && data.sections.map((section, idx) => (
          <div key={idx} className="print-section-page">
            <h2 className="print-section-title">{section.title}</h2>
            
            {section.blocks.map((block, bIdx) => {
              switch (block.type) {
                case 'subtitle':
                  return <h3 key={bIdx} className="print-block-subtitle">{block.text}</h3>;
                case 'text':
                  return <p key={bIdx} className="print-block-text">{block.text}</p>;
                case 'list':
                  return (
                    <ul key={bIdx} className="print-block-list">
                      {block.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  );
                case 'ordered-list':
                  return (
                    <ol key={bIdx} className="print-block-ordered-list">
                      {block.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ol>
                  );
                case 'table':
                  return (
                    <div key={bIdx} className="print-table-wrapper">
                      <table className="print-table">
                        <thead>
                          <tr>
                            {block.headers.map((h, i) => <th key={i}>{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {block.rows.map((row, i) => (
                            <tr key={i}>
                              {row.map((cell, j) => (
                                <td key={j}>{cell}</td>
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
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
