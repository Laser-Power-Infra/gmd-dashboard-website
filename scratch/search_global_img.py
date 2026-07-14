import os
import re

src_dir = "c:/Users/Alok Das/Desktop/gmdalui/src"
results = []
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(".css"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                matches = re.finditer(r"\bimg\s*\{([^}]+)\}", content, re.DOTALL | re.IGNORECASE)
                for m in matches:
                    results.append(f"{file}: img selector found:\n{m.group(0)}")

for r in results:
    print(r)
