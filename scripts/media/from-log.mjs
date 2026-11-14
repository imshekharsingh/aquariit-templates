// The Media workflow's previews, back as files (sessions cannot download artifacts: the blob host is blocked). Each "B64 <file> <base64>"
// line of the run's log becomes <dest>/<file>: small JPEG previews of every chosen photo (and cut-out PNG) and contact.jpg, for the builder's
// and the critic's stills (the render itself pulls the full files from R2).
// Usage: node scripts/media/from-log.mjs <Media run id> <dest dir>   e.g. ... scripts/channel3/media/showreel-c3-niagara-dry
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
const [run, dest] = process.argv.slice(2), REPO = process.env.REPO || 'imshekharsingh/aquariit-templates';
const gh = (p) => execFileSync('gh', ['api', p], { maxBuffer: 1 << 28 }).toString();
const job = JSON.parse(gh(`repos/${REPO}/actions/runs/${run}/jobs`)).jobs[0];
const log = gh(`repos/${REPO}/actions/jobs/${job.id}/logs`);
mkdirSync(dest, { recursive: true }); let n = 0;
for (const l of log.split('\n')) { const m = l.match(/^\S*\s?B64 (\S+) ([A-Za-z0-9+/=]+)\s*$/); if (m && !/\$\(/.test(l)) { writeFileSync(`${dest}/${m[1]}`, Buffer.from(m[2], 'base64')); n++; } }
console.log(`MEDIA PREVIEWS: ${n} files -> ${dest}` + (n ? '' : ' (none: is this a Media run from 14 Nov 2026 or later?)'));
for (const l of log.split('\n')) if (/MEDIA_JSON /.test(l)) console.log(l.slice(l.indexOf('MEDIA_JSON ')));
