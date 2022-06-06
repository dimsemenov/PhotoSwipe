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
    /** @type {'x' | 'y'} */
    dragAxis: 'x' | 'y';
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
    /** @type {Point} */
    _lastStartP1: Point;
    /** @type {Point} */
    _intervalP1: Point;
    _numActivePoints: number;
    /** @type {Point[]} */
    _ongoingPointers: Point[];
    _touchEventEnabled: boolean;
    _pointerEventEnabled: boolean;
    supportsTouch: boolean;
    drag: DragHandler;
    zoomLevels: ZoomHandler;
    tapHandler: TapHandler;
    /**
     *
     * @param {'mouse' | 'touch' | 'pointer'} pref
     * @param {'down' | 'start'} down
     * @param {'up' | 'end'} up
     * @param {'cancel'} [cancel]
     */
    _bindEvents(pref: 'mouse' | 'touch' | 'pointer', down: 'down' | 'start', up: 'up' | 'end', cancel?: 'cancel'): void;
    /**
     * @param {PointerEvent} e
     */
    onPointerDown(e: PointerEvent): void;
    pointerDown: boolean;
    isMultitouch: boolean;
    /**
     * @param {PointerEvent} e
     */
    onPointerMove(e: PointerEvent): void;
    isZooming: boolean;
    isDragging: boolean;
    _intervalTime: number;
    _velocityCalculated: boolean;
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
    raf: number;
    /**
     * Update velocity at 50ms interval
     *
     * @param {boolean=} force
     */
    _updateVelocity(force?: boolean | undefined): void;
    /**
     * @private
     * @param {PointerEvent} e
     */
    private _finishTap;
    _tapTimer: NodeJS.Timeout;
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
    _updatePrevPoints(): void;
    _updateStartPoints(): void;
    _calculateDragDirection(): void;
    /**
     * Converts touch, pointer or mouse event
     * to PhotoSwipe point.
     *
     * @private
     * @param {Touch | PointerEvent} e
     * @param {Point} p
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
