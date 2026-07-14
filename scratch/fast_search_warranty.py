import os

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

if not os.path.exists(sql_path):
    print("SQL backup file does not exist at:", sql_path)
    exit(1)

print("Fast scanning SQL file line-by-line for 'warranty'...")
matches_count = 0
with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    for line_num, line in enumerate(f, 1):
        if 'warranty' in line.lower():
            matches_count += 1
            print(f"Match #{matches_count} on line {line_num}!")
            
            # Print index positions of matches in the line
            idx = 0
            while True:
                idx = line.lower().find('warranty', idx)
                if idx == -1:
                    break
                start = max(0, idx - 150)
                end = min(len(line), idx + 1500)
                print(f"Context around index {idx}:")
                print(line[start:end])
                print("-" * 100)
                idx += len('warranty')
                
            if matches_count >= 10:
                print("Too many matches, stopping.")
                break
