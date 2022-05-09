export default ZoomHandler;
export type Point = import("../photoswipe").Point;
export type Gestures = import("./gestures").default;
declare class ZoomHandler {
    /**
     * @param {Gestures} gestures
     */
    constructor(gestures: Gestures);
    gestures: import("./gestures").default;
    pswp: import("../photoswipe").default;
    /** @type {Point} */
    _startPan: Point;
    /** @type {Point} */
    _startZoomPoint: Point;
    /** @type {Point} */
    _zoomPoint: Point;
    start(): void;
    _startZoomLevel: number;
    _wasOverFitZoomLevel: boolean;
    change(): void;
    end(): void;
    /**
     * @private
     * @param {'x' | 'y'} axis
     * @param {number} currZoomLevel
     */
    private _calculatePanForZoomLevel;
    /**
     * Correct currZoomLevel and pan if they are
     * beyond minimum or maximum values.
     * With animation.
     *
     * @param {boolean=} ignoreGesture
     * Wether gesture coordinates should be ignored when calculating destination pan position.
     */
    correctZoomPan(ignoreGesture?: boolean | undefined): void;
}
