import {
  setTransform,
  equalizePoints,
  decodeImage,
  toTransformString
} from './util/util.js';

/** @typedef {import('./photoswipe.js').default} PhotoSwipe */
/** @typedef {import('./slide/get-thumb-bounds.js').Bounds} Bounds */
/** @typedef {import('./util/animations.js').AnimationProps} AnimationProps */

// some browsers do not paint
// elements which opacity is set to 0,
// since we need to pre-render elements for the animation -
// we set it to the minimum amount
const MIN_OPACITY = 0.003;

/**
 * Manages opening and closing transitions of the PhotoSwipe.
 *
 * It can perform zoom, fade or no transition.
 */
class Opener {
  /**
   * @param {PhotoSwipe} pswp
   */
  constructor(pswp) {
    this.pswp = pswp;
    this.isClosed = true;
    this.isOpen = false;
    this.isClosing = false;
    this.isOpening = false;
    /**
     * @private
     * @type {number | false | undefined}
     */
    this._duration = undefined;
    /** @private */
    this._useAnimation = false;
    /** @private */
    this._croppedZoom = false;
    /** @private */
    this._animateRootOpacity = false;
    /** @private */
    this._animateBgOpacity = false;
    /**
     * @private
     * @type { HTMLDivElement | HTMLImageElement | null | undefined }
     */
    this._placeholder = undefined;
    /**
     * @private
     * @type { HTMLDivElement | undefined }
     */
    this._opacityElement = undefined;
    /**
     * @private
     * @type { HTMLDivElement | undefined }
     */
    this._cropContainer1 = undefined;
    /**
     * @private
     * @type { HTMLElement | null | undefined }
     */
    this._cropContainer2 = undefined;

    /**
     * @private
     * @type {Bounds | undefined}
     */
    this._thumbBounds = undefined;


    this._prepareOpen = this._prepareOpen.bind(this);

    // Override initial zoom and pan position
    pswp.on('firstZoomPan', this._prepareOpen);
  }

  open() {
    this._prepareOpen();
    this._start();
  }

  close() {
    if (this.isClosed || this.isClosing || this.isOpening) {
      // if we close during opening animation
      // for now do nothing,
      // browsers aren't good at changing the direction of the CSS transition
      return;
    }

    const slide = this.pswp.currSlide;

    this.isOpen = false;
    this.isOpening = false;
    this.isClosing = true;
    this._duration = this.pswp.options.hideAnimationDuration;

    if (slide && slide.currZoomLevel * slide.width >= this.pswp.options.maxWidthToAnimate) {
      this._duration = 0;
    }

    this._applyStartProps();
    setTimeout(() => {
      this._start();
    }, this._croppedZoom ? 30 : 0);
  }

  /** @private */
  _prepareOpen() {
    this.pswp.off('firstZoomPan', this._prepareOpen);
    if (!this.isOpening) {
      const slide = this.pswp.currSlide;
      this.isOpening = true;
      this.isClosing = false;
      this._duration = this.pswp.options.showAnimationDuration;
      if (slide && slide.zoomLevels.initial * slide.width >= this.pswp.options.maxWidthToAnimate) {
        this._duration = 0;
      }
      this._applyStartProps();
    }
  }

