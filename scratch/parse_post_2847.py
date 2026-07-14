import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

html_path = "scratch/post_2847_content.html"
content = open(html_path, 'r', encoding='utf-8').read()

# Let's strip the first comment line
# Find structural text like headings, lists, paragraphs
# Let's clean the HTML by extracting headings and paragraphs or lists
headings = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', content, re.DOTALL)
paras = re.findall(r'<p[^>]*>(.*?)</p>', content, re.DOTALL)
lists = re.findall(r'<ul[^>]*>(.*?)</ul>', content, re.DOTALL)

print(f"Post 2847 HTML elements found:")
print(f"  Headings: {len(headings)}")
print(f"  Paragraphs: {len(paras)}")
print(f"  Lists: {len(lists)}")

print("\n--- HEADINGS ---")
for h in headings:
    print(f"  - {re.sub(r'<[^>]+>', '', h).strip()}")

print("\n--- PARAGRAPHS ---")
for idx, p in enumerate(paras[:30]):
    txt = re.sub(r'<[^>]+>', '', p).strip()
    if txt:
        print(f"  {idx}: {txt}")

print("\n--- LIST ITEMS (from all lists) ---")
list_items = re.findall(r'<li[^>]*>(.*?)</li>', content, re.DOTALL)
print(f"Total list items found: {len(list_items)}")
for idx, li in enumerate(list_items):
    txt = re.sub(r'<[^>]+>', '', li).strip()
    print(f"  {idx+1}. {txt}")
