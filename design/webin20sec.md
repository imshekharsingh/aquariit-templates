# @webin20sec: content plan (owned by Claude; owner handed over 22 Oct 2026)

The owner's brief: design and define the content, keep it relevant, push the premium side as far as it goes. The benchmark is @techin20sec
(made with the free plan, not managed here); the daily audit reads both accounts.

## Where we stand (audit 22 Oct 2026)
- @techin20sec: 108-118 reach on every reel, 3.7-5.8 s average watch, the first shares. One topic per reel, a question with a stake in it.
- @webin20sec: 11-48 reach on most reels; one outlier, "6 motion styles" (18 Oct 14:20 IST): 277 reach, 8 saves. Posts at 22:00-23:30 IST did worst.
- Both: average watch 4-6 s. The first second decides the reel; the rest is for the few who stay (and for saves).

## Where we stand (audits 26-27 Oct 2026)
- Goal 1 and the 1,000-reach milestone are met: Nº 04 "Why does your list feel so flat?" 4,062 reach and 151 saves at 29 h; Nº 03 1,141. Median 147 vs @techin20sec 117.
- What works: a "Why does your X...?" question over a flaw you can see, then one line to copy. Instagram keeps pushing these a day later.
- Nº 05 (stutter) held less (8.9 s vs 11.3 s, saves 1.8% vs 3.0%): the fix is subtle on a phone. Next reels: before/after side by side by ~8 s,
  the line of code on screen at least 3 s, fixes you can see at a glance (layout, spacing, motion) over invisible ones (performance).
- Reach does not turn into followers yet (about 9 follows from ~6,000 reach). Profile (owner, 27 Oct): bio "One Web fix a day, in 20 seconds. Save it, ship it.",
  Nº 04 and Nº 03 pinned. Instagram does not give follows or profile visits per reel (tried 27 Oct); the collector reads last-day reach split by followers vs
  non-followers instead (27 Oct: 6,020 reach, 99.6% non-followers), and the audit pairs each day's follower change with that day's reel.
- Series rotation: the winning format leads; a "Six ways" reel told the same way (question hook, narrated) is the contrast every few days.

## Goal
1. Beat @techin20sec's median reach per reel (about 110) within two weeks.
2. Then the milestone: 100 followers or one reel at 1,000 reach.

## Position
Premium web motion, built in code, in 20 seconds. Audience: designers, front-end developers and founders who care how a site feels.
Every reel should be something a designer saves for reference or sends to the person building their site.

## The format from 24 Oct: narrated explainers (owner, 23-24 Oct)
08 and 09 were well made but gave the viewer nothing to keep, and the voice stopped after the hook; the owner did not post them.
The zero-JS tip (a real technique, a hook, sound) held 13.4 s on average, the best since 13 Oct. So every reel now:
- answers one real question our audience has, in about 20 s: problem, why, fix, payoff; facts checked and cited, example numbers labelled;
- has a voice for the whole reel (scripts/showreel/voice.py, Kokoro, open licence) with a timestamp per word; the scene anchors every
  beat, caption and sound to a spoken word (window.setVoice), and captions show one sentence at a time, accent words in colour;
- keeps sound under the voice: quiet taps, soft air on cuts, a low bed (owner, 24 Oct: no big funky pops);
- is made in three steps the owner sees: script + storyboard (stills), a rough cut (real voice over rough frames), then the full build.
The four series below still name the subjects; the narrated explainer is how each is told.

## Four series (rotate; never the same series twice in a row)
1. **Built in 20 s.** One fictional brand's site builds itself: grid, type, imagery, UI, scroll, a page opening, a pull-back. A timer counts to 20.
   Each one has a different industry and art direction (first: Halden, Swiss modernist, scripts/explainer/built.html).
2. **Six ways.** One element (hero, button, loader, card, menu, text reveal, page transition) in six premium treatments, numbered, full frame.
   The proven saver (277 reach, 8 saves). It must look premium, not like a demo: one art direction holds all six together.
3. **Steal this.** One premium technique shown full frame, then the one to three lines of real CSS/JS that make it, on screen.
   Facts are checked (browser support, specs) and cited on screen.
4. **Material.** Interface rendered as a real object: glass that refracts, metal that reflects, soft shadows, light that moves.
   A WebGL renderer written per reel (first: scripts/explainer/glass.html, liquid glass over a music app). Renders on a software GPU,
   so these run at 30 fps with 4 blur sub-frames.

