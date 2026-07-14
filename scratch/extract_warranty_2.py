import sys

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    slug = 'warranty-of-sluice-valve-2'
    pos = content.find(f"'{slug}'")
    if pos == -1:
        pos = content.find(f'"{slug}"')
        
    if pos == -1:
        print("Slug not found.")
        sys.exit(0)
        
    print(f"Found slug at char {pos}")
    start = max(0, pos - 15000)
    end = min(len(content), pos + 10000)
    
    # Save the chunk to a text file to read it
    with open(r"c:\Users\Alok Das\Desktop\gmdalui\scratch\warranty_2_chunk.txt", 'w', encoding='utf-8') as f:
        f.write(content[start:end])
    print("Saved chunk around slug to scratch/warranty_2_chunk.txt")
    
except Exception as e:
    print("Error:", e)
