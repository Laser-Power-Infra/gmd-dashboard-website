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

published_warranty_ids = {
    '2847': 'Sluice Valve',
    '2868': 'Check Valve',
    '2884': 'Air Valve',
    '2898': 'Non-Return Valves',
    '2908': 'Manual Valve',
    '2925': 'Tamper Proof/Kinetic Valve',
    '2932': 'Control Valve',
    '2943': 'Regulating Valves',
    '2959': 'Automated Valves',
    '2979': 'Pressure Relief And Safety',
    '3000': 'Speciality Valves'
}

for tid, name in published_warranty_ids.items():
    print(f"\n=======================================================")
    print(f"VALVE: {name} (ID: {tid})")
    print(f"=======================================================")
    fields = parse_row_by_id(tid)
    if not fields:
        print("Not found.")
        continue
    
    p_content = fields[4].encode().decode('unicode-escape', errors='ignore').replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\').replace('\\r\\n', '\n').replace('\\n', '\n')
    
    # Let's find all headings/sections using the comment block syntax we discovered:
    # <!-- wp:pagelayer/pl\n_heading ... "text":"..."
    headings = []
    heading_blocks = re.findall(r'<!--\s*wp:pagelayer/pl\s*_heading\s*(.*?)\s*-->', p_content, re.DOTALL)
    for hb in heading_blocks:
        text_match = re.search(r'"text"\s*:\s*"(.*?)"', hb)
        if text_match:
            txt = text_match.group(1).encode().decode('unicode-escape', errors='ignore')
            txt_clean = re.sub(r'<[^>]+>', '', txt).strip().replace('&nbsp;', ' ')
            if txt_clean and 'warranty' not in txt_clean.lower():
                headings.append(txt_clean)
                
    print("Sections found:", headings)
    
    # Also parse paragraphs to check if it's the duplicate butterfly content:
    # Butterfly content starts with: "1. Free from defects in material and workmanship. 2. Leakage-free operation..."
    paras = re.findall(r'<p[^>]*>(.*?)</p>', p_content, re.DOTALL)
    if paras:
        first_para = re.sub(r'<[^>]+>', '', paras[0]).strip()
        print("First paragraph excerpt:", first_para[:120])
        is_duplicate_bf = "Leakage-free operation within rated pressure" in first_para or "misalignment during installation between flanges" in first_para
        print("Is duplicate of Butterfly Valve template?", is_duplicate_bf)
        
        # Save parsed clean format for manual inspection or copying
        clean_out = []
        for idx, h in enumerate(headings):
            clean_out.append(f"### {h}")
            # usually there is a pair of inclusions and exclusions for each heading
            # let's write them down
            p_idx_inc = idx * 2
            p_idx_exc = idx * 2 + 1
            if p_idx_inc < len(paras):
                inc_text = re.sub(r'<[^>]+>', '', paras[p_idx_inc]).strip()
                clean_out.append("Inclusions:")
                clean_out.append(inc_text)
            if p_idx_exc < len(paras):
                exc_text = re.sub(r'<[^>]+>', '', paras[p_idx_exc]).strip()
                clean_out.append("Exclusions:")
                clean_out.append(exc_text)
            clean_out.append("-" * 30)
            
        with open(f"scratch/clean_warranty_{tid}.txt", "w", encoding="utf-8") as out_f:
            out_f.write("\n".join(clean_out))
            
    print("=" * 60)
