# /mambacares/leaderboard images

**Upload the files for the TV board here** - this folder, `public/images/mambacares/board/`.

Through GitHub: open this folder, **Add file -> Upload files**, drag the images
in, commit. The names have to match exactly, extension included. Every file is
optional and picked up on the next deploy - while one is missing the board
draws without it (never a broken image), so partial uploads are fine.

Sizes below are the box each file is drawn in at 1920x1080 (Figma 813:19115).
**Export at 2x those numbers** so the board stays sharp on a 4K panel. The
artwork is fitted, not cropped (`object-contain`), so a transparent PNG keeps
its shape - trim the empty space around each cutout rather than leaving it in
the file.

## Prizes (the peach panel, top left)

Five slots, listed back to front - the order they overlap in. All five files
are uploaded. Each box below is fitted to the file that is there now, so the
*artwork* inside it lands at the size the approved render shows.

| File | Shows | Artwork on the board | File it is fitted to |
| --- | --- | --- | --- |
| `prize-vest.png` | the PMAM vest, furthest back | 173x231 | 452x548 |
| `prize-hoodie.png` | the white 2050 Coffee hoodie | 200x307 | 694x738 |
| `prize-socks.png` | the socks, in the gap right of the hoodie | 100x141 | 322x300 |
| `prize-salt.png` | the SALTIFY box, right of the socks | 128x139 | 350x385 |
| `prize-shades.png` | the Sunday Shades, over the hoodie's lower left | 108x54 | 357x195 |

Cutouts on transparent backgrounds; each file is fitted whole inside its box
(`object-contain`). **The margins inside a file are part of the fit**: the
socks fill 62% of their file's width, and a box sized for the socks alone
would show them at 62% of the size. Replacing a file with the same margins is
just an upload. Replacing it with different margins - a tighter trim, a new
export - means re-fitting its row in `PRIZE_ART` (measure the artwork's
bounding box in the new file, solve for the same visible size), or trimming
the new file to its artwork first, which makes the fit hold on its own.

Slots break out of the panel's top and right edges as the design has them;
the hoodie also hangs below it, and the donate card paints over anything in
its lower edge. Only the hoodie shows when the board is opened on a phone.

### Changing the drop

Slots and sponsor names are both data at the top of
`app/mambacares/leaderboard/page.tsx`:

- `PRIZE_ART` - one row per prize: its file, and `box` (`left`, `top`,
  `width`, `height`) in the panel's own pixels. Adding a prize is a row plus a
  file; moving one is four numbers.
- `PRIZE_SPONSORS` - one line per entry, as printed. The block grows downwards
  from a fixed top and the panel has about one line's clearance left, so keep
  lines to roughly the length they are now.

Every slot but the hoodie's is placed from the approved render of the grown
drop rather than from Figma (the frame still shows the three-prize version), so
those are the ones to nudge if they sit a few pixels off. The eyebrow-to-title
gap in the panel comes from that render too.

## Donation card (the orange panel)

| File | Shows | Box on the board | Export at |
| --- | --- | --- | --- |
| `donate-gift.png` | the hands-and-gift illustration over the card's bottom-right corner | 190x190 | 380x380 |
| `donate-qr.png` | **optional** - the campaign's own QR artwork | 254x254 | 508x508 |

`donate-qr.png` is the one file the board does not need: with no file there it
generates the code itself from `MAMBACARES_DONATION_URL`
(`src/config/mambacares.ts`), which is the same short link every Donate button
on the report opens. The file committed here decodes to
`https://bit.ly/gms-mambacares?r=qr` - the campaign link with a QR source tag -
and was checked as such.

**Anyone replacing it has to scan it first.** Whatever the file encodes is
where people's money goes, and nothing in the code can verify it: a code for
the wrong campaign is a wrong code, however right the artwork looks.

## Photo band (along the bottom edge)

**Nothing to upload.** The band reuses the regatta board's three photos -
`/regatta-band-1.jpg`, `/regatta-band-2.png`, `/regatta-band-3.jpg` at the
repo root - as `/phkl`'s board does: one event's crowd standing in for the
next. They are cropped to fill (`object-cover`) at the widths this frame
shows of each, 408:764:748.

To put the run's own photos in the band instead, replace those three files at
the root (every board that uses them changes together), or point `BAND` in
`app/mambacares/leaderboard/page.tsx` at files here. Either way they want to
be roughly 3:1 or wider, ~160px tall or more, with faces near the vertical
centre.

## Already in the repo - nothing to upload

- The brain (`/images/event3/brain.webp`), the Gray Matter Solutions + NTU
  lockup in the fact strip (`/gms-ntu-logo.png`), and the three band photos
  above.
- The prize sponsor names ("From PMAM, SALTIFY, ...") are copy in
  `app/mambacares/leaderboard/page.tsx`, not logo files. The sponsor and crew
  logos on the report are a separate set, one folder up.
