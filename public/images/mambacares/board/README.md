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

| File | Shows | Box on the board | Export at |
| --- | --- | --- | --- |
| `prize-hoodie.png` | the white 2050 Coffee hoodie, front of the group | 347x369 | 694x738 |
| `prize-vest.png` | the black ZODA vest, behind the hoodie | 344x344 | 688x688 |
| `prize-salt.png` | the SALTIFY box, front right | 175x192 | 350x384 |

Cutouts on transparent backgrounds. All three break out of the panel's top and
right edges, as the design has them; the hoodie also hangs below it, and the
donate card paints over anything in its lower edge. Only the hoodie shows when
the board is opened on a phone.

## Donation card (the orange panel)

| File | Shows | Box on the board | Export at |
| --- | --- | --- | --- |
| `donate-gift.png` | the hands-and-gift illustration over the card's bottom-right corner | 190x190 | 380x380 |
| `donate-qr.png` | **optional** - the campaign's own QR artwork | 254x254 | 508x508 |

`donate-qr.png` is the one file the board does not need: with no file there it
generates the code itself from `MAMBACARES_DONATION_URL`
(`src/config/mambacares.ts`), which is the same short link every Donate button
on the report opens. Upload a file only if you want the campaign-branded code -
and check it scans to that link first, because **whatever the file encodes is
where people's money goes**. Nothing in the code can verify it.

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
