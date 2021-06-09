import { getViewportSize, getPanAreaSize } from '../util/viewport-size.js';
import ZoomLevel from './zoom-level.js';

// This much recently lazy-loaded images will not be lazy-loaded again
const MAX_SLIDES_TO_LAZY_LOAD = 15;

/**
 * Lazy-loads specific slide.
 * This function is used both by Lightbox and PhotoSwipe core,
 * thus it can be called before dialog is opened.
 *
 * By default it loads image based on viewport size and initial zoom level.
 *
 * @param {Integer} index Slide index
 * @param {Object}  instance PhotoSwipe or PhotoSwipeLightbox eventable instance
 */
export function lazyLoadSlide(index, instance) {
  const itemData = instance.getItemData(index);

  if (instance.dispatch('lazyLoadSlide', { index, itemData }).defaultPrevented) {
    return;
  }

  if (itemData.src && itemData.w && itemData.h) {
    const { options } = instance;

    // We need to know dimensions of the image to preload it,
    // as it might use srcset and we need to define sizes
    const viewportSize = instance.viewportSize || getViewportSize(options);
    const panAreaSize = getPanAreaSize(options, viewportSize);

    const zoomLevel = new ZoomLevel(options, itemData, index);
    zoomLevel.update(itemData.w, itemData.h, panAreaSize);

    const image = document.createElement('img');
    image.decoding = 'async';
    image.sizes = Math.ceil(itemData.w * zoomLevel.initial) + 'px';
    if (itemData.srcset) {
      image.srcset = itemData.srcset;
    }
    image.src = itemData.src;
  }
}

class LazyLoader {
  constructor(pswp) {
    this.pswp = pswp;
    this.clearRecent();
  }

  /**
   * Lazy load nearby slides based on `preload` option.
   *
   * @param {Integer} diff Difference between slide indexes that was changed recently, or 0.
   */
  update(diff) {
    const { pswp } = this;

    if (pswp.dispatch('lazyLoad').defaultPrevented) {
      return;
    }

    const { preload } = pswp.options;
    const isForward = diff === undefined ? true : (diff >= 0);
    let i;

    // preload[1] - num items to preload in forward direction
    for (i = 0; i <= preload[1]; i++) {
      this._loadSlideByIndex(pswp.currIndex + (isForward ? i : (-i)));
    }

    // preload[0] - num items to preload in backward direction
    for (i = 1; i <= preload[0]; i++) {
      this._loadSlideByIndex(pswp.currIndex + (isForward ? (-i) : i));
    }
  }

  clearRecent() {
    this._recentlyLazyLoadedIndexes = [];
  }

  /**
   * Add index to recently lazy-loaded slides.
   *
   * To prevent duplciate downloads,
   * we keep track of recently preloaded slides.
   *
   * @param {Integer} index
   */
  addRecent(index) {
    if (this._recentlyLazyLoadedIndexes.indexOf(index) > -1) {
      // already exists
      return;
    }

    if (this._recentlyLazyLoadedIndexes.length > MAX_SLIDES_TO_LAZY_LOAD - 1) {
      this._recentlyLazyLoadedIndexes.pop();
    }

    // the most recent lazy loaded index is the first
    // (thus push to the beginning)
    this._recentlyLazyLoadedIndexes.unshift(index);

    return true;
  }

  _loadSlideByIndex(index) {
    index = this.pswp.getLoopedIndex(index);

    if (this.addRecent(index)) {
      lazyLoadSlide(index, this.pswp);
    }
  }
}

export default LazyLoader;
