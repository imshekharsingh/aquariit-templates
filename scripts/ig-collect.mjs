// Instagram collector (read-only): reads the account and every recent reel's numbers from Instagram's official API
// (Instagram API with Instagram Login) and stores them in the site's D1 database through POST /api/perf/ingest, for the /performance/ page.
// It never posts or changes anything on Instagram, and never prints the token.
//   env:  INSTAGRAM_TOKEN                        long-lived Instagram User access token (GitHub secret)
//         BASIC_AUTH_USER / BASIC_AUTH_PASS      the site sign-in (GitHub secrets, same ones the pipeline uses)
//         SITE_BASE (default https://templates.aquariit.com), IG_API_BASE (default https://graph.instagram.com)   -- overridable for tests
//   The token is kept alive by itself: a refreshed token is stored on the site (primary account only) and preferred from then on; the GitHub secret is the fallback.
// Usage: node scripts/ig-collect.mjs [--dry] [--no-refresh] [--refresh] [--limit 50] [--slot N]
//   --slot N      which account (1 = the main one, the default; 2 = the second account, its token in INSTAGRAM_TOKEN_2). Each slot keeps its own refreshed token on the site.
//   --dry         read from Instagram and print the result, but do not write to the site
//   --no-refresh  never refresh the token this run;  --refresh  refresh it now (normally: when no stored token exists or it is over 6 days old)
// Exit code 1 on any problem the owner must know about (bad token, missing permission, site refused); the message says what to do.
import { readFileSync, existsSync, appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), has = (f) => args.includes(f), opt = (n, d) => { const i = args.indexOf(n); return i > -1 ? args[i + 1] : d; };
const ENV_TOKEN = process.env.INSTAGRAM_TOKEN || '', IG = (process.env.IG_API_BASE || 'https://graph.instagram.com').replace(/\/$/, ''), SITE = (process.env.SITE_BASE || 'https://templates.aquariit.com').replace(/\/$/, '');
const DRY = has('--dry'), LIMIT = Math.max(1, Math.min(100, +opt('--limit', 50))), SLOT = Math.max(1, Math.min(9, +opt('--slot', 1) || 1)), SECRET = SLOT === 1 ? 'INSTAGRAM_TOKEN' : 'INSTAGRAM_TOKEN_' + SLOT;
const out = [], say = (m) => { out.push(m); console.log(m); };
const summary = (md) => { if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n'); };
const die = (m) => { console.error('\n✗ ' + m); summary('### Instagram collector\n\n**Failed:** ' + m); process.exit(1); };

let TOKEN = ENV_TOKEN;
if (!ENV_TOKEN) die('The GitHub secret ' + SECRET + ' is missing or empty. Add it under Settings → Secrets and variables → Actions (never paste the token into a chat or a file).');

// ---- Instagram calls. The token travels in the query string, so URLs are never logged and error text is scrubbed. ----
async function ig(path, params = {}) {
  const u = new URL(IG + path); for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v); u.searchParams.set('access_token', TOKEN);
  let res;
  try { res = await fetch(u, { headers: { Accept: 'application/json' } }); } catch (e) { return { ok: false, status: 0, error: { message: 'network error: ' + String(e.cause?.code || e.message).replace(TOKEN, '***') } }; }
  let j = null; try { j = await res.json(); } catch { /* not json */ }
  if (!res.ok || (j && j.error)) return { ok: false, status: res.status, error: (j && j.error) || { message: 'HTTP ' + res.status } };
  return { ok: true, status: res.status, json: j };
}
const errText = (e) => `${e.message || 'unknown error'}${e.code ? ` (code ${e.code}${e.error_subcode ? '/' + e.error_subcode : ''})` : ''}`.replace(TOKEN, '***');

