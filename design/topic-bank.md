# Topic bank, 25-27 Nov 2026 (researched 24 Nov night by a Sonnet session; Fable only picks)

How to use: the builder picks ONE option per channel and day (the two marked PICK are the recommendation), copies its facts into the reel
config, and re-reads the two URLs the morning of the build (web facts must still read the same). Nothing here repeats captions.json or
topics.md. Turns Out is not in this file (fixed design order). Tech 25 Nov is skipped (storage-gap is built).

How the facts were checked (24 Nov, this session): web facts were read in the MDN page source (github.com/mdn/content, files/en-us/web/...)
and browser support in MDN's browser-compat-data (github.com/mdn/browser-compat-data). developer.mozilla.org itself is blocked from this
container, so the MDN page link is the public page for the same file. Tech facts were read on apple.com, support.apple.com and
developer.android.com (the only maker hosts this container can reach). Every tech option below uses only those pages. Other maker hosts
(samsung.com, google, usb.org, bluetooth.com) could not be opened, so no option leans on them.
Gold look (design/gold.md): web = black look, one still phone/card, hook top-left with one accent word, a number meter that steps on each
event, red for the bug and mint for the fix, no frame or glow. Tech = dark room, one lit hero object, a new world every 3-5 s, one huge
number that changes when the voice says it, amber for the problem and cyan for the payoff.

## WEB

### Tue 25 Nov
**W25-1 PICK: your text box grows by itself (field-sizing)**
- Hook: "You wrote JavaScript to grow this textarea. CSS does it in one line." Tension: a myth that auto-grow needs `scrollHeight` code.
- Learn: `textarea { field-sizing: content; }` makes a textarea grow with its text, and a max-height then adds the scrollbar.
- Fact 1: field-sizing lets form controls "adjust in size to fit their contents"; a textarea with it grows in height, and once a height limit is reached it scrolls. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/field-sizing
- Fact 2: support (browser-compat-data): Chrome 123, Firefox 152, Safari 26.2. Same page, "Browser compatibility".
- Fit with gold: tabwiggle's counter-on-a-phone grammar: a chat box on the one big phone, a LINES meter that steps as each line is typed. Not a copy: the subject is a growing box, not a shifting bar.
- Prop from the idea: the JS lines (`el.style.height = el.scrollHeight + 'px'`) sit on a code card and get struck out one by one as the box grows on its own.
- Why pick: the visible bug (a clipped message in a chat box) is obvious in frame 0, the fix is one line, and the number to show is a count of JS lines in OUR demo code card (count them when building; do not claim a typical number).

**W25-2 PICK: this form is red before you type a letter (:user-invalid)**
- Hook: "This form is red before you type anything." Tension: `:invalid` fires on an empty required field at page load.
- Learn: style `:user-invalid` instead of `:invalid`; the error only shows after the person has interacted.
- Fact 1: `:user-invalid` matches an invalid control "after the user has interacted with it". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:user-invalid
- Fact 2: support: Chrome 119, Firefox 88, Safari 16.5 (same page).
- Fit: black look, the form card is the hero, a RED FIELDS counter reads 3 at load and 0 after the fix, mint on the fixed state. Not the form-jump reel (showreel-38 was about the error line moving, this is about when it shows).
- Prop: a row of three input boxes lit red like warning lamps before the first tap; they go dark until the finger leaves the field.
- Why pick: best "bug in frame 0" of the five, and a number that changes (3 red to 0).

**W25-3: wrapping that ends with one lonely word (text-wrap: pretty)**
- Hook: "Why does the last line hold one word?" Tension: the orphan is not your copy, it is how lines wrap. (`balance` was posted; `pretty` is the body-text one.)
- Learn: `p { text-wrap: pretty; }` avoids a short last line in body copy; `balance` is for headings only.
- Fact 1: `pretty` "favors better layout over speed", for body copy where orphans should be kept to a minimum. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-wrap-style
- Fact 2: support for `pretty`: Chrome 130, Safari 26, Firefox not yet (same page; say "not in Firefox" on screen or skip the support line).
- Fit: black look, one paragraph card, the orphan word circled in red then pulled up. Prop: a single word hanging off the end of a paragraph like a dropped thread, pulled back by the fix.
- Weakness: Firefox gap and a subtle effect; it needs a big paragraph at phone size to read.

