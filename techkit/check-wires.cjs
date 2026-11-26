// No-render wire check for a 3D kit scene (task 10, owner 26 Nov 2026: "cables never pass through the floor or any object").
// For every cable in window.__dbg.wires: its lowest surface point is at or above the floor, and no point of it (away from its two plugs) is inside
// an object (each mesh of window.__dbg.solids, plus any extra boxes in __dbg.solidBoxes). Checked at the end state of the scene (t = TOTAL).
// Usage: python3 scripts/tech-assemble.py <slug>; node techkit/check-wires.cjs out/techreel/<slug>/scene.html   (exit 1 on a fault)
const path = require('path'); const pw = require('playwright');
(async () => { const [scene] = process.argv.slice(2); const b = await pw.chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: .2 });
  pg.on('pageerror', (e) => console.error('PAGEERR', e.message));
  await pg.goto('file://' + path.resolve(scene), { timeout: 300000 });
  const r = await pg.evaluate(() => { const D = window.__dbg, T = D.S.THREE; D.frame(D.TOTAL); const boxes = [];
    for (const s of D.solids) { s.updateMatrixWorld(true); s.traverse((m) => { if (m.isMesh && !m.userData.noShadow && m.geometry && m.geometry.type !== 'PlaneGeometry') { const bx = new T.Box3().setFromObject(m); bx.expandByScalar(-.015); boxes.push([bx, m.parent && m.parent.type === 'Group' ? 'solid' : 'mesh']); } }); }
    const out = { low: [], inside: [], n: D.wires.length };
    D.wires.forEach((w, wi) => { const lo = w.lowest(); if (lo < -.002) out.low.push([wi, +lo.toFixed(3)]);
      for (let i = 0; i <= 300; i++) { const u = i / 300; if (u < .07 || u > .93) continue; const pt = w.curve.getPointAt(u);
        if (boxes.some(([bx]) => bx.containsPoint(pt))) { out.inside.push([wi, +u.toFixed(2), pt.toArray().map((v) => +v.toFixed(2))]); break; } } });
    return out; });
  console.log(`WIRES: ${r.n} cables; through the floor: ${r.low.length ? JSON.stringify(r.low) : 'none'}; through an object: ${r.inside.length ? JSON.stringify(r.inside.slice(0, 10)) : 'none'}`);
  await b.close(); process.exit(r.low.length || r.inside.length ? 1 : 0); })();
