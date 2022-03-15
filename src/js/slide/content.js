import { createElement, LOAD_STATE, setWidthHeight } from '../util/util.js';

class Content {
  /**
   * @param {Object} itemData Slide data
   * @param {PhotoSwipeBase} instance PhotoSwipe or PhotoSwipeLightbox instance
   * @param {Slide|undefined} slide Slide that requested the image,
   *                                can be undefined if image was requested by something else
   *                                (for example by lazy-loader)
   */
  constructor(itemData, instance) {
    this.options = instance.options;
    this.instance = instance;
    this.data = itemData;

    this.width = Number(this.data.w) || Number(this.data.width) || 0;
    this.height = Number(this.data.h) || Number(this.data.height) || 0;

    this.isAttached = false;
    this.hasSlide = false;
    this.state = LOAD_STATE.IDLE;

    this.instance.dispatch('contentInit', { content: this });
  }

  /**
   * Preload content
   *
   * @param {Boolean} isLazy
   */
  load(isLazy) {
    if (this.element) {
      return;
    }

    if (this.instance.dispatch('contentLoad', { content: this, isLazy }).defaultPrevented) {
      return;
    }

    if (this.isImageContent()) {
      this.loadImage(isLazy);
    } else {
      this.element = createElement('pswp__content');
      this.element.style.position = 'absolute';
      this.element.style.left = 0;
      this.element.style.top = 0;
      this.element.innerHTML = this.data.html || '';
    }
  }

  /**
   * Preload image
   *
   * @param {Boolean} isLazy
   */
  loadImage(isLazy) {
    this.element = createElement('pswp__img', 'img');

    if (this.instance.dispatch('contentLoadImage', { content: this, isLazy }).defaultPrevented) {
      return;
    }

    if (this.data.srcset) {
      this.element.srcset = this.data.srcset;
    }

    this.element.src = this.data.src;

    this.element.alt = this.data.alt || '';

    this.state = LOAD_STATE.LOADING;

    if (this.element.complete) {
      this.onLoaded();
    } else {
      this.element.onload = () => {
        this.onLoaded();
      };

      this.element.onerror = () => {
        this.onError();
      };
    }
  }

  /**
   * Assign slide to content
   *
   * @param {Slide} slide
   */
  setSlide(slide) {
    this.slide = slide;
    this.hasSlide = true;
    this.instance = slide.pswp;
  }

  /**
   * Content load success handler
   */
  onLoaded() {
    this.state = LOAD_STATE.LOADED;

    if (this.slide) {
      this.instance.dispatch('loadComplete', { slide: this.slide, content: this });
    }
  }

  /**
   * Content load error handler
   */
  onError() {
    this.state = LOAD_STATE.ERROR;

    if (this.slide) {
      this.instance.dispatch('loadComplete', { slide: this.slide, isError: true, content: this });
      this.instance.dispatch('loadError', { slide: this.slide, content: this });
    }
  }

  /**
   * @returns {Boolean} If the content is currently loading
   */
  isLoading() {
    return this.instance.applyFilters(
      'isContentLoading',
      this.state === LOAD_STATE.LOADING,
      this
    );
  }

  /**
   * @returns {Boolean} If the content is image
   */
  isImageContent() {
    return this.instance.applyFilters(
      'isImageContent',
      (!this.data.type && this.data.src) || this.data.type === 'image',
      this
    );
  }

  /**
   * Update content size
   *
   * @param {Number} width
   * @param {Number} height
   */
  setDisplayedSize(width, height) {
    if (!this.element) {
      return;
    }

    if (this.instance.dispatch('contentResize', { content: this, width, height }).defaultPrevented) {
      return;
    }

    setWidthHeight(this.element, width, height);

    if (this.isImageContent()) {
      const image = this.element;
      // Handle srcset sizes attribute.
      //
      // Never lower quality, if it was increased previously.
      // Chrome does this automatically, Firefox and Safari do not,
      // so we store largest used size in dataset.
      if (image.srcset
          && (!image.dataset.largestUsedSize || width > image.dataset.largestUsedSize)) {
        image.sizes = width + 'px';
        image.dataset.largestUsedSize = width;
      }

      if (this.slide) {
        this.instance.dispatch('imageSizeChange', { slide: this.slide, width, height, content: this });
      }
    }
  }