// 0. the site: sign in (also needed to read the stored token), then pick a working token: stored (newest) first, the GitHub secret as the fallback
const U = process.env.BASIC_AUTH_USER, P = process.env.BASIC_AUTH_PASS;
let cookie = '', stored = null;
if (U && P) {
  const login = await fetch(SITE + '/login', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ username: U, password: P }) });
  cookie = (login.headers.getSetCookie ? login.headers.getSetCookie() : []).map((c) => c.split(';')[0]).join('; ');
  if (login.status !== 303 || !cookie) { cookie = ''; if (!DRY) die(`The site refused the sign-in (HTTP ${login.status}). Check the BASIC_AUTH_USER / BASIC_AUTH_PASS secrets.`); }
}
if (cookie) { try { const r = await fetch(SITE + '/api/perf/token?slot=' + SLOT, { headers: { Cookie: cookie } }); if (r.ok) { const j = await r.json(); if (j && j.token) stored = j; } } catch { /* the secret is the fallback */ } }
const candidates = [...new Set([stored && stored.token, ENV_TOKEN].filter(Boolean))];

// 1. account
let me = null, usedStored = false;
for (const c of candidates) {
  TOKEN = c; me = await ig('/me', { fields: 'user_id,username,account_type,followers_count,follows_count,media_count' });
  if (me.ok) { usedStored = !!stored && c === stored.token; break; }
  if (!(me.error.code === 190 || me.status === 401)) break; // only a rejected token is worth retrying with the other one
}
if (!me.ok) {
  const e = me.error, bad = e.code === 190 || me.status === 401;
  die(bad ? `Instagram rejected the token: ${errText(e)}. Generate a new one (Meta app → Instagram → API setup with Instagram Login → Generate token) and update the GitHub secret ${SECRET}.`
          : `Could not read the account: ${errText(e)}. If this mentions permissions, the token needs the “instagram_business_basic” permission.`);
}
const A = me.json;
say(`Account: @${A.username} (${A.account_type}), ${A.followers_count} followers, ${A.follows_count} following, ${A.media_count} posts`);

// 2. recent media
const list = await ig('/me/media', { fields: 'id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count', limit: String(LIMIT) });
if (!list.ok) die(`Could not list posts: ${errText(list.error)}`);
const items = (list.json.data || []).filter((m) => m && m.id);
say(`Posts read: ${items.length}`);

// 3. per-post insights. Metric names differ by media type and API version, so the first post is probed metric by metric and the supported set is reused.
// follows / profile_visits / profile_activity (owner, 27 Oct 2026: which reel brings followers); unsupported ones are dropped by the probe and listed in the log
const CANDIDATES = { REELS: ['views', 'reach', 'saved', 'shares', 'likes', 'comments', 'total_interactions', 'ig_reels_avg_watch_time', 'ig_reels_video_view_total_time', 'follows', 'profile_visits', 'profile_activity'], OTHER: ['views', 'reach', 'saved', 'shares', 'likes', 'comments', 'total_interactions', 'follows', 'profile_visits', 'profile_activity'] };
const supported = {}, unsupported = {}, firstError = {};
async function insightsFor(m) {
  const kind = m.media_product_type === 'REELS' ? 'REELS' : 'OTHER', want = CANDIDATES[kind], got = {};
  const parse = (j) => { for (const row of j.data || []) { const v = row.values ? row.values[0] && row.values[0].value : row.total_value && row.total_value.value; if (typeof v === 'number') got[row.name] = v; } };
  if (!supported[kind]) { // probe once
    const all = await ig(`/${m.id}/insights`, { metric: want.join(',') });
    if (all.ok) { supported[kind] = want.slice(); parse(all.json); return got; }
    supported[kind] = []; unsupported[kind] = [];
    for (const metric of want) { const r = await ig(`/${m.id}/insights`, { metric }); if (r.ok) { supported[kind].push(metric); parse(r.json); } else { unsupported[kind].push(metric); firstError[metric] = errText(r.error).slice(0, 140); } }
    return got;
  }
  if (!supported[kind].length) return got;
  const r = await ig(`/${m.id}/insights`, { metric: supported[kind].join(',') });
  if (r.ok) parse(r.json); else for (const metric of supported[kind]) { const one = await ig(`/${m.id}/insights`, { metric }); if (one.ok) parse(one.json); } // a single post can lack some metrics
  return got;
}

