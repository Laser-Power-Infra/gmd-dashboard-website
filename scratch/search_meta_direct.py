import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"
if not os.path.exists(sql_path):
    print("SQL backup file does not exist at:", sql_path)
    sys.exit(1)

content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()

# Find the start and end of wpzm_postmeta dumping data
start_marker = "Dumping data for table `wpzm_postmeta`"
pos_start = content.find(start_marker)
if pos_start == -1:
    print("Could not find start marker.")
    sys.exit(1)

pos_insert = content.find("INSERT INTO `wpzm_postmeta` VALUES", pos_start)
if pos_insert == -1:
    print("Could not find INSERT INTO `wpzm_postmeta`.")
    sys.exit(1)

# Find the next semicolon to end the insert statement
pos_end = content.find(";", pos_insert)
if pos_end == -1:
    print("Could not find end semicolon.")
    sys.exit(1)

postmeta_block = content[pos_insert : pos_end]
print(f"Isolated postmeta block of length {len(postmeta_block)}")

# Let's search for 2848 and 2845 in this block
# A tuple is (meta_id, post_id, 'meta_key', 'meta_value')
# Let's search for ,2848, or , 2848,
matches = []
# Find all occurrences of the post_ids
for pid in ['2845', '2848']:
    print(f"\nSearching for post ID: {pid}")
    idx = 0
    while True:
        # We look for a pattern like (\d+, pid,
        match = re.search(r"\(\d+,\s*" + pid + r"\s*,", postmeta_block[idx:])
        if not match:
            break
        
        start_pos = idx + match.start()
        # Find the end of this tuple
        # Let's parse character by character from start_pos
        pos = start_pos
        bracket_level = 0
        in_str = False
        str_char = None
        esc = False
        while pos < len(postmeta_block):
            c = postmeta_block[pos]
            if esc:
                esc = False
                pos += 1
                continue
            if c == '\\':
                esc = True
                pos += 1
                continue
            if c in ("'", '"'):
                if not in_str:
                    in_str = True
                    str_char = c
                elif str_char == c:
                    in_str = False
            elif c == ')' and not in_str:
                row_str = postmeta_block[start_pos : pos + 1]
                matches.append((pid, row_str))
                break
            pos += 1
        idx = start_pos + len(match.group(0))

print(f"Found {len(matches)} matches total.")
for pid, r in matches:
    # Parse fields
    fields = []
    curr = []
    esc = False
    in_str = False
    str_char = None
    for c in r[1:-1]:
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
    
    if len(fields) >= 4:
        meta_key = fields[2].encode().decode('unicode-escape', errors='ignore').replace("\\'", "'").replace('\\"', '"')
        meta_val = fields[3].encode().decode('unicode-escape', errors='ignore').replace("\\'", "'").replace('\\"', '"')
        val_disp = meta_val if len(meta_val) < 200 else meta_val[:200] + "..."
        print(f"Post ID: {pid} | Key: '{meta_key}'")
        print(f"Value: '{val_disp}'")
        print("-" * 50)
