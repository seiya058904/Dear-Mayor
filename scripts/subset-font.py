"""Offline asset authoring, not an npm/build dependency.
Run: uv run --no-project --with 'fonttools[woff]==4.60.1' python scripts/subset-font.py
Keep the original font and OFL; only the web-delivery copy is subsetted.
"""
from pathlib import Path
import hashlib
import json
import subprocess
import fontTools
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen

root = Path(__file__).resolve().parent.parent
source = root / 'public/fonts/wenkai.woff2'
target = root / 'public/fonts/wenkai-game.woff2'
inventory = json.loads(subprocess.check_output(['node', 'scripts/font-characters.mjs'], cwd=root))
original = TTFont(source, recalcTimestamp=False)
cmap = original.getBestCmap()
needed = set(inventory['codepoints'])
options = subset.Options()
options.layout_features = ['*']
options.name_IDs = ['*']
options.name_legacy = True
options.name_languages = ['*']
options.notdef_outline = True
options.recommended_glyphs = True
options.glyph_names = True
options.recalc_timestamp = False
options.canonical_order = True
font = TTFont(source, recalcTimestamp=False)
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=needed & cmap.keys())
subsetter.subset(font)
font.flavor = 'woff2'
font.save(target)

# Verify the serialized result, including every retained outline, advance,
# side bearing and glyph hint instruction. Preserve global metrics/hinting.
result = TTFont(target, recalcTimestamp=False)
result_cmap = result.getBestCmap()
assert needed & cmap.keys() <= result_cmap.keys()
source_glyphs, result_glyphs = original.getGlyphSet(), result.getGlyphSet()
for cp, name in result_cmap.items():
    old_name = cmap[cp]
    before, after = DecomposingRecordingPen(source_glyphs), DecomposingRecordingPen(result_glyphs)
    source_glyphs[old_name].draw(before)
    result_glyphs[name].draw(after)
    assert before.value == after.value, f'Outline changed: U+{cp:04X}'
    for table in ['hmtx', 'vmtx']:
        assert original[table][old_name] == result[table][name], (cp, table)
    def instructions(f, glyph):
        program = getattr(f['glyf'][glyph], 'program', None)
        return program.getBytecode() if program else b''
    assert instructions(original, old_name) == instructions(result, name), cp
for table in ['hhea', 'vhea']:
    for field in ['ascent', 'descent', 'lineGap']:
        assert getattr(original[table], field) == getattr(result[table], field)
for table in ['prep', 'gasp']:
    assert original[table].compile(original) == result[table].compile(result)
assert original['head'].unitsPerEm == result['head'].unitsPerEm
report = {
    'tool': f'fontTools {fontTools.__version__}',
    'sourceSHA256': hashlib.sha256(source.read_bytes()).hexdigest(),
    'subsetSHA256': hashlib.sha256(target.read_bytes()).hexdigest(),
    'sourceBytes': source.stat().st_size, 'subsetBytes': target.stat().st_size,
    'sourceCodepoints': len(cmap), 'retainedCodepoints': len(result_cmap),
    'characters': ''.join(chr(cp) for cp in sorted(result_cmap)),
    'originalUnsupported': ''.join(chr(cp) for cp in sorted(needed - cmap.keys())),
    'outlinesMetricsAndHintsEqual': True,
    'sourceFiles': inventory['files'],
}
(root / 'scripts/font-coverage.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
print(json.dumps({k: v for k, v in report.items() if k not in ['characters', 'sourceFiles']}, ensure_ascii=True, indent=2))
