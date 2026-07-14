import React, { useState, useEffect } from 'react';
import './IndustryPage.css';

const industryData = [
  {
    "category": "1. GATE / SLUICE VALVES (METAL & RESILIENT SEATED, RISING/NON-RISING STEM)",
    "headers": [
      "Valve Type",
      "Size Range (DN)",
      "MOC",
      "Indian Standards",
      "British / International Standards"
    ],
    "isImageCards": true,
    "rows": [
      {
        "image": "/usages_img/Metal Seated Sluice Valve img.png",
        "data": [
          "Metal Seated Sluice Valve",
          "50–1200",
          "CI/DI/CS/SS",
          "IS 14846, IS 780",
          "BS 5163 Part 1, AWWA C500, EN 1171"
        ]
      },
      {
        "image": "/usages_img/Resilient Seated Gate Valveonly.png",
        "data": [
          "Resilient Seated Gate Valve",
          "50–1600",
          "DI/CS/SS",
          "IS 5312 (Part 1 & 2), IS 14846",
          "BS 5163 Part 2, AWWA C509/C515, EN 558"
        ]
      },
      {
        "image": "/usages_img/Rising Stem Gate Valve.png",
        "data": [
          "Rising Stem Gate Valve",
          "50–1000",
          "DI/CS/SS",
          "IS 14846",
          "API 600, ASME B16.34, BS 5163"
        ]
      },
      {
        "image": "/usages_img/Non-Rising Stem Gate Valve.png",
        "data": [
          "Non-Rising Stem Gate Valve",
          "50–1600",
          "DI/CS/SS",
          "IS 14846",
          "BS 5163, AWWA C509/C515"
        ]
      }
    ]
  },
  {
    "category": "2. CHECK VALVES (ALL TYPES INCLUDING LARGE SIZE 700 DN & 2000 DN)",
    "headers": [
      "Valve Type",
      "Size Range (DN)",
      "MOC",
      "Indian Standards",
      "International Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/Swing Check Valve (including 700 DN & above).png",
        "data": [
          "Swing Check Valve (including 700 DN & above)",
          "50–2000",
          "CI/DI/CS/SS",
          "IS 5312 (Part 1)",
          "AWWA C508, API 6D, API 594"
        ]
      },
      {
        "image": "/usages_img/Non-Slam (Silent) Check Valve.png",
        "data": [
          "Non-Slam (Silent) Check Valve",
          "40–1600",
          "CI/DI/CS/SS",
          "IS 5930",
          "API 594, EN 12334"
        ]
      },
      {
        "image": "/usages_img/Dual Plate Check Valve.png",
        "data": [
          "Dual Plate Check Valve",
          "50–2000",
          "DI/CS/SS",
          "IS 14058",
          "API 594, ASME B16.34"
        ]
      },
      {
        "image": "/usages_img/Tilting Disc Check Valve.png",
        "data": [
          "Tilting Disc Check Valve",
          "100–2000",
          "CS/SS/DI",
          "–",
          "API 6D, AWWA C508"
        ]
      }
    ],
    "isImageCards": true
  },
  {
    "category": "3. BUTTERFLY VALVES (CONCENTRIC, DOUBLE ECCENTRIC, TRIPLE ECCENTRIC)",
    "headers": [
      "Type",
      "Size Range",
      "MOC",
      "Indian Standards",
      "International Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/Concentric Butterfly Valve.png",
        "data": [
          "Concentric Butterfly Valve",
          "50–3600",
          "DI/CS/SS",
          "IS 13095",
          "AWWA C504, EN 593"
        ]
      },
      {
        "image": "/usages_img/Double Eccentric (High Performance).png",
        "data": [
          "Double Eccentric (High Performance)",
          "150–3600",
          "DI/CS/SS",
          "IS 13095 (Guideline)",
          "AWWA C504, API 609, EN 593"
        ]
      },
      {
        "image": "/usages_img/Triple Eccentric Metal Seated.png",
        "data": [
          "Triple Eccentric Metal Seated",
          "150–2000",
          "CS/SS/Alloy",
          "–",
          "API 609, EN 593"
        ]
      }
    ],
    "isImageCards": true
  },
  {
    "category": "4. BALL VALVES (FLOATING & TRUNNION)",
    "headers": [
      "Type",
      "Size Range",
      "MOC",
      "Indian Standards",
      "International Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/Floating Ball Valve.png",
        "data": [
          "Floating Ball Valve",
          "15–600",
          "CS/SS/DI",
          "IS 9890",
          "API 608, ISO 17292"
        ]
      },
      {
        "image": "/usages_img/Trunnion Mounted Ball Valve.png",
        "data": [
          "Trunnion Mounted Ball Valve",
          "50–1200",
          "CS/SS/Alloy",
          "–",
          "API 6D, API 608"
        ]
      },
      {
        "image": "/usages_img/Fire Safe Ball Valve.png",
        "data": [
          "Fire Safe Ball Valve",
          "15–600",
          "CS/SS",
          "–",
          "API 607, ISO 10497"
        ]
      }
    ],
    "isImageCards": true
  },
  {
    "category": "5. GLOBE / STOP VALVES",
    "headers": [
      "Type",
      "Size Range",
      "MOC",
      "Indian Standards",
      "International Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/Globe Valve.png",
        "data": [
          "Globe Valve",
          "15–600",
          "CS/SS/Alloy",
          "IS 5892, IS 778 (Bronze)",
          "API 623, ASME B16.34"
        ]
      },
      {
        "image": "/usages_img/Stop Valve.png",
        "data": [
          "Stop Valve",
          "15–300",
          "Bronze/DI/SS",
          "IS 778",
          "BS 5154"
        ]
      }
    ],
    "isImageCards": true
  },
  {
    "category": "6. AIR VALVES (INCLUDING TAMPER-PROOF)",
    "headers": [
      "Valve Type",
      "Size",
      "MOC",
      "Indian Standards",
      "International Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/Single Orifice Air Valve.png",
        "data": [
          "Single Orifice Air Valve",
          "25–300",
          "DI/SS/CI",
          "IS 14845",
          "AWWA C512, EN 1074-4"
        ]
      },
      {
        "image": "/usages_img/Double Orifice  Kinetic Air Valve img.png",
        "data": [
          "Double Orifice / Kinetic Air Valve",
          "50–300",
          "DI/SS",
          "IS 14845",
          "AWWA C512"
        ]
      },
      {
        "image": "/usages_img/Combination Air Valve create img.png",
        "data": [
          "Combination Air Valve",
          "50–300",
          "DI/SS",
          "IS 14845",
          "AWWA C512"
        ]
      },
      {
        "image": "/usages_img/Tamper-Proof Air Valve.png",
        "data": [
          "Tamper-Proof Air Valve",
          "25–300",
          "DI/SS",
          "IS 14845 + Tamper-proof design spec",
          "AWWA C512 (Modified)"
        ]
      },
      {
        "image": "/usages_img/Air Release Valve.png",
        "data": [
          "Air Release Valve",
          "15–150",
          "Bronze/SS/DI",
          "IS 14845",
          "EN 1074-4"
        ]
      }
    ],
    "isImageCards": true
  },
  {
    "category": "7. SOLENOID VALVES (2-WAY, 3-WAY, HIGH PRESSURE)",
    "headers": [
      "Type",
      "Size Range",
      "MOC",
      "Indian Standards",
      "International Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/2-Way Solenoid Valve.png",
        "data": [
          "2-Way Solenoid Valve",
          "10–150",
          "Brass/SS",
          "IS 778 (material)",
          "EN 60730, CE Standards"
        ]
      },
      {
        "image": "/usages_img/3-Way4-Way Solenoid Valve.png",
        "data": [
          "3-Way/4-Way Solenoid Valve",
          "10–100",
          "Brass/SS",
          "–",
          "EN 12259"
        ]
      },
      {
        "image": "/usages_img/High Pressure Solenoid Valve.png",
        "data": [
          "High Pressure Solenoid Valve",
          "10–50",
          "SS",
          "–",
          "Manufacturer/API equipment norms"
        ]
      }
    ],
    "isImageCards": true
  },
  {
    "category": "8. PRESSURE REDUCING VALVES (PRV)",
    "headers": [
      "Type",
      "Size Range",
      "MOC",
      "Indian Standards",
      "International Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/Pilot Operated PRV.png",
        "data": [
          "Pilot Operated PRV",
          "50–600",
          "DI/CS/SS",
          "–",
          "AWWA C530, EN 1074-5"
        ]
      },
      {
        "image": "/usages_img/Direct Acting PRV.png",
        "data": [
          "Direct Acting PRV",
          "15–150",
          "Bronze/SS",
          "IS 778 (materials)",
          "EN 12516"
        ]
      },
      {
        "image": "/usages_img/Waterworks PRV.png",
        "data": [
          "Waterworks PRV",
          "25–300",
          "DI",
          "CPHEEO",
          "AWWA C530"
        ]
      }
    ],
    "isImageCards": true
  },
  {
    "category": "9. PRESSURE RELIEF / SAFETY VALVES",
    "headers": [
      "Type",
      "Size Range",
      "MOC",
      "Indian Standards",
      "International Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/Safety Relief Valve.png",
        "data": [
          "Safety Relief Valve",
          "15–600",
          "CS/SS/Alloy",
          "IS 8753",
          "API 526, ASME Sec VIII"
        ]
      },
      {
        "image": "/usages_img/Spring Loaded Safety Valve.png",
        "data": [
          "Spring Loaded Safety Valve",
          "15–300",
          "SS/CS",
          "IS 8753",
          "API 527"
        ]
      },
      {
        "image": "/usages_img/Pilot Operated Relief Valve.png",
        "data": [
          "Pilot Operated Relief Valve",
          "25–800",
          "CS/SS",
          "–",
          "API 526"
        ]
      }
    ],
    "isImageCards": true
  },
  {
    "category": "10. STRAINERS",
    "headers": [
      "Type",
      "Size Range",
      "MOC",
      "Indian Standards",
      "International Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/Y-Type Strainer.png",
        "data": [
          "Y-Type Strainer",
          "15–1200",
          "CI/DI/CS/SS",
          "IS 13095 (Guideline)",
          "ASME B31.1/B31.3"
        ]
      },
      {
        "image": "/usages_img/Basket Strainer  img.png",
        "data": [
          "Basket Strainer",
          "50–1400",
          "CS/SS/DI",
          "–",
          "ASME B31.3"
        ]
      }
    ],
    "isImageCards": true
  },
  {
    "category": "11. FOOT VALVES",
    "headers": [
      "Type",
      "Size Range",
      "MOC",
      "Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/Foot Valve with Strainer.png",
        "data": [
          "Foot Valve with Strainer",
          "50–1200",
          "DI/CI/SS",
          "IS 4038 (older), IS 10805 (reference)"
        ]
      },
      {
        "image": "/usages_img/Reflux Foot Valve img.png",
        "data": [
          "Reflux Foot Valve",
          "50–1200",
          "DI/SS",
          "IS 4038"
        ]
      }
    ],
    "isImageCards": true
  },
  {
    "category": "12. FLOAT VALVES",
    "headers": [
      "Type",
      "Size Range",
      "MOC",
      "Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/Automatic Float Valve.png",
        "data": [
          "Automatic Float Valve",
          "25–300",
          "Bronze/DI/SS",
          "IS 1703"
        ]
      }
    ],
    "isImageCards": true
  },
  {
    "category": "13. KNIFE GATE VALVES",
    "headers": [
      "Type",
      "Size Range",
      "MOC",
      "Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/img Uni-Directional Knife Gate.png",
        "data": [
          "Uni-Directional Knife Gate",
          "50–1200",
          "SS/CS/DI",
          "–"
        ]
      },
      {
        "image": "/usages_img/Bi-Directional Knife Gate img.png",
        "data": [
          "Bi-Directional Knife Gate",
          "50–1200",
          "SS/CS/DI",
          "–"
        ]
      }
    ],
    "isImageCards": true
  },
  {
    "category": "14. DIAPHRAGM VALVES",
    "headers": [
      "Type",
      "Size Range",
      "MOC",
      "Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/. DIAPHRAGM VALVES Weir Type img.png",
        "data": [
          "Weir Type",
          "15–350",
          "CS/DI/SS/Bonded Lining",
          "IS 13055"
        ]
      },
      {
        "image": "/usages_img/DIAPHRAGM VALVES Straight.png",
        "data": [
          "Straight Through Type",
          "15–350",
          "CS/SS",
          "–"
        ]
      }
    ],
    "isImageCards": true
  },
  {
    "category": "15. PLUG VALVES",
    "headers": [
      "Type",
      "Size Range",
      "MOC",
      "Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/Eccentric Plug Valve img.png",
        "data": [
          "Eccentric Plug Valve",
          "50–1600",
          "DI/CS/SS",
          "–"
        ]
      },
      {
        "image": "/usages_img/Lubricated Plug Valve img.png",
        "data": [
          "Lubricated Plug Valve",
          "15–600",
          "CS/SS",
          "–"
        ]
      }
    ],
    "isImageCards": true
  },
  {
    "category": "16. PINCH VALVES",
    "headers": [
      "Type",
      "Size Range",
      "MOC",
      "Standards"
    ],
    "rows": [
      {
        "image": "/usages_img/Manual Pinch Valve.png",
        "data": [
          "Manual Pinch Valve",
          "25–1200",
          "Rubber Sleeve + CS/SS Body",
          "–"
        ]
      },
      {
        "image": "/usages_img/Air Operated Pinch Valve  img.png",
        "data": [
          "Air Operated Pinch Valve",
          "25–1200",
          "Rubber Sleeve",
          "–"
        ]
      }
    ],
    "isImageCards": true
  }
];

