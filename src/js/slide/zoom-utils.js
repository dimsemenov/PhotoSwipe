/**
 * Parses user-defined zoom option.
 *
 * @param {Mixed} optionPrefix Zoom level option prefix (initial, secondary, max)
 */
function parseZoomLevelOption(optionPrefix, slide) {
  // zoom.initial
  // zoom.secondary
  // zoom.max
  const optionValue = slide.pswp.options[optionPrefix + 'ZoomLevel'];

  if (!optionValue) {
    return;
  }

  if (typeof optionValue === 'function') {
    return optionValue.call(slide.pswp, slide);
  }

  if (optionValue === 'fill') {
    return slide.zoomLevels.fill;
  }

  if (optionValue === 'fit') {
    return slide.zoomLevels.fit;
  }

  return Number(optionValue);
}

/**
 * Get zoom level to which image will be zoomed after double-tap gesture,
 * or when user clicks on zoom icon,
 * or mouse-click on image itself.
 * If you return 1 image will be zoomed to its original size.
 *
 * @return {Number}
 */
function getSecondaryZoomLevel(slide) {
  let currZoomLevel = parseZoomLevelOption('secondary', slide);

  if (currZoomLevel) {
    return currZoomLevel;
  }

  // 2.5x of "fit" state, but not larger than original
  currZoomLevel = Math.min(1, slide.zoomLevels.fit * 2.5);
  const maximumAllowedWidth = 3000;

  if (currZoomLevel * slide.width > maximumAllowedWidth) {
    currZoomLevel = maximumAllowedWidth / slide.width;
  }

  return currZoomLevel;
}

/**
 * Get initial image zoom level.
 *
 * @param  {Object} slide object
 * @return {Number}
 */
function getInitialZoomLevel(slide) {
  return parseZoomLevelOption('initial', slide) || slide.zoomLevels.fit;
}

/**
 * Maximum zoom level when user zooms
 * via zoom/pinch gesture,
 * via cmd/ctrl-wheel or via trackpad.
 *
 * @param  {Object} slide object
 * @return {Number}
 */
function getMaxZoomLevel(slide) {
  const currZoomLevel = parseZoomLevelOption('max', slide);

  if (currZoomLevel) {
    return currZoomLevel;
  }

  // max zoom level is x4 from "fit state",
  // used for zoom gesture and ctrl/trackpad zoom
  return Math.max(1, slide.zoomLevels.fit * 4);
}


/**
 * Calculate initial, secondary and maximum zoom level for the specified slide
 *
 * @param {Slide} slide
 */
export function calculateSlideZoomLevels(slide) {
  slide.zoomLevels.initial = getInitialZoomLevel(slide);
  slide.zoomLevels.secondary = getSecondaryZoomLevel(slide);
  slide.zoomLevels.max = Math.max(
    slide.zoomLevels.initial,
    slide.zoomLevels.secondary,
    getMaxZoomLevel(slide)
  );
  slide.zoomLevels.min = Math.min(
    slide.zoomLevels.initial,
    slide.zoomLevels.secondary
  );
}
