import CSSAnimation from './css-animation.js';
import SpringAnimation from './spring-animation.js';

/** @typedef {import('./css-animation.js').CssAnimationProps} CssAnimationProps */
/** @typedef {import('./spring-animation.js').SpringAnimationProps} SpringAnimationProps */

/** @typedef {Object} SharedAnimationProps
 * @prop {string} [name]
 * @prop {boolean} [isPan]
 * @prop {boolean} [isMainScroll]
 * @prop {VoidFunction} [onComplete]
 * @prop {VoidFunction} [onFinish]
 */

/** @typedef {SpringAnimation | CSSAnimation} Animation */
/** @typedef {SpringAnimationProps | CssAnimationProps} AnimationProps */

/**
 * Manages animations
 */
class Animations {
  constructor() {
    /** @type {Animation[]} */
    this.activeAnimations = [];
  }

  /**
   * @param {SpringAnimationProps} props
   */
  startSpring(props) {
    this._start(props, true);
  }

  /**
   * @param {CssAnimationProps} props
   */
  startTransition(props) {
    this._start(props);
  }

  /**
   * @private
   * @param {AnimationProps} props
   * @param {boolean} [isSpring]
   * @returns {Animation}
   */
  _start(props, isSpring) {
    const animation = isSpring
      ? new SpringAnimation(/** @type SpringAnimationProps */ (props))
      : new CSSAnimation(/** @type CssAnimationProps */ (props));

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
