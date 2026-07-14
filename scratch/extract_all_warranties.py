import re
import json

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # We want to find wp_posts table insert statements.
    # The insert statements look like: INSERT INTO `wp_posts` VALUES (...);
    # To parse them easily, we can find sections of wp_posts inserts.
    # Let's search for post title and content for posts that match our slugs list.
    slugs = [
        "warranty",
        "warranty-of-regulating-valves",
        "warranty-of-check-valve",
        "warranty-of-automated-valves",
        "warranty-2",
        "warranty-of-pressure-relief-and-safety",
        "warranty-of-sluice-valve",
        "warranty-of-manual-valve",
        "warranty-of-speciality-valves",
        "warranty-of-sluice-valve-2",
        "warranty-of-tamper-proof-kinetic-valve",
        "warranty-of-non-return-valves",
        "warranty-of-control-valve",
        "warranty-of-air-valve"
    ]
    
    out_file = open("scratch/warranty_all_data.txt", "w", encoding="utf-8")
    
    # Let's search wp_posts records. Since it's SQL dump, each line might contain multiple values,
    # or the whole insert statement is in one line. Let's find insert statement for `wp_posts`
    inserts = re.findall(r"INSERT INTO `wp_posts` VALUES (.*?);", content, re.DOTALL)
    print(f"Found {len(inserts)} wp_posts insert statements.")
    
    # We can split the values by standard SQL insert parsing or find individual records.
    # Values look like: (1,2,'content','title',...,'post_name',...)
    # Since records are separated by ),( we can split by that, keeping in mind strings might contain parenthesized values.
    # Let's find matches for each slug specifically in the file.
    for slug in slugs:
        # Match where the slug is in quotes as the post_name (usually the 12th or so field)
        # Let's search for the line or record that contains the slug.
        pattern = rf"\([^()]*?'{slug}'[^()]*?\)"
        # Sometimes post contents have parentheses. Let's use a simpler check: search for the slug and extract
        # the surrounding record in the sql.
        print(f"\nSearching for slug: {slug}")
        out_file.write(f"\n========================================\nSLUG: {slug}\n========================================\n")
        
        # Find where the slug is.
        matches = list(re.finditer(rf"'{slug}'", content))
        for m in matches:
            # Let's look backward to find the beginning of the record '(' and forward to find ')'
            pos = m.start()
            # Find matching parent record start/end in insert statement
            # A rough way: find nearest `(ID,` or just print 4000 characters before and after.
            # Even better: print the wp_posts row content.
            # Let's find the insert statement containing this position.
            # We can just extract a substring around the slug position.
            start = max(0, pos - 6000)
            end = min(len(content), pos + 10000)
            sub = content[start:end]
            
            # Find the title and the text of this post
            # The title of the post is near.
            # Let's extract all `"text":"(.*?)"` in this substring
            text_matches = re.findall(r'"text"\s*:\s*"(.*?)"', sub, re.DOTALL)
            out_file.write(f"TEXT VALUES IN RECORD:\n")
            for tm in text_matches:
                txt = tm.encode().decode('unicode-escape', errors='ignore')
                txt_clean = re.sub(r'<[^>]+>', '', txt).strip()
                if txt_clean:
                    out_file.write(f"- {txt_clean}\n")
            
            # Let's also search for image links like /uploads/
            img_matches = re.findall(r'src=\\"(.*?)\\"|image\\":\\"(.*?)\\"|img\s+src=[\'"]([^\'"]+)', sub)
            out_file.write(f"IMAGES IN RECORD:\n")
            for im in img_matches:
                for path in im:
                    if path:
                        out_file.write(f"- {path}\n")
                        
    print("Done. Saved results to scratch/warranty_all_data.txt")
except Exception as e:
    print("Error:", e)
