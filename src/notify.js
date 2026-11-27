// Notification plan (owner, 25 Nov 2026; one policy, task 6, 27 Nov 2026), pure and testable: which pushes are due right now, from the reels of
// today. No network, no database. Times and words come from design/notify-policy.json; slot tests from design/slots.json "tests".
// Regular: ready 2 min BEFORE the slot, nudge 15 min after if not posted, last call 20:30 IST, the 08:00 morning summary.
// A channel in a slot test (today between its from and until): ready says the test day, nudge 10 min after, late at 30 min, logged once posted.
// "posted" and "failed" are sent when Post now reports them. Each key is sent at most once (the Worker logs it in D1 notif_log).
import POLICY from '../design/notify-policy.json' with { type: 'json' };
export { POLICY };
export const IST = 5.5 * 3600e3;
export const NOTIFY_TYPES = ['ready', 'nudge', 'late', 'logged', 'last', 'posted', 'failed', 'digest', 'project-done'];
export const NOTIFY_LABEL = { ready: 'A reel is ready to post (2 min before its time)', nudge: 'A gentle nudge if it is not posted (15 min after; 10 min on a slot test day)', late: 'Slot test: a warning 30 min after the time', logged: 'Slot test: the posting time is logged', last: 'A last call at 8:30 PM', posted: 'Posted, with the link', failed: 'Posting failed, and why', digest: 'The morning summary at 8:00 AM', 'project-done': 'A project is done' };
const hm = (s) => (/^\d{2}:\d{2}$/.test(s || '') ? +s.slice(0, 2) * 60 + +s.slice(3, 5) : null);
export const istParts = (now) => { const d = new Date(now + IST); return { day: d.toISOString().slice(0, 10), min: d.getUTCHours() * 60 + d.getUTCMinutes() }; };
// a channel's slot test on a day: { n, days, slot, until } or null (no test, or the day is outside it)
export function testOf(ch, day, tests) {
  const t = tests && tests[ch]; if (!t || !/^\d{4}-\d{2}-\d{2}$/.test(t.from || '') || !/^\d{4}-\d{2}-\d{2}$/.test(t.until || '') || day < t.from || day > t.until) return null;
  const d = (a, b) => Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 864e5);
  return { n: d(t.from, day) + 1, days: d(t.from, t.until) + 1, slot: t.slot || null, until: t.until };
}
// fills a policy line: "{ch} reel is ready" -> "Web reel is ready"
export const fill = (tpl, v) => String(tpl || '').replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? String(v[k]) : m));
// reels: [{ name, ch, day (IST postOn), due (ms), ready (false = not cleared by the second look), posted, postedAt (ms, when marked posted) }]
export function plan(now, reels, tests = {}, policy = POLICY) {
  const { day, min } = istParts(now), out = [];
  for (const r of reels) {
    if (r.day !== day) continue;
    const t = testOf(r.ch, day, tests), P = t ? policy.test : policy.regular, since = (now - r.due) / 60e3, key = (x) => `${x}:${r.name}:${new Date(r.due).toISOString()}`;
    const lastMin = hm(P.last && P.last.clock) ?? 20 * 60 + 30, lateAt = P.late ? P.late.at : Infinity;
    if (r.posted) { if (t && P.logged && r.postedAt) out.push({ type: 'logged', key: key('logged'), reel: r.name, test: t, onTime: (r.postedAt - r.due) / 60e3 <= (policy.test.onTimeWithin ?? 30) }); continue; }
    if (!r.ready) continue;
    if (since >= P.ready.at && since < P.nudge.at) out.push({ type: 'ready', key: key('ready'), reel: r.name, test: t });
    else if (since >= P.nudge.at && since < Math.min(lateAt, P.nudge.at + 60) && min < lastMin) out.push({ type: 'nudge', key: key('nudge'), reel: r.name, test: t });
    else if (since >= lateAt && since < lateAt + 60 && min < lastMin) out.push({ type: 'late', key: key('late'), reel: r.name, test: t });
    if (since >= 0 && min >= lastMin && min < lastMin + 60) out.push({ type: 'last', key: key('last'), reel: r.name, test: t });
  }
  const dg = hm(policy.regular.digest && policy.regular.digest.clock) ?? 8 * 60;
  if (min >= dg && min < dg + 60) out.push({ type: 'digest', key: 'digest:' + day, reel: null });
  return out;
}
// the plan for today in plain words (Settings > Notifications): one line per type, and which channels are in a slot test until when
export function planToday(day, slots, tests = {}, policy = POLICY) {
  const at = (s, d) => { const m = hm(s); if (m == null) return '?'; const x = m + d; return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(((x % 60) + 60) % 60).padStart(2, '0'); };
  const name = { web: 'Web', tech: 'Tech', c3: 'Turns Out' }, R = policy.regular, T = policy.test, lines = [];
  for (const ch of ['c3', 'web', 'tech']) { const s = slots[ch]; if (!s) continue; const t = testOf(ch, day, tests), P = t ? T : R;
    const nudge = hm(at(s, P.nudge.at)) < (hm(P.last.clock) ?? 1230) ? `, nudge ${at(s, P.nudge.at)}` : `, no nudge (the ${P.last.clock} last call comes first)`;
    lines.push(`${name[ch]}: ready ${at(s, P.ready.at)}${nudge}` + (t ? `, late ${at(s, P.late.at)}, logged when posted (slot test day ${t.n} of ${t.days}, until ${t.until})` : '')); }
  lines.push(`Last call ${R.last.clock} for anything not posted; morning summary ${R.digest.clock}.`);
  return lines;
}
