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
        
        # Let's search for any words ending in .jpg, .png, .webp, .jpeg
        img_files = re.findall(r'[a-zA-Z0-9_\-\.\/%]+?\.(?:jpg|png|webp|jpeg)', sub, re.IGNORECASE)
        print("Found image files in substring:")
        for img in set(img_files):
            print("-", img)
            
except Exception as e:
    print("Error:", e)
