# Topic bank v2, web 25-30 Nov and tech 26-30 Nov 2026 (researched 24-25 Nov night; replaces v1, keeps v1's good options)

How to use: the builder picks ONE option per channel and day (the two marked PICK are the recommendation), copies its facts into the reel
config, and re-reads the two URLs the morning of the build (a changed line means the new wording). Nothing here repeats captions.json or
topics.md. Turns Out is not in this file (fixed design order). Tech 25 Nov is built (storage-gap), so the tech list starts on 26 Nov.
Gold look (design/gold.md): web = black look, one still phone or card, hook top-left with one accent word, a number meter that steps on each
event, red for the bug and mint for the fix, no frame or glow. Tech = dark room, one lit hero object, a new world every 3-5 s, one huge
number that changes when the voice says it, amber for the problem and cyan for the payoff. Every option names a prop taken from the idea.
Web leans to what won on 23 Nov (owner-feedback): a visible bug in frame 0 that is counted (wiggle, jump, overlap), so those are marked.

## How the facts were checked (24-25 Nov, curl through the environment proxy, text read on the page)
- Web: MDN pages (developer.mozilla.org) read on the page; browser support from MDN's browser-compat-data (BCD, raw files on
  github.com/mdn/browser-compat-data), web.dev (bfcache, LCP), and the W3C WCAG 2.2 text (www.w3.org/TR/WCAG22). caniuse.com opens but was not
  needed. "RE-READ" at the end of a line means the quote or the support row was not read on 24-25 Nov: read it the morning of the build.
- Tech: pages that opened and were read: apple.com and support.apple.com, developer.android.com, usb.org, wi-fi.org, bluetooth.com,
  semiconductor.samsung.com, www.mi.com/in, www.vivo.com/in, nvidia.com, amd.com. Did NOT open (403, empty or no host): jedec.org (403),
  intel.com (403), qualcomm.com (empty page), sony.net and oneplus.com (no reply), samsung.com/in spec pages (no spec text). So there is no
  JEDEC topic, no Qualcomm, Intel, Sony or OnePlus option, and no option leans on a page that was not read. Samsung options use the
  semiconductor site, the maker's own chip pages.
- Brand pages are marketing: say "the maker says" and keep "up to" and "in the maker's lab" on screen where the page has them (rules-tech.md).

## TECH balance (26-30 Nov, 10 options a day = 50)
Makers and bodies in the week: Apple, Google (Android), Samsung (chips), Xiaomi, vivo, NVIDIA, AMD, USB-IF, Wi-Fi Alliance, Bluetooth SIG = 10.
Apple: 6 of 50 (12%). No maker more than twice in one day. India angle marked IN. Standards bodies: USB-IF 4, Wi-Fi Alliance 8,
Bluetooth SIG 5 options (17 of 50). Per day (A Apple, G Google, S Samsung, X Xiaomi, V vivo, N NVIDIA, M AMD, U USB-IF, W Wi-Fi Alliance, B Bluetooth SIG):
26 = A1 G2 U1 W2 S1 V1 N1 M1 · 27 = A2 B1 S1 X1 W1 G1 U1 N1 V1 · 28 = G2 W1 S1 B1 M1 U1 X1 A1 N1 · 29 = G1 W2 S1 A1 M1 X1 B2 U1 · 30 = W2 S1 N1 M1 B1 G2 X1 A1.
Near a posted reel (say how this one differs on screen): T26-4, T27-7, T28-7 (usbc-two-numbers), T29-5 (phone-claim format),
T30-10 (ip68), T28-2 (applepay-number), T27-10 (cold-shutdown), T28-8 (heat-battery).

## WEB (25-30 Nov, 10 options a day = 60; 15 are v1 options kept)

### Tue 25 Nov
**W25-1 PICK: your text box grows by itself (field-sizing)** [CSS, v1]
- Hook: "You wrote JavaScript to grow this textarea. CSS does it in one line." Tension: a myth that auto-grow needs `scrollHeight` code.
- Learn: `textarea { field-sizing: content; }` makes a textarea grow with its text, and a max-height then adds the scrollbar.
- Fact 1: field-sizing lets form controls "adjust in size to fit their contents"; a textarea with it grows in height, and once a height limit is reached it scrolls. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/field-sizing
- Fact 2: support (BCD): Chrome 123, Firefox 152, Safari 26.2 (same page, "Browser compatibility").
- Fit: tabwiggle's counter-on-a-phone grammar: a chat box on the one big phone, a LINES meter that steps as each line is typed. Not a copy: the subject is a growing box, not a shifting bar.
- Prop: the JS lines (`el.style.height = el.scrollHeight + 'px'`) on a code card, struck out one by one as the box grows on its own.
- Why pick: the bug (a clipped message) is visible in frame 0, the fix is one line, and the number is a count of JS lines in OUR code card (count when building).

**W25-2 PICK: this form is red before you type a letter (:user-invalid)** [a11y / forms, v1]
- Hook: "This form is red before you type anything." Tension: `:invalid` fires on an empty required field at page load.
- Learn: style `:user-invalid`, not `:invalid`; the error shows only after the person has interacted.
- Fact 1: `:user-invalid` matches an invalid control "after the user has interacted with it". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:user-invalid
- Fact 2: support (BCD): Chrome 119, Firefox 88, Safari 16.5.
- Fit: black look, the form card is the hero, a RED FIELDS counter reads 3 at load and 0 after the fix, mint on the fixed state. Not showreel-38 (that was the error line moving).
- Prop: three input boxes lit red like warning lamps before the first tap; they go dark until the finger leaves a field.
- Why pick: best "bug in frame 0" of the day, and a number that changes (3 red to 0).

**W25-3: wrapping that ends with one lonely word (text-wrap: pretty)** [typography, v1]
- Hook: "Why does the last line hold one word?" Tension: the orphan is not your copy, it is how lines wrap (`balance` was posted; `pretty` is the body-text one).
- Learn: `p { text-wrap: pretty; }` avoids a short last line in body copy; `balance` is for headings.
- Fact 1: `pretty` "favors better layout over speed", for body copy where orphans should be kept to a minimum. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-wrap-style
- Fact 2: support of the value `pretty` (BCD css.properties.text-wrap-style.pretty): Chrome 130, Safari 26, Firefox not yet; say "not in Firefox" on screen.
- Fit: one paragraph card, the orphan word circled in red then pulled up. Prop: a single word hanging off the end of a paragraph like a dropped thread.
- Weakness: Firefox gap, subtle at phone size.

**W25-4: your hero image waits in line (loading="lazy" on the first image)** [performance, v1, web.dev added]
- Hook: "You made your page faster. This one attribute made it slower." Tension: lazy loading on the top image delays it.
- Learn: never lazy-load the first-screen image; give the main image `fetchpriority="high"`.
- Fact 1: web.dev: "Never lazy-load your LCP image", because lazy loading means the image is not loaded until after layout confirms it is in the viewport. https://web.dev/articles/optimize-lcp
- Fact 2: the same page preloads the LCP image with `fetchpriority="high"` so it starts loading with the stylesheet. Support (BCD): `loading` Chrome 77 / Firefox 75 / Safari 15.4; `fetchpriority` Chrome 101 / Firefox 132 / Safari 17.2.
- Fit: a phone where the hero photo arrives late, a seconds meter that steps (no bar chart: gold bans bars). Prop: a queue at a door, the hero last in line.
- Weakness: a delay number needs a real measure; do not make one up.

**W25-5: the carousel flies past photos (scroll-snap-stop: always)** [motion / layout, v1]
- Hook: "One flick, five photos skipped." Tension: snap points exist and a fast swipe still skips them (follow-up to showreel-33-carousel).
- Learn: `scroll-snap-stop: always` on each photo makes a swipe stop at every one.
- Fact 1: `scroll-snap-stop` defines whether the scroll container may "pass over" possible snap positions. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-snap-stop
- Fact 2: support (BCD): Chrome 75, Firefox 103, Safari 15.
- Fit: one phone, a PHOTOS SEEN meter. Weakness: close to showreel-33, use last.

**W25-6: your page spins and some people feel sick (prefers-reduced-motion)** [accessibility / motion]
- Hook: "This animation makes some people dizzy. One setting turns it off." Tension: a spinning hero looks great and hurts a group of users.
- Learn: put big motion inside `@media (prefers-reduced-motion: no-preference)`, or tone it down inside `reduce`.
- Fact 1: the media feature "is used to detect if a user has enabled a setting on their device to minimize the amount of non-essential motion"; the MDN page itself warns readers with vestibular motion disorders. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- Fact 2: WCAG 2.2 SC 2.3.3 (Level AAA): "Motion animation triggered by interaction can be disabled, unless the animation is essential". https://www.w3.org/TR/WCAG22/#animation-from-interactions . Support (BCD css.at-rules.media.prefers-reduced-motion): Chrome 74, Firefox 63, Safari 10.1.
- Fit: black look, one card with a big swinging motion; a MOTION meter reads FULL then 0 with the setting on. Not a repeat: showreel-17-smooth mentions the media query only as a side line.
- Prop: a carousel horse that stops mid-spin when the setting flips. Weakness: the "dizzy" feeling cannot be shown, only the switch.

**W25-7: one card, three places, three layouts (container queries)** [layout]
- Hook: "This card knows how wide its box is, not how wide the screen is." Tension: the same card breaks in a sidebar because media queries read the screen.
- Learn: `.wrap { container-type: inline-size }` then `@container (min-width: 400px) { ... }`.
- Fact 1: container queries "apply styles to an element based on certain attributes of its container"; they are an alternative to media queries, which use viewport size. https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries
- Fact 2: support (BCD css.at-rules.container): Chrome 105, Firefox 110, Safari 16.
- Fit: the same product card dragged between a narrow and a wide box, a WIDTH meter in px that steps and flips the layout. Prop: a suitcase repacked to fit three shelves.

**W25-8: dark mode in one function (light-dark())** [CSS]
- Hook: "Your dark mode is two sets of colours. It can be one line." Tension: duplicate colour rules for every theme.
- Learn: `color: light-dark(#111, #eee)` picks the colour for the active scheme (set `color-scheme: light dark`).
- Fact 1: `light-dark()` "accepts two colors or two images and returns a color or an image based on the active color scheme, without needing a prefers-color-scheme media feature". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark
- Fact 2: support (BCD css.types.color.light-dark): Chrome 123, Firefox 120, Safari 17.5.
- Fit: one card flips between light and dark; a COLOUR RULES counter goes 2 to 1 (count in OUR demo). Not showreel-44-darkflash (that was the white blink before CSS). Prop: a lamp with one dimmer instead of two bulbs.

**W25-9: button text sits too low (text-box-trim)** [typography]
- Hook: "Your button label is 3 px too low. The padding is fine." Tension: the font's own line space sits above and below the letters.
- Learn: `text-box-trim` removes the extra space above and below the text so padding is the real padding.
- Fact 1: `text-box-trim` "specifies which of the over and under edges of text content to trim from a text element's block container". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-box-trim
- Fact 2: support (BCD): Chrome 133, Firefox 154, Safari 18.2.
- Fit: a big button with red guide lines, the label slides up to true centre, mint after. Weakness: owner-feedback 21 Nov (optical-centre): a faint illusion fails at phone size, so make the button huge and show the guide lines.
- Prop: a tall line of type with its empty "air" shown as a stack of invisible boxes.

