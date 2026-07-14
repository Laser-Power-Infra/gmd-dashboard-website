import re

content = open('scratch/warranty_content_raw.txt', encoding='utf-8').read()

pattern = re.compile(r'<(h[1-6]|p)[^>]*>(.*?)</\1>', re.DOTALL)
matches = pattern.findall(content)

with open('scratch/warranty_outline.txt', 'w', encoding='utf-8') as out:
    out.write("PAGE OUTLINE:\n")
    out.write("=" * 60 + "\n")
    for tag, text in matches:
        clean_text = re.sub(r'<[^>]+>', '', text).strip()
        if clean_text:
            out.write(f"<{tag}> {clean_text}\n")
            out.write("-" * 40 + "\n")
    out.write("=" * 60 + "\n")

print("Outline written to scratch/warranty_outline.txt!")
