# /onetrickpony board artwork

The prize cutouts on the ember card at `/onetrickpony/leaderboard`.

Every file here is **optional**. The board reads before any of them land and
each one appears the moment its file is committed, so the route can go up
before the artwork exists — which is exactly what happened on the night. A
missing file leaves the prize's words in place and nothing else.

| File | What it is | Status |
| --- | --- | --- |
| `prize-1st.svg` | The custom Stanley | a **drawing**, not a photograph — see below |
| `prize-2nd.png` | Grab vouchers | copied from the /urbanmilers board |
| `prize-3rd.png` | Starbucks gift card | copied from the /urbanmilers board |

The 2nd and 3rd files are this route's **own copies**, not a reference into
`public/images/urbanmilers/board/`. Same reason the boards are copies rather
than a shared component: re-dressing one event's prizes must not be able to
change another event's TV.

## The Stanley

`prize-1st.svg` is an original illustration — a tumbler with its handle, lid and
straw, drawn in the card's own cream so it sits on the ember rather than on top
of it. There was no photograph of the actual prize to use, and a drawing of the
thing beats a hole in the middle of the card.

Its engraved band is deliberately **blank**. "Custom" is what makes the prize,
but putting a mark on it would be inventing branding nobody approved, and the
board is read by a room.

To swap in a real photograph: put it at `prize-1st.svg`'s path with whatever
extension it has, and change the one `image:` line in `PRIZES.first` (top of
`app/onetrickpony/leaderboard/page.tsx`) to match. Transparent background,
portrait or square, around 1200px on the long edge for a 55" panel. The slot is
`object-contain`, so an odd ratio letterboxes rather than crops.

If a file ever goes missing, the card falls back to words and the 1ST chip comes
off with the picture — it never shows a broken image.

Note the 2nd-prize artwork has **$10** printed on the voucher itself. The board
labels it `$30 Grab voucher`, and the label is what the words say — replace the
file if the mismatch is going to be read from across the room.