## Craft bar (every reel)
- Film look on every reel from 22 Oct (owner: "we are missing motion design"): in the config, `"blur": 12, "shutter": 0.45` (real motion blur from 12 sub-frames per frame),
  `"grain": 6`, and `"vignette": true` on dark grounds only (on light grounds it greys the corners). The scene itself still owns camera language: depth layers, dolly and rack focus, light that reacts to motion.
- One art direction: at most five colours, one type family, a real grid. No glows, gradient title cards, floating particles, or everything fading in.
- Frame 0 is already a finished, cover-quality composition, and it is already moving; something completes inside 1.5 s.
- A hook line on screen from frame 0 (audit 23 Oct: Built in 20 s held 2.8 s of 20 with no words; every @techin20sec reel opens on a question
  or a claim): a question, a paradox or a bold claim in at most 8 words, readable in a second, that the reel then answers.
- The hook is the shot, not a caption on the demo (reel study, 23 Oct: every @techin20sec reel opens on one question, full frame,
  word by word, key word in an accent colour, a small "IN 20 SECONDS" tag; ours sat as small text over a busy page and lost the first second).
  Ours does it as motion design: each word arrives with a move from the reel itself, then the question opens into the content.
- Sound from frame 0 (reel study, 23 Oct: theirs = a voice reading the hook, a quiet bed and a whoosh or hit on every cut, -14 LUFS, no silence;
  ours opened on 1-2 s of silence or none at all). Every scene exports `window.CUES`; scripts/showreel/sound.py makes the effects, the bed
  (in time with the cuts, looping with the picture) and the hook voice (Kokoro, open licence) on GitHub; the mix is levelled to -14 LUFS.
  The owner can still lay an Instagram track under it.
- Real interface over illustration; images drawn in code; fictional brands only.
- Motion with intent: springs, masks, variable-font axes, match cuts. Every move has a reason.
- 15-20 s, payoff in the last 3 s, a seamless loop (the last frame leads into the first).
- Text only where it carries the idea; key text clear of Instagram's UI (top 96 px, bottom 22%, the right-hand column).
- Flow (owner, 23 Oct: "add more animation, flow, transition to elements"): every element enters with motion (staggers, counters,
  springs, a drifting camera), and every change of scene is motivated by an element on screen (a portal through a shape, a match cut,
  an element that carries over). Never a plain cut or a plain swipe.
- Variation (owner, 23 Oct: "where's the variation?"): something big changes at least every ~3 s: the scene, the colour world, the scale
  or the camera. One look held for 17 s is a still with motion, not a reel.
- Density (study of an AI-animated "system" reel the owner shared, 25 Oct; 3 screen recordings, ~39 s, measured frame by frame;
  techniques only, never its look, host character or copy):
  - Voice wall to wall: about 5 words a second (ours ~3.9) and one pause over 0.25 s in 39 s. Lines are short claims, not explanations.
    Correction (owner, 26 Oct, on Nº 04 at voice speed 1.15 in 17 s: "too rushed", words lost): density comes from cutting words, not
    from speaking faster. Keep the voice at speed 1.0-1.05, give a reel up to 20 s, and let the voice check (Showreel workflow) catch
    any word the recogniser cannot make out.
  - A visual event about every 0.5-1.3 s, on the stressed word, and a literal picture for almost every noun phrase ("fills up fast" =
    seats filling, "first come, first served" = a take-a-number ticket, "221 files" = a counter rolling up as files burst out).
    Its own stated rules, worth holding ourselves to: hook within 1.5 s, an event on every stressed word, nothing still for more than 1.2 s.
  - The caption word and its key visual land about 0.15 s before the word is spoken, so the eye is ready when the ear arrives.
  - A live readout in a corner (a mono counter that changes with each beat: seats left, followers, files, a timing offset): the frame changes
    even when the main picture holds.
  - Numbers as proof: counters that run up, then a hand-drawn ring around the final figure; stamps that slam in with a hit.
  - Fixed zones: caption block top-left (2-3 lines, accent word coloured), the picture in the middle, nothing over the bottom UI.
  - Not for us: the cartoon host, the light-paper look as a copy, income and follower claims, "comment X" giveaways (we end on the reel itself).

