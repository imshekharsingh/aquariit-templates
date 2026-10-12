// Writes the "Reel ready" GitHub issue for a template (markdown on stdout; `--title` prints the title only).
// Everything the owner needs to post the reel in about a minute: where to get the video, the caption to paste, audio search terms, the checklist.
// Usage: node scripts/reel-issue.mjs ID [--title]      (reads templates/social-kits.json, built by scripts/build-kits.mjs)
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const id = process.argv.slice(2).find((a) => !a.startsWith('--'));
const kits = JSON.parse(readFileSync(join(root, 'templates', 'social-kits.json'), 'utf8'));
const k = kits.find((x) => x.id === id);
if (!k) { console.error(`No kit for ${id}`); process.exit(1); }
if (process.argv.includes('--title')) { console.log(`Reel ready: ${k.name} (${id})`); process.exit(0); }

const site = 'https://templates.aquariit.com', list = (a) => (a || []).map((x) => `\`${x}\``).join(', ');
const m = k.music || {}, r = k.reel || {};
console.log(`## 🎬 ${k.name} — your reel is rendered

**Video + kit (sign in first):** ${site}/kit/?id=${id}
**Template:** ${site}/${id}/

### Post it (about a minute)
1. Open the kit link above on your iPhone and tap **Save / share to Instagram**, then choose *Save Video* so it lands in Photos (Instagram only sees Photos).  
   If the sheet only offers Files or Drive: save to Files, open Files, press and hold the video → **Share → Save Video**.
2. In Instagram: **Reel** → pick the video. Keep the first frame as the cover (it is the cover card).
3. **Add audio** from Instagram's library. Search: ${list(m.search) || '—'}${m.mood ? `  \n   Mood: ${m.mood}${m.genre ? ' · ' + m.genre : ''}${m.bpm ? ' · ' + m.bpm + ' BPM' : ''}.` : ''}  
   Use the volume mixer to turn the video's own (generated) music down or off.
4. Paste the caption below, then **Share**.
5. Tick **Reel uploaded** in the app so it is never posted twice.

### Hook (on-screen text, first 2 seconds)
> ${k.hook}

### Caption + hashtags (copy all)
\`\`\`text
${k.caption}

${(k.hashtags || []).join(' ')}
\`\`\`

<details><summary>More hashtags to rotate · keywords · payoff</summary>

**Rotate in on other posts (never all at once):** ${(k.alternates || []).join(' ')}

**Keywords:** ${(k.keywords || []).join(', ')}

**Payoff (what keeps people watching):** ${r.payoff || '—'}

**Cover text:** ${r.cover || '—'}

</details>

_Rendered automatically after the deploy. The MP4 is stored in the \`reels\` release and served only to signed-in users on your site._`);
