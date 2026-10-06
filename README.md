# Aquarii Templates

One original, copyright-safe webpage template per day, published to
**https://templates.aquariit.com** as a static-assets-only Cloudflare Worker.
The home page lists every template by date; the site is an installable PWA.
Each template also ships with an Instagram kit (caption, keywords, hashtags, music).

Templates generated: **2**
Latest: [2026-10-06 18:39 · Pulsarium](https://templates.aquariit.com/2026-10-06-1839/)

## How `/daily-template` works
Run `/daily-template [hint]` in Claude Code, any time, as often as you like. Each run makes
one new template whose ID is the India date and time (e.g. `2026-10-07-0905`), creates branch
`template/ID` from latest `main`, designs
a template that differs from every earlier one (see `CLAUDE.md`), writes the
Instagram kit, runs `npm run check`, appends to `design-log.json` (mirrored to
`templates/design-log.json`), and pushes the branch. It never touches `main`
and never deploys.

## Instagram kit
Each template has `social/ID.md` (not deployed): a hook line for the
first 2 seconds, a caption, 8–12 SEO keywords, **exactly 5 hashtags** (Instagram's
per-post limit) plus alternates to rotate, and a music suggestion by mood
(genre, BPM, audio-search terms, accent sounds), plus a Reel plan (length, shot plan,
cover text). `npm run check` enforces it. The account is a creator/personal account,
so the full audio library works; boosted Reels may lose audio, so keep a royalty-free fallback.

## Post kit in the app
The home page has a **Post kit** stub on today's card and a **Kit** button on every row. It opens
`/kit/?id=ID`: hook, caption, 5 hashtag chips, keywords, Reel plan with cover preview, and music
(search terms), each with tap-to-copy and a sticky **Copy caption + hashtags** button.
Kits are built from `social/*.md` into `templates/social-kits.json` (generated, not committed).

## Password protection
The site is behind HTTP basic auth, enforced by `src/worker.js` (so the Worker now has a script;
the assets are still static). `/manifest.webmanifest` and `/icons/*` stay public so the PWA can install.
Credentials are **never in the repo**: add GitHub secrets `BASIC_AUTH_USER` and `BASIC_AUTH_PASS`;
the deploy job pushes them to the Worker as secrets. If they are missing the deploy stops (the old
site stays up); if the Worker has none it returns 503 instead of serving openly.

## Pipeline (`.github/workflows/pipeline.yml`)
`push to template/*` → **checks** (`npm run check`) → **merge** (opens a PR and
squash-merges it) → **deploy** (`wrangler deploy` from `main`) → **smoke test**
(home, `/design-log.json`, manifest and the newest template must return 200).
Use a new branch name for each change: a branch whose PR was already merged
can't be reused by the pipeline.

### One-time setup (done)
- Repo secrets `BASIC_AUTH_USER` and `BASIC_AUTH_PASS` (site password).
- Repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; Environment `production`.
- Settings → Actions → General: read and write permissions, and allow Actions to create pull requests.
- The `aquariit.com` zone is on the same Cloudflare account (custom domain `templates.aquariit.com`).

## Install on iPad / iPhone
Open https://templates.aquariit.com in Safari → **Share** → **Add to Home Screen**.
Every template has an "← All templates" link back to the home page.

## Run locally
```
npm install
npm run check                      # also builds templates/social-kits.json
cd templates && python3 -m http.server 8000   # http://localhost:8000 (no password locally)
# with the password gate: put BASIC_AUTH_USER / BASIC_AUTH_PASS in .dev.vars (gitignored), then npx wrangler dev
```

## Structure
```
CLAUDE.md                 rules for daily runs
design-log.json           design history (source of truth)
templates/
  index.html              home / date index (reads /design-log.json)
  404.html  sw.js  manifest.webmanifest  icons/  design-log.json
  ID/index.html           one self-contained template per run (ID = YYYY-MM-DD-HHMM, IST)
social/ID.md      Instagram kit per template (not deployed)
src/worker.js             basic-auth gate in front of the assets
scripts/build-kits.mjs    social/*.md -> templates/social-kits.json
scripts/check.mjs         sanity checks (npm run check)
scripts/make-icons.mjs    regenerates PNG icons (npm run icons)
archive/                  pre-pipeline experiments (not deployed)
wrangler.jsonc            assets-only Worker config
.github/workflows/        pipeline.yml
.claude/                  /daily-template command and permissions
```
