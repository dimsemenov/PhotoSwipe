import { createElement, setWidthHeight, toTransformString } from '../util/util.js';

class Placeholder {
  /**
   * @param {String|false} imageSrc
   * @param {Element} container
   */
  constructor(imageSrc, container) {
    // Create placeholder
    // (stretched thumbnail or simple div behind the main image)
    this.element = createElement(
      'pswp__img pswp__img--placeholder',
      imageSrc ? 'img' : '',
      container
    );

    if (imageSrc) {
      this.element.decoding = 'async';
      this.element.alt = '';
      this.element.src = imageSrc;
      this.element.setAttribute('role', 'presentation');
    }

    this.element.setAttribute('aria-hiden', 'true');
  }

  setDisplayedSize(width, height) {
    if (!this.element) {
      return;
    }

    if (this.element.tagName === 'IMG') {
      // Use transform scale() to modify img placeholder size
      // (instead of changing width/height directly).
      // This helps with performance, specifically in iOS15 Safari.
      setWidthHeight(this.element, 250, 'auto');
      this.element.style.transformOrigin = '0 0';
      this.element.style.transform = toTransformString(0, 0, width / 250);
    } else {
      setWidthHeight(this.element, width, height);
    }
  }

  destroy() {
    if (this.element.parentNode) {
      this.element.remove();
    }
    this.element = null;
  }
}

export default Placeholder;
