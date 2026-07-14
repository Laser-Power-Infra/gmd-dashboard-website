const fs = require('fs');

const zeroData = {
  isModern: true,
  title: "MANUAL OF ZERO VELOCITY VALVES",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
        { type: "subtitle", text: "Scope" },
        { type: "text", text: "This manual provides guidelines for the installation, operation, maintenance, inspection, warranty coverage, and service procedures for Zero Velocity Valves used in water transmission, pumping stations, irrigation systems, and industrial pipelines." },
        { type: "subtitle", text: "Applications" },
        { type: "text", text: "Zero Velocity Valves are hydraulically operated non-slam check valves designed to close automatically when the forward flow velocity approaches zero, thereby preventing reverse flow and eliminating water hammer." },
        { type: "text", text: "They are commonly used in:" },
        {
          type: "list",
          items: [
            "Pumping Stations",
            "Water Supply Networks",
            "Water Transmission Mains",
            "Irrigation Projects",
            "Water Treatment Plants",
            "Sewage Treatment Plants",
            "Industrial Process Pipelines",
            "Power Plant Cooling Water Systems"
          ]
        },
        { type: "subtitle", text: "Purpose" },
        { type: "text", text: "The primary function of a Zero Velocity Valve is to:" },
        {
          type: "list",
          items: [
            "Prevent reverse flow.",
            "Eliminate water hammer.",
            "Protect pumps and motors.",
            "Reduce pressure surges.",
            "Improve system reliability and safety."
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
            "Verify valve size, pressure rating, and material specifications.",
            "Inspect the valve for transportation damage.",
            "Check hydraulic control components and tubing.",
            "Ensure the disc moves freely."
          ]
        },
        { type: "subtitle", text: "Pipeline Preparation" },
        {
          type: "list",
          items: [
            "Flush the pipeline thoroughly before installation.",
            "Remove welding slag, rust, debris, and foreign particles.",
            "Ensure proper pipeline alignment.",
            "Provide adequate pipeline supports."
          ]
        },
        { type: "subtitle", text: "Installation Position" },
        {
          type: "list",
          items: [
            "Install according to flow direction arrow marked on the valve body.",
            "Horizontal installation is generally recommended.",
            "Ensure sufficient space for maintenance and inspection."
          ]
        },
        { type: "subtitle", text: "Hydraulic Control System" },
        { type: "text", text: "Before commissioning:" },
        {
          type: "list",
          items: [
            "Verify all hydraulic control lines are properly connected.",
            "Check pilot valve settings.",
            "Ensure control chamber is free from air entrapment."
          ]
        },
        { type: "subtitle", text: "Installation Precautions" },
        {
          type: "list",
          items: [
            "Avoid excessive pipe stress on valve body.",
            "Install isolation valves where required.",
            "Ensure accessibility to hydraulic control components."
          ]
        }
      ]
    },
    {
      title: "3. Operation Instructions",
      blocks: [
        { type: "subtitle", text: "Normal Operation" },
        { type: "text", text: "During pump operation:" },
        {
          type: "list",
          items: [
            "Forward flow opens the valve.",
            "Hydraulic controls maintain stable operation.",
            "Flow passes with minimal head loss."
          ]
        },
        { type: "subtitle", text: "Automatic Closure" },
        { type: "text", text: "When the pump stops:" },
        {
          type: "list",
          items: [
            "Flow velocity decreases.",
            "Valve senses near-zero velocity condition.",
            "Disc closes before reverse flow develops.",
            "Water hammer is prevented."
          ]
        },
        { type: "subtitle", text: "Operating Advantages" },
        {
          type: "list",
          items: [
            "Non-slam operation.",
            "Elimination of reverse flow.",
            "Reduced pump damage.",
            "Improved pipeline protection."
          ]
        },
        { type: "subtitle", text: "Operating Precautions" },
        {
          type: "list",
          items: [
            "Do not manually interfere with hydraulic controls.",
            "Maintain operating pressure within rated limits.",
            "Avoid unauthorized adjustment of pilot settings.",
            "Ensure hydraulic tubing remains intact."
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
            "Verify hydraulic tubing condition.",
            "Inspect pressure gauges.",
            "Observe valve operation during pump start and stop cycles."
          ]
        },
        { type: "subtitle", text: "Quarterly Inspection" },
        {
          type: "list",
          items: [
            "Inspect pilot control valves.",
            "Check hydraulic oil or water control system.",
            "Examine fasteners and mounting components.",
            "Verify disc movement."
          ]
        },
        { type: "subtitle", text: "Annual Inspection" },
        {
          type: "list",
          items: [
            "Inspect valve internals.",
            "Examine disc and seat condition.",
            "Inspect hydraulic cylinder assembly.",
            "Check seals and gaskets.",
            "Test pilot valve functionality.",
            "Perform operational performance testing."
          ]
        },
        { type: "subtitle", text: "Recommended Spare Parts" },
        {
          type: "list",
          items: [
            "Hydraulic Cylinder Assembly",
            "Pilot Control Valve Kit",
            "Disc Assembly",
            "Seat Ring",
            "O-Rings",
            "Gaskets",
            "Pressure Gauges",
            "Hydraulic Tubing Components"
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
            ["Disc Assembly", "24 Months"],
            ["Hydraulic Cylinder", "24 Months"],
            ["Seat Ring", "12 Months"],
            ["Pilot Control Valves", "12 Months"],
            ["O-Rings & Seals", "12 Months"],
            ["Hydraulic Tubing", "12 Months"],
            ["Coating & Painting", "12 Months"]
          ]
        },
        { type: "subtitle", text: "Warranty Exclusions" },
        { type: "text", text: "Warranty does not cover:" },
        {
          type: "list",
          items: [
            "Improper installation.",
            "Incorrect pilot valve settings.",
            "Damage due to contaminated fluid.",
            "Hydraulic control system tampering.",
            "Operation beyond rated pressure limits.",
            "Unauthorized modifications.",
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
            ["Stainless Steel Disc", "20+ Years"],
            ["Stainless Steel Hydraulic Components", "15–20 Years"],
            ["Bronze Components", "15–20 Years"],
            ["EPDM Seals", "8–12 Years"],
            ["NBR Seals", "6–10 Years"]
          ]
        },
        { type: "subtitle", text: "Factors Affecting Service Life" },
        {
          type: "list",
          items: [
            "Pump Start/Stop Frequency",
            "Water Quality",
            "Pressure Fluctuations",
            "Hydraulic Control Maintenance",
            "Environmental Conditions",
            "Operating Pressure"
          ]
        },
        { type: "text", text: "Routine inspection and preventive maintenance significantly improve service life." }
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
            "Maintain hydraulic control systems.",
            "Conduct periodic inspections.",
            "Maintain operation and maintenance records.",
            "Operate within rated limits.",
            "Monitor pump shutdown performance.",
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
            "Pump Details",
            "Operating Pressure Information",
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
            "Hydraulic control condition",
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
            "Valve may be requested for detailed examination and testing."
          ]
        },
        { type: "subtitle", text: "Step 4 – Resolution" },
        { type: "text", text: "Based on technical findings, one of the following may be provided:" },
        {
          type: "list",
          items: [
            "Repair",
            "Component Replacement",
            "Hydraulic Control Adjustment",
            "Valve Replacement",
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
            "Depressurize the pipeline before maintenance.",
            "Never dismantle hydraulic components while pressurized.",
            "Wear appropriate PPE during servicing.",
            "Follow all site safety procedures.",
            "Ensure pumps are isolated before maintenance activities."
          ]
        }
      ]
    },
    {
      title: "Document Retention",
      blocks: [
        { type: "text", text: "Maintain installation records, maintenance logs, pump operation records, inspection reports, hydraulic control settings, and warranty documentation throughout the service life of the valve for operational reference and warranty support." }
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

// Update the zero-velocity-valve key
parsedObject['zero-velocity-valve'] = zeroData;

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully added Zero Velocity Valve");
