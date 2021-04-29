/**
 * Handles scroll wheel.
 * Can pan and zoom current slide image.
 */
class ScrollWheel {
  constructor(pswp) {
    this.pswp = pswp;
    pswp.events.add(pswp.template, 'wheel', this._onWheel.bind(this));
  }

  _onWheel(e) {
    e.preventDefault();
    const { currSlide } = this.pswp;
    let { deltaX, deltaY } = e;

    if (!currSlide) {
      return;
    }

    this.pswp.dispatch('wheel');

    if (e.deltaMode === 1 /* DOM_DELTA_LINE */) {
      // 18 - average line height
      deltaX *= 18;
      deltaY *= 18;
    }

    if (e.ctrlKey || this.pswp.options.wheelToZoom) {
      // zoom
      if (currSlide.isZoomable()) {
        const destZoomLevel = currSlide.currZoomLevel
                              - (currSlide.zoomLevels.fit * 0.04 * deltaY);
        currSlide.zoomTo(destZoomLevel, {
          x: e.clientX,
          y: e.clientY
        });
      }
    } else {
      // pan
      if (currSlide.isPannable()) {
        currSlide.panTo(
          currSlide.pan.x - deltaX,
          currSlide.pan.y - deltaY
        );
      }
    }
  }
}

export default ScrollWheel;
