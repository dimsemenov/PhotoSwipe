/**
 * Calculates minimum, maximum and initial (center) bounds of a slide
 */
import {
  clamp
} from '../util/util.js';
import { parsePaddingOption } from '../util/viewport-size.js';

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
    const { pswp } = this.slide;
    const elSize = this.slide[axis === 'x' ? 'width' : 'height'] * this.currZoomLevel;
    const paddingProp = axis === 'x' ? 'left' : 'top';
    const padding = parsePaddingOption(paddingProp, pswp.options, pswp.viewportSize);

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

export default PanBounds;
