export default PhotoSwipe;
/**
 * <T>
 */
export type Type<T> = import('./types.js').Type<T>;
export type SlideData = import('./slide/slide.js').SlideData;
export type ZoomLevelOption = import('./slide/zoom-level.js').ZoomLevelOption;
export type UIElementData = import('./ui/ui-element.js').UIElementData;
export type ItemHolder = import('./main-scroll.js').ItemHolder;
export type PhotoSwipeEventsMap = import('./core/eventable.js').PhotoSwipeEventsMap;
export type PhotoSwipeFiltersMap = import('./core/eventable.js').PhotoSwipeFiltersMap;
export type Bounds = import('./slide/get-thumb-bounds').Bounds;
/**
 * <T>
 */
export type EventCallback<T extends keyof import("./core/eventable.js").PhotoSwipeEventsMap> = import('./core/eventable.js').EventCallback<T>;
/**
 * <T>
 */
export type AugmentedEvent<T extends keyof import("./core/eventable.js").PhotoSwipeEventsMap> = import('./core/eventable.js').AugmentedEvent<T>;
export type Point = {
    x: number;
    y: number;
    id?: string | number;
};
export type Padding = {
    top: number;
    bottom: number;
    left: number;
    right: number;
};
export type DataSourceArray = SlideData[];
export type DataSourceObject = {
    gallery: HTMLElement;
    items?: HTMLElement[];
};
export type DataSource = import("./slide/slide.js").SlideData[] | DataSourceObject;
export type ActionFn = (point: Point, originalEvent: PointerEvent) => void;
export type ActionType = 'close' | 'next' | 'zoom' | 'zoom-or-close' | 'toggle-controls';
export type PhotoSwipeModule = Type<PhotoSwipe> | {
    default: Type<PhotoSwipe>;
};
export type PhotoSwipeModuleOption = PhotoSwipeModule | Promise<PhotoSwipeModule> | (() => Promise<PhotoSwipeModule>);
export type ElementProvider = string | NodeListOf<HTMLElement> | HTMLElement[] | HTMLElement;
/**
 * https://photoswipe.com/options/
 */