**W25-4: your hero image waits in line (loading="lazy" on the first image)**
- Hook: "You made your page faster. This one attribute made it slower." Tension: lazy loading on the top image delays it.
- Learn: never put `loading="lazy"` on the image the first screen shows; give the main image `fetchpriority="high"`.
- Fact 1: lazy-loaded images in the viewport may not be loaded yet when the load event fires, because that event only counts eager images. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img (the `loading` attribute)
- Fact 2: `fetchpriority="high"` fetches a resource at high priority; MDN gives the case of an image that "significantly contributes" to Largest Contentful Paint. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/fetchpriority . Support: `loading` Chrome 77 / Firefox 75 / Safari 15.4; `fetchpriority` Chrome 101 / Firefox 132 / Safari 17.2.
- Fit: the waterfall as a stack of bars is a chart (gold bans bars and chart labels); instead show a phone where the hero photo arrives 1 s late, a seconds meter that steps. Prop: a queue of people at a door, the hero image last in line.
- Weakness: needs a timing number from a real measure that we do not have yet; a made-up delay would break the fact rule.

**W25-5: the carousel flies past photos (scroll-snap-stop: always)**
- Hook: "One flick, five photos skipped." Tension: the carousel has snap points, and a fast swipe still skips them (follow-up to showreel-33-carousel).
- Learn: `scroll-snap-stop: always` on each photo makes a swipe stop at every one.
- Fact 1: `scroll-snap-stop` defines whether the scroll container may "pass over" snap positions; `normal` can pass through, `always` stops. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-snap-stop
- Fact 2: support: Chrome 75, Firefox 103, Safari 15 (same page).
- Fit: black look, one phone, a PHOTOS SEEN meter. Weakness: close to showreel-33 (a carousel), so use last.

### Wed 26 Nov
**W26-1 PICK: CSS can select a parent (:has)**
- Hook: "CSS can't select a parent. It can." Tension: a 20-year-old rule that stopped being true.
- Learn: `.card:has(input:checked) { ... }` styles the card when its checkbox is on, no JS class toggling.
- Fact 1: `:has()` "represents an element if any of the relative selectors ... match", a way of selecting a parent. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has
- Fact 2: support: Chrome 105, Firefox 121, Safari 15.4 (same page).
- Fit: black look, a list of option cards (plans, toppings) as the hero; ticking the box lights the whole card mint; a JS counter on a code card drops to 0 lines. Prop: a family tree where the child is tapped and the parent lights.
- Why pick: strongest "myth that changed" of the 15, big visible result, one line of code.

**W26-2 PICK: will-change makes it faster (it does not)**
- Hook: "This one line makes every animation faster. Everyone believes it." Tension: MDN says the opposite for the common use.
- Learn: do not put `will-change` in the stylesheet "just in case"; use it as a last resort for a problem you measured, and remove it after.
- Fact 1: "Use the will-change property as a last resort ... Don't use it to anticipate performance problems." https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change
- Fact 2: in a stylesheet it keeps the browser's optimizations "for a much longer time"; excessive use "will result in excessive" memory use (same page, "Usage notes").
- Fit: black look; the hero is a phone with ten cards, each one with a small weight tag that grows as `will-change` is added. No memory number on screen unless measured; show the words, not a made-up MB. Prop: a backpack that gets heavier with each "just in case" item.
- Why pick: a real surprise (a performance tip that backfires), and the fix is to delete a line.

