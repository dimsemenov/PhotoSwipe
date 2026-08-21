/** @typedef {import('../photoswipe.js').PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import('../core/base.js').default} PhotoSwipeBase */
/** @typedef {import('../photoswipe.js').Point} Point */
/** @typedef {import('../slide/slide.js').SlideData} SlideData */

/**
 * @param {PhotoSwipeOptions} options
 * @param {PhotoSwipeBase} pswp
 * @returns {Point}
 */
function getViewportSizeWithoutMargins(options, pswp) {
  if (options.getViewportSizeFn) {
    const newViewportSize = options.getViewportSizeFn(options, pswp);
    if (newViewportSize) {
      return newViewportSize;
    }
  }

  return {
    x: document.documentElement.clientWidth,

    // TODO: height on mobile is very incosistent due to toolbar
    // find a way to improve this
    //
    // document.documentElement.clientHeight - doesn't seem to work well
    y: window.innerHeight
  };
}

/**
 * @param {PhotoSwipeOptions} options
 * @param {PhotoSwipeBase} pswp
 * @returns {Point}
 */
export function getViewportSize(options, pswp) {
  const viewportSize = getViewportSizeWithoutMargins(options, pswp);

  const left = parseMarginOption('left', options, viewportSize);
  const top = parseMarginOption('top', options, viewportSize);
  const right = parseMarginOption('right', options, viewportSize);
  const bottom = parseMarginOption('bottom', options, viewportSize);

  return {
    x: Math.max(0, viewportSize.x - left - right),
    y: Math.max(0, viewportSize.y - top - bottom)
  };
}

/**
 * @param {PhotoSwipeOptions} options
 * @param {PhotoSwipeBase} pswp
 * @returns {Point}
 */
export function getViewportOffset(options, pswp) {
  const viewportSize = getViewportSizeWithoutMargins(options, pswp);
  return {
    x: parseMarginOption('left', options, viewportSize),
    y: parseMarginOption('top', options, viewportSize)
  };
}

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
export function parsePaddingOption(prop, options, viewportSize, itemData, index) {
  let paddingValue = 0;

  if (options.paddingFn) {
    paddingValue = options.paddingFn(viewportSize, itemData, index)[prop];
  } else if (options.padding) {
    paddingValue = options.padding[prop];
  } else {
    const legacyPropName = 'padding' + prop[0].toUpperCase() + prop.slice(1);
    // @ts-expect-error
    if (options[legacyPropName]) {
      // @ts-expect-error
      paddingValue = options[legacyPropName];
    }
  }

  return Number(paddingValue) || 0;
}

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
export function parseMarginOption(prop, options, viewportSize) {
  let marginValue = 0;

  if (options.marginFn) {
    marginValue = options.marginFn(viewportSize)[prop];
  } else if (options.margin) {
    marginValue = options.margin[prop];
  } else {
    const legacyPropName = 'margin' + prop[0].toUpperCase() + prop.slice(1);
    // @ts-expect-error
    if (options[legacyPropName]) {
      // @ts-expect-error
      marginValue = options[legacyPropName];
    }
  }

  return Number(marginValue) || 0;
}

/**
 * @param {PhotoSwipeOptions} options
 * @param {Point} viewportSize
 * @param {SlideData} itemData
 * @param {number} index
 * @returns {Point}
 */
export function getPanAreaSize(options, viewportSize, itemData, index) {
  return {
    x:
      viewportSize.x -
      parsePaddingOption('left', options, viewportSize, itemData, index) -
      parsePaddingOption('right', options, viewportSize, itemData, index),
    y:
      viewportSize.y -
      parsePaddingOption('top', options, viewportSize, itemData, index) -
      parsePaddingOption('bottom', options, viewportSize, itemData, index)
  };
}
