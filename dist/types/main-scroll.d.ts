export default MainScroll;
export type PhotoSwipe = import('./photoswipe.js').default;
export type Slide = import('./slide/slide.js').default;
export type ItemHolder = {
    el: HTMLDivElement;
    slide?: Slide;
};
/**
 * Handles movement of the main scrolling container
 * (for example, it repositions when user swipes left or right).
 *
 * Also stores its state.
 */
declare class MainScroll {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp: PhotoSwipe);
    pswp: import("./photoswipe.js").default;
    x: number;
    /** @type {number} */
    slideWidth: number;
    /** @type {ItemHolder[]} */
    itemHolders: ItemHolder[];
    /**
     * Position the scroller and slide containers
     * according to viewport size.
     *
     * @param {boolean=} resizeSlides Whether slides content should resized
     */
    resize(resizeSlides?: boolean | undefined): void;
    /**
     * Reset X position of the main scroller to zero
     */
    resetPosition(): void;
    _currPositionIndex: number;
    _prevPositionIndex: number;
    _containerShiftIndex: number;
    /**
     * Create and append array of three items
     * that hold data about slides in DOM
     */
    appendHolders(): void;
    /**
     * Whether the main scroll can be horizontally swiped to the next or previous slide.
     */
    canBeSwiped(): boolean;
    /**
     * Move main scroll by X amount of slides.
     * For example:
     *   `-1` will move to the previous slide,
     *    `0` will reset the scroll position of the current slide,
     *    `3` will move three slides forward
     *
     * If loop option is enabled - index will be automatically looped too,
     * (for example `-1` will move to the last slide of the gallery).
     *
     * @param {number} diff
     * @param {boolean=} animate
     * @param {number=} velocityX
     * @returns {boolean} whether index was changed or not
     */
    moveIndexBy(diff: number, animate?: boolean | undefined, velocityX?: number | undefined): boolean;
    /**
     * X position of the main scroll for the current slide
     * (ignores position during dragging)
     */
    getCurrSlideX(): number;
    /**
     * Whether scroll position is shifted.
     * For example, it will return true if the scroll is being dragged or animated.
     */
    isShifted(): boolean;
    /**
     * Update slides X positions and set their content
     */
    updateCurrItem(): void;
    /**
     * Move the X position of the main scroll container
     *
     * @param {number} x
     * @param {boolean=} dragging
     */
    moveTo(x: number, dragging?: boolean | undefined): void;
}
