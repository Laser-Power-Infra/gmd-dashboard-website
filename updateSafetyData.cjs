const fs = require('fs');

const safetyData = {
  isModern: true,
  title: "MANUAL OF PRESSURE RELIEF VALVES (SAFETY VALVES)",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
        { type: "subtitle", text: "Scope" },
        { type: "text", text: "This manual provides guidelines for the installation, operation, maintenance, inspection, warranty coverage, and service procedures for Pressure Relief Valves (Safety Valves)." },
        { type: "subtitle", text: "Applications" },
        { type: "text", text: "Pressure Relief Valves are automatic safety devices designed to protect pipelines, pressure vessels, pumps, compressors, boilers, and process equipment from excessive pressure conditions." },
        { type: "text", text: "They are commonly used in:" },
        {
          type: "list",
          items: [
            "Water Supply Systems",
            "Industrial Process Plants",
            "Boiler Systems",
            "Compressed Air Systems",
            "Fire Protection Systems",
            "Chemical Processing Plants",
            "Power Generation Facilities",
            "Oil & Gas Installations",
            "Pumping Stations"
          ]
        },
        { type: "subtitle", text: "Purpose" },
        { type: "text", text: "The primary function of a Pressure Relief Valve is to automatically release excess pressure when system pressure exceeds a predetermined set value, thereby preventing equipment damage and ensuring safe operation." }
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
            "Verify valve size, pressure rating, and set pressure.",
            "Inspect the valve for transportation damage.",
            "Ensure sealing surfaces are clean.",
            "Confirm valve certification and calibration settings."
          ]
        },
        { type: "subtitle", text: "Pipeline Preparation" },
        {
          type: "list",
          items: [
            "Flush the pipeline thoroughly before installation.",
            "Remove welding slag, rust, scale, and foreign particles.",
            "Ensure proper alignment of piping."
          ]
        },
        { type: "subtitle", text: "Installation Position" },
        {
          type: "list",
          items: [
            "Install vertically with the spindle upright unless otherwise specified.",
            "Install directly on the protected equipment or pressure vessel.",
            "Ensure unrestricted discharge piping."
          ]
        },
        { type: "subtitle", text: "Discharge Line Requirements" },
        {
          type: "list",
          items: [
            "Discharge piping shall not impose stress on the valve body.",
            "Avoid excessive back pressure.",
            "Direct discharge safely away from personnel and equipment."
          ]
        },
        { type: "subtitle", text: "Installation Precautions" },
        {
          type: "list",
          items: [
            "Never install isolation valves between the protected equipment and the safety valve unless permitted by applicable standards.",
            "Protect valve from vibration and external impacts.",
            "Maintain adequate access for inspection and testing."
          ]
        }
      ]
    },
    {
      title: "3. Operation Instructions",
      blocks: [
        { type: "subtitle", text: "Normal Operation" },
        { type: "text", text: "Under normal operating conditions:" },
        {
          type: "list",
          items: [
            "The valve remains closed.",
            "System pressure remains below the set pressure."
          ]
        },
        { type: "subtitle", text: "Relief Operation" },
        { type: "text", text: "When pressure exceeds the preset value:" },
        {
          type: "list",
          items: [
            "The valve automatically opens.",
            "Excess fluid or gas is discharged.",
            "System pressure is reduced to a safe level.",
            "The valve reseats automatically once pressure returns to normal."
          ]
        },
        { type: "subtitle", text: "Operating Precautions" },
        {
          type: "list",
          items: [
            "Never tamper with factory pressure settings.",
            "Do not obstruct the discharge outlet.",
            "Operate only within rated pressure and temperature limits.",
            "Ensure discharge piping remains unobstructed."
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
            "Inspect discharge outlet.",
            "Verify valve accessibility.",
            "Inspect for corrosion or external damage."
          ]
        },
        { type: "subtitle", text: "Quarterly Inspection" },
        {
          type: "list",
          items: [
            "Perform visual inspection of body and spring housing.",
            "Check fasteners and mounting.",
            "Verify discharge piping condition."
          ]
        },
        { type: "subtitle", text: "Annual Inspection" },
        {
          type: "list",
          items: [
            "Conduct functional testing.",
            "Inspect spring assembly.",
            "Examine seat and disc condition.",
            "Inspect spindle movement.",
            "Replace worn seals and gaskets.",
            "Verify calibration settings."
          ]
        },
        { type: "subtitle", text: "Recommended Spare Parts" },
        {
          type: "list",
          items: [
            "Disc Assembly",
            "Seat Ring",
            "Spring Assembly",
            "Spindle",
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
            ["Bonnet / Cover", "24 Months"],
            ["Disc Assembly", "24 Months"],
            ["Seat Ring", "24 Months"],
            ["Spring Assembly", "12 Months"],
            ["Spindle", "12 Months"],
            ["O-Rings & Seals", "12 Months"],
            ["Gaskets", "12 Months"],
            ["Coating & Painting", "12 Months"]
          ]
        },
        { type: "subtitle", text: "Warranty Exclusions" },
        { type: "text", text: "Warranty shall not cover:" },
        {
          type: "list",
          items: [
            "Incorrect installation.",
            "Unauthorized pressure adjustment.",
            "Corrosion caused by incompatible media.",
            "Mechanical damage.",
            "Excessive vibration.",
            "Improper discharge piping design.",
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
            ["Ductile Iron Body", "20–25 Years"],
            ["Cast Steel Body", "20–30 Years"],
            ["Stainless Steel Components", "20+ Years"],
            ["Stainless Steel Spring", "15–20 Years"],
            ["Bronze Components", "15–20 Years"],
            ["EPDM Seals", "8–12 Years"],
            ["PTFE Seals", "10–15 Years"]
          ]
        },
        { type: "subtitle", text: "Factors Affecting Service Life" },
        {
          type: "list",
          items: [
            "Operating Pressure",
            "Frequency of Relief Operations",
            "Fluid Characteristics",
            "Corrosion Exposure",
            "Temperature Conditions",
            "Maintenance Practices"
          ]
        },
        { type: "text", text: "Regular inspection and calibration significantly extend service life." }
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
            "Maintain calibration records.",
            "Conduct periodic inspections and testing.",
            "Operate within specified pressure limits.",
            "Keep discharge lines unobstructed.",
            "Maintain service documentation.",
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
            "Set Pressure Information",
            "Installation Date",
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
            "Calibration records",
            "Warranty applicability"
          ]
        },
        { type: "subtitle", text: "Step 3 – Inspection" },
        { type: "text", text: "Where necessary:" },
        {
          type: "list",
          items: [
            "Site inspection may be conducted.",
            "Valve may be requested for factory examination and testing."
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
            "Recalibration",
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
            "Never remove or dismantle the valve while the system is pressurized.",
            "Wear appropriate PPE during inspection and maintenance.",
            "Ensure safe discharge routing.",
            "Do not modify factory pressure settings without authorization.",
            "Follow all applicable safety regulations and plant procedures."
          ]
        }
      ]
    },
    {
      title: "Document Retention",
      blocks: [
        { type: "text", text: "Maintain installation records, calibration certificates, maintenance logs, inspection reports, pressure test records, and warranty documentation throughout the service life of the valve for operational reference and warranty support." }
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

// Update the safety-relief key
parsedObject['safety-relief'] = safetyData;

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully added Safety Valve");
