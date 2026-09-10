# /mambacares images

Every file here is optional: the code checks for it and falls back to a
placeholder (a warm tile, or the partner's name in a circle) until the real
file is committed. Drop a file in with the exact name below and it appears on
the next deploy - no code change needed.

Upload straight through GitHub if that is easiest: open this folder, **Add
file -> Upload files**, drag the images in, and commit. The names have to match
exactly, extension included.

## Report photographs

The three Dementia Singapore photographs on the report
(`src/components/screens/mambacares/`).

| File | Shows | Fallback while missing |
| --- | --- | --- |
| `campaign-1.png` | Left photo beside the campaign progress bar | A warm peach tile |
| `campaign-2.png` | Right photo beside the campaign progress bar | A warm peach tile |
| `campaign-wide.png` | The photo above "One minute before you go." | A warm peach tile |

All three are cropped to fill a 16:9 frame (`object-cover`), so anything at the
top or bottom edge can be trimmed - keep the subject centred. The pair render
about 160px wide each on a phone and the wide one about 342px, so export them
at roughly **1200x675**, PNG or JPEG. If you use `.jpg`, change the extension
in `src/config/mambacares.ts` (`MAMBACARES_PHOTOS`) to match.

## Running partners

Five round crew logos, about 44px across on screen, cropped to fill a circle.
Export each **square** (roughly 400x400) with the mark centred and no wide
margin; a logo on a wide canvas will be cropped to its middle.

| File | Crew (left to right in Figma) |
| --- | --- |
| `running-partner-1.png` | Black Mamba |
| `running-partner-2.png` | (2nd crew) |
| `running-partner-3.png` | okay. and running |
| `running-partner-4.png` | SGFR |
| `running-partner-5.png` | (5th crew) |

The names above are read off the Figma artwork and are the alt text as well as
the stand-in shown while a file is missing, so correct any that are wrong in
`src/config/mambacares.ts` (`MAMBACARES_RUNNING_PARTNERS`) - that is also where
a sixth crew is added.

## Giveaway sponsors

Seven round sponsor logos, about 40px across. Same export rules as the crews.

| File | Sponsor (left to right in Figma) |
| --- | --- |
| `sponsor-1.png` | 2050 Coffee |
| `sponsor-2.png` | (2nd sponsor) |
| `sponsor-3.png` | (3rd sponsor) |
| `sponsor-4.png` | PRFM |
| `sponsor-5.png` | (5th sponsor) |
| `sponsor-6.png` | (6th sponsor) |
| `sponsor-7.png` | Sunday Shades |

Names and the number of slots live in `src/config/mambacares.ts`
(`MAMBACARES_GIVEAWAY_SPONSORS`).

## What this event does NOT need

- **No landing logo.** There is no partner on this landing (Figma 756:14394),
  so nothing sits above the eyebrow - unlike `/phkl`.
- **No leaderboard files.** This event has no TV board of its own. The rank on
  the report is read from the `mambacares` bucket through the leaderboard API,
  which needs no artwork.
- **The quiz-intro photos are shared.** "Your brain speed isn't fixed" uses
  `/images/phkl/quiz-intro-{sleep,exercise,diet}.png`, which are already
  committed. Nothing to upload here for that screen.

## Campaign numbers, not images

The amount raised, the goal, the "last updated" date, the deadline and the
donation link are **not** in any of these files - they are in
`src/config/mambacares.ts`. Edit that file and redeploy to move the
thermometer.
