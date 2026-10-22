# Proof that no rule is dropped: every non-empty line of CLAUDE.md must appear verbatim in CLAUDE.proposed.md or a moved file.
# usage (from the repo root): python3 design/proposals/coverage.py
import glob
L = open('CLAUDE.md').read().split('\n')
pool = set(open('design/proposals/CLAUDE.proposed.md').read().split('\n'))
for f in glob.glob('design/proposals/moved/*.md'): pool |= set(open(f).read().split('\n'))
miss = [(i + 1, l) for i, l in enumerate(L) if l.strip() and l not in pool]
print(f'{len(L)} lines in CLAUDE.md, {len(miss)} not found verbatim'); [print(m) for m in miss]
