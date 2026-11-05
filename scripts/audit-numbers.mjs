// The daily audit's numbers, computed on GitHub (todo P3, 3 Nov 2026: Claude only writes the lesson, so daily runs read less).
// Runs after the nightly "Instagram collect": signs in like scripts/ig-collect.mjs, reads every channel's numbers from /api/perf and
// prints, per channel, the last 7 days as short bullets (numbers first, simple English) plus one line AUDIT_CHANNELS={...} that is
// ready to use as the audit card's "channels" (scripts/post-card.mjs). The daily run reads that line from the log instead of the raw data.
// A second line, AUDIT_SIGNALS={...}, holds the last 30 days' signals per channel (best posting hour, best format, reels with the biggest
// follower gains): the daily run plans topics, hooks and timing from it. From 5 Nov 2026 it also holds the audience (top countries and cities of
// followers and of reached viewers, the IST hours followers are online), follows per reel where Instagram gives them, and the early signal per reel
// (reach at the first collect ~6 h after posting vs ~24 h later: "slow start" or "late climber"; a 6 h number alone must not kill a topic).
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

// signals as data (Growth step 3, 3 Nov 2026): what the last 30 days say, for the daily run to plan by instead of memory:
// the posting hour (IST) with the best median reach, the reels that came with the biggest follower gains, and the format (captions.json
// "concept" before " · ") with the best median reach. Only patterns with 2+ reels count.
export function signals(d, today) {
  const { account = [], media = [], runs = [] } = d;
  const from = new Date(Date.parse(today + 'T00:00:00Z') - 30 * DAY).toISOString().slice(0, 10), out = {};
  const seen = media.filter((m) => m.posted_at && m.reach != null && istDay(m.posted_at) > from);
  const groupBest = (key) => { const g = {}; seen.forEach((m) => { const k = key(m); if (k != null) (g[k] = g[k] || []).push(m.reach); });
    return Object.entries(g).filter(([, v]) => v.length >= 2).map(([k, v]) => [k, Math.round(med(v)), v.length]).sort((a, b) => b[1] - a[1]); };
  const hours = groupBest((m) => Math.floor(((Date.parse(m.posted_at) + IST) % DAY) / 36e5));
  if (hours.length) out.bestHour = { hourIST: +hours[0][0], medianReach: hours[0][1], reels: hours[0][2], others: hours.slice(1, 4).map((h) => ({ hourIST: +h[0], medianReach: h[1] })) };
  const fmtB = groupBest((m) => { const c = CAPS[m.template_id]; return c && c.concept ? c.concept.split(' · ')[0] : null; });
  if (fmtB.length) out.bestFormat = { format: fmtB[0][0], medianReach: fmtB[0][1], reels: fmtB[0][2] };
  const f = {}; account.forEach((r) => { if (r.followers != null) f[r.day] = r.followers; });
  const prev = (d) => new Date(Date.parse(d + 'T00:00:00Z') - DAY).toISOString().slice(0, 10);
  out.followerReels = seen.map((m) => { const d = istDay(m.posted_at), c = CAPS[m.template_id] || {}; return f[d] != null && f[prev(d)] != null ? { day: d, gain: f[d] - f[prev(d)], reach: m.reach, reel: c.concept || m.template_id || '' } : null; })
    .filter(Boolean).sort((a, b) => b.gain - a.gain).slice(0, 3);
  const label = (m) => m.template_id || (m.caption || '').split('\n')[0].slice(0, 40);
  const lastRun = {}; runs.forEach((r) => { if (r.follows != null && (!lastRun[r.ig_id] || r.at > lastRun[r.ig_id].at)) lastRun[r.ig_id] = r; });
  const fr = media.filter((m) => lastRun[m.ig_id] && m.posted_at && istDay(m.posted_at) > from).sort((a, b) => lastRun[b.ig_id].follows - lastRun[a.ig_id].follows).slice(0, 5);
  if (fr.length) out.followsByReel = fr.map((m) => ({ reel: label(m), follows: lastRun[m.ig_id].follows, reach: lastRun[m.ig_id].reach }));
  const e = early(d, today); Object.assign(out, audience(d), e ? { early: e } : {});
  return out;
}

