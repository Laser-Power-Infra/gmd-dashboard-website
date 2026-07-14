import re

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"
slug = "manual-of-sluice-valve"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    pos = content.find(f"'{slug}'")
    if pos != -1:
        start = max(0, pos - 18000)
        end = min(len(content), pos + 2000)
        sub = content[start:end]
        
        # Let's find all occurrences of "wp:pagelayer/pl_image"
        # and extract the json block inside it, and look for "id":XXX or id:XXX
        matches = re.finditer(r'wp:pagelayer/pl_image\s*({.*?})', sub)
        img_ids = []
        for m in matches:
            js_str = m.group(1).replace('\\"', '"').replace("\\'", "'")
            # Find "id":number or "id":"number"
            id_match = re.search(r'"id"\s*:\s*(\d+|"[^"]+")', js_str)
            if id_match:
                img_id = id_match.group(1).replace('"', '')
                img_ids.append(img_id)
                
        print("Found image IDs in Sluice Valve manual:", img_ids)
        
        # Now find the files in wp_postmeta where meta_key = '_wp_attached_file' for these IDs
        for iid in img_ids:
            # Let's search wp_postmeta rows: usually (meta_id, post_id, meta_key, meta_value)
            # Row looks like: (1234, iid, '_wp_attached_file', '2025/04/filename.jpg')
            meta_pattern = rf"\(\d+,\s*{iid},\s*'_wp_attached_file',\s*'([^']+)'\)"
            m_match = re.search(meta_pattern, content)
            if m_match:
                print(f"ID {iid} -> {m_match.group(1)}")
            else:
                # Let's do a broader search for `iid` in quotes or digits in wp_postmeta insert lines
                broad_pat = rf"\(\d+,\s*{iid},\s*'_wp_attachment_metadata',\s*'([^']+)'\)"
                b_match = re.search(broad_pat, content)
                if b_match:
                    print(f"ID {iid} metadata -> {b_match.group(1)[:200]}")
                else:
                    print(f"ID {iid} -> Path not found in database metadata.")
                    
except Exception as e:
    print("Error:", e)
