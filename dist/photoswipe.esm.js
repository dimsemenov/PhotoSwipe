/*!
  * PhotoSwipe 5.0.0 - https://photoswipe.com
  * (c) 2021 Dmitry Semenov
  */
/**
  * Creates element and optionally appends it to another.
  *
  * @param {String} className
  * @param {String|NULL} tagName
  * @param {Element|NULL} appendToEl
  */
function createElement(className, tagName, appendToEl) {
  const el = document.createElement(tagName || 'div');
  if (className) {
    el.className = className;
  }
  if (appendToEl) {
    appendToEl.appendChild(el);
  }
  return el;
}

function equalizePoints(p1, p2) {
  p1.x = p2.x;
  p1.y = p2.y;
  if (p2.id !== undefined) {
    p1.id = p2.id;
  }
  return p1;
}


function roundPoint(p) {
  p.x = Math.round(p.x);
  p.y = Math.round(p.y);
}

/**
 * Returns distance between two points.
 *
 * @param {Object} p1 Point
 * @param {Object} p2 Point
 */
function getDistanceBetween(p1, p2) {
  const x = Math.abs(p1.x - p2.x);
  const y = Math.abs(p1.y - p2.y);
  return Math.sqrt((x * x) + (y * y));
}

/**
 * Whether X and Y positions of points are qual
 *
 * @param {Object} p1
 * @param {Object} p2
 */
