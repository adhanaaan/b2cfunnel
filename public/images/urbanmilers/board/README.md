# /urbanmilers/leaderboard images

**Upload the files for the TV board here** - this folder,
`public/images/urbanmilers/board/`.

Through GitHub: open this folder, **Add file -> Upload files**, drag the images
in, commit. The names have to match exactly, extension included. Every file is
optional and picked up on the next deploy - while one is missing the board
draws without it (never a broken image), so the board is live and correct
before any of them land, and partial uploads are fine.

The board is Figma 1080:8131 ("Leaderboard - /urbanmilers/leaderboard" in the
LITE ReCOGnAIze file), at 1920x1080. **Export at 2x the box** so it stays sharp
on a 4K panel. Artwork is fitted, not cropped (`object-contain`), so a
transparent PNG keeps its shape - trim the empty space around each cutout, and
export each one as it is seen in the frame (the design crops some of them).

## Prizes (the orange card, in the middle)

| File | Shows | Box on the board | Export at |
| --- | --- | --- | --- |
| `prize-1st.png` | the Novablast 6 shoes, under the title | 425x255 | **850x510** |
| `prize-2nd.png` | the Grab vouchers | 134x132 | **268x264** |
| `prize-3rd.png` | the Starbucks card in its envelope | 115x116 | **230x232** |

The 1ST/2ND/3RD chips are drawn by the board, so leave them out of the
exports. If you already exported the files at the previous board's sizes, they
still work: each is fitted into its box, not cropped.

**The words** on the card - "Fastest mind", "Win a pair of Novablast 6!", the
2nd and 3rd amounts and labels - are `PRIZES` at the top of
`app/urbanmilers/leaderboard/page.tsx`. Change a prize there and swap its file
here.

## The QR code (the left column)

**Nothing to upload.** The board generates the code itself from this run's
route - `https://brainhealthcheck.vercel.app/urbanmilers` (`playUrlFor` in
`src/config/eventLinks.ts`) - so it always opens this funnel on production,
whatever machine the board is running on. It is not replaceable by a file on
purpose: an exported code encodes whatever it was made from, and nothing here
could check it.

## Photo band (along the bottom edge)

**Nothing to upload.** The band reuses the regatta board's three photos -
`/regatta-band-1.jpg`, `/regatta-band-2.png`, `/regatta-band-3.jpg` at the repo
root - as the #MambaCares and `/phkl` boards do. They are cropped to fill
(`object-cover`) at the widths this frame shows of each, 408:764:748.

To put this run's own photos in the band, point `BAND` in
`app/urbanmilers/leaderboard/page.tsx` at files here (that leaves every other
board alone). They want to be roughly 3:1 or wider, ~160px tall or more, with
faces near the vertical centre.

## Already in the repo - nothing to upload

- The brain (`/images/event3/brain.webp`), the Gray Matter Solutions + NTU
  lockup in the fact strip (`/gms-ntu-logo.png`), and the three band photos.
- The crew and sponsor logos on the **report** are a separate set and are
  shared with `/mambacares` - see the README one folder up.
