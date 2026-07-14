import re

raw_file = "scratch/warranty_raw_records.txt"
content = open(raw_file, encoding='utf-8').read()

slugs = [
    "warranty-2",
    "warranty-of-regulating-valves",
    "warranty-of-check-valve",
    "warranty-of-automated-valves",
    "warranty-of-pressure-relief-and-safety",
    "warranty-of-sluice-valve",
    "warranty-of-manual-valve",
    "warranty-of-speciality-valves",
    "warranty-of-tamper-proof-kinetic-valve",
    "warranty-of-non-return-valves",
    "warranty-of-control-valve",
    "warranty-of-air-valve"
]

out = open("scratch/warranty_clean_output.txt", "w", encoding="utf-8")

# Split by the separator "SLUG: "
sections = content.split("========================================")
for sec in sections:
    if "SLUG:" not in sec:
        continue
    # Extract slug name
    slug_match = re.search(r"SLUG:\s*([^\n]+)", sec)
    if not slug_match:
        continue
    slug_name = slug_match.group(1).strip()
    
    out.write(f"\n============================================================\n")
    out.write(f"SLUG: {slug_name}\n")
    out.write(f"============================================================\n")
    
    # We want to extract text. We can find all instances of '"text":"(.*?)"' inside the section
    text_matches = re.finditer(r'"text"\s*:\s*"(.*?)"', sec, re.DOTALL)
    texts = []
    for m in text_matches:
        raw_text = m.group(1)
        # Decode Unicode escapes
        try:
            decoded = raw_text.encode().decode('unicode-escape', errors='ignore')
        except:
            decoded = raw_text
        # Clean HTML
        clean = re.sub(r'<[^>]+>', ' ', decoded)
        # Remove extra whitespace
        clean = re.sub(r'\s+', ' ', clean).strip()
        if clean and clean not in texts:
            texts.append(clean)
            
    for t in texts:
        out.write(f"{t}\n")

print("Parsed clean texts to scratch/warranty_clean_output.txt")
