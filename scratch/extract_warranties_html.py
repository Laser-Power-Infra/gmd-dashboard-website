import re

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

slugs = [
    "warranty-2",
    "warranty-of-regulating-valves",
    "warranty-of-check-valve",
    "warranty-of-automated-valves",
    "warranty-of-pressure-relief-and-safety",
    "warranty-of-sluice-valve",
    "warranty-of-manual-valve",
    "warranty-of-speciality-valves",
    "warranty-of-tamper-proof-kinetic-valve",
    "warranty-of-non-return-valves",
    "warranty-of-control-valve",
    "warranty-of-air-valve"
]

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    out = open("scratch/warranty_html_clean.txt", "w", encoding="utf-8")
    
    for slug in slugs:
        pos = content.find(f"'{slug}'")
        if pos == -1:
            print(f"Slug '{slug}' not found.")
            continue
        
        # Let's find the start of the insert record.
        # wp_posts insert row starts with (ID, where ID is a number. Let's look backward for a pattern like \(\d+,
        # A simple way: find the last `\n\(` before the slug.
        start_pos = content.rfind('\n(', 0, pos)
        if start_pos == -1:
            start_pos = max(0, pos - 15000)
            
        # The record ends at the end of the line or before the next row.
        # Let's find the next row start or insert end
        end_pos = content.find('),\n(', pos)
        if end_pos == -1:
            end_pos = content.find(');', pos)
        if end_pos == -1:
            end_pos = min(len(content), pos + 2000)
            
        record = content[start_pos:end_pos]
        
        # Let's extract the post content field. In wp_posts inserts, it is:
        # (ID, post_author, post_date, post_date_gmt, post_content, post_title, ...
        # The post_content starts after the second date.
        # Let's search for the first date pattern like 'YYYY-MM-DD HH:MM:SS' and the second date pattern
        date_matches = list(re.finditer(r"'\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}'", record))
        if len(date_matches) >= 2:
            # Post content starts after the second date (plus a comma and a single quote)
            content_start = date_matches[1].end() + 2 # skip , '
            # Post content ends before the post_title. The post_title is immediately after the post_content.
            # In the SQL, it looks like: ..., 'post_content', 'post_title', 'post_excerpt', ...
            # Let's look for the next single quote boundary that precedes post_title
            # We know the post_title because it's usually something like 'Warranty Of ...'
            # Let's search for the title of this slug
            title_pat = r"'(Warranty Of [^']+)'"
            title_match = re.search(title_pat, record, re.IGNORECASE)
            if title_match:
                title = title_match.group(1)
                content_end = title_match.start() - 2 # skip ', '
                post_content = record[content_start:content_end]
            else:
                title = slug
                post_content = record[content_start:pos-50] # fallback
        else:
            title = slug
            post_content = record
            
        # Let's clean the PageLayer/WordPress comments
        post_content_clean = re.sub(r'<!--.*?-->', '', post_content, flags=re.DOTALL)
        # Clean double slashes escape characters
        post_content_clean = post_content_clean.replace(r'\"', '"').replace(r"\'", "'").replace(r'\n', '\n').replace(r'\r', '\r')
        
        out.write(f"\n============================================================\n")
        out.write(f"TITLE: {title} | SLUG: {slug}\n")
        out.write(f"============================================================\n")
        out.write(post_content_clean.strip())
        out.write("\n\n")
        
    print("Clean HTML content saved to scratch/warranty_html_clean.txt")
except Exception as e:
    print("Error:", e)
