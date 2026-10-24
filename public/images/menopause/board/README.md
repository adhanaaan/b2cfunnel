# /menopause board artwork

The prize picture on the ember card at `/menopause/leaderboard`.

| File | What it is |
| --- | --- |
| `prize-1st.svg` | The Stanley tumbler — a **drawing**, not a photograph |

The file is **optional**. The board reads before it lands and it appears the
moment it is committed; a missing file leaves the prize's words in place and
never a broken-image icon on a 55" panel.

## Its own copy, not the quiz night's

This is a separate file from `public/images/onetrickpony/board/prize-1st.svg`
even though it is the same drawing, for the same reason the boards are copies
rather than a shared component: re-dressing one event's prize must not change
another event's TV.

The one real difference is the engraving. The quiz night's tumbler reads
`BRAIN SPEED CHAMPION OTP`, which belongs to that night. **This one's band is
deliberately blank** — what this campaign's prize will be engraved with (if
anything) is not known here, and putting words on the drawing that the winner
does not find on the real thing is worse than putting none.

To add it, drop a `<text>` block where the comment in the SVG says, in the same
serif at the same size.

## Using a photograph instead

Put it beside this file and change the one `image:` line in `PRIZES.first` (top
of `app/menopause/leaderboard/page.tsx`) to match its name. Background knocked
out, portrait or square, around 1200px on the long edge for a 55" panel. The
slot is `object-contain`, so an odd ratio letterboxes rather than crops.
