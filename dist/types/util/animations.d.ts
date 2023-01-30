export default Animations;
export type CssAnimationProps = import('./css-animation.js').CssAnimationProps;
export type SpringAnimationProps = import('./spring-animation.js').SpringAnimationProps;
export type SharedAnimationProps = {
    name?: string | undefined;
    isPan?: boolean | undefined;
    isMainScroll?: boolean | undefined;
    onComplete?: VoidFunction | undefined;
    onFinish?: VoidFunction | undefined;
};
export type Animation = SpringAnimation | CSSAnimation;
export type AnimationProps = SpringAnimationProps | CssAnimationProps;
/** @typedef {import('./css-animation.js').CssAnimationProps} CssAnimationProps */
/** @typedef {import('./spring-animation.js').SpringAnimationProps} SpringAnimationProps */
/** @typedef {Object} SharedAnimationProps
 * @prop {string} [name]
 * @prop {boolean} [isPan]
 * @prop {boolean} [isMainScroll]
 * @prop {VoidFunction} [onComplete]
 * @prop {VoidFunction} [onFinish]
 */
/** @typedef {SpringAnimation | CSSAnimation} Animation */
/** @typedef {SpringAnimationProps | CssAnimationProps} AnimationProps */
/**
 * Manages animations
 */
declare class Animations {
    /** @type {Animation[]} */
    activeAnimations: Animation[];
    /**
     * @param {SpringAnimationProps} props
     */
    startSpring(props: SpringAnimationProps): void;
    /**
     * @param {CssAnimationProps} props
     */
    startTransition(props: CssAnimationProps): void;
    /**
     * @private
     * @param {AnimationProps} props
     * @param {boolean} [isSpring]
     * @returns {Animation}
     */
    private _start;
    /**
     * @param {Animation} animation
     */
    stop(animation: Animation): void;
    stopAll(): void;
    /**
     * Stop all pan or zoom transitions
     */
    stopAllPan(): void;
    stopMainScroll(): void;
    /**
     * Returns true if main scroll transition is running
     */
    /**
     * Returns true if any pan or zoom transition is running
     */
    isPanRunning(): boolean;
}
import SpringAnimation from "./spring-animation.js";
import CSSAnimation from "./css-animation.js";
