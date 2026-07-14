import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    slugs = ['alternative-of-sluice-valves', 'butterfly-valves-vs-sluice-valves', 'warranty-of-sluice-valve']
    
    for slug in slugs:
        print(f"\n=======================================================")
        print(f"SEARCHING FOR SLUG: {slug}")
        print(f"=======================================================")
        pos = content.find(f"'{slug}'")
        if pos == -1:
            print("Not found.")
            continue
            
        # Let's find the insert statement containing this slug
        # A row in wp_posts usually has the post_content somewhere before the slug
        # Let's print around the slug position to examine
        start = max(0, pos - 10000)
        end = min(len(content), pos + 5000)
        sub = content[start:end]
        
        # Let's search for the post_title and post_content in the SQL row format
        # wp_posts columns: ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, ...
        # Let's print matches of text or html inside
        print("Extracting potential content matches:")
        # Let's find all text inside wp_posts values
        # Rows usually look like: INSERT INTO `wp_posts` VALUES (ID, 1, '...', '...', 'post_content_here', 'post_title_here', ...)
        # Let's find insert block
        insert_match = re.search(r"INSERT INTO `wp_posts` VALUES.*?;", sub, re.DOTALL)
        if insert_match:
            insert_str = insert_match.group(0)
            # Find values within parentheses
            # Since the insert can contain multiple rows, let's look for the row containing our slug
            rows = re.split(r"\),\s*\(", insert_str)
            for row in rows:
                if slug in row:
                    print(f"Found matching row for {slug} (length: {len(row)})")
                    # Let's clean and print the text or paragraph blocks inside the row
                    paras = re.findall(r'<p>(.*?)</p>', row)
                    headings = re.findall(r'<h[1-6]>(.*?)</h[1-6]>', row)
                    
                    print("\nHeadings found:")
                    for h in headings:
                        print(f"  - {h}")
                        
                    print("\nParagraphs found:")
                    for p in paras:
                        clean_p = re.sub(r'<[^>]+>', '', p)
                        print(f"  - {clean_p}")
        else:
            # Fallback: just search for plain text patterns
            print("Could not isolate insert block, printing raw text snippet:")
            snippet = content[pos-2000:pos+2000]
            print(snippet[:1000])

except Exception as e:
    print("Error:", e)
