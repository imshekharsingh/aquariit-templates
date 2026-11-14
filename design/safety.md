# Channel safety checklist: avoid takedowns, strikes and hate (owner, 14 Nov 2026)

Owner: "keep updating it to safeguard our channel from takedown or hate." Every reel on every channel is checked against this list before it
is called ready (builder, Reel critic, and Output QA where measurable). Add a line the same day whenever a new risk is found (an Instagram
policy change, a comment storm, a removed post anywhere in our niche). Each line: the rule, why, how it is checked.

## The owner's four (13-14 Nov 2026)
1. No plagiarism: never re-post or closely re-edit another creator's reel, voice, script, music or layout; real media is a raw ingredient,
   reframed and animated into our own design; techniques only.
2. No controversial content: no politics, elections, living politicians, wars, disputed borders, religion, caste, gender or culture-war topics.
3. No disrespect: no mocking of people, places, brands, countries, accents, cultures or beliefs; brands at their strengths only.
4. Nothing that may hurt anyone's sentiment: national symbols, flags, maps, monuments of worship, tragedies and disasters treated with care
   or avoided; no jokes about any group.

## Copyright and licences (takedown risk)
5. Images and footage only from allowed free licences (PD, CC0, CC BY with credit), licence recorded per file (Output QA LICENCE).
6. Music and sound only from our own code or CC0 samples (no trending audio added by us; the owner may add Instagram's library audio,
   which Instagram licenses).
7. No logos, trademarks, product marketing photos, app screenshots of real brands, film/TV/game characters, sports team marks.
8. Fonts only Google Fonts / open licence.

## Instagram Community Guidelines and recommendation rules (reach and removal risk)
9. Accuracy: every factual claim in two reliable sources (Turns Out) or the maker's official page (tech); no misleading claims or
   clickbait the reel does not deliver; myths labelled clearly as myths.
10. No health, medical, diet, financial or investment advice; no "this setting will save your battery forever" style overclaims.
11. No dangerous or harmful acts (no instructions to bypass security, jailbreak, piracy, hacking, removing safety features).
12. No violence, gore, injury, weapons; disasters only as history, without graphic images or dramatised suffering.
13. No identifiable private people, children, or faces of living people without consent; historical figures only under the Turns Out exception.
14. No hate speech, slurs, stereotypes; no sexual or suggestive content.
15. No engagement bait that Instagram demotes ("comment YES", "tag 10 friends", follow-for-follow); captions may invite a save, a send or
    an honest answer.
16. Maps: never show contested borders; prefer globes or close crops without political lines (India-sensitive: Kashmir, Arunachal).

## Brand and legal (tech)
17. Brand mentions factual, neutral and sourced; no "X is worse than Y", no unverified rumours or leaks, no price or spec we cannot cite.
18. Claims dated ("as of Nov 2026"); no affiliate or sponsored content without a clear #ad once collabs start.

## Hate and comment safety
19. Avoid topics that reliably attract hostile comments (country-vs-country, religion, politics, gender); if a reel draws hate, the audit
    flags it, the topic type goes on the never-list, and the owner can hide or limit comments.
20. Never reply to provoke; pinned comment only to add sources or a correction.

## Free real images and footage for @techin20sec and Turns Out (owner, 14 Nov 2026; moved from CLAUDE.md)
Owner: "yes to free real images ... take those and work or animate your design around it". Code-drawn shapes hit a low ceiling for real
places and products, so tech and Turns Out reels are built AROUND free real media, animated by us (parallax cut-outs, slow push-ins, masks,
overlays, our type and sound). This overrides "Images: code only" for these two channels.
- Allowed sources only, licence recorded per file in the config ("media": [{file, source_url, author, licence}]): public domain / CC0
  (Wikimedia Commons PD/CC0, US government works such as NASA, NOAA, DVIDS, US Army Corps, Library of Congress "no known restrictions",
  Openverse with licence cc0/pdm), and CC BY (credit in the caption's sources line). Never non-commercial (NC), no-derivatives (ND),
  "editorial use only", stock-site watermarks, or anything taken from another creator's reel or video. Output QA LICENCE checks it.
- Real media is a raw ingredient, always reframed and animated into our own design; never re-post someone's reel or a recognisable edit.
- Tech: real photos of generic gadgets and parts; brand logos, product marketing photos and trade dress stay out.
- No identifiable private people; historical figures only under the Turns Out exception.
- GitHub does the fetching and processing: the session writes search terms or file URLs into the config; the "Media" workflow (Openverse /
  Wikimedia / NASA / LoC APIs, no keys) downloads, checks the licence, cuts/resizes, stores in R2 and the render pulls it. Sessions do not
  download media themselves.
