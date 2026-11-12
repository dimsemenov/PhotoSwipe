import { createElement, setWidthHeight, toTransformString } from '../util/util.js';

class Placeholder {
  /**
   * @param {string | false} imageSrc
   * @param {HTMLElement} container
   */
  constructor(imageSrc, container) {
    // Create placeholder
    // (stretched thumbnail or simple div behind the main image)
    /** @type {HTMLImageElement | HTMLDivElement | null} */
    this.element = createElement(
      'pswp__img pswp__img--placeholder',
      imageSrc ? 'img' : 'div',
      container
    );

    if (imageSrc) {
      const imgEl = /** @type {HTMLImageElement} */ (this.element);
      imgEl.decoding = 'async';
      imgEl.alt = '';
      imgEl.src = imageSrc;
      imgEl.setAttribute('role', 'presentation');
    }

    this.element.setAttribute('aria-hidden', 'true');
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  setDisplayedSize(width, height) {
    if (!this.element) {
      return;
    }

    if (this.element.tagName === 'IMG') {
      // Use transform scale() to modify img placeholder size
      // (instead of changing width/height directly).
      // This helps with performance, specifically in iOS15 Safari.
      //
      // Height must follow the *target* image box, not the thumbnail's
      // intrinsic ratio. Cropped thumbs (e.g. 4:3) with a differently
      // shaped full image (e.g. 3:2) used to be scaled by width only,
      // so the placeholder overhung the slide and flickered on open.
      const baseWidth = 250;
      const baseHeight = width ? (baseWidth * height / width) : baseWidth;
      setWidthHeight(this.element, baseWidth, baseHeight);
      this.element.style.transformOrigin = '0 0';
      this.element.style.transform = toTransformString(0, 0, width / baseWidth);
    } else {
      setWidthHeight(this.element, width, height);
    }
  }

  destroy() {
    if (this.element?.parentNode) {
      this.element.remove();
    }
    this.element = null;
  }
}

export default Placeholder;
