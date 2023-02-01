export default Keyboard;
export type PhotoSwipe = import('./photoswipe.js').default;
/**
 * <T>
 */
export type Methods<T> = import('./types.js').Methods<T>;
/**
 * - Manages keyboard shortcuts.
 * - Helps trap focus within photoswipe.
 */
declare class Keyboard {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp: PhotoSwipe);
    pswp: import("./photoswipe.js").default;
    /** @private */
    private _wasFocused;
    /** @private */
    private _focusRoot;
    /**
     * @private
     * @param {KeyboardEvent} e
     */
    private _onKeyDown;
    /**
     * Trap focus inside photoswipe
     *
     * @private
     * @param {FocusEvent} e
     */
    private _onFocusIn;
}
