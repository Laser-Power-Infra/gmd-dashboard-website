import type { ValveDetail } from '@/types';

export const valveDetailsData: Record<string, ValveDetail> = {
  "butterfly": {
    "introduction": "A butterfly valve is a device used to regulate or isolate fluid flow. It features a circular disc that pivots to control the flow. When the disc is parallel to the flow, the valve is open; when perpendicular, it is closed.",
    "applications": [
      {
        "num": 1,
        "title": "Water Treatment Plants",
        "description": "Butterfly valves are crucial in water treatment processes, where they manage the flow of water through various stages of purification and distribution. Their compact design and quick response make them ideal for handling large volumes of water efficiently."
      },
      {
        "num": 2,
        "title": "Chemical Processing",
        "description": "In chemical industries, butterfly valves are used to control the flow of corrosive or toxic chemicals. Their construction materials can be tailored to resist chemical corrosion, ensuring safe and reliable operation in harsh environments."
      },
      {
        "num": 3,
        "title": "Oil & Gas Industry",
        "description": "Butterfly valves manage key process flows in gas transmission and oil refineries. Their fire-safe construction, tightness of sealing, and robust operation under pressure variations make them essential for petrochemical pipelines."
      },
      {
        "num": 4,
        "title": "HVAC Systems",
        "description": "In heating, ventilation, and air conditioning (HVAC) systems, butterfly valves control the flow of air and water within ductwork and piping. They help maintain the desired temperature and airflow, contributing to energy efficiency and system reliability."
      },
      {
        "num": 5,
        "title": "Fire Protection Systems",
        "description": "Butterfly valves are integrated into fire protection systems, where they act as shutoff valves to control the flow of water or fire suppressant. Their quick operation is vital in emergency situations, ensuring prompt fire suppression system activation."
      }
    ],
    "sections": [
      {
        "title": "Types Of Butterfly Valve - Connection Type",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Double Flanged Type",
            "image": "/uploads/2025/04/double-flanged-type.png",
            "description": "A double flanged butterfly valve features flanges on both sides for secure, bolted connections. This design ensures robust sealing and alignment, making it ideal for high-pressure and high-temperature applications. It provides reliable flow control and easy maintenance."
          },
          {
            "title": "Lug Type",
            "image": "/uploads/2025/04/lug-type.jpg",
            "description": "A lug type butterfly valve includes threaded inserts for secure flange attachment, enabling simple installation and removal. It offers reliable flow control, with features such as bi-directional sealing and robust construction."
          },
          {
            "title": "Wafer Type",
            "image": "/uploads/2025/04/water-type.jpg",
            "description": "A wafer type butterfly valve fits tightly between pipe flanges to maintain a seal against bi-directional pressure differentials. It is highly compact, lightweight, and economical for standard industrial pipelines."
          }
        ]
      },
      {
        "title": "Types Of Butterfly Valve - Disc Design",
        "gridClass": "col-4",
        "cards": [
          {
            "title": "Concentric Type",
            "image": "/uploads/2025/04/butterfly-valve-250x250-1.jpg",
            "description": "A concentric butterfly valve features a disc mounted on a central shaft that rotates within a single-plane body. This design ensures a tight seal and efficient flow control, ideal for low to moderate pressure applications."
          },
          {
            "title": "Resilient Seated Type",
            "image": "/uploads/2025/04/1-500x500-1.png",
            "description": "A resilient seated butterfly valve utilizes a flexible rubber seat to ensure a tight seal, making it ideal for low-pressure applications. Its design provides excellent sealing performance, ease of operation, and cost-effective maintenance."
          },
          {
            "title": "Double Eccentric Type",
            "image": "/uploads/2025/04/double-eccentric.jpg",
            "description": "A double eccentric butterfly valve has two offset features: 1. The shaft is off-centre. 2. The disc axis is offset from the seat. This design minimizes seat wear and improves sealing, making it suitable for higher pressure and temperature applications."
          },
          {
            "title": "Triple Offset Type",
            "image": "/uploads/2025/04/8-250x250-1.webp",
            "description": "A triple offset butterfly valve features a conical disc design with three key offsets: shaft, seat, and disc. This design enhances sealing and minimizes wear, making it suitable for high-pressure, high-temperature, and critical service applications."
          }
        ]
      }
    ]
  },
  "air-valve": {
    "introduction": "An air valve from DALUI is designed to manage air within pipelines, addressing both air release and vacuum conditions. It efficiently releases trapped air, prevents vacuum formation, and allows for smooth fluid flow, enhancing system reliability and performance across diverse industrial applications.",
    "applications": [
      {
        "num": 1,
        "title": "Water Distribution Systems",
        "description": "Prevents air accumulation and vacuum conditions, ensuring smooth operation and reducing the risk of pipeline damage or flow disruption."
      },
      {
        "num": 2,
        "title": "Sewage and Wastewater Systems",
        "description": "Manages air release and intake to maintain system efficiency and prevent pressure surges or blockages in sewage and wastewater pipelines."
      },
      {
        "num": 3,
        "title": "Industrial Processes",
        "description": "Enhances the efficiency of fluid handling systems by removing trapped air, preventing flow disruptions, and ensuring reliable operation in various manufacturing and processing applications."
      },
      {
        "num": 4,
        "title": "HVAC Systems",
        "description": "Regulates air in heating, ventilation, and air conditioning systems, optimizing performance and preventing air locks or pressure imbalances that can affect system efficiency."
      }
    ],
    "sections": [
      {
        "title": "Types of Air Valves",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Kinetic Air Valve",
            "image": "/uploads/2025/04/DuPlate-1.jpg",
            "description": "Features high velocity air release and intake without premature closure, using buoyancy-operated floats to maintain pipeline hydraulic integrity."
          },
          {
            "title": "Tamper Proof Air Valve",
            "image": "/uploads/2025/04/tamper-proof-air-valve-900.jpg",
            "description": "Equipped with protective outer cowls to prevent vandalism, unauthorized water tapping, or interference in public grids."
          },
          {
            "title": "Double Orifice Air Valve",
            "image": "/uploads/2025/04/icon1.png",
            "description": "Combines a large orifice for bulk air handling during filling/draining and a small orifice for pressurized air release during operation."
          }
        ]
      }
    ]
  },
  "sluice-gate": {
    "introduction": "Our gate/sluice, or scour valves offer exceptional performance for various applications. Constructed from Cast Iron, S.G. Iron, Cast Steel, or Mild Steel fabricated, they feature an outside screw and yoke type with or without rising stem for reliable operation.",
    "applications": [
      {
        "num": 1,
        "title": "Water Distribution System",
        "description": "Ideal for on/off control and isolation in municipal water supply networks, allowing pipeline segments to be isolated for repairs."
      },
      {
        "num": 2,
        "title": "Sewage and Silt Evacuation",
        "description": "Used as channel gates and scour discharge valves in wastewater treatment systems and open channels to clean accumulated sediment."
      },
      {
        "num": 3,
        "title": "Dams and Power Stations",
        "description": "Provides reliable isolation and scour clearance in high head conditions, protecting turbines and main pipelines."
      }
    ],
    "sections": [
      {
        "title": "Types of Sluice Valves based on Operation",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Manual Handwheel",
            "image": "/uploads/2025/04/valve-1.jpg",
            "description": "Equipped with traditional handwheels or cap tops for simple manual operation in standard pipeline networks."
          },
          {
            "title": "Gearbox Operated",
            "image": "/uploads/2025/04/valve@2x.jpg",
            "description": "Equipped with bevel or spur gearboxes to reduce operating torque in high-pressure or large diameter pipelines."
          },
          {
            "title": "Electric Actuated",
            "image": "/uploads/2025/04/Capture.JPG1_.jpg",
            "description": "Equipped with electric actuators for automated, remote control in industrial grids and purification processes."
          }
        ]
      },
      {
        "title": "Valve Types Based on Function",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Gate Valve",
            "description": "Ideal for on/off control and isolation in main distribution lines with minimum pressure drop.",
            "image": "/uploads/2025/04/MANUAL.jpg"
          },
          {
            "title": "Sluice Gate",
            "description": "Slide-type gates used for flow control and sediment removal in open channels, channels, or wastewater stages.",
            "image": "/uploads/2025/04/sluice-gate-avip-1.jpg"
          },
          {
            "title": "Scour Valve",
            "description": "Designed for pipeline maintenance and cleaning, allowing evacuation of silt and debris from low points.",
            "image": "/uploads/2025/04/valve-1.jpg"
          }
        ]
      }
    ]
  },
  "dual-check": {
    "introduction": "Non-return valves, also known as check valves, are crucial for preventing backflow and ensuring smooth operation in piping systems. They allow fluid to flow in one direction while closing to prevent reverse flow, protecting equipment and maintaining system efficiency.",
    "applications": [
      {
        "num": 1,
        "title": "Water Systems",
        "description": "Prevents backflow in municipal and industrial water pipelines, protecting pumping equipment and filtration beds."
      },
      {
        "num": 2,
        "title": "Sewage Systems",
        "description": "Ensures protection against backflow in sewage treatment stages and wastewater lines to prevent contamination."
      },
      {
        "num": 3,
        "title": "Oil and Gas",
        "description": "Safeguards compressors and pumps from reverse flow in oil and gas transmission pipelines."
      },
      {
        "num": 4,
        "title": "Chemical Processes",
        "description": "Protects process loops from cross-contamination, ensuring unidirectional chemical feed streams."
      }
    ],
    "sections": [
      {
        "title": "Types of Check Valves",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Dual Plate Check Valve",
            "image": "/uploads/2025/04/cast-iron-wafer-type-dual-plate-check-valve-500x500-1.png",
            "description": "Two spring-loaded plates for efficient flow control, durability, and reliable, with bi-directional operation. Opens for forward flow and closes when reversed. It's compact, efficient design reduces pressure loss."
          },
          {
            "title": "Double Plate Flanged Type",
            "image": "/uploads/2025/04/DuPlate.jpg",
            "description": "Features flanged connections on both sides, providing high mechanical integrity and easy pipeline integration in high-pressure grids."
          },
          {
            "title": "Wafer Type Double Plate",
            "image": "/uploads/2025/04/DuPlate-1.jpg",
            "description": "Clamps tightly between pipeline flanges, offering an extremely compact and light-weight backflow prevention solution."
          }
        ]
      }
    ]
  },
  "non-return": {
    "introduction": "GM Dalui non-return valves, also known as check valves, are designed to allow fluid flow in one direction and prevent backflow, safeguarding pumps, pipelines, and equipment. They automatically close when flow reverses, protecting the system from damage due to backflow or water hammer.",
    "applications": [
      {
        "num": 1,
        "title": "Water Supply Grids",
        "description": "Automatically prevents reverse water flow in distribution networks and high rise pumping loops."
      },
      {
        "num": 2,
        "title": "Wastewater Treatment",
        "description": "Prevents sewage reverse flow and contamination inside water purification facilities."
      },
      {
        "num": 3,
        "title": "Power Generation Plants",
        "description": "Protects feed pumps and cooling lines from thermal or pressure shocks due to backflow."
      }
    ],
    "sections": [
      {
        "title": "Types Of Non-Return Valves",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Dual Plate Non-Return",
            "image": "/uploads/2025/04/cast-iron-wafer-type-dual-plate-check-valve-500x500-1.png",
            "description": "Two spring-loaded plates for efficient flow control, durability, and reliable, with bi-directional operation. Its compact design reduces pressure loss."
          },
          {
            "title": "Swing Check Valve",
            "image": "/uploads/2025/05/swing-check-valve.jpg",
            "description": "Hinged disc for reliable flow control they ensure efficient, one-way flow. Commonly used in water and wastewater systems, and pump discharge lines."
          },
          {
            "title": "Hydraulic Actuated Non-Return",
            "image": "/uploads/2025/04/LFC_3B-Water-Hydraulic-Actuated-Isolation-Valve-1200x900-1.jpg",
            "description": "Expertly manages fluid flow within pipelines, providing controlled slow-closing options to mitigate hydraulic shock and water hammer."
          }
        ]
      }
    ]
  },
  "globe-valve": {
    "introduction": "GM Dalui globe valves are designed to start, stop, or regulate fluid flow in high-precision pipeline operations. Offering reliable operation with simple construction, they are highly suitable for throttling purposes.",
    "applications": [
      {
        "num": 1,
        "title": "High-Pressure Steam Systems",
        "description": "Ideal for boilers, steam distribution, and heat exchangers where precise throttling and leak-proof shut-off are required."
      },
      {
        "num": 2,
        "title": "Chemical Processing Units",
        "description": "Ensures high-precision flow adjustment for chemical feedstocks and process piping."
      },
      {
        "num": 3,
        "title": "Cooling Loops",
        "description": "Allows fine calibration of water flow to control process temperatures in industrial cooling grids."
      }
    ],
    "sections": [
      {
        "title": "Types of Globe and Regulating Valves",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Pneumatic Globe Control Valve",
            "image": "/uploads/2025/05/glob-regulating-valve.jpg",
            "description": "Utilizes compressed air for operation, offering fast response, robust construction, and high-speed cycle throttling in chemical processes."
          },
          {
            "title": "Manual Globe Valve",
            "image": "/uploads/2025/05/globocontrol-1.jpg",
            "description": "Features a spherical body and precise linear handwheel motion for fine throttling and secure shut-off in steam and power loops."
          },
          {
            "title": "Needle Valve",
            "image": "/uploads/2025/05/motorized-valve-supplier-in-fatehgarh-sahib-250x250-1.webp",
            "description": "It features a fine-threaded, tapered needle for micro-precise flow control and metering in chemistry and instrumentation systems."
          }
        ]
      }
    ]
  },
  "ball-valve": {
    "introduction": "GM Dalui Ball Valves feature a precision-machined spherical ball that rotates 90 degrees inside the valve body to provide full-bore flow or positive shut-off. Perfect for quick and frequent quarter-turn operations.",
    "applications": [
      {
        "num": 1,
        "title": "Oil & Gas Transmission",
        "description": "Provides bubble-tight shut-off for petroleum grids, gas lines, and refineries, meeting strict firesafe standards."
      },
      {
        "num": 2,
        "title": "Compressed Gas Distribution",
        "description": "Ensures leak-proof containment for pneumatic systems and high-pressure industrial gas loops."
      },
      {
        "num": 3,
        "title": "Water Treatment Intake",
        "description": "Permits full-bore flow with minimum turbulence and pressure loss, reducing pumping overhead."
      }
    ],
    "sections": [
      {
        "title": "Types of Ball Valves",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Manual Lever Ball Valve",
            "image": "/uploads/2025/04/PLU.BAL_.64100812_1707203409634.png",
            "description": "Designed with a hollow, perforated ball and a long lever for quick, quarter-turn manual operation in water and gas lines."
          },
          {
            "title": "Pneumatic / Electric Actuated Ball Valve",
            "image": "/uploads/2025/05/Electric-Ball-Valves-4.jpg",
            "description": "Features automatic actuation for automated pipelines requiring swift, remote shut-off control and high reliability."
          },
          {
            "title": "Three-Way Ball Valve",
            "image": "/uploads/2025/05/three-way-ball-valves.jpg",
            "description": "Allows for switching between different flow paths or combining multiple streams in petrochemical and process grids."
          }
        ]
      }
    ]
  },
  "prv": {
    "introduction": "GM Dalui control valves are precision valves designed to regulate fluid flow, pressure, or temperature automatically based on signals from a controller. They play a crucial role in process industries such as power generation, chemical processing, water treatment, and HVAC systems.",
    "applications": [
      {
        "num": 1,
        "title": "Municipal Water Distribution",
        "description": "Controls pressure zones across water grids to prevent pipe bursts, leaks, and energy losses."
      },
      {
        "num": 2,
        "title": "HVAC System Circuits",
        "description": "Balances pressure in chilled water or heating loops across commercial and industrial high-rises."
      },
      {
        "num": 3,
        "title": "Industrial Processing Plants",
        "description": "Ensures critical processing loops receive fluids at steady, safe operating pressures regardless of inlet fluctuations."
      }
    ],
    "sections": [
      {
        "title": "Types of Pressure Control Valves",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Globe Control Valve",
            "image": "/uploads/2025/05/globocontrol-1.jpg",
            "description": "Uses linear plug motion and automated controllers for precise pressure throttling in power and process plants."
          },
          {
            "title": "Pilot-Operated Diaphragm PRV",
            "image": "/uploads/2025/05/Electric-Ball-Valves-4.jpg",
            "description": "Utilizes fluid energy and a sensitive pilot control system to modulate flow, maintaining constant downstream pressure."
          },
          {
            "title": "Self-Acting Pressure Regulator",
            "image": "/uploads/2025/05/glob-regulating-valve.jpg",
            "description": "Directly controls system pressure via integrated diaphragm/spring mechanisms without external power grids."
          }
        ]
      }
    ]
  },
  "foot-valve": {
    "introduction": "GM Dalui Foot Valves are installed at the bottom of pump suction lines to prevent backflow and maintain pump priming when shutdown. They feature an integrated screen filter to protect downstream pumps.",
    "applications": [
      {
        "num": 1,
        "title": "Agricultural Lift Irrigation",
        "description": "Keeps suction lines filled in well systems and open pond pumps to allow instant priming during starts."
      },
      {
        "num": 2,
        "title": "Municipal Sump Wells",
        "description": "Maintains raw water pumping prime in water treatment intake wells."
      },
      {
        "num": 3,
        "title": "Mining and Silt Pumping",
        "description": "Filters large debris and gravel from entering suction pipes, protecting costly pump impellers."
      }
    ],
    "sections": [
      {
        "title": "Types of Suction Foot Valves",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Standard Foot Valve",
            "image": "/uploads/2025/05/others-valve.jpg",
            "description": "Features a mesh strainer and spring-loaded lift disc mechanism, used at the inlet of a pump to maintain prime. Size Range: 26-600 mm."
          },
          {
            "title": "Lift Check Foot Valve",
            "image": "/uploads/2025/05/pn16-lift-check-valve20446160388.webp",
            "description": "Features a heavy-duty sliding check disc that operates automatically, preventing suction loss in municipal pump wells."
          },
          {
            "title": "Ball Check Foot Valve",
            "image": "/uploads/2025/05/threaded-ball-check-valve-500x500-1.webp",
            "description": "Utilizes a rubber-coated ball that lifts and reseals automatically, perfect for sewage or slurry suction loops."
          }
        ]
      }
    ]
  },
  "safety-relief": {
    "introduction": "GM Dalui specialty valves are designed for unique and demanding applications requiring customized solutions beyond standard valve types. They provide tailored safety functionality like high overpressure relief.",
    "applications": [
      {
        "num": 1,
        "title": "Industrial Boiler Plants",
        "description": "Acts as the ultimate safety pressure release valve to vent excess steam and prevent catastrophic failure."
      },
      {
        "num": 2,
        "title": "LPG/LNG Gas Terminals",
        "description": "Protects storage tanks and vaporizers from thermal expansion and overpressure conditions."
      },
      {
        "num": 3,
        "title": "Main Pipeline Buffers",
        "description": "Absorbs water hammer surges by quickly venting excess pipeline pressure during pump trips."
      }
    ],
    "sections": [
      {
        "title": "Types of Safety Relief Valves",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Spring Loaded Safety Valve",
            "image": "/uploads/2025/05/cryogenic-valve-testing-services-500x500-1.webp",
            "description": "Features calibrated safety spring mechanisms that open automatically at set pressures to discharge excess volume. Size: 50-600 mm."
          },
          {
            "title": "Three-Way Safety Valve",
            "image": "/uploads/2025/05/three-way-ball-valves.jpg",
            "description": "Enables switching between safety relief loops for uninterrupted system protection during maintenance."
          },
          {
            "title": "Four-Way Diverting Valve",
            "image": "/uploads/2025/05/stainless-steel-4-way-ball-valve-500x500-1.webp",
            "description": "Made from durable materials like stainless steel and brass, allowing for complex flow path redirection."
          }
        ]
      }
    ]
  },
  "tamper-proof": {
    "introduction": "GM Dalui tamper-proof valves are specially designed valves that prevent unauthorized operation or manipulation. These valves are equipped with secure locking mechanisms and tamper-resistant features, making them ideal for applications in public utilities, industrial plants, and safety-critical systems where controlled access is essential.",
    "applications": [
      {
        "num": 1,
        "title": "Public Water Networks",
        "description": "Vandal-resistant locks prevent unauthorized water theft, tampering, or manipulation in municipal distribution posts."
      },
      {
        "num": 2,
        "title": "Fire Hydrant Mains",
        "description": "Secures fire protection standpipes and control valves from accidental or unauthorized shut-off."
      },
      {
        "num": 3,
        "title": "Secure Industrial Pipelines",
        "description": "Restricts flow control access to designated technicians using specialized key lockouts."
      }
    ],
    "sections": [
      {
        "title": "Types of Tamper Proof Valves",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Tamper Proof Security Valve",
            "image": "/uploads/2025/04/tamper-proof-air-valve-900.jpg",
            "description": "Prevents unauthorized access with unique keycaps or locks, ensuring system integrity and safety. Size: 50-600 mm."
          },
          {
            "title": "Lockable Sluice Valve",
            "image": "/uploads/2025/04/sluice-gate-avip-1.jpg",
            "description": "Includes a lockable handwheel or gearbox padlocking shroud to restrict control in municipal water grid junctions."
          },
          {
            "title": "Tamper Proof Kinetic Air Valve",
            "image": "/uploads/2025/04/DuPlate-1.jpg",
            "description": "Provides high-speed air release and vacuum protection under a heavy security cowl that resists vandalism."
          }
        ]
      }
    ]
  },
  "y-strainer": {
    "introduction": "GM Dalui Y Strainers mechanically remove rust, scale, and foreign matter from flowing fluids, safeguarding control valves, flow meters, and pump impellers.",
    "applications": [
      {
        "num": 1,
        "title": "Control Valve Protection",
        "description": "Placed immediately upstream of automated valves to trap weld slag, saving soft seals and diaphragms."
      },
      {
        "num": 2,
        "title": "Water Meter Headers",
        "description": "Prevents grit and pipeline debris from clogging delicate turbine meters and sensors."
      },
      {
        "num": 3,
        "title": "Thermal Boiler Systems",
        "description": "Traps piping scale and corrosion flakes inside high-temperature condensate return lines."
      }
    ],
    "sections": [
      {
        "title": "Types of Industrial Strainers",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Standard Y-Strainer",
            "image": "/uploads/2025/05/150mm-wcb-y-type-strainer-500x500-1.webp",
            "description": "Durable WCB/Cast Iron construction, fine mesh filtration, and easy maintenance. Cap includes blow-off ports for debris cleaning."
          },
          {
            "title": "Fabricated Basket Strainer",
            "image": "/uploads/2025/05/others-valve.jpg",
            "description": "Designed with reinforced structural cages for high flow rates and low pressure drop in municipal intake headers."
          },
          {
            "title": "Duplex Filter System",
            "image": "/uploads/2025/05/pn16-lift-check-valve20446160388.webp",
            "description": "Enables continuous filtering operations by shifting flow paths while one screen is being cleaned."
          }
        ]
      }
    ]
  },
  "control-valve": {
    "introduction": "A control valve is a power-operated device that automatically regulates fluid flow, pressure, temperature, or level by modulating the flow area based on a control signal. It forms the final control element of a process control loop, ensuring process stability and product quality across industrial plants.",
    "applications": [
      {
        "num": 1,
        "title": "Flow Control",
        "description": "Regulates process flow rates in oil & gas, chemical, petrochemical, and power generation plants, maintaining setpoint flow despite changing upstream conditions."
      },
      {
        "num": 2,
        "title": "Pressure Control",
        "description": "Maintains constant downstream pressure in steam, gas, and liquid systems by throttling the flow, protecting equipment from overpressure and pressure excursions."
      },
      {
        "num": 3,
        "title": "Temperature Control",
        "description": "Modulates the flow of heating or cooling media through heat exchangers, condensers, and HVAC circuits to hold process temperatures within tight limits."
      },
      {
        "num": 4,
        "title": "Level Control",
        "description": "Controls liquid level in tanks, drums, separators, and boiler feedwater systems by adjusting inlet or outlet flow proportionally to level deviations."
      },
      {
        "num": 5,
        "title": "Blending / Proportioning",
        "description": "Mixes two or more process streams in exact ratios for dosing, blending, and ratio control applications in continuous processes."
      }
    ],
    "sections": [
      {
        "title": "Types of Control Valves",
        "gridClass": "col-4",
        "cards": [
          {
            "title": "Globe Control Valve",
            "description": "Linear-motion valve with a plug and seat arrangement, providing precise throttling and tight shut-off. The most widely used body style for modulating control."
          },
          {
            "title": "Angle Control Valve",
            "description": "A globe-type body with inlet and outlet at right angles, suited for high-pressure drops, erosive fluids, and compact installations."
          },
          {
            "title": "Rotary Control Valve",
            "description": "Quarter-turn ball or butterfly based designs offering high capacity, low leakage, and cost-effective control for large diameter services."
          },
          {
            "title": "Cage-Guided Control Valve",
            "description": "Uses a guiding cage around the plug to stabilize trim, reduce vibration and noise, and lower cavitation risk in severe service."
          }
        ]
      }
    ]
  },
  "flow-control-plunger": {
    "introduction": "The plunger type flow control valve is a large-diameter throttling valve that uses a plunger or axial-flow element to regulate flow smoothly. It is engineered for water systems where controlled discharge and reduced turbulence are required, particularly in large-diameter pipelines.",
    "applications": [
      {
        "num": 1,
        "title": "Water Supply & Distribution",
        "description": "Regulates flow in large-diameter transmission and distribution mains, allowing operators to balance supply zones and control discharge."
      },
      {
        "num": 2,
        "title": "Pumping Station Discharge Control",
        "description": "Controls pump discharge flow during start-up, shutdown, and normal operation, smoothing the flow and reducing pressure surges."
      },
      {
        "num": 3,
        "title": "Hydroelectric Projects",
        "description": "Provides precise flow regulation to turbines and bypass lines, helping to manage head, flow, and plant output."
      },
      {
        "num": 4,
        "title": "Irrigation Networks",
        "description": "Regulates canal and pipeline flows to deliver the required quantity of water to command areas while preventing surges."
      },
      {
        "num": 5,
        "title": "Pressure Reduction",
        "description": "Serves as a pressure-regulating element in transmission lines, reducing high inlet pressure to a controlled downstream level."
      }
    ],
    "sections": [
      {
        "title": "Types of Flow Control Valves",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Plunger Type",
            "description": "Features a machined plunger that moves in and out of a seat to modulate flow with a linear characteristic and controlled discharge."
          },
          {
            "title": "Axial Flow Type",
            "description": "Uses an axial-flow trim to guide the fluid along the axis, minimizing turbulence, noise, and pressure loss at large openings."
          },
          {
            "title": "Cast / Fabricated Body",
            "description": "Available in cast or fabricated construction to suit large diameters and high-pressure applications with long service life."
          }
        ]
      }
    ]
  },
  "wide-type-strainer": {
    "introduction": "A wide type strainer is a basket-style filtration device installed in pipelines to remove solid particles and debris from the fluid stream. Its wide body and large screen area provide low pressure drop and high debris holding capacity.",
    "applications": [
      {
        "num": 1,
        "title": "Pump Protection",
        "description": "Installed on pump suction lines to remove sand, scale, and debris that would damage impellers and seals."
      },
      {
        "num": 2,
        "title": "Water & Cooling Water Systems",
        "description": "Filters raw and clarified water in intake and cooling circuits, protecting heat exchangers and nozzles."
      },
      {
        "num": 3,
        "title": "HVAC Systems",
        "description": "Protects chilled-water and condenser loops from particulate contamination, maintaining coil and valve performance."
      },
      {
        "num": 4,
        "title": "Process Lines",
        "description": "Placed upstream of control valves, flow meters, and instruments to prevent clogging and premature wear."
      },
      {
        "num": 5,
        "title": "Irrigation Networks",
        "description": "Removes silt, sand, and organic debris from canal and pipeline water to safeguard downstream equipment."
      }
    ],
    "sections": [
      {
        "title": "Types of Strainers",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Basket Strainer",
            "description": "Wide-body strainer with a large cylindrical basket screen, offering high debris capacity and easy removal for cleaning."
          },
          {
            "title": "Y-Type Strainer",
            "description": "Compact strainer with a Y-shaped body and inclined screen, ideal for limited-space installations and fine filtration."
          },
          {
            "title": "Wide-Bodied Strainer",
            "description": "Extra-large screen area design that minimizes pressure drop and maximizes holding capacity for high-flow services."
          }
        ]
      }
    ]
  },
  "plug-valve": {
    "introduction": "A plug valve is a quarter-turn isolation valve that uses a cylindrical or tapered plug with a passage to start, stop, or regulate flow. It offers tight shut-off, low pressure drop, and simple operation across a wide range of services.",
    "applications": [
      {
        "num": 1,
        "title": "Water & Wastewater",
        "description": "Provides reliable isolation and flow control in potable water, sewage, and treatment plant piping."
      },
      {
        "num": 2,
        "title": "Oil & Gas",
        "description": "Used for block-and-bleed and isolation duties in pipelines, manifolds, and wellhead services where tight shut-off is required."
      },
      {
        "num": 3,
        "title": "Chemical Process",
        "description": "Handles corrosive and aggressive media with suitable body, plug, and seat materials, ensuring safe isolation."
      },
      {
        "num": 4,
        "title": "Slurry Service",
        "description": "Full-port designs handle abrasive slurries with minimal clogging and erosion in mining and process plants."
      },
      {
        "num": 5,
        "title": "Industrial Gases",
        "description": "Provides dependable quarter-turn isolation for air, inert gas, and fuel gas distribution systems."
      }
    ],
    "sections": [
      {
        "title": "Types of Plug Valves",
        "gridClass": "col-4",
        "cards": [
          {
            "title": "Lubricated Plug Valve",
            "description": "Injects a sealant between plug and body to reduce friction and improve sealing, suited to high-pressure services."
          },
          {
            "title": "Non-Lubricated Plug Valve",
            "description": "Uses a tapered plug, sleeve, or metal-to-metal seating without sealant, reducing maintenance and fugitive emissions."
          },
          {
            "title": "Sleeved Plug Valve",
            "description": "A PTFE or elastomer sleeve covers the plug to provide bubble-tight shut-off and corrosion resistance."
          },
          {
            "title": "Eccentric Plug Valve",
            "description": "Offset plug and shaft design minimizes seat wear and operating torque, ideal for throttling and abrasive media."
          }
        ]
      }
    ]
  },
  "needle-valve": {
    "introduction": "A needle valve is a precision throttling valve that uses a slender, tapered needle to regulate flow with extremely fine control. It is ideal for instrumentation, sampling, and high-pressure services requiring accurate flow and pressure regulation.",
    "applications": [
      {
        "num": 1,
        "title": "Instrumentation & Gauge Lines",
        "description": "Provides fine flow control and isolation in pressure gauge, transmitter, and analyzer lines."
      },
      {
        "num": 2,
        "title": "Hydro Power & Bypass Lines",
        "description": "Regulates turbine bypass and start-up flows to balance pressure and protect equipment."
      },
      {
        "num": 3,
        "title": "High-Pressure Letdown",
        "description": "Steps down high process pressures gradually, providing controlled pressure reduction without abrupt surges."
      },
      {
        "num": 4,
        "title": "Sampling Systems",
        "description": "Controls sample flow to analyzers and lab points with precise, repeatable throttling."
      },
      {
        "num": 5,
        "title": "Pump & Process Regulation",
        "description": "Adjusts purge, bleed, and small line flows in pump and process systems with fine accuracy."
      }
    ],
    "sections": [
      {
        "title": "Types of Needle Valves",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Needle Valve",
            "description": "Fine-threaded tapered stem provides micro-precise flow regulation for metering and throttling duties."
          },
          {
            "title": "Plunger Valve",
            "description": "A plunger-type trim offers robust throttling with higher capacity while retaining fine control."
          },
          {
            "title": "Regulating Needle Valve",
            "description": "Combines a tapered needle with a regulating seat profile for stable, repeatable flow characteristic."
          }
        ]
      }
    ]
  },
  "zero-velocity-valve": {
    "introduction": "The zero velocity (non-slam) check valve is an automatic check valve that closes as forward flow approaches zero velocity. Its non-slam action prevents reverse flow and reduces water hammer and pressure surges, protecting pumps, pipelines, and associated equipment.",
    "applications": [
      {
        "num": 1,
        "title": "Pumping Stations",
        "description": "Installed on pump discharge to prevent reverse flow and water hammer when pumps trip or stop."
      },
      {
        "num": 2,
        "title": "Water Treatment Plants",
        "description": "Protects treatment plant piping and equipment from backflow and surge conditions."
      },
      {
        "num": 3,
        "title": "Rising Mains",
        "description": "Prevents column separation and surge pressure in long rising mains, safeguarding the pipeline."
      },
      {
        "num": 4,
        "title": "HVAC Systems",
        "description": "Prevents reverse circulation in chilled and hot water loops, maintaining system balance."
      },
      {
        "num": 5,
        "title": "Industrial Pipelines",
        "description": "Provides surge suppression and backflow protection in general industrial piping networks."
      }
    ],
    "sections": [
      {
        "title": "Types of Non-Slam Check Valves",
        "gridClass": "col-3",
        "cards": [
          {
            "title": "Zero Velocity Valve",
            "description": "Closes automatically as forward flow approaches zero, minimizing reverse flow and surge."
          },
          {
            "title": "Dual Plate Check Valve",
            "description": "Spring-loaded twin plates provide fast closing action and compact installation between flanges."
          },
          {
            "title": "Axial Nozzle Check Valve",
            "description": "Axial-flow design with a spring-centered disc gives quick, silent closure and low pressure drop."
          }
        ]
      }
    ]
  }
};
