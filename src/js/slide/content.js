import { createElement, LOAD_STATE, setWidthHeight } from '../util/util.js';
import Placeholder from './placeholder.js';

class Content {
  /**
   * @param {Object} itemData Slide data
   * @param {PhotoSwipeBase} instance PhotoSwipe or PhotoSwipeLightbox instance
   * @param {Slide|undefined} slide Slide that requested the image,
   *                                can be undefined if image was requested by something else
   *                                (for example by lazy-loader)
   */
  constructor(itemData, instance, index) {
    this.instance = instance;
    this.data = itemData;
    this.index = index;

    this.width = Number(this.data.w) || Number(this.data.width) || 0;
    this.height = Number(this.data.h) || Number(this.data.height) || 0;

    this.isAttached = false;
    this.hasSlide = false;
    this.state = LOAD_STATE.IDLE;

    if (this.data.type) {
      this.type = this.data.type;
    } else if (this.data.src) {
      this.type = 'image';
    } else {
      this.type = 'html';
    }

    this.instance.dispatch('contentInit', { content: this });
  }

  removePlaceholder() {
    if (this.placeholder && !this.keepPlaceholder()) {
      // With delay, as image might be loaded, but not rendered
      setTimeout(() => {
        if (this.placeholder) {
          this.placeholder.destroy();
          this.placeholder = null;
        }
      }, 500);
    }
  }

  /**
   * Preload content
   *
   * @param {Boolean} isLazy
   */
  load(isLazy, reload) {
    if (!this.placeholder && this.slide && this.usePlaceholder()) {
      // use   -based placeholder only for the first slide,
      // as rendering (even small stretched thumbnail) is an expensive operation
      const placeholderSrc = this.instance.applyFilters(
        'placeholderSrc',
        (this.data.msrc && this.slide.isFirstSlide) ? this.data.msrc : false,
        this
      );
      this.placeholder = new Placeholder(
        placeholderSrc,
        this.slide.container
      );
    }

    if (this.element && !reload) {
      return;
    }

    if (this.instance.dispatch('contentLoad', { content: this, isLazy }).defaultPrevented) {
      return;
    }

    if (this.isImageContent()) {
      this.loadImage(isLazy);
    } else {
      this.element = createElement('pswp__content');
      this.element.innerHTML = this.data.html || '';
    }

    if (reload && this.slide) {
      this.slide.updateContentSize(true);
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

    // todo: do we need to unset slide?
  }

  /**
   * Content load success handler
   */
  onLoaded() {
    this.state = LOAD_STATE.LOADED;

    if (this.slide) {
      this.instance.dispatch('loadComplete', { slide: this.slide, content: this });

      // if content is reloaded
      if (this.slide.isActive
          && this.slide.heavyAppended
          && !this.element.parentNode) {
        this.slide.container.innerHTML = '';
        this.append();
        this.slide.updateContentSize(true);
      }
    }
  }

  /**
   * Content load error handler
   */
  onError() {
    this.state = LOAD_STATE.ERROR;

    if (this.slide) {
      this.displayError();
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

  isError() {
    return this.state === LOAD_STATE.ERROR;
  }

  /**
   * @returns {Boolean} If the content is image
   */
  isImageContent() {
    return this.type === 'image';
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

    if (this.placeholder) {
      this.placeholder.setDisplayedSize(width, height);
    }

    if (this.instance.dispatch('contentResize', { content: this, width, height }).defaultPrevented) {
      return;
    }

    setWidthHeight(this.element, width, height);

    if (this.isImageContent() && !this.isError()) {
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
    this.slide = null;

    if (this.instance.dispatch('contentDestroy', { content: this }).defaultPrevented) {
      return;
    }

    this.remove();

    if (this.isImageContent() && this.element) {
      this.element.onload = null;
      this.element.onerror = null;
      this.element = null;
    }
  }

  /**
   * Display error message
   */
  displayError() {
    if (this.slide) {
      let errorMsgEl = createElement('pswp__error-msg');
      errorMsgEl.innerText = this.instance.options.errorMsg;
      errorMsgEl = this.instance.applyFilters(
        'contentErrorElement',
        errorMsgEl,
        this
      );
      this.element = createElement('pswp__content pswp__error-msg-container');
      this.element.appendChild(errorMsgEl);
      this.slide.container.innerHTML = '';
      this.slide.container.appendChild(this.element);
      this.slide.updateContentSize(true);
      this.removePlaceholder();
    }
  }

  /**
   * Append the content
   */
  append() {
    this.isAttached = true;

    if (this.state === LOAD_STATE.ERROR) {
      this.displayError();
      return;
    }

    if (this.instance.dispatch('contentAppend', { content: this }).defaultPrevented) {
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
          // element might change
          if (this.element && this.element.tagName === 'IMG') {
            this.element.decode().then(() => {
              this.isDecoding = false;
              requestAnimationFrame(() => {
                this.appendImage();
              });
            }).catch(() => {
              this.isDecoding = false;
            });
          }
        });
      } else {
        if (this.placeholder
          && (this.state === LOAD_STATE.LOADED || this.state === LOAD_STATE.ERROR)) {
          this.removePlaceholder();
        }
        this.appendImage();
      }
    } else if (this.element && !this.element.parentNode) {
      this.slide.container.appendChild(this.element);
    }
  }

  /**
   * Activate the slide,
   * active slide is generally the current one,
   * meaning the user can see it.
   */
  activate() {
    if (this.instance.dispatch('contentActivate', { content: this }).defaultPrevented) {
      return;
    }

    if (this.slide) {
      if (this.isImageContent() && this.isDecoding) {
        // add image to slide when it becomes active,
        // even if it's not finished decoding
        this.appendImage();
      } else if (this.isError()) {
        this.load(false, true); // try to reload
      }
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
   * Append the image content to slide container
   */
  appendImage() {
    if (!this.isAttached) {
      return;
    }

    if (this.instance.dispatch('contentAppendImage', { content: this }).defaultPrevented) {
      return;
    }

    // ensure that element exists and is not already appended
    if (this.slide && this.element && !this.element.parentNode) {
      this.slide.container.appendChild(this.element);

      if (this.placeholder
        && (this.state === LOAD_STATE.LOADED || this.state === LOAD_STATE.ERROR)) {
        this.removePlaceholder();
      }
    }
  }
}

export default Content;