**W26-3: a menu with no JavaScript (popover)**
- Hook: "This menu closes when you tap outside. There is no JavaScript." Tension: light dismiss and Esc are free.
- Learn: `<button popovertarget="m">` and `<div popover id="m">`: open, outside tap and Esc all work.
- Fact 1: `auto` popovers can be "light dismissed" by clicking outside, opening another popover, or Esc. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover
- Fact 2: when shown, focus order is updated so the popover is next in the tab sequence (https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using). Support: check browser-compat-data `html.global_attributes.popover` the morning of the build (the file was not read tonight).
- Fit: black look, one phone, a TAP-OUTSIDE meter. Weakness: support not confirmed tonight, so lower.

**W26-4: the tap ring that nobody wants (:focus-visible)**
- Hook: "Delete the focus ring and you lock out half your users." Tension: the common "outline: none" fix.
- Learn: `:focus-visible` shows the ring for keyboard use and hides it for taps.
- Fact 1: browsers no longer draw a ring on every focus; for example, clicking a button with a pointer generally does not show focus. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible
- Fact 2: support: Chrome 86, Firefox 85, Safari 15.4 (same page).
- Fit: black look. Weakness: a phone viewer has no keyboard, so the bug is invisible at phone size (see owner-feedback 21 Nov, optical-centre: never build on something the viewer must feel). Lowest rank.

**W26-5: one line recolours every checkbox (accent-color)**
- Hook: "These checkboxes are native. Why are they purple?" Tension: you do not need a custom checkbox.
- Learn: `accent-color: #5fe3c0` on a form or `:root`.
- Fact 1: `accent-color` sets the accent colour for controls generated by some elements, such as a checkbox. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/accent-color
- Fact 2: support: Chrome 93, Firefox 92, Safari 15.4 for the value, 26.2 for the property in this record (browser-compat-data shows two rows; re-read before use).
- Fit: black look, a settings list with toggles turning mint. Weakness: pretty, but no tension and little to teach.

### Thu 27 Nov
**W27-1 PICK: a scroll progress bar with no JavaScript (animation-timeline: scroll())**
- Hook: "This progress bar has no scroll listener." Tension: the bar follows the page, and no code runs on scroll.
- Learn: `animation-timeline: scroll()` ties a CSS animation to the scroll position instead of to time.
- Fact 1: `animation-timeline` sets the timeline that controls a CSS animation; `scroll()` is an anonymous scroll-progress timeline. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline
- Fact 2: support: Chrome 115, Firefox 159, Safari 26 (same page).
- Fit: black look, one phone with a long article scrolling, the bar on top filling in mint; a SCROLL EVENTS counter stays at 0. Prop: a thermometer along the screen edge. Not a copy of tabwiggle: here the motion is the point and the scroll drives the whole reel.
- Why pick: great motion for a video, a real number (0 listeners), all three engines.

**W27-2 PICK: the hidden page behind the popup still takes taps (inert)**
- Hook: "The popup is open. You can still tab into the page behind it." Tension: showreel-13-popup fixed the scroll, not the focus.
- Learn: `<main inert>` while the popup is open: nothing behind can be focused or clicked.
- Fact 1: `inert` makes an element and its descendants non-focusable and non-clickable, links, buttons and form controls included. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert
- Fact 2: a modal `<dialog>` opened with `showModal()` escapes inertness (same page). Support: re-read `html.global_attributes.inert` before building (not read tonight).
- Fit: black look; a phone with a popup and a focus dot that jumps behind it. Weakness: needs a keyboard/screen reader view, which is faint on a phone; second pick only.

**W27-3: Hindi words hyphenate in Chrome only (hyphens: auto and lang)**
- Hook: "Why does your text break words in half in one browser and not another?" Tension: `hyphens: auto` does nothing without `lang`.
- Learn: add `lang="en"` (or `hi`) to `<html>` and `hyphens: auto` on the text.
- Fact 1: "Browsers will only hyphenate if [the lang] attribute is present and the appropriate hyphenation dictionary is available." https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/hyphens
- Fact 2: support per language (browser-compat-data): Hindi hyphenation Chrome 87, not Safari or Firefox; English Chrome 55, Firefox 6, Safari 5.1. Same page.
- Fit: black look, a narrow card with a long word. India angle: Hindi works only in Chrome. Weakness: a long-word overflow reel already exists (showreel-23-sideways).

