# Third-party skills in this folder (added 23 Nov 2026, owner's go in the owner chat)

Every cloud session loads the skills in .claude/skills/. Plugins installed on claude.ai do not reach cloud sessions, so the vetted craft skills
live here. Each skill keeps its licence file (LICENSE.txt). Every file copied was read before it was committed. Our render runs through our
GitHub workflows, never their CLI or cloud; each SKILL.md opens with a "Studio note" that says so and lists what changed.

| Skill | Source | Commit | Licence | Changes |
| --- | --- | --- | --- | --- |
| frontend-design | github.com/anthropics/skills, skills/frontend-design | e4bb5d960d87126ff3b3a8af1a104b7db67560ba | Apache-2.0 (LICENSE.txt, redistribution allowed) | Studio note added at the top; text unchanged |
| canvas-design | github.com/anthropics/skills, skills/canvas-design | e4bb5d960d87126ff3b3a8af1a104b7db67560ba | Apache-2.0 (LICENSE.txt, redistribution allowed) | Studio note added; text unchanged |
| hyperframes | github.com/heygen-com/hyperframes, skills/hyperframes | 871333e80215dc460fe46d6f01083d85c2e0da3b | Apache-2.0 (LICENSE.txt) | Studio note; CLI-launcher, usage-note lines and the desktop-app section removed; description extended |
| reverse-any-video | github.com/heygen-com/hyperframes, skills/reverse-any-video | 871333e80215dc460fe46d6f01083d85c2e0da3b | Apache-2.0 (LICENSE.txt) | SKILL.md rewritten as a study tool (pattern card); references/match.md unchanged |
| style-sampling | github.com/heygen-com/hyperframes, skills/style-sampling | 871333e80215dc460fe46d6f01083d85c2e0da3b | Apache-2.0 (LICENSE.txt) | SKILL.md rewritten as a study method (style card) |
| hyperframes: references/types/3d.md (added 24 Nov) | github.com/heygen-com/hyperframes, skills/hyperframes/references/types/3d.md | 590617475f6f2e4c592b1bc6783bb6dc49d5accf | Apache-2.0 | Studio note added; text unchanged. Why: tech is real 3D since 22 Nov; its camera ("fly into it, one dive beats ten turns"), light (warm key, cool rim, turn the environment) and bloom rules are the tech kit's bar |
| hyperframes: references/steer.md (added 24 Nov) | github.com/heygen-com/hyperframes, docs/prompting/motion.mdx | 590617475f6f2e4c592b1bc6783bb6dc49d5accf | Apache-2.0 | Renamed; demo videos, lesson cards and site links removed; Studio note with three sound-placement lines taken from skills/media-use/audio (sfx.md, manifest.json). Why: one shared vocabulary for motion faults and their fixes (builder and critic), seven motion ideas, transitions by energy |

## Left out

- canvas-design/canvas-fonts/ (5.5 MB of .ttf font files): binaries; we use open-licence Google Fonts or system fonts.
- hyperframes/scripts/ (CLI launcher, plugin installer, basemap baker, locate tool and their tests): CLI and outside services.
- hyperframes/assets/frame-presets/ (1.2 MB: slide-deck presets, showcase HTML, font files): deck looks and binaries, not our reels.
- hyperframes/references: format.md, runtimes.md (their file format and runtimes), plugin-installation.md, skill-lifecycle.md (install steps),
  path-tracing.md, storyboard.md, storyboard-format.md (their Studio storyboard), overlays.md (cards over talking heads), types/launch.md,
  types/music.md, types/character.md (formats we do not make). types/3d.md was added on 24 Nov (table above). The SKILL.md table still names them; they are not here.
- reverse-any-video/references: start.md (Pro sign-in, billing, credits), people.md (HeyGen re-shoots of people), animated.md (HeyGen generated shots).
- style-sampling/references/remix.md (template pull, HeyGen voices, avatars, generated media, credits); its discipline is summarised in our words.
- Every step that calls HeyGen's cloud, a paid service or another outside service; every npm/npx install step.

## Looked at on 24 Nov 2026 and not added (premium program, phase 0)

Every file below was read at the commits in the table (anthropics/skills e4bb5d9, heygen-com/hyperframes 5906174). Nothing was added unless it
clearly raises motion, type, colour or short-video craft for our three kits.

- anthropics/skills theme-factory: ten ready colour and font themes for slide decks. Our three looks are set by the rulebooks; a preset theme would pull us to a template look.
- anthropics/skills brand-guidelines: one company's own colours and fonts. Not ours to wear.
- anthropics/skills algorithmic-art: generative art with p5.js loaded from a CDN, in an interactive viewer. Our scenes allow no outside script and our backgrounds are near-black on purpose.
- anthropics/skills slack-gif-creator: Python GIF tools. The easing ideas are already in hyperframes/references/motion.md.
- hyperframes skills/hyperframes-registry and registry/ (about 450 blocks and components): install and audit steps for their catalog and file format. We take the KINDS of change by name through references/steer.md and build them in our kits.
- hyperframes skills/media-use: their media CLI, HeyGen voices and cloud. Its 21 bundled sound effects are MP3 binaries under the Pixabay Content License (no stand-alone redistribution; this repo is public), so they stay out; our sound stays code-made (scripts/sound). Three placement lines were taken as text into steer.md's note.
- hyperframes docs/prompting color-grading.mdx and captions-catalog.mdx: grading filmed footage, and their caption components. We film nothing; our caption rules are captions.md plus the rulebooks.
- hyperframes skills/slideshow, figma, remotion-to-hyperframes, hyperframes-cli: decks, design-file import, another framework, their CLI.

## Our rules win

CLAUDE.md, design/safety.md, design/rules-*.md and design/owner-feedback.md override anything in these skills. Patterns from any video are
welcome, tweaked for our use; never someone's actual footage, copy, art or a near-identical look of one specific piece (owner, 23 Nov 2026).