// audience (latest stored day): top 5 countries and cities of followers and of reached viewers, and the 6 busiest IST hours of followers online
export function audience({ audience: a } = {}) {
  const rows = (a && a.rows) || [], out = {};
  const top = (metric, breakdown, n = 5) => rows.filter((r) => r.metric === metric && r.breakdown === breakdown && r.value != null).sort((x, y) => y.value - x.value).slice(0, n).map((r) => [r.k, r.value]);
  for (const [key, metric] of [['followers', 'follower_demographics'], ['reached', 'reached_audience_demographics']])
    for (const b of ['country', 'city']) { const t = top(metric, b); if (t.length) out[`${key}Top${b === 'country' ? 'Countries' : 'Cities'}`] = t; }
  const on = top('online_followers', 'hour_ist', 6); if (on.length) out.onlineHoursIST = on.map(([h, v]) => `${h} (${v})`);
  if (Object.keys(out).length) out.audienceDay = a.day;
  return out;
}

// early signal: per reel posted in the last 14 days, the first reading >= 4 h after posting (normally the next collect, ~6 h) and the first one
// >= 20 h after that. Readings are the per-run rows (ig_media_runs) plus the older daily rows (ig_metrics, taken ~01:45 IST that day).
export function early({ media = [], runs = [], daily = [] }, today) {
  const from = Date.parse(today + 'T00:00:00Z') - 14 * DAY, read = {};
  const add = (id, at, reach) => { if (reach != null && Number.isFinite(at)) (read[id] = read[id] || []).push([at, reach]); };
  runs.forEach((r) => add(r.ig_id, Date.parse(r.at), r.reach));
  daily.forEach((r) => add(r.ig_id, Date.parse(r.day + 'T01:45:00+05:30'), r.reach));
  const rows = media.filter((m) => m.posted_at && Date.parse(m.posted_at) >= from && read[m.ig_id]).map((m) => {
    const t0 = Date.parse(m.posted_at), rs = read[m.ig_id].sort((a, b) => a[0] - b[0]);
    const e = rs.find(([at]) => at - t0 >= 4 * 36e5); if (!e || e[0] - t0 > 18 * 36e5) return null;
    const l = rs.find(([at]) => at - e[0] >= 20 * 36e5);
    return { reel: m.template_id || (m.caption || '').split('\n')[0].slice(0, 40), postedIST: new Date(t0 + IST).toISOString().slice(5, 16).replace('T', ' '),
      earlyH: Math.round((e[0] - t0) / 36e5), early: e[1], ...(l ? { laterH: Math.round((l[0] - t0) / 36e5), later: l[1], x: Math.round(10 * l[1] / Math.max(1, e[1])) / 10 } : {}) };
  }).filter(Boolean);
  const mE = med(rows.map((r) => r.early));
  rows.forEach((r) => { r.flag = r.x == null ? (r.early < 0.6 * mE ? 'slow start, wait for 24 h' : 'pending 24 h') : r.x >= 2 ? 'late climber' : r.early < 0.6 * mE ? 'slow start' : r.early >= mE ? 'fast start' : 'steady'; });
  return rows.length ? { medianEarly: Math.round(mE), reels: rows } : null;
}

async function load() {
  if (fx > 0) return JSON.parse(readFileSync(process.argv[fx + 1], 'utf8'));
  const { BASIC_AUTH_USER: u, BASIC_AUTH_PASS: p } = process.env;
  if (!u || !p) { console.error('✗ BASIC_AUTH_USER / BASIC_AUTH_PASS are not set'); process.exit(1); }
  const login = await fetch(SITE + '/login', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ username: u, password: p }) });
  const cookie = (login.headers.getSetCookie?.() || [login.headers.get('set-cookie') || '']).map((c) => c.split(';')[0]).filter(Boolean).join('; ');
  const data = {};
  for (const [k, c] of Object.entries(CH)) {
    const r = await fetch(`${SITE}/api/perf?days=60&extra=1&account=${encodeURIComponent(String(c.username || '').replace(/^@/, ''))}`, { headers: { Cookie: cookie } });
    if (!r.ok) { console.error(`✗ ${k}: /api/perf answered ${r.status}`); continue; }
    data[k] = await r.json();
  }
  return data;
}

const data = await load(), today = istDay(new Date().toISOString()), channels = {};
for (const k of Object.keys(CH)) if (data[k]) channels[k] = week(data[k], today);
for (const [k, a] of Object.entries(channels)) { console.log(`AUDIT ${k} (${CH[k].username}), 7 days to ${today}:`); a.forEach((l) => console.log('  - ' + l)); }
console.log('AUDIT_CHANNELS=' + JSON.stringify(channels));
const sig = {}; for (const k of Object.keys(CH)) if (data[k]) sig[k] = signals(data[k], today);
console.log('AUDIT_SIGNALS=' + JSON.stringify(sig));
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, '### Audit numbers, 7 days to ' + today + '\n' + Object.entries(channels).map(([k, a]) => `**${CH[k].username}**\n` + a.map((l) => '- ' + l).join('\n')).join('\n\n') + '\n');
