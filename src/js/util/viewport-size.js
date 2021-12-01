export function getViewportSize(options, pswp) {
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
 * paddingFn: (viewportSize, itemData) => {
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
 * @param {String} prop 'left', 'top', 'bottom', 'right'
 * @param {Object} options PhotoSwipe options
 * @param {Object} viewportSize PhotoSwipe viewport size, for example: { x:800, y:600 }
 * @param {Object} itemData Slide data
 * @returns {Number}
 */
export function parsePaddingOption(prop, options, viewportSize, itemData) {
  let paddingValue;

  if (options.paddingFn) {
    paddingValue = options.paddingFn(viewportSize, itemData)[prop];
  } else if (options.padding) {
    paddingValue = options.padding[prop];
  } else {
    const legacyPropName = 'padding' + prop[0].toUpperCase() + prop.slice(1);
    if (options[legacyPropName]) {
      paddingValue = options[legacyPropName];
    }
  }

  return paddingValue || 0;
}


export function getPanAreaSize(options, viewportSize, itemData/*, pswp*/) {
  return {
    x: viewportSize.x
      - parsePaddingOption('left', options, viewportSize, itemData)
      - parsePaddingOption('right', options, viewportSize, itemData),
    y: viewportSize.y
      - parsePaddingOption('top', options, viewportSize, itemData)
      - parsePaddingOption('bottom', options, viewportSize, itemData)
  };
}
