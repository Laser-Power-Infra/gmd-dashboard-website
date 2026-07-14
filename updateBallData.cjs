const fs = require('fs');

const ballData = {
  isModern: true,
  title: "MANUAL OF BALL VALVES (FLOATING & TRUNNION MOUNTED)",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
        { type: "subtitle", text: "Scope" },
        { type: "text", text: "This manual provides guidelines for the installation, operation, maintenance, inspection, warranty coverage, and service procedures for Floating Ball Valves and Trunnion Mounted Ball Valves used in industrial, water, oil & gas, chemical, and utility applications." },
        { type: "subtitle", text: "Applications" },
        { type: "text", text: "Ball Valves are quarter-turn valves designed for reliable shut-off and flow control. They are commonly used in:" },
        {
          type: "list",
          items: [
            "Water Distribution Systems",
            "Oil & Gas Pipelines",
            "Chemical Processing Plants",
            "Petrochemical Industries",
            "Power Plants",
            "HVAC Systems",
            "Fire Protection Networks",
            "Industrial Utility Services"
          ]
        },
        { type: "subtitle", text: "Types Covered" },
        { type: "subtitle", text: "Floating Ball Valve" },
        { type: "text", text: "The ball is supported by valve seats and is free to move slightly under pressure, providing tight shut-off performance." },
        { type: "subtitle", text: "Trunnion Mounted Ball Valve" },
        { type: "text", text: "The ball is mechanically anchored by trunnions and bearings, reducing operating torque and allowing use in larger sizes and higher-pressure applications." }
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
            "Inspect for transportation damage.",
            "Ensure valve bore is clean and free from foreign particles.",
            "Check smooth operation of lever, gearbox, or actuator."
          ]
        },
        { type: "subtitle", text: "Pipeline Preparation" },
        {
          type: "list",
          items: [
            "Flush pipeline thoroughly.",
            "Remove welding slag, rust, scale, and debris.",
            "Ensure proper pipe alignment.",
            "Support piping adequately."
          ]
        },
        { type: "subtitle", text: "Valve Orientation" },
        {
          type: "list",
          items: [
            "Can be installed in horizontal or vertical pipelines.",
            "Flow direction is generally bidirectional unless specified otherwise.",
            "Ensure access for operation and maintenance."
          ]
        },
        { type: "subtitle", text: "Flange Installation" },
        {
          type: "list",
          items: [
            "Use appropriate gasket material.",
            "Tighten flange bolts evenly in a cross pattern.",
            "Avoid excessive tightening force."
          ]
        },
        { type: "subtitle", text: "Installation Precautions" },
        {
          type: "list",
          items: [
            "Keep valve in fully open position during welding operations.",
            "Avoid contamination of sealing surfaces.",
            "Do not use valve as a structural support."
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
            "Rotate lever or handwheel 90° counterclockwise.",
            "Confirm full open position.",
            "Ensure smooth flow through the pipeline."
          ]
        },
        { type: "subtitle", text: "Closing Procedure" },
        {
          type: "ordered-list",
          items: [
            "Rotate lever or handwheel 90° clockwise.",
            "Confirm valve reaches full closed position.",
            "Avoid excessive force after closure."
          ]
        },
        { type: "subtitle", text: "Operating Precautions" },
        {
          type: "list",
          items: [
            "Operate slowly to prevent pressure surges.",
            "Do not use extension bars on operating handles.",
            "Operate within rated pressure and temperature limits.",
            "Avoid partially open operation unless valve is specifically designed for throttling."
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
            "Check for leakage around body joints.",
            "Verify smooth operation.",
            "Inspect handle, gearbox, or actuator.",
            "Check fasteners."
          ]
        },
        { type: "subtitle", text: "Quarterly Inspection" },
        {
          type: "list",
          items: [
            "Inspect stem seals.",
            "Check seat sealing performance.",
            "Verify coating condition.",
            "Inspect external corrosion."
          ]
        },
        { type: "subtitle", text: "Annual Inspection" },
        {
          type: "list",
          items: [
            "Inspect ball surface condition.",
            "Examine seats and sealing elements.",
            "Inspect stem assembly.",
            "Replace worn seals if necessary.",
            "Conduct pressure and leakage testing."
          ]
        },
        { type: "subtitle", text: "Recommended Spare Parts" },
        {
          type: "list",
          items: [
            "Ball Assembly",
            "Seats",
            "Stem",
            "Stem Seals",
            "O-Rings",
            "Body Gaskets",
            "Bearings (Trunnion Type)",
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
            ["Ball Assembly", "24 Months"],
            ["Trunnion Assembly", "24 Months"],
            ["Stem / Spindle", "24 Months"],
            ["Seats", "12 Months"],
            ["O-Rings & Seals", "12 Months"],
            ["Bearings", "12 Months"],
            ["Gear Operator", "12 Months"],
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
            "Chemical attack from incompatible media.",
            "Physical damage.",
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
            ["Cast Steel Body", "20-25 Years"],
            ["Stainless Steel Body", "25+ Years"],
            ["Carbon Steel Body", "20-25 Years"],
            ["Stainless Steel Ball", "20+ Years"],
            ["PTFE Seats", "10-15 Years"],
            ["RPTFE Seats", "12-18 Years"],
            ["Metal Seats", "15-20 Years"],
            ["Stem Seals", "8-12 Years"]
          ]
        },
        { type: "subtitle", text: "Factors Affecting Service Life" },
        {
          type: "list",
          items: [
            "Operating Pressure",
            "Temperature Conditions",
            "Fluid Characteristics",
            "Frequency of Operation",
            "Maintenance Practices",
            "Corrosion Exposure",
            "Seat Material Selection"
          ]
        },
        { type: "text", text: "Proper maintenance significantly extends valve service life." }
      ]
    },
    {
      title: "7. Customer Responsibilities",
      blocks: [
        { type: "text", text: "The customer shall:" },
        {
          type: "list",
          items: [
            "Ensure proper installation practices.",
            "Operate valve within specified limits.",
            "Maintain inspection and maintenance records.",
            "Conduct routine maintenance.",
            "Protect the valve from mechanical damage.",
            "Report operational issues promptly.",
            "Follow manufacturer recommendations."
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
            "Use approved lifting equipment for large valves."
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

// Update the ball-valve key
parsedObject['ball-valve'] = ballData;

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully added Ball Valve");
