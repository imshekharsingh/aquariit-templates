// Instagram publisher (owner, 24 Nov 2026): posts ONE reel to its channel's Instagram account when the owner taps "Post now" in the app. Nothing posts by itself.
// Started by the workflow ig-publish.yml (dispatched by the Worker, POST /api/post). Instagram API with Instagram Login (graph.instagram.com),
// permission instagram_business_content_publish: create a REELS container (video_url, caption, cover_url, share_to_feed) -> wait for status FINISHED -> media_publish.
// The Instagram tokens stay in GitHub secrets (INSTAGRAM_TOKEN web, INSTAGRAM_TOKEN_2 tech, INSTAGRAM_TOKEN_3 Turns Out), like scripts/ig-collect.mjs, which
// also keeps a refreshed copy on the site (preferred first). The reel's video and cover reach Instagram through 1-hour signed links from the Worker
// (POST /api/post/sign). Each stage is reported to the app (POST /api/post/status); the Worker marks the reel Posted when "posted" arrives.
//   env: REEL, CHANNEL (or --reel / --channel), INSTAGRAM_TOKEN[_2|_3], BASIC_AUTH_USER / BASIC_AUTH_PASS,
//        SITE_BASE (default https://templates.aquariit.com), IG_API_BASE (default https://graph.instagram.com), POLL_MS (default 6000), POLL_MAX_MS (default 12 min)
// Exit code 1 on any failure (the app already shows the reason). Never prints a token.
import { norm, SLOT_CHANNEL, CHANNEL_ACCOUNT } from './reel-match.mjs';

const args = process.argv.slice(2), opt = (n, d) => { const i = args.indexOf(n); return i > -1 ? args[i + 1] : d; };
const REEL = String(opt('--reel', process.env.REEL || '')).trim(), CH = String(opt('--channel', process.env.CHANNEL || '')).trim();
const IG = (process.env.IG_API_BASE || 'https://graph.instagram.com').replace(/\/$/, ''), SITE = (process.env.SITE_BASE || 'https://templates.aquariit.com').replace(/\/$/, '');
const POLL_MS = +(process.env.POLL_MS || 6000), POLL_MAX_MS = +(process.env.POLL_MAX_MS || 12 * 60e3);
const SLOT = Object.keys(SLOT_CHANNEL).find((k) => SLOT_CHANNEL[k] === CH), SECRET = SLOT === '1' ? 'INSTAGRAM_TOKEN' : 'INSTAGRAM_TOKEN_' + SLOT, ACCOUNT = '@' + (CHANNEL_ACCOUNT[CH] || CH);
let cookie = '', TOKEN = '';
const scrub = (t) => (TOKEN ? String(t).split(TOKEN).join('***') : String(t));
const site = (path, init = {}) => fetch(SITE + path, { ...init, headers: { 'X-Requested-With': 'reel', Cookie: cookie, ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...(init.headers || {}) } });

let lastState = 'queued';
async function report(state, extra = {}) {
  lastState = state;
  try { await site('/api/post/status', { method: 'POST', body: JSON.stringify({ reel: REEL, state, ...extra }) }); } catch { /* the app can still be told later */ }
  console.log(`[${state}] ${extra.line || extra.error || extra.permalink || ''}`);
}
const fail = async (message) => { await report('failed', { error: message.slice(0, 400) }); console.error('✗ ' + message); process.exit(1); };

// plain words for what Instagram says (owner: no code names on screen)
function plain(e) {
  const m = String((e && e.message) || ''), c = e && e.code;
  if (c === 190 || (e && e.status === 401)) return `Instagram rejected the token for ${ACCOUNT}. Paste a new token in the GitHub secret ${SECRET}.`;
  if (c === 10 || c === 200 || c === 803 || /permission|not authori[sz]ed|content_publish/i.test(m)) return `The Instagram token for ${ACCOUNT} can't post yet: add the content publish permission and paste a new token.`;
  if (c === 4 || c === 17 || c === 32 || c === 613 || /rate|limit|too many/i.test(m)) return `Instagram says ${ACCOUNT} has hit its posting limit for now. Try again in a while.`;
  if (c === 2207026 || /unsupported|format|aspect|duration|codec/i.test(m)) return `Instagram did not accept the video format (${m.slice(0, 120)}).`;
  if (c === 2207003 || c === 2207020 || /timeout|download|fetch/i.test(m)) return 'Instagram could not download the video. Try again.';
  return `Instagram said: ${m.slice(0, 200) || 'something went wrong'}${c ? ` (code ${c})` : ''}.`;
}
async function ig(path, { method = 'GET', params = {} } = {}) {
  const u = new URL(IG + path), body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) (method === 'GET' ? u.searchParams : body).set(k, v);
  if (method === 'GET') u.searchParams.set('access_token', TOKEN); else body.set('access_token', TOKEN);
  let res;
  try { res = await fetch(u, method === 'GET' ? { headers: { Accept: 'application/json' } } : { method, body, headers: { Accept: 'application/json' } }); }
  catch (e) { return { ok: false, net: true, error: { message: scrub('network error: ' + String(e.cause?.code || e.message)) } }; }
  let j = null; try { j = await res.json(); } catch { /* not json */ }
  if (!res.ok || (j && j.error)) return { ok: false, error: { ...((j && j.error) || { message: 'HTTP ' + res.status }), status: res.status } };
  return { ok: true, json: j };
}

if (!/^showreel-[a-z0-9-]{1,60}$/.test(REEL) || !SLOT) { console.error('✗ Needs REEL (showreel-...) and CHANNEL (web, tech or c3).'); process.exit(1); }

