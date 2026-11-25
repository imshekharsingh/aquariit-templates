// Plain words test (25 Nov 2026): the app's pw() turns codes and jargon from the server, review files and the daily report into plain words, and the page's own
// text has none of them. Run: node scripts/qa/plain-words-test.mjs
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../../templates/index.html', import.meta.url), 'utf8');
const a = html.indexOf('var PW = ['), b = html.indexOf('var SAY = {');
if (a < 0 || b < 0) { console.log('FAIL pw() not found in templates/index.html'); process.exit(1); }
const pw = new Function(html.slice(a, b) + '; return pw;')();
let bad = 0; const ok = (n, c) => { if (!c) bad++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}`); };
const CODES = /\b(ALARM|ESCALATE|OQA|PROMOTE|SYNC|VARIETY|CRITIC|NOT READY)\b|\bPR #\d+|\b(run|render) #?\d{6,}|\bitem \d+\b|\brule \d+\b|\bR-[A-Za-z0-9-]+|GH_DISPATCH_TOKEN|captions\.json/;
for (const t of ['Output QA failed: SYNC: 2 LANES not readable at 10.4 s', 'ESCALATE web: ALARM two days in a row', 'CRITIC: NOT READY, shot 4 is a smear (item 13, run 45368585690)', 'PR #1234 merged', 'rule 11 and R-trend-1', 'Fix captions.json and GH_DISPATCH_TOKEN'])
  ok('plain: ' + t, !CODES.test(pw(t)));
// the page's own text: the markup outside scripts and styles
const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
ok('the page text has no codes', !CODES.test(text));
console.log(bad ? `PLAIN WORDS TEST: ${bad} FAILED` : 'PLAIN WORDS TEST: all passed'); process.exit(bad ? 1 : 0);
