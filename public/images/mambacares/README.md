# /mambacares images

Every file listed here is committed and live. They stay optional in code: each
one is checked for and falls back to a placeholder (a warm tile, or the
partner's name in a circle) if it ever goes missing, so a bad deploy degrades
rather than breaks.

To replace one, upload over it through GitHub - open this folder, **Add file ->
Upload files**, drag the new version in, and commit. The name has to match
exactly, extension included, and for the photographs so does the size (see
below).

## Report photographs

The three Dementia Singapore photographs on the report
(`src/components/screens/mambacares/`). All three are committed.

| File | Shows | Size |
| --- | --- | --- |
| `campaign-1.jpg` | Left photo beside the campaign progress bar | 900x509, 87 KB |
| `campaign-2.jpg` | Right photo beside the campaign progress bar | 900x509, 60 KB |
| `campaign-wide.jpg` | The photo above "One minute before you go." | 1400x934, 141 KB |

All three are cropped to fill a 16:9 frame (`object-cover`), so anything at the
top or bottom edge can be trimmed - keep the subject centred.

**Replacing one: match these sizes.** Nothing resizes an image on the way to
the phone - `OptionalImage` has to be able to see a 404 and fall back, so these
are served straight out of `public/` by a plain `<img>` and the file *is* the
download. The pair render about 160px wide each and the wide one about 342px,
so 900px and 1400px already leave a 3x screen pixels to spare. The versions
first uploaded here were 21 MB between them, one an 8192px camera frame shown
342px wide, which no phone on event mobile data would have finished loading.
Export at the sizes above, JPEG, quality around 80. If you change a format,
update the extension in `src/config/mambacares.ts` (`MAMBACARES_PHOTOS`).

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
| `running-partner-5.png` | okay anot running |
| `running-partner-6.png` | Bad Boys On The Run |

All six files are committed. `running-partner-2` is a script monogram with no
wordmark on it, so its name is still a placeholder - a name is the alt text, so
fill it in at `src/config/mambacares.ts` (`MAMBACARES_RUNNING_PARTNERS`) when
you know the crew.

The files are 80x80, which is a little soft on a 3x phone screen at 44px. Not
worth reshooting, but if a crew sends a bigger logo, 200x200 is the size to
ask for.

**Adding a seventh crew** also means editing the campaign paragraph in
`src/config/copy.ts`, which says "six running crews" in words - a test holds
the two together so the page can't end up saying six over seven logos.

## Giveaway sponsors

Five sponsor logos, about 40px across. Same export rules as the crews.

| File | Sponsor (left to right) |
| --- | --- |
| `sponsor-1.png` | (a red palm-tree emblem - name it) |
| `sponsor-2.png` | PRFM |
| `sponsor-3.png` | (a magenta disc emblem - name it) |
| `sponsor-4.png` | (an orange "S" mark with berries - name it) |
| `sponsor-5.png` | Sunday Shades |

All five files are committed. The three unnamed ones carry no legible wordmark,
so their alt text is still a placeholder; names and the number of slots live in
`src/config/mambacares.ts` (`MAMBACARES_GIVEAWAY_SPONSORS`).

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
donation short link are **not** in any of these files - they are in
`src/config/mambacares.ts`. Edit that file and redeploy to move the
thermometer.
