import os

image_dir = r"c:\Users\Alok Das\Desktop\gmdalui\public\valve img"
images = sorted([f for f in os.listdir(image_dir) if f.endswith('.png')])

html_content = """<!DOCTYPE html>
<html>
<head>
    <title>Verify Valve Images</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f0f2f5; margin: 20px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .card { background: white; border: 1px solid #ccc; padding: 15px; border-radius: 8px; text-align: center; }
        img { max-width: 100%; height: 250px; object-fit: contain; }
        h3 { margin: 10px 0 5px 0; }
        p { color: #666; font-size: 0.9em; margin: 0; }
    </style>
</head>
<body>
    <h1>Verify Valve Images Chronological Order</h1>
    <div class="grid">
"""

for i, img_name in enumerate(images):
    html_content += f"""
        <div class="card">
            <img src="/valve img/{img_name}" alt="{img_name}">
            <h3>Image {i+1}</h3>
            <p>{img_name}</p>
        </div>
    """

html_content += """
    </div>
</body>
</html>
"""

with open(r"c:\Users\Alok Das\Desktop\gmdalui\public\test_images.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML test file created successfully.")
