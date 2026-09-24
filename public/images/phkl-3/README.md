# /phkl-3 images

Artwork for the third Pantai Hospital KL activation's TV board
(`/phkl-3/leaderboard`, `app/phkl-3/leaderboard/page.tsx`), built to Figma
`892:7134`.

The one file here is optional. Until it lands the board draws a fallback in
its place, never a broken image. Drop it in with the exact name below and it
appears on the next deploy, with no code change.

| File | Where it goes | Box in the frame | Until it lands |
| --- | --- | --- | --- |
| `qr.png` | The "SCAN TO PLAY < 60s" block, under the yellow label | 388x388 | A code generated in the browser, always encoding the production `/phkl-3` URL |

## The QR code

The design's own QR (`892:7164`) is **not** used, and must not be: it is the
`/phkl` code, and it would put this room's players on the first activation's
board. That is also why this board does not read `/images/phkl/qr.png`.

The generated fallback always encodes the production URL. **Uploaded artwork
encodes whatever it was made from, and nothing in the code can check that**,
so a code exported against a preview deploy is a wrong code that looks right.
Generate it from `https://brainhealthcheck.vercel.app/phkl-3`, with its black
frame and quiet zone in the file (the board draws no frame of its own around
artwork).

## What this folder does NOT hold

- **The Grab gift box and the voucher stack** (`892:7176`, `892:7220`) are the
  shared renders in `public/images/general/`, the same files the other Grab
  boards draw.
- **The photo band** along the bottom edge reuses the regatta board's three
  photos from the repo root, as `/phkl` does.
- **The landing's partner logo and the report's artwork** are `/phkl`'s, read
  from `public/images/phkl/`, since this is the same partner and the same
  report.
