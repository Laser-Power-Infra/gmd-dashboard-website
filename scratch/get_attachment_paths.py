import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"

ids = [2305, 2306, 2308, 2309, 2311, 2312, 2313, 2315, 2193, 2194, 2284, 2198]

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    # We look for attachment metadata in wpzm_posts or wpzm_postmeta.
    # Typically, in wpzm_posts, attachment records have:
    # (ID, post_author, ..., 'attachment', ..., 'image/jpeg' or similar, 'url_path')
    # Or in wpzm_postmeta, the meta_key is '_wp_attached_file' and meta_value is '2025/04/image.jpg'
    # Let's search for meta rows containing the IDs and '_wp_attached_file'.
    # Format of insert into wpzm_postmeta is: (meta_id, post_id, meta_key, meta_value)
    
    print("Searching for attachment paths in wpzm_postmeta...")
    for image_id in ids:
        # Search for post_id = image_id and meta_key = '_wp_attached_file'
        # e.g., (1234, image_id, '_wp_attached_file', 'path')
        pattern = re.compile(r"\(\d+,\s*" + str(image_id) + r",\s*'_wp_attached_file',\s*'([^']*)'\)")
        m = pattern.search(content)
        if m:
            print(f"ID {image_id} -> /uploads/{m.group(1)}")
        else:
            # Try to search for it as a post in wpzm_posts
            # (image_id, ..., 'attachment', ..., 'guid_url')
            # Let's check guid (URL) in posts row
            pos = content.find(f"({image_id},")
            if pos != -1:
                sub = content[pos:pos+2000]
                guid_match = re.search(r"'(https?://[^']*)'", sub)
                if guid_match:
                    print(f"ID {image_id} (from posts guid) -> {guid_match.group(1)}")
                else:
                    print(f"ID {image_id} -> Found post row, but no guid url found.")
            else:
                print(f"ID {image_id} -> Not found in dump.")
                
except Exception as e:
    print("Error:", e)
