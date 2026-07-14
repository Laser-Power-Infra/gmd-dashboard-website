const fs = require('fs');

const plugData = {
  isModern: true,
  title: "MANUAL OF PLUG VALVES",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
        { type: "subtitle", text: "Scope" },
        { type: "text", text: "This manual provides guidelines for the installation, operation, maintenance, inspection, warranty coverage, and service procedures for Plug Valves used in water supply, wastewater, industrial, chemical, and utility applications." },
        { type: "subtitle", text: "Applications" },
        { type: "text", text: "Plug Valves are quarter-turn rotary valves designed for isolation and flow control. They utilize a cylindrical or tapered plug with a flow passage that aligns with the pipeline when open and blocks flow when closed." },
        { type: "text", text: "Plug Valves are commonly used in:" },
        {
          type: "list",
          items: [
            "Water Distribution Systems",
            "Wastewater Treatment Plants",
            "Sewage Networks",
            "Industrial Process Pipelines",
            "Chemical Plants",
            "Oil & Gas Facilities",
            "Irrigation Systems",
            "Utility Services"
          ]
        },
        { type: "subtitle", text: "Purpose" },
        { type: "text", text: "The primary function of a Plug Valve is to provide reliable shut-off, flow diversion, and isolation with minimal pressure loss and quick operation." }
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
            "Inspect the valve for transportation damage.",
            "Ensure plug rotation is smooth.",
            "Check sealing surfaces and coatings."
          ]
        },
        { type: "subtitle", text: "Pipeline Preparation" },
        {
          type: "list",
          items: [
            "Flush the pipeline thoroughly.",
            "Remove rust, welding slag, debris, and foreign particles.",
            "Ensure proper pipe alignment.",
            "Provide adequate support to the piping system."
          ]
        },
        { type: "subtitle", text: "Installation Position" },
        {
          type: "list",
          items: [
            "Plug Valves may be installed in horizontal or vertical pipelines.",
            "Ensure sufficient operating clearance for lever, gearbox, or actuator.",
            "Follow flow direction markings where applicable."
          ]
        },
        { type: "subtitle", text: "Flange Installation" },
        {
          type: "list",
          items: [
            "Use approved gasket materials.",
            "Tighten flange bolts uniformly in a cross pattern.",
            "Avoid excessive tightening force."
          ]
        },
        { type: "subtitle", text: "Installation Precautions" },
        {
          type: "list",
          items: [
            "Do not use valve handles or gear operators for lifting.",
            "Protect valve internals from contamination.",
            "Ensure valve is partially open during installation when recommended."
          ]
        }
      ]
    },
    {
      title: "3. Operation Instructions",
      blocks: [
        { type: "subtitle", text: "Opening Procedure" },
        {
          type: "ordered-list",
          items: [
            "Rotate the lever, handwheel, or gearbox 90°.",
            "Ensure the plug passage aligns fully with pipeline flow.",
            "Confirm unrestricted flow through the valve."
          ]
        },
        { type: "subtitle", text: "Closing Procedure" },
        {
          type: "ordered-list",
          items: [
            "Rotate the operating mechanism 90° in the opposite direction.",
            "Ensure the plug completely blocks the flow path.",
            "Confirm positive shut-off."
          ]
        },
        { type: "subtitle", text: "Operating Precautions" },
        {
          type: "list",
          items: [
            "Operate smoothly without excessive force.",
            "Avoid using extension bars.",
            "Operate within rated pressure and temperature limits.",
            "Ensure valve is fully open or fully closed unless specifically designed for throttling."
          ]
        },
        { type: "subtitle", text: "Position Indicators" },
        {
          type: "table",
          headers: ["Position", "Valve Status"],
          rows: [
            ["Handle Parallel to Pipeline", "Open"],
            ["Handle Perpendicular to Pipeline", "Closed"]
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
            "Verify smooth plug rotation.",
            "Inspect fasteners and operating mechanism.",
            "Check flange joints."
          ]
        },
        { type: "subtitle", text: "Quarterly Inspection" },
        {
          type: "list",
          items: [
            "Inspect plug sealing surfaces.",
            "Check lubrication condition (where applicable).",
            "Examine gearbox or lever assembly.",
            "Verify coating condition."
          ]
        },
        { type: "subtitle", text: "Annual Inspection" },
        {
          type: "list",
          items: [
            "Inspect plug and body seating surfaces.",
            "Examine bearings and bushings.",
            "Check stem condition.",
            "Replace worn seals and gaskets.",
            "Conduct pressure and leakage testing."
          ]
        },
        { type: "subtitle", text: "Recommended Spare Parts" },
        {
          type: "list",
          items: [
            "Plug Assembly",
            "Stem",
            "Bearings",
            "Bushings",
            "O-Rings",
            "Gaskets",
            "Fasteners",
            "Gearbox Components"
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
            ["Plug Assembly", "24 Months"],
            ["Stem / Spindle", "24 Months"],
            ["Bearings & Bushings", "12 Months"],
            ["O-Rings & Seals", "12 Months"],
            ["Gear Operator", "12 Months"],
            ["Fasteners", "12 Months"],
            ["Coating & Painting", "12 Months"]
          ]
        },
        { type: "subtitle", text: "Warranty Exclusions" },
        { type: "text", text: "Warranty does not cover:" },
        {
          type: "list",
          items: [
            "Improper installation.",
            "Operation beyond rated pressure or temperature limits.",
            "Corrosion caused by incompatible media.",
            "Mechanical damage.",
            "Unauthorized modifications.",
            "Improper lubrication practices.",
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
            ["Cast Iron Body", "15–20 Years"],
            ["Ductile Iron Body", "20–30 Years"],
            ["Cast Steel Body", "20–25 Years"],
            ["Stainless Steel Plug", "20+ Years"],
            ["Bronze Components", "15–20 Years"],
            ["EPDM Seals", "8–12 Years"],
            ["NBR Seals", "6–10 Years"]
          ]
        },
        { type: "subtitle", text: "Factors Affecting Service Life" },
        {
          type: "list",
          items: [
            "Fluid Characteristics",
            "Operating Pressure",
            "Temperature Conditions",
            "Frequency of Operation",
            "Corrosion Exposure",
            "Maintenance Practices"
          ]
        },
        { type: "text", text: "Regular maintenance significantly extends valve life." }
      ]
    },
    {
      title: "7. Customer Responsibilities",
      blocks: [
        { type: "text", text: "The customer shall:" },
        {
          type: "list",
          items: [
            "Ensure proper installation.",
            "Operate within specified limits.",
            "Maintain inspection and maintenance records.",
            "Conduct scheduled maintenance.",
            "Protect valves from external damage.",
            "Follow lubrication recommendations.",
            "Report abnormalities promptly."
          ]
        },
        { type: "text", text: "Failure to comply may affect warranty eligibility." }
      ]
    },
    {
      title: "8. Warranty Claim Procedure",
      blocks: [
        { type: "subtitle", text: "Step 1 – Claim Submission" },
        { type: "text", text: "Provide:" },
        {
          type: "list",
          items: [
            "Purchase Order Number",
            "Invoice Copy",
            "Valve Identification Details",
            "Installation Date",
            "Description of Defect",
            "Photographs of Valve and Installation"
          ]
        },
        { type: "subtitle", text: "Step 2 – Technical Evaluation" },
        { type: "text", text: "The submitted information will be reviewed to determine:" },
        {
          type: "list",
          items: [
            "Installation compliance",
            "Operating conditions",
            "Maintenance history",
            "Warranty applicability"
          ]
        },
        { type: "subtitle", text: "Step 3 – Inspection" },
        { type: "text", text: "Where required:" },
        {
          type: "list",
          items: [
            "Site inspection may be conducted.",
            "Valve may be requested for detailed examination."
          ]
        },
        { type: "subtitle", text: "Step 4 – Resolution" },
        { type: "text", text: "Based on technical findings:" },
        {
          type: "list",
          items: [
            "Repair",
            "Component Replacement",
            "Valve Replacement",
            "Technical Recommendations"
          ]
        },
        { type: "text", text: "will be provided according to warranty terms." }
      ]
    },
    {
      title: "Safety Precautions",
      blocks: [
        {
          type: "list",
          items: [
            "Depressurize and drain the system before maintenance.",
            "Never dismantle the valve under pressure.",
            "Wear appropriate PPE during servicing.",
            "Follow all plant safety procedures.",
            "Use approved lifting methods for large-size valves."
          ]
        }
      ]
    },
    {
      title: "Document Retention",
      blocks: [
        { type: "text", text: "Maintain installation records, maintenance logs, inspection reports, pressure test records, and warranty documentation throughout the service life of the valve for operational reference and warranty support." }
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

// Update the plug-valve key
parsedObject['plug-valve'] = plugData;

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully added Plug Valve");
