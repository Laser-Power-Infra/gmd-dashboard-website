const fs = require('fs');
const path = require('path');

// Read the manualsData.js file and extract the data
const content = fs.readFileSync('src/components/manualsData.js', 'utf8');
const match = content.match(/export const manualsData = ({[\s\S]+});/);

if (!match) {
  console.error("Could not find manualsData");
  process.exit(1);
}

const data = eval('(' + match[1] + ')');
const outputDir = path.join(__dirname, 'temp_manuals');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

Object.keys(data).forEach(key => {
  const manual = data[key];
  let md = `# ${manual.title}\n\n`;

  if (manual.sections) {
    manual.sections.forEach(sec => {
      md += `## ${sec.title}\n\n`;
      sec.blocks.forEach(block => {
        if (block.type === 'subtitle') {
          md += `### ${block.text}\n\n`;
        } else if (block.type === 'text') {
          md += `${block.text}\n\n`;
        } else if (block.type === 'list') {
          block.items.forEach(item => {
            md += `- ${item}\n`;
          });
          md += `\n`;
        } else if (block.type === 'ordered-list') {
          block.items.forEach((item, i) => {
            md += `${i + 1}. ${item}\n`;
          });
          md += `\n`;
        } else if (block.type === 'table') {
          const headers = block.headers.join(' | ');
          const separator = block.headers.map(() => '---').join(' | ');
          md += `| ${headers} |\n| ${separator} |\n`;
          block.rows.forEach(row => {
            const rowData = block.headers.map(h => row[h] || '').join(' | ');
            md += `| ${rowData} |\n`;
          });
          md += `\n`;
        }
      });
    });
  } else {
    // Legacy support for older manual format if any
    md += "Content available online.\n";
  }

  fs.writeFileSync(path.join(outputDir, `${key}.md`), md);
});

console.log("Markdown files generated in temp_manuals/");
