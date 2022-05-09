export default SpringAnimation;
export type AnimationProps = import("./animations").AnimationProps;
/** @typedef {import("./animations").AnimationProps} AnimationProps */
declare class SpringAnimation {
    /**
     * @param {AnimationProps} props
     */
    constructor(props: AnimationProps);
    props: import("./animations").AnimationProps;
    /** @type {() => void} */
    onFinish: () => void;
    _raf: number;
    destroy(): void;
}