**W25-10: your script is why the page is blank (defer)** [performance]
- Hook: "Your page is blank until a script downloads." Tension: a script in the head blocks parsing.
- Learn: add `defer` to scripts that need the page; `async` for ones that do not.
- Fact 1: MDN `<script>`: with `async` a classic script "will be fetched in parallel to parsing and evaluated as soon as it is available". https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script
- Fact 2: support (BCD): `async` Chrome 1, Firefox 3.6; `defer` Chrome 1, Firefox 3.5, Safari 3. RE-READ the `defer` paragraph (only the async line was quoted).
- Fit: a phone showing a white page, a SECONDS BLANK meter (use our own demo timing, flagged as a demo). Weakness: old, widely known; low rank.

### Wed 26 Nov
**W26-1 PICK: CSS can select a parent (:has)** [CSS, v1]
- Hook: "CSS can't select a parent. It can." Tension: a 20-year-old rule that stopped being true.
- Learn: `.card:has(input:checked) { ... }` styles the card when its checkbox is on, no JS class toggling.
- Fact 1: `:has()` "represents an element if any of the relative selectors ... match", a way of selecting a parent. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has
- Fact 2: support (BCD): Chrome 105, Firefox 121, Safari 15.4.
- Fit: option cards (plans, toppings) as the hero; ticking the box lights the whole card mint; a JS-lines counter drops to 0. Prop: a family tree where the child is tapped and the parent lights.
- Why pick: strongest "myth that changed", big visible result, one line of code.

**W26-2 PICK: will-change makes it faster (it does not)** [performance, v1]
- Hook: "This one line makes every animation faster. Everyone believes it." Tension: MDN says the opposite for the common use.
- Learn: do not put `will-change` in the stylesheet "just in case"; use it as a last resort for a measured problem and remove it after.
- Fact 1: "Use the will-change property as a last resort ... Don't use it to anticipate performance problems." https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change
- Fact 2: in a stylesheet it keeps the browser's optimizations "for a much longer time"; excessive use "will result in excessive" memory use (same page, "Usage notes").
- Fit: a phone with ten cards, each with a weight tag that grows as `will-change` is added; no MB number unless measured. Prop: a backpack heavier with each "just in case" item.
- Why pick: a tip that backfires, and the fix is to delete a line.

**W26-3: a menu with no JavaScript (popover)** [a11y / layout, v1]
- Hook: "This menu closes when you tap outside. There is no JavaScript." Tension: light dismiss and Esc are free.
- Learn: `<button popovertarget="m">` and `<div popover id="m">`: open, outside tap and Esc all work.
- Fact 1: `auto` popovers can be "light dismissed" by clicking outside, opening another popover, or Esc. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover
- Fact 2: support (BCD html.global_attributes.popover, read 24 Nov): Chrome 114, Firefox 125, Safari 17.
- Fit: one phone, a TAP-OUTSIDE meter. Prop: a paper menu card that lifts away when you tap the table.

**W26-4: the tap ring that nobody wants (:focus-visible)** [accessibility, v1]
- Hook: "Delete the focus ring and you lock out half your users." Tension: the common `outline: none` fix.
- Learn: `:focus-visible` shows the ring for keyboard use and hides it for taps.
- Fact 1: the pseudo-class applies while an element matches `:focus` and the browser decides focus should be made evident (many browsers show a ring then). https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible
- Fact 2: support (BCD): Chrome 86, Firefox 85, Safari 15.4.
- Fit: black look. Weakness: a phone has no keyboard, so the bug is faint (owner-feedback 21 Nov). Lowest rank.

**W26-5: one line recolours every checkbox (accent-color)** [CSS, v1]
- Hook: "These checkboxes are native. Why are they purple?" Tension: you do not need a custom checkbox.
- Learn: `accent-color: #5fe3c0` on a form or `:root`.
- Fact 1: `accent-color` "sets the accent color for user-interface controls generated by some elements". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/accent-color
- Fact 2: support (BCD): Chrome 93, Firefox 92, Safari 26.2 for the property in this record (two rows; re-read before use).
- Fit: a settings list with toggles turning mint. Weakness: pretty, little tension.

**W26-6: three cards, buttons at three heights (subgrid)** [layout]
- Hook: "Same row of cards. The buttons don't line up." Tension: card text lengths differ, so every button sits at a different height.
- Learn: `.card { display: grid; grid-template-rows: subgrid; grid-row: span 3 }` makes the title, text and button rows line up across cards.
- Fact 1: the grid module "includes a subgrid value for grid-template-columns and grid-template-rows". https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid
- Fact 2: support (BCD css.properties.grid-template-columns.subgrid): Chrome 117, Firefox 71, Safari 16.
- Fit: three cards, a BUTTON OFFSET meter in px (counted from OUR demo), red offsets then mint aligned. Prop: three shelves with price tags at three heights.

**W26-7: you added !important and it still lost (@layer)** [CSS]
- Hook: "Your rule has !important. It still loses." Tension: a rule from a library wins no matter what you write.
- Learn: put your styles in a later `@layer`; layer order beats specificity, so you stop fighting selectors.
- Fact 1: once the layer order is set, "specificity and order of appearance are ignored" between layers; a rule in a later layer wins even if its selector is weaker. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer
- Fact 2: support (BCD): Chrome 99, Firefox 97, Safari 15.4.
- Fit: an !IMPORTANT counter that climbs (red) then falls to 0 (mint). Prop: lanes on a race track; a car in a later lane always passes. Note: `!important` inside layers reverses order, read the page first.

**W26-8: your Back button reloads the whole page (bfcache)** [performance]
- Hook: "Tap Back and the page reloads. It could be instant." Tension: one old habit stops the browser keeping the page.
- Learn: never use the `unload` event; use `pagehide`.
- Fact 1: web.dev: "The most important way to optimize for bfcache in all browsers is to never use the unload event." https://web.dev/articles/bfcache
- Fact 2: the same page defines bfcache as "a browser optimization that enables instant back and forward navigation", and says `pagehide` fires when a page unloads or when the browser tries to put it in the bfcache.
- Fit: a phone, a product list, Back flashes a spinner (red) then returns at once (mint); a LOAD COUNT meter 2 to 0 from our demo. Prop: a book kept open on the desk instead of shelved.

**W26-9: an element can't fade out and leave (transition-behavior)** [motion]
- Hook: "You can fade it in. You can't fade it out. Now you can." Tension: `display: none` snaps, so a toast vanishes with no animation.
- Learn: `transition: opacity .3s, display .3s; transition-behavior: allow-discrete;` makes the exit animate before the element leaves layout.
- Fact 1: `transition-behavior` "specifies whether transitions will be started for properties whose animation behavior is discrete"; `allow-discrete` starts them. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition-behavior
- Fact 2: support (BCD): Chrome 117, Firefox 129, Safari 17.4.
- Fit: a toast that pops away (red POP count 1) then fades (0). Not showreel-32 (that was the enter side with @starting-style). Prop: a ghost that fades before it leaves the room.

**W26-10: underlines that cut through the letters (text-decoration-skip-ink)** [typography]
- Hook: "The line runs through the g and the y. It doesn't have to." Tension: default underlines already skip descenders, and `none` turns it off.
- Learn: leave `text-decoration-skip-ink: auto` (the default) and add `text-underline-offset` for room.
- Fact 1: it "specifies how overlines and underlines are drawn when they pass over glyph ascenders and descenders". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration-skip-ink
- Fact 2: support (BCD): Chrome 64, Firefox 70, Safari 15.4. Weakness: tiny effect, lowest rank.

### Thu 27 Nov
**W27-1 PICK: a scroll progress bar with no JavaScript (animation-timeline: scroll())** [motion, v1]
- Hook: "This progress bar has no scroll listener." Tension: the bar follows the page, and no code runs on scroll.
- Learn: `animation-timeline: scroll()` ties a CSS animation to the scroll position instead of to time.
- Fact 1: `animation-timeline` sets the timeline that controls a CSS animation; `scroll()` is an anonymous scroll-progress timeline. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline
- Fact 2: support (BCD): Chrome 115, Firefox 159, Safari 26.
- Fit: one phone, a long article scrolling, the bar on top filling mint; a SCROLL EVENTS counter stays 0. Prop: a thermometer along the screen edge.
- Why pick: great motion, a real number (0 listeners), all three engines.

**W27-2 PICK: the page behind the popup still takes taps (inert)** [accessibility, v1]
- Hook: "The popup is open. You can still tab into the page behind it." Tension: showreel-13-popup fixed the scroll, not the focus.
- Learn: `<main inert>` while the popup is open: nothing behind can be focused or clicked.
- Fact 1: `inert` makes an element and its descendants non-focusable and non-clickable. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert
- Fact 2: support (BCD html.global_attributes.inert, read 24 Nov): Chrome 102, Firefox 112, Safari 15.5.
- Fit: a phone with a popup and a focus dot that jumps behind it. Weakness: faint on a phone; second pick only.

**W27-3: text breaks in half in one browser only (hyphens: auto and lang)** [typography, v1]
- Hook: "Why does your text break words in half in one browser and not another?" Tension: `hyphens: auto` does nothing without `lang`.
- Learn: add `lang="en"` (or `hi`) to `<html>` and `hyphens: auto` on the text.
- Fact 1: "Browsers will only hyphenate if [the lang] attribute is present and the appropriate hyphenation dictionary is available." https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/hyphens
- Fact 2: support (BCD): `hyphens` Chrome 55, Firefox 43, Safari 17; per-language dictionaries differ (v1 read Hindi as Chrome only; RE-READ the language rows). India angle: Hindi.
- Fit: a narrow card with a long word. Weakness: showreel-23-sideways covers long words.

**W27-4: a long page that opens like a short one (content-visibility: auto)** [performance, v1]
- Hook: "Your long page is slow to open. One line skips the part you cannot see." Tension: the browser lays out everything, even below the screen.
- Learn: `section { content-visibility: auto; contain-intrinsic-size: auto 500px; }`.
- Fact 1: `content-visibility` lets the browser skip rendering work for off-screen elements until needed. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility
- Fact 2: support (BCD): Chrome 85, Firefox 125, Safari 18. MDN pairs it with `contain-intrinsic-size` so the scrollbar does not jump.
- Fit: a long feed with a RENDERED meter that counts boxes on screen (not ms).

**W27-5: animate a menu to height: auto (interpolate-size)** [motion, v1]
- Hook: "You can't animate to height: auto. Until now." Tension: a 15-year-old impossibility.
- Learn: `:root { interpolate-size: allow-keywords; }` then `transition: height .3s`.
- Fact 1: `allow-keywords` enables interpolation between a length and an intrinsic size such as `auto`. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interpolate-size
- Fact 2: support (BCD): Chrome 129 only; Firefox no; Safari "preview". The reel must say "Chrome". Lowest rank for a mixed audience.

**W27-6: one brand colour, every shade (color-mix)** [CSS]
- Hook: "Your hover, pressed and disabled colours are three more hex codes to keep." Tension: a design change means editing every shade.
- Learn: `background: color-mix(in oklch, var(--brand), black 20%)` builds shades from one variable.
- Fact 1: `color-mix()` "takes one or more <color> values and returns the result of mixing them in a given colorspace by a given amount". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color-mix
- Fact 2: support (BCD css.types.color.color-mix): Chrome 111, Firefox 113, Safari 16.2.
- Fit: a button row (rest, hover, pressed, disabled); a COLOURS TO EDIT counter 4 to 1. Not showreel-41-gradient (blend of two colours in a gradient). Prop: a paint tray with one tube and a dial.