export type PhotoSwipeOptions = Partial<PreparedPhotoSwipeOptions>;
export type PreparedPhotoSwipeOptions = {
    /**
     * Pass an array of any items via dataSource option. Its length will determine amount of slides
     * (which may be modified further from numItems event).
     *
     * Each item should contain data that you need to generate slide
     * (for image slide it would be src (image URL), width (image width), height, srcset, alt).
     *
     * If these properties are not present in your initial array, you may "pre-parse" each item from itemData filter.
     */
    dataSource?: DataSource | undefined;
    /**
     * Background backdrop opacity, always define it via this option and not via CSS rgba color.
     */
    bgOpacity: number;
    /**
     * Spacing between slides. Defined as ratio relative to the viewport width (0.1 = 10% of viewport).
     */
    spacing: number;
    /**
     * Allow swipe navigation to the next slide when the current slide is zoomed. Does not apply to mouse events.
     */
    allowPanToNext: boolean;
    /**
     * If set to true you'll be able to swipe from the last to the first image.
     * Option is always false when there are less than 3 slides.
     */
    loop: boolean;
    /**
     * By default PhotoSwipe zooms image with ctrl-wheel, if you enable this option - image will zoom just via wheel.
     */
    wheelToZoom?: boolean | undefined;
    /**
     * Pinch touch gesture to close the gallery.
     */
    pinchToClose: boolean;
    /**
     * Vertical drag gesture to close the PhotoSwipe.
     */
    closeOnVerticalDrag: boolean;
    /**
     * Slide area padding (in pixels).
     */
    padding?: Padding | undefined;
    /**
     * The option is checked frequently, so make sure it's performant. Overrides padding option if defined. For example:
     */
    paddingFn?: ((viewportSize: Point, itemData: SlideData, index: number) => Padding) | undefined;
    /**
     * Transition duration in milliseconds, can be 0.
     */
    hideAnimationDuration: number | false;
    /**
     * Transition duration in milliseconds, can be 0.
     */
    showAnimationDuration: number | false;
    /**
     * Transition duration in milliseconds, can be 0.
     */
    zoomAnimationDuration: number | false;
    /**
     * String, 'cubic-bezier(.4,0,.22,1)'. CSS easing function for open/close/zoom transitions.
     */
    easing: string;
    /**
     * Esc key to close.
     */
    escKey: boolean;
    /**
     * Left/right arrow keys for navigation.
     */
    arrowKeys: boolean;
    /**
     * Trap focus within PhotoSwipe element while it's open.
     */
    trapFocus: boolean;
    /**
     * Restore focus the last active element after PhotoSwipe is closed.
     */
    returnFocus: boolean;
    /**
     * If image is not zoomable (for example, smaller than viewport) it can be closed by clicking on it.
     */
    clickToCloseNonZoomable: boolean;
    /**
     * Refer to click and tap actions page.
     */
    imageClickAction: ActionType | ActionFn | false;
    /**
     * Refer to click and tap actions page.
     */
    bgClickAction: ActionType | ActionFn | false;
    /**
     * Refer to click and tap actions page.
     */
    tapAction: ActionType | ActionFn | false;
    /**
     * Refer to click and tap actions page.
     */
    doubleTapAction: ActionType | ActionFn | false;
    /**
     * Delay before the loading indicator will be displayed,
     * if image is loaded during it - the indicator will not be displayed at all. Can be zero.
     */
    preloaderDelay: number;
    /**
     * Used for slide count indicator ("1 of 10 ").
     */
    indexIndicatorSep: string;
    /**
     * A function that should return slide viewport width and height, in format {x: 100, y: 100}.
     */
    getViewportSizeFn?: ((options: PhotoSwipeOptions, pswp: PhotoSwipeBase) => Point) | undefined;
    /**
     * Message to display when the image wasn't able to load. If you need to display HTML - use contentErrorElement filter.
     */
    errorMsg: string;
    /**
     * Lazy loading of nearby slides based on direction of movement. Should be an array with two integers,
     * first one - number of items to preload before the current image, second one - after the current image.
     * Two nearby images are always loaded.
     */
    preload: [number, number];
    /**
     * Class that will be added to the root element of PhotoSwipe, may contain multiple separated by space.
     * Example on Styling page.
     */
    mainClass?: string | undefined;
    /**
     * Element to which PhotoSwipe dialog will be appended when it opens.
     */
    appendToEl?: HTMLElement | undefined;
    /**
     * Maximum width of image to animate, if initial rendered image width
     * is larger than this value - the opening/closing transition will be automatically disabled.
     */
    maxWidthToAnimate: number;
    /**
     * Translating
     */
    closeTitle?: string | undefined;
    /**
     * Translating
     */
    zoomTitle?: string | undefined;
    /**
     * Translating
     */
    arrowPrevTitle?: string | undefined;
    /**
     * Translating
     */
    arrowNextTitle?: string | undefined;
    /**
     * To adjust opening or closing transition type use lightbox option `showHideAnimationType` (`String`).
     * It supports three values - `zoom` (default), `fade` (default if there is no thumbnail) and `none`.
     *
     * Animations are automatically disabled if user `(prefers-reduced-motion: reduce)`.
     */
    showHideAnimationType?: "none" | "zoom" | "fade" | undefined;
    /**
     * Defines start slide index.
     */
    index: number;
    getClickedIndexFn?: ((e: MouseEvent) => number) | undefined;
    arrowPrev?: boolean | undefined;
    arrowNext?: boolean | undefined;
    zoom?: boolean | undefined;
    close?: boolean | undefined;
    counter?: boolean | undefined;
    arrowPrevSVG?: string | undefined;
    arrowNextSVG?: string | undefined;
    zoomSVG?: string | undefined;
    closeSVG?: string | undefined;
    counterSVG?: string | undefined;
    counterTitle?: string | undefined;
    initialZoomLevel?: import("./slide/zoom-level.js").ZoomLevelOption | undefined;
    secondaryZoomLevel?: import("./slide/zoom-level.js").ZoomLevelOption | undefined;
    maxZoomLevel?: import("./slide/zoom-level.js").ZoomLevelOption | undefined;
    mouseMovePan?: boolean | undefined;
    initialPointerPos?: Point | null | undefined;
    showHideOpacity?: boolean | undefined;
    pswpModule?: PhotoSwipeModuleOption | undefined;
    openPromise?: (() => Promise<any>) | undefined;
    preloadFirstSlide?: boolean | undefined;
    gallery?: ElementProvider | undefined;
    gallerySelector?: string | undefined;
    children?: ElementProvider | undefined;
    childSelector?: string | undefined;
    thumbSelector?: string | false | undefined;
};
/**
 * PhotoSwipe Core
 */
