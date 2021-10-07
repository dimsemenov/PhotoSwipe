/**
  * Creates element and optionally appends it to another.
  *
  * @param {String} className
  * @param {String|NULL} tagName
  * @param {Element|NULL} appendToEl
  */
export function createElement(className, tagName, appendToEl) {
  const el = document.createElement(tagName || 'div');
  if (className) {
    el.className = className;
  }
  if (appendToEl) {
    appendToEl.appendChild(el);
  }
  return el;
}

export function equalizePoints(p1, p2) {
  p1.x = p2.x;
  p1.y = p2.y;
  if (p2.id !== undefined) {
    p1.id = p2.id;
  }
  return p1;
}


export function roundPoint(p) {
  p.x = Math.round(p.x);
  p.y = Math.round(p.y);
}

/**
 * Returns distance between two points.
 *
 * @param {Object} p1 Point
 * @param {Object} p2 Point
 */
export function getDistanceBetween(p1, p2) {
  const x = Math.abs(p1.x - p2.x);
  const y = Math.abs(p1.y - p2.y);
  return Math.sqrt((x * x) + (y * y));
}

/**
 * Whether X and Y positions of points are qual
 *
 * @param {Object} p1
 * @param {Object} p2
 */
export function pointsEqual(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * The float result between the min and max values.
 *
 * @param {Number} val
 * @param {Number} min
 * @param {Number} max
 */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Get transform string
 *
 * @param {Number} x
 * @param {Number|null} y
 * @param {Number|null} scale
 */
export function toTransformString(x, y, scale) {
  let propValue = 'translate3d('
    + x + 'px,' + (y || 0) + 'px'
    + ',0)';

  if (scale !== undefined) {
    propValue += ' scale3d('
      + scale + ',' + scale
      + ',1)';
  }

  return propValue;
}

/**
 * Apply transform:translate(x, y) scale(scale) to element
 *
 * @param {DOMElement} el
 * @param {Number} x
 * @param {Number|null} y
 * @param {Number|null} scale
 */
export function setTransform(el, x, y, scale) {
  el.style.transform = toTransformString(x, y, scale);
}

const defaultCSSEasing = 'cubic-bezier(.4,0,.22,1)';

/**
 * Apply CSS transition to element
 *
 * @param {Element} el
 * @param {String} prop CSS property to animate
 * @param {Number} duration in ms
 * @param {String|NULL} ease CSS easing function
 */
export function setTransitionStyle(el, prop, duration, ease) {
  // inOut: 'cubic-bezier(.4, 0, .22, 1)', // for "toggle state" transitions
  // out: 'cubic-bezier(0, 0, .22, 1)', // for "show" transitions
  // in: 'cubic-bezier(.4, 0, 1, 1)'// for "hide" transitions
  el.style.transition = prop
    ? (prop + ' ' + duration + 'ms ' + (ease || defaultCSSEasing))
    : 'none';
}

/**
 * Apply width and height CSS properties to element
 */
export function setWidthHeight(el, w, h) {
  el.style.width = (typeof w === 'number') ? (w + 'px') : w;
  el.style.height = (typeof h === 'number') ? (h + 'px') : h;
}

export function removeTransitionStyle(el) {
  setTransitionStyle(el);
}

export function decodeImage(img) {
  if ('decode' in img) {
    return img.decode();
  }

  if (img.complete) {
    return Promise.resolve(img);
  }

  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

export const LOAD_STATE = {
  IDLE: 'idle',
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
};


/**
 * Check if click or keydown event was dispatched
 * with a special key or via mouse wheel.
 *
 * @param {Event} e
 */
export function specialKeyUsed(e) {
  if (e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
    return true;
  }
}

/**
 * Parse `gallery` or `children` options.
 *
 * @param {Element|NodeList|String} option
 * @param {String|null} legacySelector
 * @param {Element|null} parent
 * @returns Element[]
 */
export function getElementsFromOption(option, legacySelector, parent = document) {
  let elements = [];

  if (option instanceof Element) {
    elements = [option];
  } else if (option instanceof NodeList || Array.isArray(option)) {
    elements = Array.from(option);
  } else {
    const selector = typeof option === 'string' ? option : legacySelector;
    if (selector) {
      elements = Array.from(parent.querySelectorAll(selector));
    }
  }

  return elements;
}
