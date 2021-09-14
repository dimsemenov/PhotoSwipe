/**
 * Tap, double-tap handler.
 */

/**
 * Whether the tap was performed on the main slide
 * (rather than controls or caption).
 *
 * @param {Event} event
 */
function didTapOnMainContent(event) {
  return !!(event.target.closest('.pswp__container'));
}

class TapHandler {
  constructor(gestures) {
    this.gestures = gestures;
  }


  click(point, originalEvent) {
    const targetClassList = originalEvent.target.classList;
    const isImageClick = targetClassList.contains('pswp__img');
    const isBackgroundClick = targetClassList.contains('pswp__item')
                              || targetClassList.contains('pswp__zoom-wrap');

    if (isImageClick) {
      this._doClickOrTapAction('imageClick', point, originalEvent);
    } else if (isBackgroundClick) {
      this._doClickOrTapAction('bgClick', point, originalEvent);
    }
  }

  tap(point, originalEvent) {
    if (didTapOnMainContent(originalEvent)) {
      this._doClickOrTapAction('tap', point, originalEvent);
    }
  }

  doubleTap(point, originalEvent) {
    if (didTapOnMainContent(originalEvent)) {
      this._doClickOrTapAction('doubleTap', point, originalEvent);
    }
  }

  _doClickOrTapAction(actionName, point, originalEvent) {
    const { pswp } = this.gestures;
    const { currSlide } = pswp;
    const optionValue = pswp.options[actionName + 'Action'];

    if (pswp.dispatch(actionName + 'Action', { point, originalEvent }).defaultPrevented) {
      return;
    }

    if (typeof optionValue === 'function') {
      optionValue.call(pswp, point, originalEvent);
      return;
    }

    switch (optionValue) {
      case 'close':
      case 'next':
        pswp[optionValue]();
        break;
      case 'zoom':
        currSlide.toggleZoom(point);
        break;
      case 'zoom-or-close':
        // by default click zooms current image,
        // if it can not be zoomed - gallery will be closed
        if (currSlide.isZoomable()
            && currSlide.zoomLevels.secondary !== currSlide.zoomLevels.initial) {
          currSlide.toggleZoom(point);
        } else if (pswp.options.clickToCloseNonZoomable) {
          pswp.close();
        }
        break;
      case 'toggle-controls':
        this.gestures.pswp.template.classList.toggle('pswp--ui-visible');
        // if (_controlsVisible) {
        //   _ui.hideControls();
        // } else {
        //   _ui.showControls();
        // }
        break;
    }
  }
}

export default TapHandler;
