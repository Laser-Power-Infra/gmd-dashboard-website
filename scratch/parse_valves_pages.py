import re
import os
import html

valves_dir = r"c:\Users\Alok Das\Desktop\gmdalui\scratch\valves_pages"
out_path = r"c:\Users\Alok Das\Desktop\gmdalui\scratch\all_valves_extracted_details.txt"

def clean_html(text):
    text = re.sub(r'<[^>]+>', ' ', text)
    text = html.unescape(text)
    return re.sub(r'\s+', ' ', text).strip()

results = []

for fname in sorted(os.listdir(valves_dir)):
    if not fname.endswith('.txt'):
        continue
    
    fpath = os.path.join(valves_dir, fname)
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    results.append(f"\n================================================================================\n")
    results.append(f"VALVE CATEGORY FILE: {fname}\n")
    results.append(f"================================================================================\n")
    
    # We will search for all blocks
    # A block can be:
    # 1. pl_heading -> heading text
    # 2. pl_text or simple paragraph -> content text
    # 3. pl_image -> image options (like ID or attachment details)
    # Let's extract all matches of any Pagelayer block to keep chronological order!
    # A block starts with <!-- wp:pagelayer/xxx and ends with /--> or <!-- /wp:pagelayer/xxx -->
    
    # Let's do a character-by-character scan to find all comments and their contents
    pos = 0
    blocks = []
    
    # Find all <!-- wp:pagelayer/xxx --> or <!-- wp:pagelayer/xxx /-->
    block_pattern = re.compile(r'<!-- (wp:pagelayer/\S+)\s*([\s\S]*?)\s*-->')
    matches = list(block_pattern.finditer(content))
    
    # Now for each block match, let's extract the text content following it up to the next block or end tag
    for i, m in enumerate(matches):
        btype = m.group(1)
        bmeta = m.group(2)
        start_pos = m.end()
        end_pos = matches[i+1].start() if i+1 < len(matches) else len(content)
        block_body = content[start_pos:end_pos].strip()
        
        # Clean end tags from block body
        block_body = re.sub(r'<!--\s*/' + re.escape(btype) + r'\s*-->', '', block_body).strip()
        block_body = re.sub(r'<!--\s*/wp:pagelayer/\S+\s*-->', '', block_body).strip()
        
        # If it's a heading or text or image, extract details
        if 'pl_heading' in btype:
            h_text = clean_html(block_body)
            if h_text:
                blocks.append(f"[HEADING] {h_text}")
        elif 'pl_text' in btype or block_body.startswith('<p>'):
            t_text = clean_html(block_body)
            if t_text:
                # If the last block was same text, skip
                if not (blocks and blocks[-1] == f"[TEXT] {t_text}"):
                    blocks.append(f"[TEXT] {t_text}")
        elif 'pl_image' in btype:
            # Try to get image url from metadata
            img_url_match = re.search(r'"ele_bg_img-full-url":"([^"]+)"', bmeta)
            if not img_url_match:
                img_url_match = re.search(r'"parallax_img":"([^"]+)"', bmeta)
            # Or standard image id
            img_id_match = re.search(r'"id":(\d+)', bmeta)
            img_id = img_id_match.group(1) if img_id_match else "unknown"
            
            img_url = img_url_match.group(1) if img_url_match else ""
            if img_url:
                # Extract path after uploads
                idx = img_url.find('uploads/')
                if idx != -1:
                    img_path = "/" + img_url[idx:]
                else:
                    img_path = img_url
                blocks.append(f"[IMAGE] ID:{img_id} Path:{img_path}")
            else:
                blocks.append(f"[IMAGE] ID:{img_id}")
                
    # Filter out empty or duplicate sequences
    last_block = None
    for b in blocks:
        if b != last_block:
            results.append(b + "\n")
            last_block = b

with open(out_path, 'w', encoding='utf-8') as out_f:
    out_f.writelines(results)

print(f"Extraction summary written to {out_path}")