// 4. match each post to its template by the brand name every caption carries (kits are built by scripts/build-kits.mjs)
let kits = []; try { kits = JSON.parse(readFileSync(join(root, 'templates', 'social-kits.json'), 'utf8')); } catch { /* matching is optional */ }
const brands = kits.filter((k) => k.name && k.name.length >= 3).map((k) => ({ id: k.id, name: k.name.toLowerCase() })).sort((a, b) => b.name.length - a.name.length);
const templateFor = (caption) => { const c = (caption || '').toLowerCase(); const hit = brands.find((b) => new RegExp('(^|[^a-z0-9])' + b.name.replace(/[^a-z0-9 ]/g, '') + '([^a-z0-9]|$)').test(c.replace(/[^a-z0-9 ]/g, ' '))); return hit ? hit.id : null; };

const media = [];
for (const m of items) {
  const x = await insightsFor(m);
  media.push({
    ig_id: m.id, template_id: templateFor(m.caption), permalink: m.permalink || null, posted_at: m.timestamp || null, caption: m.caption || null, kind: m.media_product_type || m.media_type || null,
    metrics: { views: x.views ?? null, reach: x.reach ?? null, likes: x.likes ?? m.like_count ?? null, comments: x.comments ?? m.comments_count ?? null, saves: x.saved ?? null, shares: x.shares ?? null,
      watch_avg_ms: x.ig_reels_avg_watch_time ?? null, watch_total_ms: x.ig_reels_video_view_total_time ?? null,
      follows: x.follows ?? null, profile_visits: x.profile_visits ?? null, profile_activity: x.profile_activity ?? null },
  });
}
for (const k of Object.keys(supported)) say(`Insight metrics (${k}): ${supported[k].join(', ') || 'none'}${unsupported[k] && unsupported[k].length ? ` | not available: ${unsupported[k].map((n) => `${n} [${firstError[n]}]`).join('; ')}` : ''}`);
const matched = media.filter((m) => m.template_id).length;
say(`Matched to a template: ${matched} of ${media.length}`);
// a compact per-reel table (numbers only, no secrets): this is what the advisor reads to give advice from real results
{
  const n = (v) => (v == null ? '-' : String(v)), pc = (a, b) => (b > 0 && a != null ? (100 * a / b).toFixed(1) + '%' : '-');
  say('\nReels (newest first): date | template | views | reach | shares | saves | likes | comments | avg watch s | share% | save% | follows | profile visits');
  for (const m of media.slice().sort((a, b) => String(b.posted_at).localeCompare(String(a.posted_at)))) {
    const x = m.metrics; say([String(m.posted_at || '').slice(0, 10), m.template_id || 'unmatched', n(x.views), n(x.reach), n(x.shares), n(x.saves), n(x.likes), n(x.comments), x.watch_avg_ms != null ? (x.watch_avg_ms / 1000).toFixed(1) : '-', pc(x.shares, x.reach), pc(x.saves, x.reach), n(x.follows), n(x.profile_visits)].join(' | '));
  }
  say('\nPosts (newest first): posted IST | reach | follows | profile visits | link | caption (first line)');
  for (const m of media.slice().sort((a, b) => String(b.posted_at).localeCompare(String(a.posted_at)))) {
    const ist = m.posted_at ? new Date(new Date(m.posted_at).getTime() + 5.5 * 3600e3).toISOString().slice(0, 16).replace('T', ' ') : '-';
    say([ist, n(m.metrics.reach), n(m.metrics.follows), n(m.metrics.profile_visits), m.permalink || '-', String(m.caption || '').split('\n')[0].slice(0, 110)].join(' | '));
  }
  const tot = (k) => media.reduce((a, m) => a + (m.metrics[k] || 0), 0);
  say(`Totals: ${tot('views')} views, ${tot('reach')} reach (sum), ${tot('shares')} shares, ${tot('saves')} saves, ${tot('likes')} likes, ${tot('comments')} comments\n`);
}
// account-level, last day (owner, 27 Oct 2026): how much reach comes from non-followers, follows vs unfollows, profile link taps. Each metric is asked on its own,
// so one Instagram does not offer just shows as unavailable. Where viewers come from (feed, Explore, Reels tab) is not offered by the API at all.
{
  const asks = [['reach', 'follow_type'], ['follows_and_unfollows', 'follow_type'], ['profile_links_taps', null], ['views', 'follow_type']];
  const rows = [];
  for (const [metric, breakdown] of asks) {
    const q = { metric, period: 'day', metric_type: 'total_value' }; if (breakdown) q.breakdown = breakdown;
    let r = await ig('/me/insights', q);
    if (!r.ok && breakdown) { delete q.breakdown; r = await ig('/me/insights', q); }
    if (!r.ok) { rows.push(`${metric}: not available [${errText(r.error).slice(0, 120)}]`); continue; }
    const row = (r.json.data || [])[0] || {}, tv = row.total_value || {};
    const parts = ((tv.breakdowns || [])[0] || {}).results || [];
    const split = parts.map((p) => `${(p.dimension_values || []).join('/') || '?'} ${p.value}`).join(', ');
    rows.push(`${metric}: ${tv.value ?? '-'}${split ? ` (${split})` : ''}`);
  }
  say('Account, last day: ' + rows.join(' | '));
}
if (media.length && !Object.values(supported).some((s) => s.length)) say('⚠ No insight metric could be read. The token probably lacks the “instagram_business_manage_insights” permission (or Instagram needs App Review for it). Followers and posts were still collected.');

