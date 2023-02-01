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
    isOpen: boolean;
    isClosing: boolean;
    isOpening: boolean;
    /**
     * @private
     * @type {number | false | undefined}
     */
    private _duration;
    /** @private */
    private _useAnimation;
    /** @private */
    private _croppedZoom;
    /** @private */
    private _animateRootOpacity;
    /** @private */
    private _animateBgOpacity;
    /**
     * @private
     * @type { HTMLDivElement | HTMLImageElement | null | undefined }
     */
    private _placeholder;
    /**
     * @private
     * @type { HTMLDivElement | undefined }
     */
    private _opacityElement;
    /**
     * @private
     * @type { HTMLDivElement | undefined }
     */
    private _cropContainer1;
    /**
     * @private
     * @type { HTMLElement | null | undefined }
     */
    private _cropContainer2;
    /**
     * @private
     * @type {Bounds | undefined}
     */
    private _thumbBounds;
    /** @private */
    private _prepareOpen;
    open(): void;
    close(): void;
    /** @private */
    private _applyStartProps;
    _animateZoom: boolean | undefined;
    /** @private */
    private _start;
    /** @private */
    private _initiate;
    /** @private */
    private _onAnimationComplete;
    /** @private */
    private _animateToOpenState;
    /** @private */
    private _animateToClosedState;
    /**
     * @private
     * @param {boolean} [animate]
     */
    private _setClosedStateZoomPan;
    /**
     * @private
     * @param {HTMLElement} target
     * @param {'transform' | 'opacity'} prop
     * @param {string} propValue
     */
    private _animateTo;
}
