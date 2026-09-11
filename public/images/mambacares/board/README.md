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

**One file, the whole drop composed:**

| File | Shows | Box on the board | Export at |
| --- | --- | --- | --- |
| `prize-drop.png` | every prize, arranged as it should look | 462x380 | **924x760** |

Compose the drop in Figma (or wherever) exactly as it should sit on the
board - garments, socks, shades, box, overlapping however you like - and
export the group as one transparent PNG at 924x760. That is the box's own
ratio, so the export fills it edge to edge and what you see in the design
tool is what the board shows. A file at a different ratio is fitted inside
the box and centred, with the spare space left empty.

Where the box sits: its top-left is 39px right of the panel's left edge and
37px *above* the panel's top, and it runs to the leader row's left edge and
the donate card's top edge - so nothing on the board paints over any part of
it. It breaks out of the panel's top and right, as the design has it. The
sponsor lines ("From PMAM, ...") run about 75px into the box's left edge,
between 215px and 320px down from its top (150px in, 430-640px down, in the
924x760 export) - the text paints over anything there, so either keep that
corner clear or let a cutout sit behind the words on purpose.

The five separate cutouts that were here before (`prize-hoodie.png`,
`prize-vest.png`, `prize-socks.png`, `prize-salt.png`, `prize-shades.png`)
are gone: nothing reads them now, and they are in git history if a source is
ever needed. Placing each from its own file meant measuring every PNG's
margins and solving for a box, and the result still was not the composition
the designer had in front of them.

On a phone the same image sits at the panel's right edge, scaled to fit.

**The sponsor lines** are `PRIZE_SPONSORS` at the top of
`app/mambacares/leaderboard/page.tsx` - one line per entry, as printed. The
block grows downwards from a fixed top and the panel has about one line's
clearance left, so keep lines to roughly the length they are now.

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
