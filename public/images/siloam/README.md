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

## The QR code

The design's own QR (`892:7164`) is **not** used, and must not be: it is the
`/phkl` code, and it would send players at an Indonesian summit to the Kuala
Lumpur funnel. The board generates its own instead.

The generated fallback always encodes the production URL. **Uploaded artwork
encodes whatever it was made from, and nothing in the code can check that** -
so a code exported against a preview deploy is a wrong code that looks right.
Generate it from `https://brainhealthcheck.vercel.app/siloamneurosciencesummit`.

## The Grab artwork

The gift render (`892:7176`) and the tilted e-voucher stack (`892:7220`) are
not in this folder. They are Grab's artwork rather than this event's, and are
the shared files in `public/images/general/` (`grab-gift-box.png`,
`grab-voucher.png`) that every board with a Grab prize draws. See the README
there for their boxes and export sizes.

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
