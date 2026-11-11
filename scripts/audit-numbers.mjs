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
import { readFileSync, appendFileSync, readdirSync, existsSync } from 'node:fs';
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
  const watch = med(seen.map((m) => (m.watch_avg_ms != null && durOf(m) ? m.watch_avg_ms / 10 / durOf(m) : null)));
  const avgS = med(seen.map((m) => (m.watch_avg_ms != null ? m.watch_avg_ms / 1000 : null)));
  if (watch != null) out.push(`avg watch ${one(avgS)} s, ${Math.round(watch)}% of the reel (median)`);
  const reach = seen.reduce((a, m) => a + m.reach, 0), saves = seen.reduce((a, m) => a + (m.saves || 0), 0), shares = seen.reduce((a, m) => a + (m.shares || 0), 0);
  if (reach) out.push(`${fmt(saves)} saves, ${fmt(shares)} shares (${one(saves * 1000 / reach)} and ${one(shares * 1000 / reach)} per 1,000 reached)`);
  const best = seen.slice().sort((a, b) => b.reach - a.reach)[0];
  if (best) { const c = CAPS[best.template_id] || {}, what = c.concept || (best.caption || '').split('\n')[0].slice(0, 60);
    out.push(`best: ${fmt(best.reach)} reached, ${dm(istDay(best.posted_at))}, ${what}${best.saves ? `, ${fmt(best.saves)} saves` : ''}`); }
  return out;
}

