export default Keyboard;
export type PhotoSwipe = import('./photoswipe.js').default;
/**
 * <T>
 */
export type Methods<T> = import('./types.js').Methods<T>;
/** @typedef {import('./photoswipe.js').default} PhotoSwipe */
/**
 * @template T
 * @typedef {import('./types.js').Methods<T>} Methods<T>
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
    pswp: import("./photoswipe.js").default;
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
