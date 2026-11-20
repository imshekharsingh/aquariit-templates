# Handoff log (both accounts)

Every session on either account that changes the repo adds ONE entry at the top, in the same push as its work. Newest first; keep the last
30 entries and move older ones to the bottom of design/craft-log.md. Read the last 5 entries before starting.

Format (at most 6 lines):
```
## YYYY-MM-DD HH:MM IST · main | second · <task in a few words>
- Done: what changed (files or feature), PR number.
- Left: what is unfinished or broken, if anything.
- For the other account: anything it must know or must not touch; a proposed rule change goes here.
```

## 2026-11-20 10:00 IST · main · Turns Out reel (in progress)
- Done: topic Washington Monument's aluminium tip (config scripts/channel3/aluminium-tip.json, media request, hidden captions entry); NPS and National Archives Prologue agree on the facts, the price claim is left out (sources disagree on silver vs twice silver).
- Left: Media run, MEDIA_JSON into the config, stills review, one render, Output QA, unhide the captions entry.
- For the other account: Wikimedia is one of three sources per image (Openverse and Library of Congress first).

## 2026-11-20 07:15 IST · main · daily run (web + tech)
- Done: Owner answers read (0 feedback, 0 answers); audit acted on (web ESCALATE answered by a new topic type, rules-web.md "ESCALATE 20 Nov"; the PROMOTEs and the DROP were already rules since 18 Nov); web Nº 42 showreel-42-snapback (animation-fill-mode forwards; review file, tip demo, captions entry, cobalt world).
- Left: web render 1 and its Output QA check; tech showreel-tech-wireless-worth (techkit/scenes/wireless-worth.js, review file) and its render; the 11:17 critic. Audit card posted. The audit card was not dispatched by this session if the next line says so.
- For the other account: the scene's local SPLIT / CALM / HUE read on frames (PW_FROM=$(npm root -g)/ node scripts/qa/frames.mjs; python3 scripts/qa/look.py); mean CALM was 4.8% of 5%, so a calmer next web reel starts from fewer taps.

## 2026-11-19 11:40 IST · main · reel critic (19 Nov)
- Done: CRITIC: READY on showreel-41-gradient (web) and showreel-tech-phone-claim (tech), item 20 + ENHANCE in each review file; no re-render.
- Left: no Turns Out reel in captions.json for 19 Nov (nothing to review); the Turns Out daily task should check why.
- For the other account: next web reel keeps the top zone filled during the swipe; next tech reel adds qa.sync and avoids a label-only card.

## 2026-11-19 07:55 IST · main · daily run by hand (web + tech)
- Done: web Nº 41 showreel-41-gradient (swipe-reveal compare, ESCALATE answer; review file, tip demo, captions entry); audit card posted; tech showreel-tech-phone-claim (topic swapped from the power bank: the maker pages were unreachable from this environment, Apple's India spec page was readable).
- Left: web render passed Output QA (run 44442284105); tech render 1 failed only PACE, reworded, render 2 dispatched; the 11:17 critic; the Turns Out run still owes PROMOTE c3-journey and DROP c3-guess (the DROP is already in playbook "What didn't").
- For the other account: the 06:47 scheduled run had no repo access; this run was started by hand from the Owner chat.

## 2026-11-19 01:45 IST · main · handoff files
- Done: design/handoff.md (start here for the second account) and this log; CLAUDE.md "Sessions" now asks every session to read and add to it.
- Left: the second account takes tasks only from the owner in its own chat; open app/tooling items are listed in design/handoff.md for context.
- For the other account: schedule is one reel a day per channel; daily runs push between 06:47 and 13:00 IST.
