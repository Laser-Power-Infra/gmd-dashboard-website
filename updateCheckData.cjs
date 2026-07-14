const fs = require('fs');

const checkData = {
  isModern: true,
  title: "MANUAL OF CHECK VALVES",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
        { type: "subtitle", text: "Scope" },
        { type: "text", text: "This manual provides guidelines for the installation, operation, inspection, maintenance, warranty coverage, and service procedures for Check Valves manufactured and supplied by GM Dalui & Sons." },
        { type: "subtitle", text: "Applications" },
        { type: "text", text: "Check Valves are automatic valves designed to permit flow in one direction and prevent reverse flow. They are commonly used in:" },
        {
          type: "list",
          items: [
            "Water Supply Systems",
            "Pumping Stations",
            "Water Treatment Plants",
            "Sewage Treatment Plants",
            "Irrigation Networks",
            "Industrial Pipelines",
            "HVAC Systems",
            "Fire Protection Systems",
            "Power Plants"
          ]
        },
        { type: "text", text: "Check Valves protect pumps, compressors, and pipelines from damage caused by backflow and pressure surges." }
      ]
    },
    {
      title: "2. Installation Guidelines",
      blocks: [
        { type: "subtitle", text: "Pre-Installation Inspection" },
        { type: "text", text: "Before installation:" },
        {
          type: "list",
          items: [
            "Verify valve size, pressure rating, and material specifications.",
            "Inspect valve for shipping or handling damage.",
            "Confirm flow direction indicated by the arrow on the valve body.",
            "Ensure valve internals move freely."
          ]
        },
        { type: "subtitle", text: "Pipeline Preparation" },
        {
          type: "list",
          items: [
            "Flush pipeline thoroughly before installation.",
            "Remove welding slag, rust, sand, and debris.",
            "Ensure proper pipeline alignment.",
            "Avoid excessive pipe stress on the valve body."
          ]
        },
        { type: "subtitle", text: "Valve Orientation" },
        { type: "subtitle", text: "Swing Check Valve" },
        {
          type: "list",
          items: [
            "Install in horizontal pipelines.",
            "Flow direction must follow arrow marking.",
            "Cover hinge pin should be positioned at the top."
          ]
        },
        { type: "subtitle", text: "Dual Plate Check Valve" },
        {
          type: "list",
          items: [
            "Suitable for horizontal and vertical upward flow installations.",
            "Ensure proper spring-assisted closure alignment."
          ]
        },
        { type: "subtitle", text: "Non-Slam / Zero Velocity Check Valve" },
        {
          type: "list",
          items: [
            "Install according to manufacturer recommendations.",
            "Ensure adequate upstream and downstream straight pipe lengths."
          ]
        },
        { type: "subtitle", text: "Flange Installation" },
        {
          type: "list",
          items: [
            "Use appropriate gasket material.",
            "Tighten bolts evenly in cross-pattern sequence.",
            "Avoid excessive tightening."
          ]
        }
      ]
    },
    {
      title: "3. Operation Instructions",
      blocks: [
        { type: "subtitle", text: "Automatic Operation" },
        { type: "text", text: "Check Valves operate automatically:" },
        {
          type: "list",
          items: [
            "Forward flow opens the valve.",
            "Reverse flow causes automatic closure.",
            "No manual operation is normally required."
          ]
        },
        { type: "subtitle", text: "Operating Precautions" },
        {
          type: "list",
          items: [
            "Never force valve open or closed.",
            "Ensure flow direction matches valve marking.",
            "Avoid installing undersized valves.",
            "Do not use check valves as isolation valves.",
            "Prevent operation outside pressure and temperature ratings."
          ]
        },
        { type: "subtitle", text: "Startup Procedure" },
        {
          type: "ordered-list",
          items: [
            "Verify installation orientation.",
            "Slowly introduce flow into the pipeline.",
            "Observe valve performance.",
            "Check for leakage or abnormal vibration.",
            "Monitor pressure fluctuations during initial operation."
          ]
        }
      ]
    },
    {
      title: "4. Maintenance Schedule",
      blocks: [
        { type: "subtitle", text: "Monthly Inspection" },
        {
          type: "list",
          items: [
            "Check for external leakage.",
            "Listen for abnormal noise or chatter.",
            "Inspect flange joints.",
            "Verify proper system performance."
          ]
        },
        { type: "subtitle", text: "Quarterly Inspection" },
        {
          type: "list",
          items: [
            "Inspect valve body coating.",
            "Check hinge pin or spring assembly condition.",
            "Examine disc movement where accessible.",
            "Verify backflow prevention performance."
          ]
        },
        { type: "subtitle", text: "Annual Inspection" },
        {
          type: "list",
          items: [
            "Remove and inspect internal components.",
            "Check disc wear.",
            "Inspect seat surfaces.",
            "Examine spring mechanism (if applicable).",
            "Replace worn seals and gaskets.",
            "Perform operational testing."
          ]
        },
        { type: "subtitle", text: "Recommended Spare Parts" },
        {
          type: "list",
          items: [
            "Disc Assembly",
            "Seat Rings",
            "Springs",
            "Hinge Pins",
            "Bushings",
            "O-Rings",
            "Gaskets",
            "Fasteners"
          ]
        }
      ]
    },
    {
      title: "5. Warranty Coverage",
      blocks: [
        {
          type: "table",
          headers: ["Component", "Warranty Coverage"],
          rows: [
            ["Valve Body", "24 Months"],
            ["Cover", "24 Months"],
            ["Disc Assembly", "24 Months"],
            ["Hinge Pin", "24 Months"],
            ["Spring Mechanism", "12 Months"],
            ["Seat Rings", "12 Months"],
            ["O-Rings & Seals", "12 Months"],
            ["Bushings", "12 Months"],
            ["Coating & Painting", "12 Months"]
          ]
        },
        { type: "subtitle", text: "Warranty Exclusions" },
        { type: "text", text: "Warranty shall not apply to:" },
        {
          type: "list",
          items: [
            "Incorrect installation.",
            "Reverse installation.",
            "Water hammer damage.",
            "Excessive pressure conditions.",
            "Corrosive media beyond design limits.",
            "Unauthorized repairs or modifications.",
            "Normal wear and tear."
          ]
        }
      ]
    },
    {
      title: "6. Expected Service Life",
      blocks: [
        {
          type: "table",
          headers: ["Material of Construction", "Expected Life"],
          rows: [
            ["Cast Iron Body", "15-20 Years"],
            ["Ductile Iron Body", "20-30 Years"],
            ["Stainless Steel Disc", "20+ Years"],
            ["Stainless Steel Spring", "15-20 Years"],
            ["Bronze Components", "15-20 Years"],
            ["EPDM Seals", "8-12 Years"],
            ["NBR Seals", "6-10 Years"]
          ]
        },
        { type: "subtitle", text: "Factors Affecting Service Life" },
        {
          type: "list",
          items: [
            "Flow Velocity",
            "Pressure Fluctuations",
            "Water Quality",
            "Frequency of Operation",
            "Water Hammer Events",
            "Maintenance Practices",
            "Environmental Conditions"
          ]
        },
        { type: "text", text: "Regular inspection significantly increases service life." }
      ]
    },
    {
      title: "7. Customer Responsibilities",
      blocks: [
        { type: "text", text: "The customer is responsible for:" },
        {
          type: "list",
          items: [
            "Ensuring proper installation.",
            "Following recommended operating practices.",
            "Conducting periodic inspections.",
            "Maintaining service records.",
            "Preventing excessive water hammer.",
            "Reporting defects promptly.",
            "Operating within rated limits."
          ]
        },
        { type: "text", text: "Failure to follow these guidelines may void warranty coverage." }
      ]
    },
    {
      title: "8. Warranty Claim Procedure",
      blocks: [
        { type: "subtitle", text: "Step 1 – Submit Claim" },
        { type: "text", text: "Provide:" },
        {
          type: "list",
          items: [
            "Purchase Order Number",
            "Invoice Copy",
            "Valve Identification Details",
            "Installation Date",
            "Operating Conditions",
            "Photographs of Defect"
          ]
        },
        { type: "subtitle", text: "Step 2 – Technical Assessment" },
        { type: "text", text: "GM Dalui & Sons will:" },
        {
          type: "list",
          items: [
            "Review warranty documentation.",
            "Assess operating conditions.",
            "Evaluate installation practices.",
            "Determine warranty applicability."
          ]
        },
        { type: "subtitle", text: "Step 3 – Inspection" },
        { type: "text", text: "Where required:" },
        {
          type: "list",
          items: [
            "Site inspection may be conducted.",
            "Valve may be returned for detailed examination."
          ]
        },
        { type: "subtitle", text: "Step 4 – Resolution" },
        { type: "text", text: "Depending on findings:" },
        {
          type: "list",
          items: [
            "Repair",
            "Component Replacement",
            "Valve Replacement",
            "Technical Recommendations"
          ]
        },
        { type: "text", text: "will be provided as per warranty terms." }
      ]
    },
    {
      title: "Safety Precautions",
      blocks: [
        {
          type: "list",
          items: [
            "Depressurize the pipeline before maintenance.",
            "Never dismantle the valve under pressure.",
            "Wear appropriate PPE during inspection.",
            "Use proper lifting equipment for large valves.",
            "Follow all plant safety procedures."
          ]
        }
      ]
    }
  ]
};

const content = fs.readFileSync('src/components/manualsData.js', 'utf8');

const jsCode = content.replace('export const manualsData = ', 'return ');
let parsedObject;
try {
  parsedObject = new Function(jsCode)();
} catch (e) {
  console.log("Error parsing:", e);
  process.exit(1);
}

// Update the dual-check key
parsedObject['dual-check'] = checkData;

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully added Check Valve");
