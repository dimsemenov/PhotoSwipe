export default ZoomLevel;
export type PhotoSwipe = import('../photoswipe.js').default;
export type PhotoSwipeOptions = import('../photoswipe.js').PhotoSwipeOptions;
export type SlideData = import('../slide/slide.js').SlideData;
export type ZoomLevelOption = number | "fit" | "fill" | ((zoomLevelObject: ZoomLevel) => number);
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../photoswipe.js').PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import('../slide/slide.js').SlideData} SlideData */
/** @typedef {'fit' | 'fill' | number | ((zoomLevelObject: ZoomLevel) => number)} ZoomLevelOption */
/**
 * Calculates zoom levels for specific slide.
 * Depends on viewport size and image size.
 */
declare class ZoomLevel {
    /**
     * @param {PhotoSwipeOptions} options PhotoSwipe options
     * @param {SlideData} itemData Slide data
     * @param {number} index Slide index
     * @param {PhotoSwipe=} pswp PhotoSwipe instance, can be undefined if not initialized yet
     */
    constructor(options: PhotoSwipeOptions, itemData: SlideData, index: number, pswp?: PhotoSwipe | undefined);
    pswp: import("../photoswipe.js").default;
    options: import("../photoswipe.js").PhotoSwipeOptions;
    itemData: import("../slide/slide.js").SlideData;
    index: number;
    /**
     * Calculate initial, secondary and maximum zoom level for the specified slide.
     *
     * It should be called when either image or viewport size changes.
     *
     * @param {number} maxWidth
     * @param {number} maxHeight
     * @param {{ x?: number; y?: number }} panAreaSize
     */
    update(maxWidth: number, maxHeight: number, panAreaSize: {
        x?: number;
        y?: number;
    }): void;
    elementSize: {
        x: number;
        y: number;
    };
    panAreaSize: {
        x?: number;
        y?: number;
    };
    fit: number;
    fill: number;
    vFill: number;
    initial: number;
    secondary: number;
    max: number;
    min: number;
    /**
     * Parses user-defined zoom option.
     *
     * @private
     * @param {'initial' | 'secondary' | 'max'} optionPrefix Zoom level option prefix (initial, secondary, max)
     */
    private _parseZoomLevelOption;
    /**
     * Get zoom level to which image will be zoomed after double-tap gesture,
     * or when user clicks on zoom icon,
     * or mouse-click on image itself.
     * If you return 1 image will be zoomed to its original size.
     *
     * @private
     * @return {number}
     */
    private _getSecondary;
    /**
     * Get initial image zoom level.
     *
     * @private
     * @return {number}
     */
    private _getInitial;
    /**
     * Maximum zoom level when user zooms
     * via zoom/pinch gesture,
     * via cmd/ctrl-wheel or via trackpad.
     *
     * @private
     * @return {number}
     */
    private _getMax;
}
