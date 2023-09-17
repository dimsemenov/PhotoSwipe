import { specialKeyUsed } from './util/util.js';

/** @typedef {import('./photoswipe.js').default} PhotoSwipe */

/**
 * @template T
 * @typedef {import('./types.js').Methods<T>} Methods<T>
 */

const KeyboardKeyCodesMap = {
  Escape: 27,
  z: 90,
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
  Tab: 9,
};

/**
 * @template {keyof KeyboardKeyCodesMap} T
 * @param {T} key
 * @param {boolean} isKeySupported
 * @returns {T | number | undefined}
 */
const getKeyboardEventKey = (key, isKeySupported) => {
  return isKeySupported ? key : KeyboardKeyCodesMap[key];
};

/**
 * - Manages keyboard shortcuts.
 * - Helps trap focus within photoswipe.
 */
class Keyboard {
  /**
   * @param {PhotoSwipe} pswp
   */
  constructor(pswp) {
    this.pswp = pswp;
    /** @private */
    this._wasFocused = false;

    pswp.on('bindEvents', () => {
      if (pswp.options.trapFocus) {
        // Dialog was likely opened by keyboard if initial point is not defined
        if (!pswp.options.initialPointerPos) {
          // focus causes layout,
          // which causes lag during the animation,
          // that's why we delay it until the opener transition ends
          this._focusRoot();
        }

        pswp.events.add(
          document,
          'focusin',
          /** @type EventListener */(this._onFocusIn.bind(this))
        );
      }

      pswp.events.add(document, 'keydown', /** @type EventListener */(this._onKeyDown.bind(this)));
    });

    const lastActiveElement = /** @type {HTMLElement} */ (document.activeElement);
    pswp.on('destroy', () => {
      if (pswp.options.returnFocus
          && lastActiveElement
          && this._wasFocused) {
        lastActiveElement.focus();
      }
    });
  }

  /** @private */
  _focusRoot() {
    if (!this._wasFocused && this.pswp.element) {
      this.pswp.element.focus();
      this._wasFocused = true;
    }
  }

  /**
   * @private
   * @param {KeyboardEvent} e
   */
  _onKeyDown(e) {
    const { pswp } = this;

    if (pswp.dispatch('keydown', { originalEvent: e }).defaultPrevented) {
      return;
    }

    if (specialKeyUsed(e)) {
      // don't do anything if special key pressed
      // to prevent from overriding default browser actions
      // for example, in Chrome on Mac cmd+arrow-left returns to previous page
      return;
    }

    /** @type {Methods<PhotoSwipe> | undefined} */
    let keydownAction;
    /** @type {'x' | 'y' | undefined} */
    let axis;
    let isForward = false;
    const isKeySupported = 'key' in e;

    switch (isKeySupported ? e.key : e.keyCode) {
      case getKeyboardEventKey('Escape', isKeySupported):
        if (pswp.options.escKey) {
          keydownAction = 'close';
        }
        break;
      case getKeyboardEventKey('z', isKeySupported):
        keydownAction = 'toggleZoom';
        break;
      case getKeyboardEventKey('ArrowLeft', isKeySupported):
        axis = 'x';
        break;
      case getKeyboardEventKey('ArrowUp', isKeySupported):
        axis = 'y';
        break;
      case getKeyboardEventKey('ArrowRight', isKeySupported):
        axis = 'x';
        isForward = true;
        break;
      case getKeyboardEventKey('ArrowDown', isKeySupported):
        isForward = true;
        axis = 'y';
        break;
      case getKeyboardEventKey('Tab', isKeySupported):
        this._focusRoot();
        break;
      default:
    }

    // if left/right/top/bottom key
    if (axis) {
      // prevent page scroll
      e.preventDefault();

      const { currSlide } = pswp;

      if (pswp.options.arrowKeys
          && axis === 'x'
          && pswp.getNumItems() > 1) {
        keydownAction = isForward ? 'next' : 'prev';
      } else if (currSlide && currSlide.currZoomLevel > currSlide.zoomLevels.fit) {
        // up/down arrow keys pan the image vertically
        // left/right arrow keys pan horizontally.
        // Unless there is only one image,
        // or arrowKeys option is disabled
        currSlide.pan[axis] += isForward ? -80 : 80;
        currSlide.panTo(currSlide.pan.x, currSlide.pan.y);
      }
    }

    if (keydownAction) {
      e.preventDefault();
      // @ts-ignore
      pswp[keydownAction]();
    }
  }

  /**
   * Trap focus inside photoswipe
   *
   * @private
   * @param {FocusEvent} e
   */
  _onFocusIn(e) {
    const { template } = this.pswp;
    if (template
        && document !== e.target
        && template !== e.target
        && !template.contains(/** @type {Node} */ (e.target))) {
      // focus root element
      template.focus();
    }
  }
}

export default Keyboard;
