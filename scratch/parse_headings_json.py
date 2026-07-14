import re

content = open('scratch/warranty_content_raw.txt', encoding='utf-8').read()

# Let's find all occurrences of "text":"..." inside the comments
# We can match `"text":"(.*?)"` using regex
matches = re.findall(r'"text"\s*:\s*"(.*?)"', content, re.DOTALL)

print("Found text values:")
print("=" * 60)
for m in matches:
    # Decode escape sequences like \n, \u003c, etc.
    text = m.encode().decode('unicode-escape', errors='ignore')
    # Clean HTML tags
    text_clean = re.sub(r'<[^>]+>', '', text).strip()
    if text_clean:
        print(f"Text: '{text_clean}'")
print("=" * 60)
