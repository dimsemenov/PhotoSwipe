/**
 * Renders and allows to control a single slide
 */

import {
  createElement,
  setTransform,
  equalizePoints,
  roundPoint,
  toTransformString,
  clamp,
} from '../util/util.js';

import PanBounds from './pan-bounds.js';
import ZoomLevel from './zoom-level.js';
import { getPanAreaSize } from '../util/viewport-size.js';

/**
 * Apply width and height CSS properties to element
 */
function applyWidthHeight(el, w, h) {
  el.style.width = w + 'px';
  el.style.height = h + 'px';
}

class Slide {
  constructor(data, index, pswp) {
    this.data = data;
    this.index = index;
    this.pswp = pswp;
    this.isActive = (index === pswp.currIndex);
    this.currentResolution = 0;
    this.panAreaSize = {};

    this.isFirstSlide = (this.isActive && !pswp.opener.isOpen);

    this.zoomLevels = new ZoomLevel(pswp.options, data, index);

    this.pswp.dispatch('gettingData', {
      slide: this,
      data: this.data,
      index
    });

    this.pan = {
      x: 0,
      y: 0
    };

    this.currZoomLevel = 1;
    this.width = Number(data.w);
    this.height = Number(data.h);
    this.bounds = new PanBounds(this);
  }

  /**
   * If this slide is active/current/visible
   *
   * @param {Boolean} isActive
   */
  setIsActive(isActive) {
    if (isActive && !this.isActive) {
      // slide just became active
      this.activate();
    } else if (!isActive && this.isActive) {
      // slide just became non-active
      this.deactivate();
    }
  }

  /**
   * Appends slide content to DOM
   */
  append(holderElement) {
    this.holderElement = holderElement;

    // Slide appended to DOM
    if (!this.data) {
      this.holderElement.innerHTML = '';
      return;
    }

    this._calculateSize();

    this.container = createElement('pswp__zoom-wrap');
    this.container.transformOrigin = '0 0';

    if (this.data.html) {
      this.addSlideHTML(this.data.html);
    } else if (this.data.src) {
      // Use image-based placeholder only for the first slide
      const useImagePlaceholder = this.data.msrc && this.isFirstSlide;

      // Create placeholder
      // (stretched thumbnail or simple div behind the main image)
      this.placeholder = createElement(
        'pswp__img pswp__img--placeholder',
        useImagePlaceholder ? 'img' : '',
        this.container
      );

      if (useImagePlaceholder) {
        this.placeholder.decoding = 'async';
        this.placeholder.alt = '';
        this.placeholder.src = this.data.msrc;
      }

      this.placeholder.setAttribute('aria-hiden', 'true');

      this.pswp.dispatch('placeholderCreated', { placeholder: this.placeholder, slide: this });

      // Create the main image
      if (!this.image) {
        this.preload();
      }

      this.isLoading = true;
    }

    this.appendHeavy();

    this.holderElement.innerHTML = '';
    this.holderElement.appendChild(this.container);

    this.zoomAndPanToInitial();

    this.pswp.dispatch('firstZoomPan', { slide: this });

    this.applyCurrentZoomPan();

    this.pswp.dispatch('afterSetContent', { slide: this });

    if (this.isActive) {
      this.activate();
    }
  }

  /**
   * Creates and loads image
   */
  preload() {
    this.image = createElement('pswp__img', 'img');

    // Not adding `async`,
    // as it causes flash of image after it's loaded in Safari
    // this.image.decoding = 'async';

    // may update sizes attribute
    this._updateImagesSize();

    if (this.data.srcset) {
      this.image.srcset = this.data.srcset;
    }

    this.image.src = this.data.src;

    this.image.alt = this.data.alt || '';

    this.pswp.lazyLoader.addRecent(this.index);
  }

