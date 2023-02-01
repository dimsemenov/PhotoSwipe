export default Content;
export type Slide = import('./slide.js').default;
export type SlideData = import('./slide.js').SlideData;
export type PhotoSwipeBase = import('../core/base.js').default;
export type LoadState = import('../util/util.js').LoadState;
/** @typedef {import('./slide.js').default} Slide */
/** @typedef {import('./slide.js').SlideData} SlideData */
/** @typedef {import('../core/base.js').default} PhotoSwipeBase */
/** @typedef {import('../util/util.js').LoadState} LoadState */
declare class Content {
    /**
     * @param {SlideData} itemData Slide data
     * @param {PhotoSwipeBase} instance PhotoSwipe or PhotoSwipeLightbox instance
     * @param {number} index
     */
    constructor(itemData: SlideData, instance: PhotoSwipeBase, index: number);
    instance: import("../core/base.js").default;
    data: import("./slide.js").SlideData;
    index: number;
    /** @type {HTMLImageElement | HTMLDivElement | undefined} */
    element: HTMLImageElement | HTMLDivElement | undefined;
    /** @type {Placeholder | undefined} */
    placeholder: Placeholder | undefined;
    /** @type {Slide | undefined} */
    slide: Slide | undefined;
    displayedImageWidth: number;
    displayedImageHeight: number;
    width: number;
    height: number;
    isAttached: boolean;
    hasSlide: boolean;
    isDecoding: boolean;
    /** @type {LoadState} */
    state: LoadState;
    type: string;
    removePlaceholder(): void;
    /**
     * Preload content
     *
     * @param {boolean} isLazy
     * @param {boolean} [reload]
     */
    load(isLazy: boolean, reload?: boolean | undefined): void;
    /**
     * Preload image
     *
     * @param {boolean} isLazy
     */
    loadImage(isLazy: boolean): void;
    /**
     * Assign slide to content
     *
     * @param {Slide} slide
     */
    setSlide(slide: Slide): void;
    /**
     * Content load success handler
     */
    onLoaded(): void;
    /**
     * Content load error handler
     */
    onError(): void;
    /**
     * @returns {Boolean} If the content is currently loading
     */
    isLoading(): boolean;
    /**
     * @returns {Boolean} If the content is in error state
     */
    isError(): boolean;
    /**
     * @returns {boolean} If the content is image
     */
    isImageContent(): boolean;
    /**
     * Update content size
     *
     * @param {Number} width
     * @param {Number} height
     */
    setDisplayedSize(width: number, height: number): void;
    /**
     * @returns {boolean} If the content can be zoomed
     */
    isZoomable(): boolean;
    /**
     * Update image srcset sizes attribute based on width and height
     */
    updateSrcsetSizes(): void;
    /**
     * @returns {boolean} If content should use a placeholder (from msrc by default)
     */
    usePlaceholder(): boolean;
    /**
     * Preload content with lazy-loading param
     */
    lazyLoad(): void;
    /**
     * @returns {boolean} If placeholder should be kept after content is loaded
     */
    keepPlaceholder(): boolean;
    /**
     * Destroy the content
     */
    destroy(): void;
    /**
     * Display error message
     */
    displayError(): void;
    /**
     * Append the content
     */
    append(): void;
    /**
     * Activate the slide,
     * active slide is generally the current one,
     * meaning the user can see it.
     */
    activate(): void;
    /**
     * Deactivate the content
     */
    deactivate(): void;
    /**
     * Remove the content from DOM
     */
    remove(): void;
    /**
     * Append the image content to slide container
     */
    appendImage(): void;
}
import Placeholder from "./placeholder.js";
