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

// Helper to find the best image
function findBestImage(valveName) {
  // Normalize string for comparison
  const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normName = normalize(valveName);
  
  let bestMatch = null;
  let bestScore = -1;

  for (const img of imageFiles) {
    const normImg = normalize(img.replace('.png', '').replace('img', '').replace('create', ''));
    
    if (normImg === normName) {
      return img; // exact match after normalization
    }
    
    // Check if one includes the other
    if (normImg.includes(normName) || normName.includes(normImg)) {
      const score = Math.max(normImg.length, normName.length) - Math.abs(normImg.length - normName.length);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = img;
      }
    }
  }
  
  return bestMatch;
}

data.forEach((section) => {
  section.isImageCards = true;
  section.rows = section.rows.map((row) => {
    // Determine the valve name
    let valveName = '';
    let rowData = [];
    
    if (Array.isArray(row)) {
      valveName = row[0];
      rowData = row;
    } else if (row.data) {
      valveName = row.data[0];
      rowData = row.data;
    }
    
    const matchedImg = findBestImage(valveName);
    const imagePath = matchedImg ? `/usages_img/${matchedImg}` : "/valve img/ChatGPT Image Jun 16, 2026, 03_31_02 PM.png";
    
    console.log(`Matched "${valveName}" -> ${matchedImg}`);

    return {
      image: imagePath,
      data: rowData
    };
  });
});

const newArrayString = JSON.stringify(data, null, 2);

const newContent = content.substring(0, startIndex) + 
                   'const industryData = ' + newArrayString + 
                   content.substring(endIndex + 1);

fs.writeFileSync(file, newContent);
console.log("Updated IndustryPage.jsx with correct images");
