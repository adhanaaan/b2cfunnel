# /siloamneurosciencesummit images

Artwork for the Siloam Neuroscience Summit's TV board
(`/siloamneurosciencesummit/leaderboard`).

**Every file here is optional.** The board checks for each one and draws a
fallback in its place - never a broken image - until the real file is
committed. Drop a file in with the exact name below and it appears on the next
deploy, with no code change.

| File | Where it goes | Until it lands |
| --- | --- | --- |
| `qr.png` | The "SCAN TO PLAY < 60s" block, under the yellow label | A code generated in the browser, always encoding the production `/siloamneurosciencesummit` URL |
| `prize-grab.png` | The Grab gift render breaking out of the prize panel's top-right corner (369x441 in the frame; export at 2x) | The panel draws without it |
| `prize-coupon.png` | The small coupon tucked under the panel's bottom-right corner (77x77 in the frame; its tilt is baked into the export) | The panel draws without it |

## The QR code

The generated fallback always encodes the production URL. **Uploaded artwork
encodes whatever it was made from, and nothing in the code can check that** -
so a code exported against a preview deploy is a wrong code that looks right.
Generate it from `https://brainhealthcheck.vercel.app/siloamneurosciencesummit`.

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
