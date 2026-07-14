import re
import os

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"
out_path = r"c:\Users\Alok Das\Desktop\gmdalui\scratch\valve_images_paths.txt"

image_ids = {
    '752', '753', '754', '755', '757', '725', '713', '712', '741', '739', 
    '580', '604', '745', '599', '764', '1907', '694', '605', '1353', '1774', 
    '1790', '1803', '607', '1429', '1454', '1478', '1510', '1532', '612', 
    '1720', '1733', '1745', '1761'
}

print("Reading SQL dump to find image paths...")
paths_found = {}

with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        # Check if line contains attachment meta or post meta
        # Attachment file meta format in SQL is: (ID, post_id, '_wp_attached_file', 'path/to/file.jpg')
        # We can search for each image ID as post_id
        for pid in image_ids:
            # Look for e.g. (some_id, pid, '_wp_attached_file', 'some_path')
            # Let's use simple string search
            pattern1 = f",'{pid}','_wp_attached_file'"
            pattern2 = f", {pid}, '_wp_attached_file'"
            pattern3 = f"({pid}," # if the attachment itself is post with ID pid in wp_posts
            
            if pattern1 in line or pattern2 in line:
                print(f"Matched metadata line for ID {pid}")
                # let's parse path
                # line has e.g. (meta_id, post_id, '_wp_attached_file', 'value')
                # Let's search for the value
                match = re.search(r"'_wp_attached_file'\s*,\s*'([^']+)'", line)
                if match:
                    paths_found[pid] = match.group(1)
                    print(f"ID {pid} path: {match.group(1)}")
            
            if pid not in paths_found and f"({pid}," in line:
                # Check if it's the post row for the attachment which might contain the guid URL
                # Row looks like (pid, author, date, ..., guid, ...)
                # Let's search for GUID url in the line
                match = re.search(r"'(https?://[^']+/wp-content/uploads/([^']+))'", line)
                if match:
                    paths_found[pid] = match.group(2)
                    print(f"ID {pid} path from GUID: {match.group(2)}")

# If there are missing IDs, let's look for them specifically in wp_postmeta insert
# INSERT INTO `wpzm_postmeta` VALUES ...
with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if 'INSERT INTO `wpzm_postmeta` VALUES' in line:
            for pid in image_ids:
                if pid not in paths_found:
                    # Search for `(meta_id, pid, '_wp_attached_file', 'value')`
                    # Since it's a huge line, let's find all occurrences of `_wp_attached_file`
                    # and parse surrounding values.
                    idx = 0
                    while True:
                        idx = line.find("'_wp_attached_file'", idx)
                        if idx == -1:
                            break
                        # Scan backwards to find the start of the tuple
                        # Tuple starts with `(meta_id, post_id,`
                        tuple_start = line.rfind('(', 0, idx)
                        if tuple_start != -1:
                            tuple_part = line[tuple_start:idx+150]
                            # match `(\d+,\s*pid,`
                            m = re.match(r'\(\d+,\s*(\d+),\s*\'_wp_attached_file\'\s*,\s*\'([^\']+)\'', tuple_part)
                            if m and m.group(1) == pid:
                                paths_found[pid] = m.group(2)
                                print(f"Found postmeta ID {pid} path: {m.group(2)}")
                        idx += 19

with open(out_path, 'w', encoding='utf-8') as out_f:
    for pid, path in sorted(paths_found.items()):
        out_f.write(f"ID: {pid} -> /uploads/{path}\n")

print(f"Results saved to {out_path}")
