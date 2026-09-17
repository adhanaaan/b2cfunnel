# /22grams images

Every file here is optional: the code checks for it and draws a fallback in
its place until the real file is committed - never a broken image. Drop a file
in with the exact name below and it appears on the next deploy, no code change
needed.

The TV board's artwork is a separate set, one folder down: see
`public/images/22grams/board/README.md`.

## Sharp Shot poster (the free-drink pop-up)

The card a player gets for beating the clock, and the thing they screenshot to
redeem the drink. Built to **Figma 925:9236**, a 340x536 card, so the two boxes
below are that frame's.
(`src/components/screens/twentyTwoGrams/SharpShotPoster.tsx`.)

| File | Shows | Box in the frame | Export at | Until it lands |
| --- | --- | --- | --- | --- |
| `sharp-shot-drink.png` | the hand holding the iced coffee | 184x332, flush into the bottom-left corner | **552x996** (3x) | a cup drawn in the poster's colours |
| `logo-22g.png` | the 22g wordmark, top right | 55x24 | **220x96** (4x) | the letters `22g` set in the app's own bold sans |

**These two are the exports the design already has** - `image 322` and
`image 323` on that Figma node. Export them from there rather than
re-sourcing: the drink is a specific cut-out, and the wordmark is the brand
mark rather than type.

Both sit on the poster's ember gradient, so export them on a **transparent**
background - a white canvas will show as a box around the artwork.

The drink is cropped to fill its box (`object-cover`), so give it the box's own
3:5.4 ratio and keep the cup roughly centred; anything squarer will be cropped
left and right. The wordmark is fitted (`object-contain`), so trim the empty
space around it rather than leaving it in the file.

## The "follow us" card

The dark band under the offer on the poster, and every other five seconds on
the report's pinned banner (Figma 942:11389). It needs **one file, and it does
not live in this folder** - it is a Gray Matter Solutions asset, not this
event's, so it sits at the repo root beside the other GMS marks:

| File | Shows | Box in the frame | Export at | Until it lands |
| --- | --- | --- | --- | --- |
| `public/gms-instagram-qr.png` | the styled Instagram code, with `@graymatter.solutions` set under it | 83.9x85 (square, near enough) | **512x512** | a plain black code for the same profile, drawn by the build |

It is the tile in the design, not a screenshot of one: crop to the white
rounded card itself, with no page around it. The card gives it its own 3.7px
radius, and it is cropped to fill (`object-cover`), so anything far off square
will lose its edges.

Until it is there the card draws its own code from `GMS_INSTAGRAM_URL`
(`src/config/eventLinks.ts`) - plain black, no handle under it - so the card is
scannable from the day it ships. **Whoever uploads the artwork has to scan it
first**: nothing in the code can check where it goes.

## Nothing else to upload

The funnel's own screens (landing, primers, game, report) are the shared
Daylight Ember and PHKL sets and read their artwork from `/images/event3/`,
`/images/phkl/` and the repo root - this event adds none of its own.
