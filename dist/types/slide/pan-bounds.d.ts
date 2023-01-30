export default PanBounds;
export type Slide = import('./slide.js').default;
export type Point = Record<Axis, number>;
export type Axis = 'x' | 'y';
/** @typedef {import('./slide.js').default} Slide */
/** @typedef {Record<Axis, number>} Point */
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
    center: {
        x: number;
        y: number;
    };
    max: {
        x: number;
        y: number;
    };
    min: {
        x: number;
        y: number;
    };
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
     * @returns {number}
     */
    correctPan(axis: Axis, panOffset: number): number;
}
