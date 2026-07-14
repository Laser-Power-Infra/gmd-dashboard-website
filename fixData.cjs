const fs = require('fs');

const sluiceData = {
  isModern: true,
  title: "MANUAL OF SLUICE VALVES",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
        { type: "subtitle", text: "Scope" },
        { type: "text", text: "This manual provides guidelines for the installation, operation, maintenance, inspection, warranty coverage, and service procedures for Sluice Valves manufactured and supplied by GM Dalui & Sons." },
        { type: "subtitle", text: "Applications" },
        { type: "text", text: "Sluice Valves are primarily designed for isolation purposes and are widely used in:" },
        {
          type: "list",
          items: [
            "Water Supply Systems",
            "Municipal Water Distribution Networks",
            "Irrigation Projects",
            "Water Treatment Plants",
            "Sewage Treatment Plants",
            "Pumping Stations",
            "Industrial Pipelines",
            "Fire Protection Networks"
          ]
        },
        { type: "text", text: "These valves are suitable for full open or full close service and should not generally be used for throttling applications." }
      ]
    },
    {
      title: "2. Installation Guidelines",
      blocks: [
        { type: "subtitle", text: "Pre-Installation Checks" },
        { type: "text", text: "Before installation:" },
        {
          type: "list",
          items: [
            "Verify valve size, pressure class, and material specifications.",
            "Inspect valve for transportation damage.",
            "Ensure valve bore is clean and free from foreign particles.",
            "Remove protective covers from flange faces.",
            "Confirm flow direction requirements, if applicable."
          ]
        },
        { type: "subtitle", text: "Pipeline Preparation" },
        {
          type: "list",
          items: [
            "Flush pipeline before installation.",
            "Remove welding slag, stones, rust, and debris.",
            "Ensure pipe alignment is accurate.",
            "Avoid excessive pipe stress on valve body."
          ]
        },
        { type: "subtitle", text: "Valve Orientation" },
        { type: "text", text: "Recommended installation positions:" },
        {
          type: "list",
          items: [
            "Vertical spindle position preferred.",
            "Horizontal spindle position acceptable.",
            "Ensure sufficient clearance for handwheel operation and maintenance access."
          ]
        },
        { type: "subtitle", text: "Flange Bolting" },
        {
          type: "list",
          items: [
            "Use approved gaskets.",
            "Tighten bolts in a diagonal sequence.",
            "Apply uniform torque.",
            "Avoid over-tightening."
          ]
        },
        { type: "subtitle", text: "Installation Precautions" },
        {
          type: "list",
          items: [
            "Valve should be partially open during installation.",
            "Never lift valve using handwheel, gearbox, or actuator.",
            "Use proper lifting equipment for large diameter valves."
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
            "Open valve gradually.",
            "Continue operation until full open position is reached.",
            "Avoid excessive force once fully opened."
          ]
        },
        { type: "subtitle", text: "Closing Procedure" },
        {
          type: "ordered-list",
          items: [
            "Rotate handwheel clockwise.",
            "Close valve gradually.",
            "Ensure wedge is fully seated.",
            "Do not use additional tools or extension bars."
          ]
        },
        { type: "subtitle", text: "Operating Precautions" },
        {
          type: "list",
          items: [
            "Operate valve slowly to prevent hydraulic shock.",
            "Do not use valve for flow regulation.",
            "Avoid excessive torque.",
            "Operate within specified pressure and temperature limits."
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
            "Inspect gland packing condition.",
            "Verify smooth handwheel operation.",
            "Check fasteners and mounting hardware."
          ]
        },
        { type: "subtitle", text: "Quarterly Inspection" },
        {
          type: "list",
          items: [
            "Inspect stem lubrication.",
            "Check gland bolts and packing adjustment.",
            "Examine gearbox operation where applicable.",
            "Verify coating condition."
          ]
        },
        { type: "subtitle", text: "Annual Inspection" },
        {
          type: "list",
          items: [
            "Inspect wedge and seating surfaces.",
            "Examine stem threads.",
            "Replace worn packing if necessary.",
            "Inspect seals and gaskets.",
            "Perform pressure and leakage testing."
          ]
        },
        { type: "subtitle", text: "Recommended Spare Parts" },
        {
          type: "list",
          items: [
            "Stem Packing",
            "O-Rings",
            "Gland Components",
            "Fasteners",
            "Gearbox Parts",
            "Stem Nut",
            "Wedge Guide Components"
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
            ["Wedge / Gate", "24 Months"],
            ["Stem / Spindle", "24 Months"],
            ["Stem Nut", "12 Months"],
            ["Packing Assembly", "12 Months"],
            ["O-Rings & Seals", "12 Months"],
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
            "Operation beyond rated conditions.",
            "Use for throttling service.",
            "Mechanical damage during handling.",
            "Corrosion due to unsuitable media.",
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
            ["Stainless Steel Stem", "20+ Years"],
            ["Bronze Stem Nut", "15-20 Years"],
            ["EPDM Seals", "8-12 Years"],
            ["NBR Seals", "6-10 Years"]
          ]
        },
        { type: "subtitle", text: "Factors Affecting Service Life" },
        {
          type: "list",
          items: [
            "Operating Pressure",
            "Water Quality",
            "Frequency of Operation",
            "Maintenance Practices",
            "Environmental Conditions",
            "Corrosion Exposure"
          ]
        },
        { type: "text", text: "Proper preventive maintenance can significantly extend valve service life." }
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
            "Maintain inspection and maintenance records.",
            "Operate valve within rated limits.",
            "Conduct periodic maintenance.",
            "Protect valve from external damage.",
            "Report defects promptly.",
            "Follow manufacturer recommendations."
          ]
        },
        { type: "text", text: "Failure to comply may affect warranty eligibility." }
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
            "Valve Serial Number",
            "Installation Date",
            "Photographs of Defect",
            "Description of Failure"
          ]
        },
        { type: "subtitle", text: "Step 2 – Technical Review" },
        { type: "text", text: "GM Dalui & Sons will:" },
        {
          type: "list",
          items: [
            "Review submitted documents.",
            "Evaluate installation and operating conditions.",
            "Determine warranty applicability."
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
        { type: "text", text: "Depending on findings:" },
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
            "Depressurize pipeline before maintenance.",
            "Wear appropriate PPE during inspection and repair.",
            "Never dismantle valve under pressure.",
            "Follow plant safety procedures.",
            "Use approved lifting equipment for large valves."
          ]
        }
      ]
    },
    {
      title: "Contact Information",
      blocks: [
        { type: "subtitle", text: "GM Dalui & Sons" },
        { type: "text", text: "Email: info@gmdalui.co.in" },
        { type: "text", text: "Service Support: support@gmdalui.co.in" },
        { type: "text", text: "Website: www.gmdalui.com" },
        { type: "text", text: "For technical assistance, spare parts, warranty claims, or maintenance support, contact our service department." }
      ]
    }
  ]
};

const content = fs.readFileSync('src/components/manualsData.js', 'utf8');

// The file format is export const manualsData = { ... }
// Since there's duplicate keys, we can't easily JSON.parse directly if it's invalid JS, 
// but wait! The JS engine parses duplicate keys by taking the LAST one.
// Let's use eval to parse the object, update the key, and write it back.

const jsCode = content.replace('export const manualsData = ', 'return ');
let parsedObject;
try {
  parsedObject = new Function(jsCode)();
} catch (e) {
  console.log("Error parsing:", e);
  process.exit(1);
}

// Update the sluice-valve key
parsedObject['sluice-valve'] = sluiceData;

// Write it back
const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Success fully replaced");
