# Research: the jump (23 Nov 2026, owner's ask ~01:30 IST: "use it for researching well - take the jump we need")

Research only: no reel, render or app change came from this session. Read by web search on 23 Nov 2026 (IST). Most "growth" sources are
vendor blogs; where a number is not from Meta or our own data it is marked *(vendor, unverified)*. Our own numbers come from
design/experiments.md. Nothing here changes a rule until the owner says yes; rule changes the owner must decide are marked **OWNER**.

Where we stand (design/experiments.md): web ~1,500 followers, median reach ~1,500 (best: Nº 09 79,496 reach, 2,296 saves, 370 shares,
held 74% of its length); tech ~9 followers, median ~115, ~4 s watched, stuck in the first test pool; Turns Out ~10 followers, icon-colour
reels hit ~1,100 and stop because nobody sends. The pattern in all three: **reach follows watch share and sends; our reels are watched,
rarely sent, almost never commented.**

---

## 1. Reach: what drives faceless explainer reels now (8 patterns)

**What Instagram says it ranks.** Watch time, likes per reach and **sends per reach** (Mosseri, Jan 2025); the Sept 2026 video series
adds originality (the original creator gets the credit over re-posters; from 30 Apr 2026 accounts that mostly repost are removed from
recommendations), recency, and testing every reel on non-followers first.
Sources: [Kompozy on the signals](https://kompozy.io/news/instagram-mosseri-ranking-signals-guidance),
[Bazzaal, Mosseri's 4 videos](https://www.bazzaal.com/blog/instagram-algorithm-2026-mosseri),
[SocialPilot Sept 2026](https://www.socialpilot.co/blog/instagram-reels-algorithm),
[Exemplary on originality](https://exemplary.ai/blog/instagram-algorithm-original-content). Our code-drawn reels are 100% original:
that is an asset, keep it.

| # | pattern | evidence (accounts, numbers) | what it means for us |
|---|---|---|---|
| P1 | **Built to be sent**: the reel ends on a verdict someone wants to show a friend ("send this to the dev who still does X") | Sends are the strongest signal for non-follower reach (Mosseri, above). Owner's ref 21 Nov (AI editing pipeline): **65K shares, 115K saves** on 47K likes. Our Nº 09: 370 shares, 79K reach; every reel with <20 shares stayed under 5K | every reel gets one named send target in the last line and the caption ("Send to the friend whose phone dies at 20%") |
| P2 | **Comment-keyword funnel** ("Comment COLOR and I'll DM you the 3 palettes") | Owner's ref 21 Nov: **49.4K comments ≈ 47.1K likes** (comments match likes only when there is a keyword ask). Owner's ref 23 Nov: same CTA. Vendors report 15-25% link clicks from DM vs 2-4% from the bio *(vendor, unverified)*: [Creator Lane](https://creatorlanehq.com/blog/dm-automation-for-youtubers-2026) | comments are a ranking-visible action, and a DM opens a thread (a reason to follow). Needs DM automation (section 3) |
| P3 | **Frame 0 is the payoff picture, motion already running** | Our data: watch share decides reach (Nº 09 held 74% → 99K; the rest 42-63% → <5K). Viewers drop to ~20-30% within 1-3 s on weak openings *(vendor)*: [dev.to Reels strategy](https://dev.to/fermainpariz/instagram-reels-strategy-2026-what-actually-works-data-backed-guide-11hn); 85% watch muted *(vendor)* | keep; already in our rules. The gap is the tech channel (4 s watched): it opens on a setup, not a picture |
| P4 | **Short, dense, looping (8-20 s) for visual explainers; longer only with a step bar** | neuronvisuals (stick-figure explainers, ~11 s): **936K followers, 265M views on 42 reels**; scroll.engineer (everyday tech explainers, 1-3 a day): **~30M views in 20 days**; @rick.theengineer 108K (animated explainers) *(all from [Postiz](https://postiz.com/blog/claude-animation-faceless-videos) / [BrainrotShorts](https://www.brainrotshorts.com/blog/how-to-make-animated-explainer-reels), unverified)*. Socialinsider: engagement 0.28% at 0-30 s, 0.35% at 45-60 s, 0.15% at 180 s+ ([Socialinsider](https://www.socialinsider.io/blog/instagram-reels-length/)) | tech's 36-43 s reels hold 4 s: cut tech to 15-25 s (tech-direction.md already says 20-30 s); web stays 12-21 s; the owner's 60-30-10 ref did 3 examples in 13 s |
| P5 | **A new state every ~1 s, and the payoff is a transformation you watch** | Owner's ref 23 Nov (a website recolouring live, split screen, swatch cards stacking); our Turns Out: every reel past 1,000 opens on a colour change; Liberty/Sahara/Golden Gate ~1,050-1,140 vs 108-161 without | split screen (rule on top, application below), one object changing as each element lands |
| P6 | **Save-worthy artefact inside the reel** (exact values on cards: HEX, px, the CSS line) | Owner's ref 23 Nov swatch cards; our best save rates are the reels with a copyable fix (Nº 09 2,296 saves). Carousels lead engagement slightly (Socialinsider Q3 2026: 0.50% vs 0.48%), reels lead reach for accounts under 50K ([Bereel](https://bereel.pro/blog/instagram-reels-vs-carousels-for-brands), [Buffer 52M posts](https://buffer.com/resources/state-of-social-media-engagement-2026/)) | stay reel-first (we are under 50K); put the copyable card on screen 1.5 s+ and in the DM (P2), not in a carousel |
| P7 | **Test on strangers: Trial Reels** | Trial Reels go to non-followers first; auto-share to followers if they perform within 72 h; publishable by API since Dec 2025 via `trial_params.graduation_strategy` = `MANUAL` or `SS_PERFORMANCE` ([Meta changelog](https://developers.facebook.com/docs/instagram-platform/changelog), [Meta blog 3 Dec 2025](https://developers.facebook.com/blog/post/2025/12/03/instragram-api-updates/), [Sprout](https://sproutsocial.com/insights/instagram-trial-reels/)); graduation by API is not exposed; there is a cap on trials | our publisher can post a reel as a trial with one extra field. Best use: tech (9 followers, nothing to protect) and hook A/B tests (**OWNER**: a second cut of the same reel is a second post) |
| P8 | **Collab posts** (one post, two accounts, both audiences) | Shows on both grids and feeds both follower bases; Mosseri: reach should not drop when the partner is smaller ([Kontentino](https://www.kontentino.com/q-and-a/does-an-instagram-collab-post-hurt-your-reach-if-the-other-account-is-smaller/), [Meltwater](https://www.meltwater.com/en/blog/instagram-collab-post)) | **our own accounts can collab**: web (~1,500 followers) invites @itturns.out on a design-fix reel; it puts Turns Out in front of 1,500 design-minded people at once. Later: peers in the niche |

**Posting time.** No source agrees for India: weekday evenings 19:00-21:00 IST show up most
([RecurPost](https://recurpost.com/blog/best-times-to-post-on-instagram/), [Fluxnote](https://fluxnote.io/guides/best-times-to-post-instagram-india-2026),
[Buffer 9.6M posts](https://buffer.com/library/best-time-to-post-on-instagram)). Our own E13 test beats all of them: 13:00 IST 1,221 vs
**19:00 IST 1,430** at 24 h; followers peak ~18:30 IST; 19:00 IST is also 08:30 EST (US morning). Recommendation: inside the owner's
13:00-21:00 window, **aim web at 19:00 IST**, tech at 19:30, Turns Out at 20:00 (no clash). The first 3 days carry ~65% of views
([Metricool 2026](https://metricool.com/instagram-reels-guide/)), so the slot matters less than the first hour's sends.

**Language (India).** Meta AI voice translation now dubs Reels into Hindi, Bengali, Tamil, Telugu, Kannada and Marathi; any public
account can switch it on before publishing; viewers can auto-translate ([Meta newsroom, Nov 2025](https://about.fb.com/news/2025/11/instagram-empowers-creators-to-go-global-with-local-voice-translations-and-fonts/),
[India TV, Jan 2026](https://www.indiatvnews.com/technology/news/instagram-expands-meta-ai-reel-translations-to-bengali-tamil-telugu-kannada-and-marathi-2026-01-17-1026257)).
It is an in-app toggle (not in the publishing API we found), so it is a manual **OWNER** test, tech first.

---

## 2. Production jump: options, cost, licence, how it runs on GitHub Actions

### (a) AI image and video generation
| option | price (Nov 2026) | licence / commercial use | label |
|---|---|---|---|
| **FLUX (Black Forest Labs API)** stills | ~$0.04-0.07 per image at 1-1.5K ([BFL pricing](https://bfl.ai/pricing), [Activepieces](https://www.activepieces.com/blog/flux-api-pricing-2026-what-does-a-month-cost)) | API output usable commercially; open `[schnell]` weights Apache 2.0, `[dev]` non-commercial ([BFL licensing](https://bfl.ai/pricing/licensing)) | Meta reads C2PA/IPTC metadata; self-disclose |
| Google Imagen 4 | $0.04 / $0.06 Ultra, SynthID watermark ([Google](https://developers.googleblog.com/en/announcing-imagen-4-fast-and-imagen-4-family-generally-available-in-the-gemini-api/)) | commercial per Google terms | a secondary source says Imagen 4 on the Gemini API shut on 17 Aug 2026: **check first** |
| Kling 3.0 / 4.0 video | ~$0.08-0.16 per second on fal ([buildmvpfast](https://www.buildmvpfast.com/api-costs/ai-video), [dev.to cost test](https://dev.to/turbogen_app/grok-imagine-15-seedance-25-kling-40-veo-31-fast-what-100-ai-video-clips-cost-on-6-223d)) | check the host's terms per model | |
| Veo 3.1 Fast | ~$0.15/s with audio on fal; fal listing may be deprecated (17 Nov 2026) ([teamday](https://www.teamday.ai/blog/fal-ai-pricing-2026)) | Google terms | SynthID |
| Seedance 2.5 | $0.47/s 720p, $1.16/s 1080p on fal | host terms | |

**Instagram's AI label.** Meta labels from C2PA/IPTC signals and self-disclosure; post-level "AI info" has **no published reach penalty**
and no independent study shows one; the only label with a stated reach cost is the profile-level "AI-generated profile" (from 31 Aug 2026)
for accounts featuring an AI *person* that do not label ([Junibloom](https://www.junibloom.com/blog/instagram-ai-labels-what-triggers-them),
[Miraflow](https://miraflow.ai/blog/instagram-ai-generated-profile-label-disclosure-guide-2026), [AI Social Media Now](https://www.aisocialmedianow.com/blog/instagram-ai-info-label)).
The owner's 23 Nov reference carried "AI content" and still went wide. Risk is viewer taste (people scroll past obvious AI), not the label.

**Verdict.** AI *video* is wrong for us now: $2-10 per 20 s reel in clips that cannot show exact UI, exact numbers or a real device
truthfully, and it breaks "facts on screen are checked". AI *stills as backgrounds and materials* are the cheap visual jump: the
liquid-silk colour field behind swatch cards, studio-lit plates and textures behind a code-drawn hero. Text, UI, numbers and diagrams stay
code-drawn (sharp and true). **OWNER**: this changes CLAUDE.md "Images: code only". Run: a "Media AI" workflow step calls the API with a
secret key, writes WebP to R2 (not the public repo), and the render inlines it as a data URI (scenes stay self-contained); a
`media/<file>.json` sidecar records model, prompt, date and "AI-generated" for design/safety.md; captions get an "AI-assisted background" note
and we toggle "AI info". No people, no logos, no real products in prompts.

### (b) Better 3D
- **three.js PBR + an HDRI + postprocessing: the biggest free jump.** `MeshPhysicalMaterial` (clearcoat, transmission for glass,
  anisotropy for brushed metal) lit by a CC0 HDRI from Poly Haven via PMREM gives real reflections; the pmndrs `postprocessing` library
  (MIT) adds bloom, depth of field, AgX/ACES tone mapping, SMAA, chromatic aberration and film grain in one pass chain. On runners this
  renders in headless Chromium on the CPU (SwiftShader): slower per frame but frame-stepped capture is unaffected; budget ~2-4x today's
  render time; keep DOF/bloom at half resolution. Cost $0. This is what tech-direction.md's "real materials, one key light" needs.
- **Blender headless**: Eevee needs a GPU/OpenGL; Cycles on a 4-vCPU runner is minutes per 1080x1920 frame, so a 25 s reel (750 frames)
  overruns the 6 h job limit ([Blender Studio on Eevee](https://studio.blender.org/blog/rendering-snow-parkour-animation-with-eevee),
  [devtalk](https://devtalk.blender.org/t/blender-2-8-unable-to-open-a-display-by-the-rendering-on-the-background-cycles/8607/18)). Only for
  stills or a short hero turntable; a GPU runner (~$0.07/min, larger runners) would change this. Not now.
- **Remotion**: free for companies up to 3 people, otherwise a company licence ([Remotion licence](https://www.remotion.dev/docs/license));
  gives a React timeline, not better pictures. Our capture already does what it does. Skip.
- **HyperFrames (HeyGen)**: Apache 2.0, HTML + GSAP compositions rendered to MP4, built for agents
  ([GitHub](https://github.com/heygen-com/hyperframes)). Same idea as our pipeline; switching costs weeks for no visual gain. Borrow ideas
  (its TTS/transcribe helpers), don't migrate.

### (c) Voice
| option | cost for our load (~3 reels × ~500 chars/day ≈ 45K chars/month) | notes |
|---|---|---|
| Kokoro (today) | $0, Apache 2.0 | flat delivery, no Hindi expressiveness; the "samey" feel is partly the voice |
| **ElevenLabs** | Creator ~$22/mo (100K credits) covers it; Starter $6 (30K) does not; API ~$0.04-0.08 per 1K chars ([invideo](https://invideo.io/blog/ai-voice-model-pricing/), [Smallest](https://smallest.ai/blog/elevenlabs-pricing-plans-cost-what-you-get-in-2026)) | commercial licence from Starter up; expressive v3 delivery, Hindi/Hinglish voices, **`with-timestamps` endpoint returns per-character timing** (our SYNC check and word captions get exact cues); sound effects on the same credits |
| Cartesia | Pro from $5; ~$0.03/min at scale ([Dupple](https://dupple.com/learn/cartesia-vs-elevenlabs)) | fast, cheaper, fewer Indian voices |

Pick ElevenLabs: one key, voice + SFX, timestamps. Runs as one step in the render workflow (`ELEVENLABS_API_KEY` secret), cache the MP3 per
line hash in R2 so a re-render does not pay twice; Kokoro stays the fallback when the key fails.

### (d) Sound design
Today: CC0 hits. The jump is *designed* sound: one whoosh sized to each camera move, a riser into the reveal, a sub hit on the payoff, a
room tone bed, ducking under the voice (ffmpeg `sidechaincompress`), loudness to -14 LUFS. ElevenLabs sound effects: royalty-free in
social media with a paid plan, ~$0.12 per generated minute ([ElevenLabs API pricing](https://elevenlabs.io/pricing/api)); generate a
library of ~60 house sounds once (≈$5 of credits), store in R2, reuse. A signature 0.5 s sonic logo per channel helps recognition.

### The ONE stack (recommended)
**three.js PBR + HDRI + postprocessing (free) · ElevenLabs Creator for voice and SFX ($22) · FLUX API for background stills only,
after the owner's yes (~$15-30) · ManyChat for comment-to-DM ($0 to start, $17 at 250 contacts).**
Total **~$40-70 a month (≈ ₹3,500-6,000)**, all on GitHub Actions as today, keys only as GitHub secrets.

---

## 3. DM automation: "Comment X and I'll DM you"

**How it works (Meta's rules).** A comment on our reel fires a webhook; the app sends a **private reply**: **one** message to that
commenter, within **7 days** of the comment ([Meta, Private Replies](https://developers.facebook.com/docs/instagram-platform/private-replies/)).
If the person answers, the normal **24-hour messaging window** opens and further automated messages are allowed inside it; outside it
only the Human Agent tag (7 days, human replies only, separate approval) ([Meta messaging policy](https://developers.facebook.com/documentation/business-messaging/messenger-platform/policy)).
Automation may only start from a user action (comment, story reply, DM); no cold DMs. A vendor cites ~750 private replies per hour per
account as the limit ([Creator Lane](https://creatorlanehq.com/blog/dm-automation-for-youtubers-2026)).

**Tools.** ManyChat (Meta partner): Free = 25 active contacts a month, comment-to-DM included; Essential ~$17 (250); Pro ~$39 (2,500);
priced by active contacts since 2 Mar 2026 ([Blotato](https://www.blotato.com/blog/manychat-pricing), [Flowgent](https://flowgent.ai/blog/manychat-pricing)).
Our own route is possible: the Cloudflare Worker already exists; the Instagram API with Instagram Login gives `instagram_business_manage_comments`
and `instagram_business_manage_messages`, and an app serving only our own accounts needs no App Review. It is free but an M-L build and one
more thing to keep running; start on ManyChat, move only if it caps us.

**Risks.** (1) A DM with only a link looks like spam: send the value as text (the CSS snippet, the three HEX codes), link optional.
(2) A one-word keyword in every caption reads as bait if the freebie is thin: the DM must be better than the reel. (3) "Follow to get it"
gates raise follows but annoy; use "follow for tomorrow's" in the DM instead. (4) Free tier caps at 25 people: one good reel blows it in
an hour, so budget Essential from day one on web. (5) The account must keep message requests open.

**What the owner sets up (≈15 min, once per account, web first):**
1. Instagram app → Settings → Messages and story replies → Message controls → **Connected tools: Allow access to messages** (on).
2. Account is professional (creator) already; confirm.
3. Sign up at ManyChat with the Instagram login of @webin20sec (we never see the password); Essential plan when we ask (~$17/mo).
4. Approve the DM text we write (one template per reel lives in the captions entry; the owner pastes the keyword + text, or gives
   ManyChat API access so a script sets it).

---

## 4. The jump: the 5 changes that would move reach most in 14 days

| rank | change | effort | cost | owner provides | measurable test (14 days, vs each channel's last 7) |
|---|---|---|---|---|---|
| 1 | **Comment-keyword DM funnel** on web (then Turns Out): every reel ends "Comment CSS and I'll DM you the snippet", the DM carries the copyable value | M | $0-17/mo | "Allow access to messages" on; ManyChat signup; approve DM text | comments per 1,000 reach ≥ 10 (now ~1); follows per 1,000 reach +50%; DMs sent count |
| 2 | **Built to be sent, cut to the bone**: tech 15-25 s, web 12-18 s, Turns Out ≤ 18 s; frame 0 = payoff picture; one named send target in the last line and caption; seamless loop | S (rules + scripts) | $0 | nothing | shares per 1,000 reach ≥ 5 (now <2); tech avg watch ≥ 8 s; web hold ≥ 60% |
| 3 | **Collab posts between our own accounts** (web × Turns Out on design fixes, 2-3 a week) + **Trial Reels** for tech (`trial_params`, SS_PERFORMANCE) | S | $0 | accept each collab invite in the app (one tap); OK for trials | Turns Out followers +100 in 14 days (now ~10); tech reach ≥ 300 on 3 of 7 trials |
| 4 | **Premium 3D kit**: three.js MeshPhysicalMaterial + Poly Haven HDRI + pmndrs postprocessing (bloom, DOF, AgX) for tech heroes and web objects | M-L | $0 (render minutes up) | nothing (tech direction approved) | critic "premium" question passes; tech 3-s hold ≥ 50%; reach ≥ 300 on 3 of 5 |
| 5 | **Paid voice + sound + stills**: ElevenLabs (voice with timestamps, designed SFX) and FLUX background stills (liquid colour fields, studio plates) | M | ~$22 + ~$15-30/mo | pay; add `ELEVENLABS_API_KEY`, `BFL_API_KEY` as GitHub secrets; **yes/no on AI-generated backgrounds** (rule change) | avg watch +20% on 5 reels vs the Kokoro week; saves per 1,000 reach +30% |

Order to start: 2 and 3 tomorrow (no money, no keys), 1 as soon as the owner flips the setting, 4 inside the tech reel work already
planned, 5 on the owner's yes. Posting slot: move web to ~19:00 IST inside the owner's window (our E13 data).

Not in the top 5, noted: Hindi auto-dub via Meta AI on tech (in-app toggle, owner test); carousels (engagement +, reach − under 50K);
AI video (too costly and not truthful enough for explainers now); Blender, Remotion, HyperFrames migrations (no visual gain for the cost).
