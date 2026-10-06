// Generates templates/icons/*.png with zero dependencies (zlib + CRC32).
// Geometry mirrors templates/icons/icon.svg. Run: npm run icons
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'templates', 'icons');
mkdirSync(out, { recursive: true });

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (b) => {
  let c = 0xffffffff;
  for (const x of b) c = crcTable[(c ^ x) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
const png = (w, h, rgb) => {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 3 + 1)] = 0; rgb.copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
};

const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const BG1 = hex('#0b2a3a'), BG2 = hex('#14566b');
// Four tiles on a 512 grid (safe-zone friendly): [x, y, size, radius, colour, alpha]
const TILES = [
  [128, 128, 112, 24, hex('#f4efe4'), 1], [272, 128, 112, 24, hex('#ff8a5c'), 1],
  [128, 272, 112, 24, hex('#5fd4c2'), 1], [272, 272, 112, 24, hex('#f4efe4'), 0.4],
];
const inRR = (x, y, [tx, ty, s, r]) => {
  const dx = Math.max(tx + r - x, 0, x - (tx + s - r)), dy = Math.max(ty + r - y, 0, y - (ty + s - r));
  return x >= tx && x <= tx + s && y >= ty && y <= ty + s && dx * dx + dy * dy <= r * r;
};
const render = (size) => {
  const buf = Buffer.alloc(size * size * 3), SS = 3;
  for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
    let r = 0, g = 0, b = 0;
    for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
      const x = ((px + (sx + 0.5) / SS) / size) * 512, y = ((py + (sy + 0.5) / SS) / size) * 512;
      const t = (x + y) / 1024;
      let c = BG1.map((v, i) => v + (BG2[i] - v) * t);
      for (const tile of TILES) if (inRR(x, y, tile)) c = c.map((v, i) => v + (tile[4][i] - v) * tile[5]);
      r += c[0]; g += c[1]; b += c[2];
    }
    const o = (py * size + px) * 3, n = SS * SS;
    buf[o] = Math.round(r / n); buf[o + 1] = Math.round(g / n); buf[o + 2] = Math.round(b / n);
  }
  return png(size, size, buf);
};
for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  writeFileSync(join(out, name), render(size));
  console.log('wrote', name);
}
