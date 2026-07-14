import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    slug = 'manual-of-sluice-valve'
    print(f"EXTRACTING: {slug}")
    
    pos = content.find(f"'{slug}'")
    if pos == -1:
        print("Not found.")
        sys.exit(1)
        
    sub_start = max(0, pos - 120000)
    sub_end = min(len(content), pos + 20000)
    sub = content[sub_start:sub_end]
    
    # Find row start
    row_starts = [m.start() for m in re.finditer(r"\(\d+,\s*\d+,", sub)]
    start_idx = -1
    for start in row_starts:
        if start < (pos - sub_start):
            start_idx = start
        else:
            break
            
    if start_idx == -1:
        print("Could not find start of row.")
        sys.exit(1)
        
    end_matches = [m.start() for m in re.finditer(r"\)(?:,\s*\(|;)", sub[start_idx:])]
    if not end_matches:
        print("Could not find end of row.")
        sys.exit(1)
        
    row_end_idx = start_idx + end_matches[0] + 1
    row_str = sub[start_idx:row_end_idx]
    
    print(f"Isolated row string of length {len(row_str)}")
    
    fields = re.findall(r"'((?:[^'\\]|\\.)*)'", row_str)
    print(f"Extracted {len(fields)} fields.")
    
    title = ""
    post_content = ""
    post_type = ""
    
    for f in fields:
        f_dec = f.encode().decode('unicode-escape', errors='ignore')
        if f_dec == slug:
            continue
        if "wp:" in f_dec or "<p>" in f_dec or "<!-- wp:" in f_dec or "pagelayer-id" in f_dec:
            post_content = f_dec
        elif len(f_dec) > 2 and len(f_dec) < 80 and not f_dec.startswith("http") and not f_dec.startswith("2025-") and f_dec not in ['publish', 'open', 'closed', 'page', 'post', 'attachment', 'nav_menu_item', 'revision']:
            if not title:
                title = f_dec
                
    for f in fields:
        if f in ['page', 'post', 'nav_menu_item']:
            post_type = f
            break
            
    print(f"Title: {title}")
    print(f"Type: {post_type}")
    
    out_path = r"c:\Users\Alok Das\Desktop\gmdalui\scratch\manual-of-sluice-valve_content.html"
    with open(out_path, 'w', encoding='utf-8') as out_f:
        out_f.write(post_content)
    print("Saved successfully to scratch/manual-of-sluice-valve_content.html")
    
except Exception as e:
    print("Error:", e)