**W27-4: a long page that scrolls like a short one (content-visibility: auto)**
- Hook: "Your long page is slow to open. One line skips the part you cannot see." Tension: the browser lays out everything, even below the screen.
- Learn: `section { content-visibility: auto; contain-intrinsic-size: auto 500px; }`.
- Fact 1: `content-visibility` lets the browser skip rendering work for off-screen elements until needed. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility
- Fact 2: support: Chrome 85, Firefox 125, Safari 18 (`auto` value in Safari 26; same page). MDN pairs it with `contain-intrinsic-size` so the scrollbar does not jump.
- Fit: a long feed with a "RENDERED" meter that counts only what is on screen. Weakness: no honest speed number without a measurement; use a count of boxes, not milliseconds.

**W27-5: animate a menu to height: auto (interpolate-size)**
- Hook: "You can't animate to height: auto. Until now." Tension: a 15-year-old impossibility.
- Learn: `:root { interpolate-size: allow-keywords; }` then `transition: height .3s`.
- Fact 1: `allow-keywords` enables interpolation between a length and an intrinsic size such as `auto` (not between two intrinsic sizes). https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interpolate-size
- Fact 2: support: Chrome 129 only; Firefox no; Safari "preview" (same page). A reel must say "Chrome" on screen. Lowest rank for a mixed audience; showreel-35-list already taught the grid-rows trick.

## TECH (25 Nov skipped: storage-gap is built)

**STALE (owner, 25 Nov 2026): every tech option below (T26-1 to T27-5) is marked stale: older facts and phone-heavy. Do not pick from it.** The daily tech
research pulls fresh news (last 7 days, primary sources, each option names its date; rules-tech.md N1-N4) and tomorrow's pick comes from that.

Every tech fact below is read on the maker's own page tonight. Brands may be named as text (rules-tech.md).

