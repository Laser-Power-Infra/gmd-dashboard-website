sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    slug = "warranty-of-check-valve"
    pos = content.find(f"'{slug}'")
    if pos != -1:
        print(f"Found '{slug}' at position {pos}")
        # Print 2000 chars before and 2000 chars after
        start = max(0, pos - 2000)
        end = min(len(content), pos + 2000)
        print("Surrounding content:")
        print("="*80)
        print(content[start:end])
        print("="*80)
    else:
        print(f"Slug '{slug}' not found in content!")
except Exception as e:
    print("Error:", e)
