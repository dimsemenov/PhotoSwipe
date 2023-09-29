export default PhotoSwipeLightbox;
/**
 * <T>
 */
export type Type<T> = import('../types.js').Type<T>;
export type PhotoSwipe = import('../photoswipe.js').default;
export type PhotoSwipeOptions = import('../photoswipe.js').PhotoSwipeOptions;
export type DataSource = import('../photoswipe.js').DataSource;
export type Point = import('../photoswipe.js').Point;
export type Content = import('../slide/content.js').default;
export type PhotoSwipeEventsMap = import('../core/eventable.js').PhotoSwipeEventsMap;
export type PhotoSwipeFiltersMap = import('../core/eventable.js').PhotoSwipeFiltersMap;
/**
 * <T>
 */
export type EventCallback<T extends keyof import("../core/eventable.js").PhotoSwipeEventsMap> = import('../core/eventable.js').EventCallback<T>;
/**
 * @template T
 * @typedef {import('../types.js').Type<T>} Type<T>
 */
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../photoswipe.js').PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import('../photoswipe.js').DataSource} DataSource */
/** @typedef {import('../photoswipe.js').Point} Point */
/** @typedef {import('../slide/content.js').default} Content */
/** @typedef {import('../core/eventable.js').PhotoSwipeEventsMap} PhotoSwipeEventsMap */
/** @typedef {import('../core/eventable.js').PhotoSwipeFiltersMap} PhotoSwipeFiltersMap */
/**
 * @template {keyof PhotoSwipeEventsMap} T
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
     * @param {PhotoSwipeOptions} [options]
     */
    constructor(options?: Partial<import("../photoswipe.js").PreparedPhotoSwipeOptions> | undefined);
    /** @type {PhotoSwipeOptions} */
    options: Partial<import("../photoswipe.js").PreparedPhotoSwipeOptions>;
    _uid: number;
    shouldOpen: boolean;
    /**
     * @private
     * @type {Content | undefined}
     */
    private _preloadedContent;
    /**
     * @param {MouseEvent} e
     */
    onThumbnailsClick(e: MouseEvent): void;
    /**
     * Initialize lightbox, should be called only once.
     * It's not included in the main constructor, so you may bind events before it.
     */
    init(): void;
    /**
     * Get index of gallery item that was clicked.
     *
     * @param {MouseEvent} e click event
     * @returns {number}
     */
    getClickedIndex(e: MouseEvent): number;
    /**
     * Load and open PhotoSwipe
     *
     * @param {number} index
     * @param {DataSource} [dataSource]
     * @param {Point | null} [initialPoint]
     * @returns {boolean}
     */
    loadAndOpen(index: number, dataSource?: import("../photoswipe.js").DataSource | undefined, initialPoint?: import("../photoswipe.js").Point | null | undefined): boolean;
    /**
     * Load the main module and the slide content by index
     *
     * @param {number} index
     * @param {DataSource} [dataSource]
     */
    preload(index: number, dataSource?: import("../photoswipe.js").DataSource | undefined): void;
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
