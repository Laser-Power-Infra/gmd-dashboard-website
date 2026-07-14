import os

image_dir = r"c:\Users\Alok Das\Desktop\gmdalui\public\valve img"
images = sorted([f for f in os.listdir(image_dir) if f.endswith('.png')])

keywords = [
    "butterfly", "gate", "sluice", "check", "reflux", 
    "air", "globe", "ball", "reducing", "prv", 
    "foot", "safety", "relief", "tamper", "lock", "strainer"
]

for img_name in images:
    path = os.path.join(image_dir, img_name)
    try:
        with open(path, 'rb') as f:
            data = f.read(200000) # Read first 200KB of binary headers
            found = []
            for kw in keywords:
                if kw.encode('utf-8') in data.lower() or kw.encode('ascii') in data.lower():
                    found.append(kw)
            print(f"File: {img_name} -> Found: {found}")
    except Exception as e:
        print(f"Error reading {img_name}: {e}")
