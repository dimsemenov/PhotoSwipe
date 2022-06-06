import {
  equalizePoints, roundPoint, clamp
} from '../util/util.js';

/** @typedef {import('../photoswipe.js').Point} Point */
/** @typedef {import('./gestures.js').default} Gestures */

const PAN_END_FRICTION = 0.35;
const VERTICAL_DRAG_FRICTION = 0.6;

// 1 corresponds to the third of viewport height
const MIN_RATIO_TO_CLOSE = 0.4;

// Minimum speed required to navigate
// to next or previous slide
const MIN_NEXT_SLIDE_SPEED = 0.5;

/**
 * @param {number} initialVelocity
 * @param {number} decelerationRate
 */
function project(initialVelocity, decelerationRate) {
  return initialVelocity * decelerationRate / (1 - decelerationRate);
}

/**
 * Handles single pointer dragging
 */
class DragHandler {
  /**
   * @param {Gestures} gestures
   */
  constructor(gestures) {
    this.gestures = gestures;
    this.pswp = gestures.pswp;
    /** @type {Point} */
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
        && currSlide.currZoomLevel <= currSlide.zoomLevels.fit
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
      this.gestures.zoomLevels.correctZoomPan(true);
    } else {
      // we run two animations instead of one,
      // as each axis has own pan boundaries and thus different spring function
      // (correctZoomPan does not have this functionality,
      //  it animates all properties with single timing function)
      this._finishPanGestureForAxis('x');
      this._finishPanGestureForAxis('y');
    }
  }

  /**
   * @private
   * @param {'x' | 'y'} axis
   */
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

        pan[axis] = Math.floor(pos);
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
   * @private
   * @param {'x' | 'y'} axis
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
   * @private
   * @param {number} panY The current pan Y position.
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
   * @private
   * @param {'x' | 'y'} axis
   * @param {number} potentialPan
   * @param {number=} customFriction (0.1 - 1)
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

export default DragHandler;
