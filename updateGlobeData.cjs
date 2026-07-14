const fs = require('fs');

const globeData = {
  isModern: true,
  title: "MANUAL OF GLOBE VALVES",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
        { type: "subtitle", text: "Scope" },
        { type: "text", text: "This manual provides guidelines for the installation, operation, maintenance, inspection, warranty coverage, and service procedures for Globe Valves used in water supply, industrial, steam, chemical, and utility applications." },
        { type: "subtitle", text: "Applications" },
        { type: "text", text: "Globe Valves are designed for flow regulation, throttling, and isolation of fluids. They are commonly used in:" },
        {
          type: "list",
          items: [
            "Water Treatment Plants",
            "Steam Distribution Systems",
            "Industrial Process Pipelines",
            "Chemical Processing Plants",
            "Power Generation Facilities",
            "HVAC Systems",
            "Oil & Gas Installations",
            "Utility Services"
          ]
        },
        { type: "text", text: "Unlike gate valves, Globe Valves are specifically designed for accurate flow control and throttling operations." }
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
            "Verify valve size, pressure rating, and material compatibility.",
            "Inspect the valve for transportation damage.",
            "Check seating surfaces and stem movement.",
            "Ensure valve internals are clean and free from foreign particles."
          ]
        },
        { type: "subtitle", text: "Pipeline Preparation" },
        {
          type: "list",
          items: [
            "Thoroughly clean and flush the pipeline.",
            "Remove welding slag, rust, scale, and debris.",
            "Ensure proper pipeline alignment.",
            "Provide adequate support for the pipeline."
          ]
        },
        { type: "subtitle", text: "Flow Direction" },
        {
          type: "list",
          items: [
            "Install according to the flow direction arrow marked on the valve body.",
            "Proper flow direction ensures optimum sealing performance and service life."
          ]
        },
        { type: "subtitle", text: "Valve Orientation" },
        {
          type: "list",
          items: [
            "Horizontal or vertical installation is acceptable.",
            "Prefer vertical stem orientation whenever possible.",
            "Ensure adequate clearance for handwheel operation and maintenance access."
          ]
        },
        { type: "subtitle", text: "Flange Installation" },
        {
          type: "list",
          items: [
            "Use suitable gasket material.",
            "Tighten flange bolts evenly using a cross pattern.",
            "Avoid excessive bolt torque."
          ]
        },
        { type: "subtitle", text: "Installation Precautions" },
        {
          type: "list",
          items: [
            "Do not use the handwheel for lifting.",
            "Avoid excessive pipeline stresses on the valve body.",
            "Ensure valve is partially open during installation where practical."
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
            "Rotate handwheel counterclockwise.",
            "Open gradually to avoid sudden pressure changes.",
            "Stop when desired flow rate is achieved.",
            "For full open operation, avoid excessive force."
          ]
        },
        { type: "subtitle", text: "Closing Procedure" },
        {
          type: "ordered-list",
          items: [
            "Rotate handwheel clockwise.",
            "Close gradually.",
            "Ensure disc is properly seated.",
            "Do not over-tighten the handwheel."
          ]
        },
        { type: "subtitle", text: "Throttling Operation" },
        { type: "text", text: "Globe Valves are specifically designed for:" },
        {
          type: "list",
          items: [
            "Flow regulation",
            "Pressure control",
            "Throttling service",
            "Partial opening operation"
          ]
        },
        { type: "subtitle", text: "Operating Precautions" },
        {
          type: "list",
          items: [
            "Operate within rated pressure and temperature limits.",
            "Avoid excessive operating force.",
            "Do not use extension bars on handwheels.",
            "Prevent rapid opening and closing."
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
            "Inspect gland packing.",
            "Verify smooth handwheel operation.",
            "Check flange joints."
          ]
        },
        { type: "subtitle", text: "Quarterly Inspection" },
        {
          type: "list",
          items: [
            "Lubricate stem threads.",
            "Inspect packing condition.",
            "Examine handwheel and operating mechanism.",
            "Check body coating condition."
          ]
        },
        { type: "subtitle", text: "Annual Inspection" },
        {
          type: "list",
          items: [
            "Inspect disc and seat surfaces.",
            "Examine stem wear.",
            "Replace packing if necessary.",
            "Inspect bonnet gasket.",
            "Conduct pressure testing."
          ]
        },
        { type: "subtitle", text: "Recommended Spare Parts" },
        {
          type: "list",
          items: [
            "Disc Assembly",
            "Seat Ring",
            "Stem / Spindle",
            "Packing Set",
            "O-Rings",
            "Bonnet Gasket",
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
            ["Bonnet", "24 Months"],
            ["Disc Assembly", "24 Months"],
            ["Seat Ring", "24 Months"],
            ["Stem / Spindle", "24 Months"],
            ["Handwheel", "12 Months"],
            ["Packing Assembly", "12 Months"],
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
            "Operation beyond rated pressure or temperature.",
            "Corrosion due to incompatible media.",
            "Mechanical damage.",
            "Unauthorized modifications.",
            "Excessive operating force.",
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
            ["Cast Steel Body", "20-25 Years"],
            ["Stainless Steel Components", "20+ Years"],
            ["Bronze Seat & Disc Components", "15-20 Years"],
            ["EPDM Seals", "8-12 Years"],
            ["PTFE Seals", "10-15 Years"]
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
            "Throttling Service Conditions",
            "Maintenance Practices",
            "Environmental Exposure"
          ]
        },
        { type: "text", text: "Regular maintenance significantly increases service life." }
      ]
    },
    {
      title: "7. Customer Responsibilities",
      blocks: [
        { type: "text", text: "The customer shall:" },
        {
          type: "list",
          items: [
            "Ensure correct installation.",
            "Operate within rated service conditions.",
            "Maintain inspection and maintenance records.",
            "Conduct periodic maintenance.",
            "Protect the valve from physical damage.",
            "Report operational abnormalities promptly.",
            "Follow recommended operating practices."
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
        { type: "subtitle", text: "Step 2 – Technical Assessment" },
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
            "Valve may be requested for factory examination."
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
            "Use approved lifting methods for large valves.",
            "Follow plant safety procedures."
          ]
        }
      ]
    },
    {
      title: "Document Retention",
      blocks: [
        { type: "text", text: "Maintain installation records, maintenance logs, inspection reports, and warranty documentation throughout the service life of the valve for operational reference and warranty support." }
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

// Update the globe-valve key
parsedObject['globe-valve'] = globeData;

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully added Globe Valve");