**W27-7: your Hindi page downloads a font it never uses (unicode-range)** [typography / performance, IN]
- Hook: "This page is in English. It still downloads the Hindi font." Tension: one big font file for every visitor.
- Learn: give the Devanagari font its own `@font-face` with `unicode-range: U+0900-097F`; it is fetched only when a Hindi letter is on the page.
- Fact 1: "If the page doesn't use any character in this range, the font is not downloaded; if it uses at least one, the whole font is downloaded." https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/unicode-range
- Fact 2: support (BCD css.at-rules.font-face.unicode-range): Chrome 1, Firefox 36, Safari 3.1. (The U+0900-097F Devanagari block comes from the Unicode chart, RE-READ before building.)
- Fit: two font cards and a FILES DOWNLOADED meter 2 to 1 (count files in OUR demo, no KB unless measured). Prop: a suitcase with a Hindi dress that stays at home on an English trip.

**W27-8: your sign-up form makes people type their own name (autocomplete)** [accessibility / forms]
- Hook: "Your form asks for a name the phone already knows." Tension: one missing attribute turns off autofill.
- Learn: `autocomplete="name"`, `"email"`, `"tel"` and `"one-time-code"` on the right fields.
- Fact 1: the attribute "lets web developers specify what if any permission the user agent has to provide automated assistance in filling out form field values" and what type of information is expected. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
- Fact 2: WCAG 2.2 has SC 1.3.5 Identify Input Purpose (listed in the W3C text, RE-READ the wording). https://www.w3.org/TR/WCAG22/#identify-input-purpose
- Fit: a form that fills itself with a TAPS TO FINISH meter 12 to 2. Not showreel-27-keyboard (that was the number pad, `inputmode`). Weakness: autofill cannot be shown honestly in a code-drawn phone, so show it as the keyboard's suggestion bar.

**W27-9: an accordion that closes the others by itself (details name)** [HTML / accessibility]
- Hook: "Open one question, the others close. There is no JavaScript." Tension: every FAQ page ships a script for this.
- Learn: give the `<details>` elements the same `name` attribute.
- Fact 1: `name` "enables multiple <details> elements to be connected, with only one open at a time ... accordions without scripting". https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
- Fact 2: support (BCD html.elements.details.name): Chrome 120, Firefox 130, Safari 17.2.
- Fit: a phone FAQ with an OPEN counter that never goes above 1, a JS-lines counter at 0. Different from showreel-35-list (collapse on delete). Prop: a row of drawers that push each other shut.

**W27-10: tooltips are not hard any more (anchor positioning)** [layout]
- Hook: "A tooltip that follows its button and flips at the screen edge. Zero JavaScript." Tension: tooltip libraries exist because this was impossible.
- Learn: `anchor-name` on the button, `position-anchor` and `position-area: top` on the tooltip.
- Fact 1: the anchor positioning module defines "features that allow you to tether elements together". https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning
- Fact 2: support (BCD css.properties.position-area): Chrome 129, Firefox 147, Safari 26.
- Fit: a list scrolls and the tooltip stays tied to its button; a JS-LINES meter 0. Prop: a balloon on a string held by the button.

### Fri 28 Nov
**W28-1: fluid text with no breakpoints (clamp)** [typography]
- Hook: "Your heading has 4 font sizes. It needs 1 line." Tension: a media query for every width.
- Learn: `font-size: clamp(1.5rem, 4vw + 1rem, 3rem)`; test zoom, since a pure `vw` size ignores the user's text size.
- Fact 1: `clamp()` "clamps a value within a range of values between a defined minimum bound and a maximum bound", with a minimum, a preferred and a maximum value. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp
- Fact 2: support (BCD css.types.clamp): Chrome 79, Firefox 75, Safari 13.1. The MDN page has an Accessibility section on zoom: read it first.
- Fit: a heading that stretches as the phone frame widens; a SIZE meter in px steps. Prop: a spring with a stop at each end.

**W28-2: your button style loses to a random rule (:where)** [CSS]
- Hook: "Your .button style lost to a rule you never wrote." Tension: specificity you cannot see.
- Learn: wrap reset or library selectors in `:where(...)`; they get zero specificity, so any later rule wins.
- Fact 1: "`:where()` always has 0 specificity, whereas `:is()` takes on the specificity of the most specific selector in its arguments." https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:where
- Fact 2: support (BCD): Chrome 88, Firefox 78, Safari 14.
- Fit: a SPECIFICITY score on the button (e.g. 0,2,1) vs the rule that beats it, dropping to 0,0,0. Prop: a weight scale. Near W26-7 (@layer): do not build both in one week.

**W28-3: this phone is downloading the desktop image (srcset and sizes)** [performance]
- Hook: "A 390 px phone is loading a 2400 px photo." Tension: one `src` serves every screen.
- Learn: `srcset="a-800.jpg 800w, a-1600.jpg 1600w" sizes="100vw"`; the browser picks the file.
- Fact 1: MDN `<img>`: the spec requires `sizes` to be present only when `srcset` uses width descriptors. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img
- Fact 2: support (BCD): `srcset` Chrome 34, Firefox 38, Safari 8; `sizes` Chrome 38, Firefox 38, Safari 9.1. No KB numbers unless measured in the build.
- Fit: a phone and two image files as cards; a PIXELS DOWNLOADED counter from our demo sizes (arithmetic from stated sizes). Prop: a truck delivering a sofa to a doll's house.

**W28-4 PICK: this page can't be pinch-zoomed (user-scalable=no)** [accessibility]
- Hook: "You can't pinch-zoom this page. That's the bug." Tension: a viewport tag copied from old templates locks zoom for everyone.
- Learn: remove `user-scalable=no` and `maximum-scale=1` from the viewport meta tag.
- Fact 1: MDN `<meta name="viewport">`: `maximum-scale` "Browser settings can ignore this rule, and iOS10+ ignores it by default" (so the lock fails on some phones and works on others). https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport
- Fact 2: WCAG 2.2 SC 1.4.4 Resize Text: "text can be resized without assistive technology up to 200 percent without loss of content or functionality". https://www.w3.org/TR/WCAG22/#resize-text
- Fit: two fingers spread on the phone, the text does not grow (red), a ZOOM meter stuck at 100%, then 200% (mint). Bug visible in frame 0, counted. Prop: a glass case over a book.
- Why pick: a phone-edge bug like the homebar reel, visible and counted.

