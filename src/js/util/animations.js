import CSSAnimation from './css-animation.js';
import SpringAnimation from './spring-animation.js';

/** @typedef {SpringAnimation | CSSAnimation} Animation */

/**
 * @typedef {Object} AnimationProps
 *
 * @prop {HTMLElement=} target
 *
 * @prop {string=} name
 *
 * @prop {number=} start
 * @prop {number=} end
 * @prop {number=} duration
 * @prop {number=} velocity
 * @prop {number=} dampingRatio
 * @prop {number=} naturalFrequency
 *
 * @prop {(end: number) => void} [onUpdate]
 * @prop {() => void} [onComplete]
 * @prop {() => void} [onFinish]
 *
 * @prop {string=} transform
 * @prop {string=} opacity
 * @prop {string=} easing
 *
 * @prop {boolean=} isPan
 * @prop {boolean=} isMainScroll
 */

/**
 * Manages animations
 */
class Animations {
  constructor() {
    /** @type {Animation[]} */
    this.activeAnimations = [];
  }

  /**
   * @param {AnimationProps} props
   */
  startSpring(props) {
    this._start(props, true);
  }

  /**
   * @param {AnimationProps} props
   */
  startTransition(props) {
    this._start(props);
  }

  /**
   * @param {AnimationProps} props
   * @param {boolean=} isSpring
   */
  _start(props, isSpring) {
    /** @type {Animation} */
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

  /**
   * @param {Animation} animation
   */
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

export default Animations;