function pointsEqual(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * The float result between the min and max values.
 *
 * @param {Number} val
 * @param {Number} min
 * @param {Number} max
 */
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Get transform string
 *
 * @param {Number} x
 * @param {Number|null} y
 * @param {Number|null} scale
 */
function toTransformString(x, y, scale) {
  let propValue = 'translate3d('
                      + x + 'px,' + (y || 0) + 'px'
                      + ',0)';

  if (scale !== undefined) {
    propValue += ' scale3d('
                      + scale + ',' + scale
                      + ',1)';
  }

  return propValue;
}

/**
 * Apply transform:translate(x, y) scale(scale) to element
 *
 * @param {DOMElement} el
 * @param {Number} x
 * @param {Number|null} y
 * @param {Number|null} scale
 */
function setTransform(el, x, y, scale) {
  el.style.transform = toTransformString(x, y, scale);
}

const defaultCSSEasing = 'cubic-bezier(.4,0,.22,1)';

/**
 * Apply CSS transition to element
 *
 * @param {Element} el
 * @param {String} prop CSS property to animate
 * @param {Number} duration in ms
 * @param {String|NULL} ease CSS easing function
 */
function setTransitionStyle(el, prop, duration, ease) {
  // inOut: 'cubic-bezier(.4, 0, .22, 1)', // for "toggle state" transitions
  // out: 'cubic-bezier(0, 0, .22, 1)', // for "show" transitions
  // in: 'cubic-bezier(.4, 0, 1, 1)'// for "hide" transitions
  el.style.transition = prop
    ? (prop + ' ' + duration + 'ms ' + (ease || defaultCSSEasing))
    : 'none';
}

function removeTransitionStyle(el) {
  setTransitionStyle(el);
}

const supportsImageDecode = ('decode' in new Image());

function isImageDecoded(img) {
  if (supportsImageDecode) {
    return img.decoded;
  }

  return img.complete;
}

function decodeImage(img) {
  if (isImageDecoded(img)) {
    return Promise.resolve(img);
  }

  if (supportsImageDecode) {
    return img.decode();
  }

  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

/**
 * Check if click or keydown event was dispatched
 * with a special key or via mouse wheel.
 *
 * @param {Event} e
 */
function specialKeyUsed(e) {
  if (e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
    return true;
  }
}

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

class DOMEvents {
  constructor() {
    this._pool = [];
  }

  /**
   * Adds event listeners
   *
   * @param {DOMElement} target
   * @param {String} type Can be multiple, separated by space.
   * @param {Function} listener
   * @param {Boolean} passive
   */
  add(target, type, listener, passive) {
    this._toggleListener(target, type, listener, passive);
  }

  /**
   * Removes event listeners
   *
   * @param {DOMElement} target
   * @param {String} type
   * @param {Function} listener
   * @param {Boolean} passive
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
   * @param {DOMElement} target
   * @param {String} type
   * @param {Function} listener
   * @param {Boolean} passive
   * @param {Boolean} unbind Whether the event should be added or removed
   * @param {Boolean} skipPool Whether events pool should be skipped
   */
  _toggleListener(target, type, listener, passive, unbind, skipPool) {
    if (!target) {
      return;
    }

    const methodName = (unbind ? 'remove' : 'add') + 'EventListener';
    type = type.split(' ');
    type.forEach((eType) => {
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

/**
 * Calculates minimum, maximum and initial (center) bounds of a slide
 */

class PanBounds {
  constructor(slide) {
    this.slide = slide;

    this.currZoomLevel = 1;

    this.center = {};
    this.max = {};
    this.min = {};

    this.reset();
  }

  // _getItemBounds
  update(currZoomLevel) {
    this.currZoomLevel = currZoomLevel;

    if (!this.slide.width) {
      this.reset();
    } else {
      this._updateAxis('x');
      this._updateAxis('y');
      this.slide.pswp.dispatch('calcBounds', { slide: this.slide });
    }
  }

  // _calculateItemBoundsForAxis
  _updateAxis(axis) {
    const elSize = this.slide[axis === 'x' ? 'width' : 'height'] * this.currZoomLevel;
    const paddingProp = axis === 'x' ? 'Left' : 'Top';
    const padding = this.slide.pswp.options['padding' + paddingProp] || 0;

    const panAreaSize = this.slide.panAreaSize[axis];

    // Default position of element.
    // By defaul it is center of viewport:
    this.center[axis] = Math.round((panAreaSize - elSize) / 2) + padding;

    // maximum pan position
    this.max[axis] = (elSize > panAreaSize)
      ? Math.round(panAreaSize - elSize) + padding
      : this.center[axis];

    // minimum pan position
    this.min[axis] = (elSize > panAreaSize)
      ? padding
      : this.center[axis];
  }

  // _getZeroBounds
  reset() {
    this.center.x = 0;
    this.center.y = 0;
    this.max.x = 0;
    this.max.y = 0;
    this.min.x = 0;
    this.min.y = 0;
  }

  /**
   * Correct pan position if it's beyond the bounds
   *
   * @param {String} axis x or y
   * @param {Object} panOffset
   */
  correctPan(axis, panOffset) { // checkPanBounds
    return clamp(panOffset, this.max[axis], this.min[axis]);
  }
}

/**
 * Calculates zoom levels for specific slide.
 * Depends on viewport size and image size.
 */

const MAX_IMAGE_WIDTH = 3000;

class ZoomLevel {
  constructor(options, itemData, index) {
    // pswp options
    this.options = options;
    this.itemData = itemData;
    this.index = index;
  }

  /**
   * Calculate initial, secondary and maximum zoom level for the specified slide.
   *
   * It should be called when either image or viewport size changes.
   *
   * @param {Slide} slide
   */
  update(maxWidth, maxHeight, panAreaSize) {
    this.elementSize = {
      x: maxWidth,
      y: maxHeight
    };

    this.panAreaSize = panAreaSize;

    const hRatio = this.panAreaSize.x / this.elementSize.x;
    const vRatio = this.panAreaSize.y / this.elementSize.y;

    this.fit = Math.min(1, hRatio < vRatio ? hRatio : vRatio);
    this.fill = Math.min(1, hRatio > vRatio ? hRatio : vRatio);

    // zoom.vFill defines zoom level of the image
    // when it has 100% of viewport vertical space (height)
    this.vFill = Math.min(1, vRatio);

    this.initial = this._getInitial();
    this.secondary = this._getSecondary();
    this.max = Math.max(
      this.initial,
      this.secondary,
      this._getMax()
    );

    this.min = Math.min(
      this.fit,
      this.initial,
      this.secondary
    );
  }

  /**
   * Parses user-defined zoom option.
   *
   * @param {Mixed} optionPrefix Zoom level option prefix (initial, secondary, max)
   */
  _parseZoomLevelOption(optionPrefix) {
    // zoom.initial
    // zoom.secondary
    // zoom.max
    const optionValue = this.options[optionPrefix + 'ZoomLevel'];

    if (!optionValue) {
      return;
    }

    if (typeof optionValue === 'function') {
      return optionValue(this);
    }

    if (optionValue === 'fill') {
      return this.fill;
    }

    if (optionValue === 'fit') {
      return this.fit;
    }

    return Number(optionValue);
  }

  /**
   * Get zoom level to which image will be zoomed after double-tap gesture,
   * or when user clicks on zoom icon,
   * or mouse-click on image itself.
   * If you return 1 image will be zoomed to its original size.
   *
   * @return {Number}
   */
  _getSecondary() {
    let currZoomLevel = this._parseZoomLevelOption('secondary');

    if (currZoomLevel) {
      return currZoomLevel;
    }

    // 2.5x of "fit" state, but not larger than original
    currZoomLevel = Math.min(1, this.fit * 2.5);

    if (currZoomLevel * this.elementSize.x > MAX_IMAGE_WIDTH) {
      currZoomLevel = MAX_IMAGE_WIDTH / this.elementSize.x;
    }

    return currZoomLevel;
  }

  /**
   * Get initial image zoom level.
   *
   * @return {Number}
   */
  _getInitial() {
    return this._parseZoomLevelOption('initial') || this.fit;
  }

  /**
   * Maximum zoom level when user zooms
   * via zoom/pinch gesture,
   * via cmd/ctrl-wheel or via trackpad.
   *
   * @return {Number}
   */
  _getMax() {
    const currZoomLevel = this._parseZoomLevelOption('max');

    if (currZoomLevel) {
      return currZoomLevel;
    }

    // max zoom level is x4 from "fit state",
    // used for zoom gesture and ctrl/trackpad zoom
    return Math.max(1, this.fit * 4);
  }
}

function getViewportSize(options, pswp) {
  if (options.getViewportSizeFn) {
    const newViewportSize = options.getViewportSizeFn(options, pswp);
    if (newViewportSize) {
      return newViewportSize;
    }
  }

  return {
    x: document.documentElement.clientWidth,

    // TODO: height on mobile is very incosistent due to toolbar
    // find a way to improve this
    //
    // document.documentElement.clientHeight - doesn't seem to work well
    y: window.innerHeight
  };
}

function getPanAreaSize(options, viewportSize/*, pswp*/) {
  return {
    x: viewportSize.x - (options.paddingLeft || 0) - (options.paddingRight || 0),
    y: viewportSize.y - (options.paddingTop || 0) - (options.paddingBottom || 0)
  };
}

/**
 * Renders and allows to control a single slide
 */

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

    this.image.src = this.data.src;
    if (this.data.srcset) {
      this.image.srcset = this.data.srcset;
    }
    this.image.alt = this.data.alt || '';

    this.pswp.lazyLoader.addRecent(this.index);

    // may update sizes attribute
    this._updateImagesSize();
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

      decodeImage(this.image).then(() => {
        this._onImageLoaded();
      }).catch(() => {
        this._onImageLoaded(true);
      });
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
        getPanAreaSize(pswp.options, pswp.viewportSize)
      );

      this.zoomLevels.update(this.width, this.height, this.panAreaSize);
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

/**
 * Handles single pointer dragging
 */

const PAN_END_FRICTION = 0.35;
const VERTICAL_DRAG_FRICTION = 0.6;

// 1 corresponds to the third of viewport height
const MIN_RATIO_TO_CLOSE = 0.4;

// Minimum speed required to navigate
// to next or previous slide
const MIN_NEXT_SLIDE_SPEED = 0.5;

function project(initialVelocity, decelerationRate) {
  return initialVelocity * decelerationRate / (1 - decelerationRate);
}

class DragHandler {
  constructor(gestures) {
    this.gestures = gestures;
    this.pswp = gestures.pswp;
    this.startPan = {};
  }

  start() {
    equalizePoints(this.startPan, this.pswp.currSlide.pan);
    this.pswp.animations.stopAll();
  }

  change() {
    const { p1, prevP1, dragAxis, pswp } = this.gestures;
    const { currSlide } = pswp;

    if (dragAxis === 'y'
        && pswp.options.closeOnVerticalDrag
        && currSlide.currZoomLevel <= currSlide.zoomLevels.vFill
        && !this.gestures.isMultitouch) {
      // Handle vertical drag to close
      const panY = currSlide.pan.y + (p1.y - prevP1.y);
      if (!pswp.dispatch('verticalDrag', { panY }).defaultPrevented) {
        this._setPanWithFriction('y', panY, VERTICAL_DRAG_FRICTION);
        const bgOpacity = 1 - Math.abs(this._getVerticalDragRatio(currSlide.pan.y));
        pswp.applyBgOpacity(bgOpacity);
        currSlide.applyCurrentZoomPan();
      }
    } else {
      const mainScrollChanged = this._panOrMoveMainScroll('x');
      if (!mainScrollChanged) {
        this._panOrMoveMainScroll('y');

        roundPoint(currSlide.pan);
        currSlide.applyCurrentZoomPan();
      }
    }
  }

  end() {
    const { pswp, velocity } = this.gestures;
    const { mainScroll } = pswp;
    let indexDiff = 0;

    pswp.animations.stopAll();

    // Handle main scroll if it's shifted
    if (mainScroll.isShifted()) {
      // Position of the main scroll relative to the viewport
      const mainScrollShiftDiff = mainScroll.x - mainScroll.getCurrSlideX();

      // Ratio between 0 and 1:
      // 0 - slide is not visible at all,
      // 0.5 - half of the slide is vicible
      // 1 - slide is fully visible
      const currentSlideVisibilityRatio = (mainScrollShiftDiff / pswp.viewportSize.x);

      // Go next slide.
      //
      // - if velocity and its direction is matched
      //   and we see at least tiny part of the next slide
      //
      // - or if we see less than 50% of the current slide
      //   and velocity is close to 0
      //
      if ((velocity.x < -MIN_NEXT_SLIDE_SPEED && currentSlideVisibilityRatio < 0)
          || (velocity.x < 0.1 && currentSlideVisibilityRatio < -0.5)) {
        // Go to next slide
        indexDiff = 1;
        velocity.x = Math.min(velocity.x, 0);
      } else if ((velocity.x > MIN_NEXT_SLIDE_SPEED && currentSlideVisibilityRatio > 0)
          || (velocity.x > -0.1 && currentSlideVisibilityRatio > 0.5)) {
        // Go to prev slide
        indexDiff = -1;
        velocity.x = Math.max(velocity.x, 0);
      }

      mainScroll.moveIndexBy(indexDiff, true, velocity.x);
    }

    // Restore zoom level
    if (pswp.currSlide.currZoomLevel > pswp.currSlide.zoomLevels.max
        || this.gestures.isMultitouch) {
      this.gestures.zoomLevels.correctZoomPan();
    } else {
      // we run two animations instead of one,
      // as each axis has own pan boundaries and thus different spring function
      // (correctZoomPan does not have this functionality,
      //  it animates all properties with single timing function)
      this._finishPanGestureForAxis('x');
      this._finishPanGestureForAxis('y');
    }
  }

  _finishPanGestureForAxis(axis) {
    const { pswp } = this;
    const { currSlide } = pswp;
    const { velocity } = this.gestures;
    const { pan, bounds } = currSlide;
    const panPos = pan[axis];
    const restoreBgOpacity = (pswp.bgOpacity < 1 && axis === 'y');

    // 0.995 means - scroll view loses 0.5% of its velocity per millisecond
    // Inceasing this number will reduce travel distance
    const decelerationRate = 0.995; // 0.99

    // Pan position if there is no bounds
    const projectedPosition = panPos + project(velocity[axis], decelerationRate);

    if (restoreBgOpacity) {
      const vDragRatio = this._getVerticalDragRatio(panPos);
      const projectedVDragRatio = this._getVerticalDragRatio(projectedPosition);

      // If we are above and moving upwards,
      // or if we are below and moving downwards
      if ((vDragRatio < 0 && projectedVDragRatio < -MIN_RATIO_TO_CLOSE)
          || (vDragRatio > 0 && projectedVDragRatio > MIN_RATIO_TO_CLOSE)) {
        pswp.close();
        return;
      }
    }

    // Pan position with corrected bounds
    const correctedPanPosition = bounds.correctPan(axis, projectedPosition);

    // Exit if pan position should not be changed
    // or if speed it too low
    if (panPos === correctedPanPosition) {
      return;
    }

    // Overshoot if the final position is out of pan bounds
    const dampingRatio = (correctedPanPosition === projectedPosition) ? 1 : 0.82;

    const initialBgOpacity = pswp.bgOpacity;
    const totalPanDist = correctedPanPosition - panPos;

    pswp.animations.startSpring({
      name: 'panGesture' + axis,
      isPan: true,
      start: panPos,
      end: correctedPanPosition,
      velocity: velocity[axis],
      dampingRatio,
      onUpdate: (pos) => {
        // Animate opacity of background relative to Y pan position of an image
        if (restoreBgOpacity && pswp.bgOpacity < 1) {
          // 0 - start of animation, 1 - end of animation
          const animationProgressRatio = 1 - (correctedPanPosition - pos) / totalPanDist;

          // We clamp opacity to keep it between 0 and 1.
          // As progress ratio can be larger than 1 due to overshoot,
          // and we do not want to bounce opacity.
          pswp.applyBgOpacity(clamp(
            initialBgOpacity + (1 - initialBgOpacity) * animationProgressRatio,
            0,
            1
          ));
        }

        pan[axis] = pos;
        currSlide.applyCurrentZoomPan();
      },
    });
  }

  /**
   * Update position of the main scroll,
   * or/and update pan position of the current slide.
   *
   * Should return true if it changes (or can change) main scroll.
   *
   * @param {String} axis
   */
  _panOrMoveMainScroll(axis) {
    const { p1, pswp, dragAxis, prevP1, isMultitouch } = this.gestures;
    const { currSlide, mainScroll } = pswp;
    const delta = (p1[axis] - prevP1[axis]);
    const newMainScrollX = mainScroll.x + delta;

    if (!delta) {
      return;
    }

    // Always move main scroll if image can not be panned
    if (axis === 'x' && !currSlide.isPannable() && !isMultitouch) {
      mainScroll.moveTo(newMainScrollX, true);
      return true; // changed main scroll
    }

    const { bounds } = currSlide;
    const newPan = currSlide.pan[axis] + delta;

    if (pswp.options.allowPanToNext
        && dragAxis === 'x'
        && axis === 'x'
        && !isMultitouch) {
      const currSlideMainScrollX = mainScroll.getCurrSlideX();

      // Position of the main scroll relative to the viewport
      const mainScrollShiftDiff = mainScroll.x - currSlideMainScrollX;

      const isLeftToRight = delta > 0;
      const isRightToLeft = !isLeftToRight;

      if (newPan > bounds.min[axis] && isLeftToRight) {
        // Panning from left to right, beyond the left edge

        // Wether the image was at minimum pan position (or less)
        // when this drag gesture started.
        // Minimum pan position refers to the left edge of the image.
        const wasAtMinPanPosition = (bounds.min[axis] <= this.startPan[axis]);

        if (wasAtMinPanPosition) {
          mainScroll.moveTo(newMainScrollX, true);
          return true;
        } else {
          this._setPanWithFriction(axis, newPan);
          //currSlide.pan[axis] = newPan;
        }
      } else if (newPan < bounds.max[axis] && isRightToLeft) {
        // Paning from right to left, beyond the right edge

        // Maximum pan position refers to the right edge of the image.
        const wasAtMaxPanPosition = (this.startPan[axis] <= bounds.max[axis]);

        if (wasAtMaxPanPosition) {
          mainScroll.moveTo(newMainScrollX, true);
          return true;
        } else {
          this._setPanWithFriction(axis, newPan);
          //currSlide.pan[axis] = newPan;
        }
      } else {
        // If main scroll is shifted
        if (mainScrollShiftDiff !== 0) {
          // If main scroll is shifted right
          if (mainScrollShiftDiff > 0 /*&& isRightToLeft*/) {
            mainScroll.moveTo(Math.max(newMainScrollX, currSlideMainScrollX), true);
            return true;
          } else if (mainScrollShiftDiff < 0 /*&& isLeftToRight*/) {
            // Main scroll is shifted left (Position is less than 0 comparing to the viewport 0)
            mainScroll.moveTo(Math.min(newMainScrollX, currSlideMainScrollX), true);
            return true;
          }
        } else {
          // We are within pan bounds, so just pan
          this._setPanWithFriction(axis, newPan);
        }
      }
    } else {
      if (axis === 'y') {
        // Do not pan vertically if main scroll is shifted o
        if (!mainScroll.isShifted() && bounds.min.y !== bounds.max.y) {
          this._setPanWithFriction(axis, newPan);
        }
      } else {
        this._setPanWithFriction(axis, newPan);
      }
    }
  }
  //
  // If we move above - the ratio is negative
  // If we move below the ratio is positive

  /**
   * Relation between pan Y position and third of viewport height.
   *
   * When we are at initial position (center bounds) - the ratio is 0,
   * if position is shifted upwards - the ratio is negative,
   * if position is shifted downwards - the ratio is positive.
   *
   * @param {Number} panY The current pan Y position.
   */
  _getVerticalDragRatio(panY) {
    return (panY - this.pswp.currSlide.bounds.center.y)
            / (this.pswp.viewportSize.y / 3);
  }

  /**
   * Set pan position of the current slide.
   * Apply friction if the position is beyond the pan bounds,
   * or if custom friction is defined.
   *
   * @param {String} axis
   * @param {Number} potentialPan
   * @param {Number|null} customFriction (0.1 - 1)
   */
  _setPanWithFriction(axis, potentialPan, customFriction) {
    const { pan, bounds } = this.pswp.currSlide;
    const correctedPan = bounds.correctPan(axis, potentialPan);
    // If we are out of pan bounds
    if (correctedPan !== potentialPan || customFriction) {
      const delta = Math.round(potentialPan - pan[axis]);
      pan[axis] += delta * (customFriction || PAN_END_FRICTION);
    } else {
      pan[axis] = potentialPan;
    }
  }
}

const UPPER_ZOOM_FRICTION = 0.15;
const LOWER_ZOOM_FRICTION = 0.25;


/**
 * Get center point between two points
 *
 * @param {Point} p
 * @param {Point} p1
 * @param {Point} p2
 */
function getZoomPointsCenter(p, p1, p2) {
  p.x = (p1.x + p2.x) / 2;
  p.y = (p1.y + p2.y) / 2;
  return p;
}

class ZoomHandler {
  constructor(gestures) {
    this.gestures = gestures;
    this.pswp = this.gestures.pswp;
    this._startPan = {};

    this._startZoomPoint = {};
    this._zoomPoint = {};
  }

  start() {
    this._startZoomLevel = this.pswp.currSlide.currZoomLevel;
    equalizePoints(this._startPan, this.pswp.currSlide.pan);
    this.pswp.animations.stopAllPan();
    this._wasOverFitZoomLevel = false;
  }

  change() {
    const { p1, startP1, p2, startP2, pswp } = this.gestures;
    const { currSlide } = pswp;
    const minZoomLevel = currSlide.zoomLevels.min;
    const maxZoomLevel = currSlide.zoomLevels.max;

    if (!currSlide.isZoomable() || pswp.mainScroll.isShifted()) {
      return;
    }

    getZoomPointsCenter(this._startZoomPoint, startP1, startP2);
    getZoomPointsCenter(this._zoomPoint, p1, p2);

    let currZoomLevel = (1 / getDistanceBetween(startP1, startP2))
                      * getDistanceBetween(p1, p2)
                      * this._startZoomLevel;

    // if (!this.zoomStarted) {
    //   this.zoomStarted = true;
    //   pswp.dispatch('zoomGestureStarted');
    // }

    // slightly over the zoom.fit
    if (currZoomLevel > currSlide.zoomLevels.initial + (currSlide.zoomLevels.initial / 15)) {
      this._wasOverFitZoomLevel = true;
    }

    if (currZoomLevel < minZoomLevel) {
      if (pswp.options.pinchToClose
          && !this._wasOverFitZoomLevel
          && this._startZoomLevel <= currSlide.zoomLevels.initial) {
        // fade out background if zooming out
        const bgOpacity = 1 - ((minZoomLevel - currZoomLevel) / (minZoomLevel / 1.2));
        if (!pswp.dispatch('pinchClose', { bgOpacity }).defaultPrevented) {
          pswp.applyBgOpacity(bgOpacity);
        }
      } else {
        // Apply the friction if zoom level is below the min
        currZoomLevel = minZoomLevel - (minZoomLevel - currZoomLevel) * LOWER_ZOOM_FRICTION;
      }
    } else if (currZoomLevel > maxZoomLevel) {
      // Apply the friction if zoom level is above the max
      currZoomLevel = maxZoomLevel + (currZoomLevel - maxZoomLevel) * UPPER_ZOOM_FRICTION;
    }

    currSlide.pan.x = this._calculatePanForZoomLevel('x', currZoomLevel);
    currSlide.pan.y = this._calculatePanForZoomLevel('y', currZoomLevel);

    currSlide.setZoomLevel(currZoomLevel);
    currSlide.applyCurrentZoomPan();


    //_isZoomingIn = currZoomLevel > _currZoomLevel;
    //_currZoomLevel = currZoomLevel;
    //_applyCurrentZoomPan();
    //_updatePrevPoints();
  }

  end() {
    const { pswp } = this;
    const { currSlide } = pswp;
    if (currSlide.currZoomLevel < currSlide.zoomLevels.initial
        && !this._wasOverFitZoomLevel
        && pswp.options.pinchToClose) {
      pswp.close();
    } else {
      this.correctZoomPan();
    }
  }

  _calculatePanForZoomLevel(axis, currZoomLevel) {
    const zoomFactor = currZoomLevel / this._startZoomLevel;
    return this._zoomPoint[axis]
            - ((this._startZoomPoint[axis] - this._startPan[axis]) * zoomFactor);
  }

  /**
   * Correct currZoomLevel and pan if they are
   * beyond minimum or maximum values.
   * With animation.
   */
  correctZoomPan() {
    const { pswp } = this;
    const { currSlide } = pswp;

    if (!currSlide.isZoomable()) {
      return;
    }

    const prevZoomLevel = currSlide.currZoomLevel;

    let destinationZoomLevel;
    let currZoomLevelNeedsChange = true;

    if (prevZoomLevel < currSlide.zoomLevels.initial) {
      destinationZoomLevel = currSlide.zoomLevels.initial;
      // zoom to min
    } else if (prevZoomLevel > currSlide.zoomLevels.max) {
      destinationZoomLevel = currSlide.zoomLevels.max;
      // zoom to max
    } else {
      currZoomLevelNeedsChange = false;
      destinationZoomLevel = prevZoomLevel;
    }

    const initialBgOpacity = pswp.bgOpacity;
    const restoreBgOpacity = pswp.bgOpacity < 1;

    const initialPan = equalizePoints({}, currSlide.pan);
    let destinationPan = equalizePoints({}, initialPan);

    if (currZoomLevelNeedsChange) {
      destinationPan = {
        x: this._calculatePanForZoomLevel('x', destinationZoomLevel),
        y: this._calculatePanForZoomLevel('y', destinationZoomLevel)
      };
    }

    // set zoom level, so pan bounds are updated according to it
    currSlide.setZoomLevel(destinationZoomLevel);

    destinationPan = {
      x: currSlide.bounds.correctPan('x', destinationPan.x),
      y: currSlide.bounds.correctPan('y', destinationPan.y)
    };

    // return zoom level and its bounds to initial
    currSlide.setZoomLevel(prevZoomLevel);

    let panNeedsChange = true;
    if (pointsEqual(destinationPan, initialPan)) {
      panNeedsChange = false;
    }

    if (!panNeedsChange && !currZoomLevelNeedsChange && !restoreBgOpacity) {
      // nothing to animate
      return;
    }

    pswp.animations.stopAllPan();

    pswp.animations.startSpring({
      isPan: true,
      start: 0,
      end: 1000,
      velocity: 0,
      dampingRatio: 1,
      naturalFrequency: 30,
      onUpdate: (now) => {
        now /= 1000; // 0 - start, 1 - end

        if (panNeedsChange || currZoomLevelNeedsChange) {
          if (panNeedsChange) {
            currSlide.pan.x = initialPan.x + (destinationPan.x - initialPan.x) * now;
            currSlide.pan.y = initialPan.y + (destinationPan.y - initialPan.y) * now;
          }

          if (currZoomLevelNeedsChange) {
            const newZoomLevel = prevZoomLevel
                        + (destinationZoomLevel - prevZoomLevel) * now;
            currSlide.setZoomLevel(newZoomLevel);
          }

          currSlide.applyCurrentZoomPan();
        }

        // Restore background opacity
        if (restoreBgOpacity && pswp.bgOpacity < 1) {
          // We clamp opacity to keep it between 0 and 1.
          // As progress ratio can be larger than 1 due to overshoot,
          // and we do not want to bounce opacity.
          pswp.applyBgOpacity(clamp(
            initialBgOpacity + (1 - initialBgOpacity) * now, 0, 1
          ));
        }
      },
    });
  }
}

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

/**
 * Gestures class bind touch, pointer or mouse events
 * and emits drag to drag-handler and zoom events zoom-handler.
 *
 * Drag and zoom events are emited in requestAnimationFrame,
 * and only when one of pointers was actually changed.
 */

// How far should user should drag
// until we can determine that the gesture is swipe and its direction
const AXIS_SWIPE_HYSTERISIS = 10;
//const PAN_END_FRICTION = 0.35;

const DOUBLE_TAP_DELAY = 300; // ms
const MIN_TAP_DISTANCE = 25; // px

class Gestures {
  constructor(pswp) {
    this.pswp = pswp;


    // point objects are defined once and reused
    // PhotoSwipe keeps track only of two pointers, others are ignored
    this.p1 = {}; // the first pressed pointer
    this.p2 = {}; // the second pressed pointer
    this.prevP1 = {};
    this.prevP2 = {};
    this.startP1 = {};
    this.startP2 = {};
    this.velocity = {};

    this._lastStartP1 = {};
    this._intervalP1 = {};
    this._numActivePoints = 0;
    this._ongoingPointers = [];

    this._touchEventEnabled = 'ontouchstart' in window;
    this._pointerEventEnabled = !!(window.PointerEvent);
    this.supportsTouch = this._touchEventEnabled
                          || (this._pointerEventEnabled && navigator.maxTouchPoints > 1);

    if (!this.supportsTouch) {
      // disable pan to next slide for non-touch devices
      pswp.options.allowPanToNext = false;
    }

    this.drag = new DragHandler(this);
    this.zoomLevels = new ZoomHandler(this);
    this.tapHandler = new TapHandler(this);

    pswp.on('bindEvents', () => {
      pswp.events.add(pswp.scrollWrap, 'click', e => this._onClick(e));

      if (this._pointerEventEnabled) {
        this._bindEvents('pointer', 'down', 'up', 'cancel');
      } else if (this._touchEventEnabled) {
        this._bindEvents('touch', 'start', 'end', 'cancel');

        // In previous versions we also bound mouse event here,
        // in case device supports both touch and mouse events,
        // but newer versions of browsers now support PointerEvent.

        // on iOS10 if you bind touchmove/end after touchstart,
        // and you don't preventDefault touchstart (which PhotoSwipe does),
        // preventDefault will have no effect on touchmove and touchend.
        // Unless you bind it previously.
        pswp.scrollWrap.ontouchmove = () => {}; // eslint-disable-line
        pswp.scrollWrap.ontouchend = () => {}; // eslint-disable-line
      } else {
        this._bindEvents('mouse', 'down', 'up');
      }
    });
  }

  _bindEvents(pref, down, up, cancel) {
    const { pswp } = this;
    const { events } = pswp;

    const cancelEvent = cancel ? pref + cancel : '';

    events.add(pswp.scrollWrap, pref + down, this.onPointerDown.bind(this));
    events.add(window, pref + 'move', this.onPointerMove.bind(this));
    events.add(window, pref + up, this.onPointerUp.bind(this));
    if (cancelEvent) {
      events.add(pswp.scrollWrap, cancelEvent, this.onPointerUp.bind(this));
    }
  }


  onPointerDown(e) {
    // We do not call preventDefault for touch events
    // to allow browser to show native dialog on longpress
    // (the one that allows to save image or open it in new tab).
    //
    // Desktop Safari allows to drag images when preventDefault isn't called on mousedown,
    // even though preventDefault IS called on mousemove. That's why we preventDefault mousedown.
    let isMousePointer;
    if (e.type === 'mousedown' || e.pointerType === 'mouse') {
      isMousePointer = true;
    }

    // Allow dragging only via left mouse button.
    // http://www.quirksmode.org/js/events_properties.html
    // https://developer.mozilla.org/en-US/docs/Web/API/event.button
    if (isMousePointer && e.button > 0) {
      return;
    }

    const { pswp } = this;

    // if PhotoSwipe is opening or closing
    if (!pswp.opener.isOpen) {
      e.preventDefault();
      return;
    }

    if (pswp.dispatch('pointerDown', { originalEvent: e }).defaultPrevented) {
      return;
    }

    if (isMousePointer) {
      pswp.mouseDetected();

      // preventDefault mouse event to prevent
      // browser image drag feature
      this._preventPointerEventBehaviour(e);
    }

    pswp.animations.stopAll();

    this._updatePoints(e);

    this.pointerDown = true;

    if (this._numActivePoints === 1) {
      this.dragAxis = null;
      // we need to store initial point to determine the main axis,
      // drag is activated only after the axis is determined
      equalizePoints(this.startP1, this.p1);
    }

    if (this._numActivePoints > 1) {
      // Tap or double tap should not trigger if more than one pointer
      this._clearTapTimer();
      this.isMultitouch = true;
    } else {
      this.isMultitouch = false;
    }
  }

  onPointerMove(e) {
    e.preventDefault(); // always preventDefault move event

    if (!this._numActivePoints) {
      return;
    }

    this._updatePoints(e);

    if (this.pswp.dispatch('pointerMove', { originalEvent: e }).defaultPrevented) {
      return;
    }

    if (this._numActivePoints === 1 && !this.isDragging) {
      if (!this.dragAxis) {
        this._calculateDragDirection();
      }

      // Drag axis was detected, emit drag.start
      if (this.dragAxis && !this.isDragging) {
        if (this.isZooming) {
          this.isZooming = false;
          this.zoomLevels.end();
        }

        this.isDragging = true;
        this._clearTapTimer(); // Tap can not trigger after drag

        // Adjust starting point
        this._updateStartPoints();
        this._intervalTime = Date.now();
        //this._startTime = this._intervalTime;
        this._velocityCalculated = false;
        equalizePoints(this._intervalP1, this.p1);
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.drag.start();

        this._rafStopLoop();
        this._rafRenderLoop();
      }
    } else if (this._numActivePoints > 1 && !this.isZooming) {
      this._finishDrag();

      this.isZooming = true;

      // Adjust starting points
      this._updateStartPoints();

      this.zoomLevels.start();

      this._rafStopLoop();
      this._rafRenderLoop();
    }
  }

  _finishDrag() {
    if (this.isDragging) {
      this.isDragging = false;

      // Try to calculate velocity,
      // if it wasn't calculated yet in drag.change
      if (!this._velocityCalculated) {
        this._updateVelocity(true);
      }

      this.drag.end();
      this.dragAxis = null;
    }
  }


  onPointerUp(e) {
    if (!this._numActivePoints) {
      return;
    }

    this._updatePoints(e, true);

    if (this.pswp.dispatch('pointerUp', { originalEvent: e }).defaultPrevented) {
      return;
    }

    if (this._numActivePoints === 0) {
      this.pointerDown = false;
      this._rafStopLoop();

      if (this.isDragging) {
        this._finishDrag();
      } else if (!this.isZooming && !this.isMultitouch) {
        //this.zoomLevels.correctZoomPan();
        this._finishTap(e);
      }
    }

    if (this._numActivePoints < 2 && this.isZooming) {
      this.isZooming = false;
      this.zoomLevels.end();

      if (this._numActivePoints === 1) {
        // Since we have 1 point left, we need to reinitiate drag
        this.dragAxis = null;
        this._updateStartPoints();
      }
    }
  }


  _rafRenderLoop() {
    if (this.isDragging || this.isZooming) {
      this._updateVelocity();

      if (this.isDragging) {
        // make sure that pointer moved since the last update
        if (!pointsEqual(this.p1, this.prevP1)) {
          this.drag.change();
        }
      } else /* if (this.isZooming) */ {
        if (!pointsEqual(this.p1, this.prevP1)
            && !pointsEqual(this.p2, this.prevP2)) {
          this.zoomLevels.change();
        }
      }

      this._updatePrevPoints();
      this.raf = requestAnimationFrame(this._rafRenderLoop.bind(this));
    }
  }

  /**
   * Update velocity at 50ms interval
   */
  _updateVelocity(force) {
    const time = Date.now();
    const duration = time - this._intervalTime;

    if (duration < 50 && !force) {
      return;
    }


    this.velocity.x = this._getVelocity('x', duration);
    this.velocity.y = this._getVelocity('y', duration);

    this._intervalTime = time;
    equalizePoints(this._intervalP1, this.p1);
    this._velocityCalculated = true;
  }

  _finishTap(e) {
    const { mainScroll } = this.pswp;

    // Do not trigger tap events if main scroll is shifted
    if (mainScroll.isShifted()) {
      // restore main scroll position
      // (usually happens if stopped in the middle of animation)
      mainScroll.moveIndexBy(0, true);
      return;
    }

    // Do not trigger tap for touchcancel or pointercancel
    if (e.type.indexOf('cancel') > 0) {
      return;
    }

    // Trigger click instead of tap for mouse events
    if (e.type === 'mouseup' || e.pointerType === 'mouse') {
      this.tapHandler.click(this.startP1, e);
      return;
    }

    // Disable delay if there is no doubleTapAction
    const tapDelay = this.pswp.options.doubleTapAction ? DOUBLE_TAP_DELAY : 0;

    // If tapTimer is defined - we tapped recently,
    // check if the current tap is close to the previous one,
    // if yes - trigger double tap
    if (this._tapTimer) {
      this._clearTapTimer();
      // Check if two taps were more or less on the same place
      if (getDistanceBetween(this._lastStartP1, this.startP1) < MIN_TAP_DISTANCE) {
        this.tapHandler.doubleTap(this.startP1, e);
      }
    } else {
      equalizePoints(this._lastStartP1, this.startP1);
      this._tapTimer = setTimeout(() => {
        this.tapHandler.tap(this.startP1, e);
        this._clearTapTimer();
      }, tapDelay);
    }
  }

  _clearTapTimer() {
    if (this._tapTimer) {
      clearTimeout(this._tapTimer);
      this._tapTimer = null;
    }
  }

  /**
   * Get velocity for axis
   *
   * @param {Number} axis
   * @param {Number} duration
   */
  _getVelocity(axis, duration) {
    // displacement is like distance, but can be negative.
    const displacement = this.p1[axis] - this._intervalP1[axis];

    if (Math.abs(displacement) > 1 && duration > 5) {
      return displacement / duration;
    }

    return 0;
  }

  _rafStopLoop() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _preventPointerEventBehaviour(e) {
    // TODO find a way to disable e.preventDefault on some elements
    //      via event or some class or something
    e.preventDefault();
    return true;
  }

  /**
   * Parses and normalizes points from the touch, mouse or pointer event.
   * Updates p1 and p2.
   *
   * @param {Event} e
   * @param {Boolean} isPointerUp
   */
  _updatePoints(e, isPointerUp) {
    if (this._pointerEventEnabled) {
      // Try to find the current pointer in ongoing pointers by its ID
      const pointerIndex = this._ongoingPointers.findIndex((ongoingPoiner) => {
        return ongoingPoiner.id === e.pointerId;
      });

      if (isPointerUp && pointerIndex > -1) {
        // release the pointer - remove it from ongoing
        this._ongoingPointers.splice(pointerIndex, 1);
      } else if (!isPointerUp && pointerIndex === -1) {
        // add new pointer
        this._ongoingPointers.push(this._convertEventPosToPoint(e, {}));
      } else if (pointerIndex > -1) {
        // update existing pointer
        this._convertEventPosToPoint(e, this._ongoingPointers[pointerIndex]);
      }

      this._numActivePoints = this._ongoingPointers.length;

      // update points that PhotoSwipe uses
      // to calculate position and scale
      if (this._numActivePoints > 0) {
        equalizePoints(this.p1, this._ongoingPointers[0]);
      }

      if (this._numActivePoints > 1) {
        equalizePoints(this.p2, this._ongoingPointers[1]);
      }
    } else {
      this._numActivePoints = 0;
      if (e.type.indexOf('touch') > -1) {
        // Touch Event
        // https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent
        if (e.touches && e.touches.length > 0) {
          this._convertEventPosToPoint(e.touches[0], this.p1);
          this._numActivePoints++;
          if (e.touches.length > 1) {
            this._convertEventPosToPoint(e.touches[1], this.p2);
            this._numActivePoints++;
          }
        }
      } else {
        // Mouse Event
        this._convertEventPosToPoint(e, this.p1);
        if (isPointerUp) {
          // clear all points on mouseup
          this._numActivePoints = 0;
        } else {
          this._numActivePoints++;
        }
      }
    }
  }

  // update points that were used during previous rAF tick
  _updatePrevPoints() {
    equalizePoints(this.prevP1, this.p1);
    equalizePoints(this.prevP2, this.p2);
  }

  // update points at the start of gesture
  _updateStartPoints() {
    equalizePoints(this.startP1, this.p1);
    equalizePoints(this.startP2, this.p2);
    this._updatePrevPoints();
  }

  _calculateDragDirection() {
    if (this.pswp.mainScroll.isShifted()) {
      // if main scroll position is shifted – direction is always horizontal
      this.dragAxis = 'x';
    } else {
      // calculate delta of the last touchmove tick
      const diff = Math.abs(this.p1.x - this.startP1.x) - Math.abs(this.p1.y - this.startP1.y);

      if (diff !== 0) {
        // check if pointer was shifted horizontally or vertically
        const axisToCheck = diff > 0 ? 'x' : 'y';

        if (Math.abs(this.p1[axisToCheck] - this.startP1[axisToCheck]) >= AXIS_SWIPE_HYSTERISIS) {
          this.dragAxis = axisToCheck;
        }
      }
    }
  }

  /**
   * Converts touch, pointer or mouse event
   * to PhotoSwipe point.
   *
   * @param {Event} e
   * @param {Point} p
   */
  _convertEventPosToPoint(e, p) {
    p.x = e.pageX - this.pswp.offset.x;
    p.y = e.pageY - this.pswp.offset.y;

    // e.pointerId can be zero
    if (e.pointerId !== undefined) {
      p.id = e.pointerId;
    } else if (e.identifier !== undefined) {
      p.id = e.identifier;
    }

    return p;
  }

  _onClick(e) {
    // Do not allow click event to pass through after drag
    if (this.pswp.mainScroll.isShifted()) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}

/**
 * Handles movement of the main scrolling container
 * (for example, it repositions when user swipes left or right).
 *
 * Also stores its state.
 */

const MAIN_SCROLL_END_FRICTION = 0.35;


// const MIN_SWIPE_TRANSITION_DURATION = 250;
// const MAX_SWIPE_TRABSITION_DURATION = 500;
// const DEFAULT_SWIPE_TRANSITION_DURATION = 333;

class MainScroll {
  /**
   * @param {PhotoSwipe} pswp
   */
  constructor(pswp) {
    this.pswp = pswp;
    this.x = 0;

    // Size of slide area + spacing
    this.slideWidth = 0; // old pswp.slideSize.x

    this.resetPosition();
  }

  /**
   * Position the scroller and slide containers
   * according to viewport size.
   *
   * @param {Boolean} resizeSlides Whether slides content should resized
   */
  resize(resizeSlides) {
    const { pswp } = this;

    this.slideWidth = Math.round(
      pswp.viewportSize.x + pswp.viewportSize.x * pswp.options.spacing
    );

    this.moveTo(this.getCurrSlideX());

    this.itemHolders.forEach((itemHolder, index) => {
      setTransform(itemHolder.el, (index + this._containerShiftIndex)
                                    * this.slideWidth);

      if (resizeSlides && itemHolder.slide) {
        itemHolder.slide.resize();
      }
    });
  }

  /**
   * Reset X position of the main scroller to zero
   */
  resetPosition() {
    // Position on the main scroller (offset)
    // it is independent from slide index
    this._currPositionIndex = 0;
    this._prevPositionIndex = 0;

    // _containerShiftIndex*viewportSize will give you amount of transform of the current slide
    this._containerShiftIndex = -1;
  }

  /**
   * Create and append array of three items
   * that hold data about slides in DOM
   */
  appendHolders() {
    this.itemHolders = [];

    // append our three slide holders -
    // previous, current, and next
    for (let i = 0; i < 3; i++) {
      const el = createElement('pswp__item', false, this.pswp.container);

      // hide nearby item holders until initial zoom animation finishes (to avoid extra Paints)
      el.style.display = (i === 1) ? 'block' : 'none';

      this.itemHolders.push({
        el,
        //index: -1
      });
    }
  }

  /**
   * Whether the main scroll can be horizontally swiped to the next or previous slide.
   */
  canBeSwiped() {
    return this.pswp.getNumItems() > 1;
  }

  /**
   * Move main scroll by X amount of slides.
   * For example:
   *   `-1` will move to the previous slide,
   *    `0` will reset the scroll position of the current slide,
   *    `3` will move three slides forward
   *
   * If loop option is enabled - index will be automatically looped too,
   * (for example `-1` will move to the last slide of the gallery).
   *
   * @param {Integer} diff
   * @returns {Boolean} whether index was changed or not
   */
  moveIndexBy(diff, animate, velocityX) {
    const { pswp } = this;
    let newIndex = pswp.potentialIndex + diff;

    if (pswp.options.loop) {
      newIndex = pswp.getLoopedIndex(newIndex);
    } else {
      if (newIndex < 0) {
        newIndex = 0;
      } else if (newIndex >= pswp.getNumItems()) {
        newIndex = pswp.getNumItems() - 1;
      }
      diff = newIndex - pswp.potentialIndex;
    }

    pswp.potentialIndex = newIndex;
    this._currPositionIndex -= diff;

    pswp.animations.stopMainScroll();

    const destinationX = this.getCurrSlideX();
    if (!animate) {
      this.moveTo(destinationX);
      this.updateCurrItem();
    } else {
      pswp.animations.startSpring({
        isMainScroll: true,
        start: this.x,
        end: destinationX,
        velocity: velocityX || 0,
        naturalFrequency: 30,
        dampingRatio: 1, //0.7,
        onUpdate: (x) => {
          this.x = x;
          setTransform(this.pswp.container, x);
        },
        onComplete: () => {
          this.updateCurrItem();
          pswp.appendHeavy();
        }
      });

      // Force-append new slides during transition
      // if difference between slides is more than 1
      if (Math.abs(pswp.potentialIndex - pswp.currIndex) > 1) {
        this.updateCurrItem();
      }
    }

    if (diff) {
      return true;
    }
  }

  /**
   * X position of the main scroll for the current slide
   * (ignores position during dragging)
   */
  getCurrSlideX() {
    return this.slideWidth * this._currPositionIndex;
  }

  /**
   * Whether scroll position is shifted.
   * For example, it will return true if the scroll is being dragged or animated.
   */
  isShifted() {
    return this.x !== this.getCurrSlideX();
  }

  /**
   * Update slides X positions and set their content
   */
  updateCurrItem() {
    const { pswp } = this;
    const positionDifference = this._prevPositionIndex - this._currPositionIndex;

    if (!positionDifference) {
      return;
    }

    this._prevPositionIndex = this._currPositionIndex;

    pswp.currIndex = pswp.potentialIndex;
    pswp.currItemData = pswp.getItemData(pswp.currIndex);

    let diffAbs = Math.abs(positionDifference);
    let tempHolder;

    if (diffAbs >= 3) {
      this._containerShiftIndex += positionDifference + (positionDifference > 0 ? -3 : 3);
      diffAbs = 3;
    }

    for (let i = 0; i < diffAbs; i++) {
      if (positionDifference > 0) {
        tempHolder = this.itemHolders.shift();
        this.itemHolders[2] = tempHolder; // move first to last

        this._containerShiftIndex++;

        setTransform(tempHolder.el, (this._containerShiftIndex + 2) * this.slideWidth);

        pswp.setContent(tempHolder, (pswp.currIndex - diffAbs) + i + 2);
      } else {
        tempHolder = this.itemHolders.pop();
        this.itemHolders.unshift(tempHolder); // move last to first

        this._containerShiftIndex--;

        setTransform(tempHolder.el, this._containerShiftIndex * this.slideWidth);

        pswp.setContent(tempHolder, (pswp.currIndex + diffAbs) - i - 2);
      }
    }

    // Reset transfrom every 50ish navigations in one direction.
    //
    // Otherwise transform will keep growing indefinitely,
    // which might cause issues as browsers have a maximum transform limit.
    // I wasn't able to reach it, but just to be safe.
    // This should not cause noticable lag.
    if (Math.abs(this._containerShiftIndex) > 50 && !this.isShifted()) {
      this.resetPosition();
      this.resize();
    }

    // Pan transition might be running (and consntantly updating pan position)
    pswp.animations.stopAllPan();

    this.itemHolders.forEach((itemHolder, i) => {
      if (itemHolder.slide) {
        // Slide in the 2nd holder is always active
        itemHolder.slide.setIsActive(i === 1);
      }
    });

    pswp.currSlide = this.itemHolders[1].slide;
    pswp.lazyLoader.update(positionDifference);

    pswp.currSlide.applyCurrentZoomPan();
    pswp.dispatch('change');
  }

  /**
   * Move the X position of the main scroll container
   *
   * @param {Number} x
   * @param {Boolean} dragging
   */
  moveTo(x, dragging) {
    let newSlideIndexOffset;
    let delta;

    if (!this.pswp.options.loop && dragging) {
      // Apply friction
      newSlideIndexOffset = ((this.slideWidth * this._currPositionIndex) - x) / this.slideWidth;
      newSlideIndexOffset += this.pswp.currIndex;
      delta = Math.round(x - this.x);

      if ((newSlideIndexOffset < 0 && delta > 0)
          || (newSlideIndexOffset >= this.pswp.getNumItems() - 1 && delta < 0)) {
        x = this.x + (delta * MAIN_SCROLL_END_FRICTION);
      }
    }

    this.x = x;
    setTransform(this.pswp.container, x);
  }
}

/**
 *
 * keyboard.js
 *
 * - Manages keyboard shortcuts.
 * - Heps trap focus within photoswipe.
 *
 */

class Keyboard {
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

    const lastActiveElement = document.activeElement;
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
      this.pswp.template.focus();
      this._wasFocused = true;
    }
  }

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

    let keydownAction;
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
   * @param {Event} e
   */
  _onFocusIn(e) {
    const { template } = this.pswp;
    if (document !== e.target
        && template !== e.target
        && !template.contains(e.target)) {
      // focus root element
      template.focus();
    }
  }
}

/**
 * Runs CSS transition.
 */

const DEFAULT_EASING = 'cubic-bezier(.4,0,.22,1)';

class CSSAnimation {
  // onComplete can be unpredictable, be careful about current state
  constructor(props) {
    this.props = props;
    const {
      target,
      onComplete,
      transform,
      // opacity
    } = props;

    let {
      duration,
      easing,
    } = props;

    // support only transform and opacity
    const prop = transform ? 'transform' : 'opacity';
    const propValue = props[prop];

    this._target = target;
    this._onComplete = onComplete;

    duration = duration || 333;
    easing = easing || DEFAULT_EASING;

    this._onTransitionEnd = this._onTransitionEnd.bind(this);

    // Using timeout hack to make sure that animation
    // starts even if the animated property was changed recently,
    // otherwise transitionend might not fire or transiton won't start.
    // https://drafts.csswg.org/css-transitions/#starting
    //
    // ¯\_(ツ)_/¯
    this._firstFrameTimeout = setTimeout(() => {
      setTransitionStyle(target, prop, duration, easing);
      this._firstFrameTimeout = setTimeout(() => {
        target.addEventListener('transitionend', this._onTransitionEnd, false);
        target.addEventListener('transitioncancel', this._onTransitionEnd, false);
        target.style[prop] = propValue;
      }, 30); // Do not reduce this number
    }, 0);
  }

  _onTransitionEnd(e) {
    if (e.target === this._target) {
      this._finalizeAnimation();
    }
  }

  _finalizeAnimation() {
    if (!this._finished) {
      this._finished = true;
      this.onFinish();
      if (this._onComplete) {
        this._onComplete();
      }
    }
  }

  // Destroy is called automatically onFinish
  destroy() {
    if (this._firstFrameTimeout) {
      clearTimeout(this._firstFrameTimeout);
    }
    removeTransitionStyle(this._target);
    this._target.removeEventListener('transitionend', this._onTransitionEnd, false);
    this._target.removeEventListener('transitioncancel', this._onTransitionEnd, false);
    if (!this._finished) {
      this._finalizeAnimation();
    }
  }
}

/**
 * Spring easing helper
 */

const DEFAULT_NATURAL_FREQUENCY = 12;
const DEFAULT_DAMPING_RATIO = 0.75;

class SpringEaser {
  /**
   * @param {Number} initialVelocity Initial velocity, px per ms.
   *
   * @param {Number} dampingRatio Determines how bouncy animation will be.
   *                              From 0 to 1, 0 - always overshoot, 1 - do not overshoot.
   *                              "overshoot" refers to part of animation that
   *                              goes beyond the final value.
   *
   * @param {Number} naturalFrequency Determines how fast animation will slow down.
   *                                  The higher value - the stiffer the transition will be,
   *                                  and the faster it will slow down.
   *                                  Recommended value from 10 to 50
   */
  constructor(initialVelocity, dampingRatio, naturalFrequency) {
    this.velocity = initialVelocity * 1000; // convert to "pixels per second"

    // https://en.wikipedia.org/wiki/Damping_ratio
    this._dampingRatio = dampingRatio || DEFAULT_DAMPING_RATIO;

    // https://en.wikipedia.org/wiki/Natural_frequency
    this._naturalFrequency = naturalFrequency || DEFAULT_NATURAL_FREQUENCY;

    if (this._dampingRatio < 1) {
      this._dampedFrequency = this._naturalFrequency
                         * Math.sqrt(1 - this._dampingRatio * this._dampingRatio);
    }
  }

  /**
   * @param {Number} deltaPosition Difference between current and end position of the animation
   * @param {Number} deltaTime Frame duration in milliseconds
   *
   * @returns {Number} Displacement, relative to the end position.
   */
  easeFrame(deltaPosition, deltaTime) {
    // Inspired by Apple Webkit and Android spring function implementation
    // https://en.wikipedia.org/wiki/Oscillation
    // https://en.wikipedia.org/wiki/Damping_ratio
    // we ignore mass (assume that it's 1kg)

    let displacement = 0;
    let coeff;

    deltaTime /= 1000;

    const naturalDumpingPow = Math.E ** (-this._dampingRatio * this._naturalFrequency * deltaTime);

    if (this._dampingRatio === 1) {
      coeff = this.velocity + this._naturalFrequency * deltaPosition;

      displacement = (deltaPosition + coeff * deltaTime) * naturalDumpingPow;

      this.velocity = displacement
                        * (-this._naturalFrequency) + coeff
                        * naturalDumpingPow;
    } else if (this._dampingRatio < 1) {
      coeff = (1 / this._dampedFrequency)
                * (this._dampingRatio * this._naturalFrequency * deltaPosition + this.velocity);

      const dumpedFCos = Math.cos(this._dampedFrequency * deltaTime);
      const dumpedFSin = Math.sin(this._dampedFrequency * deltaTime);

      displacement = naturalDumpingPow
                       * (deltaPosition * dumpedFCos + coeff * dumpedFSin);

      this.velocity = displacement
                        * (-this._naturalFrequency)
                        * this._dampingRatio
                        + naturalDumpingPow
                        * (-this._dampedFrequency * deltaPosition * dumpedFSin
                        + this._dampedFrequency * coeff * dumpedFCos);
    }

    // Overdamped (>1) damping ratio is not supported

    return displacement;
  }
}

class SpringAnimation {
  constructor(props) {
    this.props = props;

    const {
      start,
      end,
      velocity,
      onUpdate,
      onComplete,
      onFinish,
      dampingRatio,
      naturalFrequency
    } = props;

    const easer = new SpringEaser(velocity, dampingRatio, naturalFrequency);
    let prevTime = Date.now();
    let deltaPosition = start - end;

    this._onFinish = onFinish;

    const animationLoop = () => {
      if (this._raf) {
        deltaPosition = easer.easeFrame(deltaPosition, Date.now() - prevTime);

        // Stop the animation if velocity is low and position is close to end
        if (Math.abs(deltaPosition) < 1 && Math.abs(easer.velocity) < 50) {
          // Finalize the animation
          onUpdate(end);
          if (onComplete) {
            onComplete();
          }
          this.onFinish();
        } else {
          prevTime = Date.now();
          onUpdate(deltaPosition + end);
          this._raf = requestAnimationFrame(animationLoop);
        }
      }
    };

    this._raf = requestAnimationFrame(animationLoop);
  }

  // Destroy is called automatically onFinish
  destroy() {
    if (this._raf >= 0) {
      cancelAnimationFrame(this._raf);
    }
    this._raf = null;
  }
}

/**
 * Manages animations
 */

class Animations {
  constructor() {
    this.activeAnimations = [];
  }

  startSpring(props) {
    this._start(props, true);
  }

  startTransition(props) {
    this._start(props);
  }

  _start(props, isSpring) {
    // if (!props.name) {
    //   props.name = this._uid++;
    // }

    // const { name } = props;

    // if (!name || this.activeAnimations[name]) {
    //   // Animation already running or no name provided
    //   return;
    // }

    let animation;
    if (isSpring) {
      animation = new SpringAnimation(props);
    } else {
      animation = new CSSAnimation(props);
    }

    this.activeAnimations.push(animation);
    animation.onFinish = () => this.stop(animation);

    return animation;
  }

  stop(animation) {
    animation.destroy();
    const index = this.activeAnimations.indexOf(animation);
    if (index > -1) {
      this.activeAnimations.splice(index, 1);
    }
  }

  stopAll() { // _stopAllAnimations
    this.activeAnimations.forEach((animation) => {
      animation.destroy();
    });
    this.activeAnimations = [];
  }

  /**
   * Stop all pan or zoom transitions
   */
  stopAllPan() {
    this.activeAnimations = this.activeAnimations.filter((animation) => {
      if (animation.props.isPan) {
        animation.destroy();
        return false;
      }

      return true;
    });
  }

  stopMainScroll() {
    this.activeAnimations = this.activeAnimations.filter((animation) => {
      if (animation.props.isMainScroll) {
        animation.destroy();
        return false;
      }

      return true;
    });
  }

  /**
   * Returns true if main scroll transition is running
   */
  // isMainScrollRunning() {
  //   return this.activeAnimations.some((animation) => {
  //     return animation.props.isMainScroll;
  //   });
  // }

  /**
   * Returns true if any pan or zoom transition is running
   */
  isPanRunning() {
    return this.activeAnimations.some((animation) => {
      return animation.props.isPan;
    });
  }
}

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

function addButtonHTML(htmlData) {
  if (typeof htmlData === 'string') {
    // Allow developers to provide full svg,
    // For example:
    // <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" class="pswp__icn">
    //   <path d="..." />
    //   <circle ... />
    // </svg>
    // Can also be any HTML string.
    return htmlData;
  }

  if (!htmlData || !htmlData.isCustomSVG) {
    return '';
  }

  const svgData = htmlData;
  let out = '<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 %d %d" width="%d" height="%d">';
  out = out.split('%d').join(svgData.size || 32); // replace all %d with size

  // Icons may contain outline/shadow,
  // to make it we "clone" base icon shape and add border to it.
  // Icon itself and border are styled via CSS.
  //
  // Property shadowID defines ID of element that should be cloned.
  if (svgData.outlineID) {
    out += '<use class="pswp__icn-shadow" xlink:href="#' + svgData.outlineID + '"/>';
  }

  out += svgData.inner;

  out += '</svg>';

  return out;
}

class UIElement {
  constructor(pswp, data) {
    const name = data.name || data.class;
    if (pswp.options[name] === false) {
      // exit if element is disabled from options
      return;
    }

    // Allow to override SVG icons from options
    if (typeof pswp.options[name + 'SVG'] === 'string') {
      // arrowPrevSVG
      // arrowNextSVG
      // closeSVG
      // zoomSVG
      data.html = pswp.options[name + 'SVG'];
    }

    pswp.dispatch('uiElementCreate', { data });

    let className = 'pswp__';
    if (data.isButton) {
      className += 'button pswp__button--';
    }
    className += (data.class || data.name);

    let element;
    if (data.isButton) {
      // create button element
      element = createElement(className, 'button');
      element.type = 'button';
      // add either html or svg inside it
      element.innerHTML = addButtonHTML(data.html);
      if (data.title) {
        element.title = data.title;
      }
    } else {
      element = createElement(className);
    }

    if (data.onInit) {
      data.onInit(element, pswp);
    }

    if (data.onClick) {
      element.onclick = (e) => {
        if (typeof data.onClick === 'string') {
          pswp[data.onClick]();
        } else {
          data.onClick(e, element, pswp);
        }
      };
    }

    // Top bar is default position
    const appendTo = data.appendTo || 'bar';
    let container;
    if (appendTo === 'bar') {
      if (!pswp.topBar) {
        pswp.topBar = createElement('pswp__top-bar pswp__hide-on-close', false, pswp.scrollWrap);
      }
      container = pswp.topBar;
    } else {
      // element outside of top bar gets a secondary class
      // that makes element fade out on close
      element.classList.add('pswp__hide-on-close');

      if (appendTo === 'wrapper') {
        container = pswp.scrollWrap;
      } else {
        // root element
        container = pswp.template;
      }
    }

    container.appendChild(element);
  }
}

/*
  Backward and forward arrow buttons
 */

function initArrowButton(element, pswp, isNextButton) {
  element.classList.add('pswp__button--arrow');
  pswp.on('change', () => {
    if (!pswp.options.loop) {
      if (isNextButton) {
        element.disabled = !(pswp.currIndex < pswp.getNumItems() - 1);
      } else {
        element.disabled = !(pswp.currIndex > 0);
      }
    }
  });
}

const arrowPrev = {
  name: 'arrowPrev',
  class: 'arrow--prev',
  title: 'Previous',
  order: 10,
  isButton: true,
  appendTo: 'wrapper',
  html: {
    isCustomSVG: true,
    size: 60,
    inner: '<path d="M29 43l-3 3-16-16 16-16 3 3-13 13 13 13z" id="pswp__icn-arrow"/>',
    outlineID: 'pswp__icn-arrow'
  },
  onClick: 'prev',
  onInit: initArrowButton
};

const arrowNext = {
  name: 'arrowNext',
  class: 'arrow--next',
  title: 'Next',
  order: 11,
  isButton: true,
  appendTo: 'wrapper',
  html: {
    isCustomSVG: true,
    size: 60,
    inner: '<use xlink:href="#pswp__icn-arrow"/>',
    outlineID: 'pswp__icn-arrow'
  },
  onClick: 'next',
  onInit: (el, pswp) => {
    initArrowButton(el, pswp, true);
  }
};

const closeButton = {
  name: 'close',
  title: 'Close',
  order: 20,
  isButton: true,
  html: {
    isCustomSVG: true,
    inner: '<path d="M24 10l-2-2-6 6-6-6-2 2 6 6-6 6 2 2 6-6 6 6 2-2-6-6z" id="pswp__icn-close"/>',
    outlineID: 'pswp__icn-close'
  },
  onClick: 'close'
};

const zoomButton = {
  name: 'zoom',
  title: 'Zoom (z)',
  order: 10,
  isButton: true,
  html: {
    isCustomSVG: true,
    inner: '<path d="M17.426 19.926a6 6 0 1 1 1.5-1.5L23 22.5 21.5 24l-4.074-4.074z" id="pswp__icn-zoom"/>'
          + '<path fill="currentColor" class="pswp__zoom-icn-bar-h" d="M11 16v-2h6v2z"/>'
          + '<path fill="currentColor" class="pswp__zoom-icn-bar-v" d="M13 12h2v6h-2z"/>',
    outlineID: 'pswp__icn-zoom'
  },
  onClick: 'toggleZoom'
};

// Delay before indicator will be shown
// (if image is loaded during it - the indicator will not be displayed at all)
const SHOW_DELAY = 1100; // ms

// Loading indicator fade-out duration
const FADE_OUT_DURATION = 350; // ms

// Indicator width/height, used for centering
// (it can not be centered via CSS,
//  as viewport might be adjusted via JS padding option)
const INDICATOR_SIZE = 24;

const loadingIndicator = {
  name: 'preloader',
  appendTo: 'wrapper',
  onInit: (indicatorElement, pswp) => {
    let isVisible;
    let delayTimeout;
    let hidingTimeout;

    const updateIndicatorPosition = () => {
      if (isVisible) {
        indicatorElement.style.left = Math.round((pswp.viewportSize.x - INDICATOR_SIZE) / 2) + 'px';
        indicatorElement.style.top = Math.round((pswp.viewportSize.y - INDICATOR_SIZE) / 2) + 'px';
      }
    };

    const toggleIndicatorClass = (className, add) => {
      indicatorElement.classList[add ? 'add' : 'remove']('pswp__preloader--' + className);
    };

    const setIndicatorVisibility = (visible) => {
      if (isVisible !== visible) {
        isVisible = visible;

        clearTimeout(hidingTimeout);
        toggleIndicatorClass('hiding', !visible);

        if (!visible) {
          // Fade out
          hidingTimeout = setTimeout(() => {
            toggleIndicatorClass('active', false);
          }, FADE_OUT_DURATION);
        } else {
          updateIndicatorPosition();
          // Fade in
          toggleIndicatorClass('active', true);
        }
      }
    };

    pswp.on('change', () => {
      if (!pswp.currSlide.isLoading) {
        setIndicatorVisibility(false);
        return;
      }

      clearTimeout(delayTimeout);

      // display loading indicator with delay
      delayTimeout = setTimeout(() => {
        setIndicatorVisibility(pswp.currSlide.isLoading);
      }, SHOW_DELAY);
    });

    pswp.on('loadComplete', (e) => {
      if (pswp.currSlide === e.slide) {
        setIndicatorVisibility(false);
      }
    });

    pswp.on('resize', updateIndicatorPosition);
  }
};

const counterIndicator = {
  name: 'counter',
  order: 5,
  onInit: (counterElement, pswp) => {
    pswp.on('change', () => {
      counterElement.innerHTML = (pswp.currIndex + 1)
                                  + pswp.options.indexIndicatorSep
                                  + pswp.getNumItems();
    });
  }
};

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
    if (Math.abs(currZoomLevelDiff) < 0.01) {
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

/**
 * Get dimensions of thumbnail image
 * (click on which opens photoswipe or closes photoswipe to)
 *
 * @param {Integer} index
 * @param {Object} itemData
 * @param {PhotoSwipe} instance PhotoSwipe instance
 */
function getThumbBounds(index, itemData, instance) {
  const event = instance.dispatch('thumbBounds', {
    index,
    itemData,
    instance
  });

  if (event.thumbBounds) {
    return event.thumbBounds;
  }

  const { element } = itemData;

  if (!element
      || instance.options.thumbSelector === false) {
    return;
  }

  const thumbSelector = instance.options.thumbSelector || 'img';
  const thumbnail = element.matches(thumbSelector)
    ? element : element.querySelector(thumbSelector);

  if (!thumbnail) {
    return;
  }

  const thumbAreaRect = thumbnail.getBoundingClientRect();

  if (!itemData.thumbCropped) {
    return {
      x: thumbAreaRect.left,
      y: thumbAreaRect.top,
      w: thumbAreaRect.width
    };
  }

  // get dimensions of the large image,
  // its aspect ratio must match thumbnail image
  const imageWidth = itemData.w;
  const imageHeight = itemData.h;

  if (!imageWidth || !imageHeight) {
    return;
  }

  // fill image into the area
  // (do they same as object-fit:cover does to retrieve coordinates)
  const hRatio = thumbAreaRect.width / imageWidth;
  const vRatio = thumbAreaRect.height / imageHeight;
  const fillZoomLevel = hRatio > vRatio ? hRatio : vRatio;

  const offsetX = (thumbAreaRect.width - imageWidth * fillZoomLevel) / 2;
  const offsetY = (thumbAreaRect.height - imageHeight * fillZoomLevel) / 2;

  // Coordinates of the image,
  // as if it was not cropped,
  // height is calculated automatically
  const bounds = {
    x: thumbAreaRect.left + offsetX,
    y: thumbAreaRect.top + offsetY,
    w: imageWidth * fillZoomLevel
  };

  // Coordinates of inner crop area
  // relative to the image
  bounds.innerRect = {
    w: thumbAreaRect.width,
    h: thumbAreaRect.height,
    x: offsetX,
    y: offsetY
  };

  return bounds;
}

// This much recently lazy-loaded images will not be lazy-loaded again
const MAX_SLIDES_TO_LAZY_LOAD = 15;

/**
 * Lazy-loads specific slide.
 * This function is used both by Lightbox and PhotoSwipe core,
 * thus it can be called before dialog is opened.
 *
 * By default it loads image based on viewport size and initial zoom level.
 *
 * @param {Integer} index Slide index
 * @param {Object}  instance PhotoSwipe or PhotoSwipeLightbox eventable instance
 */
function lazyLoadSlide(index, instance) {
  const itemData = instance.getItemData(index);

  if (instance.dispatch('lazyLoadSlide', { index, itemData }).defaultPrevented) {
    return;
  }

  if (itemData.src && itemData.w && itemData.h) {
    const { options } = instance;

    // We need to know dimensions of the image to preload it,
    // as it might use srcset and we need to define sizes
    const viewportSize = instance.viewportSize || getViewportSize(options);
    const panAreaSize = getPanAreaSize(options, viewportSize);

    const zoomLevel = new ZoomLevel(options, itemData, index);
    zoomLevel.update(itemData.w, itemData.h, panAreaSize);

    const image = document.createElement('img');
    image.decoding = 'async';
    image.sizes = Math.ceil(itemData.w * zoomLevel.initial) + 'px';
    image.src = itemData.src;
    if (itemData.srcset) {
      image.srcset = itemData.srcset;
    }
  }
}

class LazyLoader {
  constructor(pswp) {
    this.pswp = pswp;
    this.clearRecent();
  }

  /**
   * Lazy load nearby slides based on `preload` option.
   *
   * @param {Integer} diff Difference between slide indexes that was changed recently, or 0.
   */
  update(diff) {
    const { pswp } = this;

    if (pswp.dispatch('lazyLoad').defaultPrevented) {
      return;
    }

    const { preload } = pswp.options;
    const isForward = diff === undefined ? true : (diff >= 0);
    let i;

    // preload[1] - num items to preload in forward direction
    for (i = 0; i <= preload[1]; i++) {
      this._loadSlideByIndex(pswp.currIndex + (isForward ? i : (-i)));
    }

    // preload[0] - num items to preload in backward direction
    for (i = 1; i <= preload[0]; i++) {
      this._loadSlideByIndex(pswp.currIndex + (isForward ? (-i) : i));
    }
  }

  clearRecent() {
    this._recentlyLazyLoadedIndexes = [];
  }

  /**
   * Add index to recently lazy-loaded slides.
   *
   * To prevent duplciate downloads,
   * we keep track of recently preloaded slides.
   *
   * @param {Integer} index
   */
  addRecent(index) {
    if (this._recentlyLazyLoadedIndexes.indexOf(index) > -1) {
      // already exists
      return;
    }

    if (this._recentlyLazyLoadedIndexes.length > MAX_SLIDES_TO_LAZY_LOAD - 1) {
      this._recentlyLazyLoadedIndexes.pop();
    }

    // the most recent lazy loaded index is the first
    // (thus push to the beginning)
    this._recentlyLazyLoadedIndexes.unshift(index);

    return true;
  }

  _loadSlideByIndex(index) {
    index = this.pswp.getLoopedIndex(index);

    if (this.addRecent(index)) {
      lazyLoadSlide(index, this.pswp);
    }
  }
}

/**
 * Base PhotoSwipe event object
 */
class PhotoSwipeEvent {
  constructor(type, details) {
    this.type = type;
    if (details) {
      Object.assign(this, details);
    }
  }

  preventDefault() {
    this.defaultPrevented = true;
  }
}

/**
 * PhotoSwipe base class that can listen and dispatch for events.
 * Shared by PhotoSwipe Core and PhotoSwipe Lightbox, extended by base.js
 */
class Eventable {
  constructor() {
    this._listeners = {};
  }

  on(name, fn) {
    if (!this._listeners[name]) {
      this._listeners[name] = [];
    }
    this._listeners[name].push(fn);

    // When binding events to lightbox,
    // also bind events to PhotoSwipe Core,
    // if it's open.
    if (this.pswp) {
      this.pswp.on(name, fn);
    }
  }

  off(name, fn) {
    if (this._listeners[name]) {
      this._listeners[name] = this._listeners[name].filter(listener => (fn !== listener));
    }

    if (this.pswp) {
      this.pswp.off(name, fn);
    }
  }

  dispatch(name, details) {
    if (this.pswp) {
      return this.pswp.dispatch(name, details);
    }

    const event = new PhotoSwipeEvent(name, details);

    if (!this._listeners) {
      return event;
    }

    if (this._listeners[name]) {
      this._listeners[name].forEach((listener) => {
        listener.call(this, event);
      });
    }

    return event;
  }
}

/**
 * PhotoSwipe base class that can retrieve data about every slide.
 * Shared by PhotoSwipe Core and PhotoSwipe Lightbox
 */

class PhotoSwipeBase extends Eventable {
  /**
   * Get total number of slides
   */
  getNumItems() {
    let numItems;
    const { dataSource } = this.options;
    if (!dataSource) {
      numItems = 0;
    } else if (dataSource.length) {
      // may be an array or just object with length property
      numItems = dataSource.length;
    } else if (dataSource.gallery) {
      // query DOM elements
      if (!dataSource.items) {
        dataSource.items = this._getGalleryDOMElements(dataSource.gallery);
      }

      if (dataSource.items) {
        numItems = dataSource.items.length;
      }
    }

    // allow to filter number of items
    const event = this.dispatch('numItems', {
      dataSource,
      numItems
    });

    return event.numItems;
  }

  /**
   * Get item data by index.
   *
   * "item data" should contain normalized information that PhotoSwipe needs to generate a slide.
   * For example, it may contain properties like
   * `src`, `srcset`, `w`, `h`, which will be used to generate a slide with image.
   *
   * @param {Integer} index
   */
  getItemData(index) {
    const { dataSource } = this.options;
    let dataSourceItem;
    if (Array.isArray(dataSource)) {
      // Datasource is an array of elements
      dataSourceItem = dataSource[index];
    } else if (dataSource && dataSource.gallery) {
      // dataSource has gallery property,
      // thus it was created by Lightbox, based on
      // gallerySelecor and childSelector options

      // query DOM elements
      if (!dataSource.items) {
        dataSource.items = this._getGalleryDOMElements(dataSource.gallery);
      }

      dataSourceItem = dataSource.items[index];
    }

    let itemData = dataSourceItem;

    if (itemData instanceof Element) {
      itemData = this._domElementToItemData(itemData);
    }

    // allow to filter itemData
    const event = this.dispatch('itemData', {
      itemData: itemData || {},
      index
    });

    return event.itemData;
  }

  /**
   * Get array of gallery DOM elements,
   * based on childSelector and gallery element.
   *
   * @param {Element} galleryElement
   */
  _getGalleryDOMElements(galleryElement) {
    if (this.options.childSelector) {
      return galleryElement.querySelectorAll(this.options.childSelector) || [];
    }

    return [galleryElement];
  }

  /**
   * Converts DOM element to item data object.
   *
   * @param {Element} element DOM element
   */
  // eslint-disable-next-line class-methods-use-this
  _domElementToItemData(element) {
    const itemData = {
      element
    };

    const linkEl = element.tagName === 'A' ? element : element.querySelector('a');

    if (!linkEl) {
      return itemData;
    }

    // src comes from data-pswp-src attribute,
    // if it's empty link href is used
    itemData.src = linkEl.dataset.pswpSrc || linkEl.href;

    itemData.srcset = linkEl.dataset.pswpSrcset;

    itemData.w = parseInt(linkEl.dataset.pswpWidth, 10);
    itemData.h = parseInt(linkEl.dataset.pswpHeight, 10);

    const thumbnailEl = element.querySelector('img');

    if (thumbnailEl) {
      // define msrc only if it's the first slide,
      // as rendering (even small stretched thumbnail) is an expensive operation
      itemData.msrc = thumbnailEl.currentSrc || thumbnailEl.src;
      itemData.alt = thumbnailEl.getAttribute('alt');
    }

    if (linkEl.dataset.cropped) {
      itemData.thumbCropped = true;
    }

    return itemData;
  }
}

/**
 * Manages opening and closing transitions of the PhotoSwipe.
 *
 * It can perform zoom, fade or no transition.
 */

// some browsers do not paint
// elements which opacity is set to 0,
// since we need to pre-render elements for the animation -
// we set it to the minimum amount
const MIN_OPACITY = 0.003;

class Opener {
  constructor(pswp) {
    this.pswp = pswp;
    this.isClosed = true;
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
      return false;
    }

    this.isOpen = false;
    this.isOpening = false;
    this.isClosing = true;
    this._duration = this.pswp.options.hideAnimationDuration;

    this._applyStartProps();
    setTimeout(() => {
      this._start();
    }, this._croppedZoom ? 30 : 0);

    return true;
  }

  _prepareOpen() {
    this.pswp.off('firstZoomPan', this._prepareOpen);
    if (!this.isOpening) {
      this.isOpening = true;
      this.isClosing = false;
      this._duration = this.pswp.options.showAnimationDuration;
      this._applyStartProps();
    }
  }

  _applyStartProps() {
    const { pswp } = this;
    const slide = this.pswp.currSlide;
    const { options } = pswp;

    if (options.showHideAnimationType === 'fade') {
      options.showHideOpacity = true;
      this._thumbBounds = false;
    } else if (options.showHideAnimationType === 'none') {
      options.showHideOpacity = false;
      this._duration = 0;
      this._thumbBounds = false;
    } else if (this.isOpening && pswp._initialThumbBounds) {
      // Use initial bounds if defined
      this._thumbBounds = pswp._initialThumbBounds;
    } else {
      this._thumbBounds = this.pswp.getThumbBounds();
    }

    this._placeholder = slide.getPlaceholder();

    pswp.animations.stopAll();

    // Discard animations when duration is less than 50ms
    this._useAnimation = (this._duration > 50);
    this._animateZoom = Boolean(this._thumbBounds)
                        && slide.isZoomable()
                        && (!this.isClosing || !pswp.mainScroll.isShifted());
    if (!this._animateZoom) {
      this._animateRootOpacity = true;

      if (this.isOpening) {
        slide.zoomAndPanToInitial();
        slide.applyCurrentZoomPan();
      }
    } else {
      this._animateRootOpacity = options.showHideOpacity;
    }
    this._animateBgOpacity = !this._animateRootOpacity;
    this._opacityElement = this._animateRootOpacity ? pswp.template : pswp.bg;

    if (!this._useAnimation) {
      this._duration = 0;
      this._animateZoom = false;
      this._animateBgOpacity = false;
      this._animateRootOpacity = true;
      if (this.isOpening) {
        pswp.template.style.opacity = MIN_OPACITY;
        pswp.applyBgOpacity(1);
      }
      return;
    }

    if (this._animateZoom && this._thumbBounds.innerRect) {
      // Properties are used when animation from cropped thumbnail
      this._croppedZoom = true;
      this._cropContainer1 = this.pswp.container;
      this._cropContainer2 = this.pswp.currSlide.holderElement;

      pswp.container.style.overflow = 'hidden';
      pswp.container.style.width = pswp.viewportSize.x + 'px';
    } else {
      this._croppedZoom = false;
    }

    if (this.isOpening) {
      // Apply styles before opening transition
      if (this._animateBgOpacity) {
        pswp.bg.style.opacity = MIN_OPACITY;
        pswp.template.style.opacity = 1;
      }

      if (this._animateRootOpacity) {
        pswp.template.style.opacity = MIN_OPACITY;
        pswp.applyBgOpacity(1);
      }

      if (this._animateZoom) {
        this._setClosedStateZoomPan();
        if (this._placeholder) {
          // tell browser that we plan to animate the placeholder
          this._placeholder.willChange = 'transform';

          // hide placeholder to allow hiding of
          // elements that overlap it (such as icons over the thumbnail)
          this._placeholder.style.opacity = MIN_OPACITY;
        }
      }
    } else if (this.isClosing) {
      // hide nearby slides to make sure that
      // they are not painted during the transition
      pswp.mainScroll.itemHolders[0].el.style.display = 'none';
      pswp.mainScroll.itemHolders[2].el.style.display = 'none';

      if (this._croppedZoom) {
        if (pswp.mainScroll.x !== 0) {
          // shift the main scroller to zero position
          pswp.mainScroll.resetPosition();
          pswp.mainScroll.resize();
        }
      }
    }
  }

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
        decodeImage(this._placeholder).finally(() => {
          decoded = true;
          if (!isDelaying) {
            resolve();
          }
        });
        setTimeout(() => {
          isDelaying = false;
          if (decoded) {
            resolve();
          }
        }, 50);
        setTimeout(resolve, 250);
      }).finally(() => this._initiate());
    } else {
      this._initiate();
    }
  }

  _initiate() {
    this.pswp.template.style.setProperty('--pswp-transition-duration', this._duration + 'ms');

    this.pswp.dispatch('initialZoom' + (this.isOpening ? 'In' : 'Out'));
    this.pswp.template.classList[this.isOpening ? 'add' : 'remove']('pswp--ui-visible');

    if (this.isOpening) {
      // unhide the placeholder
      this._placeholder.style.opacity = 1;
      this._animateToOpenState();
    } else if (this.isClosing) {
      this._animateToClosedState();
    }

    if (!this._useAnimation) {
      this._onAnimationComplete();
    }
  }

  _onAnimationComplete() {
    const { pswp } = this;
    this.isOpen = this.isOpening;
    this.isClosed = this.isClosing;
    this.isOpening = false;
    this.isClosing = false;

    pswp.dispatch('initialZoom' + (this.isOpen ? 'InEnd' : 'OutEnd'));

    if (this.isClosed) {
      pswp.destroy();
    } else if (this.isOpen) {
      if (this._animateZoom) {
        pswp.container.style.overflow = 'visible';
        pswp.container.style.width = '100%';
      }
      pswp.currSlide.applyCurrentZoomPan();
    }
  }

  _animateToOpenState() {
    const { pswp } = this;
    if (this._animateZoom) {
      if (this._croppedZoom) {
        this._animateTo(this._cropContainer1, 'transform', 'translate3d(0,0,0)');
        this._animateTo(this._cropContainer2, 'transform', 'none');
      }

      pswp.currSlide.zoomAndPanToInitial();
      this._animateTo(
        pswp.currSlide.container,
        'transform',
        pswp.currSlide.getCurrentTransform()
      );
    }

    if (this._animateBgOpacity) {
      this._animateTo(pswp.bg, 'opacity', pswp.options.bgOpacity);
    }

    if (this._animateRootOpacity) {
      this._animateTo(pswp.template, 'opacity', 1);
    }
  }

  _animateToClosedState() {
    const { pswp } = this;

    if (this._animateZoom) {
      this._setClosedStateZoomPan(true);
    }

    if (this._animateBgOpacity
        && pswp.bgOpacity > 0.01) { // do not animate opacity if it's already at 0
      this._animateTo(pswp.bg, 'opacity', 0);
    }

    if (this._animateRootOpacity) {
      this._animateTo(pswp.template, 'opacity', 0);
    }
  }

  _setClosedStateZoomPan(animate) {
    const { pswp } = this;
    const { innerRect } = this._thumbBounds;
    const { currSlide, viewportSize } = pswp;

    if (this._croppedZoom) {
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

    equalizePoints(currSlide.pan, innerRect || this._thumbBounds);
    currSlide.currZoomLevel = this._thumbBounds.w / currSlide.width;

    if (animate) {
      this._animateTo(currSlide.container, 'transform', currSlide.getCurrentTransform());
    } else {
      currSlide.applyCurrentZoomPan();
    }
  }

  /**
   * @param {Element} target
   * @param {String} prop
   * @param {String} propValue
   */
  _animateTo(target, prop, propValue) {
    if (!this._duration) {
      target.style[prop] = propValue;
      return;
    }

    const { animations } = this.pswp;
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

const defaultOptions = {
  allowPanToNext: true,
  spacing: 0.1,
  loop: true,
  pinchToClose: true,
  closeOnVerticalDrag: true,
  hideAnimationDuration: 333,
  showAnimationDuration: 333,
  zoomAnimationDuration: 333,
  escKey: true,
  arrowKeys: true,
  returnFocus: true,

  clickToCloseNonZoomable: true,
  imageClickAction: 'zoom-or-close',
  bgClickAction: 'close',
  tapAction: 'toggle-controls',
  doubleTapAction: 'zoom',

  indexIndicatorSep: ' / ',

  panPaddingRatio: 0.15, // 15%

  bgOpacity: 0.8,

  index: 0,
  errorMsg: '<div class="pswp__error-msg"><a href="" target="_blank">The image</a> could not be loaded.</div>',
  preload: [1, 2],
  easing: 'cubic-bezier(.4,0,.22,1)',
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0
};

class PhotoSwipe extends PhotoSwipeBase {
  constructor(items, options) {
    super();

    this.items = items;

    this._prepareOptions(options);

    // offset of viewport relative to document
    this.offset = {};

    this._prevViewportSize = {};

    // Size of scrollable PhotoSwipe viewport
    this.viewportSize = {};

    // background (backdrop) opacity
    this.bgOpacity = 1;

    this.events = new DOMEvents();

    /** @type {Animations} */
    this.animations = new Animations();

    this.mainScroll = new MainScroll(this);
    this.gestures = new Gestures(this);
    this.opener = new Opener(this);
    this.keyboard = new Keyboard(this);
    this.lazyLoader = new LazyLoader(this);
  }

  init() {
    if (this.isOpen || this.isDestroying) {
      return;
    }

    this.isOpen = true;

    if (this.getNumItems() < 3) {
      // disable loop if less than 3 items,
      // as we do not clone slides
      this.options.loop = false;
    }

    this._initializePlugins();

    this._createMainStructure();

    // init modules
    // _modules.forEach(function (module) {
    //   module();
    // });

    // add classes to the root element of PhotoSwipe
    let rootClasses = 'pswp--open';
    if (this.gestures.supportsTouch) {
      rootClasses += ' pswp--touch';
    }
    if (!this.options.allowMouseDrag) {
      rootClasses += ' pswp--no-mouse-drag';
    }
    if (this.options.mainClass) {
      rootClasses += ' ' + this.options.mainClass;
    }
    this.template.className += ' ' + rootClasses;

    this.currIndex = this.options.index || 0;
    this.potentialIndex = this.currIndex;
    this.dispatch('firstUpdate'); // starting index can be modified here

    // initialize scroll wheel handler to block the scroll
    this.scrollWheel = new ScrollWheel(this);

    // sanitize index
    if (Number.isNaN(this.currIndex)
        || this.currIndex < 0
        || this.currIndex >= this.getNumItems()) {
      this.currIndex = 0;
    }

    this.currItemData = this.getItemData(this.currIndex);

    if (!this.gestures.supportsTouch) {
      // enable mouse features if no touch support detected
      this.mouseDetected();
    }

    // causes forced synchronous layout
    this.updateSize();

    this.offset.y = window.pageYOffset;

    this.dispatch('gettingData', this.currIndex, this.currItemData, true);

    // *Layout* - calculate size and position of elements here
    this._initialThumbBounds = this.getThumbBounds();
    this.dispatch('initialLayout');

    this.on('initialZoomInEnd', () => {
      // Add content to the previous and next slide
      this.setContent(this.mainScroll.itemHolders[0], this.currIndex - 1);
      this.setContent(this.mainScroll.itemHolders[2], this.currIndex + 1);

      this.mainScroll.itemHolders[0].el.style.display = 'block';
      this.mainScroll.itemHolders[2].el.style.display = 'block';

      this.appendHeavy();

      this.lazyLoader.update();

      this.events.add(window, 'resize', this._handlePageResize.bind(this));
      this.events.add(window, 'scroll', this._updatePageScrollOffset.bind(this));
      this.dispatch('bindEvents');
    });

    // set content for center slide (first time)
    this.setContent(this.mainScroll.itemHolders[1], this.currIndex);
    this.dispatch('change');

    this.opener.open();

    this.dispatch('afterInit');

    return true;
  }

  /**
   * Get looped slide index
   * (for example, -1 will return the last slide)
   *
   * @param {Integer} index
   */
  getLoopedIndex(index) {
    const numSlides = this.getNumItems();

    if (this.options.loop) {
      if (index > numSlides - 1) {
        index -= numSlides;
      }

      if (index < 0) {
        index += numSlides;
      }
    }

    index = clamp(index, 0, numSlides - 1);

    return index;
  }

  /**
   * Get the difference between current index and provided index.
   * Used to determine the direction of movement
   * or if slide should be moved at all.
   *
   * @param {Integer} index
   */
  getIndexDiff(index) {
    if (this.options.loop) {
      const lastItemIndex = this.getNumItems() - 1;
      // Moving from the last to the first or vice-versa:
      if (this.currIndex === 0 && index === lastItemIndex) {
        // go back one slide
        return -1;
      } if (this.currIndex === lastItemIndex && index === 0) {
        // go forward one slide
        return 1;
      }
    }

    return index - this.currIndex;
  }

  appendHeavy() {
    this.mainScroll.itemHolders.forEach((itemHolder) => {
      if (itemHolder.slide) {
        itemHolder.slide.appendHeavy();
      }
    });
  }

  /**
   * Change the slide
   * @param  {Integer} New index
   */
  goTo(index) {
    index = this.getLoopedIndex(index);

    // TODO: allow to pause the event propagation?

    const indexChanged = this.mainScroll.moveIndexBy(index - this.potentialIndex);
    if (indexChanged) {
      this.dispatch('afterGoto');
    }
  }

  /**
   * Go to the next slide.
   */
  next() {
    this.goTo(this.potentialIndex + 1);
  }

  /**
   * Go to the next slide.
   */
  prev() {
    this.goTo(this.potentialIndex - 1);
  }

  /**
   * @see slide/slide.js zoomTo
   */
  zoomTo(...args) {
    this.currSlide.zoomTo(...args);
  }

  /**
   * @see slide/slide.js toggleZoom
   */
  toggleZoom() {
    this.currSlide.toggleZoom();
  }

  /**
   * Close the gallery.
   * After closing transition ends - destroy it
   */
  close() {
    if (!this.opener.isOpen || this.isDestroying) {
      return;
    }

    this.isDestroying = true;

    this.dispatch('close');

    this.events.removeAll();
    this.opener.close();
  }

  /**
   * Destroys the gallery:
   * - unbinds events,
   * - cleans intervals and timeouts
   * - removes elements from DOM
   */
  destroy() {
    if (!this.isDestroying) {
      this.close();
      return;
    }

    this.dispatch('destroy');

    this.listeners = null;

    this.scrollWrap.ontouchmove = null;
    this.scrollWrap.ontouchend = null;

    this.template.remove();
    this.events.removeAll();
  }

  setContent(holder, index) {
    // destroy previous slide to clean the memory
    if (holder.slide) {
      holder.slide.destroy();
    }

    if (this.options.loop) {
      index = this.getLoopedIndex(index);
    } else if (index < 0 || index >= this.getNumItems()) {
      // empty holder
      holder.el.innerHTML = '';
      return;
    }

    const itemData = this.getItemData(index);

    holder.slide = new Slide(itemData, index, this);

    // set current slide
    if (index === this.currIndex) {
      this.currSlide = holder.slide;
    }

    holder.slide.append(holder.el);
  }

  getViewportCenterPoint() {
    return {
      x: this.viewportSize.x / 2,
      y: this.viewportSize.y / 2
    };
  }

  /**
   * Update size of all elements.
   * Executed on init and on page resize.
   *
   * @param  {Boolean} force Update size even if size of viewport was not changed.
   */
  updateSize(force) {
    // let item;
    // let itemIndex;

    if (this.isDestroying) {
      // exit if PhotoSwipe is closed or closing
      // (to avoid errors, as resize event might be delayed)
      return;
    }

    //const newWidth = this.scrollWrap.clientWidth;
    //const newHeight = this.scrollWrap.clientHeight;

    const newViewportSize = getViewportSize(this.options, this);

    if (!force && pointsEqual(newViewportSize, this._prevViewportSize)) {
      // Exit if dimensions were not changed
      return;
    }

    //this._prevViewportSize.x = newWidth;
    //this._prevViewportSize.y = newHeight;
    equalizePoints(this._prevViewportSize, newViewportSize);

    this.dispatch('beforeResize');

    equalizePoints(this.viewportSize, this._prevViewportSize);

    this._updatePageScrollOffset();

    this.dispatch('viewportSize');

    // Resize slides only after opener animation is finished
    // and don't re-calculate size on inital size update
    this.mainScroll.resize(this.opener.isOpen);

    if (!this.hasMouse && window.matchMedia('(any-hover: hover)').matches) {
      this.mouseDetected();
    }

    this.dispatch('resize');
  }

  applyBgOpacity(opacity) {
    this.bgOpacity = Math.max(opacity, 0);
    this.bg.style.opacity = this.bgOpacity * this.options.bgOpacity;
  }

  /**
   * Whether mouse is detected
   */
  mouseDetected() {
    if (!this.hasMouse) {
      this.hasMouse = true;
      this.template.classList.add('pswp--has_mouse');
    }
  }

  /**
   * Page resize event handler
   */
  _handlePageResize() {
    this.updateSize();

    // In iOS webview, if element size depends on document size,
    // it'll be measured incorrectly in resize event
    //
    // https://bugs.webkit.org/show_bug.cgi?id=170595
    // https://hackernoon.com/onresize-event-broken-in-mobile-safari-d8469027bf4d
    if (/iPhone|iPad|iPod/i.test(window.navigator.userAgent)) {
      setTimeout(() => {
        this.updateSize();
      }, 500);
    }
  }

  /**
   * Page scroll offset is used
   * to get correct coordinates
   * relative to PhotoSwipe viewport.
   */
  _updatePageScrollOffset() {
    this.setScrollOffset(0, window.pageYOffset);
  }

  setScrollOffset(x, y) {
    this.offset.x = x;
    this.offset.y = y;
    this.dispatch('updateScrollOffset');
  }

  /**
   * Create main HTML structure of PhotoSwipe,
   * and add it to DOM
   */
  _createMainStructure() {
    // root DOM element of PhotoSwipe (.pswp)
    this.template = createElement('pswp');
    this.template.setAttribute('tabindex', -1);
    this.template.setAttribute('role', 'dialog');

    // Background is added as a separate element,
    // as animating opacity is faster than animating rgba()
    this.bg = createElement('pswp__bg', false, this.template);
    this.scrollWrap = createElement('pswp__scroll-wrap', false, this.template);
    this.container = createElement('pswp__container', false, this.scrollWrap);

    this.mainScroll.appendHolders();

    this.ui = new UI(this);
    this.ui.init();

    // append to DOM
    (this.options.appendToEl || document.body).appendChild(this.template);
  }


  /**
   * Get position and dimensions of small thumbnail
   *   {x:,y:,w:}
   *
   * Height is optional (calculated based on the large image)
   */
  getThumbBounds() {
    return getThumbBounds(this.currIndex, this.currItemData, this);
  }

  _initializePlugins() {
    this.plugins = {};

    // pluginClasses should be defined by the lightbox module
    if (this.pluginClasses) {
      Object.keys(this.pluginClasses).forEach((name) => {
        const PluginClass = this.pluginClasses[name];
        if (typeof PluginClass === 'function') {
          this.plugins[name] = new PluginClass(this);
        }
      });
    }
  }

  _prepareOptions(options) {
    if (window.matchMedia('(prefers-reduced-motion), (update: slow)').matches) {
      options.showHideAnimationType = 'none';
      options.zoomAnimationDuration = 0;
    }

    this.options = {
      ...defaultOptions,
      ...options
    };
  }
}

export default PhotoSwipe;
//# sourceMappingURL=photoswipe.esm.js.map
