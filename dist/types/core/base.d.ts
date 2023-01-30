export default PhotoSwipeBase;
export type PhotoSwipe = import("../photoswipe.js").default;
export type SlideData = import("../slide/slide.js").SlideData;
/** @typedef {import("../photoswipe.js").default} PhotoSwipe */
/** @typedef {import("../slide/slide.js").SlideData} SlideData */
/**
 * PhotoSwipe base class that can retrieve data about every slide.
 * Shared by PhotoSwipe Core and PhotoSwipe Lightbox
 */
declare class PhotoSwipeBase extends Eventable {
    /**
     * Get total number of slides
     *
     * @returns {number}
     */
    getNumItems(): number;
    /**
     * @param {SlideData} slideData
     * @param {number} index
     * @returns {Content}
     */
    createContentFromData(slideData: SlideData, index: number): Content;
    /**
     * Get item data by index.
     *
     * "item data" should contain normalized information that PhotoSwipe needs to generate a slide.
     * For example, it may contain properties like
     * `src`, `srcset`, `w`, `h`, which will be used to generate a slide with image.
     *
     * @param {number} index
     * @returns {SlideData}
     */
    getItemData(index: number): SlideData;
    /**
     * Get array of gallery DOM elements,
     * based on childSelector and gallery element.
     *
     * @param {HTMLElement} galleryElement
     * @returns {HTMLElement[]}
     */
    _getGalleryDOMElements(galleryElement: HTMLElement): HTMLElement[];
    /**
     * Converts DOM element to item data object.
     *
     * @param {HTMLElement} element DOM element
     * @returns {SlideData}
     */
    _domElementToItemData(element: HTMLElement): SlideData;
    /**
     * Lazy-load by slide data
     *
     * @param {SlideData} itemData Data about the slide
     * @param {number} index
     * @returns {Content} Image that is being decoded or false.
     */
    lazyLoadData(itemData: SlideData, index: number): Content;
}
import Eventable from "./eventable.js";
import Content from "../slide/content.js";
