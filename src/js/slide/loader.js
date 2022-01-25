import { getViewportSize, getPanAreaSize } from '../util/viewport-size.js';
import ZoomLevel from './zoom-level.js';

const MIN_SLIDES_TO_CACHE = 5;

/**
 * Returns cache key by slide index and data
 *
 * @param {Object} itemData
 * @param {Integer} index
 * @returns {String}
 */
export function getKey(itemData, index) {
  if (itemData && itemData.src) {
    return itemData.src + '_' + index;
  }
  return index;
}


/**
 * Lazy-load an image
 * This function is used both by Lightbox and PhotoSwipe core,
 * thus it can be called before dialog is opened.
 *
 * @param {Object} itemData Data about the slide
 * @param {PhotoSwipeBase}  instance PhotoSwipe or PhotoSwipeLightbox
 * @param {Integer} index
 * @returns {Object|Boolean} Image that is being decoded or false.
 */
export function lazyLoadData(itemData, instance, index) {
  // src/slide/content/content.js
  const content = instance.createContentFromData(itemData);

  if (!content || !content.lazyLoad) {
    return;
  }

  content.key = getKey(itemData, index);

  const { options } = instance;

  // We need to know dimensions of the image to preload it,
  // as it might use srcset and we need to define sizes
  const viewportSize = instance.viewportSize || getViewportSize(options);
  const panAreaSize = getPanAreaSize(options, viewportSize);

  const zoomLevel = new ZoomLevel(options, itemData, -1);
  zoomLevel.update(content.width, content.height, panAreaSize);

  content.lazyLoad();
  content.setDisplayedSize(
    Math.ceil(content.width * zoomLevel.initial),
    Math.ceil(content.height * zoomLevel.initial)
  );

  return content;
}


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

  return lazyLoadData(itemData, instance, index);
}


class ContentLoader {
  constructor(pswp) {
    this.pswp = pswp;
    // Total amount of cached images
    this.limit = Math.max(
      pswp.options.preload[0] + pswp.options.preload[1] + 1,
      MIN_SLIDES_TO_CACHE
    );
    this._cachedItems = [];
  }

  /**
   * Lazy load nearby slides based on `preload` option.
   *
   * @param {Integer} diff Difference between slide indexes that was changed recently, or 0.
   */
  updateLazy(diff) {
    const { pswp } = this;

    if (pswp.dispatch('lazyLoad').defaultPrevented) {
      return;
    }

    const { preload } = pswp.options;
    const isForward = diff === undefined ? true : (diff >= 0);
    let i;

    // preload[1] - num items to preload in forward direction
    for (i = 0; i <= preload[1]; i++) {
      this.loadSlideByIndex(pswp.currIndex + (isForward ? i : (-i)));
    }

    // preload[0] - num items to preload in backward direction
    for (i = 1; i <= preload[0]; i++) {
      this.loadSlideByIndex(pswp.currIndex + (isForward ? (-i) : i));
    }
  }

  loadSlideByIndex(index) {
    index = this.pswp.getLoopedIndex(index);
    const itemData = this.pswp.getItemData(index);
    const key = getKey(itemData, index);
    let content = this.getContentByKey(key);
    if (!content) {
      content = lazyLoadSlide(index, this.pswp);
      content.key = key;
      this.addToCache(content);
    }
  }

  getContentBySlide(slide) {
    let content = this.getContentByKey(this.getKeyBySlide(slide));
    if (!content) {
      // create content if not found in cache
      content = this.pswp.createContentFromData(slide.data);
      if (content) {
        content.key = this.getKeyBySlide(slide);
        this.addToCache(content);
      }
    }

    if (content) {
      // assign slide to content
      content.setSlide(slide);
    }
    return content;
  }

  /**
   * @param {Content} content
   */
  addToCache(content) {
    // move to the end of array
    this.removeByKey(content.key);
    this._cachedItems.push(content);

    if (this._cachedItems.length > this.limit) {
      // Destroy the first content that's not attached
      const indexToRemove = this._cachedItems.findIndex(item => !item.isAttached);
      if (indexToRemove !== -1) {
        const removedItem = this._cachedItems.splice(indexToRemove, 1)[0];
        removedItem.destroy();
      }
    }
  }

  /**
   * Removes an image from cache, does not destroy() it, just removes.
   *
   * @param {String} key
   */
  removeByKey(key) {
    const indexToRemove = this._cachedItems.findIndex(item => item.key === key);
    if (indexToRemove !== -1) {
      this._cachedItems.splice(indexToRemove, 1);
    }
  }

  getContentByKey(key) {
    return this._cachedItems.find(content => content.key === key);
  }

  getKeyBySlide(slide) {
    return getKey(slide.data, slide.index);
  }

  destroy() {
    this._cachedItems.forEach(content => content.destroy());
    this._cachedItems = null;
  }
}

export default ContentLoader;
