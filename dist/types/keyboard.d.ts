export default Keyboard;
export type PhotoSwipe = import("./photoswipe").default;
/**
 * <T>
 */
export type Methods<T> = import("./types").Methods<T>;
/** @typedef {import("./photoswipe").default} PhotoSwipe */
/**
 * @template T
 * @typedef {import("./types").Methods<T>} Methods<T>
 */
/**
 * - Manages keyboard shortcuts.
 * - Heps trap focus within photoswipe.
 */
declare class Keyboard {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp: PhotoSwipe);
    pswp: import("./photoswipe").default;
    _focusRoot(): void;
    _wasFocused: boolean;
    /**
     * @param {KeyboardEvent} e
     */
    _onKeyDown(e: KeyboardEvent): void;
    /**
     * Trap focus inside photoswipe
     *
     * @param {FocusEvent} e
     */
    _onFocusIn(e: FocusEvent): void;
}
