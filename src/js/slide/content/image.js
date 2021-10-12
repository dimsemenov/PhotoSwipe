import { createElement, LOAD_STATE, setWidthHeight } from '../../util/util.js';
import Content from './content.js';

class ImageContent extends Content {
  load(/* isLazy */) {
    if (this.element) {
      return;
    }

    const imageSrc = this.data.src;

    if (!imageSrc) {
      return;
    }

    this.element = createElement('pswp__img', 'img');

    if (this.data.srcset) {
      this.element.srcset = this.data.srcset;
    }

    this.element.src = imageSrc;

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

  setDisplayedSize(width, height) {
    const image = this.element;
    if (image) {
      setWidthHeight(image, width, 'auto');

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
        this.pswp.dispatch('imageSizeChange', { slide: this.slide, width, height });
      }
    }
  }

  isZoomable() {
    return (this.state !== LOAD_STATE.ERROR);
  }

  usePlaceholder() {
    return true;
  }

  lazyLoad() {
    this.load();
  }

  destroy() {
    if (this.element) {
      this.element.onload = null;
      this.element.onerror = null;
      this.element = null;
    }
  }

  appendTo(container) {
    this.isAttached = true;

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
    if (this.slide && !this.slide.isActive && ('decode' in this.element)) {
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
  }

  activate() {
    if (this.slide && this.slide.container && this.isDecoding) {
      // add image to slide when it becomes active,
      // even if it's not finished decoding
      this.appendImageTo(this.slide.container);
    }
  }

  getErrorElement() {
    const el = createElement('pswp__error-msg-container');
    el.innerHTML = this.options.errorMsg;
    const linkEl = el.querySelector('a');
    if (linkEl) {
      linkEl.href = this.data.src;
    }
    return el;
  }

  appendImageTo(container) {
    // ensure that element exists and is not already appended
    if (this.element && !this.element.parentNode && this.isAttached) {
      container.appendChild(this.element);
    }
  }
}

export default ImageContent;
