// Instagram collector (read-only): reads the account and every recent reel's numbers from Instagram's official API
// (Instagram API with Instagram Login) and stores them in the site's D1 database through POST /api/perf/ingest, for the /performance/ page.
// It never posts or changes anything on Instagram, and never prints the token.
//   env:  INSTAGRAM_TOKEN                        long-lived Instagram User access token (GitHub secret)
//         BASIC_AUTH_USER / BASIC_AUTH_PASS      the site sign-in (GitHub secrets, same ones the pipeline uses)
//         SITE_BASE (default https://templates.aquariit.com), IG_API_BASE (default https://graph.instagram.com)   -- overridable for tests
// Usage: node scripts/ig-collect.mjs [--dry] [--no-refresh] [--limit 50]
//   --dry         read from Instagram and print the result, but do not write to the site
//   --no-refresh  skip the weekly token refresh
// Exit code 1 on any problem the owner must know about (bad token, missing permission, site refused); the message says what to do.
import { readFileSync, existsSync, appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), has = (f) => args.includes(f), opt = (n, d) => { const i = args.indexOf(n); return i > -1 ? args[i + 1] : d; };
const TOKEN = process.env.INSTAGRAM_TOKEN || '', IG = (process.env.IG_API_BASE || 'https://graph.instagram.com').replace(/\/$/, ''), SITE = (process.env.SITE_BASE || 'https://templates.aquariit.com').replace(/\/$/, '');
const DRY = has('--dry'), LIMIT = Math.max(1, Math.min(100, +opt('--limit', 50)));
const out = [], say = (m) => { out.push(m); console.log(m); };
const summary = (md) => { if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n'); };
const die = (m) => { console.error('\n✗ ' + m); summary('### Instagram collector\n\n**Failed:** ' + m); process.exit(1); };

if (!TOKEN) die('The GitHub secret INSTAGRAM_TOKEN is missing or empty. Add it under Settings → Secrets and variables → Actions (never paste the token into a chat or a file).');

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

// 1. account
const me = await ig('/me', { fields: 'user_id,username,account_type,followers_count,follows_count,media_count' });
if (!me.ok) {
  const e = me.error, bad = e.code === 190 || me.status === 401;
  die(bad ? `Instagram rejected the token: ${errText(e)}. Generate a new one (Meta app → Instagram → API setup with Instagram Login → Generate token) and update the GitHub secret INSTAGRAM_TOKEN.`
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
const CANDIDATES = { REELS: ['views', 'reach', 'saved', 'shares', 'likes', 'comments', 'total_interactions', 'ig_reels_avg_watch_time', 'ig_reels_video_view_total_time'], OTHER: ['views', 'reach', 'saved', 'shares', 'likes', 'comments', 'total_interactions'] };
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
      watch_avg_ms: x.ig_reels_avg_watch_time ?? null, watch_total_ms: x.ig_reels_video_view_total_time ?? null },
  });
}
for (const k of Object.keys(supported)) say(`Insight metrics (${k}): ${supported[k].join(', ') || 'none'}${unsupported[k] && unsupported[k].length ? ` | not available: ${unsupported[k].map((n) => `${n} [${firstError[n]}]`).join('; ')}` : ''}`);
const matched = media.filter((m) => m.template_id).length;
say(`Matched to a template: ${matched} of ${media.length}`);
if (media.length && !Object.values(supported).some((s) => s.length)) say('⚠ No insight metric could be read. The token probably lacks the “instagram_business_manage_insights” permission (or Instagram needs App Review for it). Followers and posts were still collected.');

// 5. token health: refresh a long-lived token about weekly so it never lapses. The reply is only compared, never printed.
let tokenNote = 'not refreshed this run';
if (!has('--no-refresh') && (new Date().getUTCDay() === 1 || has('--refresh'))) {
  const r = await ig('/refresh_access_token', { grant_type: 'ig_refresh_token' });
  if (r.ok && r.json.access_token) {
    const days = r.json.expires_in ? Math.round(r.json.expires_in / 86400) : null;
    tokenNote = r.json.access_token === TOKEN ? `refreshed, same token, valid for ${days ?? '?'} more days` : `refreshed, but Instagram returned a DIFFERENT token (valid ${days ?? '?'} days). The old one keeps working until it expires; tell Claude so the rotation can be stored.`;
  } else tokenNote = `refresh not possible now: ${errText(r.error || {})} (fine for a token under 24 hours old)`;
}
say(`Token: ${tokenNote}`);

// 6. send everything to the site
const day = new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10); // IST day
const body = { day, account: { username: A.username, followers: A.followers_count, follows: A.follows_count, media_count: A.media_count }, media };
if (DRY) { say(`Dry run: would send ${media.length} posts for ${day}. Nothing written.`); summary('### Instagram collector (dry run)\n\n```\n' + out.join('\n') + '\n```'); process.exit(0); }
const U = process.env.BASIC_AUTH_USER, P = process.env.BASIC_AUTH_PASS;
if (!U || !P) die('BASIC_AUTH_USER / BASIC_AUTH_PASS are not set, so the results cannot be saved to the site.');
const login = await fetch(SITE + '/login', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ username: U, password: P }) });
const cookie = (login.headers.getSetCookie ? login.headers.getSetCookie() : []).map((c) => c.split(';')[0]).join('; ');
if (login.status !== 303 || !cookie) die(`The site refused the sign-in (HTTP ${login.status}). Check the BASIC_AUTH_USER / BASIC_AUTH_PASS secrets.`);
const post = await fetch(SITE + '/api/perf/ingest', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'reel', Cookie: cookie }, body: JSON.stringify(body) });
if (post.status === 501) die('The site has no D1 database bound, so results cannot be stored. Give the Cloudflare token Account → D1 → Edit and redeploy.');
if (!post.ok) die(`The site refused the data (HTTP ${post.status}).`);
say(`Saved to the site for ${day}: ${media.length} posts + the account snapshot.`);
summary('### Instagram collector\n\n```\n' + out.join('\n') + '\n```');
