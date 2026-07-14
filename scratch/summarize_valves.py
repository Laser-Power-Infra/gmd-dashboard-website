import re
import os
import html

valves_dir = r"c:\Users\Alok Das\Desktop\gmdalui\scratch\valves_pages"

def clean_html(text):
    text = re.sub(r'<[^>]+>', ' ', text)
    text = html.unescape(text)
    return re.sub(r'\s+', ' ', text).strip()

for fname in os.listdir(valves_dir):
    if not fname.endswith('.txt'):
        continue
    
    fpath = os.path.join(valves_dir, fname)
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    print(f"\n==========================================")
    print(f"FILE: {fname}")
    print(f"==========================================")
    
    # Let's find all Pagelayer headings
    # e.g., <!-- wp:pagelayer/pl_heading {"text":"Heading Text"} -->Heading Text<!-- /wp:pagelayer/pl_heading -->
    # or look for strings between heading markers
    heading_pat = re.compile(r'<!-- wp:pagelayer/pl_heading.*?-->([\s\S]*?)<!-- /wp:pagelayer/pl_heading -->')
    headings = heading_pat.findall(content)
    
    clean_headings = []
    for h in headings:
        h_clean = clean_html(h)
        if h_clean and h_clean not in clean_headings:
            clean_headings.append(h_clean)
            
    print("HEADINGS FOUND:")
    for h in clean_headings:
        print(f" - {h}")
        
    # Let's search for image names or paths
    # e.g. "ele_bg_img-full-url" or "src=\"...\""
    img_pat = re.compile(r'uploads/(\d{4}/\d{2}/[^"\']+\.(?:png|jpg|jpeg|webp))')
    imgs = list(set(img_pat.findall(content)))
    print("IMAGES FOUND:")
    for img in imgs:
        print(f" - /uploads/{img}")
