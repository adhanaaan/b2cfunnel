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

## Nothing else to upload

The funnel's own screens (landing, primers, game, report) are the shared
Daylight Ember and PHKL sets and read their artwork from `/images/event3/`,
`/images/phkl/` and the repo root - this event adds none of its own.
