/** @typedef {import('./slide.js').SlideData} SlideData */
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */

/** @typedef {{ x: number; y: number; w: number; innerRect?: { w: number; h: number; x: number; y: number } }} Bounds */

/**
 * @param {HTMLElement} el
 * @returns Bounds
 */
function getBoundsByElement(el) {
  const thumbAreaRect = el.getBoundingClientRect();
  return {
    x: thumbAreaRect.left,
    y: thumbAreaRect.top,
    w: thumbAreaRect.width
  };
}

/**
 * @param {HTMLElement} el
 * @param {number} imageWidth
 * @param {number} imageHeight
 * @returns Bounds
 */
function getCroppedBoundsByElement(el, imageWidth, imageHeight) {
  const thumbAreaRect = el.getBoundingClientRect();

  // fill image into the area
  // (do they same as object-fit:cover does to retrieve coordinates)
  const hRatio = thumbAreaRect.width / imageWidth;
  const vRatio = thumbAreaRect.height / imageHeight;
  const fillZoomLevel = hRatio > vRatio ? hRatio : vRatio;

  const offsetX = (thumbAreaRect.width - imageWidth * fillZoomLevel) / 2;
  const offsetY = (thumbAreaRect.height - imageHeight * fillZoomLevel) / 2;

  /**
   * Coordinates of the image,
   * as if it was not cropped,
   * height is calculated automatically
   *
   * @type {Bounds}
   */
  const bounds = {
    x: thumbAreaRect.left + offsetX,
    y: thumbAreaRect.top + offsetY,
    w: imageWidth * fillZoomLevel
  };

  // Coordinates of inner crop area
  // relative to the image
  bounds.innerRect = {
    w: thumbAreaRect.width,
    h: thumbAreaRect.height,
    x: offsetX,
    y: offsetY
  };

  return bounds;
}

/**
 * Get dimensions of thumbnail image
 * (click on which opens photoswipe or closes photoswipe to)
 *
 * @param {number} index
 * @param {SlideData} itemData
 * @param {PhotoSwipe} instance PhotoSwipe instance
 * @returns {Bounds | undefined}
 */
export function getThumbBounds(index, itemData, instance) {
  // legacy event, before filters were introduced
  const event = instance.dispatch('thumbBounds', {
    index,
    itemData,
    instance
  });
  // @ts-expect-error
  if (event.thumbBounds) {
    // @ts-expect-error
    return event.thumbBounds;
  }

  const { element } = itemData;
  /** @type {Bounds | undefined} */
  let thumbBounds;
  /** @type {HTMLElement | null | undefined} */
  let thumbnail;

  if (element && instance.options.thumbSelector !== false) {
    const thumbSelector = instance.options.thumbSelector || 'img';
    thumbnail = element.matches(thumbSelector)
      ? element : /** @type {HTMLElement | null} */ (element.querySelector(thumbSelector));
  }

  thumbnail = instance.applyFilters('thumbEl', thumbnail, itemData, index);

  if (thumbnail) {
    if (!itemData.thumbCropped) {
      thumbBounds = getBoundsByElement(thumbnail);
    } else {
      thumbBounds = getCroppedBoundsByElement(
        thumbnail,
        itemData.width || itemData.w || 0,
        itemData.height || itemData.h || 0
      );
    }
  }

  return instance.applyFilters('thumbBounds', thumbBounds, itemData, index);
}
