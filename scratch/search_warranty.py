import re
import os

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

if not os.path.exists(sql_path):
    print("SQL backup file does not exist at:", sql_path)
    exit(1)

print("Reading SQL dump to find 'warranty'...")
with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    sql_content = f.read()

print("Searching for 'warranty' in posts...")
# Let's find any occurrences of the word warranty in the insert statements for posts
# wpzm_posts has columns like (ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count)

# Let's search inside the posts table insert statements
# We can find all tuples inside `wpzm_posts` inserts
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
    # Let's see if the word warranty is in this tuple
    if 'warranty' in t_str.lower():
        # Let's extract fields roughly
        # find ID and title
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
        
        if len(fields) > 5:
            pid = fields[0]
            post_title = fields[5]
            post_type = fields[20] if len(fields) > 20 else 'unknown'
            print(f"\nMatch found: ID={pid}, Title='{post_title}', Type='{post_type}'")
            post_content = fields[4].replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\').replace('\\r\\n', '\n').replace('\\n', '\n')
            print("Content excerpt:")
            print(post_content[:500])
            print("-" * 50)
