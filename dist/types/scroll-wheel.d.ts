export default ScrollWheel;
export type PhotoSwipe = import("./photoswipe").default;
/** @typedef {import("./photoswipe").default} PhotoSwipe */
/**
 * Handles scroll wheel.
 * Can pan and zoom current slide image.
 */
declare class ScrollWheel {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp: PhotoSwipe);
    pswp: import("./photoswipe").default;
    /**
     * @private
     * @param {WheelEvent} e
     */
    private _onWheel;
}
