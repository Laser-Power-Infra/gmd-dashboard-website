"""Convert public/ PNG/JPEG images to resized WebP and rewrite source references.

Usage: python scripts/optimize-images.py
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
MAX_SIDE = 1600
QUALITY = 80
SRC_DIRS = ["app", "components", "lib", "data", "styles"]
SRC_EXTS = {".ts", ".tsx", ".js", ".jsx", ".css", ".json"}

renames = {}
before = after = 0
for src in sorted(PUBLIC.rglob("*")):
    if src.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
        continue
    dst = src.with_suffix(".webp")
    assert not dst.exists(), f"refusing to overwrite {dst}"
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        im.thumbnail((MAX_SIDE, MAX_SIDE))
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "A" in im.getbands() or "transparency" in im.info else "RGB")
        im.save(dst, "WEBP", quality=QUALITY, method=6)
    before += src.stat().st_size
    after += dst.stat().st_size
    src.unlink()
    renames["/" + src.relative_to(PUBLIC).as_posix()] = "/" + dst.relative_to(PUBLIC).as_posix()

for d in SRC_DIRS:
    for f in (ROOT / d).rglob("*"):
        if f.suffix not in SRC_EXTS or not f.is_file():
            continue
        text = f.read_text(encoding="utf-8")
        new = text
        for old, rep in renames.items():
            new = new.replace(old, rep)
        if new != text:
            f.write_text(new, encoding="utf-8")
            print("updated", f.relative_to(ROOT))

print(f"{len(renames)} images: {before / 1e6:.1f} MB -> {after / 1e6:.1f} MB")
