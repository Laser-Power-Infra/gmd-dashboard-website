import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"
if not os.path.exists(sql_path):
    print("SQL backup file does not exist at:", sql_path)
    sys.exit(1)

content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()

# Find the wpzm_posts dump start and end
pos_start = content.find("Dumping data for table `wpzm_posts`")
pos_insert = content.find("INSERT INTO `wpzm_posts` VALUES", pos_start)
pos_end = content.find("DROP TABLE IF EXISTS", pos_insert)
posts_block = content[pos_insert:pos_end]
print(f"Isolated posts block of length {len(posts_block)}")

# Let's find occurrences of `'warranty` (case insensitive) inside the posts block
# We will find all indexes
matches = [m.start() for m in re.finditer(r"'warranty-[a-z0-9-]+'", posts_block, re.IGNORECASE)]
print(f"Found {len(matches)} matches of 'warranty-' in post names.")

def parse_row_at_pos(pos):
    # Search backwards from pos to find the beginning of this row (digits and comma)
    # A row usually starts like (ID,
    # We can search backwards for '('
    # Let's walk backwards
    start_pos = -1
    for i in range(pos, max(0, pos - 150000), -1):
        # We look for a pattern like \(\d+,\s*\d+,
        # Since we are walking backwards, let's check if the substring starting at i matches this pattern
        sub = posts_block[i : i + 20]
        if re.match(r"\(\d+,\s*\d+,", sub):
            start_pos = i
            break
            
    if start_pos == -1:
        return None
        
    # Now find the end of this row by scanning character by character from start_pos
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
        
    # Parse fields
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

seen_ids = set()
for m in matches:
    fields = parse_row_at_pos(m)
    if fields and len(fields) > 11:
        pid = fields[0]
        if pid in seen_ids:
            continue
        seen_ids.add(pid)
        parent = fields[17]
        title = fields[5].encode().decode('unicode-escape', errors='ignore').replace("\\'", "'").replace('\\"', '"')
        slug = fields[11].encode().decode('unicode-escape', errors='ignore').replace("\\'", "'").replace('\\"', '"')
        post_status = fields[7].encode().decode('unicode-escape', errors='ignore')
        post_type = fields[20].encode().decode('unicode-escape', errors='ignore') if len(fields) > 20 else 'unknown'
        
        print(f"ID={pid} | Title='{title}' | Slug='{slug}' | Parent={parent} | Status={post_status} | Type={post_type}")
