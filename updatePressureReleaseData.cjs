const fs = require('fs');

const releaseData = {
  isModern: true,
  title: "MANUAL OF PRESSURE RELEASE VALVES",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
        { type: "subtitle", text: "Scope" },
        { type: "text", text: "This manual provides guidelines for the installation, operation, maintenance, inspection, warranty coverage, and service procedures for Pressure Release Valves used in water transmission systems, pumping stations, industrial pipelines, and pressurized networks." },
        { type: "subtitle", text: "Applications" },
        { type: "text", text: "Pressure Release Valves are automatic hydraulic control valves designed to release excess pressure from a pipeline or system whenever pressure exceeds a preset safe limit." },
        { type: "text", text: "They are commonly used in:" },
        {
          type: "list",
          items: [
            "Water Transmission Pipelines",
            "Municipal Water Supply Systems",
            "Pumping Stations",
            "Irrigation Networks",
            "Industrial Process Pipelines",
            "Fire Protection Systems",
            "Water Treatment Plants",
            "Power Plants"
          ]
        },
        { type: "subtitle", text: "Purpose" },
        { type: "text", text: "The primary function of a Pressure Release Valve is to:" },
        {
          type: "list",
          items: [
            "Protect pipelines from overpressure.",
            "Prevent pipeline bursts.",
            "Reduce surge pressure effects.",
            "Protect pumps and equipment.",
            "Improve system safety and reliability."
          ]
        }
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
            "Verify valve size, pressure class, and material specifications.",
            "Inspect valve and pilot system for transportation damage.",
            "Ensure all tubing and pilot components are securely connected.",
            "Check internal passages for cleanliness."
          ]
        },
        { type: "subtitle", text: "Pipeline Preparation" },
        {
          type: "list",
          items: [
            "Flush the pipeline thoroughly.",
            "Remove rust, welding slag, debris, and foreign particles.",
            "Ensure proper pipeline alignment.",
            "Provide adequate pipeline support."
          ]
        },
        { type: "subtitle", text: "Recommended Installation Arrangement" },
        { type: "text", text: "Install the valve:" },
        {
          type: "list",
          items: [
            "On a tee connection from the main pipeline.",
            "At pump discharge lines.",
            "At surge-prone locations.",
            "At critical pressure zones identified during hydraulic design."
          ]
        },
        { type: "subtitle", text: "Installation Position" },
        {
          type: "list",
          items: [
            "Install in horizontal position whenever possible.",
            "Follow flow direction markings.",
            "Ensure pilot assembly remains accessible."
          ]
        },
        { type: "subtitle", text: "Installation Precautions" },
        {
          type: "list",
          items: [
            "Avoid excessive stress on valve body.",
            "Ensure discharge piping is properly routed.",
            "Provide drainage arrangements where necessary."
          ]
        }
      ]
    },
    {
      title: "3. Operation Instructions",
      blocks: [
        { type: "subtitle", text: "Normal Operation" },
        { type: "text", text: "During normal system pressure:" },
        {
          type: "list",
          items: [
            "The valve remains closed.",
            "No discharge occurs."
          ]
        },
        { type: "subtitle", text: "Pressure Release Operation" },
        { type: "text", text: "When pressure exceeds the preset value:" },
        {
          type: "list",
          items: [
            "Pilot control senses excess pressure.",
            "Main valve opens automatically.",
            "Excess water is discharged.",
            "System pressure reduces to safe operating levels."
          ]
        },
        { type: "subtitle", text: "Automatic Reset" },
        { type: "text", text: "When pressure returns below the set value:" },
        {
          type: "list",
          items: [
            "Pilot system closes.",
            "Main valve reseats automatically.",
            "Normal operation resumes."
          ]
        },
        { type: "subtitle", text: "Operating Precautions" },
        {
          type: "list",
          items: [
            "Do not tamper with pilot settings.",
            "Keep discharge lines unobstructed.",
            "Operate within rated pressure limits.",
            "Maintain pilot control components properly."
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
            "Check for leakage.",
            "Inspect pilot tubing connections.",
            "Verify discharge outlet condition.",
            "Observe valve operation during pressure fluctuations."
          ]
        },
        { type: "subtitle", text: "Quarterly Inspection" },
        {
          type: "list",
          items: [
            "Inspect pilot control valve.",
            "Check pressure gauge readings.",
            "Verify diaphragm performance.",
            "Clean pilot system passages."
          ]
        },
        { type: "subtitle", text: "Annual Inspection" },
        {
          type: "list",
          items: [
            "Inspect valve internals.",
            "Examine diaphragm condition.",
            "Check seat and disc assembly.",
            "Inspect pilot components.",
            "Replace worn seals and gaskets.",
            "Conduct functional pressure testing."
          ]
        },
        { type: "subtitle", text: "Recommended Spare Parts" },
        {
          type: "list",
          items: [
            "Diaphragm Assembly",
            "Pilot Valve Kit",
            "Seat Ring",
            "Disc Assembly",
            "Springs",
            "O-Rings",
            "Gaskets",
            "Pressure Gauge"
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
        { type: "text", text: "Warranty shall not cover:" },
        {
          type: "list",
          items: [
            "Improper installation.",
            "Incorrect pressure settings.",
            "Damage caused by contaminated fluid.",
            "Blocked discharge piping.",
            "Unauthorized modifications.",
            "Operation beyond rated limits.",
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
            ["Stainless Steel Components", "20+ Years"],
            ["Bronze Pilot Components", "15–20 Years"],
            ["EPDM Diaphragm", "8–12 Years"],
            ["NBR Diaphragm", "6–10 Years"],
            ["Stainless Steel Springs", "15–20 Years"]
          ]
        },
        { type: "subtitle", text: "Factors Affecting Service Life" },
        {
          type: "list",
          items: [
            "Water Quality",
            "Pressure Surges",
            "Frequency of Valve Operation",
            "Environmental Conditions",
            "Maintenance Practices",
            "Pilot System Cleanliness"
          ]
        },
        { type: "text", text: "Regular maintenance significantly extends service life." }
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
            "Conduct scheduled inspections.",
            "Keep pilot systems clean.",
            "Operate within rated pressure limits.",
            "Maintain maintenance documentation.",
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
            "Pressure records",
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
        { type: "text", text: "Based on technical findings, one of the following may be provided:" },
        {
          type: "list",
          items: [
            "Repair",
            "Component Replacement",
            "Valve Replacement",
            "Pilot Adjustment",
            "Technical Recommendations"
          ]
        }
      ]
    },
    {
      title: "Safety Precautions",
      blocks: [
        {
          type: "list",
          items: [
            "Depressurize the system before maintenance.",
            "Never dismantle the valve while pressurized.",
            "Wear appropriate PPE during servicing.",
            "Ensure discharge outlets remain clear.",
            "Follow all plant safety procedures."
          ]
        }
      ]
    },
    {
      title: "Document Retention",
      blocks: [
        { type: "text", text: "Maintain installation records, pressure settings, maintenance logs, inspection reports, operational records, and warranty documentation throughout the service life of the valve for operational reference and warranty support." }
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

// Update the pressure-release-valve key
parsedObject['pressure-release-valve'] = releaseData;

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully added Pressure Release Valve");
