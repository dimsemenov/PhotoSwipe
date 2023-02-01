export default SpringAnimation;
export type SharedAnimationProps = import('./animations.js').SharedAnimationProps;
export type DefaultSpringAnimationProps = {
    start: number;
    end: number;
    velocity: number;
    dampingRatio?: number | undefined;
    naturalFrequency?: number | undefined;
    onUpdate: (end: number) => void;
};
export type SpringAnimationProps = SharedAnimationProps & DefaultSpringAnimationProps;
/** @typedef {import('./animations.js').SharedAnimationProps} SharedAnimationProps */
/**
 * @typedef {Object} DefaultSpringAnimationProps
 *
 * @prop {number} start
 * @prop {number} end
 * @prop {number} velocity
 * @prop {number} [dampingRatio]
 * @prop {number} [naturalFrequency]
 * @prop {(end: number) => void} onUpdate
 */
/** @typedef {SharedAnimationProps & DefaultSpringAnimationProps} SpringAnimationProps */
declare class SpringAnimation {
    /**
     * @param {SpringAnimationProps} props
     */
    constructor(props: SpringAnimationProps);
    props: SpringAnimationProps;
    _raf: number;
    onFinish: VoidFunction;
    destroy(): void;
}
