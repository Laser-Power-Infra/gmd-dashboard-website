import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    slug = 'warranty-of-sluice-valve-2'
    print(f"EXTRACTING: {slug}")
    
    pos = content.find(f"'{slug}'")
    if pos == -1:
        print("Not found.")
        sys.exit(1)
        
    # Find the row containing this slug
    # We trace back to find the closest '(' followed by a number
    sub_start = max(0, pos - 150000)
    sub = content[sub_start : pos + 1000]
    
    # Search for all '(' followed by digits and comma
    matches = list(re.finditer(r"\(\d+,\s*\d+,", sub))
    if not matches:
        print("Could not find start of row.")
        sys.exit(1)
        
    start_pos_in_sub = matches[-1].start()
    row_start_global = sub_start + start_pos_in_sub
    
    # Now find the end of this row (the next row start or end of insert statement)
    sub_end = content[row_start_global : row_start_global + 120000]
    end_matches = list(re.finditer(r"\)(?:,\s*\(|;)", sub_end))
    if not end_matches:
        print("Could not find end of row.")
        sys.exit(1)
        
    row_str = sub_end[: end_matches[0].start() + 1]
    print(f"Isolated row string of length {len(row_str)}")
    
    # Extract fields
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
    
    out_path = r"c:\Users\Alok Das\Desktop\gmdalui\scratch\warranty-of-sluice-valve-2_content.html"
    with open(out_path, 'w', encoding='utf-8') as out_f:
        out_f.write(f"<!-- Title: {title} -->\n<!-- Slug: {slug} -->\n<!-- Type: {post_type} -->\n\n")
        out_f.write(post_content)
    print("Saved successfully to scratch/warranty-of-sluice-valve-2_content.html")
    
except Exception as e:
    print("Error:", e)
