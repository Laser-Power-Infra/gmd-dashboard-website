const fs = require('fs');

const file = 'src/components/IndustryPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const images = [
  "/valve img/ChatGPT Image Jun 16, 2026, 03_31_02 PM.png",
  "/valve img/ChatGPT Image Jun 18, 2026, 02_23_54 PM.png",
  "/valve img/ChatGPT Image Jun 9, 2026, 03_27_24 PM.png",
  "/valve img/ChatGPT Image Jun 9, 2026, 03_27_36 PM.png"
];

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

data.forEach((section, sIdx) => {
  section.isImageCards = true;
  section.rows = section.rows.map((row, rIdx) => {
    if (Array.isArray(row)) {
      return {
        image: images[(sIdx + rIdx) % images.length],
        data: row
      };
    }
    return row;
  });
});

const newArrayString = JSON.stringify(data, null, 2);

const newContent = content.substring(0, startIndex) + 
                   'const industryData = ' + newArrayString + 
                   content.substring(endIndex + 1);

fs.writeFileSync(file, newContent);
console.log("Updated IndustryPage.jsx");
