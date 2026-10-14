# What we sell (the brief behind every reel)

Owner, 14 Oct 2026: "Aquarii Tech Studio is a place where we templateise things, but by the end we have to sell our own services."
The reels were selling the fictional business on the template (laundry, food delivery, a dental clinic). That was wrong: a viewer learned about laundry, not about us.
From now on **the protagonist of every reel is Aquarii Tech Studio**, and the viewer is a business owner or founder who could hire us.

## The four service lines (rotate; `S.dna.service` in every film, `## Service` in every kit)
| Key | Service | The buyer's pain (the hook comes from here) | What we deliver (the mechanism the film shows) |
|---|---|---|---|
| `web` | Web design and development | "My site looks old", "nobody enquires", "it breaks on phones", "I can't update it" | A designed, fast, mobile-first site that turns visitors into enquiries. Proof: the day's template, shown as *a concept we designed*. |
| `social` | Social media management | "I post when I remember", "no reach", "no time", "I don't know what works" | A content plan, a reel series, daily posting, replies, a weekly numbers review. Proof: this account's own system (a reel made every day, numbers read every night). |
| `security` | Website and security management | "My site got hacked", "the SSL expired", "plugins never get updated", "no backups", "it went down and nobody noticed" | Monitoring, updates and patches, backups, SSL, firewall rules, uptime alerts, a monthly report. |
| `edge` | CDN and security aggregation | "Slow for customers abroad", "bots and attacks", "outages", "too many providers, nobody owns it" | We choose and wire the right CDN, DNS, WAF, bot and DDoS protection for the site, and run them as one setup: faster, harder to knock down. |
| `studio` | All of it (use rarely: intro or pinned reel) | "I need a whole tech team, not four vendors" | One studio for the site, the socials, the security and the infrastructure. |

Rotation: never the same service as the previous film (check.mjs enforces it); in any 4 films, cover at least 3 of web / social / security / edge.

## What the template is for now
The daily template still gets made (the site is our portfolio of range), but it is **proof**, never the subject:
- `web` reels show it as "a site we designed" (a concept: never "for our client").
- `security` / `edge` reels can use it as "the site being protected or sped up".
- `social` reels can use its kit or its reel as "the content we produce".
- Nothing in the hook, caption, send line or CTA is about the fictional business. scripts/check.mjs refuses a kit whose Hook or Caption names the template's brand.
- Pick the template's own purpose to suit the service of the day when that helps (e.g. a SaaS status page for `security`, a global shop for `edge`), but keep its range.

## Formats (rotate; log the format in reel-log `format`)
1. **Service ad**: a buyer's problem → our service → what you get → DM CTA, in our own words and our own picture (never a reference's lines or device).
2. **Cheat sheet**: "5 signs your site is unprotected" / "What a CDN actually does": a list or diagram worth saving, ending on our own save line (e.g. "Save it for your next site review").
3. **Before / after**: slow vs fast, exposed vs protected, random posts vs a plan (compare, meter).
4. **Explainer in 15 s**: how a request travels through a CDN and a firewall (route, hub, shield).
5. **What you get**: the deliverables of one package, built on screen (steps, grid fill, deck).
6. **Myth vs fact**: "A website is a one-time job" → no.

## Honesty (unchanged, stricter)
- Never invent clients, results, testimonials or numbers about Aquarii. No "we got X for a client". No uptime or speed percentages presented as ours.
- General facts are fine only when they are true and well known (what a CDN does, that SSL certificates expire); avoid statistics unless the source is named in the kit.
- Demo numbers inside a film (an animated counter of blocked requests) are an illustration and must look like one; never put them in the hook or caption.

## The CTA
Every reel ends on Aquarii: the send line names who should get it ("Send this to a founder with a leaky site"), then the CTA (owner, 14 Oct 2026):
**"DM us"** (owner, 14 Oct 2026: DM only for now, no phone number anywhere), on screen in the film's last seconds and as the last caption line.

## Originality (owner, 14 Oct 2026)
A reel that rebuilds a reference reel is plagiarism, even with our text in it. Learn the idea and the timing from references, then build our own picture: our own
metaphor first (Aquarii is the water bearer: sites as vessels, visitors as water, leaks and patches, pouring, flooding, rising), combined with at most one technique per
reference. check.mjs enforces it through scripts/film/sources.json (parts per reference, banned lines).

## If a client hands us their social media (what we would run, and run here first)
This account is our own test bed: whatever we sell as social media management, we do here first and can show.
1. **Goal and buyer**: one business goal (enquiries, bookings, sales) and one buyer, written down.
2. **Audit**: the last 20 posts: reach, watch time, sends, saves, comments; what the competitors' best posts do.
3. **Pillars**: 3-4 content pillars tied to what the client sells (here: the four service lines above).
4. **Formats and series**: a small set of repeatable formats (above), so the audience learns what to expect.
5. **Calendar**: a week planned ahead; one post a day at a fixed time; Stories to push each post.
6. **Production**: a pipeline that makes each post the same way every day (here: template, film, kit, cover).
7. **Community**: reply to every comment in the first hour; DMs answered the same day; 3-5 genuine comments a day on the audience's posts.
8. **Numbers**: read nightly (Instagram collect); weekly verdict on one experiment at a time (design/experiments.md); keep what works, drop what does not.
9. **Report**: a monthly one-page report for the client: what we posted, what grew, what we change next.
