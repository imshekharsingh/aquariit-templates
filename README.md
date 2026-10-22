# webin20sec studio

Premium web motion, built in code, in 20 seconds: the content studio for the Instagram account @webin20sec.

- **App**: https://templates.aquariit.com (installable PWA, behind a sign-in). Home = Showreels (play, copy post text, save video);
  `/archive/` = the 33 templates built 6-17 Oct 2026, still live.
- **Plan**: design/webin20sec.md (series, craft bar, log). Audits: design/experiments.md.
- **Make a reel**: a seekable scene `scripts/explainer/<slug>.html` (`window.seek(t)`) + `<slug>.json`, then Actions → **Showreel** → config = the json.
  The render lands in the "reels" release, the Showreels page and a "Showreel ready" issue.
- **Deploy**: push a branch; the Template pipeline checks, merges and deploys. `npm run check` locally first.
- `attic/` keeps the retired tooling (films, screen recordings, social kits) for reference; nothing in it runs.
