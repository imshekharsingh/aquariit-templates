// Top-level MP4 boxes of a file (or of its first N bytes): is the moov atom before mdat, so playback can start without the end of the file?
// Usage: node scripts/showreel/mp4boxes.mjs <file.mp4> [--need-moov-first] [--bytes N]
//   prints "BOXES: ftyp@0 moov@40 mdat@..." and "MOOV_FIRST=yes|no"; with --bytes N it reads only the first N bytes (a Range test) and
//   prints "MOOV_IN_FIRST_N=yes|no" (the whole moov box ends inside those bytes). --need-moov-first exits 1 when it is not.
import { openSync, readSync, fstatSync, closeSync } from 'node:fs';
const [file, ...rest] = process.argv.slice(2);
if (!file) { console.error('usage: node scripts/showreel/mp4boxes.mjs <file.mp4> [--need-moov-first] [--bytes N]'); process.exit(2); }
const need = rest.includes('--need-moov-first'), bi = rest.indexOf('--bytes'), limit = bi >= 0 ? Number(rest[bi + 1]) : 0;
const fd = openSync(file, 'r'), size = fstatSync(fd).size, end = limit ? Math.min(limit, size) : size, boxes = [], h = Buffer.alloc(16);
let off = 0;
while (off + 8 <= end) {
  readSync(fd, h, 0, 16, off);
  let len = h.readUInt32BE(0), hdr = 8;
  const type = h.toString('latin1', 4, 8);
  if (len === 1) { len = Number(h.readBigUInt64BE(8)); hdr = 16; } else if (len === 0) len = size - off;
  if (len < hdr || !/^[\x20-\x7e]{4}$/.test(type)) break;
  boxes.push({ type, off, len });
  off += len;
}
closeSync(fd);
const moov = boxes.find((b) => b.type === 'moov'), mdat = boxes.find((b) => b.type === 'mdat');
const first = !!moov && (!mdat || moov.off < mdat.off);
console.log(`BOXES: ${boxes.map((b) => `${b.type}@${b.off}+${b.len}`).join(' ')}`);
if (limit) console.log(`MOOV_IN_FIRST_${limit}=${moov && moov.off + moov.len <= end ? 'yes' : 'no'}`);
else console.log(`MOOV_FIRST=${first ? 'yes' : 'no'}`);
if (need && !(limit ? moov && moov.off + moov.len <= end : first)) { console.error(`::error::${file}: the moov atom is not at the start`); process.exit(1); }