  /** @private */
  _applyStartProps() {
    const { pswp } = this;
    const slide = this.pswp.currSlide;
    const { options } = pswp;

    if (options.showHideAnimationType === 'fade') {
      options.showHideOpacity = true;
      this._thumbBounds = undefined;
    } else if (options.showHideAnimationType === 'none') {
      options.showHideOpacity = false;
      this._duration = 0;
      this._thumbBounds = undefined;
    } else if (this.isOpening && pswp._initialThumbBounds) {
      // Use initial bounds if defined
      this._thumbBounds = pswp._initialThumbBounds;
    } else {
      this._thumbBounds = this.pswp.getThumbBounds();
    }

    this._placeholder = slide?.getPlaceholderElement();

    pswp.animations.stopAll();

    // Discard animations when duration is less than 50ms
    this._useAnimation = Boolean(this._duration && this._duration > 50);
    this._animateZoom = Boolean(this._thumbBounds)
                        && slide?.content.usePlaceholder()
                        && (!this.isClosing || !pswp.mainScroll.isShifted());
    if (!this._animateZoom) {
      this._animateRootOpacity = true;

      if (this.isOpening && slide) {
        slide.zoomAndPanToInitial();
        slide.applyCurrentZoomPan();
      }
    } else {
      this._animateRootOpacity = options.showHideOpacity ?? false;
    }
    this._animateBgOpacity = !this._animateRootOpacity && this.pswp.options.bgOpacity > MIN_OPACITY;
    this._opacityElement = this._animateRootOpacity ? pswp.element : pswp.bg;

    if (!this._useAnimation) {
      this._duration = 0;
      this._animateZoom = false;
      this._animateBgOpacity = false;
      this._animateRootOpacity = true;
      if (this.isOpening) {
        if (pswp.element) {
          pswp.element.style.opacity = String(MIN_OPACITY);
        }
        pswp.applyBgOpacity(1);
      }
      return;
    }

    if (this._animateZoom && this._thumbBounds && this._thumbBounds.innerRect) {
      // Properties are used when animation from cropped thumbnail
      this._croppedZoom = true;
      this._cropContainer1 = this.pswp.container;
      this._cropContainer2 = this.pswp.currSlide?.holderElement;

      if (pswp.container) {
        pswp.container.style.overflow = 'hidden';
        pswp.container.style.width = pswp.viewportSize.x + 'px';
      }
    } else {
      this._croppedZoom = false;
    }

    if (this.isOpening) {
      // Apply styles before opening transition
      if (this._animateRootOpacity) {
        if (pswp.element) {
          pswp.element.style.opacity = String(MIN_OPACITY);
        }
        pswp.applyBgOpacity(1);
      } else {
        if (this._animateBgOpacity && pswp.bg) {
          pswp.bg.style.opacity = String(MIN_OPACITY);
        }
        if (pswp.element) {
          pswp.element.style.opacity = '1';
        }
      }

      if (this._animateZoom) {
        this._setClosedStateZoomPan();
        if (this._placeholder) {
          // tell browser that we plan to animate the placeholder
          this._placeholder.style.willChange = 'transform';

          // hide placeholder to allow hiding of
          // elements that overlap it (such as icons over the thumbnail)
          this._placeholder.style.opacity = String(MIN_OPACITY);
        }
      }
    } else if (this.isClosing) {
      // hide nearby slides to make sure that
      // they are not painted during the transition
      if (pswp.mainScroll.itemHolders[0]) {
        pswp.mainScroll.itemHolders[0].el.style.display = 'none';
      }
      if (pswp.mainScroll.itemHolders[2]) {
        pswp.mainScroll.itemHolders[2].el.style.display = 'none';
      }

      if (this._croppedZoom) {
        if (pswp.mainScroll.x !== 0) {
          // shift the main scroller to zero position
          pswp.mainScroll.resetPosition();
          pswp.mainScroll.resize();
        }
      }
    }
  }

  /** @private */
  _start() {
    if (this.isOpening
        && this._useAnimation
        && this._placeholder
        && this._placeholder.tagName === 'IMG') {
      // To ensure smooth animation
      // we wait till the current slide image placeholder is decoded,
      // but no longer than 250ms,
      // and no shorter than 50ms
      // (just using requestanimationframe is not enough in Firefox,
      // for some reason)
      new Promise((resolve) => {
        let decoded = false;
        let isDelaying = true;
        decodeImage(/** @type {HTMLImageElement} */ (this._placeholder)).finally(() => {
          decoded = true;
          if (!isDelaying) {
            resolve(true);
          }
        });
        setTimeout(() => {
          isDelaying = false;
          if (decoded) {
            resolve(true);
          }
        }, 50);
        setTimeout(resolve, 250);
      }).finally(() => this._initiate());
    } else {
      this._initiate();
    }
  }

  /** @private */
  _initiate() {
    this.pswp.element?.style.setProperty('--pswp-transition-duration', this._duration + 'ms');

    this.pswp.dispatch(
      this.isOpening ? 'openingAnimationStart' : 'closingAnimationStart'
    );

    // legacy event
    this.pswp.dispatch(
      /** @type {'initialZoomIn' | 'initialZoomOut'} */
      ('initialZoom' + (this.isOpening ? 'In' : 'Out'))
    );

    this.pswp.element?.classList.toggle('pswp--ui-visible', this.isOpening);

    if (this.isOpening) {
      if (this._placeholder) {
        // unhide the placeholder
        this._placeholder.style.opacity = '1';
      }
      this._animateToOpenState();
    } else if (this.isClosing) {
      this._animateToClosedState();
    }

    if (!this._useAnimation) {
      this._onAnimationComplete();
    }
  }

