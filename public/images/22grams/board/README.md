# /22grams/leaderboard images

**Upload the file for the TV board here** - this folder,
`public/images/22grams/board/`.

Through GitHub: open this folder, **Add file -> Upload files**, drag the image
in, commit. The name has to match exactly, extension included. The file is
optional and picked up on the next deploy - while it is missing the board draws
without it (never a broken image), so the board is live and correct before it
lands.

The board is the `/phkl` frame pointed at this event's bucket, so the box below
is that board's, at 1920x1080 (Figma 739:10645). **Export at 2x those numbers**
so it stays sharp on a 4K panel.

## The QR code (under the yellow "SCAN TO PLAY" label)

| File | Shows | Box on the board | Export at |
| --- | --- | --- | --- |
| `qr.png` | the signed-off code artwork, frame and all | 388x388 | **776x776** |

This is the one file the board does not need: with no file there it generates
the code itself from `playUrlFor("22grams")`
(`https://brainhealthcheck.vercel.app/22grams`), at the scannability settings
measured at a live event - level L, a four-module quiet zone, pure black on
white. The generated code is the safety net, not the default: artwork wins
because it is the exact code the design was signed off with.

**Anyone uploading one has to scan it first.** Whatever the file encodes is
where players land, and nothing in the code can verify it: a code for the wrong
URL is a wrong code, however right the artwork looks. In particular, do not
copy `/images/phkl/qr.png` or `/images/siloam/qr.png` here - those open another
event's funnel, and every score played through them lands in that event's
bucket.

The artwork is fitted, not cropped (`object-contain`), and the board draws no
frame around it - the uploaded code carries its own, and a second border would
sit around it.

## No prize artwork

`/phkl` and `/siloamneurosciencesummit` put a prize panel beside the code, with
a gift render breaking out of it. **This event has no prize**, as the
`/ntuhomecoming` arc it runs has none, so that panel carries the three steps of
the event instead and there is nothing to upload for it.

If a prize is announced later, that panel (`HowItWorksPanel` in
`app/22grams/leaderboard/page.tsx`) is where it goes, and `src/config/siloam.ts`
is the pattern to copy: the ladder in a config file, the podium depth read from
its length, so the panel and the number of gradient rows in the standings
cannot disagree about how deep the prize goes.

## Photo band (along the bottom edge)

**Nothing to upload.** The band reuses the regatta board's three photos -
`/regatta-band-1.jpg`, `/regatta-band-2.png`, `/regatta-band-3.jpg` at the repo
root - as the `/phkl`, `/mambacares` and `/urbanmilers` boards do. They are
cropped to fill (`object-cover`) at the widths this frame shows of each,
491:681:748.

To put this event's own photos in the band, point `BAND` in
`app/22grams/leaderboard/page.tsx` at files here (that leaves every other board
alone). They want to be roughly 3:1 or wider, ~160px tall or more, with faces
near the vertical centre.

## Already in the repo - nothing to upload

The brain (`/images/event3/brain.webp`), the Gray Matter Solutions + NTU lockup
in the fact strip (`/gms-ntu-logo.png`), and the three band photos.