### FRESH, researched 26 Nov 2026 (news from 19-25 Nov, primary pages read 26 Nov; all global; N1-N4)
Only one phone-category option (T26N-5) and battery cycles (25 Nov, a phone) was yesterday, so it is the weakest.
**T26N-1 PICK your tag can now tell which way your keys are, from 60 m (Galaxy SmartTag3, Bluetooth 6.0 Channel Sounding)** (news 23 Nov 2026)
- Hook: "Old trackers say 'near'. This one points." Tension: the same Bluetooth, a new way to measure distance.
- Learn: Bluetooth 6.0 Channel Sounding measures phase and time of flight across many channels instead of signal strength, so the tag can show direction and distance from up to about 60 m (UWB takes over for finer finding within 20 m).
- Fact 1: Compass View "extends the maximum finding range to approximately three times that of its predecessor"; Channel Sounding "measures changes in radio wave phase and time of flight across multiple channels to calculate distance more precisely", conventional BLE uses RSSI. https://news.samsung.com/global/the-technology-behind-more-precise-finding-with-galaxy-smarttag3-and-smartthings (23 Nov 2026)
- Fact 2: tag weighs 9.15 g, about 33% lighter and 35% smaller by volume than its predecessor, battery up to 550 days standard, 790 in Power Saving Mode (same page). Also Location History keeps 7 days; Galaxy Find Network of more than 900 million devices.
- Fit: colour world: a purple tag on a dark floor, glowing rings that tighten and a compass needle, a 3D number 60 m counting up on the spoken word; cables are not needed, the rings are the picture. Not a phone topic.
- Why pick: an accessory with a real mechanism change (RSSI to phase and time), a big number, and a picture (rings, compass) that does the explaining. Say "Samsung's SmartTag3"; no winner/loser versus other trackers.
**T26N-2 the first 1,100 Hz monitor (Samsung Odyssey G6)** (news 23 Nov 2026)
- Hook: "A new screen draws 1,100 pictures every second." Tension: how fast is fast enough.
- Fact 1: 27-inch Odyssey G6 (G60H), "world's first gaming monitor to support a refresh rate of up to 1,100Hz in HD"; Dual Mode: HD up to 1,100Hz or QHD (2,560 x 1,440) up to 600Hz; 1ms GtG. https://news.samsung.com/global/samsung-launches-odyssey-g6-the-worlds-first-1100hz-gaming-monitor
- Fact 2: Odyssey Clear Motion reduces motion blur; availability and price vary by market (same page). Maths: 1,100 Hz is one picture every 0.91 ms (ours, say "about 0.9 ms").
- Fit: a giant 3D number 1100 and a ruler of frames; close to screen-120hz (posted 17 Nov), so lower rank.
**T26N-3 Google plans data-center racks in space (Project Suncatcher, Blue Origin)** (news 19 Nov 2026)
- Hook: "Google is planning to launch AI computers into orbit." Tension: why put a data center above the sky.
- Fact 1: Blue Origin's New Glenn will deploy satellites, "each with roughly the capacity of a data center rack", into sun-synchronous orbit, targeted for Q1 2029. https://blog.google/innovation-and-ai/models-and-research/google-research/blue-origin-project-suncatcher-partnership/ (19 Nov 2026)
- Fact 2: the goal is to "scale AI infrastructure in space by tapping into the abundant solar power in orbit" (same page). It is a long-term moonshot: say "plans", never "will".
- Fit: racks drifting over a dark curved floor, a sun rim light; weakness: far from a purchase; the viewer cannot act on it.
**T26N-4 smart glasses go on sale 10 Dec (Samsung intelligent eyewear)** (announced 12 Nov, 14 days old: borderline, not in the 7-day window)
- Fact 1: release in the US and South Korea on Dec. 10, pre-orders open, 30 designs with Gentle Monster and Warby Parker, about 41 g, Gemini built in. https://news.samsung.com/global/samsung-announces-december-release-for-intelligent-eyewear-bringing-a-smarter-way-to-see-the-world
- Weakness: older than 7 days; only the release date is the news.
**T26N-5 One UI 9.5 beta opens (Samsung, phone)** (18 Nov, 8 days: borderline)
- Fact 1: beta open to Galaxy S26 series users in select markets including Germany, India, Korea, Poland, the UK and the U.S.; new camera controls. https://news.samsung.com/global/samsung-begins-one-ui-9-5-beta-program
- Weakness: software menu changes, a phone, and nothing a stranger can picture. Lowest rank.

### Thu 26 Nov
**[STALE] T26-1 PICK your phone battery has a number of lives (500 vs 1000 cycles)**
- Hook: "Your battery is rated for 500 charges. On newer phones, double." Tension: a number that changed.
- Learn: what a "complete charge cycle" is, and that an 80% capacity rating is a design target, not a deadline.
- Fact 1: iPhone 14 and earlier batteries "are designed to retain 80 percent of their original capacity at 500 complete charge cycles under ideal conditions". https://support.apple.com/en-us/101575
- Fact 2: iPhone 15 models "are designed to retain 80 percent of their original capacity at 1000 complete charge cycles under ideal conditions" (same page; the page names only 15 models, so do not say 16 or 17 without re-reading).
- Fit with the ai-memory gold: the x-ray phone, the battery cell lit amber, one huge number that changes on the spoken word (500 to 1000), cyan on the payoff. Not a copy: a cell and a charge counter, not a memory board.
- Prop: a battery cell with a tally scratched into it, 500 marks then 1000.
- Not a repeat: charge-80, heat-battery and drain-zero covered habits; this is the rated lifespan.

