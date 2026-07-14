import re

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"
slug = "manual-of-sluice-valve"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    pos = content.find(f"'{slug}'")
    if pos != -1:
        start = max(0, pos - 18000)
        end = min(len(content), pos + 2000)
        sub = content[start:end]
        
        # Let's find all URLs containing '/uploads/' or standard image paths
        urls = re.findall(r'https?://[^\s\'",]+\.(?:jpg|png|webp|gif|jpeg)', sub)
        print("Found image URLs:")
        for url in set(urls):
            print("-", url)
            
        # Let's also look for image IDs in JSON structure
        img_ids = re.findall(r'"ele_bg_img"\s*:\s*(\d+)|"ele_img"\s*:\s*(\d+)|"image_img"\s*:\s*(\d+)', sub)
        flat_ids = [i for tup in img_ids for i in tup if i]
        print("\nFound image IDs:", set(flat_ids))
        
        # For each image ID, search the SQL dump to find the original file path
        # Attachment records in wp_posts usually look like: (ID, ..., 'attachment', 'image/jpeg', ...)
        # and there is an entry in wp_postmeta with meta_key = '_wp_attached_file' and meta_value = YYYY/MM/filename.jpg
        for img_id in set(flat_ids):
            # Search for (img_id, in wp_posts
            attach_matches = list(re.finditer(rf"\({img_id},\s*\d+,\s*'\d{{4}}-\d{{2}}-\d{{2}} \d{{2}}:\d{{2}}:\d{{2}}'", content))
            if attach_matches:
                print(f"\nAttachment metadata for ID {img_id}:")
                for am in attach_matches:
                    p = am.start()
                    e_p = content.find('),\n(', p)
                    if e_p == -1:
                        e_p = content.find(');', p)
                    print(content[p:e_p])
            
            # Also search wp_postmeta for _wp_attached_file
            meta_matches = list(re.finditer(rf"\(\d+,\s*{img_id},\s*'_wp_attached_file',\s*'([^']+)'\)", content))
            for mm in meta_matches:
                print(f"Meta attached file for ID {img_id}:", mm.group(1))
                
except Exception as e:
    print("Error:", e)
