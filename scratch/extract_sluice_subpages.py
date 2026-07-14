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
        'warranty-of-sluice-valve-2'
    ]
    
    # We will search for each slug, find the wpzm_posts insert line, and isolate the row containing it.
    # WordPress inserts are of form: INSERT INTO `wpzm_posts` VALUES (row1), (row2), ...;
    # Let's find all INSERT INTO `wpzm_posts` lines and parse them.
    print("Scanning wpzm_posts insert statements...")
    posts_insert_lines = []
    for line in content.splitlines():
        if "INSERT INTO `wpzm_posts` VALUES" in line:
            posts_insert_lines.append(line)
            
    print(f"Found {len(posts_insert_lines)} lines of wpzm_posts inserts.")
    
    for slug in slugs:
        print(f"\nProcessing slug: {slug}")
        found = False
        for line in posts_insert_lines:
            if slug in line:
                # We found the line containing the slug. Now let's split it into rows.
                # In wpzm_posts inserts, each row is inside parentheses: (ID, author, ...)
                # Let's split on "),(" or similar. Since strings can contain backslash-escaped quotes and parentheses,
                # let's use a regex to split rows carefully.
                # A simple split by "), (" is often sufficient for overview.
                rows = re.split(r"\),\s*\(", line)
                for r in rows:
                    if slug in r:
                        found = True
                        print(f"-> Found row containing '{slug}' (length: {len(r)})")
                        
                        # Let's parse fields.
                        # Fields are comma-separated, but strings can contain commas.
                        # Let's extract the string fields using regex or state machine.
                        # A simple way is to find all single-quoted strings:
                        fields = re.findall(r"'((?:[^'\\]|\\.)*)'", r)
                        print(f"Extracted {len(fields)} text fields.")
                        
                        # Let's find fields that look like title, content, type
                        # Typically fields:
                        # 0: post_author (number)
                        # 1: post_date
                        # 2: post_date_gmt
                        # 3: post_content (long HTML)
                        # 4: post_title
                        # 5: post_excerpt
                        # 6: post_status (e.g. 'publish')
                        # ...
                        # Let's search for fields by content/types
                        title = ""
                        post_content = ""
                        post_type = ""
                        
                        for f in fields:
                            # Decode backslashes
                            f_dec = f.encode().decode('unicode-escape', errors='ignore')
                            if f_dec == slug:
                                continue
                            if "wp:" in f_dec or "<p>" in f_dec or "<!-- wp:" in f_dec:
                                post_content = f_dec
                            elif len(f_dec) > 2 and len(f_dec) < 80 and not f_dec.startswith("http") and not f_dec.startswith("2025-") and f_dec not in ['publish', 'open', 'closed', 'page', 'post', 'attachment', 'nav_menu_item']:
                                # Guessing title
                                if not title:
                                    title = f_dec
                                    
                        # Also look for post_type field
                        post_type_match = re.search(r"'(page|post|attachment|nav_menu_item|revision)'\s*,\s*'\d+'\)$", r)
                        if post_type_match:
                            post_type = post_type_match.group(1)
                        else:
                            # Let's look if any field equals 'page' or 'post'
                            for f in fields:
                                if f in ['page', 'post', 'nav_menu_item']:
                                    post_type = f
                                    break
                                    
                        print(f"Title: {title}")
                        print(f"Type: {post_type}")
                        
                        # Save content to file
                        out_path = f"c:\\Users\\Alok Das\\Desktop\\gmdalui\\scratch\\{slug}_content.html"
                        with open(out_path, 'w', encoding='utf-8') as out_f:
                            out_f.write(f"<!-- Title: {title} -->\n<!-- Slug: {slug} -->\n<!-- Type: {post_type} -->\n\n")
                            out_f.write(post_content)
                        print(f"Saved content to scratch/{slug}_content.html")
                        
        if not found:
            print(f"Slug '{slug}' not found in wp_posts.")

except Exception as e:
    print("Error:", e)
