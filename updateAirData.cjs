const fs = require('fs');

const airData = {
  isModern: true,
  title: "MANUAL OF AIR VALVES",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
        { type: "subtitle", text: "Scope" },
        { type: "text", text: "This manual provides guidelines for the installation, operation, maintenance, inspection, warranty coverage, and service procedures for Air Valves used in water supply, wastewater, irrigation, and industrial pipeline systems." },
        { type: "subtitle", text: "Applications" },
        { type: "text", text: "Air Valves are designed to automatically release trapped air and admit air into pipelines during filling, draining, and operation. They are commonly used in:" },
        {
          type: "list",
          items: [
            "Water Transmission Pipelines",
            "Water Distribution Networks",
            "Irrigation Systems",
            "Pumping Stations",
            "Water Treatment Plants",
            "Sewage Treatment Plants",
            "Industrial Process Pipelines",
            "Fire Protection Systems"
          ]
        },
        { type: "text", text: "Proper use of Air Valves improves system efficiency and protects pipelines from vacuum and surge conditions." }
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
            "Inspect for transportation or handling damage.",
            "Ensure float and internal mechanism move freely.",
            "Remove all protective covers and packaging materials."
          ]
        },
        { type: "subtitle", text: "Pipeline Preparation" },
        {
          type: "list",
          items: [
            "Clean and flush the pipeline before installation.",
            "Remove debris, welding slag, stones, rust, and foreign particles.",
            "Ensure proper pipeline alignment."
          ]
        },
        { type: "subtitle", text: "Recommended Installation Location" },
        { type: "text", text: "Install Air Valves at:" },
        {
          type: "list",
          items: [
            "High points of pipelines.",
            "Long rising sections.",
            "Pump discharge lines.",
            "Locations specified in hydraulic design."
          ]
        },
        { type: "subtitle", text: "Mounting Requirements" },
        {
          type: "list",
          items: [
            "Install in vertical position only.",
            "Ensure adequate clearance for maintenance access.",
            "Provide isolation valve below Air Valve for servicing.",
            "Use proper supports where necessary."
          ]
        },
        { type: "subtitle", text: "Installation Precautions" },
        {
          type: "list",
          items: [
            "Ensure valve is accessible for inspection.",
            "Avoid installation in flooded chambers without drainage.",
            "Follow flow direction markings where applicable."
          ]
        }
      ]
    },
    {
      title: "3. Operation Instructions",
      blocks: [
        { type: "subtitle", text: "Automatic Air Release" },
        { type: "text", text: "During operation:" },
        {
          type: "list",
          items: [
            "Trapped air accumulates inside the valve chamber.",
            "Float mechanism drops.",
            "Air is released automatically.",
            "Float rises and seals the orifice when water reaches the chamber."
          ]
        },
        { type: "subtitle", text: "Air Admission" },
        { type: "text", text: "During pipeline draining or vacuum conditions:" },
        {
          type: "list",
          items: [
            "Float drops.",
            "Air enters the pipeline.",
            "Vacuum formation is prevented."
          ]
        },
        { type: "subtitle", text: "Operating Precautions" },
        {
          type: "list",
          items: [
            "Do not obstruct air outlet ports.",
            "Ensure vent openings remain clean.",
            "Operate within rated pressure limits.",
            "Avoid external impacts on valve body."
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
            "Inspect vent openings.",
            "Verify proper air release operation.",
            "Check chamber cleanliness."
          ]
        },
        { type: "subtitle", text: "Quarterly Inspection" },
        {
          type: "list",
          items: [
            "Inspect float mechanism.",
            "Check sealing components.",
            "Clean accumulated deposits.",
            "Verify free movement of internal parts."
          ]
        },
        { type: "subtitle", text: "Annual Inspection" },
        {
          type: "list",
          items: [
            "Remove valve cover.",
            "Inspect float assembly.",
            "Examine sealing surfaces.",
            "Replace worn seals and gaskets.",
            "Clean internal chamber thoroughly.",
            "Conduct functional testing."
          ]
        },
        { type: "subtitle", text: "Recommended Spare Parts" },
        {
          type: "list",
          items: [
            "Float Assembly",
            "O-Rings",
            "Sealing Components",
            "Gaskets",
            "Fasteners",
            "Guide Components"
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
            ["Float Assembly", "24 Months"],
            ["Internal Guide Components", "12 Months"],
            ["O-Rings & Seals", "12 Months"],
            ["Gaskets", "12 Months"],
            ["Fasteners", "12 Months"],
            ["Coating & Painting", "12 Months"]
          ]
        },
        { type: "subtitle", text: "Warranty Exclusions" },
        { type: "text", text: "Warranty does not cover:" },
        {
          type: "list",
          items: [
            "Improper installation.",
            "Damage due to contaminated media.",
            "Physical impact or mishandling.",
            "Corrosion caused by unsuitable operating conditions.",
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
            ["Stainless Steel Float", "15-20 Years"],
            ["Stainless Steel Components", "20+ Years"],
            ["EPDM Seals", "8-12 Years"],
            ["NBR Seals", "6-10 Years"]
          ]
        },
        { type: "subtitle", text: "Factors Affecting Service Life" },
        {
          type: "list",
          items: [
            "Water Quality",
            "Pressure Conditions",
            "Frequency of Operation",
            "Environmental Conditions",
            "Maintenance Practices",
            "Corrosion Exposure"
          ]
        },
        { type: "text", text: "Regular maintenance significantly extends operational life." }
      ]
    },
    {
      title: "7. Customer Responsibilities",
      blocks: [
        { type: "text", text: "The customer shall:" },
        {
          type: "list",
          items: [
            "Ensure correct installation location.",
            "Maintain periodic inspection records.",
            "Perform scheduled maintenance.",
            "Operate within specified pressure limits.",
            "Keep air outlets unobstructed.",
            "Report defects promptly.",
            "Follow manufacturer's operating recommendations."
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
        { type: "subtitle", text: "Step 2 – Technical Review" },
        { type: "text", text: "The submitted information will be evaluated to determine:" },
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
            "Technical Recommendation"
          ]
        },
        { type: "text", text: "will be provided as per warranty terms." }
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
            "Follow plant safety procedures.",
            "Ensure isolation valve is closed before maintenance."
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

// Update the air-valve key
parsedObject['air-valve'] = airData;

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully added Air Valve");
