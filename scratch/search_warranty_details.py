import re

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    print("Searching for posts containing 'Warranty Of'...")
    matches = re.finditer(r"Warranty Of [a-zA-Z\s]+", content, re.IGNORECASE)
    found = set()
    for m in matches:
        found.add(content[m.start():m.end()])
    print("Found titles:", found)
    
    print("\nSearching for posts with slug containing 'warranty'...")
    # Let's search for wp_posts insert statements and find posts with 'warranty'
    post_matches = re.finditer(r"('warranty[^']*')", content)
    found_slugs = set()
    for pm in post_matches:
        found_slugs.add(pm.group(1))
    print("Found slugs:", found_slugs)

    # Let's search for the text 'Warranty Of Valves'
    valves_matches = list(re.finditer(r"Warranty Of Valves", content, re.IGNORECASE))
    print(f"\nFound 'Warranty Of Valves' matches count: {len(valves_matches)}")
    if valves_matches:
        # Print surrounding text of the first match to see where it is
        start = max(0, valves_matches[0].start() - 500)
        end = min(len(content), valves_matches[0].end() + 2000)
        print("Surrounding content:")
        print("="*80)
        print(content[start:end])
        print("="*80)

except Exception as e:
    print("Error:", e)
