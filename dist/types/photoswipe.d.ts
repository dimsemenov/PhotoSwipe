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
/**
 * <T>
 */
export type EventCallback<T> = import('./core/eventable.js').EventCallback<T>;
/**
 * <T>
 */
export type AugmentedEvent<T> = import('./core/eventable.js').AugmentedEvent<T>;
export type Point = {
    x?: number;
    y?: number;
    id?: string | number;
};
export type Size = {
    x?: number;
    y?: number;
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
/**
 * https://photoswipe.com/options/
 */
export type PhotoSwipeOptions = {
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
    bgOpacity?: number | undefined;
    /**
     * Spacing between slides. Defined as ratio relative to the viewport width (0.1 = 10% of viewport).
     */
    spacing?: number | undefined;
    /**
     * Allow swipe navigation to the next slide when the current slide is zoomed. Does not apply to mouse events.
     */
    allowPanToNext?: boolean | undefined;
    /**
     * If set to true you'll be able to swipe from the last to the first image.
     * Option is always false when there are less than 3 slides.
     */
    loop?: boolean | undefined;
    /**
     * By default PhotoSwipe zooms image with ctrl-wheel, if you enable this option - image will zoom just via wheel.
     */
    wheelToZoom?: boolean | undefined;
    /**
     * Pinch touch gesture to close the gallery.
     */
    pinchToClose?: boolean | undefined;
    /**
     * Vertical drag gesture to close the PhotoSwipe.
     */
    closeOnVerticalDrag?: boolean | undefined;
    /**
     * Slide area padding (in pixels).
     */
    padding?: Padding | undefined;
    /**
     * The option is checked frequently, so make sure it's performant. Overrides padding option if defined. For example:
     */
    paddingFn?: (viewportSize: Size, itemData: SlideData, index: number) => Padding;
    /**
     * Transition duration in milliseconds, can be 0.
     */
    hideAnimationDuration?: number | false;
    /**
     * Transition duration in milliseconds, can be 0.
     */
    showAnimationDuration?: number | false;
    /**
     * Transition duration in milliseconds, can be 0.
     */
    zoomAnimationDuration?: number | false;
    /**
     * String, 'cubic-bezier(.4,0,.22,1)'. CSS easing function for open/close/zoom transitions.
     */
    easing?: string | undefined;
    /**
     * Esc key to close.
     */
    escKey?: boolean | undefined;
    /**
     * Left/right arrow keys for navigation.
     */
    arrowKeys?: boolean | undefined;
    /**
     * Restore focus the last active element after PhotoSwipe is closed.
     */
    returnFocus?: boolean | undefined;
    /**
     * If image is not zoomable (for example, smaller than viewport) it can be closed by clicking on it.
     */
    clickToCloseNonZoomable?: boolean | undefined;
    /**
     * Refer to click and tap actions page.
     */
    imageClickAction?: ActionType | ActionFn | false;
    /**
     * Refer to click and tap actions page.
     */
    bgClickAction?: ActionType | ActionFn | false;
    /**
     * Refer to click and tap actions page.
     */
    tapAction?: ActionType | ActionFn | false;
    /**
     * Refer to click and tap actions page.
     */
    doubleTapAction?: ActionType | ActionFn | false;
    /**
     * Delay before the loading indicator will be displayed,
     * if image is loaded during it - the indicator will not be displayed at all. Can be zero.
     */
    preloaderDelay?: number | undefined;
    /**
     * Used for slide count indicator ("1 of 10 ").
     */
    indexIndicatorSep?: string | undefined;
    /**
     * A function that should return slide viewport width and height, in format {x: 100, y: 100}.
     */
    getViewportSizeFn?: (options: PhotoSwipeOptions, pswp: PhotoSwipe) => {
        x: number;
        y: number;
    };
    /**
     * Message to display when the image wasn't able to load. If you need to display HTML - use contentErrorElement filter.
     */
    errorMsg?: string | undefined;
    /**
     * Lazy loading of nearby slides based on direction of movement. Should be an array with two integers,
     * first one - number of items to preload before the current image, second one - after the current image.
     * Two nearby images are always loaded.
     */
    preload?: [number, number] | undefined;
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
    maxWidthToAnimate?: number | undefined;
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
    showHideAnimationType?: 'zoom' | 'fade' | 'none';
    /**
     * Defines start slide index.
     */
    index?: number | undefined;
    getClickedIndexFn?: (e: MouseEvent) => number;
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
    initialZoomLevel?: ZoomLevelOption | undefined;
    secondaryZoomLevel?: ZoomLevelOption | undefined;
    maxZoomLevel?: ZoomLevelOption | undefined;
    mouseMovePan?: boolean | undefined;
    initialPointerPos?: Point | null;
    showHideOpacity?: boolean | undefined;
    pswpModule?: PhotoSwipeModuleOption;
    openPromise?: () => Promise<any>;
    preloadFirstSlide?: boolean | undefined;
    gallery?: string | undefined;
    gallerySelector?: string | undefined;
    children?: string | undefined;
    childSelector?: string | undefined;
    thumbSelector?: string | false;
};
/**
 * PhotoSwipe Core
 */
declare class PhotoSwipe extends PhotoSwipeBase {
    /**
     * @param {PhotoSwipeOptions} options
     */
    constructor(options: PhotoSwipeOptions);
    /**
     * offset of viewport relative to document
     *
     * @type {{ x?: number; y?: number }}
     */
    offset: {
        x?: number;
        y?: number;
    };
    /**
     * @type {{ x?: number; y?: number }}
     * @private
     */
    private _prevViewportSize;
    /**
     * Size of scrollable PhotoSwipe viewport
     *
     * @type {{ x?: number; y?: number }}
     */
    viewportSize: {
        x?: number;
        y?: number;
    };
    /**
     * background (backdrop) opacity
     *
     * @type {number}
     */
    bgOpacity: number;
    /** @type {HTMLDivElement} */
    topBar: HTMLDivElement;
    events: DOMEvents;
    /** @type {Animations} */
    animations: Animations;
    mainScroll: MainScroll;
    gestures: Gestures;
    opener: Opener;
    keyboard: Keyboard;
    contentLoader: ContentLoader;
    init(): boolean;
    isOpen: boolean;
    currIndex: number;
    potentialIndex: number;
    scrollWheel: ScrollWheel;
    _initialItemData: import("./slide/slide.js").SlideData;
    _initialThumbBounds: import("./slide/get-thumb-bounds.js").Bounds;
    /**
     * Get looped slide index
     * (for example, -1 will return the last slide)
     *
     * @param {number} index
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
    zoomTo(destZoomLevel: number, centerPoint: {
        x?: number;
        y?: number;
    }, transitionDuration?: number | false, ignoreBounds?: boolean): void;
    /**
     * @see slide/slide.js toggleZoom
     */
    toggleZoom(): void;
    /**
     * Close the gallery.
     * After closing transition ends - destroy it
     */
    close(): void;
    isDestroying: boolean;
    /**
     * Destroys the gallery:
     * - instantly closes the gallery
     * - unbinds events,
     * - cleans intervals and timeouts
     * - removes elements from DOM
     */
    destroy(): void;
    listeners: any;
    /**
     * Refresh/reload content of a slide by its index
     *
     * @param {number} slideIndex
     */
    refreshSlideContent(slideIndex: number): void;
    /** @type {Slide} */
    currSlide: Slide;
    /**
     * Set slide content
     *
     * @param {ItemHolder} holder mainScroll.itemHolders array item
     * @param {number} index Slide index
     * @param {boolean=} force If content should be set even if index wasn't changed
     */
    setContent(holder: ItemHolder, index: number, force?: boolean | undefined): void;
    getViewportCenterPoint(): {
        x: number;
        y: number;
    };
    /**
     * Update size of all elements.
     * Executed on init and on page resize.
     *
     * @param {boolean=} force Update size even if size of viewport was not changed.
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
    hasMouse: boolean;
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
    element: HTMLDivElement;
    template: HTMLDivElement;
    bg: HTMLDivElement;
    scrollWrap: HTMLDivElement;
    container: HTMLDivElement;
    ui: UI;
    /**
     * Get position and dimensions of small thumbnail
     *   {x:,y:,w:}
     *
     * Height is optional (calculated based on the large image)
     */
    getThumbBounds(): import("./slide/get-thumb-bounds.js").Bounds;
    /**
     * If the PhotoSwipe can have continious loop
     * @returns Boolean
     */
    canLoop(): boolean;
    /**
     * @param {PhotoSwipeOptions} options
     * @private
     */
    private _prepareOptions;
}
import PhotoSwipeBase from "./core/base.js";
import DOMEvents from "./util/dom-events.js";
import Animations from "./util/animations.js";
import MainScroll from "./main-scroll.js";
import Gestures from "./gestures/gestures.js";
import Opener from "./opener.js";
import Keyboard from "./keyboard.js";
import ContentLoader from "./slide/loader.js";
import ScrollWheel from "./scroll-wheel.js";
import Slide from "./slide/slide.js";
import UI from "./ui/ui.js";
