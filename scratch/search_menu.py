import sys
import re

# Reconfigure stdout to use UTF-8
sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    print("Searching for 'sluice' in URLs and menu item titles...")
    matches_slugs = re.finditer(r"'[^']*sluice[^']*'", content, re.IGNORECASE)
    slugs = set()
    for m in matches_slugs:
        slugs.add(m.group(0))
    print(f"Found {len(slugs)} occurrences of 'sluice' in strings:")
    for slug in sorted(slugs):
        print(f"  {slug}")

except Exception as e:
    print("Error:", e)
