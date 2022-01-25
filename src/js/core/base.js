/**
 * PhotoSwipe base class that can retrieve data about every slide.
 * Shared by PhotoSwipe Core and PhotoSwipe Lightbox
 */
import Eventable from './eventable';
import {
  getElementsFromOption
} from '../util/util.js';
import ImageContent from '../slide/content/image.js';
import Content from '../slide/content/content';

class PhotoSwipeBase extends Eventable {
  constructor() {
    super();
    this.contentTypes = {
      image: ImageContent,
      html: Content
    };
  }

  /**
   * Get total number of slides
   */
  getNumItems() {
    let numItems;
    const { dataSource } = this.options;
    if (!dataSource) {
      numItems = 0;
    } else if (dataSource.length) {
      // may be an array or just object with length property
      numItems = dataSource.length;
    } else if (dataSource.gallery) {
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
   * Add or set slide content type
   *
   * @param {String} type
   * @param {Class} ContentClass
   */
  addContentType(type, ContentClass) {
    this.contentTypes[type] = ContentClass;
  }

  /**
   * Get slide content class based on its data
   *
   * @param {Object} slideData
   * @param {Integer} slideIndex
   * @returns Class
   */
  getContentClass(slideData) {
    if (slideData.type) {
      return this.contentTypes[slideData.type];
    } else if (slideData.src) {
      return this.contentTypes.image;
    } else if (slideData.html) {
      return this.contentTypes.html;
    }
  }

  createContentFromData(slideData) {
    const ContentClass = this.getContentClass(slideData);
    if (!ContentClass) {
      return false;
    }
    const content = new ContentClass(slideData, this);
    return content;
  }

  /**
   * Get item data by index.
   *
   * "item data" should contain normalized information that PhotoSwipe needs to generate a slide.
   * For example, it may contain properties like
   * `src`, `srcset`, `w`, `h`, which will be used to generate a slide with image.
   *
   * @param {Integer} index
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
      // gallerySelecor and childSelector options

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
   * @param {Element} galleryElement
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
   * @param {Element} element DOM element
   */
  // eslint-disable-next-line class-methods-use-this
  _domElementToItemData(element) {
    const itemData = {
      element
    };

    const linkEl = element.tagName === 'A' ? element : element.querySelector('a');

    if (linkEl) {
      // src comes from data-pswp-src attribute,
      // if it's empty link href is used
      itemData.src = linkEl.dataset.pswpSrc || linkEl.href;

      itemData.srcset = linkEl.dataset.pswpSrcset;

      itemData.w = parseInt(linkEl.dataset.pswpWidth, 10);
      itemData.h = parseInt(linkEl.dataset.pswpHeight, 10);

      if (linkEl.dataset.pswpType) {
        itemData.type = linkEl.dataset.pswpType;
      }

      const thumbnailEl = element.querySelector('img');

      if (thumbnailEl) {
        // define msrc only if it's the first slide,
        // as rendering (even small stretched thumbnail) is an expensive operation
        itemData.msrc = thumbnailEl.currentSrc || thumbnailEl.src;
        itemData.alt = thumbnailEl.getAttribute('alt');
      }

      if (linkEl.dataset.pswpCropped || linkEl.dataset.cropped) {
        itemData.thumbCropped = true;
      }
    }

    this.applyFilters('domItemData', itemData, element, linkEl);

    return itemData;
  }
}

export default PhotoSwipeBase;
