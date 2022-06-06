export default PhotoSwipeLightbox;
/**
 * <T>
 */
export type Type<T> = import('../types.js').Type<T>;
export type PhotoSwipe = import('../photoswipe.js').default;
export type PhotoSwipeOptions = import('../photoswipe.js').PhotoSwipeOptions;
export type DataSource = import('../photoswipe.js').DataSource;
export type Content = import('../slide/content.js').default;
export type PhotoSwipeEventsMap = import('../core/eventable.js').PhotoSwipeEventsMap;
export type PhotoSwipeFiltersMap = import('../core/eventable.js').PhotoSwipeFiltersMap;
/**
 * <T>
 */
export type EventCallback<T> = import('../core/eventable.js').EventCallback<T>;
/**
 * @template T
 * @typedef {import('../types.js').Type<T>} Type<T>
 */
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../photoswipe.js').PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import('../photoswipe.js').DataSource} DataSource */
/** @typedef {import('../slide/content.js').default} Content */
/** @typedef {import('../core/eventable.js').PhotoSwipeEventsMap} PhotoSwipeEventsMap */
/** @typedef {import('../core/eventable.js').PhotoSwipeFiltersMap} PhotoSwipeFiltersMap */
/**
 * @template T
 * @typedef {import('../core/eventable.js').EventCallback<T>} EventCallback<T>
 */
/**
 * PhotoSwipe Lightbox
 *
 * - If user has unsupported browser it falls back to default browser action (just opens URL)
 * - Binds click event to links that should open PhotoSwipe
 * - parses DOM strcture for PhotoSwipe (retrieves large image URLs and sizes)
 * - Initializes PhotoSwipe
 *
 *
 * Loader options use the same object as PhotoSwipe, and supports such options:
 *
 * gallery - Element | Element[] | NodeList | string selector for the gallery element
 * children - Element | Element[] | NodeList | string selector for the gallery children
 *
 */
declare class PhotoSwipeLightbox extends PhotoSwipeBase {
    /**
     * @param {PhotoSwipeOptions} options
     */
    constructor(options: PhotoSwipeOptions);
    _uid: number;
    /**
     * Initialize lightbox, should be called only once.
     * It's not included in the main constructor, so you may bind events before it.
     */
    init(): void;
    /**
     * @param {MouseEvent} e
     */
    onThumbnailsClick(e: MouseEvent): void;
    /**
     * Get index of gallery item that was clicked.
     *
     * @param {MouseEvent} e click event
     */
    getClickedIndex(e: MouseEvent): number;
    /**
     * Load and open PhotoSwipe
     *
     * @param {number} index
     * @param {DataSource=} dataSource
     * @param {{ x?: number; y?: number }} [initialPoint]
     */
    loadAndOpen(index: number, dataSource?: DataSource | undefined, initialPoint?: {
        x?: number;
        y?: number;
    }): boolean;
    shouldOpen: boolean;
    /**
     * Load the main module and the slide content by index
     *
     * @param {number} index
     * @param {DataSource=} dataSource
     */
    preload(index: number, dataSource?: DataSource | undefined): void;
    _preloadedContent: import("../slide/content.js").default;
    /**
     * @private
     * @param {Type<PhotoSwipe> | { default: Type<PhotoSwipe> }} module
     * @param {number} uid
     */
    private _openPhotoswipe;
    /**
     * Unbinds all events, closes PhotoSwipe if it's open.
     */
    destroy(): void;
}
import PhotoSwipeBase from "../core/base.js";
