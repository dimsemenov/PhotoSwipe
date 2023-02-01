export default Gestures;
export type PhotoSwipe = import('../photoswipe.js').default;
export type Point = import('../photoswipe.js').Point;
/**
 * Gestures class bind touch, pointer or mouse events
 * and emits drag to drag-handler and zoom events zoom-handler.
 *
 * Drag and zoom events are emited in requestAnimationFrame,
 * and only when one of pointers was actually changed.
 */
declare class Gestures {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp: PhotoSwipe);
    pswp: import("../photoswipe.js").default;
    /** @type {'x' | 'y' | null} */
    dragAxis: 'x' | 'y' | null;
    /** @type {Point} */
    p1: Point;
    /** @type {Point} */
    p2: Point;
    /** @type {Point} */
    prevP1: Point;
    /** @type {Point} */
    prevP2: Point;
    /** @type {Point} */
    startP1: Point;
    /** @type {Point} */
    startP2: Point;
    /** @type {Point} */
    velocity: Point;
    /** @type {Point}
     * @private
     */
    private _lastStartP1;
    /** @type {Point}
     * @private
     */
    private _intervalP1;
    /** @private */
    private _numActivePoints;
    /** @type {Point[]}
     * @private
     */
    private _ongoingPointers;
    /** @private */
    private _touchEventEnabled;
    /** @private */
    private _pointerEventEnabled;
    supportsTouch: boolean;
    /** @private */
    private _intervalTime;
    /** @private */
    private _velocityCalculated;
    isMultitouch: boolean;
    isDragging: boolean;
    isZooming: boolean;
    /** @type {number | null} */
    raf: number | null;
    /** @type {NodeJS.Timeout | null}
     * @private
     */
    private _tapTimer;
    drag: DragHandler;
    zoomLevels: ZoomHandler;
    tapHandler: TapHandler;
    /**
     * @private
     * @param {'mouse' | 'touch' | 'pointer'} pref
     * @param {'down' | 'start'} down
     * @param {'up' | 'end'} up
     * @param {'cancel'} [cancel]
     */
    private _bindEvents;
    /**
     * @param {PointerEvent} e
     */
    onPointerDown(e: PointerEvent): void;
    /**
     * @param {PointerEvent} e
     */
    onPointerMove(e: PointerEvent): void;
    /**
     * @private
     */
    private _finishDrag;
    /**
     * @param {PointerEvent} e
     */
    onPointerUp(e: PointerEvent): void;
    /**
     * @private
     */
    private _rafRenderLoop;
    /**
     * Update velocity at 50ms interval
     *
     * @private
     * @param {boolean} [force]
     */
    private _updateVelocity;
    /**
     * @private
     * @param {PointerEvent} e
     */
    private _finishTap;
    /**
     * @private
     */
    private _clearTapTimer;
    /**
     * Get velocity for axis
     *
     * @private
     * @param {'x' | 'y'} axis
     * @param {number} duration
     * @returns {number}
     */
    private _getVelocity;
    /**
     * @private
     */
    private _rafStopLoop;
    /**
     * @private
     * @param {PointerEvent} e
     */
    private _preventPointerEventBehaviour;
    /**
     * Parses and normalizes points from the touch, mouse or pointer event.
     * Updates p1 and p2.
     *
     * @private
     * @param {PointerEvent | TouchEvent} e
     * @param {'up' | 'down' | 'move'} pointerType Normalized pointer type
     */
    private _updatePoints;
    /** update points that were used during previous rAF tick
     * @private
     */
    private _updatePrevPoints;
    /** update points at the start of gesture
     * @private
     */
    private _updateStartPoints;
    /** @private */
    private _calculateDragDirection;
    /**
     * Converts touch, pointer or mouse event
     * to PhotoSwipe point.
     *
     * @private
     * @param {Touch | PointerEvent} e
     * @param {Point} p
     * @returns {Point}
     */
    private _convertEventPosToPoint;
    /**
     * @private
     * @param {PointerEvent} e
     */
    private _onClick;
}
import DragHandler from "./drag-handler.js";
import ZoomHandler from "./zoom-handler.js";
import TapHandler from "./tap-handler.js";
