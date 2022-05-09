export default Animations;
export type Animation = SpringAnimation | CSSAnimation;
export type AnimationProps = {
    target?: HTMLElement | undefined;
    name?: string | undefined;
    start?: number | undefined;
    end?: number | undefined;
    duration?: number | undefined;
    velocity?: number | undefined;
    dampingRatio?: number | undefined;
    naturalFrequency?: number | undefined;
    onUpdate?: (end: number) => void;
    onComplete?: () => void;
    onFinish?: () => void;
    transform?: string | undefined;
    opacity?: string | undefined;
    easing?: string | undefined;
    isPan?: boolean | undefined;
    isMainScroll?: boolean | undefined;
};
/** @typedef {SpringAnimation | CSSAnimation} Animation */
/**
 * @typedef {Object} AnimationProps
 *
 * @prop {HTMLElement=} target
 *
 * @prop {string=} name
 *
 * @prop {number=} start
 * @prop {number=} end
 * @prop {number=} duration
 * @prop {number=} velocity
 * @prop {number=} dampingRatio
 * @prop {number=} naturalFrequency
 *
 * @prop {(end: number) => void} [onUpdate]
 * @prop {() => void} [onComplete]
 * @prop {() => void} [onFinish]
 *
 * @prop {string=} transform
 * @prop {string=} opacity
 * @prop {string=} easing
 *
 * @prop {boolean=} isPan
 * @prop {boolean=} isMainScroll
 */
/**
 * Manages animations
 */
declare class Animations {
    /** @type {Animation[]} */
    activeAnimations: Animation[];
    /**
     * @param {AnimationProps} props
     */
    startSpring(props: AnimationProps): void;
    /**
     * @param {AnimationProps} props
     */
    startTransition(props: AnimationProps): void;
    /**
     * @param {AnimationProps} props
     * @param {boolean=} isSpring
     */
    _start(props: AnimationProps, isSpring?: boolean | undefined): Animation;
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
