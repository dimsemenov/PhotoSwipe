import SpringEaser from './spring-easer.js';

/** @typedef {import("./animations").AnimationProps} AnimationProps */

class SpringAnimation {
  /**
   * @param {AnimationProps} props
   */
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
          // @ts-expect-error defined from the outside, maybe it should be defined more explicit?
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

export default SpringAnimation;
