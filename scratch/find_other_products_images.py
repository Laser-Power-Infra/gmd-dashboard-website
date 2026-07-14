import re
import os

sql_path = r"C:\Users\Alok Das\Downloads\gmdalui_backup\sqldump.sql"
out_path = r"c:\Users\Alok Das\Desktop\gmdalui\scratch\other_products_images.txt"

queries = [
    "others product",
    "stainless-steel-expansion-joint-250x250",
    "Basket-strainers-1200x900",
    "stainless-steel-304-wnrtj-flanges-250x250",
    "th_valvula-compuerta-tipo-317-econosto",
    "Proximity-switch-wafer-butterfly-valve",
    "es000405-sistomat-e",
    "DVC6200_thumbnail",
    "Gasket-1",
    "1551376438007",
    "special-control-trim-250x250",
    "71KZpfFB6HL._AC_UF894", # search prefix
    "165420", # part of Screenshot 2025-05-16 165420
    "182615", # part of Screenshot 2025-05-16 182615
    "F-TOP-1671_series-digital_valve_position_feedback_unit"
]

print("Searching SQL dump for other products images...")
results = {}

# Also scan public folder directly to see what we have
public_images = []
for root, dirs, files in os.walk("public"):
    for f in files:
        public_images.append((f, os.path.join(root, f)))

with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        # Check queries
        for q in queries:
            if q.lower() in line.lower():
                # Try to extract the image path (containing uploads/)
                match = re.search(r"'(2025/\d{2}/[^'\"]+\.(?:png|jpg|jpeg|webp))'", line)
                if match:
                    results[q] = match.group(1)
                    print(f"Matched query '{q}' -> {match.group(1)}")

# For queries not matched, let's search public_images
print("\nChecking public images for remaining queries...")
for q in queries:
    if q not in results:
        # search files
        for f, full_path in public_images:
            if q.lower() in f.lower():
                # get path after public/
                rel_path = full_path.replace("public\\", "").replace("\\", "/")
                results[q] = rel_path
                print(f"Matched in public '{q}' -> {rel_path}")

with open(out_path, 'w', encoding='utf-8') as out_f:
    for q, path in sorted(results.items()):
        out_f.write(f"{q} -> /{path}\n")

print(f"Results saved to {out_path}")
