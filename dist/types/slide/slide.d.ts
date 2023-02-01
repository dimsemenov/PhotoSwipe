export default Slide;
export type PhotoSwipe = import('../photoswipe.js').default;
export type Point = import('../photoswipe.js').Point;
export type SlideData = _SlideData & Record<string, any>;
export type _SlideData = {
    /**
     * thumbnail element
     */
    element?: HTMLElement | undefined;
    /**
     * image URL
     */
    src?: string | undefined;
    /**
     * image srcset
     */
    srcset?: string | undefined;
    /**
     * image width (deprecated)
     */
    w?: number | undefined;
    /**
     * image height (deprecated)
     */
    h?: number | undefined;
    /**
     * image width
     */
    width?: number | undefined;
    /**
     * image height
     */
    height?: number | undefined;
    /**
     * placeholder image URL that's displayed before large image is loaded
     */
    msrc?: string | undefined;
    /**
     * image alt text
     */
    alt?: string | undefined;
    /**
     * whether thumbnail is cropped client-side or not
     */
    thumbCropped?: boolean | undefined;
    /**
     * html content of a slide
     */
    html?: string | undefined;
    /**
     * slide type
     */
    type?: string | undefined;
};
/**
 * Renders and allows to control a single slide
 */
declare class Slide {
    /**
     * @param {SlideData} data
     * @param {number} index
     * @param {PhotoSwipe} pswp
     */
    constructor(data: SlideData, index: number, pswp: PhotoSwipe);
    data: SlideData;
    index: number;
    pswp: import("../photoswipe.js").default;
    isActive: boolean;
    currentResolution: number;
    /** @type {Point} */
    panAreaSize: Point;
    /** @type {Point} */
    pan: Point;
    isFirstSlide: boolean;
    zoomLevels: ZoomLevel;
    content: import("./content.js").default;
    container: HTMLDivElement;
    /** @type {HTMLElement | null} */
    holderElement: HTMLElement | null;
    currZoomLevel: number;
    /** @type {number} */
    width: number;
    /** @type {number} */
    height: number;
    heavyAppended: boolean;
    bounds: PanBounds;
    prevDisplayedWidth: number;
    prevDisplayedHeight: number;
    /**
     * If this slide is active/current/visible
     *
     * @param {boolean} isActive
     */
    setIsActive(isActive: boolean): void;
    /**
     * Appends slide content to DOM
     *
     * @param {HTMLElement} holderElement
     */
    append(holderElement: HTMLElement): void;
    load(): void;
    /**
     * Append "heavy" DOM elements
     *
     * This may depend on a type of slide,
     * but generally these are large images.
     */
    appendHeavy(): void;
    /**
     * Triggered when this slide is active (selected).
     *
     * If it's part of opening/closing transition -
     * activate() will trigger after the transition is ended.
     */
    activate(): void;
    /**
     * Triggered when this slide becomes inactive.
     *
     * Slide can become inactive only after it was active.
     */
    deactivate(): void;
    /**
     * The slide should destroy itself, it will never be used again.
     * (unbind all events and destroy internal components)
     */
    destroy(): void;
    resize(): void;
    /**
     * Apply size to current slide content,
     * based on the current resolution and scale.
     *
     * @param {boolean} [force] if size should be updated even if dimensions weren't changed
     */
    updateContentSize(force?: boolean | undefined): void;
    /**
     * @param {number} width
     * @param {number} height
     */
    sizeChanged(width: number, height: number): boolean;
    /** @returns {HTMLImageElement | HTMLDivElement | null | undefined} */
    getPlaceholderElement(): HTMLImageElement | HTMLDivElement | null | undefined;
    /**
     * Zoom current slide image to...
     *
     * @param {number} destZoomLevel Destination zoom level.
     * @param {Point} [centerPoint]
     * Transform origin center point, or false if viewport center should be used.
     * @param {number | false} [transitionDuration] Transition duration, may be set to 0.
     * @param {boolean} [ignoreBounds] Minimum and maximum zoom levels will be ignored.
     */
    zoomTo(destZoomLevel: number, centerPoint?: import("../photoswipe.js").Point | undefined, transitionDuration?: number | false | undefined, ignoreBounds?: boolean | undefined): void;
    /**
     * @param {Point} [centerPoint]
     */
    toggleZoom(centerPoint?: import("../photoswipe.js").Point | undefined): void;
    /**
     * Updates zoom level property and recalculates new pan bounds,
     * unlike zoomTo it does not apply transform (use applyCurrentZoomPan)
     *
     * @param {number} currZoomLevel
     */
    setZoomLevel(currZoomLevel: number): void;
    /**
     * Get pan position after zoom at a given `point`.
     *
     * Always call setZoomLevel(newZoomLevel) beforehand to recalculate
     * pan bounds according to the new zoom level.
     *
     * @param {'x' | 'y'} axis
     * @param {Point} [point]
     * point based on which zoom is performed, usually refers to the current mouse position,
     * if false - viewport center will be used.
     * @param {number} [prevZoomLevel] Zoom level before new zoom was applied.
     * @returns {number}
     */
    calculateZoomToPanOffset(axis: 'x' | 'y', point?: import("../photoswipe.js").Point | undefined, prevZoomLevel?: number | undefined): number;
    /**
     * Apply pan and keep it within bounds.
     *
     * @param {number} panX
     * @param {number} panY
     */
    panTo(panX: number, panY: number): void;
    /**
     * If the slide in the current state can be panned by the user
     * @returns {boolean}
     */
    isPannable(): boolean;
    /**
     * If the slide can be zoomed
     * @returns {boolean}
     */
    isZoomable(): boolean;
    /**
     * Apply transform and scale based on
     * the current pan position (this.pan) and zoom level (this.currZoomLevel)
     */
    applyCurrentZoomPan(): void;
    zoomAndPanToInitial(): void;
    /**
     * Set translate and scale based on current resolution
     *
     * @param {number} x
     * @param {number} y
     * @param {number} zoom
     * @private
     */
    private _applyZoomTransform;
    calculateSize(): void;
    /** @returns {string} */
    getCurrentTransform(): string;
    /**
     * Set resolution and re-render the image.
     *
     * For example, if the real image size is 2000x1500,
     * and resolution is 0.5 - it will be rendered as 1000x750.
     *
     * Image with zoom level 2 and resolution 0.5 is
     * the same as image with zoom level 1 and resolution 1.
     *
     * Used to optimize animations and make
     * sure that browser renders image in the highest quality.
     * Also used by responsive images to load the correct one.
     *
     * @param {number} newResolution
     */
    _setResolution(newResolution: number): void;
}
import ZoomLevel from "./zoom-level.js";
import PanBounds from "./pan-bounds.js";
