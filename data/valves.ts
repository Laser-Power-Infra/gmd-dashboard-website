import type { Valve } from '@/types';

export const valvesData: Valve[] = [
  {
    id: 'butterfly',
    name: 'Butterfly Valve',
    category: 'Isolation Valves',
    iconName: 'butterfly',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_27_24 PM.png',
    size: 'Up to 3300 mm',
    standards: ['API 609', 'IS 13095', 'BS 5155', 'AWWA C504', 'EN 593'],
    moc: ['Cast Iron', 'Ductile Iron', 'SG Iron', 'Cast Steel', 'Stainless Steel', 'Copper Alloy', 'Duplex'],
    pressure: ['1.0', '1.6', '2.0', '2.5', 'Class 150#', '300#', '800#'],
    operation: ['Manual Lever', 'Gear Operated', 'Electric Actuated', 'Pneumatic Actuator'],
    endConnection: 'Wafer / Lug / Double Flanged',
    application: 'Water Supply, Water Treatment, Power Plants, Chemical & Process Industries, HVAC.',
    description: 'GM Dalui Butterfly Valves are designed to provide bubble-tight shut-off in a compact, lightweight design. Engineered for high performance, these valves feature low torque requirements, double eccentric or concentric discs, and excellent flow throttling capabilities for large-scale piping systems.',
    features: [
      'Bi-directional bubble-tight shut-off capability.',
      'Concentric or double eccentric disc design to minimize seat wear and operating torque.',
      'Integrally molded or replaceable elastomeric/metal seats.',
      'Heavy-duty shafts with self-lubricating sleeve bearings.',
      'Easy integration with electric, pneumatic, or hydraulic actuators.'
    ]
  },
  {
    id: 'sluice-gate',
    name: 'Sluice Gate Valve / Gate Valve',
    category: 'Isolation Valves',
    iconName: 'gate',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_27_36 PM.png',
    size: 'Up to 1200 mm',
    standards: ['IS 14846', 'BS 5163', 'AWWA C509 / C515', 'EN 1171'],
    moc: ['Cast Iron', 'Ductile Iron', 'SG Iron', 'Cast Steel', 'Stainless Steel', 'Copper Alloy', 'Duplex'],
    pressure: ['1.0', '1.6', '2.0', '2.5', 'Class 150#', '300#', '800#'],
    operation: ['Manual Handwheel', 'Bevel/Spur Gear', 'Electric Actuated'],
    endConnection: 'Flanged (Flat face or Raised face)',
    application: 'Water distribution systems, waste water treatment, irrigation, fire fighting, dams.',
    description: 'Our Sluice Gate Valves offer full bore, low pressure drop isolation of fluids. These valves are built for rugged environments, utilizing resilient or metal seating to ensure long-term durability and zero leakage under water distribution grid pressures.',
    features: [
      'Resilient seated gate (EPDM bonded) or metal-to-metal seating.',
      'Low torque operation with high endurance bronze stem nuts.',
      'Smooth, unobstructed full-bore passage preventing debris accumulation.',
      'Inside screw non-rising stem (NRS) or outside screw & yoke (OS&Y) configurations.',
      'Corrosion resistant epoxy powder coating inside and out.'
    ]
  },
  {
    id: 'dual-check',
    name: 'Dual Plate Check Valve',
    category: 'Check Valves',
    iconName: 'check-dual',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_27_42 PM.png',
    size: 'Up to 1000 mm',
    standards: ['API 594', 'API 6D', 'ASME B16.34'],
    moc: ['Cast Iron', 'Ductile Iron', 'SG Iron', 'Cast Steel', 'Stainless Steel', 'Copper Alloy', 'Duplex'],
    pressure: ['1.0', '1.6', '2.0', '2.5', 'Class 150#', '300#', '800#'],
    operation: ['Automatic Non-Return (Spring loaded)'],
    endConnection: 'Wafer / Lugged / Flanged',
    application: 'Water supply pipelines, refineries, oil & gas distribution, steam lines, cooling systems.',
    description: 'Designed as a highly efficient backflow preventer, the Dual Plate Check Valve features spring-loaded plates that close quickly to prevent water hammer and reverse flow. It has a lightweight and compact wafer body, saving significant installation space.',
    features: [
      'Extremely compact face-to-face dimensions and light weight compared to swing check valves.',
      'Spring-loaded plates designed for low cracking pressure and quick closure.',
      'Independent plate springs to distribute loading evenly.',
      'Resilient EPDM/Viton seats or metal-to-metal stellite overlays.',
      'Minimizes water hammer and slamming during flow reversal.'
    ]
  },
  {
    id: 'non-return',
    name: 'Non Return Valve (Reflux Valve)',
    category: 'Check Valves',
    iconName: 'check-reflux',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_27_49 PM.png',
    size: 'Up to 1200 mm',
    standards: ['IS 5312 (Part 1 & 2)', 'BS 5153', 'EN 12334'],
    moc: ['Cast Iron', 'Ductile Iron', 'SG Iron', 'Cast Steel', 'Stainless Steel', 'Copper Alloy', 'Duplex'],
    pressure: ['1.0', '1.6', '2.0', '2.5', 'Class 150#', '300#', '800#'],
    operation: ['Automatic Non-Return (Gravity/Counter-weight)'],
    endConnection: 'Flanged',
    application: 'Water pumping stations, municipal supply, power plants, sewage treatment.',
    description: 'Our Non-Return (Reflux) Valves feature a robust swing disc mechanism to prevent backflow in fluid pipelines. Available with options like external dashpots or bypass arrangements, they are highly suitable for heavy-duty pumping applications.',
    features: [
      'Swing-type disc design with optional rubber lining for bubble-tight closure.',
      'Optional lever and counter-weight or hydraulic dashpot to control closing speed.',
      'Removable cover allows inspection and maintenance without removing the valve from line.',
      'Renewable gunmetal or stainless steel seat rings.',
      'Designed to handle water containing suspended solids.'
    ]
  },
  {
    id: 'air-valve',
    name: 'Air Valve (Kinetic/Double Act)',
    category: 'Safety & Control Valves',
    iconName: 'air',
    image: '/valve img/WhatsApp Image 2026-06-16 at 12.33.30 PM.jpeg',
    size: 'Up to 300 mm',
    standards: ['IS 14845', 'EN 1074-4'],
    moc: ['Cast Iron', 'Ductile Iron', 'SG Iron', 'Cast Steel', 'Stainless Steel', 'Copper Alloy', 'Duplex'],
    pressure: ['1.0', '1.6', '2.0', '2.5', 'Class 150#', '300#', '800#'],
    operation: ['Automatic Kinetic (Buoyancy operated)'],
    endConnection: 'Flanged or Screwed BSP/NPT',
    application: 'Water transmission main pipelines, high points in grids, irrigation networks.',
    description: 'Air Valves from GM Dalui play a critical role in pipeline safety by exhausting bulk air during pipeline filling, admitting air during pipeline draining (to prevent vacuum collapse), and releasing accumulated air under operating pressure.',
    features: [
      'Aerodynamic kinetic design prevents premature closure under high-velocity air discharge.',
      'Dual orifice configuration (small orifice for pressure air release, large orifice for bulk flow).',
      'Corrosion-resistant plastic or stainless steel float balls.',
      'Guaranteed sealing at very low operating pressures.',
      'Optional isolating valve integrated for inline maintenance.'
    ]
  },
  {
    id: 'globe-valve',
    name: 'Globe Valve',
    category: 'Isolation Valves',
    iconName: 'globe',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_28_01 PM.png',
    size: 'Up to 400 mm',
    standards: ['BS 1873', 'ASME B16.34', 'API 602 / API 600', 'DIN Standards'],
    moc: ['Cast Iron', 'Ductile Iron', 'SG Iron', 'Cast Steel', 'Stainless Steel', 'Copper Alloy', 'Duplex'],
    pressure: ['1.0', '1.6', '2.0', '2.5', 'Class 150#', '300#', '800#'],
    operation: ['Manual Handwheel', 'Gear Box', 'Electric Actuated'],
    endConnection: 'Flanged / Butt-weld / Socket-weld',
    application: 'Steam boilers, high-pressure steam distribution, chemical processes, cooling water systems.',
    description: 'Engineered for precise flow control and throttling, GM Dalui Globe Valves feature a spherical body with a moving plug-shaped disc. These valves provide tight sealing and are highly reliable for high-temperature and high-pressure steam lines.',
    features: [
      'Designed for precise throttling and frequent flow regulation.',
      'Stellite hard-faced seat and plug disc for wear and erosion resistance.',
      'Deep stuffing box with graphite packing for leak-proof stem sealing.',
      'Heavy-duty bolted bonnet design (pressure-seal bonnet for high-pressure service).',
      'Uni-directional flow configuration.'
    ]
  },
  {
    id: 'ball-valve',
    name: 'Ball Valve (Floating/Trunnion)',
    category: 'Isolation Valves',
    iconName: 'ball',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_28_07 PM.png',
    size: 'Up to 600 mm',
    standards: ['API 6D', 'BS 5351', 'API 608', 'ISO 17292'],
    moc: ['Cast Iron', 'Ductile Iron', 'SG Iron', 'Cast Steel', 'Stainless Steel', 'Copper Alloy', 'Duplex'],
    pressure: ['1.0', '1.6', '2.0', '2.5', 'Class 150#', '300#', '800#'],
    operation: ['Manual Lever', 'Gear Operated', 'Pneumatic Actuator', 'Electric Actuator'],
    endConnection: 'Flanged / Screwed / Socket-weld / Butt-weld',
    application: 'Oil & Gas pipelines, refineries, chemical processing, compressed air, industrial water.',
    description: 'Offering quick quarter-turn 90° on/off operations, our Ball Valves are constructed in floating ball or trunnion-mounted designs. They offer minimum flow restriction, firesafe certified build, and cavity pressure relief.',
    features: [
      'Quarter-turn quick operation with clear open/close visual indicators.',
      'Full bore or reduced bore designs.',
      'Firesafe design certified to API 607 / API 6FA.',
      'Anti-static device and blow-out proof stem design.',
      'Self-relieving seat designs to release cavity overpressure.'
    ]
  },
  {
    id: 'prv',
    name: 'Pressure Reducing Valve (PRV)',
    category: 'Safety & Control Valves',
    iconName: 'prv',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_28_12 PM.png',
    size: 'Up to 300 mm',
    standards: ['BS EN 1567', 'Manufacturer Standard'],
    moc: ['Cast Iron', 'Ductile Iron', 'SG Iron', 'Cast Steel', 'Stainless Steel', 'Copper Alloy', 'Duplex'],
    pressure: ['1.0', '1.6', '2.0', '2.5', 'Class 150#', '300#', '800#'],
    operation: ['Self-Acting Hydraulic (Pilot Operated / Diaphragm)'],
    endConnection: 'Flanged',
    application: 'Municipal water distribution, tall building water supply, industrial utility networks.',
    description: 'GM Dalui Pilot-Operated Pressure Reducing Valves maintain a constant pre-determined downstream pressure, regardless of fluctuations in upstream pressure or flow demand. The valve is hydraulically operated, using fluid energy to regulate flow.',
    features: [
      'Accurate and stable downstream pressure control under varying conditions.',
      'Pilot valve system is easily adjustable to set desired output pressure.',
      'High-grade nylon reinforced EPDM diaphragm for smooth regulation and long life.',
      'Easy inline maintenance without dismantling the main valve body.',
      'Includes fine-mesh pilot filter to prevent debris clogging.'
    ]
  },
  {
    id: 'foot-valve',
    name: 'Foot Valve (with Strainer)',
    category: 'Check Valves',
    iconName: 'foot',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_28_18 PM.png',
    size: 'Up to 600 mm',
    standards: ['IS 4038'],
    moc: ['Cast Iron', 'Ductile Iron', 'SG Iron', 'Cast Steel', 'Stainless Steel', 'Copper Alloy', 'Duplex'],
    pressure: ['1.0', '1.6', '2.0', '2.5', 'Class 150#', '300#', '800#'],
    operation: ['Automatic Non-Return (Lift type / Swing type)'],
    endConnection: 'Flanged',
    application: 'Pumping suction lines, agricultural lift irrigation, well pumping installations.',
    description: 'Foot Valves are installed at the bottom of pump suction lines to prevent pump de-priming when the pump stops. It includes an integrated heavy-duty strainer screen to filter out large debris that could damage pump impellers.',
    features: [
      'Combined non-return valve and high area strainer in a single unit.',
      'Low head loss design optimizes pump energy efficiency.',
      'Strainer screen flow area is minimum 3 to 4 times the nominal pipe area.',
      'Durable copper alloy or stainless steel seating rings.',
      'Easy to dismantle and clean the screen filter.'
    ]
  },
  {
    id: 'safety-relief',
    name: 'Pressure Relief Valve (Safety Valve)',
    category: 'Safety & Control Valves',
    iconName: 'safety',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_28_23 PM.png',
    size: 'Up to 250 mm',
    standards: ['API 526', 'ASME Section VIII', 'ISO 4126'],
    moc: ['Cast Iron', 'Ductile Iron', 'SG Iron', 'Cast Steel', 'Stainless Steel', 'Copper Alloy', 'Duplex'],
    pressure: ['1.0', '1.6', '2.0', '2.5', 'Class 150#', '300#', '800#'],
    operation: ['Spring Loaded / Pilot Operated (Automatic Safety release)'],
    endConnection: 'Flanged inlet/outlet or Threaded',
    application: 'Overpressure safety on boilers, pressure vessels, pipelines, gas tanks.',
    description: 'Serving as the ultimate safety device, GM Dalui Pressure Relief Valves protect systems from overpressure hazards. Designed to open automatically when the pressure exceeds the set point, they discharge excess fluid to relieve pressure.',
    features: [
      'Precision machined nozzle and disc for bubble-tight seat sealing.',
      'Spring setting calibrated and tested to precise user specifications.',
      'Bellows design option for backpressure compensation.',
      'High discharge capacity certified per ASME/API standards.',
      'Available with lifting lever for manual testing.'
    ]
  },
  {
    id: 'tamper-proof',
    name: 'Tamper Proof / Air Valve',
    category: 'Safety & Control Valves',
    iconName: 'lock',
    image: '/valve img/ChatGPT Image Jun 16, 2026, 03_31_02 PM.png',
    size: 'Up to 300 mm',
    standards: ['AWWA C512', 'Manufacturer Standard'],
    moc: ['Cast Iron', 'Ductile Iron', 'SG Iron', 'Cast Steel', 'Stainless Steel', 'Copper Alloy', 'Duplex'],
    pressure: ['1.0', '1.6', '2.0', '2.5', 'Class 150#', '300#', '800#'],
    operation: ['Lockable Handwheel', 'Gear operated with Lock, Padlock attachment'],
    endConnection: 'Flanged',
    application: 'Fire protection lines, public distribution standposts, high security pipelines.',
    description: 'Developed to prevent unauthorized operation or tampering of valves in public networks, these valves feature mechanical lockouts, padlock compatibility, or key-operated mechanisms to ensure operations are limited to authorized personnel.',
    features: [
      'Key-operated cap or padlock-locking bracket design.',
      'Robust body design resistant to external impact and vandal attempts.',
      'Resilient seated gate mechanism ensures bubble-tight sealing.',
      'Clear lock/unlock mechanical status indicator.',
      'Ideal for fire mains and public water schemes.'
    ]
  },

  



  {
  id: 'zero-velocity-valve',
  name: 'Zero Velocity Valve',
  category: 'Check Valves',
  iconName: 'zeroVelocityValve',
  image: '/valve img/zero-velocity-valve.jpeg',
  size: 'DN 80 mm to DN 1400 mm',

  standards: [
    'IS 5312',
    'BS 5153',
    'AWWA C508',
    'Manufacturer Standard'
  ],

  moc: [
    'Cast Iron',
    'Ductile Iron',
    'Cast Steel',
    'Stainless Steel'
  ],

  pressure: [
    'PN 10',
    'PN 16',
    'PN 25'
  ],

  operation: [
    'Automatic Non-Slam Operation'
  ],

  endConnection: 'Flanged',

  application:
    'Used in pumping mains, water supply systems, sewage treatment plants, irrigation networks, and industrial pipelines to prevent reverse flow and eliminate water hammer.',

  description:
    'Zero Velocity Valve is a hydraulically operated non-slam check valve designed to close automatically when the forward flow approaches zero velocity. The valve prevents reverse flow and protects pumps, pipelines, and associated equipment from water hammer and pressure surges.',

  features: [
    'Prevents reverse flow automatically without external power.',
    'Non-slam closing action eliminates water hammer and pressure surges.',
    'Protects pumps, motors, and pipelines from sudden flow reversal.',
    'Low head loss due to streamlined flow path.',
    'Suitable for clean water, raw water, and wastewater applications.',
    'Maintenance-friendly design with accessible internal components.',
    'Long service life with corrosion-resistant coating and materials.',
    'Available in large diameters up to DN 1400 mm.'
  ]
},
{
  id: 'pressure-release-valve',
  name: 'Pressure Release Valve',
  category: 'Safety & Control Valves',
  iconName: 'pressureReleaseValve',
  image: '/valve img/pressure-release-valve.png',

  size: 'DN 15 mm to DN 300 mm',

  standards: [
    'IS 15392',
    'API 526',
    'ASME Section VIII',
    'Manufacturer Standard'
  ],

  moc: [
    'Cast Iron',
    'Ductile Iron',
    'Cast Steel',
    'Carbon Steel',
    'Stainless Steel',
    'Bronze'
  ],

  pressure: [
    'PN 10',
    'PN 16',
    'PN 25',
    'PN 40',
    'Class 150',
    'Class 300'
  ],

  operation: [
    'Spring Loaded Automatic Operation',
    'Lever Assisted Manual Testing'
  ],

  endConnection: 'Flanged / Screwed / Threaded',

  application:
    'Used in water transmission systems, pumping stations, pressure pipelines, industrial process plants, fire protection systems, and storage tanks to safely release excess pressure and protect equipment.',

  description:
    'Pressure Release Valve is a self-operating safety valve designed to automatically release excess pressure from pipelines and pressure vessels when the system pressure exceeds a predetermined set point. The valve protects pumps, pipelines, tanks, and other equipment from damage caused by overpressure conditions while maintaining safe and reliable system operation.',

  features: [
    'Automatically releases excess pressure when preset pressure is exceeded.',
    'Protects pipelines, pumps, vessels, and equipment from overpressure damage.',
    'Spring-loaded mechanism ensures accurate pressure control.',
    'Fast opening and reseating action for enhanced safety.',
    'Reduces risk of pipeline bursts and system failures.',
    'Suitable for water, air, steam, and industrial fluid applications.',
    'Corrosion-resistant construction for long service life.',
    'Available in multiple pressure ratings and material combinations.',
    'Simple installation and low maintenance requirements.',
    'Optional manual lifting lever for periodic testing and inspection.'
  ]
}
];