// 5. token health. Instagram tokens last 60 days and a refresh issues a NEW token, so the new one is stored on the site (only the primary account can read it).
// Refresh when none is stored yet or the stored one is over 6 days old. The token itself is never printed.
let tokenNote = usedStored ? 'using the stored token' : 'using the GitHub secret token';
const ageDays = stored && stored.saved_at ? (Date.now() - Date.parse(stored.saved_at)) / 864e5 : Infinity;
if (!has('--no-refresh') && (has('--refresh') || ageDays > 6)) {
  const r = await ig('/refresh_access_token', { grant_type: 'ig_refresh_token' });
  if (r.ok && r.json.access_token) {
    const days = r.json.expires_in ? Math.round(r.json.expires_in / 86400) : '?';
    if (DRY) tokenNote += `; a refresh would give a token valid ${days} days (dry run: not stored)`;
    else if (!cookie) tokenNote += '; refreshed but no site sign-in to store it';
    else {
      const put = await fetch(SITE + '/api/perf/token?slot=' + SLOT, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'reel', Cookie: cookie }, body: JSON.stringify({ token: r.json.access_token }) });
      tokenNote += put.ok ? `; refreshed and stored (valid ${days} days)` : `; ⚠ refreshed (valid ${days} days) but storing it failed (HTTP ${put.status}), so the new token was lost; the current one still works`;
    }
  } else tokenNote += `; refresh not possible now: ${errText(r.error || {})} (normal for a token under 24 hours old)`;
}
say(`Token: ${tokenNote}`);

// 6. send everything to the site
const day = new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10); // IST day
const body = { day, slot: SLOT, account: { username: A.username, followers: A.followers_count, follows: A.follows_count, media_count: A.media_count }, media };
if (DRY) { say(`Dry run: would send ${media.length} posts for ${day}. Nothing written.`); summary('### Instagram collector (dry run)\n\n```\n' + out.join('\n') + '\n```'); process.exit(0); }
if (!U || !P || !cookie) die('BASIC_AUTH_USER / BASIC_AUTH_PASS are not set or not accepted, so the results cannot be saved to the site.');
const post = await fetch(SITE + '/api/perf/ingest', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'reel', Cookie: cookie }, body: JSON.stringify(body) });
if (post.status === 501) die('The site has no D1 database bound, so results cannot be stored. Give the Cloudflare token Account → D1 → Edit and redeploy.');
if (!post.ok) die(`The site refused the data (HTTP ${post.status}).`);
say(`Saved to the site for ${day}: ${media.length} posts + the account snapshot.`);
summary('### Instagram collector\n\n```\n' + out.join('\n') + '\n```');