**[STALE] T26-2 PICK your phone can measure how far the router is (Wi-Fi ranging, RTT)**
- Hook: "Your phone can measure the distance to your router, with no GPS." Tension: indoor position without satellites.
- Learn: with Wi-Fi RTT a phone times the round trip of a signal to three or more access points and works out where it is, within about 1-2 m, without joining those networks.
- Fact 1: "The result is typically accurate within 1-2 meters" when you measure three or more access points. https://developer.android.com/develop/connectivity/wifi/wifi-rtt
- Fact 2: the phone "doesn't need to connect to the access points to measure distance" (same page). Say "Android phones with the feature and routers that support it"; it is not on every phone or router.
- Fit: dark room, a phone hero, three routers as small lit towers, rings that tighten on the spoken number. Prop: three rings meeting at one dot, the phone.
- Why pick: nothing like it was posted; real 3D props (rings in space) suit the gold look.

**[STALE] T26-3 the phone that measures to 10 cm (ultra-wideband)**
- Hook: "Your phone can tell which way you are standing to 10 centimetres." Tension: the precision number.
- Learn: UWB is a radio for ranging between devices, much finer than Bluetooth.
- Fact 1: UWB is "a radio technology focused on precise ranging (measuring the location to an accuracy of 10 cm) between devices". https://developer.android.com/develop/connectivity/uwb
- Fact 2: its bandwidth is greater than 500 MHz (or over 20% fractional bandwidth) (same page). Make the claim about Android's UWB API only; no iPhone claim from this page.
- Fit: two phones facing, a cone of rings between them. Weakness: the second fact is a spec the viewer will not feel.

**[STALE] T26-4 why your Android notification arrives late (Doze)**
- Hook: "Your phone delays your messages on purpose." Tension: it is a design choice, not a bug.
- Learn: while a phone sits still, unplugged, with the screen off, Android bunches network, jobs and syncs into rare windows; messages sent with the right push priority can come through.
- Fact 1: in Doze the system "prevents apps from accessing the network and defers their jobs, syncs, and standard alarms". https://developer.android.com/training/monitoring-device-state/doze-standby
- Fact 2: it runs pending work in a "maintenance window", and "over time" schedules them less often (same page).
- Fit: the phone on a night table, a window of light opening now and then. Weakness: the fix is for app makers; the viewer's fix (battery settings per app) must be checked on the maker's page that morning.

**[STALE] T26-5 Android ranks your apps (App Standby Buckets)**
- Hook: "Your phone has put every app in a bucket. Yours may be in the worst one." Tension: a hidden ranking.
- Learn: apps you open rarely get fewer background jobs and alarms, but only while the phone is on battery.
- Fact 1: the bucket "determines how frequently the app's jobs run and how often the app can trigger alarms". https://developer.android.com/topic/performance/appstandby
- Fact 2: the limits "apply only while the device is on battery power", and each maker may set its own rules (same page).
- Fit: buckets as lit glass jars. Weakness: the viewer cannot see their own bucket, so there is nothing to act on; lowest rank.

### Fri 27 Nov
**[STALE] T27-1 PICK the switch almost nobody should turn on (Lockdown Mode)**
- Hook: "Apple built a mode that breaks your phone on purpose." Tension: protection that removes features.
- Learn: what Lockdown Mode turns off, and that it is for the very few people who may be targeted.
- Fact 1: "an optional, extreme protection that's designed for the very few individuals who, because of who they are or what they do, might be personally targeted". https://support.apple.com/en-us/105120
- Fact 2: incoming FaceTime calls are blocked unless you have called that person in the past 30 days, and configuration profiles can't be installed (same page).
- Fit: a phone in a vault of dark glass, a list of switches turning off one by one on the spoken word; cyan on "calls and SOS still work". Prop: a phone behind bank-vault doors.
- Why pick: a surprise with a purpose (most people should not use it), safe, factual; keep the tone calm, no fear.

**[STALE] T27-2 PICK your earbuds have a new codec (LE Audio, LC3)**
- Hook: "Your earbuds' audio codec is about to change." Tension: the codec every pair uses is being replaced; say only what the page says (LC3 replaces SBC).
- Learn: Bluetooth LE Audio brings LC3, broadcast audio (one source, many listeners) and better mic quality.
- Fact 1: "LC3 ... replaces the SBC codec used for A2DP (media) and mSBC in HFP (voice). LC3 is more efficient, reconfigurable, and higher quality." https://developer.android.com/develop/connectivity/bluetooth/ble-audio/overview
- Fact 2: with BLE Audio, input and output sampling can reach 32 kHz on headsets using microphones, where Bluetooth classic lowers audio quality (same page); Broadcast Audio lets users broadcast to friends and family or join public broadcasts.
- Fit: a pair of earbuds as the lit hero, sound rings; a huge number 32 kHz.

