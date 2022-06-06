export default SpringAnimation;
export type AnimationProps = import('./animations.js').AnimationProps;
/** @typedef {import('./animations.js').AnimationProps} AnimationProps */
declare class SpringAnimation {
    /**
     * @param {AnimationProps} props
     */
    constructor(props: AnimationProps);
    props: import("./animations.js").AnimationProps;
    /** @type {() => void} */
    onFinish: () => void;
    _raf: number;
    destroy(): void;
}
