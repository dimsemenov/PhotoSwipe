/**
 * PhotoSwipe lightbox
 *
 * - If user has unsupported browser it falls back to default browser action (just opens URL)
 * - Binds click event to links that should open PhotoSwipe
 * - parses DOM strcture for PhotoSwipe (retrieves large image URLs and sizes)
 * - Initializes PhotoSwipe
 *
 *
 * Loader options use the same object as PhotoSwipe, and supports such options:
 *
 * gallery - Element | Element[] | NodeList | string selector for the gallery element
 * children - Element | Element[] | NodeList | string selector for the gallery children
 *
 */

import {
  specialKeyUsed,
  getElementsFromOption,
  isPswpClass
} from '../util/util.js';

import PhotoSwipeBase from '../core/base.js';
import { lazyLoadSlide } from '../slide/loader.js';

/** @typedef {import("../photoswipe").PhotoSwipeOptions} PhotoSwipeOptions */

class PhotoSwipeLightbox extends PhotoSwipeBase {
  /**
   * @param {PhotoSwipeOptions} options
   */
  constructor(options) {
    super();
    this.options = options || {};
    this._uid = 0;
  }

  init() {
    this.onThumbnailsClick = this.onThumbnailsClick.bind(this);

    // Bind click events to each gallery
    getElementsFromOption(this.options.gallery, this.options.gallerySelector)
      .forEach((galleryElement) => {
        galleryElement.addEventListener('click', this.onThumbnailsClick, false);
      });
  }

  onThumbnailsClick(e) {
    // Exit and allow default browser action if:
    if (specialKeyUsed(e) // ... if clicked with a special key (ctrl/cmd...)
        || window.pswp // ... if PhotoSwipe is already open
        || window.navigator.onLine === false) { // ... if offline
      return;
    }

    // If both clientX and clientY are 0 or not defined,
    // the event is likely triggered by keyboard,
    // so we do not pass the initialPoint
    //
    // Note that some screen readers emulate the mouse position,
    // so it's not ideal way to detect them.
    //
    let initialPoint = { x: e.clientX, y: e.clientY };

    if (!initialPoint.x && !initialPoint.y) {
      initialPoint = null;
    }

    let clickedIndex = this.getClickedIndex(e);
    clickedIndex = this.applyFilters('clickedIndex', clickedIndex, e, this);
    const dataSource = {
      gallery: e.currentTarget
    };

    if (clickedIndex >= 0) {
      e.preventDefault();
      this.loadAndOpen(clickedIndex, dataSource, initialPoint);
    }
  }

  /**
   * Get index of gallery item that was clicked.
   *
   * @param {Event} e click event
   */
  getClickedIndex(e) {
    // legacy option
    if (this.options.getClickedIndexFn) {
      return this.options.getClickedIndexFn.call(this, e);
    }

    const clickedTarget = e.target;
    const childElements = getElementsFromOption(
      this.options.children,
      this.options.childSelector,
      e.currentTarget
    );
    const clickedChildIndex = childElements.findIndex(
      child => child === clickedTarget || child.contains(clickedTarget)
    );

    if (clickedChildIndex !== -1) {
      return clickedChildIndex;
    } else if (this.options.children || this.options.childSelector) {
      // click wasn't on a child element
      return -1;
    }

    // There is only one item (which is the gallery)
    return 0;
  }

  /**
   * Load and open PhotoSwipe
   *
   * @param {Integer} index
   * @param {Array|Object|null} dataSource
   * @param {Point|null} initialPoint
   */
  loadAndOpen(index, dataSource, initialPoint) {
    // Check if the gallery is already open
    if (window.pswp) {
      return false;
    }

    // set initial index
    this.options.index = index;

    // define options for PhotoSwipe constructor
    this.options.initialPointerPos = initialPoint;

    this.shouldOpen = true;
    this.preload(index, dataSource);
    return true;
  }

  /**
   * Load the main module and the slide content by index
   *
   * @param {Integer} index
   */
  preload(index, dataSource) {
    const { options } = this;

    if (dataSource) {
      options.dataSource = dataSource;
    }

    // Add the main module
    const promiseArray = [];

    const pswpModuleType = typeof options.pswpModule;
    if (isPswpClass(options.pswpModule)) {
      promiseArray.push(options.pswpModule);
    } else if (pswpModuleType === 'string') {
      throw new Error('pswpModule as string is no longer supported');
    } else if (pswpModuleType === 'function') {
      promiseArray.push(options.pswpModule());
    } else {
      throw new Error('pswpModule is not valid');
    }

    // Add custom-defined promise, if any
    if (typeof options.openPromise === 'function') {
      // allow developers to perform some task before opening
      promiseArray.push(options.openPromise());
    }

    if (options.preloadFirstSlide !== false && index >= 0) {
      this._preloadedContent = lazyLoadSlide(index, this);
    }

    // Wait till all promises resolve and open PhotoSwipe
    const uid = ++this._uid;
    Promise.all(promiseArray).then((iterableModules) => {
      if (this.shouldOpen) {
        const mainModule = iterableModules[0];
        this._openPhotoswipe(mainModule, uid);
      }
    });
  }

  _openPhotoswipe(module, uid) {
    // Cancel opening if UID doesn't match the current one
    // (if user clicked on another gallery item before current was loaded).
    //
    // Or if shouldOpen flag is set to false
    // (developer may modify it via public API)
    if (uid !== this._uid && this.shouldOpen) {
      return;
    }

    this.shouldOpen = false;

    // PhotoSwipe is already open
    if (window.pswp) {
      return;
    }

    // Pass data to PhotoSwipe and open init
    const pswp = typeof module === 'object'
        ? new module.default(this.options) // eslint-disable-line
        : new module(this.options); // eslint-disable-line

    this.pswp = pswp;
    window.pswp = pswp;

    // map listeners from Lightbox to PhotoSwipe Core
    Object.keys(this._listeners).forEach((name) => {
      this._listeners[name].forEach((fn) => {
        pswp.on(name, fn);
      });
    });

    // same with filters
    Object.keys(this._filters).forEach((name) => {
      this._filters[name].forEach((filter) => {
        pswp.addFilter(name, filter.fn, filter.priority);
      });
    });

    if (this._preloadedContent) {
      pswp.contentLoader.addToCache(this._preloadedContent);
      this._preloadedContent = null;
    }

    pswp.on('destroy', () => {
      // clean up public variables
      this.pswp = null;
      window.pswp = null;
    });

    pswp.init();
  }

  destroy() {
    if (this.pswp) {
      this.pswp.destroy();
    }

    this.shouldOpen = false;
    this._listeners = null;

    getElementsFromOption(this.options.gallery, this.options.gallerySelector)
      .forEach((galleryElement) => {
        galleryElement.removeEventListener('click', this.onThumbnailsClick, false);
      });
  }
}

export default PhotoSwipeLightbox;
