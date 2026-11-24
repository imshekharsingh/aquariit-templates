// Notification plan (owner, 25 Nov 2026), pure and testable: which pushes are due right now, from the reels of today. No network, no database.
// Types: ready (at the slot), nudge (45 min later), last (20:30 IST), digest (08:00 IST). "posted" and "failed" are sent when Post now reports them.
// Each key is sent at most once (the Worker logs it in D1 notif_log), so a reel gets at most 1 nudge and 1 last call.
export const IST = 5.5 * 3600e3;
export const NOTIFY_TYPES = ['ready', 'nudge', 'last', 'posted', 'failed', 'digest'];
export const NOTIFY_LABEL = { ready: 'A reel is ready to post (at its time)', nudge: 'A gentle nudge, 45 minutes later', last: 'A last call at 8:30 PM', posted: 'Posted, with the link', failed: 'Posting failed, and why', digest: 'A morning summary at 8:00 AM' };
export const NUDGE_AFTER_MIN = 45, LAST_CALL_MIN = 20 * 60 + 30, DIGEST_MIN = 8 * 60;
export const istParts = (now) => { const d = new Date(now + IST); return { day: d.toISOString().slice(0, 10), min: d.getUTCHours() * 60 + d.getUTCMinutes() }; };
// reels: [{ name, day (IST postOn), due (ms), ready (false = not cleared by the second look), posted }]
export function plan(now, reels) {
  const { day, min } = istParts(now), out = [];
  for (const r of reels) {
    if (r.posted || r.day !== day || !r.ready) continue;
    const since = (now - r.due) / 60e3, key = (t) => `${t}:${r.name}:${new Date(r.due).toISOString()}`;
    if (since >= 0 && since < NUDGE_AFTER_MIN) out.push({ type: 'ready', key: key('ready'), reel: r.name });
    else if (since >= NUDGE_AFTER_MIN && since < NUDGE_AFTER_MIN + 60 && min < LAST_CALL_MIN) out.push({ type: 'nudge', key: key('nudge'), reel: r.name });
    if (since >= 0 && min >= LAST_CALL_MIN && min < LAST_CALL_MIN + 60) out.push({ type: 'last', key: key('last'), reel: r.name });
  }
  if (min >= DIGEST_MIN && min < DIGEST_MIN + 60) out.push({ type: 'digest', key: 'digest:' + day, reel: null });
  return out;
}
