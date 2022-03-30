function getBoundsByElement(el) {
  const thumbAreaRect = el.getBoundingClientRect();
  return {
    x: thumbAreaRect.left,
    y: thumbAreaRect.top,
    w: thumbAreaRect.width
  };
}

function getCroppedBoundsByElement(el, imageWidth, imageHeight, position) {
  const thumbAreaRect = el.getBoundingClientRect();

  // fill image into the area
  // (do they same as object-fit:cover does to retrieve coordinates)
  const hRatio = thumbAreaRect.width / imageWidth;
  const vRatio = thumbAreaRect.height / imageHeight;
  const fillZoomLevel = hRatio > vRatio ? hRatio : vRatio;
  const [positionX, positionY] = position.split(' ');

  const offsetX = getCroppedBoundsOffset(positionX, imageWidth, thumbAreaRect.width, fillZoomLevel);
  const offsetY = getCroppedBoundsOffset(positionY, imageHeight, thumbAreaRect.height, fillZoomLevel);

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

function getCroppedBoundsOffset(position, imageSize, thumbSize, zoomLevel) {
  const float = parseFloat(position);

  if (position.indexOf('%')) {
    return (thumbSize - imageSize * zoomLevel) * float / 100;
  }

  return float;
}

/**
 * Get dimensions of thumbnail image
 * (click on which opens photoswipe or closes photoswipe to)
 *
 * @param {Integer} index
 * @param {Object} itemData
 * @param {PhotoSwipe} instance PhotoSwipe instance
 * @returns Object|undefined
 */
export function getThumbBounds(index, itemData, instance) {
  // legacy event, before filters were introduced
  const event = instance.dispatch('thumbBounds', {
    index,
    itemData,
    instance
  });
  if (event.thumbBounds) {
    return event.thumbBounds;
  }

  const { element } = itemData;
  let thumbBounds;
  let thumbnail;

  if (element && instance.options.thumbSelector !== false) {
    const thumbSelector = instance.options.thumbSelector || 'img';
    thumbnail = element.matches(thumbSelector)
      ? element : element.querySelector(thumbSelector);
  }

  thumbnail = instance.applyFilters('thumbEl', thumbnail, itemData, index);

  if (thumbnail) {
    if (!itemData.thumbCropped) {
      thumbBounds = getBoundsByElement(thumbnail);
    } else {
      thumbBounds = getCroppedBoundsByElement(
        thumbnail,
        itemData.w,
        itemData.h,
        itemData.thumbCroppedPosition
      );
    }
  }

  return instance.applyFilters('thumbBounds', thumbBounds, itemData, index);
}
