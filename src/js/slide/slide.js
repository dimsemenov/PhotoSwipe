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


class Slide {
  constructor(data, index, pswp) {
    this.data = data;
    this.index = index;
    this.pswp = pswp;
    this.isActive = (index === pswp.currIndex);
    this.currentResolution = 0;
    this.panAreaSize = {};

    this.isFirstSlide = (this.isActive && !pswp.opener.isOpen);

    this.zoomLevels = new ZoomLevel(pswp.options, data, index, pswp);

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
    this.width = Number(data.w) || 0;
    this.height = Number(data.h) || 0;
    this.bounds = new PanBounds(this);

    this.prevWidth = -1;
    this.prevHeight = -1;
    this.prevScaleMultiplier = -1;

    this.pswp.dispatch('slideInit', { slide: this });
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

    this.calculateSize();

    this.container = createElement('pswp__zoom-wrap');
    this.container.transformOrigin = '0 0';

    this.appendContent();
    this.appendHeavy();
    this.updateContentSize();

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
   * Append content to this.container
   */
  appendContent() {
    this.setSlideHTML(this.data.html);
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

    this.appendHeavyContent();
  }

  appendHeavyContent() {
    this.pswp.dispatch('appendHeavyContent', { slide: this });
  }

  /**
   * Append HTML content to slide container
   * (usually item.html or error message)
   *
   * @param {DOMElement} containerEl
   * @param {String} html
   */
  setSlideHTML(html) {
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
    this.calculateSize();

    // Reset position and scale to original state on resize
    this.currentResolution = 0;
    this.updateContentSize();
    this.zoomAndPanToInitial();
    this.applyCurrentZoomPan();
  }


  /**
   * Apply size to current slide images
   * based on the current resolution.
   * @returns Boolean true if size was changed
   */
  updateContentSize() {
    return true;
  }

  getPlaceholder() {
    return false;
  }

  /**
   * Zoom current slide image to...
   *
   * @param  {Number} destZoomLevel      Destination zoom level.
   * @param  {Object|false} centerPoint  Transform origin center point,
   *                                     or false if viewport center should be used.
   * @param  {Number} transitionDuration Transition duration, may be set to 0.
   * @param  {Boolean|null} ignoreBounds Minimum and maximum zoom levels will be ignored.
   * @return {Boolean|null}              Returns true if animated.
   */
  zoomTo(destZoomLevel, centerPoint, transitionDuration, ignoreBounds) {
    const { pswp } = this;
    if (!this.isZoomable()
        || pswp.mainScroll.isShifted()) {
      return;
    }

    pswp.dispatch('beforeZoomTo', {
      destZoomLevel, centerPoint, transitionDuration
    });

    // stop all pan and zoom transitions
    pswp.animations.stopAllPan();

    // if (!centerPoint) {
    //   centerPoint = pswp.getViewportCenterPoint();
    // }

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
   * @param {Object|null} centerPoint point based on which zoom is performed,
   *                                  usually refers to the current mouse position,
   *                                  if false - viewport center will be used.
   * @param {Number|null} prevZoomLevel Zoom level before new zoom was applied.
   */
  calculateZoomToPanOffset(axis, point, prevZoomLevel) {
    const totalPanDistance = this.bounds.max[axis] - this.bounds.min[axis];
    if (totalPanDistance === 0) {
      return this.bounds.center[axis];
    }

    if (!point) {
      point = this.pswp.getViewportCenterPoint();
    }

    const zoomFactor = this.currZoomLevel / prevZoomLevel;
    return this.bounds.correctPan(
      axis,
      (this.pan[axis] - point[axis]) * zoomFactor + point[axis]
    );
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
    return false;
  }

  /**
   * Whether the slide can be zoomed
   */
  isZoomable() {
    return false;
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

  calculateSize() {
    // this.zoomLevels.fit = 1;
    // this.zoomLevels.vFill = 1;
    // this.zoomLevels.initial = 1;

    const { pswp } = this;

    equalizePoints(
      this.panAreaSize,
      getPanAreaSize(pswp.options, pswp.viewportSize, pswp)
    );

    this.zoomLevels.update(this.width, this.height, this.panAreaSize);

    pswp.dispatch('calcSlideSize', {
      slide: this
    });
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
    this.updateContentSize();

    this.pswp.dispatch('resolutionChanged');
  }
}

export default Slide;
