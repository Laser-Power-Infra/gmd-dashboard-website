const fs = require('fs');
const path = require('path');

const file = 'src/components/IndustryPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const imageDir = 'public/usages_img';
const imageFiles = fs.readdirSync(imageDir);

const startIndex = content.indexOf('const industryData = [');
const endIndex = content.indexOf('];\n\nconst ValveCarouselSection');

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find industryData array");
  process.exit(1);
}

const dataString = content.substring(startIndex + 'const industryData = '.length, endIndex + 1);

let data;
try {
  data = eval('(' + dataString + ')');
} catch (e) {
  console.error("Failed to parse data:", e);
  process.exit(1);
}

// Helper to find exact/strict image
function findExactImage(valveName) {
  const normName = valveName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // 1. Direct exact match
  for (const img of imageFiles) {
    const filenameNoExt = img.split('.').slice(0, -1).join('.');
    const normImg = filenameNoExt.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (normImg === normName) {
      return img;
    }
  }

  // 2. Contains match
  for (const img of imageFiles) {
    const filenameNoExt = img.split('.').slice(0, -1).join('.');
    const normImg = filenameNoExt.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (normImg.includes(normName)) {
      return img;
    }
  }

  // 3. Specific overrides for tricky ones
  if (valveName === 'Straight Through Type') return 'DIAPHRAGM VALVES Straight.png';
  if (valveName === 'Weir Type') return '. DIAPHRAGM VALVES Weir Type img.png';
  if (valveName === 'Uni-Directional Knife Gate') return null; // Actually vacant
  
  return null;
}

data.forEach((section) => {
  section.isImageCards = true;
  section.rows = section.rows.map((row) => {
    let valveName = row.data[0];
    const matchedImg = findExactImage(valveName);
    const imagePath = matchedImg ? `/usages_img/${matchedImg}` : "";
    
    console.log(`[${matchedImg ? 'MAPPED' : 'VACANT'}] "${valveName}" -> ${matchedImg}`);

    return {
      image: imagePath,
      data: row.data
    };
  });
});

const newArrayString = JSON.stringify(data, null, 2);

const newContent = content.substring(0, startIndex) + 
                   'const industryData = ' + newArrayString + 
                   content.substring(endIndex + 1);

fs.writeFileSync(file, newContent);
console.log("Updated IndustryPage.jsx with strict exact images");
