import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    # We want to find wp_posts rows
    # Rows in SQL look like: VALUES (ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, ...)
    # Let's extract post_title, post_name, post_type for posts containing 'sluice' in post_name or post_title
    print("Finding wp_posts rows containing 'sluice' in post_name or post_title:")
    
    # Let's search for the values inside wp_posts inserts.
    # We can search for lines containing "INSERT INTO `wp_posts` VALUES" and split them by rows.
    # Alternatively, just search for regex matches of posts:
    # A post insert row is usually of form: (ID, author, 'date', 'date_gmt', 'content', 'title', 'excerpt', 'status', 'comment', 'ping', 'password', 'name', ...
    # Let's do a regex search for wp_posts insert lines
    lines = content.splitlines()
    posts_found = []
    
    for line in lines:
        if "INSERT INTO `wp_posts`" in line:
            # Split by parenthesized rows. Let's find rows using regex
            # Rows are of form: (ID, author, ...)
            # Since content can contain parentheses, we can do a split on "), (" or similar, or just search for post slugs
            # Let's find all slugs like 'manual-of-sluice-valve', etc.
            # Let's extract any matches of: (ID, ..., 'post_status', ..., 'post_type')
            # Let's look for known slugs
            pass

    # Let's use a simpler approach: search for the slug in single quotes and extract the surrounding 2000 chars
    # We want to find post titles and post types
    slug_pattern = re.compile(r"'([a-z0-9\-]*sluice[a-z0-9\-]*)'", re.IGNORECASE)
    slugs = set(slug_pattern.findall(content))
    print(f"Found slugs containing 'sluice': {slugs}")
    
    # Let's print the title and post type for each slug
    for slug in slugs:
        pos = content.find(f"'{slug}'")
        if pos != -1:
            snippet = content[max(0, pos - 15000):min(len(content), pos + 10000)]
            # Search for post title which usually appears near the slug in wp_posts
            # Let's look for 'publish' or post type 'page' or 'post' or 'nav_menu_item'
            # Let's look for title and post type inside the snippet
            # Example: ..., 'publish', 'open', 'open', '', 'slug-name', ..., 'post_type', ...
            # Let's try to extract the insert row containing the slug
            match = re.search(r"\(\d+,\s*\d+,\s*'[^']*',\s*'[^']*',\s*'(.*?)',\s*'(.*?)',\s*'[^']*',\s*'([^']*)',\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*'" + re.escape(slug) + r"',.*?'([^']*)'\)", snippet, re.DOTALL)
            if match:
                post_content, post_title, post_status, post_type = match.groups()
                # Clean up post_content length for printing
                print(f"\nSlug: {slug}")
                print(f"  Title: {post_title}")
                print(f"  Type: {post_type}")
                print(f"  Status: {post_status}")
                print(f"  Content length: {len(post_content)}")
            else:
                # Search using simpler regex
                print(f"\nSlug: {slug} (Row could not be fully parsed, searching fields...)")
                # Look for post_title and post_type in snippet
                title_match = re.search(r"'([^']*)',\s*'publish'", snippet)
                if title_match:
                    print(f"  Title guess: {title_match.group(1)}")
                
except Exception as e:
    print("Error:", e)
