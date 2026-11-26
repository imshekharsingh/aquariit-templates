# showreel-tech-gold3d-v6 · builder notes for the critic (sample, never posted)

Built 26 Nov 2026 on the other account from the v5 gold, to the owner's notes on v5 (too much glow, wiring not realistic, little movement) and rules-tech.md D9-D12.
Scene techkit/scenes/gold3d-v6.html, topic techreel/topics/gold3d-v6.json; stills review/tech/study-25nov/kit-phase2-v6.jpg (scene frames on a placeholder voice).
Video: R2 study/showreel-tech-gold3d-v6-r2-preview.mp4 (render 2; render 1, r1, failed PACE and COLOUR and is not the one to judge) (this account cannot fetch it; the main account runs the critic).

What changed from v5, beat by beat (placeholder-voice times; the real voice is a little faster):
- 0-1.0 s hook (the finished tangle, 3x8=24, the question); 1.0-1.5 s a quick rewind (everything leaves backwards).
- Each app its own beat and entrance: Notes slides and turns in (low three-quarter), Chat rises and flips up, Mail swings in; then the 8 tools cascade in, each with a different entrance.
- The first cable is its own beat: a low close-up on Pay's side edge as it unrolls, the plug slides in, one pulse; the other 23 cascade (high three-quarter on the floor); the wide with 3x8=24.
- The hub drops in (three-quarter), the 24 cables retract, 11 green cables unroll one after another, the pull-back to the clean picture with 3+8=11.
- The New tile (its own spark icon) flips in with its one cable; the number becomes 3+9=12 (the v5 critic's note); the payoff wide; a small turn home to the first frame, with one last pulse on the New cable.
- Cables are matte, lie on the floor and sag, with plugs at both ends and floor shadows; they glow only for the connect pulse. Bloom .12 (v5 .28); the numbers are glossy, not glowing.

Builder's own checks (not a verdict): Output QA GLOW on the scene frames 1.7 % median (v5: 4.0 %, fail over 3.5 %); techkit/check-gold3d.cjs: no name cut or covered on the wide shots. Known for the critic to judge: in the close-ups (the three app beats, the plug, the hub's entrance, the New tile) neighbouring tiles are cropped by the frame or blurred under the caption fade, and the hub sits in front of Pay for about 0.5 s while it lands.

