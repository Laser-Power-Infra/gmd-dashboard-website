export const warrantyData = [
  {
    id: 'butterfly-valve',
    name: 'Butterfly Valve',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_27_24 PM.png',
    sections: [
      {
        subTitle: 'Standard Butterfly Valve',
        inclusions: [
          'Body and disc casting/forging defects.',
          'Leakage past seats within specified leakage class.',
          'Shaft and bushing integrity under normal use.',
          'Coating/lining defects.'
        ],
        exclusions: [
          'Seat wear from throttling abrasive/slurry fluids.',
          'Damage due to excessive torque or improper actuator installation.',
          'Cavitation/erosion damage outside design limits.',
          'Failure due to reverse pressure or vacuum if not designed for such service.'
        ]
      },
      {
        subTitle: 'Wafer Type Valve',
        inclusions: [
          'Free from defects in material and workmanship.',
          'Leakage-free operation within rated pressure and temperature limits.',
          'Compliance with applicable manufacturing standards (API, ISO, or equivalent).'
        ],
        exclusions: [
          'Damage due to misalignment during installation between flanges.',
          'Corrosion/erosion due to aggressive media not specified in material compatibility.',
          'Excessive torque applied during operation.'
        ]
      },
      {
        subTitle: 'Lug Type Valve',
        inclusions: [
          'Safe for dead-end service within rated pressure.',
          'Warranty against structural defects in the lug body and disc.',
          'Coating/lining guaranteed against peeling under standard service conditions.'
        ],
        exclusions: [
          'Use in high-vibration service without dampeners.',
          'Thread damage from over-tightening bolts.',
          'Warranty void if used for bi-directional dead-end service beyond rating.'
        ]
      },
      {
        subTitle: 'Double Flanged Type Valve',
        inclusions: [
          'Coverage for body integrity and sealing performance.',
          'Suitable for heavy-duty service as per manufacturer\'s pressure-temperature rating.',
          'Protection against flange leakage if installed with correct gaskets.'
        ],
        exclusions: [
          'Failures due to over-tightening flange bolts.',
          'Damage from pipeline stresses (misalignment or unsupported loads).',
          'Warranty void if subjected to abrasive slurry not designed for.'
        ]
      },
      {
        subTitle: 'Triple Offset Butterfly Valve',
        inclusions: [
          'Coverage for zero-leakage metal-to-metal sealing under rated service.',
          'Warranty on stem, bearings, and sealing surfaces against manufacturing defects.',
          'Compliance with API 609 / ISO 10497 standards.'
        ],
        exclusions: [
          'Seat wear from unfiltered abrasive media.',
          'Use in services beyond specified temperature/pressure class.',
          'Damage due to unauthorized modifications or welding on valve body.'
        ]
      },
      {
        subTitle: 'High-Performance (Double Offset) Butterfly Valve',
        inclusions: [
          'Coverage for bidirectional sealing performance within rated conditions.',
          'Fire-safe design warranty (if certified).',
          'Protection against disc/stem blowout under normal operation.'
        ],
        exclusions: [
          'Failures due to cavitation or flashing not accounted for in design.',
          'Use in cryogenic service unless specified.',
          'Incorrect actuator sizing leading to stem/seat damage.'
        ]
      }
    ]
  },
  {
    id: 'sluice-valve',
    name: 'Sluice Valve',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_27_36 PM.png',
    sections: [
      {
        subTitle: 'Manual Sluice Valve',
        inclusions: [
          'Manufacturing defects in body, bonnet, wedge, stem, and seating rings.',
          'Leakage through body/bonnet joints due to faulty casting or assembly.',
          'Defective machining leading to improper sealing.',
          'Material defects under normal operating pressure and temperature.'
        ],
        exclusions: [
          'Damage due to mishandling, over-tightening, or improper manual operation.',
          'Wear and tear of gland packing, seals, gaskets, and fasteners (considered consumables).',
          'Corrosion or scaling caused by aggressive or incompatible fluids.',
          'Failure due to installation outside recommended pressure/temperature ratings.'
        ]
      },
      {
        subTitle: 'Pneumatic Sluice Valve',
        inclusions: [
          'Manufacturing defects in valve body, seat, disc, and stem.',
          'Defects in pneumatic actuator cylinder and piston under normal service.',
          'Faulty assembly leading to air leakage within actuator housing.',
          'Failure of factory-installed limit stops or guiding mechanism.'
        ],
        exclusions: [
          'Damage from contaminated or moist compressed air supply.',
          'Seals, diaphragms, O-rings, and packing considered consumables.',
          'Failure due to wrong alignment of actuator with valve.',
          'External control accessories (solenoid valves, FRL units, tubing) unless specifically supplied under contract.'
        ]
      },
      {
        subTitle: 'Hydraulic Sluice Valve',
        inclusions: [
          'Casting or forging defects in valve body, bonnet, or actuator housing.',
          'Leakage from hydraulic actuator cylinder due to faulty manufacturing.',
          'Malfunctioning due to improper machining of guiding or seating surfaces.',
          'Failure of manufacturer-installed hydraulic seals under normal fluid conditions.'
        ],
        exclusions: [
          'Damage caused by contaminated hydraulic fluid or improper fluid grade.',
          'Wear of seals, packing, O-rings due to normal service life.',
          'Failure due to over-pressure surges beyond rated design.',
          'External hydraulic power packs, hoses, and fittings unless supplied as part of the valve package.'
        ]
      },
      {
        subTitle: 'Motorized Sluice Valve',
        inclusions: [
          'Manufacturing defects in valve body, wedge, stem, and seating rings.',
          'Defects in actuator gearbox or electric motor supplied by manufacturer.',
          'Faulty wiring or factory-installed limit switches.',
          'Actuator-to-valve coupling defects due to improper machining.'
        ],
        exclusions: [
          'Electrical damage caused by voltage fluctuations, short circuits, or improper earthing.',
          'Wear of electrical contacts, fuses, and consumables.',
          'Damage due to water ingress from improper cable sealing or IP protection breach.',
          'Third-party control panels, PLCs, or accessories not supplied by the manufacturer.'
        ]
      }
    ]
  },
  {
    id: 'check-valve',
    name: 'Check Valve',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_27_42 PM.png',
    sections: [
      {
        subTitle: 'Pneumatic Valves',
        inclusions: [
          'Manufacturing defects in valve body, seat, disc, and stem.',
          'Defects in pneumatic actuator cylinder and piston under normal service.',
          'Faulty assembly leading to air leakage within actuator housing.',
          'Failure of factory-installed limit stops or guiding mechanism.'
        ],
        exclusions: [
          'Damage from contaminated or moist compressed air supply.',
          'Seals, diaphragms, O-rings, and packing considered consumables.',
          'Failure due to wrong alignment of actuator with valve.',
          'External control accessories (solenoid valves, FRL units, tubing) unless specifically supplied.'
        ]
      },
      {
        subTitle: 'Hydraulic Valves',
        inclusions: [
          'Casting or forging defects in valve body, bonnet, or actuator housing.',
          'Leakage from hydraulic actuator cylinder due to faulty manufacturing.',
          'Malfunctioning due to improper machining of guiding or seating surfaces.',
          'Failure of manufacturer-installed hydraulic seals under normal fluid conditions.'
        ],
        exclusions: [
          'Damage caused by contaminated hydraulic fluid or improper fluid grade.',
          'Wear of seals, packing, O-rings due to normal service life.',
          'Failure due to over-pressure surges beyond rated design.',
          'External hydraulic power packs, hoses, and fittings unless supplied as part of the package.'
        ]
      },
      {
        subTitle: 'Knife Gate Valve',
        inclusions: [
          'Manufacturing defects in body, bonnet, or disc.',
          'Faults in welding, casting, or machining.',
          'Leakage through the body caused by defective materials.',
          'Failure of supplied seals/liners within the warranty period.',
          'Actuator defects (if supplied with valve) caused by design or workmanship.'
        ],
        exclusions: [
          'Wear and tear of seals, packing, or seats due to normal operation.',
          'Damage caused by abrasive, corrosive, or slurry media beyond design specification.',
          'Improper installation, alignment, or operation outside rated pressure/temperature.',
          'Damage due to lack of maintenance or use of non-genuine spare parts.',
          'Surface corrosion, erosion, or scaling caused by operating environment.',
          'Modification of valve without manufacturer’s approval.'
        ]
      },
      {
        subTitle: 'Sluice Gate Valve',
        inclusions: [
          'Defects in structural frame, gate leaf, or guides due to poor materials/workmanship.',
          'Improper sealing due to manufacturing defect in seating surfaces.',
          'Corrosion protection (coating/lining) failure due to defective application.',
          'Gearbox, spindle, or hoist mechanism defects if provided by manufacturer.'
        ],
        exclusions: [
          'Normal wear of seals, wedges, or seating surfaces.',
          'Damage due to silt, grit, or foreign objects obstructing gate movement.',
          'Improper installation, foundation settlement, or misalignment of guides.',
          'Operation under water head or flow conditions beyond design specification.',
          'Lack of lubrication/maintenance of hoist mechanism.',
          'Damage due to unauthorized modification, welding, or structural changes.'
        ]
      }
    ]
  },
  {
    id: 'air-valve',
    name: 'Air Valve',
    image: '/valve img/WhatsApp Image 2026-06-16 at 12.33.30 PM.jpeg',
    sections: [
      {
        subTitle: 'Single Tamperproof Air Valve',
        inclusions: [
          'Manufacturing defects in materials or workmanship.',
          'Leakage due to faulty sealing components under normal operating conditions.',
          'Failure of internal mechanism caused by defective parts.',
          'Corrosion or surface coating failure within the warranty period, provided valve was installed in suitable environment.',
          'Replacement or repair of defective unit, subject to inspection and approval.'
        ],
        exclusions: [
          'Damage caused by improper installation, misuse, or tampering.',
          'Normal wear and tear of consumables (e.g., gaskets, seals, O-rings).',
          'Damage due to exposure to chemicals, extreme temperatures, or pressures beyond design specifications.',
          'Failure caused by debris, scaling, or foreign particles in the pipeline.',
          'Unauthorized repairs, modifications, or use of non-genuine parts.',
          'Damage due to negligence, accidents, fire, flood, or natural calamities.'
        ]
      },
      {
        subTitle: 'Double Tamper Proof Air Valve',
        inclusions: [
          'Manufacturing defects in both inlet and outlet mechanisms.',
          'Leakage or malfunction under standard operating conditions due to defective components.',
          'Failure of the float system or pressure release system due to manufacturing fault.',
          'Anti-corrosion coating failure, provided valve was used within recommended environmental and operational limits.',
          'Full unit repair or replacement after technical evaluation, within warranty period.'
        ],
        exclusions: [
          'Installation errors, mishandling, or deliberate tampering with dual-chamber system.',
          'Normal deterioration of wear parts such as seals, washers, and rubber components.',
          'Malfunction due to pipeline contamination (sand, silt, welding slag, etc.).',
          'Operation outside specified pressure, temperature, or flow ranges.',
          'Use of valve in incompatible media (chemicals, aggressive fluids not specified).',
          'External damage due to impact, vibration, or environmental factors beyond control.',
          'Any third-party alterations, modifications, or non-standard spare part replacements.'
        ]
      }
    ]
  },
  {
    id: 'non-return',
    name: 'Non-Return Valve',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_27_49 PM.png',
    sections: [
      {
        subTitle: 'Dual Plate Valve',
        inclusions: [
          'Warranty applies to defects in materials and workmanship under normal operating conditions.',
          'Covers structural integrity of the valve body, plates, and hinge mechanism for the specified warranty period.',
          'Seal leakage that occurs due to faulty manufacturing is included.',
          'Repair or replacement of defective components found to be due to manufacturing faults.'
        ],
        exclusions: [
          'Damage caused by improper installation, misalignment, or incorrect orientation in the pipeline.',
          'Failures resulting from usage outside the specified pressure, temperature, or flow conditions.',
          'Wear and tear of soft parts such as gaskets, seals, or seats due to normal operation.',
          'Corrosion, scaling, or erosion caused by the process medium if not specified during ordering.',
          'Damage due to foreign particles, cavitation, or water hammer.',
          'Unauthorized repair, alteration, or use of non-genuine spare parts.'
        ]
      },
      {
        subTitle: 'Swing Valve',
        inclusions: [
          'Warranty covers material and manufacturing defects of the valve body, disc, and hinge pin.',
          'Leakage across the seat is covered if caused by manufacturing faults.',
          'Repair or replacement of defective components identified during the warranty period.'
        ],
        exclusions: [
          'Damage arising from improper installation or operation against the flow direction.',
          'Failures due to exceeding rated temperature, pressure, or flow conditions.',
          'Normal wear of sealing surfaces, seats, or gaskets.',
          'Corrosion or erosion resulting from unsuitable service medium not communicated at the time of purchase.',
          'Failures caused by debris, reverse flow shock, or water hammer in the system.',
          'Any modifications, welding, or repairs not authorized by the manufacturer.'
        ]
      }
    ]
  },
  {
    id: 'manual-valve',
    name: 'Glove Valve',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_28_01 PM.png',
    sections: [
      {
        subTitle: 'Gate/Scour/Sluice Valve',
        inclusions: [
          'Manufacturing defects in body, bonnet, stem, and wedge.',
          'Leakage through body or bonnet joints under normal operating pressure.',
          'Coating/lining defects (if factory-applied).',
          'Proper operation of handwheel/gear actuator under rated conditions.'
        ],
        exclusions: [
          'Wear and tear on sealing surfaces due to abrasive/slurry media.',
          'Damage from cavitation, water hammer, or operation outside design pressure/temperature.',
          'Corrosion/erosion due to aggressive chemicals not specified at ordering.',
          'Improper storage, installation misalignment, or lack of periodic maintenance.',
          'Use of non-OEM spare parts.'
        ]
      },
      {
        subTitle: 'Ball Valve',
        inclusions: [
          'Body casting/forging defects.',
          'Leakage through body joints or seat under rated service conditions.',
          'Handle/lever mechanism integrity under normal use.',
          'Surface coating defects.'
        ],
        exclusions: [
          'Seat wear from abrasive particles.',
          'Damage due to overtightening beyond torque limits.',
          'Failure caused by continuous throttling (ball valves are isolation valves).',
          'Chemical attack from unapproved media.',
          'Freezing damage due to retained liquid.'
        ]
      },
      {
        subTitle: 'Plug Valve',
        inclusions: [
          'Body, cover, and plug casting defects.',
          'Leakage past seats under rated operating conditions.',
          'Gland packing performance (if installed correctly).'
        ],
        exclusions: [
          'Wear from high-cycle or abrasive service.',
          'Damage from lack of lubrication (in lubricated plug valves).',
          'Misalignment from incorrect installation.',
          'Thermal shock from sudden temperature variations.'
        ]
      },
      {
        subTitle: 'Sluice Gate',
        inclusions: [
          'Fabrication and welding defects in gate frame and leaf.',
          'Leakage beyond permissible limits at closed position.',
          'Corrosion protection (galvanizing/epoxy) defects.',
          'Proper functioning of lifting mechanism (manual/gearbox).'
        ],
        exclusions: [
          'Damage from debris jamming in sealing surfaces.',
          'Distortion from uneven loading or improper anchoring.',
          'Damage from impact, flooding, or overtopping.',
          'Operating outside rated head pressure.'
        ]
      },
      {
        subTitle: 'Butterfly Valves',
        inclusions: [
          'Body and disc casting/forging defects.',
          'Leakage past seats within specified leakage class.',
          'Shaft and bushing integrity under normal use.',
          'Coating/lining defects.'
        ],
        exclusions: [
          'Seat wear from throttling abrasive/slurry fluids.',
          'Damage due to excessive torque or improper actuator installation.',
          'Cavitation/erosion damage outside design limits.',
          'Failure due to reverse pressure or vacuum if not designed for such service.'
        ]
      }
    ]
  },
  {
    id: 'tamper-proof',
    name: 'Tamper Proof Valve',
    image: '/valve img/ChatGPT Image Jun 9, 2026, 03_28_30 PM.png',
    sections: [
      {
        subTitle: 'Tamper Proof Valve',
        inclusions: [
          'Coverage against manufacturing defects in valve body, float, sealing components, and tamper-proof locking system.',
          'Protection against leakage or malfunction caused by material faults under normal operating pressure.',
          'Integrity of corrosion-resistant coatings (if factory-applied).',
          'Free repair or replacement of defective parts within warranty period.'
        ],
        exclusions: [
          'Damage due to improper installation or overtightening.',
          'Failure caused by overpressure, water hammer, or surge events.',
          'Normal wear and tear of seals, gaskets, and seats.',
          'Unauthorized modification, tampering, or dismantling of valve.',
          'Damage from debris, corrosive chemicals, or water quality outside design parameters.',
          'External coating damage due to mishandling or environmental exposure beyond specified limits.'
        ]
      }
    ]
  },
  {
    id: 'control-valve',
    name: 'Control Valve',
    image: '/uploads/2025/04/LFC_3B-Water-Hydraulic-Actuated-Isolation-Valve-1200x900-1-300x300.jpg',
    sections: [
      {
        subTitle: 'Globe Control Valve',
        inclusions: [
          'Manufacturing defects in the valve body, actuator, and internal components.',
          'Leakage through the seat (within allowable limits as per ANSI/FCI standards).',
          'Actuator malfunction due to material or workmanship defects.',
          'Control performance under specified operating conditions.'
        ],
        exclusions: [
          'Damage caused by improper installation, alignment, or over-tightening.',
          'Corrosion or erosion due to process media outside specified compatibility.',
          'Failure due to foreign material ingress (lack of filtration).',
          'Wear and tear on trim components due to cavitation or flashing not accounted for in design.'
        ]
      },
      {
        subTitle: 'Butterfly Control Valve',
        inclusions: [
          'Disc and seat performance under specified pressure drop and flow conditions.',
          'Actuator integrity (electrical, pneumatic, or hydraulic).',
          'Body leakage and shaft seal tightness under normal conditions.'
        ],
        exclusions: [
          'Premature wear of seat due to throttling near closed position (not designed for such operation).',
          'Damage from reverse flow or back pressure not considered in design.',
          'Valve deformation due to pipe stress or thermal expansion.'
        ]
      },
      {
        subTitle: 'Sluice/Gate Valve',
        inclusions: [
          'Coverage for body integrity and sealing performance.',
          'Suitable for heavy-duty service as per manufacturer’s pressure-temperature rating.',
          'Protection against flange leakage if installed with correct gaskets.'
        ],
        exclusions: [
          'Failures due to over-tightening flange bolts.',
          'Damage from pipeline stresses (misalignment or unsupported loads).',
          'Warranty void if subjected to abrasive slurry not designed for.'
        ]
      }
    ]
  },
  {
    id: 'regulating-valve',
    name: 'Regulating Valve',
    image: '/uploads/2025/04/butterfly-control.png',
    sections: [
      {
        subTitle: 'Globe Type Valve',
        inclusions: [
          'Defects in materials or workmanship in body, plug, seat, and stem.',
          'Leakage within ANSI/FCI Class standards (e.g., Class IV or V).',
          'Actuator function (manual or automatic) within rated service.',
          'Internal trim operation under specified pressure and temperature conditions.'
        ],
        exclusions: [
          'Trim wear due to cavitation or flashing beyond design conditions.',
          'Corrosion or erosion from process media outside material compatibility.',
          'Seat leakage due to dirt, debris, or lack of filtration.',
          'Damage from overtightening or incorrect actuator sizing or setup.'
        ]
      },
      {
        subTitle: 'Needle Type Valve',
        inclusions: [
          'Precision control performance under design conditions.',
          'Sealing and shut-off integrity at rated pressure.',
          'Structural integrity of needle, seat, and stem.'
        ],
        exclusions: [
          'Blockage due to particulate matter or poor system cleanliness.',
          'Damage caused by over-torquing or forcing the needle.',
          'Leakage due to wear from high-cycle or pulsating service not specified in design.'
        ]
      },
      {
        subTitle: 'Ball Type Valve',
        inclusions: [
          'Leakage protection due to faulty sealing material under normal operating conditions.',
          'Corrosion protection integrity (if coated by manufacturer).',
          'Repair/replacement of defective internal components during warranty period.'
        ],
        exclusions: [
          'Damage from improper installation, misalignment, or overtightening.',
          'Normal wear and tear of PTFE seats, seals, and packing.',
          'Failure due to operation outside design pressure/temperature.',
          'Damage from abrasive or corrosive media not specified for the valve.',
          'Tampering, unauthorized modifications, or non-OEM spare usage.',
          'External surface/cosmetic damage due to mishandling.'
        ]
      }
    ]
  },
  {
    id: 'automated-valve',
    name: 'Gate Valve',
    image: '/uploads/2025/04/automated-valves.png',
    sections: [
      {
        subTitle: 'Solenoid Type Valve',
        inclusions: [
          'Warranty covers manufacturing defects in coil, body, and sealing components.',
          'Covers electrical faults in solenoid coil (burnout due to normal usage).',
          'Replacement/repair of defective valve within warranty period under normal operating conditions.',
          'Assurance against leakage caused by faulty assembly or defective sealing.'
        ],
        exclusions: [
          'Damage due to improper wiring, incorrect voltage supply, or power surges.',
          'Failure caused by corrosive/abrasive media not specified in product datasheet.',
          'Wear and tear of seals and gaskets due to normal use.',
          'Damage due to improper installation, dry operation, or exposure to incompatible chemicals.'
        ]
      },
      {
        subTitle: 'Motorized Type Valve',
        inclusions: [
          'Coverage for defects in motor, actuator, and valve body.',
          'Warranty includes malfunction due to faulty motor windings, gear assembly, or actuator electronics.',
          'Assurance against leakage under specified pressure and temperature conditions.',
          'Repair or replacement of defective unit within warranty duration.'
        ],
        exclusions: [
          'Damage caused by overloading, incorrect torque settings, or exceeding duty cycles.',
          'Burnout due to unstable or incorrect power supply.',
          'Wear and tear of mechanical moving parts (e.g., gears, couplings) from normal operation.',
          'Corrosion or scaling caused by aggressive or incompatible media.'
        ]
      },
      {
        subTitle: 'Pneumatic Actuated Type Valve',
        inclusions: [
          'Warranty covers actuator cylinder, piston, and valve body defects.',
          'Coverage for faulty actuator seals and springs under normal use.',
          'Assurance against leakage due to defective diaphragm/sealing.',
          'Replacement/repair of valve if pneumatic actuation fails due to manufacturing defect.'
        ],
        exclusions: [
          'Failure caused by contaminated air supply (dust, moisture, oil).',
          'Damage due to exceeding rated pressure limits.',
          'Wear of seals and diaphragms from regular use.',
          'Incorrect installation (improper air line connection, inadequate lubrication).'
        ]
      },
      {
        subTitle: 'Diaphragm Type Valve',
        inclusions: [
          'Coverage against defects in diaphragm material and valve body.',
          'Manufacturing faults in actuator or control components.',
          'Protection against leakage caused by improper bonding/sealing.',
          'Replacement/repair of defective parts under rated conditions.'
        ],
        exclusions: [
          'Normal wear and tear of diaphragms.',
          'Chemical degradation of diaphragm due to incompatible media.',
          'Damage caused by exceeding rated pressure or temperature.',
          'Faults arising from improper maintenance, cleaning with harsh chemicals, or dry operation.'
        ]
      }
    ]
  },
  {
    id: 'pressure-relief',
    name: 'Pressure Reducing Valve',
    image: '/uploads/2025/04/pressure-relief-.png',
    sections: [
      {
        subTitle: 'Pressure Relief Valve (P.R.V)',
        inclusions: [
          'Warranty covers manufacturing defects in valve body, spring mechanism, and seat.',
          'Functional failures under specified pressure ratings due to design/manufacturing defects.',
          'Coverage against leakage caused by faulty sealing components.',
          'Repair/replacement of defective valve within warranty period under normal usage.'
        ],
        exclusions: [
          'Damage caused by operation beyond rated pressure/temperature limits.',
          'Wear and tear of seals, seats, or springs due to normal service life.',
          'Corrosion, scaling, or erosion caused by incompatible process media.',
          'Improper installation (incorrect orientation, lack of proper inlet/outlet piping).'
        ]
      },
      {
        subTitle: 'Safety Type Valve',
        inclusions: [
          'Warranty covers defects in safety mechanism, spring/lever assembly, and body.',
          'Coverage against manufacturing faults that prevent valve from opening at set pressure.',
          'Protection against leakage due to defective sealing surfaces.',
          'Replacement/repair of defective valve under recommended operating conditions.'
        ],
        exclusions: [
          'Failure due to tampering, over-adjustment, or alteration of factory set pressure.',
          'Damage caused by exposure to corrosive or abrasive fluids not specified.',
          'Seat or disc wear resulting from repeated normal pressure cycling.',
          'Improper handling, storage, or installation (e.g., overtightening connections).'
        ]
      },
      {
        subTitle: 'Vacuum Relief Valve',
        inclusions: [
          'Warranty covers defects in diaphragm, spring mechanism, and valve housing.',
          'Functional failure to relieve vacuum within specified limits due to manufacturing defect.',
          'Coverage against leakage caused by defective sealing.',
          'Repair or replacement of faulty unit under recommended service conditions.'
        ],
        exclusions: [
          'Damage due to incorrect installation or operation outside design vacuum range.',
          'Wear and tear of diaphragms, seals, or springs from normal operation.',
          'Corrosion or chemical attack from incompatible process fluids.',
          'Malfunction caused by contamination, dirt, or lack of maintenance.'
        ]
      },
      {
        subTitle: 'Pressure Reducing/Flow Control Valve',
        inclusions: [
          'Warranty covers defects in regulator body, internal mechanism, and control spring.',
          'Coverage for failure to maintain set pressure/flow due to manufacturing defect.',
          'Assurance against leakage under rated pressure and temperature conditions.',
          'Repair/replacement of faulty valve components within warranty terms.'
        ],
        exclusions: [
          'Damage due to incorrect adjustment or exceeding rated pressure/flow limits.',
          'Normal wear of seats, seals, or diaphragms.',
          'Clogging or malfunction caused by unfiltered/dirty media.',
          'Corrosion or erosion resulting from use with incompatible fluids.'
        ]
      }
    ]
  },
  {
    id: 'speciality-valve',
    name: 'Ball  valve',
    image: '/uploads/2025/04/specaility-valves.png',
    sections: [
      {
        subTitle: 'Cryogenic Type Valve',
        inclusions: [
          'Warranty covers manufacturing defects in valve body, bonnet, stem, and seats.',
          'Coverage against leakage under rated cryogenic temperatures and pressures.',
          'Functional defects in extended bonnet or special low-temperature seals.',
          'Repair/replacement of defective parts due to faulty material or assembly.'
        ],
        exclusions: [
          'Damage due to improper handling, rapid temperature cycling, or incorrect insulation.',
          'Seal/seat wear caused by repeated thermal contraction/expansion (normal use).',
          'Corrosion or material degradation due to incompatible cryogenic fluids.',
          'Failure caused by ice formation or lack of specified purging/maintenance.'
        ]
      },
      {
        subTitle: 'Safety Type Valve',
        inclusions: [
          'Warranty covers defects in spring, lever, or safety mechanism.',
          'Functional failure to open/close at calibrated safety set points due to manufacturing defects.',
          'Coverage against leakage caused by faulty sealing surfaces.',
          'Repair or replacement of valve if failure occurs under recommended operating limits.'
        ],
        exclusions: [
          'Tampering with factory set calibration or unauthorized adjustments.',
          'Damage from exposure to aggressive chemicals or high-velocity particulate media.',
          'Wear of seats, seals, or discs due to repeated actuation cycles.',
          'Improper storage, handling, or installation (e.g., overtightening, incorrect alignment).'
        ]
      },
      {
        subTitle: 'Four Way Type Valve',
        inclusions: [
          'Warranty covers manufacturing defects in body, rotor, and internal sealing components.',
          'Functional failure to divert/redirect flow as per design due to defective mechanism.',
          'Coverage for leakage at rated pressure and temperature conditions.',
          'Repair/replacement of faulty unit under normal service operation.'
        ],
        exclusions: [
          'Damage caused by excessive torque, incorrect actuator fitment, or forced operation.',
          'Wear and tear of sealing surfaces or gaskets from regular switching.',
          'Corrosion, scaling, or erosion caused by incompatible process fluids.',
          'Improper mounting or misalignment during installation.'
        ]
      },
      {
        subTitle: 'Y-Strainer Valve',
        inclusions: [
          'Warranty covers defects in strainer body, mesh element, and sealing surfaces.',
          'Assurance against leakage due to defective welds or casting faults.',
          'Coverage for structural failure of mesh element due to poor manufacturing quality.',
          'Repair/replacement of unit under specified flow/pressure conditions.'
        ],
        exclusions: [
          'Clogging or damage caused by excessive dirt, debris, or lack of cleaning.',
          'Normal wear and tear of strainer mesh element.',
          'Corrosion/erosion caused by aggressive or incompatible media.',
          'Operation beyond rated pressure, temperature, or flow capacity.'
        ]
      }
    ]
  }
];
