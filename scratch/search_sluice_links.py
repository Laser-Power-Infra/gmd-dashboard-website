import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    terms = ['alternative-of-sluice-valves', 'butterfly-valves-vs-sluice-valves', 'warranty-of-sluice-valve']
    
    for term in terms:
        print(f"\nSearching for references to '{term}':")
        # Find all wpzm_posts insert rows (enclosed in parentheses) containing the term
        # but NOT where it is the post_name itself (meaning, look for references in other posts' content)
        matches = re.finditer(re.escape(term), content)
        count = 0
        for m in matches:
            pos = m.start()
            # Let's extract around it
            sub = content[max(0, pos - 15000):min(len(content), pos + 5000)]
            # Check if this row is for a different post.
            # Look for post_name or post_title in the row
            slug_match = re.search(r"'\d+',\s*'publish',.*?'([^']*)'\)", sub)
            # Find row start
            row_starts = [ms.start() for ms in re.finditer(r"\(\d+,\s*\d+,", sub)]
            start_idx = -1
            for r_start in row_starts:
                if r_start < (pos - max(0, pos - 15000)):
                    start_idx = r_start
                else:
                    break
            
            if start_idx != -1:
                row_end_matches = [ms.start() for ms in re.finditer(r"\)(?:,\s*\(|;)", sub[start_idx:])]
                if row_end_matches:
                    row_str = sub[start_idx : start_idx + row_end_matches[0] + 1]
                    # Check post_name in row
                    fields = re.findall(r"'((?:[^'\\]|\\.)*)'", row_str)
                    post_name = ""
                    post_title = ""
                    for f in fields:
                        if f in ['page', 'post', 'nav_menu_item']:
                            # Let's see if we can identify post_name
                            pass
                    # Let's just print a short snippet around the match
                    print(f"  Reference found at char {pos}:")
                    snippet = sub[max(0, pos - max(0, pos - 15000) - 200): min(len(sub), pos - max(0, pos - 15000) + 200)]
                    print(f"    Snippet: ... {snippet.strip()[:300]} ...")
                    count += 1
        print(f"Found {count} references.")
        
except Exception as e:
    print("Error:", e)
