import { clamp } from '../util/util.js';
import { parsePaddingOption } from '../util/viewport-size.js';

/** @typedef {import('./slide.js').default} Slide */
/** @typedef {Record<Axis, number>} Point */
/** @typedef {'x' | 'y'} Axis */

/** @type {Point} */
const defaultPoint = { x: 0, y: 0 };

/**
 * Calculates minimum, maximum and initial (center) bounds of a slide
 */
class PanBounds {
  /**
   * @param {Slide} slide
   */
  constructor(slide) {
    this.slide = slide;
    this.currZoomLevel = 1;
    this.center = /** @type {Point} */ ({ ...defaultPoint });
    this.max = /** @type {Point} */ ({ ...defaultPoint });
    this.min = /** @type {Point} */ ({ ...defaultPoint });
  }

  /**
   * _getItemBounds
   *
   * @param {number} currZoomLevel
   */
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

  /**
   * _calculateItemBoundsForAxis
   *
   * @param {Axis} axis
   */
  _updateAxis(axis) {
    const { pswp } = this.slide;
    const elSize = this.slide[axis === 'x' ? 'width' : 'height'] * this.currZoomLevel;
    const paddingProp = axis === 'x' ? 'left' : 'top';
    const padding = parsePaddingOption(
      paddingProp,
      pswp.options,
      pswp.viewportSize,
      this.slide.data,
      this.slide.index
    );

    const panAreaSize = this.slide.panAreaSize[axis];

    // Default position of element.
    // By default, it is center of viewport:
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
    this.center = { ...defaultPoint };
    this.max = { ...defaultPoint };
    this.min = { ...defaultPoint };
  }

  /**
   * Correct pan position if it's beyond the bounds
   *
   * @param {Axis} axis x or y
   * @param {number} panOffset
   * @returns {number}
   */
  correctPan(axis, panOffset) { // checkPanBounds
    return clamp(panOffset, this.max[axis], this.min[axis]);
  }
}

export default PanBounds;
