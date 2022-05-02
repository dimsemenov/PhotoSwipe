/** @typedef {import("../photoswipe").default} PhotoSwipe */

/**
 * Base PhotoSwipe event object
 */
class PhotoSwipeEvent {
  /**
   * @param {string} type
   * @param {Record<string, any>} [details]
   */
  constructor(type, details) {
    this.type = type;
    if (details) {
      Object.assign(this, details);
    }
  }

  preventDefault() {
    this.defaultPrevented = true;
  }
}

/** @typedef {{ fn: () => any, priority: number }} Filter */

/**
 * PhotoSwipe base class that can listen and dispatch for events.
 * Shared by PhotoSwipe Core and PhotoSwipe Lightbox, extended by base.js
 */
class Eventable {
  constructor() {
    /**
     * @type {Record<string, (() => any)[]>}
     */
    this._listeners = {};

    /**
     * @type {Record<string, Filter[]>}
     */
    this._filters = {};

    /** @type {PhotoSwipe=} */
    this.pswp = undefined;
  }

  /**
   * @param {string} name
   * @param {() => any} fn
   * @param {number} priority
   */
  addFilter(name, fn, priority = 100) {
    if (!this._filters[name]) {
      this._filters[name] = [];
    }

    this._filters[name].push({ fn, priority });
    this._filters[name].sort((f1, f2) => f1.priority - f2.priority);

    if (this.pswp) {
      this.pswp.addFilter(name, fn, priority);
    }
  }

  /**
   * @param {string} name
   * @param {() => any} fn
   */
  removeFilter(name, fn) {
    if (this._filters[name]) {
      this._filters[name] = this._filters[name].filter(filter => (filter.fn !== fn));
    }

    if (this.pswp) {
      this.pswp.removeFilter(name, fn);
    }
  }

  /**
   * @param {string} name
   * @param  {any[]} args
   */
  applyFilters(name, ...args) {
    if (this._filters[name]) {
      this._filters[name].forEach((filter) => {
        // @ts-expect-error TODO
        args[0] = filter.fn.apply(this, args);
      });
    }
    return args[0];
  }

  /**
   * @param {string} name
   * @param {() => any} fn
   */
  on(name, fn) {
    if (!this._listeners[name]) {
      this._listeners[name] = [];
    }
    this._listeners[name].push(fn);

    // When binding events to lightbox,
    // also bind events to PhotoSwipe Core,
    // if it's open.
    if (this.pswp) {
      this.pswp.on(name, fn);
    }
  }

  /**
   * @param {string} name
   * @param {() => any} fn
   */
  off(name, fn) {
    if (this._listeners[name]) {
      this._listeners[name] = this._listeners[name].filter(listener => (fn !== listener));
    }

    if (this.pswp) {
      this.pswp.off(name, fn);
    }
  }

  /**
   * @param {string} name
   * @param {Record<string, any>} [details]
   * @returns {PhotoSwipeEvent}
   */
  dispatch(name, details) {
    if (this.pswp) {
      return this.pswp.dispatch(name, details);
    }

    const event = new PhotoSwipeEvent(name, details);

    if (!this._listeners) {
      return event;
    }

    if (this._listeners[name]) {
      this._listeners[name].forEach((listener) => {
        // @ts-expect-error TODO
        listener.call(this, event);
      });
    }

    return event;
  }
}

export default Eventable;