declare class PhotoSwipe extends PhotoSwipeBase {
    /**
     * @param {PhotoSwipeOptions} [options]
     */
    constructor(options?: Partial<PreparedPhotoSwipeOptions> | undefined);
    options: PreparedPhotoSwipeOptions;
    /**
     * offset of viewport relative to document
     *
     * @type {Point}
     */
    offset: Point;
    /**
     * @type {Point}
     * @private
     */
    private _prevViewportSize;
    /**
     * Size of scrollable PhotoSwipe viewport
     *
     * @type {Point}
     */
    viewportSize: Point;
    /**
     * background (backdrop) opacity
     */
    bgOpacity: number;
    currIndex: number;
    potentialIndex: number;
    isOpen: boolean;
    isDestroying: boolean;
    hasMouse: boolean;
    /**
     * @private
     * @type {SlideData}
     */
    private _initialItemData;
    /** @type {Bounds | undefined} */
    _initialThumbBounds: Bounds | undefined;
    /** @type {HTMLDivElement | undefined} */
    topBar: HTMLDivElement | undefined;
    /** @type {HTMLDivElement | undefined} */
    element: HTMLDivElement | undefined;
    /** @type {HTMLDivElement | undefined} */
    template: HTMLDivElement | undefined;
    /** @type {HTMLDivElement | undefined} */
    container: HTMLDivElement | undefined;
    /** @type {HTMLElement | undefined} */
    scrollWrap: HTMLElement | undefined;
    /** @type {Slide | undefined} */
    currSlide: Slide | undefined;
    events: DOMEvents;
    animations: Animations;
    mainScroll: MainScroll;
    gestures: Gestures;
    opener: Opener;
    keyboard: Keyboard;
    contentLoader: ContentLoader;
    /** @returns {boolean} */
    init(): boolean;
    scrollWheel: ScrollWheel | undefined;
    /**
     * Get looped slide index
     * (for example, -1 will return the last slide)
     *
     * @param {number} index
     * @returns {number}
     */
    getLoopedIndex(index: number): number;
    appendHeavy(): void;
    /**
     * Change the slide
     * @param {number} index New index
     */
    goTo(index: number): void;
    /**
     * Go to the next slide.
     */
    next(): void;
    /**
     * Go to the previous slide.
     */
    prev(): void;
    /**
     * @see slide/slide.js zoomTo
     *
     * @param {Parameters<Slide['zoomTo']>} args
     */
    zoomTo(destZoomLevel: number, centerPoint?: Point | undefined, transitionDuration?: number | false | undefined, ignoreBounds?: boolean | undefined): void;
    /**
     * @see slide/slide.js toggleZoom
     */
    toggleZoom(): void;
    /**
     * Close the gallery.
     * After closing transition ends - destroy it
     */
    close(): void;
    /**
     * Destroys the gallery:
     * - instantly closes the gallery
     * - unbinds events,
     * - cleans intervals and timeouts
     * - removes elements from DOM
     */
    destroy(): void;
    /**
     * Refresh/reload content of a slide by its index
     *
     * @param {number} slideIndex
     */
    refreshSlideContent(slideIndex: number): void;
    /**
     * Set slide content
     *
     * @param {ItemHolder} holder mainScroll.itemHolders array item
     * @param {number} index Slide index
     * @param {boolean} [force] If content should be set even if index wasn't changed
     */
    setContent(holder: ItemHolder, index: number, force?: boolean | undefined): void;
    /** @returns {Point} */
    getViewportCenterPoint(): Point;
    /**
     * Update size of all elements.
     * Executed on init and on page resize.
     *
     * @param {boolean} [force] Update size even if size of viewport was not changed.
     */
    updateSize(force?: boolean | undefined): void;
    /**
     * @param {number} opacity
     */
    applyBgOpacity(opacity: number): void;
    /**
     * Whether mouse is detected
     */
    mouseDetected(): void;
    /**
     * Page resize event handler
     *
     * @private
     */
    private _handlePageResize;
    /**
     * Page scroll offset is used
     * to get correct coordinates
     * relative to PhotoSwipe viewport.
     *
     * @private
     */
    private _updatePageScrollOffset;
    /**
     * @param {number} x
     * @param {number} y
     */
    setScrollOffset(x: number, y: number): void;
    /**
     * Create main HTML structure of PhotoSwipe,
     * and add it to DOM
     *
     * @private
     */
    private _createMainStructure;
    bg: HTMLDivElement | undefined;
    ui: UI | undefined;
    /**
     * Get position and dimensions of small thumbnail
     *   {x:,y:,w:}
     *
     * Height is optional (calculated based on the large image)
     *
     * @returns {Bounds | undefined}
     */
    getThumbBounds(): Bounds | undefined;
    /**
     * If the PhotoSwipe can have continuous loop
     * @returns Boolean
     */
    canLoop(): boolean;
    /**
     * @private
     * @param {PhotoSwipeOptions} options
     * @returns {PreparedPhotoSwipeOptions}
     */
    private _prepareOptions;
}
import PhotoSwipeBase from "./core/base.js";
import Slide from "./slide/slide.js";
import DOMEvents from "./util/dom-events.js";
import Animations from "./util/animations.js";
import MainScroll from "./main-scroll.js";
import Gestures from "./gestures/gestures.js";
import Opener from "./opener.js";
import Keyboard from "./keyboard.js";
import ContentLoader from "./slide/loader.js";
import ScrollWheel from "./scroll-wheel.js";
import UI from "./ui/ui.js";
