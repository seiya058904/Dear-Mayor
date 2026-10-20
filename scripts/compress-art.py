"""Reproduce pixel-identical runtime art; originals are never changed.
Requires the existing Pillow installation (not a game/build dependency).
"""
from pathlib import Path
import hashlib
import json
from PIL import Image

root = Path(__file__).resolve().parent.parent
rows = []
for name in ['background', 'note', 'paper', 'paper-mobile', 'approve', 'reject', 'defer', 'written_reply']:
    source = root / 'public' / 'art' / (name + '.png')
    target = source.with_suffix('.webp')
    with Image.open(source) as original:
        original.save(target, format='WEBP', lossless=True, method=6, exact=True)
        with Image.open(target) as compressed:
            assert original.convert('RGBA').tobytes() == compressed.convert('RGBA').tobytes(), name
    rows.append(dict(name=name, pngBytes=source.stat().st_size, webpBytes=target.stat().st_size,
                     pngSHA256=hashlib.sha256(source.read_bytes()).hexdigest(),
                     webpSHA256=hashlib.sha256(target.read_bytes()).hexdigest(), rgbaEqual=True))
(root / 'docs' / 'V4-ART.json').write_text(json.dumps(rows, indent=2) + '\n', encoding='utf8')
print(sum(r['pngBytes'] - r['webpBytes'] for r in rows), 'bytes removed from first-install precache')
