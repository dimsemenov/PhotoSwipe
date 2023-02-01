export default CSSAnimation;
export type SharedAnimationProps = import('./animations.js').SharedAnimationProps;
export type DefaultCssAnimationProps = {
    target: HTMLElement;
    duration?: number | undefined;
    easing?: string | undefined;
    transform?: string | undefined;
    opacity?: string | undefined;
};
export type CssAnimationProps = SharedAnimationProps & DefaultCssAnimationProps;
/** @typedef {import('./animations.js').SharedAnimationProps} SharedAnimationProps */
/** @typedef {Object} DefaultCssAnimationProps
 *
 * @prop {HTMLElement} target
 * @prop {number} [duration]
 * @prop {string} [easing]
 * @prop {string} [transform]
 * @prop {string} [opacity]
 * */
/** @typedef {SharedAnimationProps & DefaultCssAnimationProps} CssAnimationProps */
/**
 * Runs CSS transition.
 */
declare class CSSAnimation {
    /**
     * onComplete can be unpredictable, be careful about current state
     *
     * @param {CssAnimationProps} props
     */
    constructor(props: CssAnimationProps);
    props: CssAnimationProps;
    onFinish: VoidFunction;
    /** @private */
    private _target;
    /** @private */
    private _onComplete;
    /** @private */
    private _finished;
    /**
     * @private
     * @param {TransitionEvent} e
     */
    private _onTransitionEnd;
    /** @private */
    private _helperTimeout;
    /**
     * @private
     */
    private _finalizeAnimation;
    destroy(): void;
}
