import re
import json

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"
slug = "manual-of-sluice-valve"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    pos = content.find(f"'{slug}'")
    if pos == -1:
        print("Slug not found.")
    else:
        start = max(0, pos - 18000)
        end = min(len(content), pos + 2000)
        sub = content[start:end]
        
        # Let's find all occurrences of wp:pagelayer comments
        comments = re.findall(r'<!--\s*(wp:pagelayer/[^\s]+)\s*({.*?})\s*/?-->|<!--\s*(wp:pagelayer/[^\s]+)\s*({.*?})\s*-->', sub)
        print(f"Found {len(comments)} PageLayer comment tags.")
        for idx, c in enumerate(comments):
            tag = c[0] or c[2]
            js_str = c[1] or c[3]
            if js_str:
                try:
                    js_clean = js_str.replace('\\"', '"').replace("\\'", "'")
                    js = json.loads(js_clean)
                    print(f"{idx}: {tag} -> keys: {list(js.keys())}")
                    for k in js:
                        if 'img' in k or 'image' in k or 'bg' in k or 'src' in k:
                            print(f"  {k} = {js[k]}")
                except Exception as e:
                    print(f"{idx}: {tag} -> parse error: {e} | len: {len(js_str)}")
except Exception as e:
    print("Error:", e)
