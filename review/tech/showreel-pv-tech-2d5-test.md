# Review: showreel-pv-tech-2d5-test (@techin20sec, preview for comparison, never posted)
Owner-approved test (owner chat, 27 Nov 2026; cap about $10, one render). Spec: design/references.md "R-ref 27 Nov 2026" (branch claude/ref-nodemap-27nov). Scene: scripts/previews/tech-2d5-test.html (+ .json). Direction card: showreel-pv-tech-2d5-test.direction.md. Not in captions.json (never posted).

## Facts and sources (read 27 Nov 2026 through search; the sites themselves were not reachable from the build session)
1. TOKEN: EMVCo, "EMV Payment Tokenisation" (emvco.com/emv-technologies/payment-tokenisation/ and /knowledge-hub/emv-payment-tokenisation/): tokenisation replaces the card number (PAN) with a unique alternative value, the token; the token is restricted to specific merchants, devices or payment scenarios; the consumer device sends it to the terminal by a proximity technology such as EMV Contactless. On screen: "TOKEN", "LIMITED TO THIS DEVICE". Voice: "your phone sends a token, never your real card number".
2. TERMINAL -> ACQUIRER -> NETWORK -> ISSUER, reply back the same way: Mastercard, "How Credit Card Transactions Work" (mastercard.com/us/en/for-the-world/prosperity/.../how-credit-card-transactions-work.html): the acquirer is the merchant's bank and passes the request on; the network routes between acquirer and issuer, neither of which it is; the response returns along the same path. Also a Federal Reserve paper (FEDS 2009-23, federalreserve.gov/pubs/feds/2009/200923): merchant -> acquirer -> network -> issuer, reply returned the same way, issuer posts to the account within about a day for credit and signature debit (voice: "money settles later").
3. BANK DECISION: Visa developer guide, "A Detailed Look at the Payments Ecosystem from Visa Payment..." (community.developer.visa.com): the issuer checks examples such as available funds and spending limits and approves or declines. On screen: FUNDS COVER IT, WITHIN YOUR LIMIT, CARD IS ACTIVE (card active is a generic check; not claimed as Visa's list), RISK CHECK · LOW (illustrative).
4. "USUALLY A FEW SECONDS": the same Visa developer page says usually under three seconds.
5. Millisecond counters (38 ms, 52 ms) are labelled EXAMPLE TIME: an illustration, not a measurement. The shop name "Corner Cafe", the app "Orbit Pay", "BANK A/B/D" and the amount 18.40 are invented.
No logos, no real card brands on screen. Gap: the 4 cm style distance claim was not found in a primary source, so it is not used.

## Rulebook (design/rules-tech.md): scored
- F3 brands: none named. PASS. Safety (design/safety.md): all invented, nothing sensitive. PASS.
- D1 world: not applicable in the 2.5D grammar (owner: not the 3D kit); the map is the world. D2 parts built one by one: PASS in the stills (every interface builds element by element). D3 depth: far dot grid + near motes + glow + cards at three speeds. D4 secondary motion: pulses, ripples, needle, blinking cursor. D5: push, six flights, pull-back. M3 never fully still. M6 words: captions word by word.
- P1 surprising frame 0 / P3 loop: hub alive in frame 0, last frame = whole map (not the same framing; stated).

## Stills check
Outside check (session_01AYvWRhHJYnX6N3TktzS9wj, 2026-11-27), builder's sheet + one extra sheet at 0.6, 1.4, 7.6, 11.8, 16.0, 19.6, 24.3, 25.75, 28.4 s. Verdict: REDO (fixes below), no render yet.

Direction card: met 2 (pacing), 3 (one camera, 0 cuts, continuity 76 %), 6 (pulse leads each flight, seen at 3.5 s), 9 (pull-back to the whole lit map at 29.8 s reads well). Not met: 1, 4 (partly), 5 (partly), 8. 7 (sound) cannot be judged from stills.
Motion-design pass: per-step builds are real (token scramble 6.5 -> 7.6 s, request rows 10.5 -> 11.8 s, ms counter 0 -> 23 ms, network path locks on YOUR BANK, gauge). Not seen: the set building itself (0.6 and 1.4 s show the hub card alone; the other five cards and lines are off frame).

Faults
- 16.0 s: the pill reads "02 / 06 · TERMINAL" while the camera sits on 03 ACQUIRER (violet). 24.3 s: the pill already reads "06 / 06 · APPROVED" while the bank card is still in view and the voice says "Six:". The pill must change exactly when the flight arrives, never show an older step.
- Interface labels are about 5-6 px on the 540 sheet (10-12 px at 1080): THE SHOP'S BANK, EXAMPLE TIME, RECEIVES THE REQUEST, FUNDS COVER IT, the pill text. Unreadable on a phone; EXAMPLE TIME is a safety label and must be readable.
- Token mismatch: the token card shows 9F3A 71C2 D0C8 160C, the payment request shows "9F3A..D0BE". Make it 9F3A..160C.
- 25.75 s: the APPROVED stamp is not on screen yet (card says it slams at 25.6 s, the thud at 25.65 s). Check stamp and thud land on the same frame.

PREMIUM (against R-ref 27 Nov 2026): about 6.5. Colour worlds, spotlight, fixed title, pill, accent key words and working mini-interfaces all match the grammar. It loses on scale and context: the active card fills only the middle band (about y 25-72 %), the bottom 20 % of the frame is empty black under the caption, and the map around the card is almost never seen, so it reads as a slideshow of boxes rather than one system.

UPGRADES
- HIGH 0-2.2 s: open WIDE on the whole map assembling (five cards fly in from the ring, lines draw hub -> 6, the hub phone already rippling), then push into the hub by 2.2 s. Today the hook is a phone in a box.
- HIGH 3.3-27.4 s: hold framing about 15 % wider so 1-2 dimmed neighbours (20 %) and their lines stay in frame as context; scale the active card and its interface up so labels are at least 22 px at 1080; use the empty bottom band (caption down to about 80 % height).
- HIGH all flights: pill roll synced to arrival (see faults).
- MED 25.6-27.4 s: after the stamp slam, ease the camera back enough to SEE the mint reply pulse run along the lines toward the hub (the rewatch moment is invisible at today's zoom).
- MED 25.6 s: stamp slam + ring burst + thud on one frame; add a short white flash on the card edge.
- LOW 28.4 s: mid pull-back the "LIMITED TO THIS DEVICE" chip floats detached from its card; keep chips parented to their cards.

Focus: yes (one card lit, colour world per step). Structure: yes (title, pill, numbered cards), but the pill desync breaks it. Reason for every move: yes (pulse leads each flight), weaker in the hook and the reply.
Facts: match the sources listed above; counters labelled EXAMPLE TIME; shop, app and bank names invented; no real brand or logo seen.


## Render and Output QA (27 Nov 2026, builder)
- The one render: Showreel run 45891261534 (preview, 30 s, with voice), file study/showreel-pv-tech-2d5-test-preview.mp4 in R2 (app path /reels/study/showreel-pv-tech-2d5-test-preview.mp4). It is built from the scene on main as merged (opening start 0.76, calmer light, pill rolling mid-flight).
- Output QA run by the builder on the final MP4 (the preview workflow skips it): OUTPUT QA: PASS. LOUD -14.8 LUFS, true peak -3.7; COLOUR, EDGES, SPREAD (5 % empty), DEMO, VIBRANCY, VARIETY (33 %), LOOK, DEAD, CALM (3.2 % median, 4.4 % average) pass. SKIP (no recogniser on this machine): PACE, NUMBERS, SOUND source; WARN: FOCUS and MUTE need config blocks (web checks, not used by this preview).
- preflight-all on the preview (local): Output QA 12 pass 0 fail, TEXT CLEAR ok; its review lint stays FAIL on items 1-12 and PREMIUM lines because this is a preview study, not a posting reel (previews skip the Mandatory Gate).
- Stills check: REDO from the outside session (see the direction card, builder reply there). Not met by the builder: hold framing 15 % wider, mono labels 22 px at 1080 (they are about 21), the mint reply pulse visible during 25.6-27.4 s, chips attached in the pull-back.
- PREMIUM (builder, from the stills; the critic scores the render): animation 7, cleanliness 7.5, premium feel 6.5.

## Stills check 2
Outside check round 2 (session_01AYvWRkU1KKuoVYQHbSPYqG, 2026-11-27): builder's sheet + one extra sheet at 0.3, 3.8, 5.0, 7.4, 8.4, 9.3, 12.6, 13.5, 17.5, 24.0, 26.5, 28.4 s. Tool lines: empty frames none, static none, text fit ok, safe zone ok, overlap none, cuts 0, page errors none. Verdict: REDO (fixes in the direction card).

Owner notes
1. Closer to the reference in structure, scale, rhythm: PARTLY. One camera, colour worlds, fixed title, pill, tracker, flights led by a pulse (3.8, 8.4, 12.6 s) all match. The map as one system is seen only at 29.8 s; the hook (0-2.6 s) is a single card, never the map.
2. Small nodes, icon + 1-2 word label: MET for nodes (8.4, 12.6, 24.0, 28.4 s: TOKEN, TERMINAL, YOUR BANK, APPROVED). NOT MET for the panels: their text is 10-12 px at 1080 (14.5, 18.5 s).
3. Expand-then-shrink for 1, 5, 6 and a side panel for 2, 3, 4: MET (token grows 4.6-5.5 s and is small again at 8.4; bank 22.5 -> 24.0; approved 25.8 -> 28.4; panels at 9.3, 14.5, 18.5 s).
4. Space between nodes, lines carry the life: MET (8.4 and 12.6 s: long lines with a moving packet, neighbours dimmed in place).
5. Background takes each step's colour, cross-fading: MET (teal, lime, violet, coral, gold, mint; mid-flight frames 3.8 and 12.6 s blend through a neutral). No black bands top or bottom, but the lowest ~25 % under the caption stays an empty dim band at every hold.
6. Explanation not lost: MET by voice and captions; the panels add nothing readable.

Critic fixes: content before landing MET mostly (4.6 s faint, 5.0 s token half empty: LOW). Wider framing with dimmed neighbours PARTLY (14.5 and 18.5 s yes; 5.5-7.4 s and 25.8-27.0 s the expanded card fills the width, no neighbours). Stamp inside its card MET (25.8, 26.5 s). Eased pull-back with reply pulse PARTLY (28.4 s one pulse on one line; whole map only ~0.5 s). Captions split MET (10.5, 12.6 s). Token 9F3A..5B64 MET in the source (card 9F3A 71C2 D08E 5B64, request 9F3A..5B64), but the card still scrambles at 7.4 s when the camera leaves at 7.5 s.

PREMIUM (against R-ref 27 Nov 2026): about 7.0. Up from 6.5: the map now breathes (space, lines with packets, tints). Still below 7.5 because the hook is a box, the bottom quarter is unused and every panel's text is too small to read.

UPGRADES
- HIGH 0-2.6 s: open on the whole small map, lines drawing hub -> 6 with pulses, then push into the hub.
- HIGH 9.5-21 s panels: one short line each at 24 px+ (e.g. "SHOP'S BANK", "ROUTES TO YOUR BANK", "EXAMPLE 38 ms"), not 4-6 tiny rows.
- MED all holds: use the bottom quarter (caption and tracker lower, map centred higher) so the subject fills more of the frame.
- MED 26.8-30 s: earlier, eased pull-back, hold the whole lit map 1.5 s with mint pulses running on every line back to the hub.
- LOW 7.5 s: as the token card shrinks, let the resolved token ride the line as the packet to the terminal (the cause of the flight is the token itself).

Focus: yes (one lit node, tinted world, neighbours dimmed). Structure: yes (title, pill in sync at 14.5, 24.0, 25.8 s, step tracker). Reason for every move: yes (a packet leads each flight).
Facts: match the sources above (token limited to the device, terminal -> shop's bank -> network -> your bank and back, checks, "usually a few seconds"); counters say EXAMPLE TIME but too small to read (HIGH fix); shop, app, bank names invented; no brand or logo seen.

## Render 2 (27 Nov 2026): Output QA
Preview R2 path: study/showreel-pv-tech-2d5-test-preview.mp4 (overwrote render 1). Run 45927723694, Capture about 52 min.
OUTPUT QA: FAIL (1): COLOUR, a hard background colour cut at 3.7 s (hue 96 to 160 deg); saturated fill and cover fine.
PASS: LOUD -14.0 LUFS / -2.8 dBTP, EDGES, BULK, VIBRANCY 9.2 %, SPREAD 4 % empty, DEMO, HUE 175 deg, VARIETY 10 %, DEAD, CALM 3.0 % median.
WARN: LOOK (washed-out 0.5-4.0 s, dark background 1 % vs gold 68 %), BLACKBG (median 34, limit 32), FOCUS and MUTE (no qa blocks in the config).
SKIP on this runner: PACE, NUMBERS (no recogniser), SOUND, SYNC.
Open builder notes: panel and detail text not 24 px at 1080 everywhere; the band under the caption is the Instagram overlay zone.
PREMIUM: pending the independent critic (session started 27 Nov 03:27 UTC, branch claude/tech-2d5-test-critic2). A fix for the 3.7 s cut is a 3rd render and needs the owner's yes with a cost estimate (total spend is at the roughly $20 cap).

## Critic, render 2
Independent critic (session tag critic, 2026-11-27). Judged the real render 2 MP4 (/reels/study/showreel-pv-tech-2d5-test-preview.mp4, 30.0 s, 1080x1920 60 fps): one contact sheet of 18 frames (0.0-29.9 s), two full-size checks (0.3 s, 14.5 s at 1080), a background colour trace at 30 fps over 3.2-4.4 s, frame change per 0.1 s, loudness. Compared with the 3D v7 render 2 (six frames, same measures).
Measured: loudness -14.1 LUFS, true peak -2.8 dBTP; frame change mean 2.2 (v7 10.7), still frames 17 % (v7 0 %); median brightness 43, lowest quarter 36.

The 3.7 s COLOUR FAIL is a false alarm, not a defect: the background moves smoothly from warm (RGB 56/50/40) to teal (12/38/39) over 3.3-4.4 s, no step bigger than 2.3 per frame. The hue only seems to jump 96 -> 160 deg because at 3.7 s the colour is almost grey (saturation 0.12), where hue swings with tiny changes. Waive it in the reel's qa block with that reason ("qa": colour waiver 3.5-3.9 s, near-grey cross-fade); no render needed for it.

Owner notes
1. Closer to the reference in structure, scale, rhythm: PARTLY. Structure matches (fixed title, section pill in sync at every hold, step tracker, one camera, a packet leads each flight, pull-back to the whole map 28.6-29.9 s). Rhythm loses at the start: frame 0 shows only the title over an empty glow, 0.3-1.0 s a small hub card with an EMPTY caption box (looks broken), and the first step lands at about 4.5 s. The reference shows the whole system from the start.
2. Small nodes with icon + 1-2 word label: MET for nodes (TOKEN, TERMINAL, ACQUIRER, NETWORK, YOUR BANK, APPROVED, about 32 px at 1080). PARTLY for the panels: the pill and panel headings read (14.5 s: "TO THE CARD NETWORK" about 24 px), but the sub-lines (THE SHOP'S BANK, EXAMPLE TIME, BANK A/B/D, ROUTES BETWEEN BANKS, FUNDS COVER IT, RISK CHECK · LOW) are about 16-20 px at 1080, and the node labels in the final pull-back about 10 px.
3. Expand-then-shrink and side panels: MET (token 5.5-7.0 s, bank 22.0 s, approved 25.9 s grow and shrink back; panels slide out at 10.0, 11.5, 14.5, 18.5 s).
4. Space, lines carry the life: MET (8.4, 24.0 s: long lines, a packet riding them, neighbours dimmed in place).
5. Background per step, cross-fading, no black bands: MET (cream, teal, lime, violet, coral, gold, mint; every change is a fade, see above). No black bands; the lowest ~20 % under the caption stays a quiet tinted band.
6. Explanation not lost: MET by voice and captions, with one fault: the captions read "One your phone sends", "Two the terminal", "Three the shop's bank the acquirer" with no pause mark, so the step number runs into the sentence.

First critic's fixes: content before the camera lands MET (5.5 s token card full). Wider framing with dimmed neighbours MET at the panels (10-18.5 s), PARTLY at the expanded cards (5.5-7.0, 22.0, 25.9 s fill the width). Stamp inside its card MET (25.9 s). Eased camera with the reply pulse PARTLY (28.6-29.9 s every line lit, the whole map held about 1.4 s; the pulses are thin at that size). Captions split MET. Token 9F3A 71C2 D08E 5B64 on the card (7.0 s) and ..5B64 in the request (11.5 s) MET.

PREMIUM: animation 7.5, cleanliness 7.0, premium feel 7.0. STOP 6.0 (frame 0 is an empty title card), REWATCH 7.0.
Focus: yes. Structure: yes. Reason for every move: yes, except 0-3 s where the camera waits on the hub while the voice says "Here ... is what happens next".

CRITIC: NOT READY

UPGRADES (in order; sizes S < 15 min, M 30-60 min of scene work; all fit one render 3, which needs the owner's yes and its cost estimate)
1. HIGH, 0.0-2.6 s, S-M: frame 0 shows the whole small map already there (six nodes, lines, a packet running, hub lit) under the title, then the push into the hub. Hide the caption box until its first word (it is an empty dark pill at 0.0-1.0 s).
2. HIGH, 0.0-30 s captions, S: put a pause mark after each step number: "One: your phone sends a token ...", "Three: the shop's bank, the acquirer", "Six: approved." (and "Here is what happens next" as one caption from its first word, no lone "Here" at 1.8 s).
3. HIGH, 9.5-23.5 s, S-M: every word left in a panel or card sub-line at 24 px+ at 1080, or dropped (THE SHOP'S BANK, EXAMPLE TIME, BANK A/B/D, ROUTES BETWEEN BANKS, FUNDS COVER IT, RISK CHECK · LOW, THE ANSWER COMES BACK). EXAMPLE TIME is a safety label: keep it, at 24 px+.
4. MED, 1.8-4.5 s, M: shorten the hub hold so the first flight leaves by about 2.8 s and TOKEN lands by about 3.8 s (the hook is slow today).
5. MED, 28.6-30.0 s, S: on the final hold scale the map about 1.25x (fill the width) so the node labels and the mint reply pulses read; keep 1.4 s+ on it.
6. LOW, all holds, M: lift the caption to about 78 % height and centre the subject lower so the lowest band is used (keep clear of the Instagram overlay).

3D v7 render 2 versus this 2.5D render 2: the 2.5D is clearly closer to the reference (one camera over one map, fixed title, section pill, colour world per step, one lit subject, a reason for each move); v7 has none of the structure (no title or pill, a grey world, frame 0 also near-empty) and moves about 5x more per frame where the reference moves less. v7 wins on tactile, thumbnail-strong objects (big Pay tile, the 24 tangle, the New tile). For the channel, the 2.5D is the better format for "how a system works" topics: it teaches a 6-step chain clearly and reads as designed. With fixes 1-3 it should reach 7.5; I would keep the 3D kit for single-object topics and use the 2.5D map for process topics.

## Close-out (27 Nov 2026, owner chat: no render 3 for now; question tech-2d5-r3 is in the owner's Needs you list)
COLOUR WAIVER: the 3.7 s COLOUR FAIL is waived. Critic's reason: the background moves smoothly from warm (RGB 56/50/40) to teal (12/38/39) over 3.3-4.4 s with no step over 2.3 per frame; the hue only seems to jump 96 -> 160 deg because the colour is almost grey (saturation 0.12) at 3.7 s. The reel's qa block would carry a colour waiver 3.5-3.9 s ("near-grey cross-fade") if a render 3 is ever approved.
Final state: render 2, Output QA 1 FAIL (waived above), CRITIC: NOT READY, PREMIUM 7.5 / 7.0 / 7.0. Preview only, never posted. Rules for the first real 2.5D tech reel are in design/references.md "R-ref 27 Nov 2026: rules".
