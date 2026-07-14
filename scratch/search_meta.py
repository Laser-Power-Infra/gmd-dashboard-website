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

target_post_ids = ['2845', '2848']

# Look for INSERT INTO `wpzm_postmeta`
# wpzm_postmeta columns: meta_id, post_id, meta_key, meta_value
# Values: (1, 2, 'key', 'value'), ...
print("Finding wpzm_postmeta inserts...")
inserts = re.findall(r"INSERT INTO `wpzm_postmeta` VALUES (.*?);", content, re.DOTALL)
print(f"Found {len(inserts)} wpzm_postmeta insert statements.")

for post_id in target_post_ids:
    print(f"\n=======================================================")
    print(f"METADATA FOR POST ID: {post_id}")
    print(f"=======================================================")
    
    # Let's search for values of the form (meta_id, post_id, 'meta_key', 'meta_value')
    # A simple regex for this post_id:
    # We can search for the post_id as a word in the inserts
    matches = []
    for ins in inserts:
        # split by ),(
        # Note: there can be newlines or quotes inside, so character by character or a regex.
        # Since postmeta rows are smaller, let's search for the pattern \(\d+,\s*post_id,
        for m in re.finditer(rf"\(\d+,\s*{post_id},", ins):
            start = m.start()
            # find end of this tuple )
            # We must count quotes to handle escapes correctly
            pos = start
            bracket_level = 0
            in_str = False
            str_char = None
            esc = False
            while pos < len(ins):
                c = ins[pos]
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
                    row_str = ins[start : pos + 1]
                    matches.append(row_str)
                    break
                pos += 1
                
    print(f"Found {len(matches)} meta rows for post_id {post_id}:")
    for r in matches:
        # Parse fields
        # (meta_id, post_id, 'key', 'value')
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
            # Truncate value if long
            val_disp = meta_val if len(meta_val) < 200 else meta_val[:200] + "..."
            print(f"  Key: '{meta_key}'")
            print(f"  Val: '{val_disp}'")
            print("-" * 30)
