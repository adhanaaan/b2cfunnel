# /22grams images

Every file here is optional: the code checks for it and draws a fallback in
its place until the real file is committed - never a broken image. Drop a file
in with the exact name below and it appears on the next deploy, no code change
needed.

The TV board's artwork is a separate set, one folder down: see
`public/images/22grams/board/README.md`.

## Sharp Shot poster (the free-drink takeover)

The poster a player gets for beating the clock, and the thing they screenshot
to redeem the drink (`src/components/screens/twentyTwoGrams/SharpShotPoster.tsx`).
It is full-bleed on a phone, so both files are fitted, not cropped
(`object-contain`) - trim the empty space around each cutout rather than
leaving it in the file.

| File | Shows | Renders at about | Export at | Until it lands |
| --- | --- | --- | --- | --- |
| `logo-22g.png` | the 22g wordmark, top right | 40px tall | 240px tall, transparent PNG | the letters `22g` set in the app's own bold sans |
| `sharp-shot-drink.png` | the hand holding the iced coffee | up to 32% of the screen's height | ~1200px tall, transparent PNG | a cup drawn in the poster's colours |

Both sit on the poster's deep navy (`#172340`), so export them on a
**transparent** background - a white canvas will show as a white box around
the artwork. The drink is a cutout of the hand and cup in the print poster;
shoot or crop it portrait, and keep the cup roughly centred in the frame since
the poster centres whatever it is given.

`logo-22g.png` is the only place the wordmark is drawn from, so the fallback
type is a stand-in rather than the brand mark. Upload the real one before the
event if the poster is going to be handed to staff.

## Nothing else to upload

The funnel's own screens (landing, instructions, game, report) are the shared
Daylight Ember set and read their artwork from `/images/event3/` and the repo
root - this event adds none of its own.
