// Detect passive event listener support
let supportsPassive = false;
/* eslint-disable */
try {
  window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
    get: () => {
      supportsPassive = true;
    }
  }));
} catch (e) {}
/* eslint-enable */


/**
 * @typedef {Object} PoolItem
 * @prop {HTMLElement | Window | Document} target
 * @prop {string} type
 * @prop {(e: any) => void} listener
 * @prop {boolean} passive
 */

class DOMEvents {
  constructor() {
    /**
     * @type {PoolItem[]}
     * @private
     */
    this._pool = [];
  }

  /**
   * Adds event listeners
   *
   * @param {HTMLElement | Window | Document} target
   * @param {string} type Can be multiple, separated by space.
   * @param {(e: any) => void} listener
   * @param {boolean=} passive
   */
  add(target, type, listener, passive) {
    this._toggleListener(target, type, listener, passive);
  }

  /**
   * Removes event listeners
   *
   * @param {HTMLElement | Window | Document} target
   * @param {string} type
   * @param {(e: any) => void} listener
   * @param {boolean=} passive
   */
  remove(target, type, listener, passive) {
    this._toggleListener(target, type, listener, passive, true);
  }

  /**
   * Removes all bound events
   */
  removeAll() {
    this._pool.forEach((poolItem) => {
      this._toggleListener(
        poolItem.target,
        poolItem.type,
        poolItem.listener,
        poolItem.passive,
        true,
        true
      );
    });
    this._pool = [];
  }

  /**
   * Adds or removes event
   *
   * @param {HTMLElement | Window | Document} target
   * @param {string} type
   * @param {(e: any) => void} listener
   * @param {boolean} passive
   * @param {boolean=} unbind Whether the event should be added or removed
   * @param {boolean=} skipPool Whether events pool should be skipped
   */
  _toggleListener(target, type, listener, passive, unbind, skipPool) {
    if (!target) {
      return;
    }

    const methodName = unbind ? 'removeEventListener' : 'addEventListener';
    const types = type.split(' ');
    types.forEach((eType) => {
      if (eType) {
        // Events pool is used to easily unbind all events when PhotoSwipe is closed,
        // so developer doesn't need to do this manually
        if (!skipPool) {
          if (unbind) {
            // Remove from the events pool
            this._pool = this._pool.filter((poolItem) => {
              return poolItem.type !== eType
                || poolItem.listener !== listener
                || poolItem.target !== target;
            });
          } else {
            // Add to the events pool
            this._pool.push({
              target,
              type: eType,
              listener,
              passive
            });
          }
        }


        // most PhotoSwipe events call preventDefault,
        // and we do not need browser to scroll the page
        const eventOptions = supportsPassive ? { passive: (passive || false) } : false;

        target[methodName](
          eType,
          listener,
          eventOptions
        );
      }
    });
  }
}

export default DOMEvents;
