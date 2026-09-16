# /siloamneurosciencesummit images

Artwork for the Siloam Neuroscience Summit's TV board
(`/siloamneurosciencesummit/leaderboard`), built to Figma `892:7134`.

**Every file here is optional.** The board checks for each one and draws a
fallback in its place - never a broken image - until the real file is
committed. Drop a file in with the exact name below and it appears on the next
deploy, with no code change.

| File | Where it goes | Box in the frame | Until it lands |
| --- | --- | --- | --- |
| `qr.png` | The "SCAN TO PLAY < 60s" block, under the yellow label | 388x388 | A code generated in the browser, always encoding the production `/siloamneurosciencesummit` URL |
| `prize-grab.png` | The Grab gift render breaking out of the prize panel's top-right corner (`892:7176`) | 369x441 at 458px in, 52px above the panel's top; export at 2x | `/images/phkl/prize-grab.png`, the same render, which fills that box exactly |
| `prize-voucher.png` | The tilted Grab e-voucher stack over the panel's bottom edge (`892:7220`) | 181x179 at 603px in, 242px down, tilted 7 degrees **by the board** - export it upright | **Nothing is drawn.** This is the one piece of the design the board is missing |

## The QR code

The design's own QR (`892:7164`) is **not** used, and must not be: it is the
`/phkl` code, and it would send players at an Indonesian summit to the Kuala
Lumpur funnel. The board generates its own instead.

The generated fallback always encodes the production URL. **Uploaded artwork
encodes whatever it was made from, and nothing in the code can check that** -
so a code exported against a preview deploy is a wrong code that looks right.
Generate it from `https://brainhealthcheck.vercel.app/siloamneurosciencesummit`.

## The e-voucher

`prize-voucher.png` is the only thing standing between this board and the
design. Export `892:7220` from the Figma frame at 2x (362x358) with the tilt
**removed** - the board applies the 7 degrees itself, so a pre-tilted export
would be rotated twice.

## What this folder does NOT hold

- **The photo band** along the bottom edge needs nothing uploaded: it reuses
  the regatta board's three photos from the repo root, as `/phkl` does.
- **The three quiz-primer photos** (sleep, exercise, diet) are read from
  `/images/phkl/`, shared rather than duplicated - they are generic lifestyle
  shots with nothing Malaysian in them. Give this event its own by pointing
  `PhklQuizIntro.tsx` at a per-variant path; until then the summit shows the
  same three.
- **A partner logo.** This landing has no partner lockup on it (it is the
  #MambaCares landing), so there is no slot for one.
