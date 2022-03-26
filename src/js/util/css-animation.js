/**
 * Runs CSS transition.
 */

import { setTransitionStyle, removeTransitionStyle } from './util.js';

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

export default CSSAnimation;
