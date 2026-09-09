# /phkl images

Every file here is optional: the code checks for it and falls back to a
placeholder (a gradient tile, a stand-in photo, or nothing at all) until the
real file is committed. Drop a file in with the exact name below and it
appears on the next deploy - no code change needed.

## Quiz intro ("your brain speed isn't fixed")

Three photos in a row, cropped to fill (`object-cover`), roughly 80-96px tall
on screen. Shoot or crop them portrait-ish/square; landscape works too.
Suggested export: ~600x600px, PNG or JPEG (match the extension the code
expects - see `PhklQuizIntro.tsx`).

| File | Shows |
| --- | --- |
| `quiz-intro-sleep.png` | Sleep |
| `quiz-intro-exercise.png` | Exercise |
| `quiz-intro-diet.png` | Diet |

Until they land, each tile is a warm gradient with its caption on top.

## Landing

| File | Shows |
| --- | --- |
| `partner-logo.png` | The Pantai Hospital KL lockup above the eyebrow |

Crop it tight to the mark. The landing sizes it by height, so a logo exported
on a square canvas is mostly transparent padding and renders about a third of
the size it should.

## Report

All four sit in the "Book your Memory Screening Package" section
(`PhklScreeningOffer.tsx`).

| File | Shows | Fallback while missing |
| --- | --- | --- |
| `memory-screening-package.png` | The hospital's own package poster | An HTML rebuild of the poster |
| `screening-devices.png` | The assessment on two phones and a laptop | `/landing/woman-tablet.png` |
| `report-1.png` | A page of the full report | The pair of shots is hidden |
| `report-2.png` | Another page of the full report | The pair of shots is hidden |

The poster renders full width of the section, so export it at least 1000px
wide.

`screening-devices.png` is a wide strip that renders about 326px across,
centred in a 229px-tall white card: export it around 1000x320 (roughly 3:1)
with the devices on a white or transparent ground.

`report-1.png` and `report-2.png` show side by side, each about 145px across
and cropped from the top, so give them a matching portrait shape - around
660x980 each (roughly 2:3). Anything below the first two thirds of the page
is cropped away, so put the heading and the chart up top.

## Leaderboard (`/phkl/leaderboard`)

The TV board (`app/phkl/leaderboard/page.tsx`, Figma 739:10645) takes three
files. Each is optional: while one is missing the board falls back (a
generated QR, a prize panel with no render, no coupon) rather than breaking.

| File | Shows | Export from Figma | Fallback while missing |
| --- | --- | --- | --- |
| `qr.png` | The QR code in the scan block | Node 739:10675, PNG, 2000x2000 | A code generated from `playUrlFor("phkl")` |
| `prize-grab.png` | The Grab gift box and vouchers over the prize panel | Node 740:10745, PNG at 2x (738x882) | The panel shows the offer alone |
| `prize-coupon.png` | The tilted coupon under the panel's bottom-right corner | Node 741:11216, PNG at 2x (about 154x154) | Nothing |

`qr.png` is shown as-is, with no frame of the board's own around it, so
export it with its black frame and quiet zone in the file (the regatta board's
`/regatta-qr.png` is the same shape). Whatever the file encodes is where
players land - the board cannot check it - so make it from the link the event
is actually using.

`prize-grab.png` is placed in the design's own 369x441 box, which overhangs
the panel's top and right edges, so export the frame (not just the artwork)
with its transparent surround intact. `prize-coupon.png` is placed in its
77x77 bounding box; the tilt is in the export, so nothing is rotated in code.

The photos along the bottom edge are the regatta board's (`/regatta-band-1.jpg`,
`/regatta-band-2.png`, `/regatta-band-3.jpg` at the root of `public/`), and
the brain and the GMS + NTU lockup are shared assets, so none of those need
uploading again.
