const fs = require('fs');

const tamperData = {
  isModern: true,
  title: "MANUAL OF TAMPER PROOF AIR VALVES",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
        { type: "subtitle", text: "Scope" },
        { type: "text", text: "This manual provides guidelines for the installation, operation, maintenance, inspection, warranty coverage, and service procedures for Tamper Proof Air Valves used in water supply, distribution, and transmission systems." },
        { type: "subtitle", text: "Applications" },
        { type: "text", text: "Tamper Proof Air Valves are specially designed air release valves equipped with anti-tampering mechanisms to prevent unauthorized adjustment, interference, or removal of internal components." },
        { type: "text", text: "They are commonly used in:" },
        {
          type: "list",
          items: [
            "Municipal Water Distribution Networks",
            "Water Transmission Pipelines",
            "Irrigation Projects",
            "Water Treatment Plants",
            "Pumping Stations",
            "Industrial Water Supply Systems",
            "Smart Water Infrastructure Projects",
            "Underground Valve Chambers"
          ]
        },
        { type: "subtitle", text: "Purpose" },
        { type: "text", text: "The primary function of a Tamper Proof Air Valve is to:" },
        {
          type: "list",
          items: [
            "Release trapped air during pipeline operation.",
            "Admit air during pipeline draining or vacuum conditions.",
            "Prevent vacuum collapse.",
            "Protect pipelines from air accumulation and pressure surges.",
            "Restrict unauthorized access to valve operating mechanisms."
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
            "Inspect the valve body and tamper-proof cover for damage.",
            "Ensure float assembly moves freely.",
            "Confirm locking arrangements are intact."
          ]
        },
        { type: "subtitle", text: "Pipeline Preparation" },
        {
          type: "list",
          items: [
            "Flush the pipeline thoroughly.",
            "Remove rust, welding slag, stones, sand, and debris.",
            "Verify proper pipeline alignment."
          ]
        },
        { type: "subtitle", text: "Recommended Installation Locations" },
        { type: "text", text: "Install at:" },
        {
          type: "list",
          items: [
            "High points of pipelines.",
            "Long ascending pipeline sections.",
            "Pump discharge mains.",
            "Locations identified in hydraulic design studies."
          ]
        },
        { type: "subtitle", text: "Installation Position" },
        {
          type: "list",
          items: [
            "Install strictly in vertical position.",
            "Ensure adequate chamber space for maintenance.",
            "Maintain access to locking mechanism."
          ]
        },
        { type: "subtitle", text: "Installation Precautions" },
        {
          type: "list",
          items: [
            "Provide an isolation valve beneath the air valve.",
            "Ensure drainage arrangements are available in chambers.",
            "Protect chamber from flooding where possible."
          ]
        }
      ]
    },
    {
      title: "3. Operation Instructions",
      blocks: [
        { type: "subtitle", text: "Automatic Air Release" },
        { type: "text", text: "During pipeline filling and operation:" },
        {
          type: "list",
          items: [
            "Air accumulates inside the valve chamber.",
            "Float drops.",
            "Air is released automatically.",
            "Float rises and seals the orifice once water reaches the chamber."
          ]
        },
        { type: "subtitle", text: "Vacuum Protection" },
        { type: "text", text: "During draining or sudden pressure drops:" },
        {
          type: "list",
          items: [
            "Float lowers automatically.",
            "Air enters the pipeline.",
            "Vacuum formation is prevented."
          ]
        },
        { type: "subtitle", text: "Tamper Proof Features" },
        { type: "text", text: "The valve includes:" },
        {
          type: "list",
          items: [
            "Lockable cover system.",
            "Protected operating components.",
            "Unauthorized access prevention.",
            "Secure maintenance access arrangements."
          ]
        },
        { type: "subtitle", text: "Operating Precautions" },
        {
          type: "list",
          items: [
            "Do not bypass locking arrangements.",
            "Keep vent openings unobstructed.",
            "Operate within rated pressure limits.",
            "Avoid unauthorized modifications."
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
            "Verify chamber cleanliness.",
            "Check lock and cover integrity."
          ]
        },
        { type: "subtitle", text: "Quarterly Inspection" },
        {
          type: "list",
          items: [
            "Inspect float movement.",
            "Verify sealing performance.",
            "Clean internal chamber if required.",
            "Examine locking mechanism condition."
          ]
        },
        { type: "subtitle", text: "Annual Inspection" },
        {
          type: "list",
          items: [
            "Remove cover under authorized supervision.",
            "Inspect float assembly.",
            "Examine seals and seating surfaces.",
            "Replace worn components.",
            "Clean air passages.",
            "Conduct functional testing."
          ]
        },
        { type: "subtitle", text: "Recommended Spare Parts" },
        {
          type: "list",
          items: [
            "Float Assembly",
            "Sealing Components",
            "O-Rings",
            "Gaskets",
            "Locking Components",
            "Fasteners",
            "Guide Mechanisms"
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
            ["Float Assembly", "24 Months"],
            ["Locking Mechanism", "12 Months"],
            ["Internal Guide Components", "12 Months"],
            ["O-Rings & Seals", "12 Months"],
            ["Fasteners", "12 Months"],
            ["Coating & Painting", "12 Months"]
          ]
        },
        { type: "subtitle", text: "Warranty Exclusions" },
        { type: "text", text: "Warranty shall not cover:" },
        {
          type: "list",
          items: [
            "Unauthorized opening of tamper-proof components.",
            "Damage caused by vandalism.",
            "Improper installation.",
            "Contaminated operating conditions.",
            "Corrosion caused by unsuitable media.",
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
            ["Stainless Steel Float", "15–20 Years"],
            ["Stainless Steel Components", "20+ Years"],
            ["Brass Components", "15–20 Years"],
            ["EPDM Seals", "8–12 Years"],
            ["NBR Seals", "6–10 Years"]
          ]
        },
        { type: "subtitle", text: "Factors Affecting Service Life" },
        {
          type: "list",
          items: [
            "Water Quality",
            "Pressure Conditions",
            "Air Release Frequency",
            "Environmental Exposure",
            "Chamber Conditions",
            "Maintenance Practices"
          ]
        },
        { type: "text", text: "Regular maintenance significantly improves valve longevity." }
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
            "Maintain locking mechanisms.",
            "Conduct scheduled inspections.",
            "Keep maintenance records.",
            "Prevent unauthorized access.",
            "Maintain chamber cleanliness.",
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
            "Maintenance history",
            "Operating conditions",
            "Tamper-proof system integrity",
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
            "Never dismantle the valve under pressure.",
            "Use authorized personnel only for opening tamper-proof assemblies.",
            "Wear appropriate PPE during servicing.",
            "Follow all plant safety procedures."
          ]
        }
      ]
    },
    {
      title: "Document Retention",
      blocks: [
        { type: "text", text: "Maintain installation records, inspection reports, maintenance logs, warranty documentation, and lock access records throughout the service life of the valve for operational reference and warranty support." }
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

// Update the tamper-proof key
parsedObject['tamper-proof'] = tamperData;

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully added Tamper Proof Air Valve");
