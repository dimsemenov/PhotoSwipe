import Eventable from './eventable.js';
import {
  getElementsFromOption
} from '../util/util.js';
import Content from '../slide/content.js';
import { lazyLoadData } from '../slide/loader.js';

/** @typedef {import("../photoswipe.js").default} PhotoSwipe */
/** @typedef {import("../photoswipe.js").PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import("../slide/slide.js").SlideData} SlideData */

/**
 * PhotoSwipe base class that can retrieve data about every slide.
 * Shared by PhotoSwipe Core and PhotoSwipe Lightbox
 */
class PhotoSwipeBase extends Eventable {
  /**
   * Get total number of slides
   *
   * @returns {number}
   */
  getNumItems() {
    let numItems;
    const { dataSource } = this.options;
    if (!dataSource) {
      numItems = 0;
    } else if ('length' in dataSource) {
      // may be an array or just object with length property
      numItems = dataSource.length;
    } else if ('gallery' in dataSource) {
      // query DOM elements
      if (!dataSource.items) {
        dataSource.items = this._getGalleryDOMElements(dataSource.gallery);
      }

      if (dataSource.items) {
        numItems = dataSource.items.length;
      }
    }

    // legacy event, before filters were introduced
    const event = this.dispatch('numItems', {
      dataSource,
      numItems
    });
    return this.applyFilters('numItems', event.numItems, dataSource);
  }

  /**
   * @param {SlideData} slideData
   * @param {number} index
   */
  createContentFromData(slideData, index) {
    // @ts-expect-error
    return new Content(slideData, this, index);
  }

  /**
   * Get item data by index.
   *
   * "item data" should contain normalized information that PhotoSwipe needs to generate a slide.
   * For example, it may contain properties like
   * `src`, `srcset`, `w`, `h`, which will be used to generate a slide with image.
   *
   * @param {number} index
   */
  getItemData(index) {
    const { dataSource } = this.options;
    let dataSourceItem;
    if (Array.isArray(dataSource)) {
      // Datasource is an array of elements
      dataSourceItem = dataSource[index];
    } else if (dataSource && dataSource.gallery) {
      // dataSource has gallery property,
      // thus it was created by Lightbox, based on
      // gallery and children options

      // query DOM elements
      if (!dataSource.items) {
        dataSource.items = this._getGalleryDOMElements(dataSource.gallery);
      }

      dataSourceItem = dataSource.items[index];
    }

    let itemData = dataSourceItem;

    if (itemData instanceof Element) {
      itemData = this._domElementToItemData(itemData);
    }

    // Dispatching the itemData event,
    // it's a legacy verion before filters were introduced
    const event = this.dispatch('itemData', {
      itemData: itemData || {},
      index
    });

    return this.applyFilters('itemData', event.itemData, index);
  }

  /**
   * Get array of gallery DOM elements,
   * based on childSelector and gallery element.
   *
   * @param {HTMLElement} galleryElement
   */
  _getGalleryDOMElements(galleryElement) {
    if (this.options.children || this.options.childSelector) {
      return getElementsFromOption(
        this.options.children,
        this.options.childSelector,
        galleryElement
      ) || [];
    }

    return [galleryElement];
  }

  /**
   * Converts DOM element to item data object.
   *
   * @param {HTMLElement} element DOM element
   */
  // eslint-disable-next-line class-methods-use-this
  _domElementToItemData(element) {
    /** @type {SlideData} */
    const itemData = {
      element
    };

    // eslint-disable-next-line max-len
    const linkEl = /** @type {HTMLAnchorElement} */ (element.tagName === 'A' ? element : element.querySelector('a'));

    if (linkEl) {
      // src comes from data-pswp-src attribute,
      // if it's empty link href is used
      itemData.src = linkEl.dataset.pswpSrc || linkEl.href;

      if (linkEl.dataset.pswpSrcset) {
        itemData.srcset = linkEl.dataset.pswpSrcset;
      }

      itemData.width = parseInt(linkEl.dataset.pswpWidth, 10);
      itemData.height = parseInt(linkEl.dataset.pswpHeight, 10);

      // support legacy w & h properties
      itemData.w = itemData.width;
      itemData.h = itemData.height;

      if (linkEl.dataset.pswpType) {
        itemData.type = linkEl.dataset.pswpType;
      }

      const thumbnailEl = element.querySelector('img');

      if (thumbnailEl) {
        // msrc is URL to placeholder image that's displayed before large image is loaded
        // by default it's displayed only for the first slide
        itemData.msrc = thumbnailEl.currentSrc || thumbnailEl.src;
        itemData.alt = thumbnailEl.getAttribute('alt');
      }

      if (linkEl.dataset.pswpCropped || linkEl.dataset.cropped) {
        itemData.thumbCropped = true;
      }
    }

    return this.applyFilters('domItemData', itemData, element, linkEl);
  }

  /**
   * Lazy-load by slide data
   *
   * @param {SlideData} itemData Data about the slide
   * @param {number} index
   * @returns Image that is being decoded or false.
   */
  lazyLoadData(itemData, index) {
    return lazyLoadData(itemData, this, index);
  }
}

export default PhotoSwipeBase;
