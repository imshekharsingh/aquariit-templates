// Direction card (owner, 24 Nov 2026; design/direction.md): every reel posting from DIRECTION_FROM has review/<channel>/<name>.direction.md,
// 9 lines "N. <Name>: <choice> | Why: <reason>", filled before the build, and the stills check's "STILLS CHECK: APPROVED" line before its render.
//   cardProblems(channel, name, { render }) -> [problems]; render = true also needs the card to exist and to be APPROVED.
//   cardTemplate(channel, name) -> the empty card the starter writes.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const DIRECTION_FROM = '2026-11-25';
export const LINES = ['Hook', 'Pacing curve', 'Camera', 'Light and mood', 'Type motion', 'Transitions', 'Sound moments', 'Rewatch moment', 'Payoff'];
export const BANNED = /\b(default|defaults|steady|simple)\b/i;   // the safe non-answers the owner named
export const cardPath = (channel, name) => `review/${channel}/${name}.direction.md`;

export const cardTemplate = (channel, name) => `# Direction card: ${name}
Fill before the build (design/direction.md: the card, and this channel's defaults to avoid). One line each:
"N. <Name>: <the choice, concrete, with times> | Why: <what it does for the viewer>". Not allowed as answers: default, steady, simple.

${LINES.map((l, i) => `${i + 1}. ${l}: TODO | Why: TODO`).join('\n')}

STILLS CHECK: PENDING
`;

export const cardProblems = (channel, name, { render = false } = {}) => {
  const p = cardPath(channel, name), f = join(root, p);
  if (!existsSync(f)) return render ? [`${p} is missing: fill the direction card before the build (design/direction.md; node scripts/starter.mjs writes it)`] : [];
  const txt = readFileSync(f, 'utf8'), out = [];
  LINES.forEach((l, i) => {
    const m = txt.match(new RegExp(`^\\s*${i + 1}\\.\\s+${l}:\\s*(.*?)\\s*\\|\\s*Why:\\s*(.*)$`, 'm'));
    if (!m) { out.push(`${p}: line ${i + 1} "${l}: <choice> | Why: <reason>" is missing`); return; }
    const [, choice, why] = m;
    if (/TODO|\.\.\./.test(choice + why) || choice.length < 15 || why.length < 10) out.push(`${p}: line ${i + 1} (${l}) is not filled (a concrete choice of 15+ characters and a reason)`);
    else if (BANNED.test(choice) || BANNED.test(why)) out.push(`${p}: line ${i + 1} (${l}) says "${(choice + ' ' + why).match(BANNED)[0]}": name a deliberate choice instead`);
  });
  if (render && !/^STILLS CHECK: APPROVED\b.{10,}/m.test(txt)) out.push(`${p}: no "STILLS CHECK: APPROVED (<session>, <date>): ..." line: the stills check approves the card and the stills together before the render`);
  return out;
};
