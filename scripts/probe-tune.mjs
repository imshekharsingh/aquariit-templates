// Weekly tune of the studio probe's schedule (owner, 26 Nov 2026: "as the process aligns we tune it for future with less frequency"). Read-only unless --apply.
//   node scripts/probe-tune.mjs [--file rows.json] [--apply]
// Reads the probe log of the last 14 days (/api/probe-log, STAGE_KEY as in scripts/probe-lib.mjs; --file takes {"rows":[{at,found,acted,what,keys}]} for a test)
// and design/probe-schedule.json (the current check times), then proposes the new times:
//   - never touched: the owner's morning check (06:00-11:00) and the first slot 30 min after each posting slot (design/slots.json), added if missing
//   - a :30 slot that never acted in 7 days (at least 3 checks) goes hourly (the :30 is dropped)
//   - a run of neighbouring slots that never acted in 14 days (at least 6 checks each) is dropped
// Prints the owner's one line, the new times and the cron lines for the scheduled task. --apply writes design/probe-schedule.json (the Sunday owner
// chat or the spare night does that after telling the owner, then updates the scheduled task's cron lines).
import { readFileSync, writeFileSync } from 'node:fs';
import { probeRows } from './probe-lib.mjs';

const a = process.argv.slice(2), file = a.includes('--file') ? a[a.indexOf('--file') + 1] : null, apply = a.includes('--apply');
const sched = JSON.parse(readFileSync('design/probe-schedule.json', 'utf8')), slotsCfg = JSON.parse(readFileSync('design/slots.json', 'utf8')).slots;
const toMin = (s) => +s.slice(0, 2) * 60 + +s.slice(3, 5), fromMin = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
let rows;
if (file) rows = JSON.parse(readFileSync(file, 'utf8')).rows || [];
else { const r = probeRows(14 * 24); if (r.error) { console.error('probe log not read (' + r.error + ')'); process.exit(1); } rows = r.rows; }
const NOW = process.env.STATUS_NOW ? Date.parse(process.env.STATUS_NOW) : Date.now(), DAY = 864e5;
const istMin = (iso) => { const d = new Date(Date.parse(iso) + 5.5 * 36e5); return d.getUTCHours() * 60 + d.getUTCMinutes(); };
const slots = sched.slots.map(toMin), nearest = (m) => slots.reduce((best, s) => (Math.abs(s - m) < Math.abs(best - m) ? s : best), slots[0]);
const stats = new Map(slots.map((s) => [s, { w7: 0, a7: 0, w14: 0, a14: 0 }]));
let n7 = 0, acted7 = 0, firstAt = NOW;
for (const r of rows) {
  const t = Date.parse(r.at); if (!(t > NOW - 14 * DAY)) continue; firstAt = Math.min(firstAt, t);
  const s = stats.get(nearest(istMin(r.at))); s.w14++; if (r.acted) s.a14++;
  if (t > NOW - 7 * DAY) { s.w7++; if (r.acted) s.a7++; n7++; if (r.acted) acted7++; }
}
const days = Math.max(1, Math.round((NOW - firstAt) / DAY));
const protect = new Set(); for (let m = 360; m <= 660; m += 30) protect.add(m);
const keep = new Set(Object.values(slotsCfg).map((t) => toMin(t) + 30)); keep.forEach((m) => protect.add(m));
const next = new Set(slots); keep.forEach((m) => next.add(m));
const notes = [];
if (days >= 5 || file) {
  for (const s of slots) { const st = stats.get(s);
    if (!protect.has(s) && s % 60 === 30 && st.w7 >= 3 && st.a7 === 0) { next.delete(s); notes.push(`${fromMin(s)} never acted in 7 days (${st.w7} checks): dropped, the hour before covers it`); } }
  if (days >= 12 || file) {
    const rest = [...next].filter((s) => !protect.has(s) && stats.has(s)).sort((x, y) => x - y);
    let run = [];
    const flush = () => { if (run.length) { run.forEach((s) => next.delete(s)); notes.push(`${fromMin(run[0])}-${fromMin(run[run.length - 1])} quiet two weeks running (${run.length} slot${run.length > 1 ? 's' : ''}): dropped`); } run = []; };
    for (const s of rest) { const st = stats.get(s); if (st.w14 >= 6 && st.a14 === 0 && (!run.length || s - run[run.length - 1] <= 60)) run.push(s); else { flush(); if (st.w14 >= 6 && st.a14 === 0) run.push(s); } }
    flush();
  }
}
const newSlots = [...next].sort((x, y) => x - y), cost = sched.costPerCheck || 0.15, saved = Math.max(0, (slots.length - newSlots.length) * cost * 7);
// cron lines (IST): hours that share the same minutes are one line
const byHour = {}; for (const s of newSlots) (byHour[Math.floor(s / 60)] ||= []).push(s % 60);
const groups = {}; for (const [h, mins] of Object.entries(byHour)) (groups[mins.join(',')] ||= []).push(+h);
const cron = Object.entries(groups).map(([mins, hs]) => {
  hs.sort((x, y) => x - y); const parts = []; let st = hs[0], pv = hs[0];
  for (const h of hs.slice(1).concat([null])) { if (h === pv + 1) { pv = h; continue; } parts.push(st === pv ? st : `${st}-${pv}`); st = h; pv = h; }
  return `CRON_TZ=${sched.tz} ${mins} ${parts.join(',')} * * *`;
});
console.log(`Probe this week: ${n7} checks, ${acted7} acted, now ${newSlots.length} a day${newSlots.join() === slots.join() ? ' (no change)' : ''}, saving $${saved.toFixed(2)} a week` + (days < 5 && !file ? ` (only ${days} day${days > 1 ? 's' : ''} of log, no change proposed yet)` : ''));
for (const n of notes) console.log('  ' + n);
console.log('  times: ' + newSlots.map(fromMin).join(' '));
for (const c of cron) console.log('  cron: ' + c);
if (apply) { sched.slots = newSlots.map(fromMin); sched.setOn = new Date(NOW + 5.5 * 36e5).toISOString().slice(0, 10); writeFileSync('design/probe-schedule.json', JSON.stringify(sched, null, 2) + '\n'); console.log('applied to design/probe-schedule.json'); }
