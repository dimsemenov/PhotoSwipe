export default SpringAnimation;
export type AnimationProps = import("./animations").AnimationProps;
/** @typedef {import("./animations").AnimationProps} AnimationProps */
declare class SpringAnimation {
    /**
     * @param {AnimationProps} props
     */
    constructor(props: AnimationProps);
    /** @type {() => void} */
    onFinish: () => void;
    props: import("./animations").AnimationProps;
    _raf: number;
    destroy(): void;
}
