import { specialKeyUsed } from './util/util.js';

/** @typedef {import('./photoswipe.js').default} PhotoSwipe */

/**
 * @template T
 * @typedef {import('./types.js').Methods<T>} Methods<T>
 */

/**
 * - Manages keyboard shortcuts.
 * - Heps trap focus within photoswipe.
 */
class Keyboard {
  /**
   * @param {PhotoSwipe} pswp
   */
  constructor(pswp) {
    this.pswp = pswp;

    pswp.on('bindEvents', () => {
      // Dialog was likely opened by keyboard if initial point is not defined
      if (!pswp.options.initialPointerPos) {
        // focus causes layout,
        // which causes lag during the animation,
        // that's why we delay it until the opener transition ends
        this._focusRoot();
      }

      pswp.events.add(document, 'focusin', this._onFocusIn.bind(this));
      pswp.events.add(document, 'keydown', this._onKeyDown.bind(this));
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

  _focusRoot() {
    if (!this._wasFocused) {
      this.pswp.element.focus();
      this._wasFocused = true;
    }
  }

  /**
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

    /** @type {Methods<PhotoSwipe>} */
    let keydownAction;
    /** @type {'x' | 'y'} */
    let axis;
    let isForward;

    switch (e.keyCode) {
      case 27: // esc
        if (pswp.options.escKey) {
          keydownAction = 'close';
        }
        break;
      case 90: // z key
        keydownAction = 'toggleZoom';
        break;
      case 37: // left
        axis = 'x';
        break;
      case 38: // top
        axis = 'y';
        break;
      case 39: // right
        axis = 'x';
        isForward = true;
        break;
      case 40: // bottom
        isForward = true;
        axis = 'y';
        break;
      case 9: // tab
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
      pswp[keydownAction]();
    }
  }

  /**
   * Trap focus inside photoswipe
   *
   * @param {FocusEvent} e
   */
  _onFocusIn(e) {
    const { template } = this.pswp;
    if (document !== e.target
        && template !== e.target
        && !template.contains(/** @type {Node} */ (e.target))) {
      // focus root element
      template.focus();
    }
  }
}

export default Keyboard;
