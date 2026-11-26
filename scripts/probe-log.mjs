// The studio probe's log (design/probe.md). One line per check, kept in the app's database (/api/probe-log), never in a git commit.
//   node scripts/probe-log.mjs add --found "2 posts, nothing due" --acted no [--what "started critic for showreel-x"] [--keys critic:showreel-x,fix:12]
//   node scripts/probe-log.mjs list [--hours 24]
// Never blocks work: a failed call prints one line and exits 0 (use --strict to fail).
import { probeCall, probeRows, ist } from './probe-lib.mjs';
const a = process.argv.slice(2), cmd = a[0], opt = (n) => { const i = a.indexOf('--' + n); return i >= 0 ? a[i + 1] : undefined; }, strict = a.includes('--strict');
if (cmd === 'add') {
  const found = opt('found');
  if (!found) { console.error('usage: probe-log.mjs add --found "<what the check saw>" --acted yes|no [--what "<what was done>"] [--keys k1,k2]'); process.exit(2); }
  const acted = /^(yes|y|true|1)$/i.test(opt('acted') || 'no');
  const r = probeCall('POST', '', { found, acted, what: opt('what') || '', keys: (opt('keys') || '').split(',').map((s) => s.trim()).filter(Boolean) });
  if (r.code === 200) console.log('probe log ok'); else { console.error('probe log not saved (' + r.error + ')'); if (strict) process.exit(1); }
} else if (cmd === 'list') {
  const { rows, error } = probeRows(Number(opt('hours')) || 24);
  if (error) console.error('probe log not read (' + error + ')');
  for (const r of rows) console.log(`${ist(r.at).slice(5, 16).replace('T', ' ')} IST | ${r.acted ? 'ACTED' : 'quiet'} | ${r.found}${r.what ? ' | ' + r.what : ''}${r.keys.length ? ' | keys ' + r.keys.join(',') : ''}`);
  console.log(`${rows.length} line${rows.length === 1 ? '' : 's'}`);
} else { console.error('usage: probe-log.mjs add|list ...'); process.exit(2); }
