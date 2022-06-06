export default Opener;
export type PhotoSwipe = import('./photoswipe.js').default;
export type Bounds = import('./slide/get-thumb-bounds.js').Bounds;
export type AnimationProps = import('./util/animations.js').AnimationProps;
/**
 * Manages opening and closing transitions of the PhotoSwipe.
 *
 * It can perform zoom, fade or no transition.
 */
declare class Opener {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp: PhotoSwipe);
    pswp: import("./photoswipe.js").default;
    isClosed: boolean;
    _prepareOpen(): void;
    /** @type {false | Bounds} */
    _thumbBounds: false | Bounds;
    open(): void;
    close(): boolean;
    isOpen: boolean;
    isOpening: boolean;
    isClosing: boolean;
    _duration: number | false;
    _applyStartProps(): void;
    _placeholder: HTMLDivElement | HTMLImageElement;
    _useAnimation: boolean;
    _animateZoom: boolean;
    _animateRootOpacity: boolean;
    _animateBgOpacity: boolean;
    _opacityElement: HTMLDivElement;
    _croppedZoom: boolean;
    _cropContainer1: HTMLDivElement;
    _cropContainer2: HTMLElement;
    _start(): void;
    _initiate(): void;
    _onAnimationComplete(): void;
    _animateToOpenState(): void;
    _animateToClosedState(): void;
    /**
     * @param {boolean=} animate
     */
    _setClosedStateZoomPan(animate?: boolean | undefined): void;
    /**
     * @param {HTMLElement} target
     * @param {'transform' | 'opacity'} prop
     * @param {string} propValue
     */
    _animateTo(target: HTMLElement, prop: 'transform' | 'opacity', propValue: string): void;
}
