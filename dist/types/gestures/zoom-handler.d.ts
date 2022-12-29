export default ZoomHandler;
export type Point = import('../photoswipe.js').Point;
export type Gestures = import('./gestures.js').default;
declare class ZoomHandler {
    /**
     * @param {Gestures} gestures
     */
    constructor(gestures: Gestures);
    gestures: import("./gestures.js").default;
    /**
     * @private
     * @type {Point}
     */
    private _startPan;
    /**
     * @private
     * @type {Point}
     */
    private _startZoomPoint;
    /**
     * @private
     * @type {Point}
     */
    private _zoomPoint;
    /** @private */
    private _wasOverFitZoomLevel;
    /** @private */
    private _startZoomLevel;
    start(): void;
    change(): void;
    end(): void;
    /**
     * @private
     * @param {'x' | 'y'} axis
     * @param {number} currZoomLevel
     * @returns {number}
     */
    private _calculatePanForZoomLevel;
    /**
     * Correct currZoomLevel and pan if they are
     * beyond minimum or maximum values.
     * With animation.
     *
     * @param {boolean} [ignoreGesture]
     * Wether gesture coordinates should be ignored when calculating destination pan position.
     */
    correctZoomPan(ignoreGesture?: boolean | undefined): void;
}
