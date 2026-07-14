import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

html_path = "scratch/manual-of-sluice-valve_content.html"
try:
    content = open(html_path, 'r', encoding='utf-8').read()
    print("File read successfully.")
except Exception as e:
    print("Error reading file:", e)
    sys.exit(1)

# Let's search for image sources in the file:
# E.g. "ele_bg_img":523 or attachment urls or standard img tags
# Since we have comment blocks from pagelayer, let's extract them
comments = re.findall(r'<!--\s*(wp:pagelayer/pl.*?)\s*(.*?)\s*-->', content, re.DOTALL)
print(f"Found {len(comments)} pagelayer comment blocks.")

for idx, (bname, bdata) in enumerate(comments):
    # Check for image urls
    img_match = re.search(r'"(ele_bg_img-url|img-url|url|ele_bg_img|id-thumbnail-url)"\s*:\s*"(.*?)"', bdata)
    text_match = re.search(r'"text"\s*:\s*"(.*?)"', bdata)
    
    if img_match or text_match:
        print(f"\nBlock #{idx}: {bname}")
        if text_match:
            txt = text_match.group(1).encode().decode('unicode-escape', errors='ignore')
            txt_clean = re.sub(r'<[^>]+>', '', txt).strip().replace('&nbsp;', ' ')
            if txt_clean:
                print(f"  Text: {txt_clean[:200]}")
        if img_match:
            print(f"  Image match: {img_match.group(0)}")
            # print surrounding data
            print(f"  Data: {bdata[:300]}")
            
# Also let's search for any raw img tags in the HTML
raw_imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
print(f"\nFound {len(raw_imgs)} raw HTML img tags:")
for i, r_img in enumerate(raw_imgs):
    print(f"  {i}: {r_img}")
