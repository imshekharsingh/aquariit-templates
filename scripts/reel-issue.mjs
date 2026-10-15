// Writes the "Reel ready" GitHub issue for a template (markdown on stdout; `--title` prints the title only).
// Everything the owner needs to post the reel in about a minute: where to get the video, the caption to paste, audio search terms, the checklist.
// Usage: node scripts/reel-issue.mjs ID [--title]      (reads templates/social-kits.json, built by scripts/build-kits.mjs)
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const id = process.argv.slice(2).find((a) => !a.startsWith('--'));
const kits = JSON.parse(readFileSync(join(root, 'templates', 'social-kits.json'), 'utf8'));
const k = kits.find((x) => x.id === id);
if (!k) { console.error(`No kit for ${id}`); process.exit(1); }
if (process.argv.includes('--title')) { console.log(`Reel ready: ${k.name} (${id})`); process.exit(0); }

let meta = {}; try { const f = join(root, 'out', 'reels', `${id}.json`); if (existsSync(f)) meta = JSON.parse(readFileSync(f, 'utf8')); } catch { /* no render metadata */ }
const film = meta.format === 'film', bpm = film ? (meta.bpm || 120) : '';
const site = 'https://templates.aquariit.com', list = (a) => (a || []).map((x) => `\`${x}\``).join(', ');
const m = k.music || {}, r = k.reel || {};
console.log(`## 🎬 ${k.name} — your reel is rendered

**Video + kit (sign in first):** ${site}/kit/?id=${id}
**Template:** ${site}/${id}/

### Post it (about a minute)
1. Open the kit link above **in Safari** on your iPhone (the GitHub app and the home-screen app hide *Save Video*; the kit page shows an **Open in Safari** button), tap **Save / share to Instagram**, then choose *Save Video* so it lands in Photos.  
   If the sheet only offers Files or Drive: save to Files, open Files, press and hold the video → **Share → Save Video**.
2. In Instagram: **Reel** → pick the video. This reel moves from the first frame on purpose (no title card), so set the cover yourself: **Edit cover → Add from camera roll** and choose the cover image (kit page → **Save cover image**).
3. **Add audio** from Instagram's library. Search: ${list(m.search) || '—'}${m.mood ? `  \n   Mood: ${m.mood}${m.genre ? ' · ' + m.genre : ''}${film ? ' · about ' + bpm + ' BPM' : m.bpm ? ' · ' + m.bpm + ' BPM' : ''}.` : ''}  
   ${film && meta.audio !== 'mixed' ? `The film carries its own sound effects only (whooshes, clicks, impacts) and is cut on a **${bpm} BPM** grid: choose a track near ${bpm} BPM and, in Instagram's audio trim, start it on a downbeat so the cuts land on its beats. Keep the film's own sound at about 30% in the volume mixer: the effects are timed to the cuts.` : (meta.audio === 'mixed' ? 'The video already carries its AI voice-over and sound effects. Add Instagram music under it at about **20%** in the volume mixer so the voice stays clear (label the reel as AI in Advanced settings).' : 'This video has no music of its own: add Instagram\'s audio.')}
4. Paste the caption + keywords below, then **Share**.
5. Tick **Reel uploaded** in the app so it is never posted twice.
6. **Reach test (15-28 Oct):** post at **19:30 IST**, share the reel to your **Story with a poll sticker**, and **DM it to 5-10 people** who run this kind of business.  
   Then comment here in one line, e.g. \`posted 19:32 audio y story y dms 7\`, so the stats can be read next to what was done.

${film ? `> **Experiment E6 · directed film:** about 18 s, motion-directed (virtual camera, beat-locked type) instead of a screen recording; the hook is on screen in the first 3 seconds and the last frame loops into the first. Post it as it is (no extra text of your own on top). Results are compared with the screen-recording reels (design/experiments.md).` : `> **Experiment E1 · format B:** about 18 s, the hook shows on screen for the first 3 seconds, no static intro. Post it as it is (no extra text of your own on top). The results are compared with the first five reels (design/experiments.md).`}

### Hook (already on the video; use it as the first line of your thinking, not extra text)
> ${k.hook}

### Caption + keywords (copy all)
\`\`\`text
${k.caption}

${(k.keywords || []).slice(0, 6).join(' · ')}
\`\`\`

<details><summary>Optional hashtags · all keywords · payoff</summary>

**Hashtags (optional, 1-2 at most; Instagram's limit is 5):** ${(k.hashtags || []).join(' ')}  ·  more: ${(k.alternates || []).join(' ')}

**Keywords:** ${(k.keywords || []).join(', ')}

**Payoff (what keeps people watching):** ${r.payoff || '—'}

**Cover text:** ${r.cover || '—'}

</details>

_Rendered automatically after the deploy. The MP4 is stored in the \`reels\` release and served only to signed-in users on your site._`);
