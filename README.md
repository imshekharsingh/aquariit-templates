# Aquarii Templates

One original, copyright-safe webpage template per day, published to
**https://templates.aquariit.com** as a static-assets-only Cloudflare Worker.
The home page lists every template by date; the site is an installable PWA.
Each template also ships with an Instagram kit (caption, keywords, hashtags, music).

Templates generated: **18**
Latest: [2026-10-11 09:39 · Tidemark Studio](https://templates.aquariit.com/2026-10-11-0939/)

## How `/daily-template` works
Run `/daily-template [hint]` in Claude Code, any time, as often as you like. Each run makes
one new template whose ID is the India date and time (e.g. `2026-10-07-0905`), creates branch
`template/ID` from latest `main`, designs
a template that differs from every earlier one (see `CLAUDE.md`), writes the
Instagram kit, runs `npm run check`, appends to `design-log.json` (mirrored to
`templates/design-log.json`), and pushes the branch. It never touches `main`
and never deploys.

## Instagram kit
Each template has `social/ID.md` (not deployed): a hook that opens a loop the video's ending closes, a caption that
ends with a "send this to…" line (shares per reach is a key signal), 8–12 SEO keywords, **exactly 5 hashtags** (Instagram's
per-post limit) plus alternates to rotate, and a music suggestion by mood
(genre, BPM, audio-search terms, accent sounds), plus a Reel plan (length, shot plan,
cover text). `npm run check` enforces it. The account is a creator/personal account,
so the full audio library works; boosted Reels may lose audio, so keep a royalty-free fallback.

## Post kit in the app
The home page has a **Post kit** stub on today's card and a **Kit** button on every row. It opens
`/kit/?id=ID`: hook, caption, 5 hashtag chips, keywords, Reel plan with cover preview, and music
(search terms), each with tap-to-copy and a sticky **Copy caption + hashtags** button.
Kits are built from `social/*.md` into `templates/social-kits.json` (generated, not committed).

## Play for recording (▶)
Every template has a **▶ Play** button (home list, today's card, kit page). Start your screen recording,
tap ▶, and everything else is automatic: a 5-second countdown, then the template opens in a 9:16 frame and
scrolls itself like a human camera move (hold on the hero, glide to each section, pause, glide on, hold at
the end) while original generated music plays and ends exactly with the scroll.
- **Music** is synthesised in the browser (Web Audio), so there is nothing to license. There are 11 styles (Lo-fi, Chill-hop,
  Folk, Piano, Jazz, Funk, Synthwave, Tech, Cinematic, Ambient, Playful). **Auto** maps the template's theme to a few fitting
  styles and picks one by template id, so similar moods don't all sound alike (override or turn off in ⚙). Bars are scheduled
  a few seconds ahead of the audio clock so building the music never stalls the screen.
- **9:16 frame:** the template is shown in a centred 9:16 box (402×715 on an iPhone 17 Pro). The bands above/below
  carry the status bar and home indicator in the template's own background colour, and Instagram's default crop of
  a tall screen recording trims them, so the Reel shows only the template.
- **⚙ Reel settings** (home header / kit page): length (20–60 s), music, frame (Reel 9:16 / full screen), hide the
  "← All templates" link, plus an 8-second music preview.
- Templates stay clean: no player UI is injected into them except hiding the back link. Optional hook for odd
  layouts: `window.__reel = { scroller, axis, duration, stops }` (see `CLAUDE.md`).
- **Smart pauses.** The scroll pauses where a content block starts under the header, with the frame's bottom edge in a gap
  between blocks. `node scripts/reel-audit.mjs ID` plans the scroll for a template at 402×715, flags any pause that would
  cut a block in half, and saves a screenshot of every pause (used by the daily run).
- **Smoothness.** The scroll runs on the screen's own frame clock (not the audio clock), in whole device pixels, with the
  sticky header made opaque and the page behind the player frozen. `node scripts/reel-perf.mjs ID` replays a template through
  the player under a simulated slower phone and reports how even the scrolling is.
- Tip: install the app (Add to Home Screen) so the recording has no browser bars; silent switch off, volume up.

## Sign-in
The site is behind a sign-in page (`/login`) and a signed, HttpOnly 30-day session cookie, enforced by `src/worker.js`
(so the Worker now has a script; the assets are still static). This works inside the installed iPhone/iPad app,
unlike the browser's Basic-auth popup, and iOS can autofill the form. `/manifest.webmanifest`, `/sw.js`, `/icons/*`
and `/login` stay public so the PWA can install. **Sign out** is at the bottom of the home page.
Credentials are **never in the repo**: GitHub secrets `BASIC_AUTH_USER` and `BASIC_AUTH_PASS` (the names are historical)
are pushed to the Worker by the deploy job. A **second account** is optional: add `BASIC_AUTH_USER_2` and `BASIC_AUTH_PASS_2`
(both) and either account can sign in; each session cookie is tied to its own account. The username is case-insensitive, the
password is exact. Changing the password signs every device out. If the secrets are missing the
deploy stops (the old site stays up); if the Worker has none it returns 503 instead of serving openly.
Scripts can still authenticate with `curl --user`.

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
# with the sign-in gate: put BASIC_AUTH_USER / BASIC_AUTH_PASS in .dev.vars (gitignored), then npx wrangler dev
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
src/worker.js             sign-in gate (login page + session cookie) in front of the assets
templates/play/player.js  ▶ reel player: countdown, scroll director, generated music
scripts/build-kits.mjs    social/*.md -> templates/social-kits.json
scripts/check.mjs         sanity checks (npm run check)
scripts/make-icons.mjs    regenerates PNG icons (npm run icons)
archive/                  pre-pipeline experiments (not deployed)
wrangler.jsonc            assets-only Worker config
.github/workflows/        pipeline.yml
.claude/                  /daily-template command and permissions
```

## Pipeline safety nets

- The merge step only reuses an **open** pull request, and skips cleanly when a branch has nothing new for `main`.
- Any failed run opens a GitHub issue ("Pipeline failed: <branch>") so the failure is seen the same day.
- A daily watchdog (10:00 IST) re-deploys `main` and re-runs the smoke test, so a transient morning failure heals itself.
- After every successful deploy a cleanup job deletes any branch whose PR is merged (and has no newer commits), so only `main` and open work remain.
- **Reel cover:** each template has `templates/covers/ID.jpg` (made by `node scripts/make-cover.mjs ID`). The ▶ player shows it on a 1.3 s cover card (cover text from the kit) at the start of the recording, so that first frame can be picked as the Instagram Reel cover. Toggle it in ⚙ settings.
- **Reel uploaded checkbox:** every template row, today's card and each kit page has a "Reel uploaded" tick (`templates/uploaded.js`). It is saved on the device (localStorage), shows "Reels uploaded N of M" with All / To upload / Uploaded filters, and has Backup / Restore (copy and paste) to move ticks between devices.

### Reel-uploaded ticks in Cloudflare D1 (one-time setup)
The ticks sync through `/api/uploaded` (Worker, behind the same sign-in) into a D1 table `reel_uploaded` that the Worker creates itself.
Until a D1 database is bound the API answers 501 and the pages keep the ticks on the device, so nothing breaks.
To switch it on:
1. Cloudflare dashboard → Storage & Databases → D1 → Create database → name it `aquarii-templates` and copy its **Database ID**.
2. Add to `wrangler.jsonc`: `"d1_databases": [{ "binding": "DB", "database_name": "aquarii-templates", "database_id": "<the ID>" }]` (an ID is not a secret) and merge it through the normal pipeline.
Ticks already saved on a device are uploaded the first time that device opens the page after the switch.

