import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

html_path = "scratch/post_2847_content.html"
content = open(html_path, 'r', encoding='utf-8').read()

# Let's find all comment blocks starting with wp:
comments = re.findall(r'<!--\s*(wp:[a-zA-Z0-9/-]+)\s*(.*?)\s*-->', content)
print(f"Total comments found: {len(comments)}")

# Print unique block names
block_names = set(c[0] for c in comments)
print("Unique block names:", block_names)

# Let's search specifically for texts inside these comments or around them
# Let's print comments containing names of valve types or "Manual", "Pneumatic", "Hydraulic", "Electrical"
for idx, (bname, bdata) in enumerate(comments):
    for keyword in ["manual", "pneumatic", "hydraulic", "electric", "actuator", "sluice"]:
        if keyword in bdata.lower() or keyword in bname.lower():
            print(f"\nComment #{idx}: {bname}")
            print(bdata[:300])
            break
