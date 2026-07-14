import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    # Print the first 500 characters of the file to see the header
    print("FIRST 500 CHARS OF SQL DUMP:")
    print(content[:500])
    
    # Search for CREATE TABLE statements
    print("\nSEARCHING FOR CREATE TABLE STATEMENTS:")
    create_table_matches = re.finditer(r"CREATE TABLE\s+[`\"']?([a-zA-Z0-9_]+)[`\"']?", content, re.IGNORECASE)
    tables = set()
    for m in create_table_matches:
        tables.add(m.group(0))
        
    print(f"Found {len(tables)} tables:")
    for t in sorted(tables):
        print(f"  {t}")
        
except Exception as e:
    print("Error:", e)
