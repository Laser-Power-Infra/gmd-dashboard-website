import os
import re

src_dir = "c:/Users/Alok Das/Desktop/gmdalui/src"
patterns = [
    r"z-index",
    r"deco-block",
    r"about-graphics-deco",
    r"about-image-card",
    r"about-graphics-img"
]

results = []
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(".css"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
                for i, line in enumerate(lines):
                    for pattern in patterns:
                        if re.search(pattern, line):
                            results.append(f"{file}:{i+1}: {line.strip()}")

for r in results:
    print(r)
