import { setTransitionStyle, removeTransitionStyle } from './util.js';

const DEFAULT_EASING = 'cubic-bezier(.4,0,.22,1)';

/** @typedef {import('./animations.js').AnimationProps} AnimationProps */

/**
 * Runs CSS transition.
 */
class CSSAnimation {
  /**
   * onComplete can be unpredictable, be careful about current state
   *
   * @param {AnimationProps} props
   */
  constructor(props) {
    this.props = props;
    const {
      target,
      onComplete,
      transform,
      onFinish
      // opacity
    } = props;

    let {
      duration,
      easing,
    } = props;

    /** @type {() => void} */
    this.onFinish = onFinish;

    // support only transform and opacity
    const prop = transform ? 'transform' : 'opacity';
    const propValue = props[prop];

    /** @private */
    this._target = target;
    /** @private */
    this._onComplete = onComplete;

    duration = duration || 333;
    easing = easing || DEFAULT_EASING;

    /** @private */
    this._onTransitionEnd = this._onTransitionEnd.bind(this);

    // Using timeout hack to make sure that animation
    // starts even if the animated property was changed recently,
    // otherwise transitionend might not fire or transiton won't start.
    // https://drafts.csswg.org/css-transitions/#starting
    //
    // ¯\_(ツ)_/¯
    /** @private */
    this._helperTimeout = setTimeout(() => {
      setTransitionStyle(target, prop, duration, easing);
      this._helperTimeout = setTimeout(() => {
        target.addEventListener('transitionend', this._onTransitionEnd, false);
        target.addEventListener('transitioncancel', this._onTransitionEnd, false);

        // Safari occasionally does not emit transitionend event
        // if element propery was modified during the transition,
        // which may be caused by resize or third party component,
        // using timeout as a safety fallback
        this._helperTimeout = setTimeout(() => {
          this._finalizeAnimation();
        }, duration + 500);
        target.style[prop] = propValue;
      }, 30); // Do not reduce this number
    }, 0);
  }

  /**
   * @private
   * @param {TransitionEvent} e
   */
  _onTransitionEnd(e) {
    if (e.target === this._target) {
      this._finalizeAnimation();
    }
  }

  /**
   * @private
   */
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
    if (this._helperTimeout) {
      clearTimeout(this._helperTimeout);
    }
    removeTransitionStyle(this._target);
    this._target.removeEventListener('transitionend', this._onTransitionEnd, false);
    this._target.removeEventListener('transitioncancel', this._onTransitionEnd, false);
    if (!this._finished) {
      this._finalizeAnimation();
    }
  }
}

export default CSSAnimation;
