import re

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    slugs = [
        "warranty-2",
        "warranty-of-regulating-valves",
        "warranty-of-check-valve",
        "warranty-of-automated-valves",
        "warranty-of-pressure-relief-and-safety",
        "warranty-of-sluice-valve",
        "warranty-of-manual-valve",
        "warranty-of-speciality-valves",
        "warranty-of-tamper-proof-kinetic-valve",
        "warranty-of-non-return-valves",
        "warranty-of-control-valve",
        "warranty-of-air-valve"
    ]
    
    out_file = open("scratch/warranty_raw_records.txt", "w", encoding="utf-8")
    
    for slug in slugs:
        print(f"Searching raw for: {slug}")
        out_file.write(f"\n========================================\nSLUG: {slug}\n========================================\n")
        
        matches = list(re.finditer(rf"'{slug}'", content))
        print(f"Matches count for {slug}: {len(matches)}")
        for m in matches:
            pos = m.start()
            # Let's search backward for the insert statement starting: usually there is a row start like (ID,
            # Let's find the nearest '(' before the slug that is followed by digits and a comma.
            # Or simpler: let's extract 15000 characters around the slug to capture the entire row.
            start = max(0, pos - 8000)
            end = min(len(content), pos + 2000)
            sub = content[start:end]
            
            # Let's write the raw context to a file
            out_file.write(sub)
            out_file.write("\n\n######################################################################\n\n")
            
    print("Saved raw records to scratch/warranty_raw_records.txt")
except Exception as e:
    print("Error:", e)
