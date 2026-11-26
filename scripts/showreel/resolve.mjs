// Finds a reel's config and scene from its name (or config path) for scripts/preflight-all.mjs and scripts/review-gate.mjs, and the fingerprint of what
// the full check looked at (so a PREFLIGHT-ALL: PASS line goes stale when the config or the scene changes after it).
//   web showreel  scripts/explainer/<slug>.json  ("seek": the scene, window.seek(t))
//   Turns Out     scripts/channel3/<slug>.json   (same)
//   tech          techreel/topics/<slug>.json     "engine": "kit" -> techkit/scenes (HTML, window.render(t)); otherwise the older picture engine (techreel/scenes)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));

export const resolveReel = (target) => {
  let cfgPath = '', cfg = null;
  if (/\.json$/.test(target)) { cfgPath = target.replace(/^\.\//, ''); cfg = read(cfgPath); }
  else {
    const t = target.match(/^showreel-tech-(.+)$/);
    if (t && existsSync(join(root, `techreel/topics/${t[1]}.json`))) { cfgPath = `techreel/topics/${t[1]}.json`; cfg = read(cfgPath); }
    else for (const d of ['scripts/explainer', 'scripts/channel3']) {
      for (const f of readdirSync(join(root, d)).filter((x) => x.endsWith('.json'))) { let c; try { c = read(`${d}/${f}`); } catch { continue; } if (c.name === target) { cfgPath = `${d}/${f}`; cfg = c; break; } }
      if (cfg) break;
    }
  }
  if (!cfg) throw new Error(`no reel config found for "${target}" (give a reel name like showreel-tech-tag-sounding or a config path)`);
  const tech = !!(cfg.slug && cfg.lines), kit = tech && cfg.engine === 'kit';
  const name = tech ? `showreel-tech-${cfg.slug}` : cfg.name;
  const kind = kit ? 'kit' : tech ? 'pil' : /channel3/.test(cfgPath) || /^showreel-(pv-)?c3-/.test(name || '') ? 'c3' : 'web';
  const scene = kit ? cfg.scene : tech ? `techreel/topics/${cfg.slug}.json` : cfg.seek;
  return { name, cfgPath, cfg, kind, slug: cfg.slug, scene, channel: tech ? 'tech' : kind };
};

// the fingerprint: the config and the scene file (for a kit scene also the shared 3D libraries it is built from)
export const reelHash = (r) => {
  const h = createHash('sha1'); const files = [r.cfgPath, r.scene];
  if (r.kind === 'kit') files.push('techkit/lib3d.js', 'techkit/world3d.js', 'techkit/kit3d.js');
  for (const f of files) { try { h.update(readFileSync(join(root, f))); } catch { h.update('missing:' + f); } }
  return h.digest('hex').slice(0, 8);
};
export { resolve };
