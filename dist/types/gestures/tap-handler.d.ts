export default TapHandler;
/**
 * <T, P>
 */
export type AddPostfix<T extends string, P extends string> = import('../types.js').AddPostfix<T, P>;
export type Gestures = import('./gestures.js').default;
export type Point = import('../photoswipe.js').Point;
export type Actions = 'imageClick' | 'bgClick' | 'tap' | 'doubleTap';
/**
 * Tap, double-tap handler.
 */
declare class TapHandler {
    /**
     * @param {Gestures} gestures
     */
    constructor(gestures: Gestures);
    gestures: import("./gestures.js").default;
    /**
     * @param {Point} point
     * @param {PointerEvent} originalEvent
     */
    click(point: Point, originalEvent: PointerEvent): void;
    /**
     * @param {Point} point
     * @param {PointerEvent} originalEvent
     */
    tap(point: Point, originalEvent: PointerEvent): void;
    /**
     * @param {Point} point
     * @param {PointerEvent} originalEvent
     */
    doubleTap(point: Point, originalEvent: PointerEvent): void;
    /**
     * @private
     * @param {Actions} actionName
     * @param {Point} point
     * @param {PointerEvent} originalEvent
     */
    private _doClickOrTapAction;
}
