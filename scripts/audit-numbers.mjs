// The daily audit's numbers, computed on GitHub (todo P3, 3 Nov 2026: Claude only writes the lesson, so daily runs read less).
// Runs after the nightly "Instagram collect": signs in like scripts/ig-collect.mjs, reads every channel's numbers from /api/perf and
// prints, per channel, the last 7 days as short bullets (numbers first, simple English) plus one line AUDIT_CHANNELS={...} that is
// ready to use as the audit card's "channels" (scripts/post-card.mjs). The daily run reads that line from the log instead of the raw data.
//   env:  BASIC_AUTH_USER / BASIC_AUTH_PASS, SITE_BASE (default https://templates.aquariit.com)
// Usage: node scripts/audit-numbers.mjs [--fixture file.json]   (a fixture { web: { account, media }, ... } skips the site, for tests)
import { readFileSync, appendFileSync } from 'node:fs';
const SITE = (process.env.SITE_BASE || 'https://templates.aquariit.com').replace(/\/$/, '');
const fx = process.argv.indexOf('--fixture'), DAY = 864e5, IST = 5.5 * 36e5;
const CH = JSON.parse(readFileSync(new URL('../templates/channels/channels.json', import.meta.url), 'utf8'));
const CAPS = JSON.parse(readFileSync(new URL('../templates/showreels/captions.json', import.meta.url), 'utf8'));
const istDay = (iso) => new Date(Date.parse(iso) + IST).toISOString().slice(0, 10);
const dm = (d) => new Date(d.slice(0, 10) + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const fmt = (n) => Math.round(n).toLocaleString('en-IN'), one = (n) => (n >= 10 ? Math.round(n) : Math.round(n * 10) / 10).toString();
const med = (a) => { const v = a.filter((x) => x != null).sort((x, y) => x - y); if (!v.length) return null; const h = v.length >> 1; return v.length % 2 ? v[h] : (v[h - 1] + v[h]) / 2; };

// what one channel did in the 7 days to `today` (IST): the bullets for the card
export function week({ account = [], media = [] }, today) {
  const from = new Date(Date.parse(today + 'T00:00:00Z') - 7 * DAY).toISOString().slice(0, 10), out = [];
  const acc = account.filter((r) => r.followers != null).sort((a, b) => (a.day < b.day ? -1 : 1));
  if (acc.length) { const now = acc[acc.length - 1], base = acc.filter((r) => r.day <= from).pop() || acc[0], d = now.followers - base.followers;
    out.push(`${fmt(now.followers)} followers (${d >= 0 ? '+' : ''}${fmt(d)} since ${dm(base.day)})`); }
  const wk = media.filter((m) => m.posted_at && istDay(m.posted_at) > from && istDay(m.posted_at) <= today);
  const seen = wk.filter((m) => m.reach != null);
  if (!wk.length) { out.push('0 reels posted in 7 days'); return out; }
  out.push(`${wk.length} reel${wk.length === 1 ? '' : 's'} posted, ${seen.length} with reach; median reach ${seen.length ? fmt(med(seen.map((m) => m.reach))) : '–'}`);
  const watch = med(seen.map((m) => (m.watch_avg_ms != null && m.duration_s ? m.watch_avg_ms / 10 / m.duration_s : null)));
  const avgS = med(seen.map((m) => (m.watch_avg_ms != null ? m.watch_avg_ms / 1000 : null)));
  if (watch != null) out.push(`avg watch ${one(avgS)} s, ${Math.round(watch)}% of the reel (median)`);
  const reach = seen.reduce((a, m) => a + m.reach, 0), saves = seen.reduce((a, m) => a + (m.saves || 0), 0), shares = seen.reduce((a, m) => a + (m.shares || 0), 0);
  if (reach) out.push(`${fmt(saves)} saves, ${fmt(shares)} shares (${one(saves * 1000 / reach)} and ${one(shares * 1000 / reach)} per 1,000 reached)`);
  const best = seen.slice().sort((a, b) => b.reach - a.reach)[0];
  if (best) { const c = CAPS[best.template_id] || {}, what = c.concept || (best.caption || '').split('\n')[0].slice(0, 60);
    out.push(`best: ${fmt(best.reach)} reached, ${dm(istDay(best.posted_at))}, ${what}${best.saves ? `, ${fmt(best.saves)} saves` : ''}`); }
  return out;
}

async function load() {
  if (fx > 0) return JSON.parse(readFileSync(process.argv[fx + 1], 'utf8'));
  const { BASIC_AUTH_USER: u, BASIC_AUTH_PASS: p } = process.env;
  if (!u || !p) { console.error('✗ BASIC_AUTH_USER / BASIC_AUTH_PASS are not set'); process.exit(1); }
  const login = await fetch(SITE + '/login', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ username: u, password: p }) });
  const cookie = (login.headers.getSetCookie?.() || [login.headers.get('set-cookie') || '']).map((c) => c.split(';')[0]).filter(Boolean).join('; ');
  const data = {};
  for (const [k, c] of Object.entries(CH)) {
    const r = await fetch(`${SITE}/api/perf?days=60&account=${encodeURIComponent(String(c.username || '').replace(/^@/, ''))}`, { headers: { Cookie: cookie } });
    if (!r.ok) { console.error(`✗ ${k}: /api/perf answered ${r.status}`); continue; }
    data[k] = await r.json();
  }
  return data;
}

const data = await load(), today = istDay(new Date().toISOString()), channels = {};
for (const k of Object.keys(CH)) if (data[k]) channels[k] = week(data[k], today);
for (const [k, a] of Object.entries(channels)) { console.log(`AUDIT ${k} (${CH[k].username}), 7 days to ${today}:`); a.forEach((l) => console.log('  - ' + l)); }
console.log('AUDIT_CHANNELS=' + JSON.stringify(channels));
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, '### Audit numbers, 7 days to ' + today + '\n' + Object.entries(channels).map(([k, a]) => `**${CH[k].username}**\n` + a.map((l) => '- ' + l).join('\n')).join('\n\n') + '\n');
