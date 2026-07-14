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

# Let's search for wpzm_posts inserts
pos_start = content.find("Dumping data for table `wpzm_posts`")
pos_insert = content.find("INSERT INTO `wpzm_posts` VALUES", pos_start)
pos_end = content.find("DROP TABLE IF EXISTS", pos_insert)
posts_block = content[pos_insert:pos_end]
print(f"Isolated posts block of length {len(posts_block)}")

# We want to find all rows. Let's parse rows character by character.
rows = []
pos = 0
bracket_level = 0
in_str = False
str_char = None
esc = False
curr_row = []

while pos < len(posts_block):
    c = posts_block[pos]
    if esc:
        curr_row.append(c)
        esc = False
        pos += 1
        continue
    if c == '\\':
        curr_row.append(c)
        esc = True
        pos += 1
        continue
    if c in ("'", '"'):
        curr_row.append(c)
        if not in_str:
            in_str = True
            str_char = c
        elif str_char == c:
            in_str = False
        pos += 1
        continue
    
    if not in_str:
        if c == '(':
            bracket_level += 1
            if bracket_level == 1:
                curr_row = []
            else:
                curr_row.append(c)
        elif c == ')':
            bracket_level -= 1
            if bracket_level == 0:
                rows.append("".join(curr_row).strip())
            else:
                curr_row.append(c)
        elif c == ',':
            if bracket_level > 0:
                curr_row.append(c)
        else:
            curr_row.append(c)
    else:
        curr_row.append(c)
    pos += 1

print(f"Parsed {len(rows)} rows.")

def parse_row_fields(row_str):
    fields = []
    curr = []
    esc = False
    in_str = False
    str_char = None
    for c in row_str:
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

# Let's check rows matching warranty
for idx, r in enumerate(rows):
    if 'warranty' in r.lower():
        fields = parse_row_fields(r)
        if len(fields) > 11:
            pid = fields[0]
            parent = fields[17]
            title = fields[5].encode().decode('unicode-escape', errors='ignore').replace("\\'", "'").replace('\\"', '"')
            slug = fields[11].encode().decode('unicode-escape', errors='ignore').replace("\\'", "'").replace('\\"', '"')
            post_status = fields[7].encode().decode('unicode-escape', errors='ignore')
            post_type = fields[20].encode().decode('unicode-escape', errors='ignore') if len(fields) > 20 else 'unknown'
            
            print(f"ID={pid} | Title='{title}' | Slug='{slug}' | Parent={parent} | Status={post_status} | Type={post_type}")
