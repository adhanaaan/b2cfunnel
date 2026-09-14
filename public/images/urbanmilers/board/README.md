# /urbanmilers/leaderboard images

**Upload the files for the TV board here** - this folder,
`public/images/urbanmilers/board/`.

Through GitHub: open this folder, **Add file -> Upload files**, drag the images
in, commit. The names have to match exactly, extension included. Every file is
optional and picked up on the next deploy - while one is missing the board
draws without it (never a broken image), so the board is live and correct
before any of them land, and partial uploads are fine.

The board is the #MambaCares frame pointed at this run's bucket, so every box
below is that board's, at 1920x1080 (Figma 813:19115). **Export at 2x those
numbers** so it stays sharp on a 4K panel. Artwork is fitted, not cropped
(`object-contain`), so a transparent PNG keeps its shape - trim the empty space
around each cutout rather than leaving it in the file.

## Prizes (the peach panel, top left)

| File | Shows | Box on the board | Export at |
| --- | --- | --- | --- |
| `prize-drop.png` | every prize, arranged as it should look | 462x380 | **924x760** |

Compose the drop exactly as it should sit on the board and export the group as
one transparent PNG at 924x760 - the box's own ratio, so the export fills it
edge to edge. A file at a different ratio is fitted inside the box and centred.

The sponsor lines run about 75px into the box's left edge, between 215px and
320px down from its top (150px in, 430-640px down, in the 924x760 export) - the
text paints over anything there, so either keep that corner clear or let a
cutout sit behind the words on purpose.

**The sponsor lines** are `PRIZE_SPONSORS` at the top of
`app/urbanmilers/leaderboard/page.tsx` - one line per entry, as printed. They
start as the #MambaCares lines; edit them there for this run's sponsors. The
block grows downwards from a fixed top with about one line's clearance left, so
keep lines roughly the length they are now.

## Donation card (the orange panel)

| File | Shows | Box on the board | Export at |
| --- | --- | --- | --- |
| `donate-gift.png` | the hands-and-gift illustration over the card's bottom-right corner | 190x190 | 380x380 |
| `donate-qr.png` | **optional** - the campaign's own QR artwork | 254x254 | 508x508 |

`donate-qr.png` is the one file the board does not need: with no file there it
generates the code itself from `URBANMILERS_DONATION_URL`
(`src/config/urbanmilers.ts`), which is the same short link every Donate button
on this report opens, so the board and the funnel cannot point at two
campaigns.

**Anyone uploading one has to scan it first.** Whatever the file encodes is
where people's money goes, and nothing in the code can verify it: a code for
the wrong campaign is a wrong code, however right the artwork looks. Do not
copy `/images/mambacares/board/donate-qr.png` here without scanning it - it
carries that run's `?r=qr` source tag.

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