## Apply on the next reels (owner, 26 Oct, on the PHP2Shell cover and voice; not to re-do posted reels)
- Cover text looks shrunk: the hook title uses the condensed width ('wdth' 85) with tight tracking (-0.045em), which reads squeezed
  as a cover. For the cover frame use the normal width, looser tracking and a larger, simpler title, and pick a cover time where the
  title stands alone (check it as Instagram's cover crop, both the 9:16 cover and the 3:4 profile grid).
- Length (owner, 26 Oct): aim for 20 s, but a reel may run to about 21 s when the information needs it or the video needs room
  to breathe; never cut a relevant line or a beat's hold just to hit 20.
- Audio should sound more natural: the per-sentence voice with equal 0.8 s breaths reads as stilted. Try varied pauses (shorter
  inside a thought, longer between ideas), speed 0.95-1.0, other Kokoro voices (A/B two on the same script), and a light room tone
  under the voice; keep the voice check's pacing limits.

## @techin20sec reels (owner, 26 Oct)
- Keep that account's own look on its profile: make its reels with the tech-reel generator (techreel/: hook card with IN 20
  SECONDS, TOPIC · EXPLAINED header and progress bar, a tinted label chip per scene, glowing icon scenes, karaoke captions), not
  with the webin20sec scene system. The PHP2Shell and passkey reels (showreel-t01/t02) used the webin20sec look by mistake.
- Carry over only the approach: news from the last day or two (it is a news account), one concrete picture per spoken line, a
  takeaway worth saving or sending, and the voice check (words and pacing against Nº 01) with breaths between statements.