  /** @private */
  _onAnimationComplete() {
    const { pswp } = this;
    this.isOpen = this.isOpening;
    this.isClosed = this.isClosing;
    this.isOpening = false;
    this.isClosing = false;

    pswp.dispatch(
      this.isOpen ? 'openingAnimationEnd' : 'closingAnimationEnd'
    );

    // legacy event
    pswp.dispatch(
      /** @type {'initialZoomInEnd' | 'initialZoomOutEnd'} */
      ('initialZoom' + (this.isOpen ? 'InEnd' : 'OutEnd'))
    );

    if (this.isClosed) {
      pswp.destroy();
    } else if (this.isOpen) {
      if (this._animateZoom && pswp.container) {
        pswp.container.style.overflow = 'visible';
        pswp.container.style.width = '100%';
      }
      pswp.currSlide?.applyCurrentZoomPan();
    }
  }

  /** @private */
  _animateToOpenState() {
    const { pswp } = this;
    if (this._animateZoom) {
      if (this._croppedZoom && this._cropContainer1 && this._cropContainer2) {
        this._animateTo(this._cropContainer1, 'transform', 'translate3d(0,0,0)');
        this._animateTo(this._cropContainer2, 'transform', 'none');
      }

      if (pswp.currSlide) {
        pswp.currSlide.zoomAndPanToInitial();
        this._animateTo(
          pswp.currSlide.container,
          'transform',
          pswp.currSlide.getCurrentTransform()
        );
      }
    }

    if (this._animateBgOpacity && pswp.bg) {
      this._animateTo(pswp.bg, 'opacity', String(pswp.options.bgOpacity));
    }

    if (this._animateRootOpacity && pswp.element) {
      this._animateTo(pswp.element, 'opacity', '1');
    }
  }

  /** @private */
  _animateToClosedState() {
    const { pswp } = this;

    if (this._animateZoom) {
      this._setClosedStateZoomPan(true);
    }

    // do not animate opacity if it's already at 0
    if (this._animateBgOpacity && pswp.bgOpacity > 0.01 && pswp.bg) {
      this._animateTo(pswp.bg, 'opacity', '0');
    }

    if (this._animateRootOpacity && pswp.element) {
      this._animateTo(pswp.element, 'opacity', '0');
    }
  }

  /**
   * @private
   * @param {boolean} [animate]
   */
  _setClosedStateZoomPan(animate) {
    if (!this._thumbBounds) return;

    const { pswp } = this;
    const { innerRect } = this._thumbBounds;
    const { currSlide, viewportSize } = pswp;

    if (this._croppedZoom && innerRect && this._cropContainer1 && this._cropContainer2) {
      const containerOnePanX = -viewportSize.x + (this._thumbBounds.x - innerRect.x) + innerRect.w;
      const containerOnePanY = -viewportSize.y + (this._thumbBounds.y - innerRect.y) + innerRect.h;
      const containerTwoPanX = viewportSize.x - innerRect.w;
      const containerTwoPanY = viewportSize.y - innerRect.h;


      if (animate) {
        this._animateTo(
          this._cropContainer1,
          'transform',
          toTransformString(containerOnePanX, containerOnePanY)
        );

        this._animateTo(
          this._cropContainer2,
          'transform',
          toTransformString(containerTwoPanX, containerTwoPanY)
        );
      } else {
        setTransform(this._cropContainer1, containerOnePanX, containerOnePanY);
        setTransform(this._cropContainer2, containerTwoPanX, containerTwoPanY);
      }
    }

    if (currSlide) {
      equalizePoints(currSlide.pan, innerRect || this._thumbBounds);
      currSlide.currZoomLevel = this._thumbBounds.w / currSlide.width;
      if (animate) {
        this._animateTo(currSlide.container, 'transform', currSlide.getCurrentTransform());
      } else {
        currSlide.applyCurrentZoomPan();
      }
    }
  }

  /**
   * @private
   * @param {HTMLElement} target
   * @param {'transform' | 'opacity'} prop
   * @param {string} propValue
   */
  _animateTo(target, prop, propValue) {
    if (!this._duration) {
      target.style[prop] = propValue;
      return;
    }

    const { animations } = this.pswp;
    /** @type {AnimationProps} */
    const animProps = {
      duration: this._duration,
      easing: this.pswp.options.easing,
      onComplete: () => {
        if (!animations.activeAnimations.length) {
          this._onAnimationComplete();
        }
      },
      target,
    };
    animProps[prop] = propValue;
    animations.startTransition(animProps);
  }
}

export default Opener;
