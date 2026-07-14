const fs = require('fs');

const strainerData = {
  isModern: true,
  title: "MANUAL OF Y STRAINERS",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
        { type: "subtitle", text: "Scope" },
        { type: "text", text: "This manual provides guidelines for the installation, operation, maintenance, inspection, warranty coverage, and service procedures for Y Strainers used in water, steam, air, gas, chemical, and industrial piping systems." },
        { type: "subtitle", text: "Applications" },
        { type: "text", text: "Y Strainers are mechanical filtration devices designed to remove unwanted solids and debris from flowing fluids, thereby protecting downstream equipment." },
        { type: "text", text: "They are commonly used in:" },
        {
          type: "list",
          items: [
            "Water Supply Systems",
            "Water Treatment Plants",
            "Pumping Stations",
            "Steam Distribution Systems",
            "HVAC Systems",
            "Chemical Processing Plants",
            "Oil & Gas Facilities",
            "Industrial Process Pipelines"
          ]
        },
        { type: "subtitle", text: "Purpose" },
        { type: "text", text: "The primary function of a Y Strainer is to prevent damage to:" },
        {
          type: "list",
          items: [
            "Pumps",
            "Control Valves",
            "Pressure Reducing Valves",
            "Flow Meters",
            "Steam Traps",
            "Heat Exchangers",
            "Nozzles and Sprinklers"
          ]
        },
        { type: "text", text: "by filtering rust, scale, welding slag, sand, and other foreign particles from the pipeline." }
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
            "Verify strainer size, pressure rating, and material specifications.",
            "Inspect body, cover, and screen for transportation damage.",
            "Ensure the strainer basket/screen is clean and properly installed.",
            "Check sealing surfaces and gaskets."
          ]
        },
        { type: "subtitle", text: "Pipeline Preparation" },
        {
          type: "list",
          items: [
            "Flush the pipeline before installation.",
            "Remove large debris and construction residue.",
            "Ensure proper pipe alignment.",
            "Provide adequate pipeline support."
          ]
        },
        { type: "subtitle", text: "Installation Position" },
        { type: "subtitle", text: "Horizontal Pipeline" },
        {
          type: "list",
          items: [
            "Preferred installation method.",
            "Install with screen pocket facing downward."
          ]
        },
        { type: "subtitle", text: "Vertical Pipeline" },
        {
          type: "list",
          items: [
            "Allowed only when flow direction is downward.",
            "Ensure proper screen accessibility."
          ]
        },
        { type: "subtitle", text: "Flow Direction" },
        {
          type: "list",
          items: [
            "Install according to the flow direction arrow marked on the body.",
            "Incorrect installation may reduce filtration efficiency."
          ]
        },
        { type: "subtitle", text: "Installation Precautions" },
        {
          type: "list",
          items: [
            "Ensure sufficient clearance for screen removal and maintenance.",
            "Install isolation valves upstream and downstream where possible.",
            "Avoid excessive stress on the strainer body."
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
            "Verify correct installation orientation.",
            "Slowly introduce system pressure.",
            "Check for leakage.",
            "Monitor pressure drop across the strainer.",
            "Verify proper flow through the system."
          ]
        },
        { type: "subtitle", text: "Normal Operation" },
        { type: "text", text: "During operation:" },
        {
          type: "list",
          items: [
            "Fluid flows through the screen.",
            "Debris is trapped inside the strainer chamber.",
            "Clean fluid continues downstream."
          ]
        },
        { type: "subtitle", text: "Operating Precautions" },
        {
          type: "list",
          items: [
            "Monitor differential pressure regularly.",
            "Clean screen when pressure drop increases significantly.",
            "Do not operate beyond rated pressure and temperature limits.",
            "Avoid prolonged operation with clogged screens."
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
            "Inspect body and cover condition.",
            "Monitor pressure drop across the strainer."
          ]
        },
        { type: "subtitle", text: "Quarterly Inspection" },
        {
          type: "list",
          items: [
            "Remove and clean screen.",
            "Inspect screen for damage.",
            "Check gasket condition.",
            "Inspect fasteners."
          ]
        },
        { type: "subtitle", text: "Annual Inspection" },
        {
          type: "list",
          items: [
            "Conduct detailed internal inspection.",
            "Replace damaged screens.",
            "Inspect cover and body sealing surfaces.",
            "Replace worn gaskets and seals.",
            "Perform pressure testing if required."
          ]
        },
        { type: "subtitle", text: "Screen Cleaning Procedure" },
        {
          type: "ordered-list",
          items: [
            "Isolate the strainer.",
            "Depressurize the pipeline.",
            "Remove cover carefully.",
            "Remove strainer screen.",
            "Clean using water, air, or suitable cleaning solution.",
            "Reinstall screen and cover.",
            "Restore system pressure gradually."
          ]
        },
        { type: "subtitle", text: "Recommended Spare Parts" },
        {
          type: "list",
          items: [
            "Strainer Screen",
            "Cover Gasket",
            "O-Rings",
            "Fasteners",
            "Drain Plug",
            "Cover Assembly Components"
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
            ["Strainer Body", "24 Months"],
            ["Cover Assembly", "24 Months"],
            ["Screen Housing", "24 Months"],
            ["Stainless Steel Screen", "12 Months"],
            ["Drain Plug", "12 Months"],
            ["O-Rings & Gaskets", "12 Months"],
            ["Fasteners", "12 Months"],
            ["Coating & Painting", "12 Months"]
          ]
        },
        { type: "subtitle", text: "Warranty Exclusions" },
        { type: "text", text: "Warranty shall not cover:" },
        {
          type: "list",
          items: [
            "Damage caused by clogged screens.",
            "Improper installation.",
            "Corrosion due to incompatible media.",
            "Mechanical damage during maintenance.",
            "Operation beyond rated conditions.",
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
            ["Cast Steel Body", "20–25 Years"],
            ["Stainless Steel Body", "25+ Years"],
            ["Stainless Steel Screen", "10–15 Years"],
            ["EPDM Gaskets", "8–12 Years"],
            ["PTFE Gaskets", "10–15 Years"]
          ]
        },
        { type: "subtitle", text: "Factors Affecting Service Life" },
        {
          type: "list",
          items: [
            "Fluid Cleanliness",
            "Pressure Conditions",
            "Temperature Conditions",
            "Maintenance Frequency",
            "Corrosion Exposure",
            "Operating Environment"
          ]
        },
        { type: "text", text: "Routine cleaning significantly extends screen and strainer life." }
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
            "Monitor differential pressure.",
            "Clean screens regularly.",
            "Maintain inspection and maintenance records.",
            "Operate within specified pressure and temperature limits.",
            "Replace damaged screens promptly.",
            "Report abnormalities immediately."
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
            "Strainer Identification Details",
            "Installation Date",
            "Service Conditions",
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
            "Strainer may be requested for factory examination."
          ]
        },
        { type: "subtitle", text: "Step 4 – Resolution" },
        { type: "text", text: "Based on technical findings, one of the following may be provided:" },
        {
          type: "list",
          items: [
            "Repair",
            "Component Replacement",
            "Strainer Replacement",
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
            "Never remove the cover while the system is under pressure.",
            "Wear appropriate PPE during cleaning and inspection.",
            "Follow plant safety procedures.",
            "Use suitable lifting equipment for large-size strainers."
          ]
        }
      ]
    },
    {
      title: "Document Retention",
      blocks: [
        { type: "text", text: "Maintain installation records, maintenance logs, cleaning schedules, inspection reports, and warranty documentation throughout the service life of the Y Strainer for operational reference and warranty support." }
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

// Update the y-strainer key
parsedObject['y-strainer'] = strainerData;

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully added Y Strainer");
