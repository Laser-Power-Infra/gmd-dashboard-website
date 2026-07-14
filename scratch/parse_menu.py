import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    # Let's find post type 'nav_menu_item'
    # Typically, posts in WordPress sql dump look like:
    # INSERT INTO `wp_posts` VALUES (ID, post_author, post_date, ..., post_title, ..., post_type, ...)
    # Let's write a regex to find all posts and filter for nav_menu_item or check their metadata.
    # Alternatively, look at wp_postmeta where meta_key is '_menu_item_url' or '_menu_item_menu_item_parent'
    
    print("Searching for _menu_item_url in wp_postmeta...")
    meta_url_matches = re.finditer(r"'_menu_item_url',\s*'([^']*)'", content)
    urls = set()
    for m in meta_url_matches:
        urls.add(m.group(1))
    
    print(f"Found {len(urls)} menu item URLs:")
    for url in sorted(urls):
        print(f"  {url}")

except Exception as e:
    print("Error:", e)