**[STALE] T27-3 that battery claim is a recipe (Apple Watch Ultra 4, over 2 days)**
- Hook: "'Over 2 days' on a watch means 630 time checks." Tension: the claim has a script.
- Learn: how to read a battery claim: the test list is on the maker's page.
- Fact 1: "Over 2 days (up to 50 hours)"; the test includes 630 time checks, 190 notifications, 30 minutes of app use, two 60-minute workouts, 12 hours of sleep tracking. https://www.apple.com/watch/battery/
- Fact 2: "Over 3 days (up to 84 hours) in Low Power Mode" with 1100 time checks and 330 notifications (same page); charging "about 45 minutes to 80%".
- Fit: a watch hero, the counters ticking on the spoken number. Weakness: same format as showreel-tech-phone-claim (22 hours); use only if the audit asks for a wearable.

**[STALE] T27-4 earbuds that are also a hearing test (AirPods Pro 3)**
- Hook: "Your earbuds can run a hearing test at home." Tension: a gadget crossing into health.
- Learn: what the feature is for (mild to moderate hearing loss) and where it is available.
- Fact 1: users can take a "scientifically validated Hearing Test" and use a Hearing Aid feature for "mild to moderate hearing loss". https://www.apple.com/airpods-pro/
- Fact 2: up to 8 hours of listening time with Active Noise Cancellation on a single charge (same page). Check the footnotes about countries before saying "available in India" (not read tonight).
- Fit: earbuds in a dark room with a waveform. Weakness: the feature varies by country and the page is marketing; a diplomatic framing is needed (rules-tech.md).

**[STALE] T27-5 why you must touch the pay terminal (NFC range)**
- Hook: "Tap to pay is not wireless. It is 4 centimetres." Tension: the "wireless" you have to touch.
- Learn: NFC needs about 4 cm or less, which is why a case or a wallet in between can stop it.
- Fact 1: "NFC is a set of short-range wireless technologies, typically requiring a distance of 4 cm or less to initiate a connection". https://developer.android.com/develop/connectivity/nfc
- Fact 2: NFC lets you share small payloads of data between a tag and a device, or between two devices (same page). Thin; add a second primary source (an Apple or terminal maker page) before building.
- Fit: a phone and a card terminal with a 4 cm ruler of light. Weakness: showreel-tech-applepay-number covers tap to pay, so it is close to a repeat.

## Picks in one line each
| Day | Channel | Pick 1 | Pick 2 |
|---|---|---|---|
| 25 Nov | web | W25-1 field-sizing: one visible bug, one line, a counter that goes to 0 | W25-2 :user-invalid: the form is red in frame 0 |
| 26 Nov | web | W26-1 :has: a myth that changed, a big visible result | W26-2 will-change: a tip that backfires |
| 27 Nov | web | W27-1 animation-timeline: great motion, all engines | W27-2 inert: a bug behind the popup (weaker on a phone) |
| 26 Nov | tech | STALE: T26-1 battery cycles: a number that doubled, fits the x-ray phone | T26-2 Wi-Fi ranging: new to the channel, 3D rings |
| 27 Nov | tech | T27-1 Lockdown Mode: surprise with a purpose, safe | T27-2 LE Audio codec: a real change on screen, re-word the hook |

## Open checks before a build (do these the morning of the build, they take a minute)
- Re-read the two URLs of the picked option; if a line changed, use the new wording.
- Web W26-3 (popover) and W27-2 (inert): re-read the support row in browser-compat-data before using.
- Tech T27-4 and T27-3 depend on pages that change with each new model; read the footnotes the same morning.
