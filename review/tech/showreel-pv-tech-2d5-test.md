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
