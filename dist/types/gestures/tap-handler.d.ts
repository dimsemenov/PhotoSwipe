export default TapHandler;
/**
 * <T, P>
 */
export type AddPostfix<T, P> = import('../types.js').AddPostfix<T, P>;
export type Gestures = import('./gestures.js').default;
export type Actions = 'imageClick' | 'bgClick' | 'tap' | 'doubleTap';
export type Point = {
    x?: number;
    y?: number;
};
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
     * @param {Actions} actionName
     * @param {Point} point
     * @param {PointerEvent} originalEvent
     */
    _doClickOrTapAction(actionName: Actions, point: Point, originalEvent: PointerEvent): void;
}
