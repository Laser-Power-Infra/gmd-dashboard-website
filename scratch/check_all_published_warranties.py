import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"
if not os.path.exists(sql_path):
    print("SQL backup file does not exist:", sql_path)
    sys.exit(1)

content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()

pos_start = content.find("Dumping data for table `wpzm_posts`")
pos_insert = content.find("INSERT INTO `wpzm_posts` VALUES", pos_start)
pos_end = content.find("DROP TABLE IF EXISTS", pos_insert)
posts_block = content[pos_insert:pos_end]

def parse_row_by_id(target_id):
    pattern = rf"\({target_id},\s*\d+,"
    match = re.search(pattern, posts_block)
    if not match:
        return None
    
    start_pos = match.start()
    bracket_level = 0
    in_str = False
    str_char = None
    esc = False
    row_str = ""
    for idx in range(start_pos, len(posts_block)):
        c = posts_block[idx]
        if esc:
            esc = False
            continue
        if c == '\\':
            esc = True
            continue
        if c in ("'", '"'):
            if not in_str:
                in_str = True
                str_char = c
            elif str_char == c:
                in_str = False
        elif c == ')' and not in_str:
            row_str = posts_block[start_pos : idx + 1]
            break
            
    if not row_str:
        return None
        
    fields = []
    curr = []
    esc = False
    in_str = False
    str_char = None
    for c in row_str[1:-1]:
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

published_warranty_ids = ['2884', '2898', '3026']
for tid in published_warranty_ids:
    print(f"\n=======================================================")
    print(f"EXTRACTING ID: {tid}")
    print(f"=======================================================")
    fields = parse_row_by_id(tid)
    if not fields:
        print("Not found.")
        continue
    
    pid = fields[0]
    p_content = fields[4].encode().decode('unicode-escape', errors='ignore').replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\').replace('\\r\\n', '\n').replace('\\n', '\n')
    title = fields[5].encode().decode('unicode-escape', errors='ignore').replace("\\'", "'").replace('\\"', '"')
    slug = fields[11].encode().decode('unicode-escape', errors='ignore').replace("\\'", "'").replace('\\"', '"')
    status = fields[7].encode().decode('unicode-escape', errors='ignore')
    ptype = fields[20].encode().decode('unicode-escape', errors='ignore') if len(fields) > 20 else 'unknown'
    
    print(f"ID: {pid} | Title: {title} | Slug: {slug} | Status: {status} | Type: {ptype}")
    print(f"Content length: {len(p_content)}")
    
    # Let's find all text blocks and check if it contains the duplicate butterfly terms
    # Look for unique headings or block texts
    comments = re.findall(r'<!--\s*(wp:pagelayer/pl.*?)\s*(.*?)\s*-->', p_content, re.DOTALL)
    print(f"Found {len(comments)} comment blocks.")
    for idx, (bname, bdata) in enumerate(comments):
        # find texts
        text_match = re.search(r'"text"\s*:\s*"(.*?)"', bdata)
        if text_match:
            txt = text_match.group(1).encode().decode('unicode-escape', errors='ignore')
            if len(txt) > 3:
                print(f"  Block #{idx}: {txt[:200]}")
    
    # Save to scratch
    out_path = f"scratch/post_{tid}_content.html"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(p_content)
