/** @typedef {import('../photoswipe.js').Point} Point */

/** @typedef {undefined | null | false | '' | 0} Falsy */
/** @typedef {keyof HTMLElementTagNameMap} HTMLElementTagName */

/**
 * @template {HTMLElementTagName | Falsy} [T="div"]
 * @template {Node | undefined} [NodeToAppendElementTo=undefined]
 * @param {string=} className
 * @param {T=} [tagName]
 * @param {NodeToAppendElementTo=} appendToEl
 * @returns {T extends HTMLElementTagName ? HTMLElementTagNameMap[T] : HTMLElementTagNameMap['div']}
 */
export function createElement(className, tagName, appendToEl) {
  const el = document.createElement(tagName || 'div');
  if (className) {
    el.className = className;
  }
  if (appendToEl) {
    appendToEl.appendChild(el);
  }
  // @ts-expect-error
  return el;
}

/**
 * @param {Point} p1
 * @param {Point} p2
 */
export function equalizePoints(p1, p2) {
  p1.x = p2.x;
  p1.y = p2.y;
  if (p2.id !== undefined) {
    p1.id = p2.id;
  }
  return p1;
}

/**
 * @param {Point} p
 */
export function roundPoint(p) {
  p.x = Math.round(p.x);
  p.y = Math.round(p.y);
}

/**
 * Returns distance between two points.
 *
 * @param {Point} p1
 * @param {Point} p2
 */
export function getDistanceBetween(p1, p2) {
  const x = Math.abs(p1.x - p2.x);
  const y = Math.abs(p1.y - p2.y);
  return Math.sqrt((x * x) + (y * y));
}

/**
 * Whether X and Y positions of points are qual
 *
 * @param {Point} p1
 * @param {Point} p2
 */
export function pointsEqual(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * The float result between the min and max values.
 *
 * @param {number} val
 * @param {number} min
 * @param {number} max
 */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Get transform string
 *
 * @param {number} x
 * @param {number=} y
 * @param {number=} scale
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
 * @param {HTMLElement} el
 * @param {number} x
 * @param {number=} y
 * @param {number=} scale
 */
export function setTransform(el, x, y, scale) {
  el.style.transform = toTransformString(x, y, scale);
}

const defaultCSSEasing = 'cubic-bezier(.4,0,.22,1)';

/**
 * Apply CSS transition to element
 *
 * @param {HTMLElement} el
 * @param {string=} prop CSS property to animate
 * @param {number=} duration in ms
 * @param {string=} ease CSS easing function
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
 *
 * @param {HTMLElement} el
 * @param {string | number} w
 * @param {string | number} h
 */
export function setWidthHeight(el, w, h) {
  el.style.width = (typeof w === 'number') ? (w + 'px') : w;
  el.style.height = (typeof h === 'number') ? (h + 'px') : h;
}

/**
 * @param {HTMLElement} el
 */
export function removeTransitionStyle(el) {
  setTransitionStyle(el);
}

/**
 * @param {HTMLImageElement} img
 * @returns {Promise<HTMLImageElement | void>}
 */
export function decodeImage(img) {
  if ('decode' in img) {
    return img.decode().catch(() => {});
  }

  if (img.complete) {
    return Promise.resolve(img);
  }

  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

/** @typedef {LOAD_STATE[keyof LOAD_STATE]} LoadState */
/** @type {{ IDLE: 'idle'; LOADING: 'loading'; LOADED: 'loaded'; ERROR: 'error' }} */
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
 * @param {MouseEvent | KeyboardEvent} e
 */
export function specialKeyUsed(e) {
  if (e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
    return true;
  }
}

/**
 * Parse `gallery` or `children` options.
 *
 * @param {import('../photoswipe.js').ElementProvider} option
 * @param {string=} legacySelector
 * @param {HTMLElement | Document} [parent]
 * @returns HTMLElement[]
 */
export function getElementsFromOption(option, legacySelector, parent = document) {
  /** @type {HTMLElement[]} */
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

/**
 * Check if variable is PhotoSwipe class
 *
 * @param {any} fn
 */
export function isPswpClass(fn) {
  return typeof fn === 'function'
    && fn.prototype
    && fn.prototype.goTo;
}

/**
 * Check if browser is Safari
 *
 * @returns {boolean}
 */
export function isSafari() {
  return !!(navigator.vendor && navigator.vendor.match(/apple/i));
}

