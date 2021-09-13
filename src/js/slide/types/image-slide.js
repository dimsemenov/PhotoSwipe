import Slide from '../slide.js';

import {
  createElement,
  setWidthHeight
} from '../../util/util.js';

class ImageSlide extends Slide {
  appendContent() {
    // Use image-based placeholder only for the first slide
    const useImagePlaceholder = this.data.msrc && this.isFirstSlide;

    // Create placeholder
    // (stretched thumbnail or simple div behind the main image)
    this.placeholder = createElement(
      'pswp__img pswp__img--placeholder',
      useImagePlaceholder ? 'img' : '',
      this.container
    );

    if (useImagePlaceholder) {
      this.placeholder.decoding = 'async';
      this.placeholder.alt = '';
      this.placeholder.src = this.data.msrc;
    }

    this.placeholder.setAttribute('aria-hiden', 'true');

    this.pswp.dispatch('placeholderCreated', { placeholder: this.placeholder, slide: this });

    // Create the main image
    if (!this.image) {
      this.loadMainImage();
    }

    this.isLoading = true;
  }

  appendHeavyContent() {
    super.appendHeavyContent();
    if (this.image) {
      this._appendMainImage();

      if (this.image.complete) {
        this._onImageLoaded();
      } else {
        this.image.onload = () => this._onImageLoaded();
        this.image.onerror = () => this._onImageLoaded(true);
      }
    }
  }

  /**
   * Creates and loads image
   */
  loadMainImage() {
    this.image = createElement('pswp__img', 'img');

    // may update sizes attribute
    this.updateContentSize();

    if (this.data.srcset) {
      this.image.srcset = this.data.srcset;
    }

    this.image.src = this.data.src;

    this.image.alt = this.data.alt || '';

    // Not adding `async`,
    // as it causes flash of image after it's loaded in Safari
    // this.image.decoding = 'async';

    // Using decode() to force nearby images to render:
    // even though nearby images are in DOM and not hidden via display:none,
    // Safari and FF still do not render them as they're offscreen. This helps:
    if (!this.isActive && ('decode' in this.image)) {
      this.image.decode();
    }

    this.pswp.lazyLoader.addRecent(this.index);
  }

  getPlaceholder() {
    return this.placeholder;
  }

  sizeChanged(scaleMultiplier, width, height) {
    if (scaleMultiplier !== this.prevScaleMultiplier
        || width !== this.prevWidth
        || height !== this.prevHeight) {
      this.prevScaleMultiplier = scaleMultiplier;
      this.prevWidth = width;
      this.prevHeight = height;
      return true;
    }

    return false;
  }

  _appendMainImage() {
    if (!this._imageAppended) {
      this.container.appendChild(this.image);
      this._imageAppended = true;
    }
  }

  _onImageLoaded(isError) {
    this._appendMainImage();
    this.isLoading = false;
    this.pswp.dispatch('loadComplete', { slide: this, isError });
    if (this.placeholder) {
      // If large image is not decoded,
      // which might happen if browser does not support decode(),
      // there will be a flash after placeholder is removed,
      // so we hide it with delay
      setTimeout(() => {
        if (this.placeholder) {
          this.placeholder.remove();
          this.placeholder = null;
        }
      }, 500);
    }
    if (isError) {
      this._handleError();
    }
  }

  _handleError() {
    this.setSlideHTML(this.pswp.options.errorMsg);
    const errorLinkElement = this.container.querySelector('.pswp__error-msg a');
    if (errorLinkElement && this.data.src) {
      errorLinkElement.href = this.data.src;
    }
    this.loadError = true;
    this.image = null;
    this.calculateSize();
    this.setZoomLevel(1);
    this.panTo(0, 0);
    this.pswp.dispatch('loadError', { slide: this });
  }

  /**
   * Whether slide in the current state can be panned by the user
   */
  isPannable() {
    return this.width && (this.currZoomLevel > this.zoomLevels.fit);
  }

  /**
   * Whether the slide can be zoomed
   */
  isZoomable() {
    return (this.width > 0);
  }

  updateContentSize() {
    // Use initial zoom level
    // if resolution is not defined (user didn't zoom yet)
    const scaleMultiplier = this.currentResolution || this.zoomLevels.initial;

    if (!scaleMultiplier) {
      return;
    }

    if (!this.sizeChanged(scaleMultiplier, this.width, this.height)) {
      return;
    }

    const width = Math.round(this.width * scaleMultiplier);
    const height = Math.round(this.height * scaleMultiplier);

    if (this.placeholder) {
      setWidthHeight(this.placeholder, width, 'auto');
    }

    const { image } = this;
    if (image) {
      setWidthHeight(image, width, 'auto');

      // Handle srcset sizes attribute.
      //
      // Never lower quality, if it was increased previously.
      // Chrome does this automatically, Firefox and Safari do not,
      // so we store largest used size in dataset.
      if (!image.dataset.largestUsedSize
          || width > image.dataset.largestUsedSize) {
        image.sizes = width + 'px';
        image.dataset.largestUsedSize = width;
      }

      this.pswp.dispatch('imageSizeChange', { slide: this, width, height });
    }

    return true;
  }
}

export default ImageSlide;
