import os
from PIL import Image

image_path = "c:/Users/Alok Das/Desktop/gmdalui/public/uploads/2025/04/banner-image3.jpg"
if not os.path.exists(image_path):
    # Try relative path search in workspace
    for root, dirs, files in os.walk("c:/Users/Alok Das/Desktop/gmdalui"):
        if "banner-image3.jpg" in files:
            image_path = os.path.join(root, "banner-image3.jpg")
            break

print("Image path:", image_path)
if os.path.exists(image_path):
    try:
        with Image.open(image_path) as img:
            print("Format:", img.format)
            print("Size:", img.size)
            print("Mode:", img.mode)
    except Exception as e:
        print("Error reading image:", e)
else:
    print("Image not found in public folder!")