// what drives reach (owner, 11 Nov 2026: "look at the audit enhancements so that we know if we have more data to check our progress"):
// per reel, the last 7 posted: reach, hold % (avg watch / reel length from its config; Instagram gives no length), skip % (reels_skip_rate, the share
// of plays skipped in the first 3 s, from the latest per-run reading's "extra"), saves and shares per 1,000 reached. Per channel: their medians and
// the account's last 7 days (Instagram collect's reach_wk_* / follows_wk rows): non-follower share of reach (discovery) and follows per 1,000 reached.
// Follows, profile visits and the follower split are NOT offered per reel (PROBE "reel follows: NOT AVAILABLE"), so those two are per account.
export function drivers({ media = [], runs = [], insights = [] }) {
  const skip = {};
  runs.forEach((r) => { let x = null; try { x = r.extra ? JSON.parse(r.extra) : null; } catch { /* not json */ }
    if (x && typeof x.reels_skip_rate === 'number' && (!skip[r.ig_id] || r.at > skip[r.ig_id].at)) skip[r.ig_id] = { at: r.at, v: x.reels_skip_rate }; });
  const reels = media.filter((m) => m.posted_at && m.reach).sort((a, b) => Date.parse(b.posted_at) - Date.parse(a.posted_at)).slice(0, 7).map((m) => {
    const dur = durOf(m), w = watchS(m), sk = skip[m.ig_id] ? skip[m.ig_id].v : null;
    return { reel: name(m), day: istDay(m.posted_at), reach: m.reach, watchS: w != null ? +one(w) : null, lenS: dur, holdPct: w != null && dur ? Math.round((100 * w) / dur) : null,
      skipPct: sk == null ? null : Math.round(sk <= 1 ? sk * 100 : sk), savesPer1k: +one((1000 * (m.saves || 0)) / m.reach), sharesPer1k: +one((1000 * (m.shares || 0)) / m.reach) };
  });
  const out = { reels };
  if (reels.length) out.last7 = { reels: reels.length, medianReach: Math.round(med(reels.map((r) => r.reach))), holdPct: med(reels.map((r) => r.holdPct)), skipPct: med(reels.map((r) => r.skipPct)),
    savesPer1k: med(reels.map((r) => r.savesPer1k)), sharesPer1k: med(reels.map((r) => r.sharesPer1k)) };
  const days = [...new Set(insights.filter((r) => /^reach_wk_/.test(r.metric)).map((r) => r.day))].sort(), day = days[days.length - 1];
  if (day) { const v = (k) => { const r = insights.find((x) => x.day === day && x.metric === k); return r ? r.value : null; };
    const nf = v('reach_wk_non_follower'), fo = v('reach_wk_follower'), tot = v('reach_wk_total') ?? ((nf || 0) + (fo || 0)), fw = v('follows_wk'), uf = v('unfollows_wk');
    out.discovery = { day, reach: tot, nonFollowerPct: nf != null && nf + (fo || 0) > 0 ? Math.round((100 * nf) / (nf + (fo || 0))) : null,
      follows: fw, unfollows: uf, followsPer1k: fw != null && tot ? +one((1000 * fw) / tot) : null }; }
  const b = [], L = out.last7, D = out.discovery;
  if (L) b.push(`last ${L.reels} reels (median): ${L.holdPct != null ? `hold ${Math.round(L.holdPct)}% of the reel, ` : ''}${L.skipPct != null ? `${Math.round(L.skipPct)}% skip in 3 s, ` : ''}${one(L.savesPer1k)} saves and ${one(L.sharesPer1k)} shares per 1,000 reached`);
  if (D) b.push(`discovery, 7 days: ${D.nonFollowerPct != null ? `${D.nonFollowerPct}% of ${fmt(D.reach)} reached were non-followers` : `${fmt(D.reach)} reached`}${D.follows != null ? `; ${one(D.followsPer1k || 0)} follows per 1,000 reached (+${D.follows}${D.unfollows != null ? `, -${D.unfollows}` : ''})` : ''}`);
  out.bullets = b;
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

// ---- Results checks (owner, 7 Nov 2026: "Who is going to check all of this?"): run inside every Instagram collect, so nobody has to remember.
// 1. TREND ALARM: the last 7 posted reels (24 h old or more) vs the channel target (design/targets.md) and the best 7-reel window of the
//    last 30 days. "ALARM <ch>: ..." when any target is missed, else "OK <ch>: ...". ESCALATE when it was already ALARM a day earlier
//    (the same check on the reels posted by then, with each reel's reach as read by then): the daily run must change topic type or format.
// 2. EXPERIMENT verdicts: a reel's config (or its captions.json entry, or a planned row in design/targets.md) carries
//    "experiment": {"id", "change", "vs": "median" | "<reel name>"}. At 24 h and 72 h after the post: reach then vs the median reach of the
//    channel's 7 reels before it at the same age → WIN | LOSE | TOO EARLY. 2 WINs of an id → PROMOTE (a rulebook rule), 2 LOSEs → DROP.
// 3. RULE CHECK: for the same 7 reels, which rulebook rules each passed in its review file (review/<ch>/<name>.md, item 1's
//    "rule N pass" list) next to its reach; a rule every reviewed reel passed while the channel is in ALARM is flagged "question it".
const ROOT = new URL('../', import.meta.url), rd = (p) => { try { return readFileSync(new URL(p, ROOT), 'utf8'); } catch { return ''; } };
const pct = (a, b) => (b ? Math.round((a / b - 1) * 100) : 0), sgn = (n) => (n >= 0 ? '+' : '') + n;
const cells = (l) => l.split('|').slice(1, -1).map((c) => c.trim());
// design/targets.md: the "Targets" table (Channel | Median reach | Avg watch (s) | Saves (%)) and the "Planned experiments" table
// (Channel | Post on | Post at | Id | Change | Vs); "–" or empty = no target. The owner can change either.
export function targets(md = rd('design/targets.md')) {
  const t = {}, planned = []; let sec = '';
  for (const l of md.split('\n')) {
    if (/^#+\s/.test(l)) sec = /planned/i.test(l) ? 'p' : /target/i.test(l) ? 't' : '';
    if (!/^\|/.test(l) || /^\|\s*-/.test(l) || /\|\s*Channel\s*\|/i.test(l)) continue;
    const c = cells(l), n = (x) => { const v = parseFloat(String(x || '').replace(/[,%s]/g, '')); return Number.isFinite(v) ? v : null; };
    if (sec === 't' && c[0]) t[c[0]] = { reach: n(c[1]), watch: n(c[2]), saves: n(c[3]) };
    if (sec === 'p' && c[3]) planned.push({ channel: c[0], postOn: c[1], postAt: c[2], id: c[3], change: c[4] || c[3], vs: c[5] || 'median' });
  }
  return { t, planned };
}
// reel configs by name (scripts/explainer, scripts/channel3, techreel/topics as showreel-tech-<slug>)
const CONFIGS = (() => { const o = {};
  for (const [dir, pre] of [['scripts/explainer/', ''], ['scripts/channel3/', ''], ['techreel/topics/', 'showreel-tech-']]) {
    let fs = []; try { fs = readdirSync(new URL(dir, ROOT)).filter((f) => f.endsWith('.json')); } catch { /* none */ }
    for (const f of fs) { try { const j = JSON.parse(rd(dir + f)); const name = pre ? pre + f.replace(/\.json$/, '') : j.name; if (name) o[name] = j; } catch { /* not a config */ } }
  }
  return o; })();
export function experimentOf(name, planned = targets().planned) {
  const c = CAPS[name] || {}, x = (CONFIGS[name] || {}).experiment || c.experiment;
  const p = planned.find((r) => r.channel === c.channel && r.postOn === c.postOn && r.postAt === c.postAt);
  // a planned row with the same id sets the baseline (E18: "reach 1546, watch 8.8", the glass reels' median), whatever the config says
  if (x && x.id) return { id: x.id, change: x.change || x.id, vs: p && p.id === x.id ? p.vs : x.vs || 'median' };
  return p ? { id: p.id, change: p.change, vs: p.vs, planned: true } : null;
}
// reach of a reel as read at time t (ms): the last per-run or daily reading at or before t; null if none
function readings({ runs = [], daily = [] }) {
  const r = {}; const add = (id, at, v) => { if (v != null && Number.isFinite(at)) (r[id] = r[id] || []).push([at, v]); };
  runs.forEach((x) => add(x.ig_id, Date.parse(x.at), x.reach)); daily.forEach((x) => add(x.ig_id, Date.parse(x.day + 'T01:45:00+05:30'), x.reach));
  Object.values(r).forEach((a) => a.sort((p, q) => p[0] - q[0]));
  return (m, t) => { const a = r[m.ig_id]; if (!a || !a.length) return Date.parse(m.posted_at) <= t ? m.reach : null; let v = null; for (const [at, x] of a) { if (at <= t) v = x; else break; } return v; };
}
const durOf = (m) => m.duration_s || (CONFIGS[m.template_id] || {}).dur || null;   // ig_media.duration_s is never filled; the config's "dur" is
const watchS = (m) => (m.watch_avg_ms != null ? m.watch_avg_ms / 1000 : null), saveP = (m) => (m.reach ? (100 * (m.saves || 0)) / m.reach : null);
const name = (m) => m.template_id || (m.caption || '').split('\n')[0].slice(0, 40);

export function checks(d, k, now = Date.now(), T = targets()) {
  const tg = T.t[k] || {}, at = readings(d), out = { lines: [] };
  const posted = (d.media || []).filter((m) => m.posted_at && m.reach != null).sort((a, b) => Date.parse(a.posted_at) - Date.parse(b.posted_at));
  // 1. trend alarm
  const judge = (t, reachOf) => {
    const pool = posted.filter((m) => Date.parse(m.posted_at) <= t - DAY), last = pool.slice(-7);
    if (!last.length) return null;
    const r = med(last.map(reachOf)), w = med(last.map(watchS)), s = med(last.map(saveP));
    const win = pool.filter((m) => Date.parse(m.posted_at) > t - 30 * DAY); let best = null;
    for (let i = 0; i <= Math.max(0, win.length - 7); i++) { const v = med(win.slice(i, i + 7).map(reachOf)); if (v != null && (best == null || v > best)) best = v; }
    const miss = [tg.reach != null && r < tg.reach, tg.watch != null && w != null && w < tg.watch, tg.saves != null && s != null && s < tg.saves];
    return { n: last.length, reach: r, watch: w, saves: s, best, alarm: miss.some(Boolean), reels: last };
  };
  const j = judge(now, (m) => m.reach), y = judge(now - DAY, (m) => at(m, now - DAY));
  if (j) {
    const parts = [`median reach ${fmt(j.reach)} over the last ${j.n} (target ${tg.reach != null ? fmt(tg.reach) : '–'}; best window ${j.best != null ? fmt(j.best) : '–'})`];
    if (j.watch != null) parts.push(`watch ${one(j.watch)} s (target ${tg.watch != null ? tg.watch : '–'})`);
    if (j.saves != null) parts.push(`saves ${one(j.saves)}% (target ${tg.saves != null ? tg.saves + '%' : '–'})`);
    out.trend = { status: j.alarm ? 'ALARM' : 'OK', reels: j.n, medianReach: Math.round(j.reach), watchS: j.watch != null ? +one(j.watch) : null, savesPct: j.saves != null ? +one(j.saves) : null, bestWindow: j.best != null ? Math.round(j.best) : null, target: tg };
    out.lines.push(`${out.trend.status} ${k}: ${parts.join('; ')}`);
    if (j.alarm && y && y.alarm) { out.trend.escalate = true; out.lines.push(`ESCALATE ${k}: ALARM two days in a row (yesterday median reach ${fmt(y.reach)}): change the topic type or the format today, not a tweak`); }
  }
  // 2. experiment verdicts (reels posted in the last 30 days)
  const verdicts = [];
  posted.filter((m) => Date.parse(m.posted_at) > now - 30 * DAY).forEach((m) => {
    const x = experimentOf(m.template_id, T.planned); if (!x) return;
    const t0 = Date.parse(m.posted_at), i = posted.indexOf(m), before = posted.slice(Math.max(0, i - 7), i);
    const base = /^showreel-/.test(x.vs) ? posted.filter((p) => p.template_id === x.vs) : before;
    // a fixed baseline ("reach 1546, watch 8.8[, saves 1.7]") compares with those numbers instead of the reels before it
    const fixedOf = (k) => { const v = new RegExp(k + '\\s*([\\d.,]+)', 'i').exec(x.vs || ''); return v ? +v[1].replace(/,/g, '') : null; }, fR = fixedOf('reach');
    const read = (h) => {
      if (now - t0 < h * 36e5) return { h, verdict: 'TOO EARLY' };
      const r = at(m, t0 + (h + 2) * 36e5) ?? m.reach, b = fR != null ? fR : med(base.map((p) => at(p, Date.parse(p.posted_at) + (h + 2) * 36e5) ?? p.reach));
      if (r == null || b == null) return { h, verdict: 'TOO EARLY' };
      return { h, reach: r, vs: Math.round(b), pct: pct(r, b), verdict: r >= b ? 'WIN' : 'LOSE' };
    };
    const r24 = read(24), r72 = read(72), w = watchS(m), s = saveP(m), bw = fR != null ? fixedOf('watch') : med(base.map(watchS)), bs = fR != null ? fixedOf('saves') : med(base.map(saveP));
    const final = r72.verdict !== 'TOO EARLY' ? r72 : r24;
    verdicts.push({ id: x.id, reel: name(m), final: final.verdict });
    [r24, r72].forEach((r) => { if (r.h === 72 && now - t0 < 72 * 36e5 && r24.verdict === 'TOO EARLY') return;
      out.lines.push(`EXPERIMENT ${k} ${x.id} (${name(m)}) ${r.h} h: ` + (r.reach != null ? `reach ${fmt(r.reach)} vs ${x.vs === 'median' ? 'median' : fR != null ? 'baseline' : x.vs} ${fmt(r.vs)} (${sgn(r.pct)}%)` +
        (w != null ? `, watch ${one(w)} s vs ${bw != null ? one(bw) : '–'}` : '') + (s != null ? `, saves ${one(s)}% vs ${bs != null ? one(bs) + '%' : '–'}` : '') + `, ${fmt((m.saves || 0) + (m.shares || 0))} saves+shares` : `${x.change}, posted ${new Date(t0 + IST).toISOString().slice(5, 16).replace('T', ' ')} IST`) + ` → ${r.verdict}`); });
  });
  // planned but not posted yet: say so, so a forgotten mark is visible
  T.planned.filter((p) => p.channel === k && !posted.some((m) => { const c = CAPS[m.template_id] || {}; return c.channel === p.channel && c.postOn === p.postOn && c.postAt === p.postAt; }))
    .forEach((p) => out.lines.push(`EXPERIMENT ${k} ${p.id} (planned ${p.postOn} ${p.postAt}): ${p.change} → TOO EARLY`));
  const byId = {}; verdicts.forEach((v) => { (byId[v.id] = byId[v.id] || { WIN: 0, LOSE: 0 }); if (v.final in byId[v.id]) byId[v.id][v.final]++; });
  for (const [id, c] of Object.entries(byId)) {
    if (c.WIN >= 2) out.lines.push(`PROMOTE ${k} ${id}: ${c.WIN} WINs, ${c.LOSE} LOSEs: make it a rule in design/rules-${k}.md today, with the numbers`);
    else if (c.LOSE >= 2) out.lines.push(`DROP ${k} ${id}: ${c.LOSE} LOSEs, ${c.WIN} WINs: move it to "What didn't" in design/playbook.md today`);
  }
  if (verdicts.length) out.experiments = byId;
  // 3. rule check (the alarm window's reels)
  const rules = {}; rd(`design/rules-${k}.md`).split('\n').forEach((l) => { const m = l.match(/^(\d{1,2})\.\s+\*\*(.+?)\*\*/); if (m) rules[m[1]] = m[2].replace(/[*`]/g, '').split(/\s+/).slice(0, 6).join(' '); });
  if (j && Object.keys(rules).length) {
    const rev = j.reels.map((m) => { const f = rd(`review/${k}/${m.template_id}.md`); if (!f) return { m, got: null };
      const l1 = (f.split('\n').find((l) => /^\s*1\.\s/.test(l)) || ''), got = {};
      // each "pass"/"fail" belongs to the first "(N", ", N" or "rule N" after the previous verdict ("(1 everyday annoyance pass, 2 ... pass")
      let from = 0; for (const v of l1.matchAll(/\b(pass|fail)\b/gi)) { const r = l1.slice(from, v.index).match(/[(,;]\s*(?:rule\s+)?(\d{1,2})\s/i); from = v.index + v[0].length;
        if (r && rules[r[1]] && !(r[1] in got)) got[r[1]] = v[1].toLowerCase() === 'pass'; }
      return { m, got }; });
    const withFile = rev.filter((r) => r.got), miss = rev.length - withFile.length;
    out.rules = { reviewed: withFile.length, noReview: miss, perReel: rev.map((r) => ({ reel: name(r.m), reach: r.m.reach, passed: r.got ? Object.keys(r.got).filter((n) => r.got[n]).map(Number) : null })) };
    out.lines.push(`RULES ${k}: ${withFile.length} of ${rev.length} recent reels have a rule score in their review file` + (miss ? ` (${miss} without: ${rev.filter((r) => !r.got).map((r) => name(r.m)).slice(0, 7).join(', ')})` : ''));
    if (withFile.length) for (const [n, t] of Object.entries(rules)) {
      const p = withFile.filter((r) => r.got[n] === true), f = withFile.filter((r) => r.got[n] === false);
      if (!p.length && !f.length) continue;
      const mp = med(p.map((r) => r.m.reach)), mf = med(f.map((r) => r.m.reach));
      const q = p.length === withFile.length && withFile.length >= 3 && j.alarm ? `, yet the channel is in ALARM (median reach ${fmt(j.reach)}): question it` : '';
      out.lines.push(`RULE ${k} ${n} (${t}): passed by ${p.length} of ${withFile.length}; median reach ${mp != null ? fmt(mp) : '–'} passing` + (f.length ? ` vs ${fmt(mf)} failing` : '') + q);
    }
  }
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
    const r = await fetch(`${SITE}/api/perf?days=60&extra=1&account=${encodeURIComponent(String(c.username || '').replace(/^@/, ''))}`, { headers: { Cookie: cookie } });
    if (!r.ok) { console.error(`✗ ${k}: /api/perf answered ${r.status}`); continue; }
    data[k] = await r.json();
  }
  return data;
}

const NOW = process.env.AUDIT_NOW ? Date.parse(process.env.AUDIT_NOW) : Date.now();
const data = await load(), today = istDay(new Date(NOW).toISOString()), channels = {};
const drv = {}; for (const k of Object.keys(CH)) if (data[k]) { drv[k] = drivers(data[k]); channels[k] = week(data[k], today).concat(drv[k].bullets); }
for (const [k, a] of Object.entries(channels)) { console.log(`AUDIT ${k} (${CH[k].username}), 7 days to ${today}:`); a.forEach((l) => console.log('  - ' + l)); }
console.log('AUDIT_CHANNELS=' + JSON.stringify(channels));
console.log('AUDIT_REELS (last 7 per channel: reach | hold % of the reel | skip % in 3 s | saves and shares per 1,000 reached):');
for (const [k, v] of Object.entries(drv)) v.reels.forEach((r) => console.log(`REEL ${k} ${r.day} ${r.reel}: reach ${fmt(r.reach)} | hold ${r.holdPct != null ? r.holdPct + '%' : '–'}${r.watchS != null ? ` (${r.watchS} of ${r.lenS || '?'} s)` : ''} | skip ${r.skipPct != null ? r.skipPct + '%' : '–'} | ${r.savesPer1k} saves, ${r.sharesPer1k} shares per 1,000`));
const sig = {}, chk = {}; for (const k of Object.keys(CH)) if (data[k]) { sig[k] = signals(data[k], today); chk[k] = checks(data[k], k, NOW); }
// the results checks lead (the daily run's audit card opens with them and acts on every ALARM, ESCALATE, PROMOTE and DROP the same day)
console.log('AUDIT_CHECKS (design/targets.md; CLAUDE.md "Daily run" step 2):'); Object.values(chk).forEach((c) => c.lines.forEach((l) => console.log(l)));
for (const [k, v] of Object.entries(drv)) if (sig[k]) sig[k].drivers = { last7: v.last7, discovery: v.discovery, reels: v.reels };
for (const [k, c] of Object.entries(chk)) sig[k].checks = { lines: c.lines, trend: c.trend, experiments: c.experiments, rules: c.rules };
console.log('AUDIT_SIGNALS=' + JSON.stringify(sig));
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, '### Audit numbers, 7 days to ' + today + '\n' + Object.values(chk).flatMap((c) => c.lines).map((l) => '- **' + l + '**').join('\n') + '\n\n' + Object.entries(channels).map(([k, a]) => `**${CH[k].username}**\n` + a.map((l) => '- ' + l).join('\n')).join('\n\n') + '\n');