const ValveCarouselSection = ({ section }) => {
  const [step, setStep] = useState(0);
  const isPausedRef = React.useRef(false);

  const totalItems = section.rows.length;
  const angle = 360 / totalItems;
  const activeIndex = ((step % totalItems) + totalItems) % totalItems;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        setStep((prev) => prev + 1);
      }
    }, 2000); // Auto-rotate every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePrev = (e) => {
    e.stopPropagation();
    setStep((prev) => prev - 1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setStep((prev) => prev + 1);
  };

  const handleItemClick = (e, targetIdx) => {
    e.stopPropagation();
    setStep((prev) => {
      const currentIdx = ((prev % totalItems) + totalItems) % totalItems;
      let diff = targetIdx - currentIdx;
      // Find the shortest rotation path
      if (diff > totalItems / 2) diff -= totalItems;
      else if (diff < -totalItems / 2) diff += totalItems;
      return prev + diff;
    });
  };

  return (
    <div 
      className="carousel-split-layout"
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; }}
    >
      <div className="carousel-left-pane">
        <div className="circular-carousel-scene">
          <div 
            className="circular-carousel"
            style={{ transform: `translateZ(-150px) rotateY(${step * -angle}deg)` }}
          >
            {section.rows.map((row, idx) => {
              const itemAngle = angle * idx;
              return (
                <div 
                  key={idx} 
                  className={`carousel-item ${idx === activeIndex ? 'active' : ''}`}
                  style={{ transform: `rotateY(${itemAngle}deg) translateZ(150px)` }}
                  onClick={(e) => handleItemClick(e, idx)}
                >
                  {row.image ? (
                    <img src={row.image} alt={row.data[0]} />
                  ) : (
                    <div style={{ color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center' }}>Image Coming Soon</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="carousel-controls">
          <button onClick={handlePrev}>&#8592;</button>
          <button onClick={handleNext}>&#8594;</button>
        </div>
      </div>
      <div className="carousel-right-pane">
        <h3 className="active-valve-title">{section.rows[activeIndex].data[0]}</h3>
        <table className="active-valve-table">
          <tbody>
            {section.headers.slice(1).map((header, hIdx) => (
              <tr key={hIdx}>
                <th>{header}</th>
                <td>{section.rows[activeIndex].data[hIdx + 1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function IndustryPage({ onOpenQuote }) {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="industry-page-wrapper">
      <section className="industry-hero">
        <div className="container">
          <h1 className="industry-hero-title">Master Table of All Valve Types</h1>
          <p className="industry-hero-subtitle">
            Comprehensive reference for valve categories, sizes, materials, and international standards.
          </p>
        </div>
      </section>

      <section className="industry-content-section">
        <div className="container">
          <div className="table-accordion-wrapper">
            {industryData.map((section, idx) => (
              <div 
                className={`accordion-item ${openSections[idx] ? 'open' : ''}`} 
                key={idx}
              >
                <div 
                  className="accordion-header" 
                  onClick={() => toggleSection(idx)}
                >
                  <h2>{section.category}</h2>
                  <i className={`fas fa-chevron-${openSections[idx] ? 'up' : 'down'}`}></i>
                </div>
                
                {openSections[idx] && (
                  <div className="accordion-body">
                    {section.isImageCards ? (
                      <ValveCarouselSection section={section} />
                    ) : (
                      <div className="table-responsive">
                        <table className="industry-data-table">
                          <thead>
                            <tr>
                              {section.headers.map((header, hIdx) => (
                                <th key={hIdx}>{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="industry-cta">
            <p>Need more information about a specific valve type or standard?</p>
            <button className="btn-primary" onClick={onOpenQuote}>
              Request a Technical Proposal <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
