const fs = require('fs');

const footData = {
  isModern: true,
  title: "MANUAL OF FOOT VALVES (WITH STRAINER)",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
        { type: "subtitle", text: "Scope" },
        { type: "text", text: "This manual provides guidelines for the installation, operation, maintenance, inspection, warranty coverage, and service procedures for Foot Valves with Strainers used in water supply, irrigation, pumping, and industrial applications." },
        { type: "subtitle", text: "Applications" },
        { type: "text", text: "Foot Valves are non-return valves installed at the suction end of pumps to maintain pump priming and prevent reverse flow when the pump stops." },
        { type: "text", text: "They are commonly used in:" },
        {
          type: "list",
          items: [
            "Water Supply Systems",
            "Irrigation Projects",
            "Borewell Installations",
            "River Water Intake Systems",
            "Pumping Stations",
            "Industrial Water Transfer Systems",
            "Agricultural Applications",
            "Groundwater Extraction Systems"
          ]
        },
        { type: "subtitle", text: "Purpose" },
        { type: "text", text: "The Foot Valve allows water to flow into the suction pipeline while preventing backflow. The integrated strainer prevents debris, stones, leaves, and foreign particles from entering the pump system." }
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
            "Inspect the valve and strainer for transportation damage.",
            "Check the flap/disc movement for smooth operation.",
            "Ensure the strainer openings are clean and unobstructed."
          ]
        },
        { type: "subtitle", text: "Suction Line Preparation" },
        {
          type: "list",
          items: [
            "Clean the suction pipe thoroughly.",
            "Ensure all pipe joints are leak-proof.",
            "Verify proper alignment of the suction line.",
            "Remove foreign particles before installation."
          ]
        },
        { type: "subtitle", text: "Installation Position" },
        {
          type: "list",
          items: [
            "Install vertically at the bottom of the suction pipeline.",
            "Ensure the flow direction arrow points toward the pump.",
            "Maintain sufficient clearance between the valve and the tank floor or well bottom."
          ]
        },
        { type: "subtitle", text: "Recommended Clearance" },
        {
          type: "list",
          items: [
            "Minimum clearance from bottom surface: 300 mm to 500 mm.",
            "Avoid direct contact with mud, sand, or sediment deposits."
          ]
        },
        { type: "subtitle", text: "Installation Precautions" },
        {
          type: "list",
          items: [
            "Ensure the valve remains fully submerged during operation.",
            "Provide proper support to the suction pipeline.",
            "Prevent vibration and excessive mechanical loading."
          ]
        }
      ]
    },
    {
      title: "3. Operation Instructions",
      blocks: [
        { type: "subtitle", text: "Initial Startup" },
        {
          type: "ordered-list",
          items: [
            "Fill the suction line with water (priming).",
            "Verify Foot Valve is submerged.",
            "Start the pump gradually.",
            "Observe suction pressure and flow conditions.",
            "Confirm stable operation."
          ]
        },
        { type: "subtitle", text: "Normal Operation" },
        { type: "text", text: "During operation:" },
        {
          type: "list",
          items: [
            "Water enters through the strainer.",
            "Valve opens under suction pressure.",
            "Pump receives uninterrupted water supply.",
            "When the pump stops, the valve automatically closes and retains water in the suction line."
          ]
        },
        { type: "subtitle", text: "Operating Precautions" },
        {
          type: "list",
          items: [
            "Never operate with insufficient submergence.",
            "Avoid running the pump dry.",
            "Ensure strainer openings remain free from blockage.",
            "Operate within rated pressure and temperature limits."
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
            "Inspect for leakage.",
            "Check suction performance.",
            "Verify proper valve seating.",
            "Observe pump priming efficiency."
          ]
        },
        { type: "subtitle", text: "Quarterly Inspection" },
        {
          type: "list",
          items: [
            "Clean strainer screen.",
            "Remove accumulated debris.",
            "Check flap/disc movement.",
            "Inspect hinge mechanism."
          ]
        },
        { type: "subtitle", text: "Annual Inspection" },
        {
          type: "list",
          items: [
            "Remove Foot Valve for detailed inspection.",
            "Examine disc and seat condition.",
            "Inspect hinge pin and moving parts.",
            "Replace worn seals or gaskets.",
            "Clean strainer thoroughly.",
            "Perform functional testing."
          ]
        },
        { type: "subtitle", text: "Recommended Spare Parts" },
        {
          type: "list",
          items: [
            "Disc Assembly",
            "Seat Ring",
            "Hinge Pin",
            "Strainer Screen",
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
            ["Strainer Body", "24 Months"],
            ["Disc / Flap Assembly", "24 Months"],
            ["Hinge Pin", "24 Months"],
            ["Seat Ring", "12 Months"],
            ["Strainer Screen", "12 Months"],
            ["O-Rings & Seals", "12 Months"],
            ["Coating & Painting", "12 Months"]
          ]
        },
        { type: "subtitle", text: "Warranty Exclusions" },
        { type: "text", text: "Warranty does not cover:" },
        {
          type: "list",
          items: [
            "Installation in contaminated or abrasive environments.",
            "Damage caused by dry running pumps.",
            "Improper installation.",
            "Excessive sediment accumulation.",
            "Mechanical damage during handling.",
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
            ["Stainless Steel Strainer", "15–20 Years"],
            ["Stainless Steel Components", "20+ Years"],
            ["Bronze Components", "15–20 Years"],
            ["EPDM Seals", "8–12 Years"],
            ["NBR Seals", "6–10 Years"]
          ]
        },
        { type: "subtitle", text: "Factors Affecting Service Life" },
        {
          type: "list",
          items: [
            "Water Quality",
            "Sediment Content",
            "Pump Operating Cycles",
            "Maintenance Practices",
            "Corrosion Exposure",
            "Environmental Conditions"
          ]
        },
        { type: "text", text: "Regular cleaning and maintenance significantly improve service life." }
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
            "Maintain adequate submergence levels.",
            "Clean strainers periodically.",
            "Maintain pump and suction system records.",
            "Operate within rated limits.",
            "Conduct routine inspections.",
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
            "Valve may be requested for factory examination."
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
            "Isolate and depressurize the system before maintenance.",
            "Never remove the valve while the pump is operating.",
            "Wear appropriate PPE during servicing.",
            "Follow all site safety regulations.",
            "Use approved lifting methods for large-size valves."
          ]
        }
      ]
    },
    {
      title: "Document Retention",
      blocks: [
        { type: "text", text: "Maintain installation records, maintenance logs, inspection reports, pump performance records, and warranty documentation throughout the service life of the Foot Valve for future reference and warranty support." }
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

// Update the foot-valve key
parsedObject['foot-valve'] = footData;

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully added Foot Valve");
