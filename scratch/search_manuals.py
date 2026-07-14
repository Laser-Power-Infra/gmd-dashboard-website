import re

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    print("Searching for slugs containing 'manual'...")
    matches = re.finditer(r"'manual-[^']*'", content)
    found_slugs = set()
    for m in matches:
        found_slugs.add(m.group(0))
    print("Found slugs:", found_slugs)
    
    # Let's search for wp_posts insert statements containing 'manual-of-sluice-valve'
    pos = content.find("'manual-of-sluice-valve'")
    if pos != -1:
        print(f"\nFound 'manual-of-sluice-valve' at position {pos}")
        start = max(0, pos - 15000)
        end = min(len(content), pos + 15000)
        sub = content[start:end]
        
        # Let's extract clean text from this post to see what it contains
        text_matches = re.findall(r'"text"\s*:\s*"(.*?)"', sub, re.DOTALL)
        print("\nParsed text content for manual-of-sluice-valve:")
        print("="*80)
        for tm in text_matches:
            try:
                decoded = tm.encode().decode('unicode-escape', errors='ignore')
            except:
                decoded = tm
            clean = re.sub(r'<[^>]+>', ' ', decoded)
            clean = re.sub(r'\s+', ' ', clean).strip()
            if clean:
                print(clean)
        print("="*80)
        
except Exception as e:
    print("Error:", e)
