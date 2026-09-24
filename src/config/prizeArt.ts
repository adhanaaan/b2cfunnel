/**
 * The Grab prize artwork every board with a Grab prize draws, served from
 * public/images/general/ (see the README there).
 *
 * Shared rather than per event: the gift box, the coupon and the voucher stack
 * are Grab's own artwork, not any one event's, and the same three renders sit
 * on the /phkl, /phkl-2, /phkl-3 and Siloam summit boards. One copy in one
 * folder, named for what it shows, so a fresh export reaches every board at
 * once and no event's board borrows another event's folder.
 *
 * Every file is optional in the boards that draw it (they go through
 * OptionalImage), so a missing file thins the panel out rather than breaking.
 */

/**
 * The open gift box with the Grab tokens spilling out, exported with its
 * transparent surround at 2x the 369x441 box the designs place it in
 * (738x882) - Figma 740:10745 on /phkl, 892:7176 on /phkl-3.
 */
export const GRAB_GIFT_BOX_IMAGE = "/images/general/grab-gift-box.png";

/**
 * The small tilted coupon tucked under the /phkl prize panel's bottom-right
 * corner (Figma 741:11216). Its tilt is in the export.
 */
export const GRAB_COUPON_IMAGE = "/images/general/grab-coupon.png";

/**
 * The stack of three Grab e-vouchers hanging over the prize panel's bottom
 * edge (Figma 892:7220). Exported UPRIGHT: the boards apply the design's
 * 7-degree tilt themselves, so a pre-tilted file would be rotated twice.
 */
export const GRAB_VOUCHER_IMAGE = "/images/general/grab-voucher.png";
