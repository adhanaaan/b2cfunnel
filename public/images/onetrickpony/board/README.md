# /onetrickpony board artwork

The prize picture on the ember card at `/onetrickpony/leaderboard`.

There is **one prize** on this board, by the host's call: the custom Stanley for
the single fastest time of the night. The runner-up cutouts that were here (a
Grab voucher and a Starbucks card, copied from the /urbanmilers board) came out
with them.

| File | What it is |
| --- | --- |
| `prize-1st.svg` | The custom Stanley — a **drawing**, not a photograph |

The file is **optional**. The board reads before it lands and it appears the
moment it is committed, so the route can go up before any artwork exists — which
is exactly what happened on the night. A missing file leaves the prize's words
in place and nothing else; a broken-image icon on a 55" panel mid-round is the
one thing that must not happen.

## The Stanley

`prize-1st.svg` is an original illustration drawn from a photograph of the
actual prize: the white Quencher, its squared handle, the clear lid with the
straw nub, and the ridge where the barrel steps down to the base. The engraving
is the real one, word for word —

```
BRAIN
SPEED
CHAMPION
OTP
```

— and it is the reason the drawing works at all on a board. It is what makes
the prize custom, so it has to be legible from across the room; a phone photo
taken at the bar under the venue's purple lighting would not have been.

The Stanley wordmark and the bear mark on the real tumbler are **not** drawn.
Reproducing another company's marks on a screen a whole room reads is not
something to do without being asked, and the engraving alone identifies the
prize.

To swap in a photograph instead: put it beside this file and change the one
`image:` line in `PRIZES.first` (top of
`app/onetrickpony/leaderboard/page.tsx`) to match its name. Background knocked
out, portrait or square, around 1200px on the long edge for a 55" panel. The
slot is `object-contain`, so an odd ratio letterboxes rather than crops.
