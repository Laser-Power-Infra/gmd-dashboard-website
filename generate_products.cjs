const fs = require('fs');

const products = [
  {
    name: 'Single-Flanged Dismantling Joints',
    image: '/other accessories/single flange dismantling.png',
    usage: [
      'Facilitates the installation and removal of valves, meters, or other components from a pipeline.',
      'Provides axial adjustment to accommodate pipe misalignment.',
      'Reduces time and effort during valve replacement or repair.'
    ]
  },
  {
    name: 'Rubber Bellows',
    image: '/other accessories/rubber bellows.png',
    usage: [
      'Absorbs thermal expansion and contraction in pipelines.',
      'Reduces vibration and noise transmission to valves.',
      'Prevents leakage in high-pressure or high-temperature systems.',
      'Commonly used in critical applications such as chemical plants and power plants.'
    ]
  },
  {
    name: 'Basket Strainers',
    image: '/other accessories/basket strainers.png',
    usage: [
      'Provides larger debris removal capacity.',
      'Protects valves and other downstream equipment from damage.',
      'Improves overall system efficiency and reliability.'
    ]
  },
  {
    name: 'Temporary Cone or Tee Strainers',
    image: '/other accessories/cone strainers.png',
    usage: [
      'Used during commissioning to filter out debris, particles, & contaminants from the fluid stream.',
      'Protects valves and other downstream equipment from damage.',
      'Improves overall system efficiency and reliability.'
    ]
  },
  {
    name: 'Weld-Neck Flanges',
    image: '/other accessories/wewld neck flange.png',
    usage: [
      'Provides a secure and leak-proof connection between valves and piping systems.',
      'Facilitates easy installation, removal, and maintenance of valves.',
      'Supports high-pressure and high-temperature applications in various industries.'
    ]
  },
  {
    name: 'Slip-On Flanges',
    image: '/other accessories/slip flange.png',
    usage: [
      'Provides a secure and leak-proof connection between valves and piping systems.',
      'Facilitates easy installation, removal, and maintenance of valves.',
      'Supports high-pressure and high-temperature applications in various industries.'
    ]
  },
  {
    name: 'Blind Flanges',
    image: '/other accessories/blind flange.png',
    usage: [
      'Provides a secure and leak-proof connection between valves and piping systems.',
      'Facilitates easy installation, removal, and maintenance of valves.',
      'Supports high-pressure and high-temperature applications in various industries.'
    ]
  },
  {
    name: 'Threaded Flanges',
    image: '/other accessories/threaded  flange.png',
    usage: [
      'Provides a secure and leak-proof connection between valves and piping systems.',
      'Facilitates easy installation, removal, and maintenance of valves.',
      'Supports high-pressure and high-temperature applications in various industries.'
    ]
  },
  {
    name: 'Mechanical Indicators (Lever/Scale type)',
    image: '/other accessories/mechanical indicators.png',
    usage: [
      'Displays whether the valve is open, closed, or in an intermediate position.',
      'Essential for manual valves and automated systems.'
    ]
  },
  {
    name: 'Electrical Indicators (Limit switches with LED displays)',
    image: '/other accessories/electrical indicator.png',
    usage: [
      'Displays whether the valve is open, closed, or in an intermediate position.',
      'Essential for manual valves and automated systems.'
    ]
  },
  {
    name: 'Mechanical Switches',
    image: '/other accessories/mechanical switches.png',
    usage: [
      'Sends a signal to the control system indicating valve position.',
      'Common in automated and safety-critical systems.'
    ]
  },
  {
    name: 'Proximity Sensors (Magnetic or Inductive)',
    image: '/other accessories/proximity sensors.png',
    usage: [
      'Sends a signal to the control system indicating valve position.',
      'Common in automated and safety-critical systems.'
    ]
  },
  {
    name: 'Direct-Acting Solenoid Valves',
    image: '/other accessories/direct acting solenoid.png',
    usage: [
      'Controls the flow of air, gas, or fluid to actuators or pneumatic valves.',
      'Enables remote operation of valves.'
    ]
  },
  {
    name: 'Pilot-Operated Solenoid Valves',
    image: '/other accessories/pilot operated.png',
    usage: [
      'Controls the flow of air, gas, or fluid to actuators or pneumatic valves.',
      'Enables remote operation of valves.'
    ]
  },
  {
    name: 'Pneumatic Actuators (Air-Operated)',
    image: '/other accessories/pneumatic  air operated.png',
    usage: [
      'Automates valve operation for opening, closing, or throttling.',
      'Protects valves and other downstream equipment from damage.',
      'Reduces manual intervention and enables precise control.'
    ]
  },
  {
    name: 'Hydraulic Actuators (Fluid-Operated)',
    image: '/other accessories/hydraullic  fluid operated.png',
    usage: [
      'Automates valve operation for opening, closing, or throttling.',
      'Protects valves and other downstream equipment from damage.',
      'Reduces manual intervention and enables precise control.'
    ]
  },
  {
    name: 'Electric Actuators (Motor-Driven)',
    image: '/other accessories/electric motor driven.png',
    usage: [
      'Automates valve operation for opening, closing, or throttling.',
      'Protects valves and other downstream equipment from damage.',
      'Reduces manual intervention and enables precise control.'
    ]
  },
  {
    name: 'Pneumatic Valve Positioners',
    image: '/other accessories/pneumatic valve positioner.png',
    usage: [
      'Provides a secure and leak-proof connection between valves and piping systems.',
      'Facilitates easy installation, removal, and maintenance of valves.',
      'Supports high-pressure and high-temperature applications in various industries.'
    ]
  },
  {
    name: 'Electro-Pneumatic Valve Positioners',
    image: '/other accessories/electro pneumatic.png',
    usage: [
      'Provides a secure and leak-proof connection between valves and piping systems.',
      'Facilitates easy installation, removal, and maintenance of valves.',
      'Supports high-pressure and high-temperature applications in various industries.'
    ]
  },
  {
    name: 'Spiral Wound Gaskets',
    image: '/other accessories/spiral wound gasket.png',
    usage: [
      'Creates a leak-tight seal between valve flanges and piping connections.',
      'Supports high-pressure and high-temperature applications.'
    ]
  },
  {
    name: 'Ring-Type Joint (RTJ) Gaskets',
    image: '/other accessories/ring gasket.png',
    usage: [
      'Creates a leak-tight seal between valve flanges and piping connections.',
      'Supports high-pressure and high-temperature applications.'
    ]
  },
  {
    name: 'Plugged or Capped Connections',
    image: '/other accessories/plugged and crapped  connections.png',
    usage: [
      'Releases trapped fluids or gases for maintenance or safety.',
      'Prevents overpressure or contamination buildup.'
    ]
  },
  {
    name: 'Integrated Drain or Vent Valves',
    image: '/other accessories/integrated drain or vent valve.png',
    usage: [
      'Releases trapped fluids or gases for maintenance or safety.',
      'Prevents overpressure or contamination buildup.'
    ]
  },
  {
    name: 'Inline Silencers',
    image: '/other accessories/inline silencer.png',
    usage: [
      'Reduces noise caused by high-velocity fluid or gas flow through valves.',
      'Improves workplace safety and comfort.'
    ]
  },
  {
    name: 'Exhaust Mufflers',
    image: '/other accessories/exhaust mufflers.png',
    usage: [
      'Reduces noise caused by high-velocity fluid or gas flow through valves.',
      'Improves workplace safety and comfort.'
    ]
  },
  {
    name: 'Analog Pressure Gauges',
    image: '/other accessories/analog pressure gauge.png',
    usage: [
      'Monitors fluid pressure or flow rate near the valve.',
      'Helps in troubleshooting and system optimization.'
    ]
  },
  {
    name: 'Digital Flowmeters',
    image: '/other accessories/digital flowmeters.png',
    usage: [
      'Monitors fluid pressure or flow rate near the valve.',
      'Helps in troubleshooting and system optimization.'
    ]
  },
  {
    name: 'Fixed-Length Extension Stems',
    image: '/other accessories/fixed length  extension stems.png',
    usage: [
      'Allows operation of valves in hard-to-reach areas (e.g., high or underground installations).'
    ]
  },
  {
    name: 'Chain-Operated Extensions',
    image: '/other accessories/chain operated extension.png',
    usage: [
      'Allows operation of valves in hard-to-reach areas (e.g., high or underground installations).',
      'Chain wheels are used for overhead valves.'
    ]
  },
  {
    name: 'Removable Thermal Insulation Covers',
    image: '/other accessories/removal thermal insulation.png',
    usage: [
      'Maintains fluid temperature within the valve.',
      'Prevents heat loss or freezing in extreme conditions.'
    ]
  },
  {
    name: 'Custom-Molded Insulation Jackets',
    image: '/other accessories/custom molded insulation.png',
    usage: [
      'Maintains fluid temperature within the valve.',
      'Prevents heat loss or freezing in extreme conditions.'
    ]
  },
  {
    name: 'Padlockable Handles',
    image: '/other accessories/padlockable handles.png',
    usage: [
      'Prevents unauthorized operation of the valve.',
      'Common in safety-critical or hazardous environments.'
    ]
  },
  {
    name: 'Interlocking Systems',
    image: '/other accessories/interlocking system.png',
    usage: [
      'Prevents unauthorized operation of the valve.',
      'Common in safety-critical or hazardous environments.'
    ]
  },
  {
    name: 'Analog Feedback Systems (4-20mA signals)',
    image: '/other accessories/analog feedback.png',
    usage: [
      'Sends real-time valve status to control systems.',
      'Integral to process monitoring and automation.'
    ]
  },
  {
    name: 'Digital Feedback Systems (HART or Fieldbus)',
    image: '/other accessories/digital feeback.png',
    usage: [
      'Sends real-time valve status to control systems.',
      'Integral to process monitoring and automation.'
    ]
  },
  {
    name: 'Y Strainer',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_31_28 PM.png',
    usage: [
      'Available in Cast Iron, Ductile Iron, SG Iron, Cast Steel, Stainless Steel, Copper Alloy, Duplex.',
      'Used in pipelines to protect equipment from debris.',
      'Compact design, easy to clean without interrupting flow.'
    ]
  }
];

let content = fs.readFileSync('src/components/OtherProductsPage.jsx', 'utf8');

const startIdx = content.indexOf('const otherProducts = [');
const endIdx = content.indexOf('  const filteredProducts =');

if (startIdx !== -1 && endIdx !== -1) {
  const newArrayStr = 'const otherProducts = [\n' + products.map((p, i) => {
    return '    {\n' +
      "      id: 'prod-" + i + "',\n" +
      "      name: " + JSON.stringify(p.name) + ",\n" +
      "      image: " + JSON.stringify(p.image) + ",\n" +
      "      usage: " + JSON.stringify(p.usage, null, 8).replace(/\n/g, '\n      ').replace(/\[\s+/, '[\n        ').replace(/\s+\]/, '\n      ]') + "\n" +
      "    }";
  }).join(',\n') + '\n  ];\n\n';

  const newContent = content.slice(0, startIdx) + newArrayStr + content.slice(endIdx);
  fs.writeFileSync('src/components/OtherProductsPage.jsx', newContent);
  console.log('Success updating OtherProductsPage.jsx');
} else {
  console.log('Could not find array boundaries');
}
