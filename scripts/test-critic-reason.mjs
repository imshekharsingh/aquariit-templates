// prints what the Journey's critic parsing returns for review files (usage: node scripts/test-critic-reason.mjs [file...])
import { readFileSync } from 'node:fs';
import { criticOf } from '../src/journey.js';
const files = process.argv.slice(2).length ? process.argv.slice(2) : ['review/web/showreel-44-darkflash.md', 'review/tech/showreel-tech-cold-shutdown.md'];
for (const f of files) {
  for (const l of readFileSync(f, 'utf8').split('\n')) {
    const c = /^\s*(?:20\.\s*)?Critic\b.*?\bCRITIC:\s*(NOT READY|READY)\b(.*)$/i.exec(l);
    if (c) console.log(f, '\n', JSON.stringify(criticOf(c[1], c[2]), null, 1), '\n');
  }
}
console.log(JSON.stringify(criticOf('NOT READY', ': the "10:00" time prints over the BEFORE label at 11-13 s. Detail: questions 2 and 35 ...')));
