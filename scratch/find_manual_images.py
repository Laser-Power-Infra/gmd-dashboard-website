import re

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"
slug = "manual-of-sluice-valve"

try:
    content = open(sql_path, 'r', encoding='utf-8', errors='ignore').read()
    
    pos = content.find(f"'{slug}'")
    if pos != -1:
        start = max(0, pos - 15000)
        end = min(len(content), pos + 15000)
        sub = content[start:end]
        
        # Let's extract any URLs containing "/uploads/" or image IDs like "ele_bg_img":XXX
        print("Searching for images in Sluice Valve manual SQL...")
        # Match "ele_bg_img":XXX or similar fields in JSON
        bg_imgs = re.findall(r'"ele_bg_img"\s*:\s*(\d+|"[^"]+")|image\\":\\"(.*?)\\"|img\s+src=[\'"]([^\'"]+)', sub)
        print("Found image references:", bg_imgs)
        
        # Match full URLs containing /uploads/
        urls = re.findall(r'https?://[^\s\'",]+\.(?:jpg|png|webp|gif|jpeg)', sub)
        print("Found image URLs:", set(urls))
        
        # Let's check wp_posts attachments mapping. In WordPress, images are attached to posts, or referenced by ID.
        # Let's look for ID references like 523, 524 etc. in the SQL.
        # Let's search for specific attachment rows.
        # We can find all integers that might represent image attachments.
        img_ids = re.findall(r'"(?:ele_bg_img|img|ele_img|image_img|ele_bg_img-full-url|ele_bg_img-thumbnail-url)"\s*:\s*(\d+|"[^"]+")', sub)
        print("Found image IDs in PageLayer attributes:", img_ids)
        
        # Let's print PageLayer JSON keys matching images
        pl_images = re.findall(r'"[^"]*img[^"]*"\s*:\s*("[^"]*"|\d+)', sub)
        print("Found PageLayer keys containing 'img':", pl_images)
        
except Exception as e:
    print("Error:", e)
