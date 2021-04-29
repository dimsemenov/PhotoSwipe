/**
 * Get dimensions of thumbnail image
 * (click on which opens photoswipe or closes photoswipe to)
 *
 * @param {Integer} index
 * @param {Object} itemData
 * @param {PhotoSwipe} instance PhotoSwipe instance
 */
export function getThumbBounds(index, itemData, instance) {
  const event = instance.dispatch('thumbBounds', {
    index,
    itemData,
    instance
  });

  if (event.thumbBounds) {
    return event.thumbBounds;
  }

  const { element } = itemData;

  if (!element
      || instance.options.thumbSelector === false) {
    return;
  }

  const thumbSelector = instance.options.thumbSelector || 'img';
  const thumbnail = element.matches(thumbSelector)
    ? element : element.querySelector(thumbSelector);

  if (!thumbnail) {
    return;
  }

  const thumbAreaRect = thumbnail.getBoundingClientRect();

  if (!itemData.thumbCropped) {
    return {
      x: thumbAreaRect.left,
      y: thumbAreaRect.top,
      w: thumbAreaRect.width
    };
  }

  // get dimensions of the large image,
  // its aspect ratio must match thumbnail image
  const imageWidth = itemData.w;
  const imageHeight = itemData.h;

  if (!imageWidth || !imageHeight) {
    return;
  }

  // fill image into the area
  // (do they same as object-fit:cover does to retrieve coordinates)
  const hRatio = thumbAreaRect.width / imageWidth;
  const vRatio = thumbAreaRect.height / imageHeight;
  const fillZoomLevel = hRatio > vRatio ? hRatio : vRatio;

  const offsetX = (thumbAreaRect.width - imageWidth * fillZoomLevel) / 2;
  const offsetY = (thumbAreaRect.height - imageHeight * fillZoomLevel) / 2;

  // Coordinates of the image,
  // as if it was not cropped,
  // height is calculated automatically
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
