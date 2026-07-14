import re
import os

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"
out_dir = r"c:\Users\Alok Das\Desktop\gmdalui\scratch\valves_pages"
os.makedirs(out_dir, exist_ok=True)

target_ids = {
    '202': 'Butterfly Valves',
    '203': 'Air Valves',
    '204': 'Sluice Valves',
    '205': 'Check Valves',
    '206': 'Manual Valves',
    '207': 'Non-Reaturn Valves',
    '208': 'Others Valves',
    '209': 'Tamper Proof Valves',
    '210': 'Control Valves',
    '211': 'Regulating Valves',
    '212': 'Automated Valves',
    '214': 'Speciality Valves'
}

print("Reading SQL dump...")
with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    sql_content = f.read()

print("Finding inserts...")
insert_pattern = re.compile(r'INSERT INTO `wpzm_posts` VALUES\s*(.*);', re.DOTALL)
matches = insert_pattern.findall(sql_content)

print(f"Found {len(matches)} inserts.")

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

print(f"Total tuples parsed: {len(all_tuples)}")

for t_str in all_tuples:
    # Get ID
    # Tuple starts with (ID,
    # find first comma
    comma_idx = t_str.find(',')
    if comma_idx != -1:
        pid = t_str[1:comma_idx].strip()
        if pid in target_ids:
            name = target_ids[pid]
            print(f"Found post {pid} ({name})!")
            
            # Extract fields
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
            
            if len(fields) > 4:
                post_content = fields[4].replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\').replace('\\r\\n', '\n').replace('\\n', '\n')
                filename = f"{pid}_{name.lower().replace(' ', '_')}.txt"
                out_path = os.path.join(out_dir, filename)
                with open(out_path, 'w', encoding='utf-8') as out_f:
                    out_f.write(post_content)
                print(f"Saved to {out_path}")
