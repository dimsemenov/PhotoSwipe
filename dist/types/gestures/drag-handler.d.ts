export default DragHandler;
export type Point = import('../photoswipe.js').Point;
export type Gestures = import('./gestures.js').default;
/**
 * Handles single pointer dragging
 */
declare class DragHandler {
    /**
     * @param {Gestures} gestures
     */
    constructor(gestures: Gestures);
    gestures: import("./gestures.js").default;
    pswp: import("../photoswipe.js").default;
    /** @type {Point} */
    startPan: Point;
    /** @private */
    private _isDragCloseGesture;
    /** @private */
    private _dragCloseOrigin;
    /** @private */
    private _dragCloseAxis;
    start(): void;
    change(): void;
    end(): void;
    /**
     * @private
     * @param {'x' | 'y'} axis
     */
    private _finishPanGestureForAxis;
    /**
     * Update position of the main scroll,
     * or/and update pan position of the current slide.
     *
     * Should return true if it changes (or can change) main scroll.
     *
     * @private
     * @param {'x' | 'y'} axis
     * @returns {boolean}
     */
    private _panOrMoveMainScroll;
    /**
     * Relation between pan Y position and third of viewport height.
     *
     * When we are at initial position (center bounds) - the ratio is 0,
     * if position is shifted upwards - the ratio is negative,
     * if position is shifted downwards - the ratio is positive.
     *
     * @private
     * @param {number} panPos Current pan position along the axis.
     * @param {'x' | 'y'} axis Axis to calculate the drag-close ratio for.
     * @param {number} [originPos] Origin pan position. Defaults to slide center.
     * @returns {number}
     */
    private _getDragCloseRatio;
    /**
     * @private
     * @param {import('../slide/slide.js').default} currSlide
     * @returns {number}
     */
    private _getDragCloseZoomLevel;
    /**
     * Vertical drag-close is allowed only when gesture starts at a vertical edge
     * (top or bottom fully visible) and continues dragging outward from that edge.
     *
     * @private
     * @param {import('../slide/slide.js').default} currSlide
     * @param {number} deltaY
     * @returns {boolean}
     */
    private _canStartVerticalDragClose;
    /**
     * @private
     * @param {import('../slide/slide.js').default} currSlide
     * @param {'x' | 'y'} axis
     * @param {number} delta
     * @returns {boolean}
     */
    private _canUseDragClose;
    /**
     * @private
     * @returns {boolean}
     */
    private _canUseHorizontalDragClose;
    /**
     * @private
     * @param {import('../slide/slide.js').default} currSlide
     * @param {number} deltaX
     * @returns {boolean}
     */
    private _canStartHorizontalDragClose;
    /**
     * Set pan position of the current slide.
     * Apply friction if the position is beyond the pan bounds,
     * or if custom friction is defined.
     *
     * @private
     * @param {'x' | 'y'} axis
     * @param {number} potentialPan
     * @param {number} [customFriction] (0.1 - 1)
     */
    private _setPanWithFriction;
}
