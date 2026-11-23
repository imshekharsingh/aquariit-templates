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

## Left out

- canvas-design/canvas-fonts/ (5.5 MB of .ttf font files): binaries; we use open-licence Google Fonts or system fonts.
- hyperframes/scripts/ (CLI launcher, plugin installer, basemap baker, locate tool and their tests): CLI and outside services.
- hyperframes/assets/frame-presets/ (1.2 MB: slide-deck presets, showcase HTML, font files): deck looks and binaries, not our reels.
- hyperframes/references: format.md, runtimes.md (their file format and runtimes), plugin-installation.md, skill-lifecycle.md (install steps),
  path-tracing.md, storyboard.md, storyboard-format.md (their Studio storyboard), overlays.md (cards over talking heads), types/launch.md,
  types/music.md, types/3d.md, types/character.md (formats we do not make). The SKILL.md table still names them; they are not here.
- reverse-any-video/references: start.md (Pro sign-in, billing, credits), people.md (HeyGen re-shoots of people), animated.md (HeyGen generated shots).
- style-sampling/references/remix.md (template pull, HeyGen voices, avatars, generated media, credits); its discipline is summarised in our words.
- Every step that calls HeyGen's cloud, a paid service or another outside service; every npm/npx install step.

## Our rules win

CLAUDE.md, design/safety.md, design/rules-*.md and design/owner-feedback.md override anything in these skills. Patterns from any video are
welcome, tweaked for our use; never someone's actual footage, copy, art or a near-identical look of one specific piece (owner, 23 Nov 2026).
