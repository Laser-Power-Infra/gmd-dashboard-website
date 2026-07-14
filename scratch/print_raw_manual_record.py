import re
import json

raw_file = "scratch/warranty_raw_records.txt"
content = open(raw_file, encoding='utf-8').read()

# Find the section starting with "SLUG: manual-of-sluice-valve"
pos = content.find("SLUG: manual-of-sluice-valve")
if pos == -1:
    print("Not found.")
else:
    sub = content[pos:pos+35000]
    # Let's find all occurrences of wp:pagelayer comments
    comments = re.findall(r'<!--\s*(wp:pagelayer/[^\s]+)\s*({.*?})\s*/?-->|<!--\s*(wp:pagelayer/[^\s]+)\s*({.*?})\s*-->', sub)
    print(f"Found {len(comments)} PageLayer comment tags.")
    for idx, c in enumerate(comments):
        # c is a tuple: (tag1, json1, tag2, json2)
        tag = c[0] or c[2]
        js_str = c[1] or c[3]
        if js_str:
            try:
                # The JSON might have escaped quotes
                js_clean = js_str.replace('\\"', '"').replace("\\'", "'")
                js = json.loads(js_clean)
                print(f"{idx}: {tag} -> keys: {list(js.keys())}")
                # Print keys that might relate to images
                for k in js:
                    if 'img' in k or 'image' in k or 'bg' in k or 'src' in k:
                        print(f"  {k} = {js[k]}")
            except Exception as e:
                # Just print some character count
                print(f"{idx}: {tag} -> parse error: {e} | len: {len(js_str)}")
