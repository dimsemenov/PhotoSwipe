import { createElement, LOAD_STATE, setWidthHeight } from '../../util/util.js';

class Content {
  /**
   * @param {Object} itemData Slide data
   * @param {PhotoSwipeBase} instance PhotoSwipe or PhotoSwipeLightbox instance
   * @param {Slide|undefined} slide Slide that requested the image,
   *                                can be undefined if image was requested by something else
   *                                (for example by lazy-loader)
   */
  constructor(itemData, instance, slide) {
    this.options = instance.options;
    this.instance = instance;
    this.data = itemData;

    if (slide) {
      this.slide = slide;
      this.pswp = slide.pswp;
    }

    this.width = Number(this.data.w) || Number(this.data.width) || 0;
    this.height = Number(this.data.h) || Number(this.data.height) || 0;

    this.state = LOAD_STATE.IDLE;
  }

  /**
   * Load the content
   *
   * @param {Boolean} isLazy If method is executed by lazy-loader
   */
  load(/* isLazy */) {
    if (!this.element) {
      this.element = createElement('pswp__content');
      this.element.style.position = 'absolute';
      this.element.style.left = 0;
      this.element.style.top = 0;
      this.element.innerHTML = this.data.html || '';
    }
  }

  isZoomable() {
    return false;
  }

  usePlaceholder() {
    return false;
  }

  activate() {

  }

  deactivate() {

  }

  setDisplayedSize(width, height) {
    if (this.element) {
      setWidthHeight(this.element, width, height);
    }
  }

  onLoaded() {
    this.state = LOAD_STATE.LOADED;

    if (this.slide) {
      this.pswp.dispatch('loadComplete', { slide: this.slide });
    }
  }

  // If the placeholder should be kept in DOM
  keepPlaceholder() {
    return (this.state === LOAD_STATE.LOADING);
  }

  onError() {
    this.state = LOAD_STATE.ERROR;

    if (this.slide) {
      this.pswp.dispatch('loadComplete', { slide: this.slide, isError: true });
      this.pswp.dispatch('loadError', { slide: this.slide });
    }
  }

  getErrorElement() {
    return false;
  }

  appendTo(container) {
    if (this.element && !this.element.parentNode) {
      container.appendChild(this.element);
    }
  }

  destroy() {

  }
}

export default Content;
