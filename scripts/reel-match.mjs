// Which reel is which Instagram post (owner, 5 Nov 2026: "are all the reels marked right"). Shared by scripts/ig-collect.mjs and scripts/post-state.mjs.
// The catalogue: every reel in templates/showreels/captions.json plus every reel config (scripts/explainer, scripts/channel3, techreel/topics),
// each with its channel, postOn, slot and the first line of its post text. A post matches a reel of its account's channel by the normalised
// first caption line (emoji, quotes, punctuation and case ignored); if no caption matches, by the IST day it went out = postOn, when exactly
// one reel of that channel is planned that day.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { postSlot } from '../src/worker.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SLOT_CHANNEL = { 1: 'web', 2: 'tech', 3: 'c3' };
export const CHANNEL_ACCOUNT = { web: 'webin20sec', tech: 'techin20sec', c3: 'itturns.out' };
const IST = 5.5 * 3600e3;
export const istDay = (iso) => new Date(Date.parse(iso) + IST).toISOString().slice(0, 10);
export const chOf = (name, m) => (m && ['web', 'tech', 'c3'].includes(m.channel) ? m.channel : /^showreel-(tech-|t\d)/.test(name) ? 'tech' : /^showreel-c3-/.test(name) ? 'c3' : /^showreel-fc/.test(name) ? 'fc' : 'web');
// first line of a caption, normalised: letters and digits only, single spaces
export const norm = (caption) => String(caption || '').split('\n')[0].normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const readJson = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return null; } };
export function catalogue() {
  const caps = readJson(join(root, 'templates', 'showreels', 'captions.json')) || {};
  const conf = {};   // name -> { caption, file }
  for (const d of ['scripts/explainer', 'scripts/channel3']) {
    const dir = join(root, d);
    for (const f of existsSync(dir) ? readdirSync(dir).filter((x) => x.endsWith('.json')) : []) {
      const j = readJson(join(dir, f)); if (j && /^showreel-[a-z0-9-]+$/.test(j.name || '')) conf[j.name] = { caption: j.caption || '', file: `${d}/${f}` };
    }
  }
  const td = join(root, 'techreel', 'topics');
  for (const f of existsSync(td) ? readdirSync(td).filter((x) => x.endsWith('.json')) : []) {
    const j = readJson(join(td, f)); if (j && j.slug) conf['showreel-tech-' + j.slug] = { caption: (j.post && j.post.caption) || (Array.isArray(j.hook) ? j.hook.join(' ') : ''), file: `techreel/topics/${f}` };
  }
  const out = {};
  for (const name of new Set([...Object.keys(caps), ...Object.keys(conf)])) {
    const m = caps[name] || {}, c = conf[name] || {}, caption = m.caption || c.caption || '';
    out[name] = { name, channel: chOf(name, m), postOn: /^\d{4}-\d{2}-\d{2}$/.test(m.postOn || '') ? m.postOn : null, postAt: m.postOn ? postSlot(name, m) : null,
      hidden: !!m.hidden, caption, key: norm(caption), config: c.file || null, planned: !!caps[name] };
  }
  return out;
}

// posts: [{ ig_id, caption, posted_at }] of ONE account; returns { byPost: {ig_id: name}, how: {ig_id: 'caption'|'day'} }
export function matchPosts(posts, channel, cat = catalogue()) {
  const reels = Object.values(cat).filter((r) => r.channel === channel);
  const byPost = {}, how = {}, taken = new Set();
  const rank = (r, day) => (r.hidden ? 2 : 0) + (r.postOn === day ? 0 : 1);
  const sorted = posts.slice().sort((a, b) => String(a.posted_at).localeCompare(String(b.posted_at)));   // oldest first: a repost keeps the first post's reel
  for (const p of sorted) {
    const k = norm(p.caption), day = p.posted_at ? istDay(p.posted_at) : null;
    if (k.length < 12) continue;
    const hits = reels.filter((r) => r.key.length >= 12 && (r.key === k || k.startsWith(r.key) || r.key.startsWith(k)));
    if (hits.length) { hits.sort((a, b) => (taken.has(a.name) - taken.has(b.name)) || rank(a, day) - rank(b, day) || b.key.length - a.key.length); byPost[p.ig_id] = hits[0].name; how[p.ig_id] = 'caption'; taken.add(hits[0].name); }
  }
  for (const p of sorted) {   // fallback: the one reel of this channel planned for the post's IST day
    if (byPost[p.ig_id] || !p.posted_at) continue;
    const day = istDay(p.posted_at), c = reels.filter((r) => !r.hidden && r.postOn === day && !taken.has(r.name));
    if (c.length === 1) { byPost[p.ig_id] = c[0].name; how[p.ig_id] = 'day'; taken.add(c[0].name); }
  }
  return { byPost, how };
}