Render 2 changes (26 Nov): every beat follows the voice cues (render 1's fixed times swapped two shots with the real voice); line 2 is "Three apps, and eight tools."; gentler camera moves; pauses of 0.9 s between lines (about 23 s); smaller tool entrances.

## Independent critic (main account, 26 Nov 2026 16:10 IST) on render 2
Judged the real MP4 (R2 study/showreel-tech-gold3d-v6-r2-preview.mp4, 22.9 s, 1080x1920, -19.1 dB mean) side by side with v5 (study/showreel-tech-gold3d-sample-v5-preview.mp4, 18.5 s): one contact sheet each at phone size (a frame every 0.75 s), three full frames of v6 (2.0, 2.25, 12.0 s), a frame-difference and brightness strip for both.

v6 against v5: movement is clearly better (mean frame change about 2x v5's; v5 holds one wide for 0-6 s, v6 changes shot every 0.75-2 s up to 18 s). Glow is clearly lower (v5's haloed cables and numbers are gone; numbers are glossy). Kept from v5: frame-0 hook with 3x8=24 and the question, colours and materials, the New tile with its own icon, names whole on the wides (9.75-10.5 s, 13.5-22.9 s). Lost: v5 had no empty or washed-out frame; v6 has one (below).

Owner's v6 direction:
1. Beats of 1.5-3 s, each with something entering or changing: PARTLY. Done 0-18 s. NOT at 18.3-22.9 s: the 3+9=12 wide holds about 4.5 s with only one small pulse (frame change 2-10, near still).
2. Own entrance per object: DONE (Notes slides and turns 2.0-2.6 s, Chat rises 3.0 s, Mail swings in 3.75-4.5 s, tools cascade 5.25-6.75 s, hub drops 11.3-12.5 s, New tile flips 15.0-16.5 s). Flaw: the hub fades in half see-through with a doubled "HUB" label at 11.5-12.0 s.
3. First cable its own beat, then a cascade: DONE (Pay close-up, plug in, 6.75-7.75 s; cascade 8.0-9.3 s; wide 3x8=24 at 9.75 s; hub, collapse, pull-back to 3+8=11 at 13.5 s).
4. Own detail and angle per element: DONE (low close-ups on Notes, Chat, Mail, Pay's plug; three-quarter on the hub; high wide on the tangle).
5. Hook first: DONE (0-0.9 s finished tangle with 3x8=24, rewind 0.75-1.4 s).
6. Readability, one move at a time, settle on names, nothing held over ~2 s: PARTLY. Settles are there; but 1.4-2.1 s is an empty frame (pale washed floor only, brightness 109 vs 62 elsewhere) and the end holds 4.5 s.
7. Realism, matte sagging cables with plugs, glow only on the pulse: PARTLY. Plug at Pay 7.5 s and the clean green cables 13.5 s on read as real cables. The 23 cascade cables at 8.0-9.3 s fan out from Notes as straight stiff rays (like straws), not sagging cables on the floor; the tangle on the wide (9.75-10.5 s) still stands up as rigid arches.
8. Keep everything v5 had: PARTLY (the empty pale frame at 1.4-2.1 s and the pale floor at 7.8-9.0 s are new defects; everything else kept).

Q48 own entrance per object: yes (hub ghost noted). Q49 each connection its own beat: yes for the first cable and the cascade; stretch with nothing new: 18.3-22.9 s. Q50 would the wires pass as real: the clean wiring yes; the cascade rays at 8.0-9.3 s no. Q51 over-glowing: no bloom haze round cables, tiles or numbers; worst frame 2.0 s, a pale washed floor filling 70 % of the frame (lit floor, not bloom, but it reads as haze). Q52 references: the builder notes name no reference patterns from design/references.md, so none can be found on screen; the next build names two.
Q47 text: captions clear of the objects in every frame with text; the New tile beat (15.75-16.5 s) crops Mail and the hub at the frame edge as foreground framing, acceptable for a close-up.

PREMIUM: animation 7.5/10 (t 2-16, own entrances and a told story), cleanliness 6/10 (t 1.4-2.1 empty pale frame; t 11.5-12.0 doubled HUB), premium 6.5/10 (t 8.0-9.3 straw-like cascade cables; t 18.3-22.9 still end); weakest: 1.4-2.1 s an empty washed-out frame right after the hook, start Notes in frame by 1.4 s and darken the floor.
ENHANCE: land the 3+9=12 with a small tick as the New cable pulses, so the payoff number itself moves.

CRITIC: NOT READY: v6 moves far better and glows far less than v5, but at 1.4-2.1 s the screen is an empty pale floor, at 11.5-12 s the hub shows a doubled see-through label, the 8-9 s cables stick out like straight straws, and the last 4.5 s hardly move. Detail: direction points 1, 6, 7, 8; questions 49-52; animation 7.5, cleanliness 6, premium 6.5.
EXACT FIX:
1. 1.4-2.1 s: no empty frame. Cut from the rewind straight to the Notes beat (Notes in frame by 1.4 s), and darken the near floor at low angles (no area brighter than the tiles; brightness near the 62 of the rest of the reel) at 1.4-2.1 s and 7.8-9.0 s.
2. 11.3-12.3 s: the hub is fully opaque from its first frame; one "HUB" label, no doubled or see-through copy.
3. 8.0-9.3 s: the 23 cascade cables leave each app as drooping curves that touch the floor between the tiles (same W3D.wire sag as the first cable), not straight rays; lower the arches on the 9.75-10.5 s wide so the bundles rest on the floor.
4. 18.3-22.9 s: something changes every 2 s or less: 3+9=12 lands with a small tick at about 18.5 s, the New cable pulse at about 20.3 s, then the turn home to the frame-0 framing from 21.0 s, finishing by 22.8 s (or trim the hold to 2 s after the last word).
5. Review file: name the two reference patterns this sample uses (design/references.md) with the time each shows.
