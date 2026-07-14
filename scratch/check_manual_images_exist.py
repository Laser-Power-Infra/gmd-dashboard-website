import os

uploads_dir = r"c:\Users\Alok Das\Desktop\gmdalui\public\uploads"

targets = [
    r"2025/06/engineer-working-factory-maintenance-evening-shift-with-focused-expression-scaled.jpg",
    r"2025/05/asian-engineer-wearing-safety-helmet-with-checking-train-maintenance_33794-229.avif",
    r"2025/05/GettyImages-886057348.webp",
    r"2025/06/industrial-pipes-and-valves-controlling-flow-in-a-processing-plant-photo.jpg",
    r"2025/06/colleagues-with-safety-equipment-working-with-blueprints.jpg"
]

print("Checking files:")
for t in targets:
    full_path = os.path.join(uploads_dir, t.replace('/', os.sep))
    exists = os.path.exists(full_path)
    print(f"{t} -> {'EXISTS' if exists else 'NOT FOUND'} at {full_path}")
    if not exists:
        # Let's search in the directory for files containing the name
        filename = os.path.basename(t)
        # Search recursively
        for root, dirs, files in os.walk(uploads_dir):
            for f in files:
                if filename.lower() in f.lower() or f.lower() in filename.lower():
                    print(f"  Alternative found: {os.path.join(root, f)}")
