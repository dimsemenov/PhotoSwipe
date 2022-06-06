export default PanBounds;
export type Slide = import('./slide.js').default;
export type Point = {
    x?: number;
    y?: number;
};
export type Axis = 'x' | 'y';
/** @typedef {import('./slide.js').default} Slide */
/** @typedef {{ x?: number; y?: number }} Point */
/** @typedef {'x' | 'y'} Axis */
/**
 * Calculates minimum, maximum and initial (center) bounds of a slide
 */
declare class PanBounds {
    /**
     * @param {Slide} slide
     */
    constructor(slide: Slide);
    slide: import("./slide.js").default;
    currZoomLevel: number;
    /** @type {Point} */
    center: Point;
    /** @type {Point} */
    max: Point;
    /** @type {Point} */
    min: Point;
    /**
     * _getItemBounds
     *
     * @param {number} currZoomLevel
     */
    update(currZoomLevel: number): void;
    /**
     * _calculateItemBoundsForAxis
     *
     * @param {Axis} axis
     */
    _updateAxis(axis: Axis): void;
    reset(): void;
    /**
     * Correct pan position if it's beyond the bounds
     *
     * @param {Axis} axis x or y
     * @param {number} panOffset
     */
    correctPan(axis: Axis, panOffset: number): number;
}