  /**
   * @returns {Boolean} If the content can be zoomed
   */
  isZoomable() {
    return this.instance.applyFilters(
      'isContentZoomable',
      this.isImageContent() && (this.state !== LOAD_STATE.ERROR),
      this
    );
  }

  /**
   * @returns {Boolean} If content should use a placeholder (from msrc by default)
   */
  usePlaceholder() {
    return this.instance.applyFilters(
      'useContentPlaceholder',
      this.isImageContent(),
      this
    );
  }

  /**
   * Preload content with lazy-loading param
   *
   * @param {Boolean} isLazy
   */
  lazyLoad() {
    if (this.instance.dispatch('contentLazyLoad', { content: this }).defaultPrevented) {
      return;
    }

    this.load(true);
  }

  /**
   * @returns {Boolean} If placeholder should be kept after content is loaded
   */
  keepPlaceholder() {
    return this.instance.applyFilters(
      'isKeepingPlaceholder',
      this.isLoading(),
      this
    );
  }

  /**
   * Destroy the content
   */
  destroy() {
    this.hasSlide = false;

    if (this.instance.dispatch('contentDestroy', { content: this }).defaultPrevented) {
      return;
    }

    if (this.isImageContent() && this.element) {
      this.element.onload = null;
      this.element.onerror = null;
      this.element = null;
    }
  }

  /**
   * Append the content to container
   *
   * @param {Element} container
   */
  appendTo(container) {
    this.isAttached = true;

    if (this.instance.dispatch('contentAppend', { content: this, container }).defaultPrevented) {
      return;
    }

    if (this.isImageContent()) {
      // Use decode() on nearby slides
      //
      // Nearby slide images are in DOM and not hidden via display:none.
      // However, they are placed offscreen (to the left and right side).
      //
      // Some browsers do not composite the image until it's actually visible,
      // using decode() helps.
      //
      // You might ask "why dont you just decode() and then append all images",
      // that's because I want to show image before it's fully loaded,
      // as browser can render parts of image while it is loading.
      if (this.slide
          && !this.slide.isActive
          && ('decode' in this.element)) {
        this.isDecoding = true;
        // Make sure that we start decoding on the next frame
        requestAnimationFrame(() => {
          if (this.element) {
            this.element.decode().then(() => {
              this.isDecoding = false;
              requestAnimationFrame(() => {
                this.appendImageTo(container);
              });
            }).catch(() => {});
          }
        });
      } else {
        this.appendImageTo(container);
      }
    } else if (this.element && !this.element.parentNode) {
      container.appendChild(this.element);
    }
  }

  /**
   * Activate the slide,
   * active slide is generally the current one,
   * meaning the user can see it.
   *
   * @param {Element} container
   */
  activate() {
    if (this.instance.dispatch('contentActivate', { content: this }).defaultPrevented) {
      return;
    }

    if (this.isImageContent() && this.slide && this.slide.container && this.isDecoding) {
      // add image to slide when it becomes active,
      // even if it's not finished decoding
      this.appendImageTo(this.slide.container);
    }
  }

  /**
   * Deactivate the content
   */
  deactivate() {
    this.instance.dispatch('contentDeactivate', { content: this });
  }


  /**
   * Remove the content from DOM
   */
  remove() {
    this.isAttached = false;

    if (this.instance.dispatch('contentRemove', { content: this }).defaultPrevented) {
      return;
    }

    if (this.element && this.element.parentNode) {
      this.element.remove();
    }
  }

  /**
   * Get HTML Element that should display an error message
   * (if content is loaded with an error)
   *
   * @returns {Element}
   */
  getErrorElement() {
    let errorElement;
    if (this.isImageContent()) {
      errorElement = createElement('pswp__error-msg-container');
      errorElement.innerHTML = this.options.errorMsg;
      const linkEl = errorElement.querySelector('a');
      if (linkEl) {
        linkEl.href = this.data.src;
      }
    }

    return this.instance.applyFilters(
      'contentErrorElement',
      errorElement,
      this
    );
  }

  /**
   * Append the content image to container
   *
   * @param {Element} container
   */
  appendImageTo(container) {
    // ensure that element exists and is not already appended
    if (this.element && !this.element.parentNode && this.isAttached) {
      container.appendChild(this.element);
    }
  }
}

export default Content;
