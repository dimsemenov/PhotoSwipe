/**
 * Get dimensions of thumbnail image
 * (click on which opens photoswipe or closes photoswipe to)
 *
 * @param {number} index
 * @param {SlideData} itemData
 * @param {PhotoSwipe} instance PhotoSwipe instance
 * @returns {Bounds | undefined}
 */
export function getThumbBounds(index: number, itemData: SlideData, instance: PhotoSwipe): Bounds | undefined;
export type SlideData = import('./slide.js').SlideData;
export type PhotoSwipe = import('../photoswipe.js').default;
export type Bounds = {
    x: number;
    y: number;
    w: number;
    innerRect?: {
        w: number;
        h: number;
        x: number;
        y: number;
    };
};
