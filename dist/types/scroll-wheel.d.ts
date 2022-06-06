export default ScrollWheel;
export type PhotoSwipe = import('./photoswipe.js').default;
/** @typedef {import('./photoswipe.js').default} PhotoSwipe */
/**
 * Handles scroll wheel.
 * Can pan and zoom current slide image.
 */
declare class ScrollWheel {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp: PhotoSwipe);
    pswp: import("./photoswipe.js").default;
    /**
     * @private
     * @param {WheelEvent} e
     */
    private _onWheel;
}
