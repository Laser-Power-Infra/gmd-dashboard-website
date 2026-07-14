import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    # Search for INSERT INTO and wp_posts
    # We will search for the first 3 occurrences of INSERT INTO ... wp_posts
    matches = list(re.finditer(r"INSERT INTO\s+[`\"']?wp_posts[`\"']?", content, re.IGNORECASE))
    print(f"Found {len(matches)} matches of 'INSERT INTO wp_posts'")
    
    for idx, m in enumerate(matches[:3]):
        start = m.start()
        end = min(len(content), start + 500)
        print(f"\nMatch {idx + 1} (position {start}):")
        print(content[start:end])
        
except Exception as e:
    print("Error:", e)