  /**
   * Append "heavy" DOM elements
   *
   * This may depend on a type of slide,
   * but generally these are large images.
   */
  appendHeavy() {
    const { pswp } = this;
    const appendHeavyNearby = true;

    // Avoid appending heavy elements during animations
    if (this.heavyAppended
        || !pswp.opener.isOpen
        || pswp.mainScroll.isShifted()
        || (!this.isActive && !appendHeavyNearby)) {
      return;
    }

    if (this.pswp.dispatch('appendHeavy', { slide: this }).defaultPrevented) {
      return;
    }

    this.heavyAppended = true;

    if (this.image) {
      // "progressive loading"  - display parts of image as data arrives
      // This behavior is limited to devices with mouse or with large screens,
      // (as there might be significant FPS drops when image loads)
      //
      // TODO should we disable it on smaller screens?
      //if (this.pswp.options.progressiveLoading !== false
      //    && (this.pswp.hasMouse || this.pswp.viewportSize.x > 900)) {
      this._appendImage();
      //}

      // Firefox (89) throws "DOMException: Invalid image request."
      // if decode() is called right after image is appended, see #1760
      // decodeImage(this.image).then(() => {
      //   this._onImageLoaded();
      // }).catch(() => {
      //   this._onImageLoaded(true);
      // });
      // So we use simple onload:

      if (this.image.complete) {
        this._onImageLoaded();
      } else {
        this.image.onload = () => this._onImageLoaded();
        this.image.onerror = () => this._onImageLoaded(true);
      }
    }
  }

  _appendImage() {
    if (!this._imageAppended) {
      this.container.appendChild(this.image);
      this._imageAppended = true;
    }
  }

  _onImageLoaded(isError) {
    this._appendImage();
    this.isLoading = false;
    this.pswp.dispatch('loadComplete', { slide: this, isError });
    if (this.placeholder) {
      // If large image is not decoded,
      // which might happen if browser does not support decode(),
      // there will be a flash after placeholder is removed,
      // so we hide it with delay
      setTimeout(() => {
        if (this.placeholder) {
          this.placeholder.remove();
          this.placeholder = null;
        }
      }, 500);
    }
    if (isError) {
      this._handleError();
    }
  }

  _handleError() {
    this.addSlideHTML(this.pswp.options.errorMsg);
    const errorLinkElement = this.container.querySelector('.pswp__error-msg a');
    if (errorLinkElement && this.data.src) {
      errorLinkElement.href = this.data.src;
    }
    this.loadError = true;
    this.image = null;
    this._calculateSize();
    this.setZoomLevel(1);
    this.panTo(0, 0);
    this.pswp.dispatch('loadError', { slide: this });
  }

  /**
   * Append HTML content to slide container
   * (usually item.html or error message)
   *
   * @param {DOMElement} containerEl
   * @param {String} html
   */
  addSlideHTML(html) {
    const { container } = this;
    if (html.tagName) {
      container.appendChild(html);
    } else {
      container.innerHTML = html;
    }
    container.style.width = '100%';
    container.style.height = '100%';
    container.classList.add('pswp__zoom-wrap--html');
  }

  /**
   * Triggered when this slide is active (selected).
   *
   * If it's part of opening/closing transition -
   * activate() will trigger after the transition is ended.
   */
  activate() {
    this.isActive = true;
    this.appendHeavy();
    this.pswp.dispatch('slideActivate', { slide: this });
  }

  /**
   * Triggered when this slide becomes inactive.
   *
   * Slide can become inactive only after it was active.
   */
  deactivate() {
    this.isActive = false;

    // reset zoom level
    this.zoomAndPanToInitial();
    this.applyCurrentZoomPan();

    this.pswp.dispatch('slideDeactivate', { slide: this });
  }

  /**
   * The slide should destroy itself, it will never be used again.
   * (unbind all events and destroy internal components)
   */
  destroy() {
    this.pswp.dispatch('slideDestroy', { slide: this });
  }

  resize() {
    this._calculateSize();

    // Keep initial zoom level if it was before the resize,
    // as well as when this slide is not active
    if (this.currZoomLevel === this.zoomLevels.initial || !this.isActive) {
      this.currentResolution = 0;
    }

    this._updateImagesSize();
    this.zoomAndPanToInitial();
    this.applyCurrentZoomPan();
  }


  /**
   * Apply size to current slide images
   * based on the current resolution.
   *
   * @private
   */
  _updateImagesSize() {
    if (!this.data.src || !this.width) {
      return;
    }

    // Use initial zoom level
    // if resolution is not defined (user didn't zoom yet)
    const multiplier = this.currentResolution || this.zoomLevels.initial;

    if (!multiplier) {
      return;
    }

    const width = Math.round(this.width * multiplier);
    const height = Math.round(this.height * multiplier);

    if (this.placeholder) {
      applyWidthHeight(this.placeholder, width, height);
    }

    const { image } = this;
    if (image) {
      applyWidthHeight(image, width, height);

      // Handle srcset sizes attribute.
      //
      // Never lower quality, if it was increased previously.
      // Chrome does this automatically, Firefox and Safari do not,
      // so we store largest used size in dataset.
      if (!image.dataset.largestUsedSize
          || width > image.dataset.largestUsedSize) {
        image.sizes = width + 'px';
        image.dataset.largestUsedSize = width;
      }

      this.pswp.dispatch('imageSizeChange', { slide: this, width, height });
    }
  }


