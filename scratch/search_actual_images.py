import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

uploads_dir = r"c:\Users\Alok Das\Desktop\gmdalui\public\uploads"

keywords = ["diligently", "hard-hat", "safety", "glasses", "dim", "lighting", "machinery", "work", "crane", "cargo", "shipyard", "discussion", "mother", "circuit", "inspector", "troubleshoot", "celebration", "futuristic", "deep", "learning"]

print("Scanning files:")
found_count = 0
for root, dirs, files in os.walk(uploads_dir):
    for f in files:
        # Check if any keyword matches
        matched_kws = [kw for kw in keywords if kw.lower() in f.lower()]
        if matched_kws or "54a3" in f or "getty" in f.lower() or "pipes" in f.lower():
            rel_path = os.path.relpath(os.path.join(root, f), uploads_dir)
            print(f"File: {rel_path} | Matched keywords: {matched_kws}")
            found_count += 1

print(f"Total matching files found: {found_count}")
