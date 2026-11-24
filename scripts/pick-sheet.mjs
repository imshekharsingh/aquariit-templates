// One compact sheet of the day's topic options for the Fable pick (design/runbook-daily.md "Fable decides"): keeps that call cheap.
//   node scripts/pick-sheet.mjs [--day "26 Nov"] [--channel web|tech] [--log]
// Reads design/topic-bank.md (the "### <Day> <date>" blocks under "## WEB" / "## TECH") and prints, per option: id, PICK mark, title, the hook,
// the one thing to learn, the facts' source links and the weakness. No bullets of prose beyond that, so the whole day fits one short read.
// With no --day it uses today's date in IST. --log prints only the rejects of the last two logged days from design/pick-log.md
// (the line format is in that file); 8 or more rejected of the 10 options on each of the two days = "RESEARCH TO OPUS".
import { readFileSync, existsSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ist = new Date(Date.now() + 5.5 * 3600e3);
const today = `${ist.getUTCDate()} ${MON[ist.getUTCMonth()]}`;
// match on "26 Nov" only: the bank's weekday names are not always right (web said Wed 26 Nov, tech Thu 26 Nov)
const day = (opt('--day') || today).replace(/^[A-Za-z]{3}\s+(?=\d)/, '');
const only = opt('--channel');

function rejects() {
  const f = 'design/pick-log.md';
  if (!existsSync(f)) return { perDay: [], flag: false };
  const rows = readFileSync(f, 'utf8').split('\n').map(l => l.match(/^(\d{4}-\d{2}-\d{2}) \| (web|tech) \| (.+)$/)).filter(Boolean);
  const by = {};
  for (const r of rows) for (const t of r[3].split(/\s+/)) { const m = t.match(/^([A-Z]\d+-\d+):(keep|reject)$/); if (m) { const d = by[r[1]] ||= { shown: 0, rejected: 0 }; d.shown++; if (m[2] === 'reject') d.rejected++; } }
  const perDay = Object.keys(by).sort().slice(-2).map(k => ({ day: k, ...by[k] }));
  // flag: each of the last two logged days had 8 or more rejected (of its 10 options)
  return { perDay, flag: perDay.length === 2 && perDay.every(d => d.rejected >= 8) };
}
const rj = rejects();
const rjText = rj.perDay.length ? rj.perDay.map(d => `${d.day} ${d.rejected} of ${d.shown} rejected`).join(', ') : 'nothing logged yet';
if (args.includes('--log')) {
  console.log(`PICK LOG: ${rjText}${rj.flag ? '  -> RESEARCH TO OPUS' : ''}`);
  process.exit(0);
}

const lines = readFileSync('design/topic-bank.md', 'utf8').split('\n');
let channel = null, inDay = false, cur = null;
const out = [];
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);
const flush = () => { if (cur) { out.push(cur); cur = null; } };
for (const l of lines) {
  let m;
  if ((m = l.match(/^## (WEB|TECH)\b/))) { flush(); channel = m[1].toLowerCase(); inDay = false; continue; }
  if (/^## /.test(l)) { flush(); channel = null; inDay = false; continue; }
  if ((m = l.match(/^### (.+)$/))) { flush(); inDay = !!channel && m[1].trim().replace(/^[A-Za-z]{3}\s+/, '').startsWith(day) && (!only || only === channel); continue; }
  if (!inDay) continue;
  if ((m = l.match(/^\*\*([A-Z]\d+-\d+)( PICK)?:\s*(.+?)\*\*\s*$/))) { flush(); cur = { ch: channel, id: m[1], pick: !!m[2], title: m[3], hook: '', learn: '', urls: [], weak: '' }; continue; }
  if (!cur) continue;
  if ((m = l.match(/^- Hook:\s*(.+)$/))) cur.hook = m[1];
  else if ((m = l.match(/^- Learn:\s*(.+)$/))) cur.learn = m[1];
  else if ((m = l.match(/^- (?:Weakness|Risk):\s*(.+)$/))) cur.weak = m[1];
  const u = l.match(/https?:\/\/[^\s)]+/g);
  if (u && /^- Fact/.test(l)) cur.urls.push(...u);
}
flush();

if (!out.length) { console.error(`No options for "${day}"${only ? ` (${only})` : ''} in design/topic-bank.md.`); process.exit(1); }
console.log(`PICK SHEET ${day}  (${out.length} options; PICK = the researcher's recommendation; choose which to keep, one used at a time)`);
for (const ch of ['web', 'tech']) {
  const o = out.filter(x => x.ch === ch);
  if (!o.length) continue;
  console.log(`\n${ch.toUpperCase()}`);
  for (const x of o) {
    console.log(`${x.id}${x.pick ? ' *' : '  '} ${clip(x.title, 90)}`);
    console.log(`   hook: ${clip(x.hook, 150)}`);
    console.log(`   learn: ${clip(x.learn, 150)}`);
    if (x.urls.length) console.log(`   facts: ${[...new Set(x.urls)].map(u => u.replace(/^https?:\/\//, '').replace(/[.,;]+$/, '')).slice(0, 2).join('  ')}`);
    if (x.weak) console.log(`   weak: ${clip(x.weak, 130)}`);
  }
}
console.log(`
PICK LOG: ${rjText}${rj.flag ? '  -> RESEARCH TO OPUS (runbook-daily "Fable decides")' : ''}`);
console.log('Answer one line per channel: KEEP <ids in the order to use> | REJECT <ids>. Then log it in design/pick-log.md.');
