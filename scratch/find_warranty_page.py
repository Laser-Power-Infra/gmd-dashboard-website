import re
import os

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

if not os.path.exists(sql_path):
    print("SQL backup file does not exist at:", sql_path)
    exit(1)

print("Reading SQL dump to find Warranty page...")
with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    sql_content = f.read()

print("Finding wpzm_posts inserts...")
insert_pattern = re.compile(r'INSERT INTO `wpzm_posts` VALUES\s*(.*);', re.DOTALL)
matches = insert_pattern.findall(sql_content)

all_tuples = []
for m_val in matches:
    pos = 0
    in_string = False
    string_char = None
    esc = False
    bracket_count = 0
    curr_tuple = []
    
    while pos < len(m_val):
        c = m_val[pos]
        if esc:
            curr_tuple.append(c)
            esc = False
            pos += 1
            continue
        if c == '\\':
            curr_tuple.append(c)
            esc = True
            pos += 1
            continue
        if c in ("'", '"'):
            curr_tuple.append(c)
            if not in_string:
                in_string = True
                string_char = c
            elif string_char == c:
                in_string = False
            pos += 1
            continue
        
        if not in_string:
            if c == '(':
                bracket_count += 1
                curr_tuple.append(c)
            elif c == ')':
                bracket_count -= 1
                curr_tuple.append(c)
                if bracket_count == 0:
                    t_str = "".join(curr_tuple).strip()
                    all_tuples.append(t_str)
                    curr_tuple = []
            elif c == ',':
                if bracket_count > 0:
                    curr_tuple.append(c)
            else:
                curr_tuple.append(c)
        else:
            curr_tuple.append(c)
        pos += 1

print(f"Total posts parsed: {len(all_tuples)}")

for t_str in all_tuples:
    # Check if 'warranty' is in the tuple slug/name or title
    # Columns in wpzm_posts:
    # 0: ID
    # 1: post_author
    # 2: post_date
    # 3: post_date_gmt
    # 4: post_content
    # 5: post_title
    # 6: post_excerpt
    # 7: post_status
    # 8: comment_status
    # 9: ping_status
    # 10: post_password
    # 11: post_name (slug)
    
    # Let's do a simple check
    if 'warranty' in t_str.lower():
        # Let's parse fields
        fields = []
        curr = []
        esc = False
        in_str = False
        str_char = None
        inner_t = t_str[1:-1]
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
        
        if len(fields) > 11:
            pid = fields[0]
            title = fields[5].replace("\\'", "'").replace('\\"', '"')
            slug = fields[11].replace("\\'", "'").replace('\\"', '"')
            post_type = fields[20].replace("\\'", "'").replace('\\"', '"') if len(fields) > 20 else 'unknown'
            
            # Match either title contains warranty, or slug contains warranty
            if 'warranty' in title.lower() or 'warranty' in slug.lower():
                print(f"\n>>> FOUND WARRANTY POST: ID={pid}, Title='{title}', Slug='{slug}', Type='{post_type}' <<<")
                content = fields[4].replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\').replace('\\r\\n', '\n').replace('\\n', '\n')
                print("--- Content ---")
                print(content)
                print("=" * 80)
