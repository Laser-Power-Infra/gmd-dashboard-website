import re
import json

content = open('scratch/warranty_content_raw.txt', encoding='utf-8').read()

# Let's find all <!-- wp:pagelayer/... {...} --> comments
matches = re.findall(r'<!-- wp:pagelayer/\w+ (\{.*?\}) -->', content)

print("All text found in JSON comments:")
print("=" * 60)
for m in matches:
    try:
        data = json.loads(m)
        text = data.get('text', '')
        if text:
            text_clean = re.sub(r'<[^>]+>', '', text).strip().replace('\n', ' ')
            print(f"Text: '{text_clean}'")
    except Exception as e:
        pass
print("=" * 60)
