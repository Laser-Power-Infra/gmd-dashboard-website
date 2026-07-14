import React, { useState } from 'react';
import './OtherProductsPage.css';

export default function OtherProductsPage({ onOpenQuote }) {
  const [searchQuery, setSearchQuery] = useState('');

  const otherProducts = [
    {
      id: 'prod-0',
      name: "Single-Flanged Dismantling Joints",
      image: "/other accessories/single flange dismantling.png",
      usage: [
        "Facilitates the installation and removal of valves, meters, or other components from a pipeline.",
              "Provides axial adjustment to accommodate pipe misalignment.",
              "Reduces time and effort during valve replacement or repair."
      ]
    },
    {
      id: 'prod-1',
      name: "Rubber Bellows",
      image: "/other accessories/rubber bellows.png",
      usage: [
        "Absorbs thermal expansion and contraction in pipelines.",
              "Reduces vibration and noise transmission to valves.",
              "Prevents leakage in high-pressure or high-temperature systems.",
              "Commonly used in critical applications such as chemical plants and power plants."
      ]
    },
    {
      id: 'prod-2',
      name: "Basket Strainers",
      image: "/other accessories/basket strainers.png",
      usage: [
        "Provides larger debris removal capacity.",
              "Protects valves and other downstream equipment from damage.",
              "Improves overall system efficiency and reliability."
      ]
    },
    {
      id: 'prod-3',
      name: "Temporary Cone or Tee Strainers",
      image: "/other accessories/cone strainers.png",
      usage: [
        "Used during commissioning to filter out debris, particles, & contaminants from the fluid stream.",
              "Protects valves and other downstream equipment from damage.",
              "Improves overall system efficiency and reliability."
      ]
    },
    {
      id: 'prod-4',
      name: "Weld-Neck Flanges",
      image: "/other accessories/wewld neck flange.png",
      usage: [
        "Provides a secure and leak-proof connection between valves and piping systems.",
              "Facilitates easy installation, removal, and maintenance of valves.",
              "Supports high-pressure and high-temperature applications in various industries."
      ]
    },
    {
      id: 'prod-5',
      name: "Slip-On Flanges",
      image: "/other accessories/slip flange.png",
      usage: [
        "Provides a secure and leak-proof connection between valves and piping systems.",
              "Facilitates easy installation, removal, and maintenance of valves.",
              "Supports high-pressure and high-temperature applications in various industries."
      ]
    },
    {
      id: 'prod-6',
      name: "Blind Flanges",
      image: "/other accessories/blind flange.png",
      usage: [
        "Provides a secure and leak-proof connection between valves and piping systems.",
              "Facilitates easy installation, removal, and maintenance of valves.",
              "Supports high-pressure and high-temperature applications in various industries."
      ]
    },
    {
      id: 'prod-7',
      name: "Threaded Flanges",
      image: "/other accessories/threaded  flange.png",
      usage: [
        "Provides a secure and leak-proof connection between valves and piping systems.",
              "Facilitates easy installation, removal, and maintenance of valves.",
              "Supports high-pressure and high-temperature applications in various industries."
      ]
    },
    {
      id: 'prod-8',
      name: "Mechanical Indicators (Lever/Scale type)",
      image: "/other accessories/mechanical indicators.png",
      usage: [
        "Displays whether the valve is open, closed, or in an intermediate position.",
              "Essential for manual valves and automated systems."
      ]
    },
    {
      id: 'prod-9',
      name: "Electrical Indicators (Limit switches with LED displays)",
      image: "/other accessories/electrical indicator.png",
      usage: [
        "Displays whether the valve is open, closed, or in an intermediate position.",
              "Essential for manual valves and automated systems."
      ]
    },
    {
      id: 'prod-10',
      name: "Mechanical Switches",
      image: "/other accessories/mechanical switches.png",
      usage: [
        "Sends a signal to the control system indicating valve position.",
              "Common in automated and safety-critical systems."
      ]
    },
    {
      id: 'prod-11',
      name: "Proximity Sensors (Magnetic or Inductive)",
      image: "/other accessories/proximity sensors.png",
      usage: [
        "Sends a signal to the control system indicating valve position.",
              "Common in automated and safety-critical systems."
      ]
    },
    {
      id: 'prod-12',
      name: "Direct-Acting Solenoid Valves",
      image: "/other accessories/direct acting solenoid.png",
      usage: [
        "Controls the flow of air, gas, or fluid to actuators or pneumatic valves.",
              "Enables remote operation of valves."
      ]
    },
    {
      id: 'prod-13',
      name: "Pilot-Operated Solenoid Valves",
      image: "/other accessories/pilot operated.png",
      usage: [
        "Controls the flow of air, gas, or fluid to actuators or pneumatic valves.",
              "Enables remote operation of valves."
      ]
    },
    {
      id: 'prod-14',
      name: "Pneumatic Actuators (Air-Operated)",
      image: "/other accessories/pneumatic  air operated.png",
      usage: [
        "Automates valve operation for opening, closing, or throttling.",
              "Protects valves and other downstream equipment from damage.",
              "Reduces manual intervention and enables precise control."
      ]
    },
    {
      id: 'prod-15',
      name: "Hydraulic Actuators (Fluid-Operated)",
      image: "/other accessories/hydraullic  fluid operated.png",
      usage: [
        "Automates valve operation for opening, closing, or throttling.",
              "Protects valves and other downstream equipment from damage.",
              "Reduces manual intervention and enables precise control."
      ]
    },
    {
      id: 'prod-16',
      name: "Electric Actuators (Motor-Driven)",
      image: "/other accessories/electric motor driven.png",
      usage: [
        "Automates valve operation for opening, closing, or throttling.",
              "Protects valves and other downstream equipment from damage.",
              "Reduces manual intervention and enables precise control."
      ]
    },
    {
      id: 'prod-17',
      name: "Pneumatic Valve Positioners",
      image: "/other accessories/pneumatic valve positioner.png",
      usage: [
        "Provides a secure and leak-proof connection between valves and piping systems.",
              "Facilitates easy installation, removal, and maintenance of valves.",
              "Supports high-pressure and high-temperature applications in various industries."
      ]
    },
    {
      id: 'prod-18',
      name: "Electro-Pneumatic Valve Positioners",
      image: "/other accessories/electro pneumatic.png",
      usage: [
        "Provides a secure and leak-proof connection between valves and piping systems.",
              "Facilitates easy installation, removal, and maintenance of valves.",
              "Supports high-pressure and high-temperature applications in various industries."
      ]
    },
    {
      id: 'prod-19',
      name: "Spiral Wound Gaskets",
      image: "/other accessories/spiral wound gasket.png",
      usage: [
        "Creates a leak-tight seal between valve flanges and piping connections.",
              "Supports high-pressure and high-temperature applications."
      ]
    },
    {
      id: 'prod-20',
      name: "Ring-Type Joint (RTJ) Gaskets",
      image: "/other accessories/ring gasket.png",
      usage: [
        "Creates a leak-tight seal between valve flanges and piping connections.",
              "Supports high-pressure and high-temperature applications."
      ]
    },
    {
      id: 'prod-21',
      name: "Plugged or Capped Connections",
      image: "/other accessories/plugged and crapped  connections.png",
      usage: [
        "Releases trapped fluids or gases for maintenance or safety.",
              "Prevents overpressure or contamination buildup."
      ]
    },
    {
      id: 'prod-22',
      name: "Integrated Drain or Vent Valves",
      image: "/other accessories/integrated drain or vent valve.png",
      usage: [
        "Releases trapped fluids or gases for maintenance or safety.",
              "Prevents overpressure or contamination buildup."
      ]
    },
    {
      id: 'prod-23',
      name: "Inline Silencers",
      image: "/other accessories/inline silencer.png",
      usage: [
        "Reduces noise caused by high-velocity fluid or gas flow through valves.",
              "Improves workplace safety and comfort."
      ]
    },
    {
      id: 'prod-24',
      name: "Exhaust Mufflers",
      image: "/other accessories/exhaust mufflers.png",
      usage: [
        "Reduces noise caused by high-velocity fluid or gas flow through valves.",
              "Improves workplace safety and comfort."
      ]
    },
    {
      id: 'prod-25',
      name: "Analog Pressure Gauges",
      image: "/other accessories/analog pressure gauge.png",
      usage: [
        "Monitors fluid pressure or flow rate near the valve.",
              "Helps in troubleshooting and system optimization."
      ]
    },
    {
      id: 'prod-26',
      name: "Digital Flowmeters",
      image: "/other accessories/digital flowmeters.png",
      usage: [
        "Monitors fluid pressure or flow rate near the valve.",
              "Helps in troubleshooting and system optimization."
      ]
    },
    {
      id: 'prod-27',
      name: "Fixed-Length Extension Stems",
      image: "/other accessories/fixed length  extension stems.png",
      usage: [
        "Allows operation of valves in hard-to-reach areas (e.g., high or underground installations)."
      ]
    },
    {
      id: 'prod-28',
      name: "Chain-Operated Extensions",
      image: "/other accessories/chain operated extension.png",
      usage: [
        "Allows operation of valves in hard-to-reach areas (e.g., high or underground installations).",
              "Chain wheels are used for overhead valves."
      ]
    },
    {
      id: 'prod-29',
      name: "Removable Thermal Insulation Covers",
      image: "/other accessories/removal thermal insulation.png",
      usage: [
        "Maintains fluid temperature within the valve.",
              "Prevents heat loss or freezing in extreme conditions."
      ]
    },
    {
      id: 'prod-30',
      name: "Custom-Molded Insulation Jackets",
      image: "/other accessories/custom molded insulation.png",
      usage: [
        "Maintains fluid temperature within the valve.",
              "Prevents heat loss or freezing in extreme conditions."
      ]
    },
    {
      id: 'prod-31',
      name: "Padlockable Handles",
      image: "/other accessories/padlockable handles.png",
      usage: [
        "Prevents unauthorized operation of the valve.",
              "Common in safety-critical or hazardous environments."
      ]
    },
    {
      id: 'prod-32',
      name: "Interlocking Systems",
      image: "/other accessories/interlocking system.png",
      usage: [
        "Prevents unauthorized operation of the valve.",
              "Common in safety-critical or hazardous environments."
      ]
    },
    {
      id: 'prod-33',
      name: "Analog Feedback Systems (4-20mA signals)",
      image: "/other accessories/analog feedback.png",
      usage: [
        "Sends real-time valve status to control systems.",
              "Integral to process monitoring and automation."
      ]
    },
    {
      id: 'prod-34',
      name: "Digital Feedback Systems (HART or Fieldbus)",
      image: "/other accessories/digital feeback.png",
      usage: [
        "Sends real-time valve status to control systems.",
              "Integral to process monitoring and automation."
      ]
    },
    {
      id: 'prod-35',
      name: "Y Strainer",
      image: "/valve img/ChatGPT Image Jun 9, 2026, 03_31_28 PM.png",
      usage: [
        "Available in Cast Iron, Ductile Iron, SG Iron, Cast Steel, Stainless Steel, Copper Alloy, Duplex.",
              "Used in pipelines to protect equipment from debris.",
              "Compact design, easy to clean without interrupting flow."
      ]
    }
  ];

  const filteredProducts = otherProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.usage.some(u => u.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="other-products-page-wrapper">



      {/* Grid Section */}
      <section className="other-products-grid-section">
        <div className="container">
          <p className="results-count">Showing {filteredProducts.length} industrial products</p>
          <div className="other-products-grid">
            {filteredProducts.map((p) => (
              <div className="other-product-card" key={p.id}>
                <div className="card-image-wrapper">
                  <img src={p.image} alt={p.name} className="card-product-img" />
                </div>
                <div className="card-content-wrapper">
                  <span className="card-category-badge">Piping & Controls</span>
                  <h3 className="card-product-name">{p.name}</h3>
                  
                  <div className="card-spec-list">

                    
                    <div className="spec-item">
                      <span className="spec-label">Usage / Functions:</span>
                      <ul className="spec-bullet-list">
                        {p.usage.map((u, i) => (
                          <li key={i}>{u}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="card-actions-row">
                    <button 
                      className="btn-card-quote" 
                      onClick={onOpenQuote}
                      id={`quote-btn-${p.id}`}
                    >
                      Request Technical Proposal <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
