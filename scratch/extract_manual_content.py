import re

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"
slug = "manual-of-sluice-valve"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    pos = content.find(f"'{slug}'")
    if pos == -1:
        print("Slug not found.")
    else:
        # Find start of record
        start_pos = content.rfind('\n(', 0, pos)
        if start_pos == -1:
            start_pos = max(0, pos - 15000)
            
        end_pos = content.find('),\n(', pos)
        if end_pos == -1:
            end_pos = content.find(');', pos)
            
        record = content[start_pos:end_pos]
        
        # Extract post_content
        date_matches = list(re.finditer(r"'\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}'", record))
        if len(date_matches) >= 2:
            content_start = date_matches[1].end() + 2
            title_pat = r"'(Manual Of [^']+)'"
            title_match = re.search(title_pat, record, re.IGNORECASE)
            if title_match:
                content_end = title_match.start() - 2
                post_content = record[content_start:content_end]
            else:
                post_content = record[content_start:pos-50]
        else:
            post_content = record
            
        # Clean PageLayer comments
        clean_content = re.sub(r'<!--.*?-->', '', post_content, flags=re.DOTALL)
        clean_content = clean_content.replace(r'\"', '"').replace(r"\'", "'").replace(r'\n', '\n').replace(r'\r', '\r')
        
        with open("scratch/manual_sluice_valve_clean.txt", "w", encoding="utf-8") as f:
            f.write(clean_content.strip())
            
        print("Successfully saved clean manual content to scratch/manual_sluice_valve_clean.txt")
        
        # Let's inspect first 1000 characters
        print("\nFirst 1000 characters of clean content:")
        print("="*60)
        print(clean_content[:1500])
        print("="*60)
        
except Exception as e:
    print("Error:", e)
