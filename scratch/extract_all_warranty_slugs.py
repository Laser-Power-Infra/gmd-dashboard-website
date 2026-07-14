import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"
if not os.path.exists(sql_path):
    print("SQL backup file does not exist at:", sql_path)
    sys.exit(1)

print("Loading SQL dump...")
content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
print(f"Loaded {len(content)} characters.")

# Find all occurrences of 'warranty-' slugs in quotes, e.g. 'warranty-of-check-valve'
warranty_slugs = sorted(list(set(re.findall(r"'(warranty-[a-z0-9-]+)'", content))))
print(f"Found {len(warranty_slugs)} unique warranty slugs:")
for s in warranty_slugs:
    print(f"  - {s}")

def parse_isolated_row(slug):
    pos = content.find(f"'{slug}'")
    if pos == -1:
        return None
    
    # Trace back to find the start of the row '('
    sub_start = max(0, pos - 150000)
    sub = content[sub_start : pos + 1000]
    
    # Search for all '(' followed by digits and comma
    matches = list(re.finditer(r"\(\d+,\s*\d+,", sub))
    if not matches:
        return None
        
    start_pos_in_sub = matches[-1].start()
    row_start_global = sub_start + start_pos_in_sub
    
    # Find the end of this row
    sub_end = content[row_start_global : row_start_global + 120000]
    end_matches = list(re.finditer(r"\)(?:,\s*\(|;)", sub_end))
    if not end_matches:
        return None
        
    row_str = sub_end[: end_matches[0].start() + 1]
    
    # Parse fields
    fields = []
    curr = []
    esc = False
    in_str = False
    str_char = None
    inner_t = row_str[1:-1]
    
    for c in inner_t:
        if esc:
            curr.append(c)
            esc = False
            continue
        if c == '\\':
            curr.append(c)
            esc = True
            continue
        if c in ("'", '"'):
            if not in_str:
                in_str = True
                str_char = c
            elif str_char == c:
                in_str = False
            else:
                curr.append(c)
        elif c == ',' and not in_str:
            fields.append("".join(curr).strip())
            curr = []
        else:
            curr.append(c)
    fields.append("".join(curr).strip())
    
    return fields

for slug in warranty_slugs:
    print(f"\n=======================================================")
    print(f"EXTRACTING CONTENT FOR SLUG: {slug}")
    print(f"=======================================================")
    fields = parse_isolated_row(slug)
    if not fields or len(fields) < 6:
        print("Could not isolate row fields.")
        continue
    
    pid = fields[0]
    # In wp_posts: 4 is post_content, 5 is post_title, 11 is post_name, 20 is post_type
    post_content = fields[4].encode().decode('unicode-escape', errors='ignore').replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\').replace('\\r\\n', '\n').replace('\\n', '\n')
    post_title = fields[5].encode().decode('unicode-escape', errors='ignore').replace("\\'", "'").replace('\\"', '"')
    post_type = fields[20].encode().decode('unicode-escape', errors='ignore').replace("\\'", "'").replace('\\"', '"') if len(fields) > 20 else 'unknown'
    
    print(f"ID: {pid}")
    print(f"Title: {post_title}")
    print(f"Type: {post_type}")
    print(f"Content Length: {len(post_content)}")
    
    # Clean the HTML content to extract clear text/structure
    # Find all headings, list items, and paragraph texts
    headings = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', post_content, re.DOTALL)
    paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', post_content, re.DOTALL)
    list_items = re.findall(r'<li[^>]*>(.*?)</li>', post_content, re.DOTALL)
    
    print("\n--- Structural Elements found ---")
    if headings:
        print("Headings:")
        for h in headings[:10]:
            print(f"  * {re.sub(r'<[^>]+>', '', h).strip()}")
    if list_items:
        print("List Items (first 10):")
        for li in list_items[:10]:
            print(f"  - {re.sub(r'<[^>]+>', '', li).strip()}")
    elif paragraphs:
        print("Paragraphs (first 10):")
        for p in paragraphs[:10]:
            print(f"  - {re.sub(r'<[^>]+>', '', p).strip()}")
            
    # Save the raw HTML content for this slug
    out_path = f"scratch/{slug}_content.html"
    with open(out_path, 'w', encoding='utf-8') as out_f:
        out_f.write(f"<!-- Title: {post_title} -->\n<!-- Slug: {slug} -->\n<!-- Type: {post_type} -->\n\n")
        out_f.write(post_content)
    print(f"Saved to scratch/{slug}_content.html")
    print("=" * 60)
