/**
 * Lazy-load an image
 * This function is used both by Lightbox and PhotoSwipe core,
 * thus it can be called before dialog is opened.
 *
 * @param {SlideData} itemData Data about the slide
 * @param {PhotoSwipeBase} instance PhotoSwipe or PhotoSwipeLightbox instance
 * @param {number} index
 * @returns {Content} Image that is being decoded or false.
 */
export function lazyLoadData(itemData: SlideData, instance: PhotoSwipeBase, index: number): Content;
/**
 * Lazy-loads specific slide.
 * This function is used both by Lightbox and PhotoSwipe core,
 * thus it can be called before dialog is opened.
 *
 * By default, it loads image based on viewport size and initial zoom level.
 *
 * @param {number} index Slide index
 * @param {PhotoSwipeBase} instance PhotoSwipe or PhotoSwipeLightbox eventable instance
 * @returns {Content | undefined}
 */
export function lazyLoadSlide(index: number, instance: PhotoSwipeBase): Content | undefined;
export default ContentLoader;
export type Content = import('./content.js').default;
export type Slide = import('./slide.js').default;
export type SlideData = import('./slide.js').SlideData;
export type PhotoSwipeBase = import('../core/base.js').default;
export type PhotoSwipe = import('../photoswipe.js').default;
declare class ContentLoader {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp: PhotoSwipe);
    pswp: import("../photoswipe.js").default;
    limit: number;
    /** @type {Content[]} */
    _cachedItems: Content[];
    /**
     * Lazy load nearby slides based on `preload` option.
     *
     * @param {number} [diff] Difference between slide indexes that was changed recently, or 0.
     */
    updateLazy(diff?: number | undefined): void;
    /**
     * @param {number} initialIndex
     */
    loadSlideByIndex(initialIndex: number): void;
    /**
     * @param {Slide} slide
     * @returns {Content}
     */
    getContentBySlide(slide: Slide): Content;
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
     * @returns {Content | undefined}
     */
    getContentByIndex(index: number): Content | undefined;
    destroy(): void;
}
