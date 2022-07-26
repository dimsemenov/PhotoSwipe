export default Content;
export type Slide = import('./slide.js').default;
export type SlideData = import('./slide.js').SlideData;
export type PhotoSwipe = import('../photoswipe.js').default;
export type LoadState = import('../util/util.js').LoadState;
/** @typedef {import('./slide.js').default} Slide */
/** @typedef {import('./slide.js').SlideData} SlideData */
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../util/util.js').LoadState} LoadState */
declare class Content {
    /**
     * @param {SlideData} itemData Slide data
     * @param {PhotoSwipe} instance PhotoSwipe or PhotoSwipeLightbox instance
     * @param {number} index
     */
    constructor(itemData: SlideData, instance: PhotoSwipe, index: number);
    instance: import("../photoswipe.js").default;
    data: import("./slide.js").SlideData;
    index: number;
    /** @type {HTMLImageElement | HTMLDivElement} */
    element: HTMLImageElement | HTMLDivElement;
    displayedImageWidth: number;
    displayedImageHeight: number;
    width: number;
    height: number;
    isAttached: boolean;
    hasSlide: boolean;
    /** @type {LoadState} */
    state: LoadState;
    type: string;
    removePlaceholder(): void;
    placeholder: Placeholder;
    /**
     * Preload content
     *
     * @param {boolean=} isLazy
     * @param {boolean=} reload
     */
    load(isLazy?: boolean | undefined, reload?: boolean | undefined): void;
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
    slide: import("./slide.js").default;
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
    isDecoding: boolean;
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
