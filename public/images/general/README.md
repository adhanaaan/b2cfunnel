# Shared images (not any one event's)

Artwork that more than one event's board draws. It lives here, named for what
it shows, so no board has to read another event's folder, and a fresh export
reaches every board at once.

This folder is **not** the `/general` event's. That route has no artwork of
its own. The name means "shared", as in general-purpose.

The paths are exported from `src/config/prizeArt.ts`. Boards import them from
there and never type the path out themselves, so a rename happens in one
place.

## The Grab prize

Every board that offers Grab vouchers draws these three: `/phkl`, `/phkl-2`,
`/phkl-3` and the Siloam summit (both versions). Each file is optional. A
board with one missing draws the panel without it, never a broken image.

| File | Shows | Box on the board | Export |
| --- | --- | --- | --- |
| `grab-gift-box.png` | The open gift box with the Grab tokens spilling out, breaking out of the prize panel's top-right corner | 369x441 (Figma `740:10745` on `/phkl`, `892:7176` on `/phkl-3` and the summit) | PNG at 2x, 738x882, with its transparent surround intact |
| `grab-coupon.png` | The small tilted coupon under the `/phkl` panel's bottom-right corner | 77x77 (Figma `741:11216`) | PNG at 2x, about 154x154. The tilt is in the file |
| `grab-voucher.png` | The stack of three Grab e-vouchers hanging over the panel's bottom edge | 181x179, tilted 7 degrees **by the board** (Figma `892:7220`) | PNG at 2x or larger, **upright**. A pre-tilted export would be rotated twice |

`/phkl` and `/phkl-2` draw the gift box and the coupon. `/phkl-3` and the
summit draw the gift box and the voucher stack.
