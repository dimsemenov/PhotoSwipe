/** @typedef {import('../photoswipe.js').PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../slide/slide.js').SlideData} SlideData */
/**
 * @param {PhotoSwipeOptions} options
 * @param {PhotoSwipe} pswp
 */
export function getViewportSize(options: PhotoSwipeOptions, pswp: PhotoSwipe): {
    x: number;
    y: number;
};
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
 * @param {{ x?: number; y?: number }} viewportSize PhotoSwipe viewport size, for example: { x:800, y:600 }
 * @param {SlideData} itemData Data about the slide
 * @param {number} index Slide index
 * @returns {number}
 */
export function parsePaddingOption(prop: 'left' | 'top' | 'bottom' | 'right', options: PhotoSwipeOptions, viewportSize: {
    x?: number;
    y?: number;
}, itemData: SlideData, index: number): number;
/**
 * @param {PhotoSwipeOptions} options
 * @param {{ x?: number; y?: number }} viewportSize
 * @param {SlideData} itemData
 * @param {number} index
 */
export function getPanAreaSize(options: PhotoSwipeOptions, viewportSize: {
    x?: number;
    y?: number;
}, itemData: SlideData, index: number): {
    x: number;
    y: number;
};
export type PhotoSwipeOptions = import('../photoswipe.js').PhotoSwipeOptions;
export type PhotoSwipe = import('../photoswipe.js').default;
export type SlideData = import('../slide/slide.js').SlideData;
