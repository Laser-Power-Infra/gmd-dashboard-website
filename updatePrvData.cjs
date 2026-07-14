const fs = require('fs');

const prvData = {
  isModern: true,
  title: "MANUAL OF PRESSURE REDUCING VALVES (PRV)",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
        { type: "subtitle", text: "Scope" },
        { type: "text", text: "This manual provides guidelines for the installation, operation, maintenance, inspection, warranty coverage, and service procedures for Pressure Reducing Valves (PRV) used in water supply, industrial process, irrigation, fire protection, and utility systems." },
        { type: "subtitle", text: "Applications" },
        { type: "text", text: "Pressure Reducing Valves are automatic control valves designed to reduce higher inlet pressure to a predetermined lower outlet pressure, regardless of fluctuations in upstream pressure or flow demand." },
        { type: "text", text: "PRVs are commonly used in:" },
        {
          type: "list",
          items: [
            "Water Distribution Networks",
            "Municipal Water Supply Systems",
            "Irrigation Projects",
            "Pumping Stations",
            "High-Rise Buildings",
            "Industrial Process Plants",
            "Fire Protection Systems",
            "Water Treatment Facilities"
          ]
        },
        { type: "subtitle", text: "Function" },
        { type: "text", text: "The PRV automatically maintains a constant downstream pressure, protecting pipelines, fittings, pumps, meters, and equipment from excessive pressure." }
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
            "Verify valve size, pressure class, and material compatibility.",
            "Inspect the valve for transportation damage.",
            "Confirm pilot tubing and accessories are secure.",
            "Check that all ports and passages are clean."
          ]
        },
        { type: "subtitle", text: "Pipeline Preparation" },
        {
          type: "list",
          items: [
            "Flush the pipeline thoroughly.",
            "Remove rust, welding slag, sand, and debris.",
            "Ensure proper pipe alignment.",
            "Install pipeline supports where necessary."
          ]
        },
        { type: "subtitle", text: "Recommended Installation Arrangement" },
        { type: "text", text: "The following components are recommended:" },
        {
          type: "list",
          items: [
            "Isolation Valve (Upstream)",
            "Y-Strainer",
            "Pressure Gauge (Upstream)",
            "Pressure Reducing Valve",
            "Pressure Gauge (Downstream)",
            "Isolation Valve (Downstream)"
          ]
        },
        { type: "subtitle", text: "Valve Orientation" },
        {
          type: "list",
          items: [
            "Install in horizontal pipelines whenever possible.",
            "Ensure pilot tubing is accessible.",
            "Follow flow direction arrow marked on valve body."
          ]
        },
        { type: "subtitle", text: "Installation Precautions" },
        {
          type: "list",
          items: [
            "Install sufficient straight pipe lengths.",
            "Protect pilot lines from damage.",
            "Avoid excessive pipe stress on the valve body."
          ]
        }
      ]
    },
    {
      title: "3. Operation Instructions",
      blocks: [
        { type: "subtitle", text: "Initial Commissioning" },
        {
          type: "ordered-list",
          items: [
            "Open upstream isolation valve slowly.",
            "Allow valve chamber to fill gradually.",
            "Open downstream isolation valve.",
            "Adjust pilot setting if required.",
            "Verify downstream pressure."
          ]
        },
        { type: "subtitle", text: "Pressure Adjustment" },
        { type: "text", text: "To increase outlet pressure:" },
        {
          type: "list",
          items: [
            "Turn adjusting screw clockwise."
          ]
        },
        { type: "text", text: "To decrease outlet pressure:" },
        {
          type: "list",
          items: [
            "Turn adjusting screw counterclockwise."
          ]
        },
        { type: "text", text: "Make adjustments gradually and verify pressure readings after each adjustment." },
        { type: "subtitle", text: "Operating Precautions" },
        {
          type: "list",
          items: [
            "Do not exceed rated pressure limits.",
            "Avoid rapid pressure adjustments.",
            "Ensure pressure gauges remain operational.",
            "Maintain clean pilot system components."
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
            "Verify downstream pressure stability.",
            "Inspect pressure gauges.",
            "Examine pilot tubing connections."
          ]
        },
        { type: "subtitle", text: "Quarterly Inspection" },
        {
          type: "list",
          items: [
            "Inspect pilot assembly.",
            "Clean strainer screen.",
            "Check diaphragm performance.",
            "Verify adjustment mechanism operation."
          ]
        },
        { type: "subtitle", text: "Annual Inspection" },
        {
          type: "list",
          items: [
            "Inspect valve internals.",
            "Examine diaphragm condition.",
            "Inspect seat and disc assembly.",
            "Replace worn seals and gaskets.",
            "Clean pilot passages.",
            "Conduct functional pressure testing."
          ]
        },
        { type: "subtitle", text: "Recommended Spare Parts" },
        {
          type: "list",
          items: [
            "Diaphragm Assembly",
            "Pilot Valve Components",
            "Seat Rings",
            "Disc Assembly",
            "O-Rings",
            "Gaskets",
            "Springs",
            "Strainer Element"
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
            ["Cover Assembly", "24 Months"],
            ["Diaphragm Housing", "24 Months"],
            ["Pilot Valve Assembly", "12 Months"],
            ["Diaphragm", "12 Months"],
            ["Seat & Disc Assembly", "12 Months"],
            ["Springs", "12 Months"],
            ["O-Rings & Seals", "12 Months"],
            ["Coating & Painting", "12 Months"]
          ]
        },
        { type: "subtitle", text: "Warranty Exclusions" },
        { type: "text", text: "Warranty does not cover:" },
        {
          type: "list",
          items: [
            "Improper installation.",
            "Damage caused by debris or contaminated water.",
            "Incorrect pressure settings.",
            "Excessive pressure conditions.",
            "Unauthorized modifications.",
            "Corrosion due to incompatible media.",
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
            ["Stainless Steel Internal Components", "20+ Years"],
            ["Bronze Pilot Components", "15-20 Years"],
            ["EPDM Diaphragm", "8-12 Years"],
            ["NBR Diaphragm", "6-10 Years"],
            ["Stainless Steel Springs", "15-20 Years"]
          ]
        },
        { type: "subtitle", text: "Factors Affecting Service Life" },
        {
          type: "list",
          items: [
            "Water Quality",
            "Pressure Fluctuations",
            "Frequency of Operation",
            "Maintenance Practices",
            "Environmental Conditions",
            "Pilot System Cleanliness"
          ]
        },
        { type: "text", text: "Regular preventive maintenance significantly extends service life." }
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
            "Maintain pressure records.",
            "Conduct scheduled maintenance.",
            "Keep pilot systems clean.",
            "Operate within rated conditions.",
            "Maintain inspection documentation.",
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
            "Pressure Settings",
            "Description of Defect",
            "Photographs of Installation"
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
        { type: "text", text: "Where necessary:" },
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
            "Depressurize the system before maintenance.",
            "Never dismantle the valve under pressure.",
            "Wear appropriate PPE during servicing.",
            "Ensure isolation valves are closed before maintenance.",
            "Follow all plant safety procedures."
          ]
        }
      ]
    },
    {
      title: "Document Retention",
      blocks: [
        { type: "text", text: "Maintain installation records, pressure settings, maintenance logs, inspection reports, and warranty documentation throughout the service life of the valve for operational reference and warranty support." }
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

// Update the prv key
parsedObject['prv'] = prvData;

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully added PRV");
