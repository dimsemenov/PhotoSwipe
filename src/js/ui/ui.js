import UIElement from './ui-element.js';
import { arrowPrev, arrowNext } from './button-arrow.js';
import closeButton from './button-close.js';
import zoomButton from './button-zoom.js';
import { loadingIndicator } from './loading-indicator.js';
import { counterIndicator } from './counter-indicator.js';

/**
 * Set special class on element when image is zoomed.
 *
 * By default it is used to adjust
 * zoom icon and zoom cursor via CSS.
 *
 * @param {Boolean} isZoomedIn
 */
function setZoomedIn(el, isZoomedIn) {
  el.classList[isZoomedIn ? 'add' : 'remove']('pswp--zoomed-in');
}

class UI {
  constructor(pswp) {
    this.pswp = pswp;
  }

  init() {
    const { pswp } = this;
    this.isRegistered = false;
    this.uiElementsData = [
      closeButton,
      arrowPrev,
      arrowNext,
      zoomButton,
      loadingIndicator,
      counterIndicator
    ];

    pswp.dispatch('uiRegister');

    // sort by order
    this.uiElementsData.sort((a, b) => {
      // default order is 0
      return (a.order || 0) - (b.order || 0);
    });

    this.items = [];

    this.isRegistered = true;
    this.uiElementsData.forEach((uiElementData) => {
      this.registerElement(uiElementData);
    });

    // TODO: ensure this works when dynamically adding or removing slides
    if (pswp.getNumItems() === 1) {
      pswp.template.classList.add('pswp--one-slide');
    }

    pswp.on('zoomPanUpdate', () => this._onZoomPanUpdate());
  }

  registerElement(elementData) {
    if (this.isRegistered) {
      this.items.push(
        new UIElement(this.pswp, elementData)
      );
    } else {
      this.uiElementsData.push(elementData);
    }
  }

  /**
   * Fired each time zoom or pan position is changed.
   * Update classes that control visibility of zoom button and cursor icon.
   */
  _onZoomPanUpdate() {
    const { template, currSlide, options } = this.pswp;
    let { currZoomLevel } = currSlide;

    if (this.pswp.opener.isClosing) {
      return;
    }

    // if not open yet - check against initial zoom level
    if (!this.pswp.opener.isOpen) {
      currZoomLevel = currSlide.zoomLevels.initial;
    }

    if (currZoomLevel === this._lastUpdatedZoomLevel) {
      return;
    }
    this._lastUpdatedZoomLevel = currZoomLevel;

    const currZoomLevelDiff = currSlide.zoomLevels.initial - currSlide.zoomLevels.secondary;

    // Initial and secondary zoom levels are almost equal
    if (Math.abs(currZoomLevelDiff) < 0.01 || !currSlide.isZoomable()) {
      // disable zoom
      setZoomedIn(template, false);
      template.classList.remove('pswp--zoom-allowed');
      return;
    }

    template.classList.add('pswp--zoom-allowed');
    const secondaryIsHigher = (currZoomLevelDiff < 0);

    if (currZoomLevel === currSlide.zoomLevels.secondary) {
      setZoomedIn(template, secondaryIsHigher);
    } else if (currZoomLevel > currSlide.zoomLevels.secondary) {
      setZoomedIn(template, true);
    } else {
      //  if (currZoomLevel < currSlide.zoomLevels.secondary)
      setZoomedIn(template, false);
    }

    if (options.imageClickAction === 'zoom'
        || options.imageClickAction === 'zoom-or-close') {
      template.classList.add('pswp--click-to-zoom');
    }
  }
}

export default UI;
