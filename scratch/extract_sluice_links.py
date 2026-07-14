import re

file_path = r"c:\Users\Alok Das\Desktop\gmdalui\scratch\valves_pages\204_sluice_valves.txt"

try:
    content = open(file_path, 'r', encoding='utf-8').read()
    
    # Search for any href links in the file
    print("Searching for href attributes in 204_sluice_valves.txt:")
    hrefs = re.findall(r'href="([^"]*)"', content)
    for href in hrefs:
        print(f"  - {href}")
        
    print("\nSearching for any button or link text in 204_sluice_valves.txt:")
    # Look for link tags or text
    links = re.findall(r'<a[^>]*>(.*?)</a>', content, re.DOTALL)
    for link in links:
        print(f"  - {link.strip()}")
        
    # Let's search for wp:pagelayer elements that could be buttons or links
    print("\nSearching for btn or link elements inside PageLayer content:")
    btn_matches = re.findall(r'"link"\s*:\s*"([^"]*)"', content)
    for bm in btn_matches:
        print(f"  - Link parameter: {bm}")
        
    btn_text = re.findall(r'"button_text"\s*:\s*"([^"]*)"', content)
    for bt in btn_text:
        print(f"  - Button text: {bt}")

except Exception as e:
    print("Error:", e)