// 1. sign in to the site (same as the collector)
const U = process.env.BASIC_AUTH_USER, P = process.env.BASIC_AUTH_PASS;
if (!U || !P) { console.error('✗ BASIC_AUTH_USER / BASIC_AUTH_PASS are missing.'); process.exit(1); }
{ const l = await fetch(SITE + '/login', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ username: U, password: P }) });
  cookie = (l.headers.getSetCookie ? l.headers.getSetCookie() : []).map((c) => c.split(';')[0]).join('; ');
  if (l.status !== 303 || !cookie) { console.error(`✗ The site refused the sign-in (HTTP ${l.status}).`); process.exit(1); } }
await report('uploading', { line: 'Uploading' });

// 2. the token for this channel's account: the refreshed copy kept on the site first, the GitHub secret as the fallback (as ig-collect does)
const ENV_TOKEN = process.env[SECRET] || (SLOT === '1' ? process.env.INSTAGRAM_TOKEN : '') || '';
let stored = null; try { const r = await site('/api/perf/token?slot=' + SLOT); if (r.ok) { const j = await r.json(); stored = j && j.token; } } catch { /* the secret is the fallback */ }
const candidates = [...new Set([stored, ENV_TOKEN].filter(Boolean))];
if (!candidates.length) await fail(`The Instagram token for ${ACCOUNT} is missing: add the GitHub secret ${SECRET}.`);
let me = null;
for (const c of candidates) { TOKEN = c; me = await ig('/me', { params: { fields: 'user_id,username' } }); if (me.ok) break; if (!(me.error.code === 190 || me.error.status === 401)) break; }
if (!me.ok) await fail(plain(me.error));
console.log(`Account: @${me.json.username}`);

// 3. the post text, exactly as the app's "Copy post text": caption, up to 6 keywords joined with " · ", up to 5 hashtags (captions.json fields win)
let conf = {}, caps = {};
try { const r = await site(`/reels/${REEL}.json`); if (r.ok) conf = await r.json(); } catch { /* below */ }
try { const r = await site('/showreels/captions.json'); if (r.ok) caps = (await r.json())[REEL] || {}; } catch { /* below */ }
const m = { ...conf, ...caps };
if (!m.caption || !String(m.caption).trim()) await fail('This reel has no post text, so it was not posted.');
let caption = String(m.caption).trim();
if (m.keywords && m.keywords.length) caption += '\n\n' + m.keywords.slice(0, 6).join(' · ');
if (m.hashtags && m.hashtags.length) caption += '\n\n' + m.hashtags.slice(0, 5).join(' ');
if (caption.length > 2200) await fail('The post text is longer than Instagram allows (2,200 characters).');

// 4. never post twice: if the account already shows this post (the owner posted it by hand, or an earlier run went through), mark it and stop
async function alreadyThere() {
  const l = await ig('/me/media', { params: { fields: 'id,caption,permalink,timestamp', limit: '15' } });
  if (!l.ok) return null;
  const head = norm(caption);
  return (l.json.data || []).find((x) => x.caption && norm(x.caption) === head && Date.now() - Date.parse(x.timestamp) < 36 * 3600e3) || null;
}
{ const dup = await alreadyThere();
  if (dup) { await report('posted', { line: 'Posted', media_id: dup.id, permalink: dup.permalink }); console.log('Already on the account; marked as posted, nothing sent.'); process.exit(0); } }

// 5. signed links, then the container
const sr = await site('/api/post/sign', { method: 'POST', body: JSON.stringify({ reel: REEL }) });
if (!sr.ok) await fail('The app would not give out the video link (HTTP ' + sr.status + ').');
const links = await sr.json();
const params = { media_type: 'REELS', video_url: links.video, caption, share_to_feed: 'true' };
if (links.cover) params.cover_url = links.cover;
const made = await ig('/me/media', { method: 'POST', params });
if (!made.ok) await fail(plain(made.error));
const cid = made.json.id;

// 6. wait until Instagram has processed the video
await report('processing', { line: 'Processing' });
const t0 = Date.now(); let code = '';
for (;;) {
  const s = await ig('/' + cid, { params: { fields: 'status_code,status' } });
  if (s.ok) {
    code = s.json.status_code;
    if (code === 'FINISHED') break;
    if (code === 'ERROR' || code === 'EXPIRED') await fail('Instagram could not process the video' + (s.json.status ? ': ' + String(s.json.status).slice(0, 160) : '') + '. Try again.');
    if (code === 'PUBLISHED') break;
  }
  if (Date.now() - t0 > POLL_MAX_MS) await fail('Instagram is taking too long to process the video. Try again in a few minutes.');
  await new Promise((r) => setTimeout(r, POLL_MS));
}

// 7. publish (once). If the answer is lost, look at the account before saying it failed.
await report('publishing', { line: 'Publishing' });
let pub = await ig('/me/media_publish', { method: 'POST', params: { creation_id: cid } });
let mediaId = pub.ok ? pub.json.id : null;
if (!pub.ok) {
  const dup = pub.net ? await alreadyThere() : null;
  if (!dup) await fail(pub.net ? 'Instagram did not confirm the post. Check the account before trying again.' : plain(pub.error));
  mediaId = dup.id;
}
const pl = await ig('/' + mediaId, { params: { fields: 'permalink' } });
await report('posted', { line: 'Posted', media_id: String(mediaId), permalink: pl.ok ? pl.json.permalink : undefined });
