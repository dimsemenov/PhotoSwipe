export default ZoomLevel;
export type PhotoSwipe = import('../photoswipe.js').default;
export type PhotoSwipeOptions = import('../photoswipe.js').PhotoSwipeOptions;
export type SlideData = import('../slide/slide.js').SlideData;
export type ZoomLevelOption = number | "fit" | "fill" | ((zoomLevelObject: ZoomLevel) => number);
export type PanAreaSize = {
    x: number;
    y: number;
};
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../photoswipe.js').PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import('../slide/slide.js').SlideData} SlideData */
/** @typedef {'fit' | 'fill' | number | ((zoomLevelObject: ZoomLevel) => number)} ZoomLevelOption */
/** @typedef {{ x: number; y: number }} PanAreaSize */
/**
 * Calculates zoom levels for specific slide.
 * Depends on viewport size and image size.
 */
declare class ZoomLevel {
    /**
     * @param {PhotoSwipeOptions} options PhotoSwipe options
     * @param {SlideData} itemData Slide data
     * @param {number} index Slide index
     * @param {PhotoSwipe} [pswp] PhotoSwipe instance, can be undefined if not initialized yet
     */
    constructor(options: PhotoSwipeOptions, itemData: SlideData, index: number, pswp?: PhotoSwipe);
    pswp: import("../photoswipe.js").default;
    options: import("../photoswipe.js").PhotoSwipeOptions;
    itemData: import("../slide/slide.js").SlideData;
    index: number;
    /** @type { PanAreaSize | null } */
    panAreaSize: PanAreaSize | null;
    /** @type { PanAreaSize | null } */
    elementSize: PanAreaSize | null;
    fit: number;
    fill: number;
    vFill: number;
    initial: number;
    secondary: number;
    max: number;
    min: number;
    /**
     * Calculate initial, secondary and maximum zoom level for the specified slide.
     *
     * It should be called when either image or viewport size changes.
     *
     * @param {number} maxWidth
     * @param {number} maxHeight
     * @param {PanAreaSize} panAreaSize
     */
    update(maxWidth: number, maxHeight: number, panAreaSize: PanAreaSize): void;
    /**
     * Parses user-defined zoom option.
     *
     * @private
     * @param {'initial' | 'secondary' | 'max'} optionPrefix Zoom level option prefix (initial, secondary, max)
     * @returns { number | undefined }
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
