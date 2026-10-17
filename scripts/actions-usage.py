#!/usr/bin/env python3
# GitHub Actions usage for this repo (owner, 17 Oct 2026: "keep check of gh actions usage").
#   python3 -I scripts/actions-usage.py [--since YYYY-MM-DD]     (default: the 1st of this month, UTC)
# Counts every job's minutes rounded UP per job, the way GitHub bills private repos (2,000 free minutes a month on the Free plan).
# While the repo is public these minutes are free; the count shows what we would use if it goes private again.
import json, math, sys, urllib.request, datetime as D, collections, concurrent.futures as C
REPO = 'imshekharsingh/aquariit-templates'
since = sys.argv[sys.argv.index('--since') + 1] if '--since' in sys.argv else D.date.today().replace(day=1).isoformat()
def get(u):
    with urllib.request.urlopen(urllib.request.Request(u, headers={'Accept': 'application/vnd.github+json'})) as r: return json.load(r)
f = lambda s: D.datetime.fromisoformat(s.replace('Z', '+00:00'))
runs, page = [], 1
while True:
    b = get(f'https://api.github.com/repos/{REPO}/actions/runs?per_page=100&page={page}&created=%3E%3D{since}').get('workflow_runs', [])
    runs += b; page += 1
    if len(b) < 100: break
def mins(r):
    js = get(f"https://api.github.com/repos/{REPO}/actions/runs/{r['id']}/jobs?per_page=100").get('jobs', [])
    return r, sum(math.ceil(max(0, (f(j['completed_at']) - f(j['started_at'])).total_seconds()) / 60) for j in js if j.get('started_at') and j.get('completed_at'))
with C.ThreadPoolExecutor(12) as ex: res = list(ex.map(mins, runs))
by, day = collections.defaultdict(lambda: [0, 0]), collections.defaultdict(int)
for r, m in res: by[r['name']][0] += 1; by[r['name']][1] += m; day[r['created_at'][:10]] += m
total = sum(day.values())
print(f'Actions minutes since {since}: {total} (private-repo allowance 2,000/month; {max(0, 2000 - total)} left if private)')
for k, (n, m) in sorted(by.items(), key=lambda x: -x[1][1]): print(f'  {m:6} min  {n:4} runs  {k}')
print('  per day:', ', '.join(f'{d[5:]} {m}' for d, m in sorted(day.items())))
