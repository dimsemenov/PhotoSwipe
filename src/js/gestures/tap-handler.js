/**
 * @template T
 * @template P
 * @typedef {import('../types.js').AddPostfix<T, P>} AddPostfix<T, P>
 */

/** @typedef {import('./gestures.js').default} Gestures */

/** @typedef {'imageClick' | 'bgClick' | 'tap' | 'doubleTap'} Actions */
/** @typedef {{ x?: number; y?: number }} Point */

/**
 * Whether the tap was performed on the main slide
 * (rather than controls or caption).
 *
 * @param {PointerEvent} event
 */
function didTapOnMainContent(event) {
  return !!(/** @type {HTMLElement} */ (event.target).closest('.pswp__container'));
}

/**
 * Tap, double-tap handler.
 */
class TapHandler {
  /**
   * @param {Gestures} gestures
   */
  constructor(gestures) {
    this.gestures = gestures;
  }

  /**
   * @param {Point} point
   * @param {PointerEvent} originalEvent
   */
  click(point, originalEvent) {
    const targetClassList = /** @type {HTMLElement} */ (originalEvent.target).classList;
    const isImageClick = targetClassList.contains('pswp__img');
    const isBackgroundClick = targetClassList.contains('pswp__item')
                              || targetClassList.contains('pswp__zoom-wrap');

    if (isImageClick) {
      this._doClickOrTapAction('imageClick', point, originalEvent);
    } else if (isBackgroundClick) {
      this._doClickOrTapAction('bgClick', point, originalEvent);
    }
  }

  /**
   * @param {Point} point
   * @param {PointerEvent} originalEvent
   */
  tap(point, originalEvent) {
    if (didTapOnMainContent(originalEvent)) {
      this._doClickOrTapAction('tap', point, originalEvent);
    }
  }

  /**
   * @param {Point} point
   * @param {PointerEvent} originalEvent
   */
  doubleTap(point, originalEvent) {
    if (didTapOnMainContent(originalEvent)) {
      this._doClickOrTapAction('doubleTap', point, originalEvent);
    }
  }

  /**
   * @param {Actions} actionName
   * @param {Point} point
   * @param {PointerEvent} originalEvent
   */
  _doClickOrTapAction(actionName, point, originalEvent) {
    const { pswp } = this.gestures;
    const { currSlide } = pswp;
    const actionFullName = /** @type {AddPostfix<Actions, 'Action'>} */ (actionName + 'Action');
    const optionValue = pswp.options[actionFullName];

    if (pswp.dispatch(actionFullName, { point, originalEvent }).defaultPrevented) {
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
        this.gestures.pswp.element.classList.toggle('pswp--ui-visible');
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
