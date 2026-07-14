import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

html_path = "scratch/post_2847_content.html"
content = open(html_path, 'r', encoding='utf-8').read()

# Let's search for pl-heading tags or elements
# E.g. <!-- wp:pagelayer/pl-heading ... -->
# Let's find all occurrences of pl-heading json options or html headings
heading_blocks = re.findall(r'<!-- wp:pagelayer/pl-heading\s*(.*?)\s*-->', content)
print(f"Found {len(heading_blocks)} heading comment blocks:")
for hb in heading_blocks:
    # try to print the text option
    text_match = re.search(r'"text"\s*:\s*"(.*?)"', hb)
    if text_match:
        text = text_match.group(1).encode().decode('unicode-escape', errors='ignore')
        print(f"  - COMMENT TEXT: {text}")
        
# Let's also print any raw HTML h1-h6 tags with their attributes and inner HTML
tags = re.findall(r'(<h[1-6][^>]*>.*?</h[1-6]>)', content, re.DOTALL)
print(f"\nFound {len(tags)} raw HTML heading tags:")
for t in tags:
    print(f"  - TAG: {repr(t)}")