  /**
   * Append HTML content to container container
   * (usually data.html or error message)
   *
   * @param {DOMElement} containerEl
   * @param {String} html
   */
  // addSlideHTML(containerEl, html) {
  //   if (html.tagName) {
  //     containerEl.appendChild(html);
  //   } else {
  //     containerEl.innerHTML = html;
  //   }
  //   containerEl.classList.add('pswp__zoom-wrap--html');
  // }

  getPlaceholder() {
    return this.placeholder;
  }

  /**
   * Zoom current slide image to...
   *
   * @param  {Number} destZoomLevel      Destination zoom level.
   * @param  {Object} centerPoint        Transform origin center poiint
   * @param  {Number} transitionDuration Transition duration, may be set to 0.
   * @param  {Boolean|null} ignoreBounds Minimum and maximum zoom levels will be ignore.
   * @return {Boolean|null}              Returns true if animated.
   */
  zoomTo(destZoomLevel, centerPoint, transitionDuration, ignoreBounds) {
    const { pswp } = this;
    if (!this.isZoomable
        || pswp.mainScroll.isShifted()) {
      return;
    }

    // stop all pan and zoom transitions
    pswp.animations.stopAllPan();

    if (!centerPoint) {
      centerPoint = pswp.getViewportCenterPoint();
    }

    const prevZoomLevel = this.currZoomLevel;

    if (!ignoreBounds) {
      destZoomLevel = clamp(destZoomLevel, this.zoomLevels.min, this.zoomLevels.max);
    }

    // if (transitionDuration === undefined) {
    //   transitionDuration = this.pswp.options.zoomAnimationDuration;
    // }

    this.setZoomLevel(destZoomLevel);
    this.pan.x = this.calculateZoomToPanOffset('x', centerPoint, prevZoomLevel);
    this.pan.y = this.calculateZoomToPanOffset('y', centerPoint, prevZoomLevel);
    roundPoint(this.pan);

    const finishTransition = () => {
      this._setResolution(destZoomLevel);
      this.applyCurrentZoomPan();
    };

    if (!transitionDuration) {
      finishTransition();
    } else {
      pswp.animations.startTransition({
        isPan: true,
        name: 'zoomTo',
        target: this.container,
        transform: this.getCurrentTransform(),
        onComplete: finishTransition,
        duration: transitionDuration,
        easing: pswp.options.easing
      });
    }
  }

  toggleZoom(centerPoint) {
    this.zoomTo(
      this.currZoomLevel === this.zoomLevels.initial
        ? this.zoomLevels.secondary : this.zoomLevels.initial,
      centerPoint,
      this.pswp.options.zoomAnimationDuration
    );
  }

  /**
   * Updates zoom level property and recalculates new pan bounds,
   * unlike zoomTo it does not apply transform (use applyCurrentZoomPan)
   *
   * @param {Number} currZoomLevel
   */
  setZoomLevel(currZoomLevel) {
    this.currZoomLevel = currZoomLevel;
    this.bounds.update(this.currZoomLevel);
  }

