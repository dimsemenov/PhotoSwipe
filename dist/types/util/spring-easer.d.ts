export default SpringEaser;
/**
 * Spring easing helper
 */
declare class SpringEaser {
    /**
     * @param {number} initialVelocity Initial velocity, px per ms.
     *
     * @param {number} dampingRatio
     * Determines how bouncy animation will be.
     * From 0 to 1, 0 - always overshoot, 1 - do not overshoot.
     * "overshoot" refers to part of animation that
     * goes beyond the final value.
     *
     * @param {number} naturalFrequency
     * Determines how fast animation will slow down.
     * The higher value - the stiffer the transition will be,
     * and the faster it will slow down.
     * Recommended value from 10 to 50
     */
    constructor(initialVelocity: number, dampingRatio: number, naturalFrequency: number);
    velocity: number;
    _dampingRatio: number;
    _naturalFrequency: number;
    _dampedFrequency: number;
    /**
     * @param {number} deltaPosition Difference between current and end position of the animation
     * @param {number} deltaTime Frame duration in milliseconds
     *
     * @returns {number} Displacement, relative to the end position.
     */
    easeFrame(deltaPosition: number, deltaTime: number): number;
}
