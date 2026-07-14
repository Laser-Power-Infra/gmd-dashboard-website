const fs = require('fs');

const nrvData = {
  isModern: true,
  title: "MANUAL OF NON-RETURN VALVES (NRV)",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
        { type: "subtitle", text: "Scope" },
        { type: "text", text: "This manual provides guidelines for the installation, operation, maintenance, inspection, warranty coverage, and service procedures for Non-Return Valves (NRV)." },
        { type: "subtitle", text: "Applications" },
        { type: "text", text: "Non-Return Valves are automatic valves designed to allow fluid flow in one direction while preventing reverse flow. They are commonly used in:" },
        {
          type: "list",
          items: [
            "Water Distribution Systems",
            "Pumping Stations",
            "Water Treatment Plants",
            "Sewage Treatment Plants",
            "Irrigation Systems",
            "Industrial Pipelines",
            "Fire Fighting Networks",
            "HVAC Systems",
            "Power Plants"
          ]
        },
        { type: "text", text: "NRVs protect pumps, pipelines, and equipment from damage caused by backflow and pressure reversals." }
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
            "Inspect valve for transportation or handling damage.",
            "Check internal moving components for free movement.",
            "Confirm flow direction marked on the valve body."
          ]
        },
        { type: "subtitle", text: "Pipeline Preparation" },
        {
          type: "list",
          items: [
            "Thoroughly clean and flush the pipeline.",
            "Remove rust, welding slag, stones, and foreign materials.",
            "Ensure proper pipe alignment.",
            "Avoid excessive stress on the valve body."
          ]
        },
        { type: "subtitle", text: "Installation Position" },
        { type: "subtitle", text: "Horizontal Installation" },
        {
          type: "list",
          items: [
            "Preferred installation method.",
            "Ensure valve cover is positioned upward."
          ]
        },
        { type: "subtitle", text: "Vertical Installation" },
        {
          type: "list",
          items: [
            "Allowed only for upward flow direction.",
            "Confirm compatibility with valve design."
          ]
        },
        { type: "subtitle", text: "Flange Installation" },
        {
          type: "list",
          items: [
            "Use suitable gasket material.",
            "Tighten bolts evenly in cross sequence.",
            "Avoid excessive bolt torque."
          ]
        },
        { type: "subtitle", text: "Installation Precautions" },
        {
          type: "list",
          items: [
            "Ensure sufficient straight pipe lengths where possible.",
            "Do not install against the indicated flow direction.",
            "Provide proper pipeline supports."
          ]
        }
      ]
    },
    {
      title: "3. Operation Instructions",
      blocks: [
        { type: "subtitle", text: "Automatic Operation" },
        { type: "text", text: "Non-Return Valves operate automatically:" },
        {
          type: "list",
          items: [
            "Forward flow opens the valve.",
            "Reverse flow closes the valve automatically.",
            "No manual operation is required."
          ]
        },
        { type: "subtitle", text: "Operating Precautions" },
        {
          type: "list",
          items: [
            "Never force valve movement manually.",
            "Operate within rated pressure and temperature limits.",
            "Avoid severe pressure surges.",
            "Ensure correct installation orientation."
          ]
        },
        { type: "subtitle", text: "Startup Procedure" },
        {
          type: "ordered-list",
          items: [
            "Verify installation direction.",
            "Gradually introduce system pressure.",
            "Observe valve operation.",
            "Check for leakage and unusual noise.",
            "Verify proper closure during flow stoppage."
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
            "Inspect for external leakage.",
            "Check flange joints.",
            "Listen for abnormal vibration or chatter.",
            "Verify system performance."
          ]
        },
        { type: "subtitle", text: "Quarterly Inspection" },
        {
          type: "list",
          items: [
            "Inspect body coating condition.",
            "Check moving components.",
            "Examine seat condition where accessible.",
            "Verify proper backflow prevention."
          ]
        },
        { type: "subtitle", text: "Annual Inspection" },
        {
          type: "list",
          items: [
            "Remove valve for internal inspection if required.",
            "Inspect disc and seat surfaces.",
            "Examine hinge pin and bushings.",
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
            "Hinge Pins",
            "Springs (where applicable)",
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
            ["Spring Assembly", "12 Months"],
            ["Seat Rings", "12 Months"],
            ["Bushings", "12 Months"],
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
            "Reverse installation.",
            "Operation beyond rated limits.",
            "Water hammer damage.",
            "Corrosion from unsuitable media.",
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
            "Water Quality",
            "Pressure Variations",
            "Water Hammer Frequency",
            "Operating Conditions",
            "Maintenance Practices",
            "Environmental Exposure"
          ]
        },
        { type: "text", text: "Proper maintenance can significantly extend valve service life." }
      ]
    },
    {
      title: "7. Customer Responsibilities",
      blocks: [
        { type: "text", text: "The customer shall:" },
        {
          type: "list",
          items: [
            "Ensure correct installation practices.",
            "Maintain maintenance and inspection records.",
            "Operate within rated conditions.",
            "Conduct regular inspections.",
            "Protect the valve from external damage.",
            "Promptly report operational abnormalities.",
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
            "Photographs of the Issue"
          ]
        },
        { type: "subtitle", text: "Step 2 – Technical Review" },
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
            "Technical Recommendation"
          ]
        },
        { type: "text", text: "will be provided in accordance with warranty terms." }
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
            "Wear appropriate personal protective equipment (PPE).",
            "Use approved lifting methods for large valves.",
            "Follow all plant safety procedures."
          ]
        }
      ]
    },
    {
      title: "Document Retention",
      blocks: [
        { type: "text", text: "Maintain installation records, maintenance logs, inspection reports, and warranty documentation throughout the valve's service life for warranty and operational reference." }
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

// Update the non-return key
parsedObject['non-return'] = nrvData;

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully added NRV");