  /**
   * Get pan position after zoom at a given `point`.
   *
   * Always call setZoomLevel(newZoomLevel) beforehand to recalculate
   * pan bounds according to the new zoom level.
   *
   * @param {String} axis
   * @param {Object} centerPoint point based on which zoom is performed,
   *                             usually refers to the current mouse position,
   *                             or something like center of viewport.
   * @param {Number|null} prevZoomLevel Zoom level before new zoom was applied.
   */
  calculateZoomToPanOffset(axis, point, prevZoomLevel) {
    const totalPanDistance = this.bounds.max[axis] - this.bounds.min[axis];
    let updatedPanOffset;

    if (totalPanDistance === 0) {
      return this.bounds.center[axis];
    }

    const imageSize = this[axis === 'x' ? 'width' : 'height']
                      * (prevZoomLevel || this.currZoomLevel);


    const { panPaddingRatio, panEdgeIsViewport } = this.pswp.options;

    const panPadding = this.panAreaSize[axis] * panPaddingRatio;

    // Make it easier to zoom to the edge of the image
    //
    // Imagine a transparent border that overlaps an image
    // if user clicks on it - image will be
    // zoomed and panned to the corresponding edge
    //
    // If panEdgeIsViewport is enabled,
    // pan position will be based on viewport, instead of based on image
    //
    let ratio; // 0 to 1, '0' being minimum pan position and '1' - maximum
    if (!panEdgeIsViewport && point[axis] < panPadding + this.pan[axis]) {
      // point is at left or top edge of the image
      ratio = 0;
    } else if (!panEdgeIsViewport && point[axis] > imageSize + this.pan[axis] - panPadding) {
      // point is at bottom or right edge of the image
      ratio = 1;
    } else {
      ratio = (point[axis] - this.bounds.min[axis] - panPadding)
                / (this.panAreaSize[axis] - panPadding * 2);
    }


    updatedPanOffset = totalPanDistance * ratio + this.bounds.min[axis];

    updatedPanOffset = this.bounds.correctPan(axis, updatedPanOffset);

    return updatedPanOffset;
  }

  /**
   * Apply pan and keep it within bounds.
   *
   * @param {Number} panX
   * @param {Number} panY
   */
  panTo(panX, panY) {
    this.pan.x = this.bounds.correctPan('x', panX);
    this.pan.y = this.bounds.correctPan('y', panY);
    this.applyCurrentZoomPan();
  }

  /**
   * Whether slide in the current state can be panned by the user
   */
  isPannable() {
    return this.width && (this.currZoomLevel > this.zoomLevels.fit);
  }

  /**
   * Whether the slide can be zoomed
   */
  isZoomable() {
    return (this.width > 0);
  }

  /**
   * Apply transform and scale based on
   * the current pan position (this.pan) and zoom level (this.currZoomLevel)
   */
  applyCurrentZoomPan() {
    this._applyZoomTransform(this.pan.x, this.pan.y, this.currZoomLevel);
    if (this === this.pswp.currSlide) {
      this.pswp.dispatch('zoomPanUpdate', { slide: this });
    }
  }

  zoomAndPanToInitial() {
    this.currZoomLevel = this.zoomLevels.initial;

    // pan according to the zoom level
    this.bounds.update(this.currZoomLevel);
    equalizePoints(this.pan, this.bounds.center);
    this.pswp.dispatch('initialZoomPan', { slide: this });
  }

  /**
   * Set translate and scale based on current resolution
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} zoom
   */
  _applyZoomTransform(x, y, zoom) {
    zoom /= this.currentResolution || this.zoomLevels.initial;
    setTransform(this.container, x, y, zoom);
  }

  _calculateSize() {
    if (this.data.src && !this.loadError) {
      const { pswp } = this;

      equalizePoints(
        this.panAreaSize,
        getPanAreaSize(pswp.options, pswp.viewportSize, pswp)
      );

      this.zoomLevels.update(this.width, this.height, this.panAreaSize);

      pswp.dispatch('calcSlideSize', {
        slide: this
      });
    } else {
      this.width = 0;
      this.height = 0;
      this.zoomLevels.fit = 1;
      this.zoomLevels.vFill = 1;
      this.zoomLevels.initial = 1;
    }
  }

  getCurrentTransform() {
    const scale = this.currZoomLevel / (this.currentResolution || this.zoomLevels.initial);
    return toTransformString(this.pan.x, this.pan.y, scale);
  }

  /**
   * Set resolution and re-render the image.
   *
   * For example, if the real image size is 2000x1500,
   * and resolution is 0.5 - it will be rendered as 1000x750.
   *
   * Image with zoom level 2 and resolution 0.5 is
   * the same as image with zoom level 1 and resolution 1.
   *
   * Used to optimize animations and make
   * sure that browser renders image in highest quality.
   * Also used by responsive images to load the correct one.
   *
   * @param {Number} newResolution
   */
  _setResolution(newResolution) {
    if (newResolution === this.currentResolution) {
      return;
    }

    this.currentResolution = newResolution;
    this._updateImagesSize();

    this.pswp.dispatch('resolutionChanged');
  }
}

export default Slide;
