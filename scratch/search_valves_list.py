import os
import re

artifacts_dir = "C:/Users/Alok Das/.gemini/antigravity/brain/47c6052a-36fc-45ce-914b-1ad54976f6f2"
results = []
for root, dirs, files in os.walk(artifacts_dir):
    for file in files:
        if file.endswith((".txt", ".md", ".jsonl")):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                # Find occurrences of valves or products
                matches = re.findall(r"(?:sluice|air|check|non-return|butterfly|globe|gate)\s+valve[s]?", content, re.IGNORECASE)
                if matches:
                    results.append(f"{file}: {list(set(matches[:5]))}")

for r in results:
    print(r)
