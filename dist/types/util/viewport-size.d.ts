/**
 * @param {PhotoSwipeOptions} options
 * @param {PhotoSwipeBase} pswp
 * @returns {Point}
 */
export function getViewportSize(options: PhotoSwipeOptions, pswp: PhotoSwipeBase): Point;
/**
 * @param {PhotoSwipeOptions} options
 * @param {PhotoSwipeBase} pswp
 * @returns {Point}
 */
export function getViewportOffset(options: PhotoSwipeOptions, pswp: PhotoSwipeBase): Point;
/**
 * Parses padding option.
 * Supported formats:
 *
 * // Object
 * padding: {
 *  top: 0,
 *  bottom: 0,
 *  left: 0,
 *  right: 0
 * }
 *
 * // A function that returns the object
 * paddingFn: (viewportSize, itemData, index) => {
 *  return {
 *    top: 0,
 *    bottom: 0,
 *    left: 0,
 *    right: 0
 *  };
 * }
 *
 * // Legacy variant
 * paddingLeft: 0,
 * paddingRight: 0,
 * paddingTop: 0,
 * paddingBottom: 0,
 *
 * @param {'left' | 'top' | 'bottom' | 'right'} prop
 * @param {PhotoSwipeOptions} options PhotoSwipe options
 * @param {Point} viewportSize PhotoSwipe viewport size, for example: { x:800, y:600 }
 * @param {SlideData} itemData Data about the slide
 * @param {number} index Slide index
 * @returns {number}
 */
export function parsePaddingOption(prop: 'left' | 'top' | 'bottom' | 'right', options: PhotoSwipeOptions, viewportSize: Point, itemData: SlideData, index: number): number;
/**
 * Parses margin option.
 * Supported formats:
 *
 * // Object
 * margin: {
 *  top: 0,
 *  bottom: 0,
 *  left: 0,
 *  right: 0
 * }
 *
 * // A function that returns the object
 * marginFn: (viewportSize) => {
 *  return {
 *    top: 0,
 *    bottom: 0,
 *    left: 0,
 *    right: 0
 *  };
 * }
 *
 * // Legacy variant
 * marginLeft: 0,
 * marginRight: 0,
 * marginTop: 0,
 * marginBottom: 0,
 *
 * @param {'left' | 'top' | 'bottom' | 'right'} prop
 * @param {PhotoSwipeOptions} options PhotoSwipe options
 * @param {Point} viewportSize PhotoSwipe viewport size before margins, for example: { x:800, y:600 }
 * @returns {number}
 */
export function parseMarginOption(prop: 'left' | 'top' | 'bottom' | 'right', options: PhotoSwipeOptions, viewportSize: Point): number;
/**
 * @param {PhotoSwipeOptions} options
 * @param {Point} viewportSize
 * @param {SlideData} itemData
 * @param {number} index
 * @returns {Point}
 */
export function getPanAreaSize(options: PhotoSwipeOptions, viewportSize: Point, itemData: SlideData, index: number): Point;
export type PhotoSwipeOptions = import('../photoswipe.js').PhotoSwipeOptions;
export type PhotoSwipeBase = import('../core/base.js').default;
export type Point = import('../photoswipe.js').Point;
export type SlideData = import('../slide/slide.js').SlideData;
