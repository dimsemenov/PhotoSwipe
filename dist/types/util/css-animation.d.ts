export default CSSAnimation;
export type AnimationProps = import("./animations").AnimationProps;
/** @typedef {import("./animations").AnimationProps} AnimationProps */
/**
 * Runs CSS transition.
 */
declare class CSSAnimation {
    /**
     * onComplete can be unpredictable, be careful about current state
     *
     * @param {AnimationProps} props
     */
    constructor(props: AnimationProps);
    props: import("./animations").AnimationProps;
    /** @type {() => void} */
    onFinish: () => void;
    /** @private */
    private _target;
    /** @private */
    private _onComplete;
    /**
     * @private
     * @param {TransitionEvent} e
     */
    private _onTransitionEnd;
    /** @private */
    private _firstFrameTimeout;
    /**
     * @private
     */
    private _finalizeAnimation;
    _finished: boolean;
    destroy(): void;
}
