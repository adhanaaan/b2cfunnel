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

Six crew logos, about 44px across on screen, each fitted inside a round white
frame. Export **square** (roughly 400x400). The artwork is fitted, not cropped,
so a wordmark on a square canvas keeps both its ends - but the frame is still a
circle, so leave a little margin around the mark rather than running it to the
edges.

| File | Crew (left to right) |
| --- | --- |
| `running-partner-1.png` | Black Mamba |
| `running-partner-2.png` | (2nd crew) |
| `running-partner-3.png` | 2050 Coffee |
| `running-partner-4.png` | SGFR |
| `running-partner-5.png` | okay. and running |
| `running-partner-6.png` | (6th crew) |

The filled-in names are the ones readable on the artwork; the rest are
placeholders. A name is the alt text as well as the stand-in shown while a file
is missing, so correct any that are wrong in `src/config/mambacares.ts`
(`MAMBACARES_RUNNING_PARTNERS`).

**Adding a seventh crew** also means editing the campaign paragraph in
`src/config/copy.ts`, which says "six running crews" in words - a test holds
the two together so the page can't end up saying six over seven logos.

## Giveaway sponsors

Five sponsor logos, about 40px across. Same export rules as the crews.

| File | Sponsor (left to right) |
| --- | --- |
| `sponsor-1.png` | (1st sponsor) |
| `sponsor-2.png` | PRFM |
| `sponsor-3.png` | (3rd sponsor) |
| `sponsor-4.png` | (4th sponsor) |
| `sponsor-5.png` | Sunday Shades |

Names and the number of slots live in `src/config/mambacares.ts`
(`MAMBACARES_GIVEAWAY_SPONSORS`).

## Leaderboard board art

The TV board's files live in **`board/`** (see `board/README.md`): the three
prize cutouts, the donation illustration and an optional QR override. Same
rules as everything here - each is optional and appears on the next deploy
once it lands. The photo band along the board's bottom edge needs nothing: it
reuses the regatta photos already at the repo root, as `/phkl`'s board does.

## What this event does NOT need

- **No landing logo.** There is no partner on this landing (Figma 756:14394),
  so nothing sits above the eyebrow - unlike `/phkl`.
- **No leaderboard files _here_.** The TV board at `/mambacares/leaderboard`
  has artwork of its own - the prize cutouts and the donation illustration -
  and it goes in the `board/` subfolder, which has its own README listing the
  files and their sizes. Nothing on the report reads it.
- **The quiz-intro photos are shared.** "Your brain speed isn't fixed" uses
  `/images/phkl/quiz-intro-{sleep,exercise,diet}.png`, which are already
  committed. Nothing to upload here for that screen.

## Campaign numbers, not images

The amount raised, the goal, the "last updated" date, the deadline and the
donation short link are **not** in any of these files - they are in
`src/config/mambacares.ts`. Edit that file and redeploy to move the
thermometer.