**W28-5 PICK: your photo is squashed (object-fit)** [layout]
- Hook: "Why is everyone's face stretched in this profile circle?" Tension: width and height were set, so the image was forced into the box.
- Learn: `img { width: 100%; height: 100%; object-fit: cover; }`.
- Fact 1: `object-fit` "sets how the content of a replaced element, such as an <img> or <video>, should be resized to fit its container". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit
- Fact 2: support (BCD): Chrome 32, Firefox 36, Safari 10.
- Fit: a wide photo squeezed into a square avatar; an ASPECT meter reads 1.78 : 1 squeezed to 1 : 1 (red), then correct (mint) (numbers are our demo's sizes). Strong "bug in frame 0".
- Prop: a face in a funhouse mirror; the fix lifts the mirror away.

**W28-6: your hover animation breaks your other transform (translate)** [motion]
- Hook: "One animation cancelled the other. They both use transform." Tension: the second `transform` overwrites the first.
- Learn: animate `translate`, `rotate` and `scale` as separate properties; keyframes then stop overwriting each other.
- Fact 1: `translate` "allows you to specify translation transforms individually and independently of the transform property". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/translate
- Fact 2: support (BCD): Chrome 104, Firefox 72, Safari 14.1.
- Fit: a card that should float and spin; with one transform only one works (red); both work (mint); a MOTIONS WORKING meter 1 to 2. Not showreel-15-transform (check that reel's topic first).

**W28-7: your page jumps when something loads above (overflow-anchor)** [layout, low]
- Hook: "You were reading line 4. An image loaded. Now it's line 1." Tension: scroll anchoring protects you, until a rule turns it off.
- Learn: browsers anchor the scroll position by default; `overflow-anchor: none` turns that off (use it only for a real problem).
- Fact 1: `overflow-anchor` "provides a way to opt out of the browser's scroll anchoring behavior, which adjusts scroll position to minimize content shifts". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-anchor
- Fact 2: support (BCD): Chrome 56, Firefox 66, Safari 27 only, so most iPhones lack it. Lowest rank for a mixed audience.

**W28-8: a popup that really blocks the page (dialog + showModal)** [accessibility]
- Hook: "This popup is a div. The real one is a tag." Tension: custom popups skip focus handling, Esc and the backdrop.
- Learn: `<dialog>` with `showModal()`: Esc closes it, the page behind goes inert, there is a `::backdrop`.
- Fact 1: "Modal dialog boxes block interaction with other UI elements, making the rest of the page inert, while non-modal dialog boxes allow interaction with the rest of the page." https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
- Fact 2: support (BCD html.elements.dialog.showModal): Chrome 37, Firefox 98, Safari 15.4. Close to W27-2 (inert) and showreel-13-popup: use one of them only.

**W28-9: cards with different image heights (aspect-ratio)** [layout]
- Hook: "Six cards, six different heights. The images are the reason." Tension: each photo has its own shape, so the grid is ragged.
- Learn: `img { aspect-ratio: 4 / 3; object-fit: cover; }`.
- Fact 1: `aspect-ratio` "allows you to define the desired width-to-height ratio of an element's box". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/aspect-ratio
- Fact 2: support (BCD): Chrome 88, Firefox 89, Safari 15.
- Fit: a card grid with a HEIGHT SPREAD in px (our demo) going to 0. Near showreel-05-layout-shift (images that push the page): say "heights", not "shift".

**W28-10: highlight the whole search bar when you type (:focus-within)** [CSS / accessibility]
- Hook: "The input has focus. The box around it doesn't know." Tension: only the inner field lights.
- Learn: `.search:focus-within { outline: 2px solid var(--mint); }`.
- Fact 1: `:focus-within` "matches an element if the element or any of its descendants are focused". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-within
- Fact 2: support (BCD): Chrome 60, Firefox 52, Safari 10.1. Weakness: small effect; mid rank.

### Sat 29 Nov
**W29-1: CSS can nest, no Sass (nesting)** [CSS]
- Hook: "You installed a build tool for this one feature." Tension: nesting was why people used Sass.
- Learn: write `.card { & h2 { ... } &:hover { ... } }` in plain CSS.
- Fact 1: the module "defines a syntax for nesting selectors, providing the ability to nest one style rule inside another, with the selector of the child rule relative to the selector of the parent rule". https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting
- Fact 2: support (BCD css.selectors.nesting): Chrome 120, Firefox 117, Safari 17.2. RE-READ the line on how it differs from preprocessors (cut off in the read).
- Fit: a code card that shrinks as selectors fold into one block; a REPEATED SELECTORS counter drops to 1.

**W29-2: flip the language and the layout breaks (logical properties)** [layout, IN]
- Hook: "Switch this page to Urdu. Every margin lands on the wrong side." Tension: `margin-left` is a physical direction, not a reading direction.
- Learn: use `margin-inline-start`, `padding-inline`, `inset-inline-end` instead of left and right.
- Fact 1: logical properties "define direction-relative equivalents to their physical" counterparts. https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values
- Fact 2: support (BCD css.properties.margin-inline): Chrome 87, Firefox 66, Safari 14.1.
- Fit: a chat card flips between LTR and RTL; a MISPLACED ELEMENTS meter 4 to 0. India angle: Urdu and other right-to-left scripts. Prop: a tray of cutlery that mirrors.

**W29-3 PICK: a line of text 150 characters long (ch and max-width)** [typography]
- Hook: "Nobody finishes a line this long." Tension: wide screens make lines longer than the eye can follow.
- Learn: `p { max-width: 65ch; }` caps the line near a readable length (the 65 is a common design guide, not an MDN number: state it as advice).
- Fact 1: `ch` "represents the width, or more precisely the advance measure, of the glyph 0 (zero) in the element's font". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length
- Fact 2: support (BCD css.types.length.ch): Chrome 27, Firefox 1, Safari 7. Close to c3 line-length (a design reel): the web reel must show the CSS.
- Fit: a paragraph on a wide card with a CHARACTERS PER LINE counter 150 to 65 (counted in our demo). Prop: a tape measure along a text line.

**W29-4 PICK: ₹1,00,000 or ₹100,000? (Intl.NumberFormat en-IN)** [i18n, IN]
- Hook: "Your price says 100,000. India writes 1,00,000." Tension: the grouping you hard-coded is wrong for a billion people.
- Learn: `new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(100000)` formats it the local way.
- Fact 1: MDN's example: `new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(123456.789)` gives "1,23,000". https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
- Fact 2: "The Intl.NumberFormat object enables language-sensitive number formatting"; support (BCD): Chrome 24, Firefox 29, Safari 10.
- Fit: a price tag with the number grouped two ways; a COMMAS meter; red wrong, mint right. Prop: a cash counter that groups notes in the local stacks. Strong India hook.
- Why pick: India angle, visible bug in frame 0, one line to fix.

**W29-5: your Hindi page never says it is Hindi (lang)** [accessibility]
- Hook: "Your page is Hindi. The browser thinks it's English." Tension: no `lang`, no right hyphens, no right voice for readers.
- Learn: `<html lang="hi">`, and `lang="en"` on English quotes inside.
- Fact 1: `lang` "helps define the language of an element" using a BCP 47 language tag. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang
- Fact 2: WCAG 2.2 SC 3.1.1 Language of Page (listed in the W3C text, RE-READ the wording). https://www.w3.org/TR/WCAG22/#language-of-page . Overlaps W27-3 (hyphens needs `lang`): use one or the other in a week.

**W29-6 PICK: find-in-page can't see inside your accordion (hidden="until-found")** [accessibility / HTML]
- Hook: "Search the page for a word that is in a closed section. It says nothing found." Tension: collapsed content hides from find.
- Learn: `<div hidden="until-found">` stays hidden but opens when the browser's find or a link jumps to a match.
- Fact 1: the `hidden` attribute takes `hidden`, `until-found` or an empty string. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden
- Fact 2: support of the `until-found` value: RE-READ in BCD html.global_attributes.hidden.until-found (the file for the value was not found on 24-25 Nov; Chromium has it, check Safari and Firefox).
- Fit: a phone FAQ, a FOUND counter 0 (red) then 1 (mint) as the match opens its section. Prop: a drawer that slides open when you call its name.

**W29-7: text that looks lighter at big sizes on purpose (font-optical-sizing)** [typography, low]
- Hook: "Big headings and small text are cut differently. The font does it for you." Tension: a variable font with an `opsz` axis, and a browser that applies it.
- Learn: leave `font-optical-sizing: auto`; do not turn it off for the sake of a lookalike.
- Fact 1: it "sets whether text rendering is optimized for viewing at different sizes". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-optical-sizing
- Fact 2: support (BCD): Chrome 79, Firefox 62, Safari 13.1. Weakness: subtle, lowest rank.

**W29-8: reveal on scroll, no IntersectionObserver (animation-range with view())** [motion]
- Hook: "These cards slide in as you scroll. The page has 0 observers." Tension: every scroll-reveal library is a script.
- Learn: `animation-timeline: view(); animation-range: entry 0% cover 40%;`.
- Fact 1: `animation-range` "is used to set the start and end of an animation's attachment range along its timeline". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-range
- Fact 2: support (BCD): Chrome 115, Firefox 159, Safari 26. Same family as W27-1 (scroll()): do not build both the same week.
- Fit: a feed of cards that slide in; an OBSERVERS meter 0. Prop: stage curtains opening as the viewer scrolls.

**W29-9: a scroll handler that makes the page feel stuck (passive listeners)** [performance]
- Hook: "This page waits for your code before it scrolls." Tension: a touch handler might call `preventDefault()`, so the browser waits.
- Learn: `addEventListener("touchstart", fn, { passive: true })` tells the browser it can scroll at once.
- Fact 1: `passive` "indicates that the function specified by listener will never call preventDefault()"; if it does, "nothing will happen and a console warning may be generated". https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- Fact 2: support (BCD api.EventTarget.addEventListener, option row): RE-READ the passive row. Weakness: a feeling, not a visible bug; needs a measured delay.

**W29-10: the typing cursor is invisible on dark (caret-color)** [CSS, low]
- Hook: "Your cursor is there. You just can't see it." Tension: a dark input with a dark caret.
- Learn: `caret-color: var(--mint)`.
- Fact 1: `caret-color` "sets the color of the insertion caret, sometimes referred to as the text input cursor". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/caret-color
- Fact 2: support (BCD): Chrome 57, Firefox 53, Safari 11.1. Weakness: tiny teach; lowest rank.

### Sun 30 Nov
**W30-1: your selector reaches the wrong card (@scope)** [CSS]
- Hook: "You styled the card's title. It changed three other pages' titles." Tension: global selectors leak.
- Learn: `@scope (.card) { h2 { ... } }` limits the rule to one subtree without a long selector.
- Fact 1: `@scope` "enables you to select elements in specific DOM subtrees, targeting elements precisely without writing overly-specific selectors". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@scope
- Fact 2: support (BCD): Chrome 118, Firefox 146, Safari 26.4 (new in Safari: say so on screen).
- Fit: a LEAKED ELEMENTS counter 3 to 0. Close to W26-7 and W28-2: pick one of the three in a week.

**W30-2: your icons vanish in high-contrast mode (forced-colors)** [accessibility]
- Hook: "In Windows high contrast mode this button has no border." Tension: colours you set are overridden.
- Learn: use `@media (forced-colors: active)` and system colours like `ButtonText` for borders and icons.
- Fact 1: `forced-colors` "is used to detect if the user agent has enabled a forced colors mode where it enforces a user-chosen limited color palette on the page", for example Windows High Contrast. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors
- Fact 2: support (BCD): Chrome 89, Firefox 89, Safari 16. Weakness: a phone viewer cannot see it, lowest rank (owner-feedback 21 Nov).

**W30-3 PICK: the keyboard says "return" but it should say "Search" (enterkeyhint)** [forms / phone]
- Hook: "The keyboard's big key says 'return'. This is a search box." Tension: one attribute decides the label of that key.
- Learn: `<input enterkeyhint="search">` (also `go`, `send`, `next`, `done`).
- Fact 1: `enterkeyhint` is "an enumerated attribute defining what action label (or icon) to present for the enter key on virtual keyboards". https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint
- Fact 2: support (BCD html.global_attributes.enterkeyhint): Chrome 77, Firefox 94, Safari 13.1.
- Fit: a phone with a keyboard; the key label changes from "return" to "Search"; a TAPS TO SUBMIT meter. A phone-edge bug, visible and counted. Not showreel-27-keyboard (that was `inputmode`).
- Prop: a door with a handle labelled "push" instead of "pull".

**W30-4: same photo, let the browser pick the format (picture)** [performance]
- Hook: "Ship one photo to every phone, and half of them get a format they don't need." Tension: new formats exist, old phones still need JPEG.
- Learn: `<picture><source type="image/avif"><source type="image/webp"><img src="a.jpg"></picture>`.
- Fact 1: `<picture>` "contains zero or more <source> elements and one <img> element to offer alternative versions of an image for different display/device scenarios"; the browser "will consider each child <source> element and choose the best match". https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture
- Fact 2: support (BCD): Chrome 38, Firefox 38, Safari 9.1. No byte numbers unless measured. Weakness: close to W28-3 (srcset); pick one.

**W30-5 PICK: the button stays lit after you tap it (@media (hover: hover))** [CSS / phone]
- Hook: "You tapped Like. It stays highlighted until you tap somewhere else." Tension: touch screens leave the hover state stuck.
- Learn: put hover styles in `@media (hover: hover) { .btn:hover { ... } }`.
- Fact 1: the `hover` media feature "can be used to test whether the user's primary input mechanism can hover over elements". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/hover
- Fact 2: support (BCD css.at-rules.media.hover): Chrome 38, Firefox 64, Safari 9.
- Fit: a phone with a row of buttons; each tapped one stays lit (red STUCK count 1, 2, 3) then none (mint). Visible and counted, like the wiggle reels. Check that showreel-04-hover / 20-hover were about transitions, not touch (read their configs).
- Prop: footprints left on the button after a finger has gone.

**W30-6 PICK: the keyboard covers the button (viewport interactive-widget)** [layout / phone]
- Hook: "The keyboard is up. The Pay button is under it." Tension: by default the keyboard overlays the page's layout viewport.
- Learn: `<meta name="viewport" content="width=device-width, interactive-widget=resizes-content">`.
- Fact 1: `interactive-widget` "specifies the effect that interactive UI widgets, such as virtual keyboards, have on a page's viewport", with `resizes-visual` (default), `resizes-content` and `overlays-content`. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport
- Fact 2: support: RE-READ (the BCD node for this value was not found on 24-25 Nov; Chrome 108 is the usual claim; Safari support is not assumed). Say "Chrome" on screen if Safari is still missing.
- Fit: a phone with a keyboard sliding up and a fixed Pay button hidden (red), then lifted (mint); a HIDDEN PIXELS meter in demo px. Close to showreel-45-homebar (fixed bottom button): say "keyboard", not "home bar".

**W30-7: a big image freezes the scroll (decoding="async")** [performance, low]
- Hook: "The page stutters when a big photo appears." Tension: decoding runs with the rest of the page by default.
- Learn: `<img decoding="async">` hints that the browser may present other content first.
- Fact 1: `decoding` "provides a hint to the browser as to whether it should perform image decoding along with rendering the other DOM content in a single presentation step ... or render and present the other content first". https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img
- Fact 2: support (BCD): Chrome 65, Firefox 63, Safari 11.1. It is only a hint; needs a measured frame time to show anything. Lowest rank.

**W30-8: your text is invisible for a second (font-display)** [typography / performance]
- Hook: "The page is there. The words are not." Tension: browsers can hide text while the font downloads.
- Learn: `@font-face { font-display: swap; }` (or `optional`) shows a fallback at once.
- Fact 1: the descriptor "determines how a font face is displayed based on whether and when it is downloaded and ready to use"; `block` gives "a short block period and an infinite swap period". https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/font-display
- Fact 2: support (BCD css.at-rules.font-face.font-display): Chrome 60, Firefox 58, Safari 11.1. Near showreel-37-fontswap (the shift on swap): this one is the invisible text before it.

**W30-9: jump links land on a highlighted section (:target)** [CSS, low]
- Hook: "You tapped a link in the menu. Which section did it take you to?" Tension: no visual cue after a jump.
- Learn: `section:target { background: ... }` marks the section the URL points to; pair with the posted `scroll-padding-top` lesson.
- Fact 1: `:target` "selects the target element of the document", derived from the URL fragment. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:target
- Fact 2: support (BCD): Chrome 1, Firefox 1, Safari 1.3. Weakness: old and plain, lowest rank; close to showreel-25-anchor.

**W30-10: one animated box makes the whole page re-layout (contain)** [performance]
- Hook: "A tiny counter updates. The whole page recalculates." Tension: changes in one box can touch everything.
- Learn: `.widget { contain: layout paint style; }` keeps a box independent of the rest.
- Fact 1: `contain` "indicates that an element and its contents are, as much as possible, independent from the rest of the document tree", limiting calculations of layout, style, paint, size to a subtree. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/contain
- Fact 2: support (BCD): Chrome 52, Firefox 69, Safari 15.4. No speed number without a measure; same family as W27-4 (content-visibility).

### Web picks in one line each (two per day)
| Day | Pick 1 | Pick 2 |
|---|---|---|
| 25 Nov | W25-1 field-sizing: a clipped message in frame 0, one line fixes it | W25-2 :user-invalid: the form is red before you type, 3 red to 0 |
| 26 Nov | W26-1 :has: a myth that changed, a big visible result | W26-2 will-change: a tip that backfires, the fix is to delete a line |
| 27 Nov | W27-1 scroll(): a bar with 0 scroll listeners, all three engines | W27-2 inert: a bug behind the popup (faint on a phone, so second) |
| 28 Nov | W28-4 pinch-zoom lock: a visible phone bug, a ZOOM meter, WCAG backed | W28-5 object-fit: a squashed face in frame 0, counted ratio |
| 29 Nov | W29-4 en-IN grouping: India angle, wrong number in frame 0, one line | W29-6 hidden="until-found": search finds nothing, then finds it (check Safari and Firefox first) |
| 30 Nov | W30-5 hover: stuck buttons counted 1-2-3, like the wiggle reels | W30-3 enterkeyhint: the keyboard key changes label, counted taps; W30-6 is the backup |

## TECH (25 Nov skipped: storage-gap is built). Every fact below was read on the maker's or body's own page. Brands as text only (rules-tech.md).

### Thu 26 Nov (Apple 1, Google 2, USB-IF 1, Wi-Fi Alliance 2, Samsung 1, vivo 1, NVIDIA 1, AMD 1)
**T26-1 PICK (Apple, v1): your phone battery has a number of lives (500 vs 1000 cycles)**
- Hook: "Your battery is rated for 500 charges. On newer phones, double." Tension: a number that changed.
- Learn: what a complete charge cycle is, and that 80% is a design target, not a deadline.
- Fact 1: iPhone 14 and earlier batteries "are designed to retain 80 percent of their original capacity at 500 complete charge cycles under ideal conditions". https://support.apple.com/en-us/101575
- Fact 2: iPhone 15 models "are designed to retain 80 percent of their original capacity at 1000 complete charge cycles under ideal conditions" (same page; it names only 15 models, say nothing about 16 or 17 without re-reading).
- Fit: the x-ray phone, the battery cell lit amber, one huge number that changes on the spoken word (500 to 1000), cyan on the payoff. Prop: a battery cell with a tally scratched into it, 500 marks then 1000.
- Not a repeat: charge-80, heat-battery and drain-zero covered habits; this is the rated lifespan.

**T26-2 PICK (Google, v1): your phone can measure how far the router is (Wi-Fi ranging, RTT)**
- Hook: "Your phone can measure the distance to your router, with no GPS." Tension: indoor position without satellites.
- Learn: with Wi-Fi RTT a phone times the round trip of a signal to three or more access points, within about 1-2 m, without joining those networks.
- Fact 1: "The result is typically accurate within 1-2 meters" with three or more access points. https://developer.android.com/develop/connectivity/wifi/wifi-rtt
- Fact 2: the phone "doesn't need to connect to the access points to measure distance" (same page). Say "Android phones with the feature and routers that support it".
- Fit: a phone hero, three routers as small lit towers, rings that tighten on the spoken number. Prop: three rings meeting at one dot, the phone.
- Why pick: nothing like it was posted; rings in space suit the 3D look. Wi-Fi Alliance also lists "Wi-Fi Location" with "meter-level indoor location accuracy" (https://www.wi-fi.org/discover-wi-fi/wi-fi-location) as a second source.

**T26-3 (Google): a photo that hides a second photo (Ultra HDR)**
- Hook: "This JPEG is two pictures. Old phones only see one." Tension: HDR in a normal .jpg file.
- Learn: Ultra HDR stores a normal photo plus a "gain map"; a compatible screen combines them for brighter highlights, and an old viewer shows the normal one.
- Fact 1: the format "encodes a logarithmic range gain map image in a JPEG image file. Legacy readers that don't support the format read and display the conventional low dynamic range image". https://developer.android.com/media/platform/hdr-image-format
- Fact 2: Android 16 adds "support for HEIC encoding and new parameters from the ISO 21496-1 draft standard" for UltraHDR images. https://developer.android.com/about/versions/16/features
- Fit: a photo that splits into two layers in 3D, a brightness number climbing on the spoken word. Prop: a sandwich of two slides.

**T26-4 (USB-IF): your charger and your laptop talk before charging (USB Power Delivery)**
- Hook: "A monitor can charge your laptop. Your laptop can charge your monitor." Tension: the power direction is not fixed.
- Learn: USB PD lets devices negotiate; a headset asks for only the power it needs, a laptop asks for more.
- Fact 1: "Power direction is no longer fixed. This enables the product with the power (Host or Peripheral) to provide the power." https://www.usb.org/usb-charger-pd
- Fact 2: "A monitor with a supply from the wall can power, or charge, a laptop while still displaying", and low-power devices "such as headsets" can "negotiate for only the power they require" (same page).
- Fit: a cable as a glowing duct, arrows that reverse on the spoken word. Near showreel-tech-usbc-two-numbers (watts vs data speed): this reel is about direction and negotiation, show it as two devices talking.

**T26-5 (Wi-Fi Alliance): Wi-Fi 7's trick is a wider road (320 MHz channels)**
- Hook: "Wi-Fi 7 isn't a faster car. It's a wider road." Tension: where the speed really comes from.
- Learn: Wi-Fi 7 uses 320 MHz channels in the 6 GHz band; a wider channel carries more at once; walls still cut 6 GHz.
- Fact 1: "320 MHz channels available in the 6 GHz band provide twice the throughput of Wi-Fi 6". https://www.wi-fi.org/discover-wi-fi/wi-fi-certified-7
- Fact 2: "4K quadrature amplitude modulation mode (4K QAM) achieves 20% higher transmission rates than Wi-Fi 6's 1024 QAM" (same page).
- Fit: a road that doubles in width with cars (data) filling it; one huge number x2. Prop: a motorway lane marker moving out. Say "up to" and "under ideal conditions".

**T26-6 (Wi-Fi Alliance): the cafe Wi-Fi with no password (Enhanced Open)**
- Hook: "Open Wi-Fi sends your data in the clear. There's a fix, and most people never see it." Tension: a no-password network can still be encrypted.
- Learn: Enhanced Open encrypts each device's traffic on an open network, without a password; it does not prove the network is honest.
- Fact 1: "Wi-Fi Enhanced Open networks provide unauthenticated data encryption to users, an improvement over traditional open networks with no protections at all." https://www.wi-fi.org/discover-wi-fi/security
- Fact 2: it "preserves the convenience that open networks offer while reducing some of the risks associated with accessing an unsecured network" (same page: "reducing", not "removing"; say that).
- Fit: a phone in a cafe, traffic as readable text turning into scrambled blocks on the spoken word. Prop: a postcard turning into a sealed envelope.

**T26-7 (Samsung): your phone's storage doubled its speed (UFS 4.0)**
- Hook: "The chip that holds your photos got twice as fast." Tension: a spec nobody sees until an app opens.
- Learn: UFS 4.0 reads at up to 4,200 MB/s (the maker says it doubles UFS 3.1's link speed), which is why big apps and games open faster.
- Fact 1: "UFS 4.0 uses powerful 176-layer 7th Generation V-NAND to deliver 4,200MBps read speeds, while MIPI M-PHY 5.0 offers up 23.2Gbps data transfers - doubling the speed of UFS 3.1." https://semiconductor.samsung.com/estorage/ufs/ufs-4-0/
- Fact 2: "Even write speeds get a 1.6x bump to 2,800MBps" and it is "46% more efficient" (same page; say "the maker says").
- Fit: a memory chip hero, a grid of cells lit, one huge number 4,200. Different from storage-gap (25 Nov: capacity); this is speed. Prop: a double-lane tunnel for data.

**T26-8 (vivo, IN): a 200 MP zoom lens, but the sensor size matters (telephoto sensor)**
- Hook: "A 200 MP zoom lens. The number that matters is on the next line." Tension: megapixels vs sensor size.
- Learn: a bigger sensor gathers more light than a pile of tiny pixels; read the size (1/1.4-inch) as well as the MP.
- Fact 1: vivo X200 Pro (India page): "200MP ZEISS APO Telephoto Camera | HP9 Sensor | 1/1.4-inch | f/2.67 Aperture | 85 mm Equivalent Focal Length". https://www.vivo.com/in/products/x200-pro
- Fact 2: the main camera on the same page is "50MP | 1/1.28-inch | f/1.57 Aperture | 23 mm Equivalent Focal Length" (same page; compare 50 MP vs 200 MP on a similar sensor size).
- Fit: two sensors drawn to scale as glowing slabs, a pixel grid zooming in on the spoken number. India angle: an Indian-market flagship. Diplomatic, no ranking of makers.

**T26-9 (NVIDIA): most frames in a game may never have been drawn (DLSS frame generation)**
- Hook: "In some games, most of the frames you see were made by AI." Tension: smooth video from fewer real frames.
- Learn: frame generation makes in-between frames to raise FPS; the game's input still runs on real frames, which is why a latency tool (Reflex) is paired with it.
- Fact 1: DLSS "uses AI to boost FPS, reduce latency, and improve image quality"; DLSS 4.5 "introduced Dynamic Multi Frame Generation". https://www.nvidia.com/en-us/geforce/technologies/dlss/
- Fact 2: the page describes Multi Frame Generation as "using AI to generate frames while maintaining great responsiveness with NVIDIA Reflex" (same page). Say "the maker says"; no frame multiplier is claimed, because the page does not give one in the text read.
- Fit: a row of frames in 3D, every other one glowing cyan; one huge FPS number. Prop: a flipbook with fake pages added.

**T26-10 (AMD): the graphics driver can invent frames (AFMF)**
- Hook: "Your graphics card driver can add frames to a game that doesn't know." Tension: frame generation without the game's help.
- Learn: AMD Fluid Motion Frames works at the driver level, so many games get it; latency can still matter in fast games.
- Fact 1: "AMD Fluid Motion Frames, or AFMF, is a frame generation technology designed to increase frame rates and smoothness", built into the Adrenalin app. https://www.amd.com/en/products/software/adrenalin/afmf.html
- Fact 2: AFMF 2.1 "works with AMD Radeon Chill and supports Vulkan and OpenGL games, and borderless full screen" (same page).
- Fit: a game frame stream where AMD's in-between frames light cyan. Prop: a stop-motion flipbook with half the pages drawn by a helper. Pair note: T26-9 and T26-10 both cover frame generation: build one, not both.

### Fri 27 Nov (Apple 2, Bluetooth SIG 1, Samsung 1, Xiaomi 1, Wi-Fi Alliance 1, Google 1, USB-IF 1, NVIDIA 1, vivo 1)
**T27-1 PICK (Apple, v1): the switch almost nobody should turn on (Lockdown Mode)**
- Hook: "Apple built a mode that breaks your phone on purpose." Tension: protection that removes features.
- Learn: what Lockdown Mode turns off, and that it is for the very few people who may be targeted.
- Fact 1: "an optional, extreme protection that's designed for the very few individuals who, because of who they are or what they do, might be personally targeted". https://support.apple.com/en-us/105120
- Fact 2: "Incoming FaceTime calls are blocked unless you have previously called that person or contact within the past 30 days"; configuration profiles "can't be installed"; "Phone calls and plain text messages continue to work" (same page, re-read 24 Nov).
- Fit: a phone in a vault of dark glass, switches turning off one by one on the spoken word; cyan on "calls still work". Prop: a phone behind bank-vault doors. Calm tone, no fear.

**T27-2 PICK (Bluetooth SIG + Google, v1): your earbuds' codec is being replaced (LE Audio, LC3)**
- Hook: "The codec every pair of earbuds uses is being replaced." Tension: say only what the pages say.
- Learn: LE Audio brings a new codec (LC3), hearing-aid support and broadcast audio.
- Fact 1: Bluetooth SIG: LE Audio "will include a new high-quality, low-power audio codec, the Low Complexity Communications Codec (LC3)", letting makers choose longer battery life or a smaller battery. https://www.bluetooth.com/learn-about-bluetooth/recent-enhancements/le-audio/
- Fact 2: Android: "LC3 ... replaces the SBC codec used for A2DP (media) and mSBC in HFP (voice). LC3 is more efficient, reconfigurable, and higher quality." https://developer.android.com/develop/connectivity/bluetooth/ble-audio/overview
- Fit: earbuds as the lit hero, sound rings; a codec name flips SBC to LC3 on the spoken word. Prop: a water pipe being swapped for a narrower, faster one.

**T27-3 (Samsung): why your phone's memory speed is an AI number (LPDDR5X)**
- Hook: "Your phone's RAM got faster so the AI on it can think." Tension: a spec behind on-device AI.
- Learn: LPDDR5X is the low-power memory in phones; higher speed and lower power both matter for on-device AI.
- Fact 1: LPDDR5X delivers "up to 10.7 Gbps data processing speeds". https://semiconductor.samsung.com/dram/lpddr/lpddr5x/
- Fact 2: "up to 1.25 times faster and 25% better power efficiency compared to the previous generation" (same page; say "the maker says").
- Fit: a memory chip as a lit city grid, data pulses; one huge number 10.7. Prop: a conveyor belt that speeds up. Weakness: abstract; needs a clear AI example.

**T27-4 (Xiaomi, IN): a battery that keeps 80% after 1,600 charges?**
- Hook: "'80% after 1,600 charges.' What does that sentence leave out?" Tension: a claim with a lab behind it.
- Learn: read cycle claims the way the maker states them: lab data, "approximately", chip-managed charging.
- Fact 1: Xiaomi 15 (India page): "After 1,600 charging cycles, the battery capacity still remains at approximately 80%." https://www.mi.com/in/xiaomi-15/
- Fact 2: "Charging data comes from Xiaomi Internal Labs. Actual results may vary" (same page); battery is 5240mAh (typ) with 90W HyperCharge and 50W wireless.
- Fit: the x-ray phone, a cycle counter that spins to 1,600 on the spoken number, amber for the footnote. Contrast with T26-1 (Apple's rated cycles): do not build both on days in a row; pair as a comparison later. Diplomatic: state each maker's own claim.

**T27-5 (Wi-Fi Alliance): add a camera to Wi-Fi without typing a password (Easy Connect)**
- Hook: "Your camera has no screen and no keyboard. How does it join your Wi-Fi?" Tension: setting up devices that cannot type.
- Learn: Easy Connect adds a device by scanning its QR code (or an NFC tag) instead of typing.
- Fact 1: provisioning devices "including those without a rich user interface, is as simple as scanning a product quick response (QR) code, NFC tag, or downloading device information from the cloud to enable zero-touch Wi-Fi connectivity". https://www.wi-fi.org/discover-wi-fi/wi-fi-easy-connect
- Fact 2: it offers "a standardized, consistent method for onboarding devices" (same page). India angle: home cameras and smart bulbs; no brand claims.
- Fit: a camera hero in a dark room, a QR code that lights and a line that draws to the router. Prop: a key that cuts itself when shown.

**T27-6 (Google): your phone delays your messages on purpose (Doze)**
- Hook: "Your phone delays your messages on purpose." Tension: a design choice, not a bug.
- Learn: while still, unplugged and screen off, Android bunches network, jobs and syncs into rare windows; high-priority messages can come through.
- Fact 1: in Doze the system "prevents apps from accessing the network and defers their jobs, syncs, and standard alarms". https://developer.android.com/training/monitoring-device-state/doze-standby
- Fact 2: it runs pending work in a "maintenance window" and "over time" schedules them less often (same page). Check the viewer's own fix (per-app battery setting) on a maker page that morning.
- Fit: a phone on a night table, a window of light opening now and then. Weakness: the fix is for app makers.

**T27-7 (USB-IF): USB4 80 Gbps needs a cable that says so**
- Hook: "Same plug. Half the speed. The cable was the reason." Tension: not every USB-C cable can carry 80 Gbps.
- Learn: look for an 80 Gbps certified cable for the top speed; USB4 devices still work with older ones at a lower speed.
- Fact 1: "Two-lane operation using existing USB Type-C cables and up to 80 Gbps operation over 80 Gbps certified cables". https://www.usb.org/usb4
- Fact 2: USB4 "doubles the maximum aggregate bandwidth of USB", and "the resulting connection scales to the best mutual capability of the devices being connected" (same page).
- Fit: a cable as a glowing tube, a data number that halves when a plain cable is plugged. Close to usbc-two-numbers (skipped): this one is about the cable's certified speed.

**T27-8 (NVIDIA): a few milliseconds decide a duel (Reflex)**
- Hook: "A few milliseconds can lose a fight. Your screen is part of the delay." Tension: latency you cannot see.
- Learn: system latency is the time from click to pixel; Reflex 2's Frame Warp is meant to cut it by using the latest mouse input.
- Fact 1: "Even a few milliseconds of latency can tilt the scales between victory and defeat in competitive games." https://www.nvidia.com/en-us/geforce/technologies/reflex/
- Fact 2: "Reflex Frame Warp (coming soon), improves responsiveness by updating the game frame based on the latest mouse input just before it is sent to the display" (same page; "coming soon": say so).
- Fit: a mouse click as a pulse travelling down a pipe to a screen; one huge ms number. Prop: a relay baton. Weakness: brand claim; keep it to what the page says.

**T27-9 (Apple): your phone can text a satellite (Emergency SOS via satellite)**
- Hook: "No signal. You can still send a text, to the sky." Tension: a message that takes 30 seconds or more.
- Learn: with iPhone 14 or later you can use a satellite connection when there is no cellular and Wi-Fi coverage; point at open sky.
- Fact 1: "With iPhone 14 or later (all models), you can use a satellite connection when you have no cellular and Wi-Fi coverage to text emergency services, request roadside assistance, message friends and family, and share your location." https://support.apple.com/en-us/105097
- Fact 2: "In ideal conditions with a direct view of the sky and the horizon, a message might take 30 seconds or more to send" and may take "up to several minutes" under trees (same page). Availability varies by country: check India before saying it works there.
- Fit: a phone under a night sky, a satellite arc, a timer that counts 30 s on the spoken number. Prop: a message in a bottle thrown upward.

**T27-10 (vivo, IN): a 6000 mAh phone that works at -20 C? (silicon-anode battery)**
- Hook: "A bigger battery without a bigger phone. The trick is the material." Tension: capacity vs thickness.
- Learn: silicon-anode, semi-solid cells hold more energy per volume; the maker also states a cold-weather limit.
- Fact 1: vivo X200 Pro (India page): "6000 mAh battery, powered by 3rd-Gen Silicon Anode and Semi-Solid Battery Technology, ensures enduring performance even in extreme cold down to -20 C", with 90W FlashCharge. https://www.vivo.com/in/products/x200-pro
- Fact 2: the page labels it "India's 1st 6000 mAh Semi-Solid State Battery" (a maker claim; attribute it). Close to cold-shutdown (posted): this one is about the cell's material. Say "vivo says".
- Fit: a battery cell cut open in 3D, an anode lattice growing denser on the spoken number. Prop: a backpack that holds more without growing.

### Sat 28 Nov (Google 2, Wi-Fi Alliance 1, Samsung 1, Bluetooth SIG 1, AMD 1, USB-IF 1, Xiaomi 1, Apple 1, NVIDIA 1)
**T28-1 (Google, v1): Android ranks your apps (App Standby Buckets)**
- Hook: "Your phone has put every app in a bucket. Yours may be in the worst one." Tension: a hidden ranking.
- Learn: apps you open rarely get fewer background jobs and alarms, but only on battery.
- Fact 1: the bucket "determines how frequently the app's jobs run and how often the app can trigger alarms". https://developer.android.com/topic/performance/appstandby
- Fact 2: the limits "apply only while the device is on battery power", and each maker may set its own rules (same page).
- Fit: buckets as lit glass jars. Weakness: the viewer cannot see their bucket; lowest rank.

**T28-2 (Google, v1): why you must touch the pay terminal (NFC range)**
- Hook: "Tap to pay is not wireless. It is 4 centimetres." Tension: the wireless you have to touch.
- Learn: NFC needs about 4 cm or less, so a thick case or a wallet in between can stop it.
- Fact 1: "NFC is a set of short-range wireless technologies, typically requiring a distance of 4 cm or less to initiate a connection". https://developer.android.com/develop/connectivity/nfc
- Fact 2: NFC lets you share small payloads between a tag and a device or between two devices (same page). Thin; add a second primary page. Close to applepay-number (posted).

**T28-3 (Wi-Fi Alliance): Wi-Fi 7's phone uses two bands at once (Multi-Link Operation)**
- Hook: "Your phone can use two Wi-Fi bands at the same time." Tension: until now it had to pick one.
- Learn: multi-link operation splits traffic across links, so a slow band stops being the whole connection.
- Fact 1: "Multi-link operation supports more efficient load balancing of traffic among links, resulting in increased throughput and enhanced reliability". https://www.wi-fi.org/discover-wi-fi/wi-fi-certified-7
- Fact 2: Wi-Fi 7 "enhances performance across the 2.4 GHz, 5 GHz, and 6 GHz bands" (same page). Same page as T26-5: build one of the two.
- Fit: a phone with two beams (cyan 6 GHz, amber 2.4 GHz) that merge on the spoken word. Prop: a two-lane bridge opening a third lane.

**T28-4 PICK (Samsung): a 200 MP camera that takes 12.5 MP photos (pixel binning)**
- Hook: "Your 200 MP camera usually takes a 12 MP photo. On purpose." Tension: the headline number is rarely the photo size.
- Learn: the sensor merges up to 16 pixels into one for low light; a bigger merged pixel catches more light.
- Fact 1: ISOCELL HP2 "merges up to 16 pixels into one, meaning it can operate as a 1.2 um or even a 2.4 um unit pixel" (200 / 16 = 12.5 MP; this division is our arithmetic, say so). https://semiconductor.samsung.com/image-sensor/mobile-image-sensor/isocell-hp2/
- Fact 2: it works "even in a 1 lux environment such as a room lit by a single candle" (same page; "the maker says").
- Fit: a pixel grid in 3D folding 4x4 into one big glowing pixel, number 200 to 12.5. Prop: sixteen buckets pouring into one. Why pick: a number everyone sees on boxes, explained.

**T28-5 PICK (Bluetooth SIG): the muted TV at the airport (Auracast)**
- Hook: "The airport TV is on mute. Your earbuds could hear it." Tension: sound for a whole room, privately.
- Learn: Auracast broadcast audio lets many devices listen to one source; you join by search, QR or tap.
- Fact 1: it "will enable you to fully enjoy televisions in public spaces, unmuting what was once silent". https://www.bluetooth.com/auracast/
- Fact 2: joining "will be as easy as 1, 2, or 3": searching, scanning a QR code, or tapping; and it "is expected to become the next generation assistive listening technology" (same page; "expected": say so).
- Fit: a dark waiting hall, one screen, sound rings reaching many earbuds. Prop: a lighthouse beam for sound. Why pick: a visible, human, safe topic with an India angle (stations, airports).

**T28-6 (AMD): your game lag is a queue (Anti-Lag)**
- Hook: "Your GPU is waiting for the CPU, and the CPU is waiting for you." Tension: lag from work lining up.
- Learn: AMD Radeon Anti-Lag controls how much CPU work queues up ahead of the GPU.
- Fact 1: "Reduces lag by intelligently controlling the queuing of CPU work ahead of GPU work in DirectX 9, DirectX 11 and DirectX 12 games." https://www.amd.com/en/products/software/adrenalin.html
- Fact 2: AMD Radeon Boost "dynamically adjusts resolution during camera rotation in first- and third-person games to deliver higher frame rates" (same page; used in T29-6).
- Fit: a queue of frame boxes shrinking in front of a GPU. Prop: a grocery queue with one lane closed.

**T28-7 (USB-IF): the 240 W USB-C cable (USB PD 3.1)**
- Hook: "Your laptop charger tops out at 100 W. The new rule says 240 W." Tension: the old limit and what changed.
- Learn: PD 3.1 added 28 V, 36 V and 48 V levels for 140, 180 and 240 W; the cable must be rated for it.
- Fact 1: "Prior to this update, USB PD was limited to 100W using a solution based on 20V using USB Type-C cables rated at 5A." https://www.usb.org/usb-charger-pd
- Fact 2: "New 28V, 36V, and 48V fixed voltages enable up to 140W, 180W and 240W power levels, respectively" (same page). Near usbc-two-numbers: lead with the voltage steps.
- Fit: a voltage dial climbing in steps, a cable glowing hotter on each. Prop: a thicker pipe for the same tap.

**T28-8 (Xiaomi, IN): why a phone with a big chip doesn't melt (loop heat pipe)**
- Hook: "Your phone has a cooling pipe the size of a pen. It moves heat sideways." Tension: no fan, big chip.
- Learn: a loop heat pipe spreads heat from the chip to the frame; more contact area means more cooling.
- Fact 1: "The innovative wing thermal design increases the contact area between the loop heat pipe and frame, significantly enhancing heat dissipation efficiency." https://www.mi.com/in/xiaomi-15/
- Fact 2: the phone has the Snapdragon 8 Elite "with 3nm manufacturing process" (same page). A maker claim; no temperature number.
- Fit: a phone as an x-ray, heat as amber that flows along a pipe to a cyan frame. Prop: a radiator on a wall. Different from heat-battery and cold-shutdown (posted): this is cooling design.

**T28-9 (Apple): earbuds that run a hearing test at home (AirPods Pro 3)**
- Hook: "Your earbuds can run a hearing test at home." Tension: a gadget crossing into health.
- Learn: what the feature is for (mild to moderate hearing loss) and where it is available.
- Fact 1: users can take a "scientifically validated Hearing Test" and use a Hearing Aid feature for "mild to moderate hearing loss". https://www.apple.com/airpods-pro/
- Fact 2: up to 8 hours of listening with Active Noise Cancellation on a single charge (same page). Read the country footnotes before saying "available in India".
- Fit: earbuds in a dark room, a waveform. Weakness: marketing page, country limits; diplomatic framing needed.

**T28-10 (NVIDIA): what DLSS 4.5 adds (Dynamic Multi Frame Generation)**
- Hook: "DLSS changes how many frames it makes, frame by frame." Tension: a setting that adjusts itself.
- Learn: "Dynamic Multi Frame Generation" and a second-generation transformer model for Super Resolution.
- Fact 1: "DLSS 4.5 introduced Dynamic Multi Frame Generation and a second-gen transformer model for Super Resolution and Ray Reconstruction." https://www.nvidia.com/en-us/geforce/technologies/dlss/
- Fact 2: "DLSS 5 adds lifelike lighting and materials with 3D-Guided Neural Rendering" (same page). Overlaps T26-9: pick one NVIDIA frame topic per week.

### Sun 29 Nov (Google 1, Wi-Fi Alliance 2, Samsung 1, Apple 1, AMD 1, Xiaomi 1, Bluetooth SIG 2, USB-IF 1)
**T29-1 (Google, v1): the phone that measures to 10 cm (ultra-wideband)**
- Hook: "Your phone can tell which way you are standing to 10 centimetres." Tension: the precision number.
- Learn: UWB is a radio for ranging between devices, much finer than Bluetooth.
- Fact 1: UWB is "a radio technology focused on precise ranging (measuring the location to an accuracy of 10 cm) between devices". https://developer.android.com/develop/connectivity/uwb
- Fact 2: its bandwidth is greater than 500 MHz (or over 20% fractional bandwidth) (same page). Claim about Android's UWB API only.
- Fit: two phones facing, a cone of rings between them. Weakness: the second fact is a spec nobody feels.

**T29-2 (Wi-Fi Alliance + Google): two phones find each other with no internet (Wi-Fi Aware)**
- Hook: "Two phones can find each other with no Wi-Fi network, no internet, no GPS." Tension: a connection with nothing in the middle.
- Learn: Wi-Fi Aware discovers nearby devices and connects them directly.
- Fact 1: it enables "quick discovery, connection, and data exchange with other Wi-Fi devices - without the need for a traditional network infrastructure, Internet connection, or GPS signal". https://www.wi-fi.org/discover-wi-fi/wi-fi-aware
- Fact 2: Android documents "Implement Wi-Fi Aware" for apps (https://developer.android.com/develop/connectivity/wifi/wifi-aware, page read; the sentence to quote is RE-READ).
- Fit: two phones in a dark field, a thread of light between them. Prop: two cans on a string.

**T29-3 (Wi-Fi Alliance): Wi-Fi 8 isn't about speed (Wi-Fi 8)**
- Hook: "Wi-Fi 8 isn't faster. It's more reliable. Here's why that's harder." Tension: the next Wi-Fi has a different goal.
- Learn: Wi-Fi 8 lets access points work together instead of competing; it is built for dependable connections.
- Fact 1: Wi-Fi 8 "raises the bar for reliability, keeping people, machines, and businesses connected when the stakes are highest". https://www.wi-fi.org/discover-wi-fi/wi-fi-certified-7
- Fact 2: it "allows access points (APs) to collaborate instead of competing for spectrum, providing higher capacity in dense deployments" (same page; say "the Wi-Fi Alliance says").
- Fit: routers as towers, beams that stop crossing and start handing devices over. Prop: relay runners passing a baton.

**T29-4 (Samsung): every pixel can focus (Super QPD)**
- Hook: "Most phone cameras focus with 3% of their pixels. This one uses all of them." Tension: autofocus is a sampling problem.
- Learn: Super QPD lets every pixel detect focus, so low light and motion focus faster.
- Fact 1: "With Super QPD, every pixel can detect autofocus information, compared to only 3% of pixels in its 108MP predecessor." https://semiconductor.samsung.com/image-sensor/mobile-image-sensor/isocell-hp2/
- Fact 2: it focuses "on objects in motion with high frame rates of 15fps at 200MP" (same page).
- Fit: a sensor grid where 3% of pixels light, then all of them cascade. Prop: a choir where only a few sing, then everyone.

**T29-5 (Apple): a two-day battery is a recipe (Apple Watch Ultra)**
- Hook: "'Over 2 days' on a watch means 630 time checks." Tension: the claim has a script.
- Learn: how to read a battery claim: the test list is on the maker's page.
- Fact 1: "Over 2 days (up to 50 hours)"; the test includes 630 time checks, 190 notifications, 30 minutes of app use, two 60-minute workouts, and 12 hours of sleep tracking. https://www.apple.com/watch/battery/
- Fact 2: "Over 3 days (up to 84 hours) in Low Power Mode" (same page, checked 25 Nov).
- Fit: a watch hero, counters ticking on the spoken number. Weakness: same format as phone-claim (posted); use only if the audit asks for a wearable.

**T29-6 PICK (AMD): your game quietly lowers its resolution when you turn (Radeon Boost)**
- Hook: "Your game lowers its picture quality every time you turn. On purpose." Tension: a trade made when you cannot see it.
- Learn: Radeon Boost drops the resolution while the camera is turning fast, then restores it.
- Fact 1: "AMD Radeon Boost dynamically adjusts resolution during camera rotation in first- and third-person games to deliver higher frame rates and more immediate responses." https://www.amd.com/en/products/software/adrenalin.html
- Fact 2: the same page lists Anti-Lag and AFMF as sibling features (so the video can say what it is not).
- Fit: a 3D scene, a resolution number that dips while the camera turns and returns; amber for the dip. Prop: a painter who switches to a fat brush while the model moves. Why pick: a visible, counted effect.

**T29-7 (Xiaomi, IN): why one sensor is 'Light Fusion' (a 2.4 um super pixel)**
- Hook: "A 50 MP sensor with a bigger pixel than its megapixels suggest." Tension: pixel size vs count.
- Learn: bigger pixels catch more light; read the micron number.
- Fact 1: Xiaomi 15 (India page): "23mm Leica main camera 50MP sensor Light Fusion 900 High Dynamic Sensor f/1.62 large aperture 2.4 um super pixel". https://www.mi.com/in/xiaomi-15/
- Fact 2: it adds a "60mm Leica floating telephoto lens 50MP sensor f/2.0" and "10cm macro photography" (same page). Compare to T26-8 and T28-4 (sensor size): build one.
- Fit: two pixel sizes as glowing squares, light drops filling them. Lowest rank among the camera options.

**T29-8 PICK (Bluetooth SIG, IN): the paper price tag is going away (electronic shelf labels)**
- Hook: "Every price tag in a shop is a tiny screen. It changes the price at midnight." Tension: a shelf that updates itself.
- Learn: electronic shelf labels are battery-powered e-paper displays on a wireless link to a hub.
- Fact 1: "Electronic shelf labels (ESL) are small, battery-powered electronic paper (e-paper) displays that present product and pricing information at the shelf edge, replacing paper labels." https://www.bluetooth.com/learn-about-bluetooth/use-cases/electronic-shelf-labels/
- Fact 2: ESLs "use wireless technology to communicate with a central hub to form a dynamic pricing automation network", replacing "error-prone, labor-intensive paper price tags" (same page).
- Fit: a dark supermarket aisle in 3D, tags flipping in a wave on the spoken number. India angle: a kirana or a big store (say "shops", no claim about India's use). Prop: a price tag that blinks.

**T29-9 (Bluetooth SIG): Bluetooth that measures distance to the centimetre (Channel Sounding)**
- Hook: "A Bluetooth car key that knows how far you are, not just that you're near." Tension: near vs how near.
- Learn: Channel Sounding measures distance with phase-based ranging and round-trip time.
- Fact 1: it "offers centimeter-level accuracy over considerable distances". https://www.bluetooth.com/learn-about-bluetooth/recent-enhancements/channel-sounding/
- Fact 2: it "uses two proven ranging methods, phase-based ranging (PBR) and round-trip time (RTT), to enable secure, fine ranging" (same page). Overlaps T26-2 and T29-1 (ranging): do not build two ranging reels in one week.
- Fit: a key fob and a car with rings, the distance number counting down. Prop: a tape measure made of light.

**T29-10 (USB-IF): USB4 is built on Thunderbolt (USB4 and Thunderbolt)**
- Hook: "USB4 and Thunderbolt: the same plug, one is built on the other." Tension: names that confuse buyers.
- Learn: USB4 is based on the Thunderbolt protocol that Intel contributed; USB4 devices work with Thunderbolt 3 hosts and devices.
- Fact 1: "Based on the Thunderbolt protocol specification contributed by the Intel Corporation, USB4 doubles the maximum aggregate bandwidth of USB". https://www.usb.org/usb4
- Fact 2: "Compatibility with existing USB 3.2, USB 2.0, and Thunderbolt 3 hosts and devices is supported" (same page). Overlaps T27-7; build one.

### Mon 30 Nov (Wi-Fi Alliance 2, Samsung 1, NVIDIA 1, AMD 1, Bluetooth SIG 1, Google 2, Xiaomi 1, Apple 1)
**T30-1 (Wi-Fi Alliance): the Wi-Fi password that resists guessing (WPA3)**
- Hook: "Someone can guess your Wi-Fi password offline. WPA3 stops that." Tension: a password's strength vs how it is attacked.
- Learn: WPA3-Personal adds protection against password guessing; it is mandatory for Wi-Fi CERTIFIED devices.
- Fact 1: "WPA3 is mandatory for Wi-Fi CERTIFIED devices"; "Users of WPA3-Personal receive increased protections from password guessing attempts". https://www.wi-fi.org/discover-wi-fi/security
- Fact 2: WPA3 networks "use the latest security protocols" and "disallow outdated legacy protocols" (same page).
- Fit: a keyhole with a thousand guesses bouncing off. Prop: a lock that changes its pins after each guess.

**T30-2 (Wi-Fi Alliance): the Wi-Fi attack that kicks you off (Protected Management Frames)**
- Hook: "Someone nearby can forge a message that kicks your phone off Wi-Fi." Tension: the control messages weren't protected.
- Learn: Protected Management Frames protect management messages from eavesdropping and forging.
- Fact 1: "Protected Management Frames (PMF) extends security protections to unicast (protection from eavesdropping and forging) and multicast (protection from forging) management action frames." https://www.wi-fi.org/discover-wi-fi/security
- Fact 2: it "augments privacy protections already in place for data frames with mechanisms to improve the resiliency of mission-critical" networks (same page). Do not teach an attack; teach the shield. Close to T30-1: build one.
- Fit: a phone tethered to a router, a forged message bouncing off a shield. Prop: a stamp on every letter.

**T30-3 (Samsung): thinner chip, cooler phone (Exynos 2500 packaging)**
- Hook: "A thinner chip runs cooler. This one got thinner on purpose." Tension: heat vs thickness.
- Learn: fan-out wafer-level packaging cuts chip thickness and helps heat dissipation.
- Fact 1: the Exynos 2500 "provides better power efficiency and enhanced heat dissipation at a much reduced chip thickness through fan-out wafer-level packaging (FOWLP)". https://semiconductor.samsung.com/processor/mobile-processor/exynos-2500/
- Fact 2: built "with the cutting-edge 3nm process technology" and combines CPU, NPU and GPU into one chip (same page). Say "Samsung says"; no phone model claimed.
- Fit: a chip peeled in layers, heat as amber flowing out sideways. Prop: a sandwich pressed flatter.

**T30-4 (NVIDIA): the mouse click that updates the picture late (Reflex 2 Frame Warp)**
- Hook: "Your screen draws your last move a moment late. This fixes the picture after the fact." Tension: re-aiming a frame just before it shows.
- Learn: Frame Warp changes the game frame using the latest mouse input before it reaches the display.
- Fact 1: "Reflex Frame Warp (coming soon), improves responsiveness by updating the game frame based on the latest mouse input just before it is sent to the display." https://www.nvidia.com/en-us/geforce/technologies/reflex/
- Fact 2: "Even a few milliseconds of latency can tilt the scales" (same page). Same page as T27-8: build one.

**T30-5 PICK (AMD): '2.5x higher frame rates': the extra frames are not drawn (reading an FPS claim)**
- Hook: "249 FPS vs 97 FPS. What counts as a frame?" Tension: the number is real, the frames are made.
- Learn: when you read a game FPS claim, check whether frames come from frame generation.
- Fact 1: AMD's page: "2.5x Higher Frame Rates in Your Favorite Games On Average with AMD HYPR-RX + AFMF 2 in Select Games"; Baldur's Gate 3 at 4K "Ultra" on a Radeon RX 7900 XTX: 249 FPS vs 97 FPS. https://www.amd.com/en/products/software/adrenalin/afmf.html
- Fact 2: AFMF "is a frame generation technology designed to increase frame rates and smoothness" (same page). The footnotes on the page decide the exact wording: read them (marked 4, 5, 9 and 10 there).
- Fit: two counters running side by side, one slowly, one fast, the fast one glowing with half its frames outlined as drafts. Diplomatic: attribute everything to AMD's own page and say "in select games". Why pick: a claim decoder with a real number and a brand-safe frame.

**T30-6 (Bluetooth SIG): the hearing-aid mode in your earbuds' standard (LE Audio and hearing aids)**
- Hook: "A standard now lets hearing aids join the phone's audio directly." Tension: hearing aids were left out of phones for years.
- Learn: LE Audio adds support for hearing aids; Auracast adds assistive listening in public venues.
- Fact 1: "LE Audio enhances the performance of Bluetooth audio, adds support for hearing aids, and introduces Auracast broadcast audio". https://www.bluetooth.com/learn-about-bluetooth/recent-enhancements/le-audio/
- Fact 2: Auracast "is expected to become the next generation assistive listening technology" and is described as "significantly easier and lower cost to deploy" than inductive loops (https://www.bluetooth.com/auracast/). Overlaps T27-2 and T28-5 (LE Audio, Auracast): build one Bluetooth audio reel per week.

**T30-7 PICK (Google, IN): hide an app on a shared phone (Private Space)**
- Hook: "Your family shares one phone. This hides an app so well it isn't in the list." Tension: privacy with no second phone.
- Learn: Private Space is a separate profile, locked behind an extra layer of authentication.
- Fact 1: "Private space lets users create a separate space on their device where they can keep sensitive apps away from prying eyes, under an additional layer of authentication. The private space uses a separate user profile." https://developer.android.com/about/versions/15/features
- Fact 2: "The private space can be unlocked and locked to show or hide sensitive apps on a device" (same page). The feature is Android 15 and later; no maker claim.
- Fit: a phone with a lit app grid; one app slides behind a glass door and vanishes. Prop: a bookcase that hides a door. India angle: shared phones in families; say "shared", not any statistic.
- Why pick: a clear, human use case and a safe, factual reel.

**T30-8 (Google, IN): the order tracker on your lock screen (progress-centric notifications)**
- Hook: "Your delivery tracker on the lock screen isn't a normal notification." Tension: a notification that changes as the trip goes.
- Learn: Android 16 adds a notification style for start-to-finish journeys such as delivery, rides and navigation.
- Fact 1: "Android 16 introduces progress-centric notifications to help users seamlessly track user-initiated, start-to-end journeys." https://developer.android.com/about/versions/16/features
- Fact 2: "Key use cases include rideshare, delivery, and navigation" (same page). Name no real delivery app.
- Fit: a lock screen in 3D, a route line that fills as a rider moves. Prop: a train ticket that stamps at each stop. Weakness: the viewer's own fix is nothing to do; it is "what you're seeing".

**T30-9 (Xiaomi, IN): your phone has a second chip just for the battery (Surge chips)**
- Hook: "A phone has a chip whose only job is the battery." Tension: charging is managed, not just plugged in.
- Learn: a charging chip and a battery management chip change how fast and how gently a phone charges.
- Fact 1: "The Xiaomi Surge P3 smart fast-charging chip and Xiaomi Surge G1 battery management chip significantly increases the battery life." https://www.mi.com/in/xiaomi-15/
- Fact 2: "After 1,600 charging cycles, the battery capacity still remains at approximately 80%" (same page; "Xiaomi Internal Labs"). Same page as T27-4: build one.

**T30-10 (Apple): glass that is ceramic-reinforced (Ceramic Shield 2)**
- Hook: "Your screen's glass has ceramic in it. The new one scratches less." Tension: what a scratch claim means.
- Learn: how to read a durability claim: the comparison is to the maker's own older models.
- Fact 1: Apple's compare page footnote: Ceramic Shield 2 on iPhone 17, iPhone 17e, iPhone Air and the Pro models "with 3x better scratch resistance compared with iPhone 16 or earlier". https://www.apple.com/in/iphone/compare/
- Fact 2: the same page lists "Ceramic Shield front" and water resistance "to a depth of 6 metres for up to 30 minutes (IP68)" for the older models. RE-READ the model names the morning of the build (the page changes with each launch). Near ip68 (posted): lead with scratches, not water.
- Fit: a glass slab under a stylus, the scratch count meter 3x. Weakness: a marketing comparison; needs a diplomatic frame.

### Tech picks in one line each (two per day)
| Day | Pick 1 | Pick 2 |
|---|---|---|
| 26 Nov | T26-1 battery cycles: a number that doubled, fits the x-ray phone | T26-2 Wi-Fi ranging (Android + Wi-Fi Alliance): rings in space, new to the channel |
| 27 Nov | T27-1 Lockdown Mode: surprise with a purpose, safe | T27-2 LE Audio codec (Bluetooth SIG + Android): a real change, re-worded hook |
| 28 Nov | T28-4 200 MP camera takes 12.5 MP photos (Samsung chip): a number on every phone box, explained | T28-5 Auracast (Bluetooth SIG): the muted airport TV, a human story |
| 29 Nov | T29-8 shop price tags (Bluetooth SIG): a whole aisle in 3D, India-friendly | T29-6 Radeon Boost (AMD): a visible dip counted on screen |
| 30 Nov | T30-7 Private Space (Google): shared family phone, India angle | T30-5 AMD 249 vs 97 FPS: a claim decoder with a real number |

## Open checks before a build (a minute each, the morning of the build)
- Re-read the two URLs of the picked option; a changed line means the new wording. "RE-READ" lines must be read before they go on screen.
- Web: W29-6 (until-found support) and W30-6 (interactive-widget support) need their support rows read first; W27-8, W29-5 need the WCAG wording.
- Tech: T27-9 (satellite) and T28-9 (hearing test) vary by country: read the page footnotes before saying "India". T30-10 changes with each iPhone launch.
- Brand pages (Samsung, Xiaomi, vivo, NVIDIA, AMD, Apple) are marketing: "the maker says", "up to", "in the maker's lab".
- Same-week overlaps are marked on the option; build one of each pair, not both.
