/**
 * Lazy-load an image
 * This function is used both by Lightbox and PhotoSwipe core,
 * thus it can be called before dialog is opened.
 *
 * @param {SlideData} itemData Data about the slide
 * @param {PhotoSwipe | PhotoSwipeLightbox} instance PhotoSwipe or PhotoSwipeLightbox
 * @param {number} index
 * @returns Image that is being decoded or false.
 */
export function lazyLoadData(itemData: SlideData, instance: PhotoSwipe | PhotoSwipeLightbox, index: number): import("./content").default;
/**
 * Lazy-loads specific slide.
 * This function is used both by Lightbox and PhotoSwipe core,
 * thus it can be called before dialog is opened.
 *
 * By default it loads image based on viewport size and initial zoom level.
 *
 * @param {number} index Slide index
 * @param {PhotoSwipe | PhotoSwipeLightbox} instance PhotoSwipe or PhotoSwipeLightbox eventable instance
 */
export function lazyLoadSlide(index: number, instance: PhotoSwipe | PhotoSwipeLightbox): import("./content").default;
export default ContentLoader;
export type Content = import("./content").default;
export type Slide = import("./slide").default;
export type SlideData = import("./slide").SlideData;
export type PhotoSwipe = import("../photoswipe").default;
export type PhotoSwipeLightbox = import("../lightbox/lightbox").default;
declare class ContentLoader {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp: PhotoSwipe);
    pswp: import("../photoswipe").default;
    limit: number;
    /** @type {Content[]} */
    _cachedItems: Content[];
    /**
     * Lazy load nearby slides based on `preload` option.
     *
     * @param {number=} diff Difference between slide indexes that was changed recently, or 0.
     */
    updateLazy(diff?: number | undefined): void;
    /**
     * @param {number} index
     */
    loadSlideByIndex(index: number): void;
    /**
     * @param {Slide} slide
     */
    getContentBySlide(slide: Slide): import("./content").default;
    /**
     * @param {Content} content
     */
    addToCache(content: Content): void;
    /**
     * Removes an image from cache, does not destroy() it, just removes.
     *
     * @param {number} index
     */
    removeByIndex(index: number): void;
    /**
     * @param {number} index
     */
    getContentByIndex(index: number): import("./content").default;
    destroy(): void;
}
