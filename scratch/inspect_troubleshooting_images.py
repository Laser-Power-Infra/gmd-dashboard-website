import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

html_path = "scratch/manual-of-sluice-valve_content.html"
content = open(html_path, 'r', encoding='utf-8').read()

# Find block 50 or occurrences of 'No flow despite valve'
pos = content.find("No flow despite valve")
if pos == -1:
    print("Not found.")
    sys.exit(1)

# Print 10000 characters around this text
start = max(0, pos - 5000)
end = min(len(content), pos + 5000)
sub = content[start:end]

comments = re.findall(r'<!--\s*(wp:pagelayer/pl.*?)\s*(.*?)\s*-->', sub, re.DOTALL)
print(f"Found {len(comments)} comment blocks near Troubleshooting Issue 4:")
for idx, (bname, bdata) in enumerate(comments):
    print(f"\nBlock #{idx}: {bname}")
    # Print keys like img, url, text etc.
    text_match = re.search(r'"text"\s*:\s*"(.*?)"', bdata)
    img_match = re.search(r'"(ele_bg_img|img|ele_img|image_img|ele_bg_img-url|url|ele_bg_img-thumbnail-url)"\s*:\s*(\d+|"[^"]+")', bdata)
    
    if text_match:
        txt = text_match.group(1).encode().decode('unicode-escape', errors='ignore')
        txt_clean = re.sub(r'<[^>]+>', '', txt).strip().replace('&nbsp;', ' ')
        print(f"  Text: {txt_clean[:200]}")
    if img_match:
        print(f"  Image attributes: {img_match.group(0)}")
        print(f"  Full: {bdata[:200]}...")
