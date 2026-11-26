// Shared by scripts/probe-log.mjs, scripts/probe-tune.mjs and scripts/studio-status.mjs (owner, 26 Nov 2026): talks to the app's /api/probe-log.
// Uses curl like scripts/stage.mjs: in a session the network proxy adds the X-Stage-Key header for the app host (the value here is a
// placeholder); in a workflow pass the secret in env STAGE_KEY. The key is never printed or written anywhere.
import { spawnSync } from 'node:child_process';

const HOST = process.env.STAGE_HOST || 'templates.aquariit.com';
export function probeCall(method, query = '', body = null) {
  const r = spawnSync('curl', ['-sS', '--connect-timeout', '15', '--max-time', '45', '--retry', '2', '-w', '\n%{http_code}', '-X', method,
    '-H', 'Content-Type: application/json', '-H', 'X-Stage-Key: ' + (process.env.STAGE_KEY || 'proxy-adds-it'), ...(body ? ['--data-binary', '@-'] : []),
    `https://${HOST}/api/probe-log${query}`], { input: body ? JSON.stringify(body) : undefined, encoding: 'utf8' });
  const out = (r.stdout || '').trimEnd(), i = out.lastIndexOf('\n'), code = +out.slice(i + 1) || 0;
  let json = null; try { json = JSON.parse(out.slice(0, i)); } catch { /* not json */ }
  return { code, json, error: code === 200 ? null : code === 401 ? 'STAGE_KEY is not set up' : code ? 'HTTP ' + code : 'no connection' };
}
export const probeRows = (hours) => { const r = probeCall('GET', '?hours=' + hours); return r.code === 200 && r.json ? { rows: r.json.rows || [] } : { rows: [], error: r.error }; };
export const ist = (iso) => new Date(Date.parse(iso) + 5.5 * 3600e3).toISOString();   // shifted: read with slice, never as a real instant
