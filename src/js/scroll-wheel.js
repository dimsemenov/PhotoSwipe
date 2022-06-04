/** @typedef {import('./photoswipe.js').default} PhotoSwipe */

/**
 * Handles scroll wheel.
 * Can pan and zoom current slide image.
 */
class ScrollWheel {
  /**
   * @param {PhotoSwipe} pswp
   */
  constructor(pswp) {
    this.pswp = pswp;
    pswp.events.add(pswp.element, 'wheel', this._onWheel.bind(this));
  }

  /**
   * @private
   * @param {WheelEvent} e
   */
  _onWheel(e) {
    e.preventDefault();
    const { currSlide } = this.pswp;
    let { deltaX, deltaY } = e;

    if (!currSlide) {
      return;
    }

    if (this.pswp.dispatch('wheel', { originalEvent: e }).defaultPrevented) {
      return;
    }

    if (e.ctrlKey || this.pswp.options.wheelToZoom) {
      // zoom
      if (currSlide.isZoomable()) {
        let zoomFactor = -deltaY;
        if (e.deltaMode === 1 /* DOM_DELTA_LINE */) {
          zoomFactor *= 0.05;
        } else {
          zoomFactor *= e.deltaMode ? 1 : 0.002;
        }
        zoomFactor = 2 ** zoomFactor;

        const destZoomLevel = currSlide.currZoomLevel * zoomFactor;
        currSlide.zoomTo(destZoomLevel, {
          x: e.clientX,
          y: e.clientY
        });
      }
    } else {
      // pan
      if (currSlide.isPannable()) {
        if (e.deltaMode === 1 /* DOM_DELTA_LINE */) {
          // 18 - average line height
          deltaX *= 18;
          deltaY *= 18;
        }

        currSlide.panTo(
          currSlide.pan.x - deltaX,
          currSlide.pan.y - deltaY
        );
      }
    }
  }
}

export default ScrollWheel;
