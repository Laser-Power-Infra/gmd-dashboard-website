const fs = require('fs');
const content = fs.readFileSync('src/components/manualsData.js', 'utf8');
const butterflyEndIndex = content.indexOf('"sluice-valve": {');
const newButterfly = `  "butterfly-valve": {
    "isModern": true,
    "title": "MANUAL OF BUTTERFLY VALVES",
    "sections": [
      {
        "title": "1. Introduction",
        "blocks": [
          { "type": "subtitle", "text": "Scope" },
          { "type": "text", "text": "This manual provides guidelines for the installation, operation, maintenance, inspection, and warranty coverage of Butterfly Valves manufactured and supplied by GM Dalui & Sons." },
          { "type": "subtitle", "text": "Applications" },
          { "type": "text", "text": "Butterfly Valves are widely used for flow isolation and regulation in:" },
          { "type": "list", "items": ["Water Distribution Networks", "Water Treatment Plants", "Sewage Treatment Plants", "Irrigation Systems", "Fire Protection Systems", "HVAC Systems", "Industrial Process Pipelines", "Power Plants", "Chemical and Utility Services"] },
          { "type": "text", "text": "The valves are designed for reliable performance under varying pressure and flow conditions." }
        ]
      },
      {
        "title": "2. Installation Guidelines",
        "blocks": [
          { "type": "subtitle", "text": "Pre-Installation Inspection" },
          { "type": "list", "items": ["Verify valve size, pressure rating, and material compatibility.", "Inspect the valve for transportation damage.", "Remove all protective covers and packaging materials.", "Ensure pipeline is free from debris, welding slag, sand, and foreign materials."] },
          { "type": "subtitle", "text": "Piping Requirements" },
          { "type": "list", "items": ["Install valve in clean and properly aligned pipelines.", "Provide adequate support for large diameter valves.", "Avoid excessive pipe stresses on valve body.", "Ensure sufficient clearance for disc rotation."] },
          { "type": "subtitle", "text": "Valve Orientation" },
          { "type": "text", "text": "Recommended positions:" },
          { "type": "list", "items": ["Horizontal pipeline with shaft in horizontal position.", "Vertical installation permitted where system design requires.", "Avoid installing with disc partially open during commissioning."] },
          { "type": "subtitle", "text": "Flange Bolting" },
          { "type": "list", "items": ["Use appropriate gasket material.", "Tighten flange bolts in cross-pattern sequence.", "Apply uniform torque to prevent leakage.", "Avoid overtightening which may deform valve seats."] }
        ]
      },
      {
        "title": "3. Operation Instructions",
        "blocks": [
          { "type": "subtitle", "text": "Opening Procedure" },
          { "type": "ordered-list", "items": ["Ensure system pressure is within valve rating.", "Operate handwheel, gearbox, actuator, or lever smoothly.", "Open valve gradually to prevent pressure shock.", "Verify full disc opening position."] },
          { "type": "subtitle", "text": "Closing Procedure" },
          { "type": "ordered-list", "items": ["Close valve slowly.", "Avoid sudden closure to minimize water hammer.", "Confirm valve reaches full closed position.", "Do not apply excessive operating force."] },
          { "type": "subtitle", "text": "Operational Precautions" },
          { "type": "list", "items": ["Never use valve beyond rated pressure and temperature.", "Do not use valve as pipeline support.", "Avoid operation under severe vibration conditions.", "Do not modify valve components without authorization."] }
        ]
      },
      {
        "title": "4. Maintenance Schedule",
        "blocks": [
          { "type": "subtitle", "text": "Monthly Inspection" },
          { "type": "list", "items": ["Check for external leakage.", "Inspect operating mechanism.", "Verify valve opening and closing operation.", "Check fasteners and mounting hardware."] },
          { "type": "subtitle", "text": "Quarterly Inspection" },
          { "type": "list", "items": ["Inspect seat condition.", "Verify actuator alignment.", "Lubricate moving components where applicable.", "Check stem sealing arrangement."] },
          { "type": "subtitle", "text": "Annual Inspection" },
          { "type": "list", "items": ["Complete internal inspection.", "Examine disc wear and corrosion.", "Inspect shaft, bearings, and bushings.", "Replace worn seals if required.", "Perform functional pressure testing."] },
          { "type": "subtitle", "text": "Recommended Spare Parts" },
          { "type": "list", "items": ["Rubber Seat", "O-Rings", "Stem Seals", "Bearings", "Fasteners", "Gearbox Components"] }
        ]
      },
      {
        "title": "5. Warranty Coverage",
        "blocks": [
          {
            "type": "table",
            "headers": ["Component", "Warranty Coverage"],
            "rows": [
              ["Valve Body", "24 Months"],
              ["Disc", "24 Months"],
              ["Stem / Spindle", "24 Months"],
              ["Shaft Bearings", "12 Months"],
              ["Rubber Seat", "12 Months"],
              ["O-Rings & Seals", "12 Months"],
              ["Gear Operator", "12 Months"],
              ["Coating & Painting", "12 Months"],
              ["Fasteners", "12 Months"]
            ]
          },
          { "type": "subtitle", "text": "Warranty Exclusions" },
          { "type": "text", "text": "Warranty does not cover:" },
          { "type": "list", "items": ["Improper installation.", "Unauthorized modifications.", "Damage due to misuse.", "Corrosion caused by incompatible media.", "Natural disasters and force majeure events.", "Normal wear and tear."] }
        ]
      },
      {
        "title": "6. Expected Service Life",
        "blocks": [
          {
            "type": "table",
            "headers": ["Material of Construction", "Expected Life"],
            "rows": [
              ["Cast Iron Body", "15-20 Years"],
              ["Ductile Iron Body", "20-25 Years"],
              ["Stainless Steel Disc", "20+ Years"],
              ["EPDM Seat", "8-12 Years"],
              ["NBR Seat", "6-10 Years"],
              ["PTFE Seat", "10-15 Years"]
            ]
          },
          { "type": "subtitle", "text": "Factors Affecting Life" },
          { "type": "list", "items": ["Operating Pressure", "Flow Velocity", "Media Characteristics", "Maintenance Practices", "Environmental Conditions", "Operating Frequency"] },
          { "type": "text", "text": "Proper maintenance can significantly extend valve life." }
        ]
      },
      {
        "title": "7. Customer Responsibilities",
        "blocks": [
          { "type": "text", "text": "Customers are responsible for:" },
          { "type": "list", "items": ["Proper installation practices.", "Maintaining service records.", "Conducting periodic inspections.", "Operating valve within rated limits.", "Reporting issues promptly.", "Protecting valves from physical damage.", "Maintaining system cleanliness."] },
          { "type": "text", "text": "Failure to comply may affect warranty eligibility." }
        ]
      },
      {
        "title": "8. Warranty Claim Procedure",
        "blocks": [
          { "type": "subtitle", "text": "Step 1 – Raise Service Request" },
          { "type": "text", "text": "Contact GM Dalui & Sons with:" },
          { "type": "list", "items": ["Purchase Order Number", "Invoice Copy", "Valve Identification Details", "Photographs of Defect", "Installation Details"] },
          { "type": "subtitle", "text": "Step 2 – Technical Evaluation" },
          { "type": "text", "text": "Our technical team will:" },
          { "type": "list", "items": ["Review submitted documents.", "Assess installation conditions.", "Evaluate operating history.", "Determine warranty applicability."] },
          { "type": "subtitle", "text": "Step 3 – Site Inspection (If Required)" },
          { "type": "text", "text": "A field engineer may inspect the valve installation and operating conditions." },
          { "type": "subtitle", "text": "Step 4 – Resolution" },
          { "type": "text", "text": "Based on inspection findings:" },
          { "type": "list", "items": ["Repair", "Component Replacement", "Valve Replacement", "Technical Recommendation"] },
          { "type": "text", "text": "will be provided as per warranty terms." }
        ]
      },
      {
        "title": "Contact for Warranty & Service",
        "blocks": [
          { "type": "text", "text": "GM Dalui & Sons" },
          { "type": "text", "text": "Email: info@gmdalui.co.in" },
          { "type": "text", "text": "Service Department: support@gmdalui.co.in" },
          { "type": "text", "text": "Website: www.gmdalui.com" },
          { "type": "text", "text": "Please retain this manual and maintenance records for future reference." }
        ]
      }
    ]
  },
`;
const prefix = content.substring(0, content.indexOf('"butterfly-valve": {'));
const suffix = content.substring(butterflyEndIndex);
fs.writeFileSync('src/components/manualsData.js', prefix + newButterfly + suffix);
console.log('Successfully updated manualsData.js');
