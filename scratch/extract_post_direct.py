import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    slugs = [
        'alternative-of-sluice-valves',
        'butterfly-valves-vs-sluice-valves',
        'warranty-of-sluice-valve',
        'warranty-of-sluice-valve-2',
        'sluice-valves'
    ]
    
    for slug in slugs:
        print(f"\n=======================================================")
        print(f"EXTRACTING: {slug}")
        print(f"=======================================================")
        
        # Search for slug in the dump
        pos = content.find(f"'{slug}'")
        if pos == -1:
            # Maybe it uses double quotes
            pos = content.find(f'"{slug}"')
            
        if pos == -1:
            print(f"Slug '{slug}' not found.")
            continue
            
        # Find the start and end of the row containing the slug.
        # A row is typically surrounded by ( ... ) in the insert values statement.
        # Let's search backwards for the matching '(' and forwards for the matching ')'
        # To be safe, we search for a sequence that starts with a number (representing post ID)
        # e.g., (123, 1, '...
        
        # Let's search backward for the beginning of the parenthesis group.
        # We need to trace back. Since parentheses can be nested inside strings,
        # let's just find the closest '(' before pos that is not inside quotes.
        # Or, we can extract a generous range around pos and do regex matching.
        sub_start = max(0, pos - 60000)
        sub_end = min(len(content), pos + 20000)
        sub = content[sub_start:sub_end]
        
        # Let's find matches of rows.
        # In SQL insert, rows look like: (ID, author, 'date', 'date_gmt', 'content', 'title', 'excerpt', 'status', ...
        # Let's find all groups of single quoted strings inside a parenthesis block
        # We can search for the slug and trace the boundaries.
        # Let's trace back from the position of slug in the sub.
        slug_pos_in_sub = pos - sub_start
        
        # Let's scan backwards to find the ID of the post
        # A row starts with (ID, where ID is an integer
        # Let's find '(' followed by digits and a comma
        row_starts = [m.start() for m in re.finditer(r"\(\d+,\s*\d+,", sub)]
        # Find the row start closest to slug_pos_in_sub but before it
        start_idx = -1
        for start in row_starts:
            if start < slug_pos_in_sub:
                start_idx = start
            else:
                break
                
        if start_idx == -1:
            print("Could not find start of row.")
            continue
            
        # Let's find the end of the row.
        # It's usually the next row start or the end of the insert statement ';'
        # Or we can scan forward for '),' followed by '(' or ';'
        # Let's search for the end pattern
        end_matches = [m.start() for m in re.finditer(r"\)(?:,\s*\(|;)", sub[start_idx:])]
        if not end_matches:
            print("Could not find end of row.")
            continue
            
        row_end_idx = start_idx + end_matches[0] + 1
        row_str = sub[start_idx:row_end_idx]
        
        print(f"Isolated row string of length {len(row_str)} starting at ID {row_str[:20]}")
        
        # Extract fields
        # Regex to extract single quoted strings
        fields = re.findall(r"'((?:[^'\\]|\\.)*)'", row_str)
        print(f"Extracted {len(fields)} fields.")
        
        title = ""
        post_content = ""
        post_type = ""
        
        for f in fields:
            # Decode backslashes
            f_dec = f.encode().decode('unicode-escape', errors='ignore')
            if f_dec == slug:
                continue
            if "wp:" in f_dec or "<p>" in f_dec or "<!-- wp:" in f_dec or "pagelayer-id" in f_dec:
                post_content = f_dec
            elif len(f_dec) > 2 and len(f_dec) < 80 and not f_dec.startswith("http") and not f_dec.startswith("2025-") and f_dec not in ['publish', 'open', 'closed', 'page', 'post', 'attachment', 'nav_menu_item', 'revision']:
                if not title:
                    title = f_dec
        
        # Let's check for page or post type
        for f in fields:
            if f in ['page', 'post', 'nav_menu_item']:
                post_type = f
                break
                
        print(f"Title: {title}")
        print(f"Type: {post_type}")
        
        # Save content
        out_path = f"c:\\Users\\Alok Das\\Desktop\\gmdalui\\scratch\\{slug}_content.html"
        with open(out_path, 'w', encoding='utf-8') as out_f:
            out_f.write(f"<!-- Title: {title} -->\n<!-- Slug: {slug} -->\n<!-- Type: {post_type} -->\n\n")
            out_f.write(post_content)
        print(f"Saved content to scratch/{slug}_content.html")
        
except Exception as e:
    print("Error:", e)