- **7-day test from 31 Oct to 6 Nov (owner, 30 Oct): "Tech, explained in 20 s" replaces daily news.** Why: a week flat at 9
  followers, median reach ~115 (Instagram's first test pool), 2.6-4 s watched of 20, 3 saves and 0 shares in 20 reels; news is
  stale by our 15:00-19:00 slot. The two best reels (encryption 7.2 s, Amazon cloud 7.0 s) opened on a puzzle and explained a mechanism.
  - Topic: how everyday tech actually works (why charging stops at 80%, how a passkey logs you in, why Wi-Fi is slower one room over).
    Evergreen, one mechanism per reel, every claim checked in a primary source (vendor docs, standards, specs). No repeats of
    topics @webin20sec covers.
  - Hook: a puzzle or paradox the viewer already half-knows, on screen from frame 0 ("Why does your phone stop at 80%?").
  - Picture: same techreel look; the middle scenes show the mechanism step by step; the last line is a takeaway worth saving.
  - Pass by 6 Nov (any one): median reach over 300, average watch over 6 s, or 20 followers. Fail: pause @techin20sec and put its
    usage into @webin20sec. The 6 Nov audit reports the verdict to the owner.

## Self-review before the owner sees anything (owner, 23 Oct: "where's the accountability?")
Claude reviews every draft as a critical creative director before sending it, and does not wait to be asked to improve it.
1. Watch the stills at every beat and the GIF, then answer in writing:
   - Does something big change at least every ~3 s (scene, colour, scale, camera)?
   - Is frame 0 cover-quality and already moving? Would a stranger stop in the first second?
   - Does it use the whole frame? Is key text clear of Instagram's UI?
   - What is the one moment someone would screenshot or send? Is it strong enough, and does it land in the last 3 s?
   - Is it premium (light, material, motion blur, type), or does it read as a demo?
   - Is it clearly different from the last three reels (series, palette, motion, layout)?
   - Does the loop close cleanly?
2. Fix every "no" that is small before sending. Name anything bigger as the next improvement and say whether it was done.
3. Every draft message to the owner includes "Self-review": what was checked, what was changed because of it, and what would still make it better.

## How a reel is made
1. Scene: `scripts/explainer/<slug>.html` exposes `window.seek(t)`; every frame is a pure function of t (seeded randomness only).
2. Config: `scripts/explainer/<slug>.json` (name `showreel-NN-<slug>`, dur, fps 60, cover time, caption, 6 keywords, 5 niche hashtags).
3. Review: stills at each beat and a GIF on a private page for the owner; fix what the stills show (two or three passes).
4. Render on GitHub: Actions, Showreel workflow, config = the json. The MP4 lands in the private R2 bucket (CLAUDE.md, Render), on the Showreels page, and a "Showreel ready" issue names it.
5. The owner posts at 14:00 IST and adds a trending Instagram audio track.

## Post text
The first caption line holds the search words in plain language. Then one line with the six keywords joined by ` · `, then exactly five niche hashtags.
No call to action and nothing at the end of the reel (owner, 21 Oct); the caption may invite a send.
The owner gets it as one block to copy whole, with no labels (owner, 22 Oct): on the Showreels page with the video (Copy post text); the public "Showreel ready" issue carries no post text (3 Nov 2026). Not repeated in chat unless the owner asks (owner, 24 Oct).
Keywords and hashtags are chosen for reach: what people type into Instagram search for this kind of reel, the most specific first; no broad tags.

## Measure and decide
- The daily audit records per reel: reach, average watch, saves, shares, and the series it belongs to, next to @techin20sec's numbers.
- After three reels per series, drop or rework the weakest series.
- If reach stays under @techin20sec for a week, test one lever at a time: posting time, the first second (type-first versus picture-first), length (15 s versus 20 s).

## Log
| date | reel | series | notes |
|---|---|---|---|
| 5 Nov | showreel-28-thumb (Nº 18, posts 6 Nov 19:00, E13 two-a-day) | narrated touch tip | "Why does your thumb hit the wrong link?": a notes app's long-press menu with 16 px links; from frame 0 a thumb aims for Archive and the red toast says "Note deleted"; dashed red hit boxes, one tap covering two; display: block + min-height: 44px typed by ~8.5 s, the rows grow (the text keeps its size), every tap lands; MDN Understanding WCAG (2.5.5 AAA 44 x 44 CSS px, 2.5.8 AA 24 x 24) + MDN min-height; rulebook score 8/8 (rule 3 failed on the first stills, fix at ~10.3 s: script cut); 20 s |
| 5 Nov | showreel-27-keyboard (Nº 17, posts 5 Nov 19:00, E13 two-a-day) | narrated form tip | "Why does your form show the wrong keyboard?": a sign-in code field; wrong letters land in it from frame 0, the letter keyboard ringed red, a hunt for the 123 key, inputmode="numeric" typed by ~8 s, one tap and the number pad comes up, the code types in and verifies; MDN inputmode + BCD (Chrome 66, Firefox 95, Safari 12.1 / iOS 12.2); rulebook score 8/8 (rule 3 failed on the first stills, fix at ~10.5 s: script cut to bring it to ~8 s); 20 s |
| 3 Nov | showreel-25-anchor (Nº 15, posts 6 Nov) | narrated layout tip | "Why is your heading hiding under the header?": a help page with a fixed header; a finger taps "3. Billing" from frame 0 and the heading lands under the header (its hidden part drawn over the header in red); html { scroll-padding-top: 80px } typed, the same tap lands below the header (padding strip hatched green), a second link ("every jump") lands right too; MDN scroll-padding-top + BCD (Chrome 69, Firefox 68, Safari 14.1); replaced the planned iOS 16px form-zoom tip, which has no MDN/BCD/WebKit primary source; 20 s |
| 3 Nov | showreel-24-sticky (Nº 14, posts 5 Nov) | narrated layout tip | "Why did your sticky header stop sticking?": a shop page scrolls from frame 0 and its sticky header leaves with it; the .wrap drawn as a red dashed "scroll box" (overflow: hidden), the code types hidden -> clip, the header drops back and stays as the page scrolls on; MDN position (sticks to the nearest ancestor with a scrolling mechanism) + MDN overflow (clip is not a scroll container) + BCD (clip: Chrome 90, Firefox 81, Safari 16); 20 s |
| 3 Nov | showreel-23-sideways (Nº 13, posts 4 Nov) | narrated text tip | "Why does your page slide sideways on phones?": an order page with one long tracking link; it sticks out of the screen (its overflow drawn outside the phone in red) and a finger drags the whole page sideways; overflow-wrap: anywhere typed, the page snaps back and the link wraps inside the card, a second drag does nothing; MDN overflow-wrap + BCD (anywhere: Chrome 80, Firefox 65, Safari 15.4); 20 s |
| 2 Nov | showreel-22-squash (Nº 12, posts 3 Nov) | narrated image tip | "Why do your photos look squashed?": a real <img> in a box that changes shape (square, wide banner, tall card); object-fit: fill (the default) stretches the round-faced cat, object-fit: cover typed, the cat keeps its shape and the cropped edges show as a dashed ghost; MDN object-fit + BCD (Chrome 32, Edge 79, Firefox 36, Safari 10); 20 s |
| 1 Nov | showreel-21-dvh (Nº 11, posts 2 Nov) | narrated layout tip | "Why is your button cut off on phones?": a portrait phone (new layout after two landscape screens), a 100vh hero whose button sits under the browser bar (red dashed zone, 116 px hidden), 100dvh typed, the hero fits and follows the bar; MDN length (vh = lvh; dvh resizes on scroll, svh stable) + BCD; 20 s |
| 1 Nov | showreel-20-hover (Nº 10) | narrated touch tip | "Why does your button stay lit after tapping?": a shop card's button lights on a tap and stays lit (red ring, a stuck-for counter) until a tap elsewhere, @media (hover: hover) typed, a mouse still hovers, taps stay clean; MDN :hover touchscreen note + BCD (Samsung quirk in the caption); 20 s |
| 22 Oct | showreel-05-layout-shift | (explainer, owner brief) | 30 s; too slow in the middle; first second barely moved |
| 22 Oct | showreel-07-built-in-20s | Built in 20 s | first of the series; Halden, Swiss modernist |
| 22 Oct | showreel-08-six-transitions | Six ways | Tinta paint studio; each page's circle is the next colour; zoom-through payoff loops to frame 0 |
| 22 Oct | showreel-08-six-transitions v2 | Six ways | 17 s, transition every ~2.5 s, liquid wipe replaces push, motion between transitions, promise on screen from frame 0 |
| 22 Oct | showreel-07-built-film | Built in 20 s | the film-look re-cut replaces the original (motion blur on the word drops, scroll and card open) |
| 23 Oct | showreel-09-liquid-glass v2 | Material | four worlds on the beat (music night, wallet, weather noon, map macro), light and frost per world, payoff = macro lens + drop split |
| 23 Oct | showreel-09-liquid-glass v3 | Material | the glass is the transition (next app inside the glass, then floods out); every element animates in |
| 23 Oct | reel study | (both accounts) | scripts/study-reels.mjs: theirs = voice + bed + a hit per cut at -14 LUFS, a full-frame word-by-word question; ours = silence or a loose beat, the hook as small text |
| 23 Oct | showreel-08-six-transitions v3 | Six ways | full-frame question on Ink, each word arriving by one of the six transitions, doors open onto the first page; first reel with sound (effects on every cut, bed, hook voice); 17.85 s = seven bars, so sound loops with picture |
| 23 Oct | showreel-09-liquid-glass v4 | Material | hook = "Is this glass real?" drawn into the app, the glass rises through it and bends the words, the music floods out of the glass; sound from cues; the last app dims to the hook's ground for the loop |
| 25 Oct | showreel-14-stagger (Nº 04) | narrated motion tip | "Why does your list feel so flat?": five rows land as one block (red bars), the stagger rule typed, the same rows 40 ms apart shown 3× slower then at real speed (amber staircase), a card grid staggered on the diagonal with its --i; view transitions were the first idea but showreel-10 covered them; posts 14:00 IST 26 Oct (daytime test against Nº 03 at 19:00) |
| 25 Oct | showreel-13-popup (Nº 03) | narrated motion tip | "Why does your popup just snap in?": the popup snaps in on one frame, @starting-style typed, the same popup glides in frame by frame, menus/sheets/toasts glide in; back to motion tips (owner, 25 Oct); posted 19:00 IST to test the evening window (Nº 04 at 14:00 the next day) |
| 24 Oct | showreel-12-inp (Nº 02) | narrated explainer | "Your site loads fast. So why does it feel slow?": a frozen Add to cart, the 600 ms counter (example), INP as a timeline, Google's 200/500 ms gauge, one long task split so paint can happen; built on Nº 01's system |
| 24 Oct | showreel-11-springs (Nº 01) | narrated explainer | "Why do some buttons feel expensive?": ease vs spring on a checkout card, the curve drawn live, linear() with MDN-checked support; storyboard → rough cut → full build; 08 and 09 dropped |
| 23 Oct | showreel-10-zero-js-transition | Steal this | paradox hook in frame 0 (audit lesson), real CSS view transitions both ways, code typed under a live preview, MDN support badges |

## Automation roadmap (owner, 27 Oct 2026: "gradually automate this whole activity")
Rule: each piece of work moves one step down this list; nothing is built ahead of need. Done items stay listed so the next session knows the state.
1. Done: post text, posting date and "uploaded" mark in the app, one tab per channel; nightly collect of both accounts; daily audit as a scheduled task.
   Done 27 Oct: GitHub minutes meter in the app (before the repo goes private), posted reels fold after 7 days, MP4s removed 30 days after upload.
   Done 1 Nov: posted reels move to a compact Posted list at once (with their numbers); MP4 + review PNG removed 15 days after upload.
2. Done (techreel): preview estimates the one-take voice length and flags overflowing text. Next, with the next webin20sec reel: the same check in
   scripts/showreel, plus a blank-frame check in the preview, so a render is dispatched only when the preview is clean.
3. Next: one daily routine per channel that writes the script, renders stills and a GIF to a private review page and stops; the owner approves,
   the routine renders once. Replaces the old daily reel routine (to-do).
4. Then: a topic shortlist for @techin20sec from primary sources (vendor newsrooms, security advisories, release notes), made on GitHub
   each morning: 3 candidates with sources and a viewer-stake hook each; mixed topics, not only security.
5. Then: the audit writes its signals as data (best posting window, winning hook shape, reel-to-follower pairing per day) and the routines read it,
   so the plan updates itself from results instead of by hand.
6. Later, owner's call: posting through Instagram's content publishing API (needs the permission and Meta's review); until then the owner posts.

