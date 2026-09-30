# /onetrickpony board artwork

The prize cutouts on the ember card at `/onetrickpony/leaderboard`.

Every file here is **optional**. The board reads before any of them land and
each one appears the moment its file is committed, so the route can go up
before the artwork exists — which is exactly what happened on the night. A
missing file leaves the prize's words in place and nothing else.

| File | What it is | Status |
| --- | --- | --- |
| `prize-1st.png` | The custom Stanley, cut out on transparency | **not supplied** — the 1st prize currently reads as words alone |
| `prize-2nd.png` | Grab vouchers | copied from the /urbanmilers board |
| `prize-3rd.png` | Starbucks gift card | copied from the /urbanmilers board |

The 2nd and 3rd files are this route's **own copies**, not a reference into
`public/images/urbanmilers/board/`. Same reason the boards are copies rather
than a shared component: re-dressing one event's prizes must not be able to
change another event's TV.

## Adding the Stanley

Drop a cutout at `prize-1st.png` — transparent background, roughly 2:1 landscape
(the slot is 425x255 in the design, and the image is `object-contain`, so it
will letterbox rather than crop if the ratio is off). Around 1200px on the long
edge is plenty for a 55" panel. Nothing else needs editing: the board picks it
up on the next deploy.

Note the 2nd-prize artwork has **$10** printed on the voucher itself. The board
labels it `$30 Grab voucher`, and the label is what the words say — replace the
file if the mismatch is going to be read from across the room.
