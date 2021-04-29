/*!
  * PhotoSwipe Lightbox 5.0.0 - https://photoswipe.com
  * (c) 2021 Dmitry Semenov
  */
/**
  * Creates element and optionally appends it to another.
  *
  * @param {String} className
  * @param {String|NULL} tagName
  * @param {Element|NULL} appendToEl
  */

('decode' in new Image());

/**
 * Check if click or keydown event was dispatched
 * with a special key or via mouse wheel.
 *
 * @param {Event} e
 */
function specialKeyUsed(e) {
  if (e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
    return true;
  }
}

function getViewportSize(options, pswp) {
  if (options.getViewportSizeFn) {
    const newViewportSize = options.getViewportSizeFn(options, pswp);
    if (newViewportSize) {
      return newViewportSize;
    }
  }

  return {
    x: document.documentElement.clientWidth,

    // TODO: height on mobile is very incosistent due to toolbar
    // find a way to improve this
    //
    // document.documentElement.clientHeight - doesn't seem to work well
    y: window.innerHeight
  };
}

function getPanAreaSize(options, viewportSize/*, pswp*/) {
  return {
    x: viewportSize.x - (options.paddingLeft || 0) - (options.paddingRight || 0),
    y: viewportSize.y - (options.paddingTop || 0) - (options.paddingBottom || 0)
  };
}

/**
 * Calculates zoom levels for specific slide.
 * Depends on viewport size and image size.
 */

const MAX_IMAGE_WIDTH = 3000;

class ZoomLevel {
  constructor(options, itemData, index) {
    // pswp options
    this.options = options;
    this.itemData = itemData;
    this.index = index;
  }

  /**
   * Calculate initial, secondary and maximum zoom level for the specified slide.
   *
   * It should be called when either image or viewport size changes.
   *
   * @param {Slide} slide
   */
  update(maxWidth, maxHeight, panAreaSize) {
    this.elementSize = {
      x: maxWidth,
      y: maxHeight
    };

    this.panAreaSize = panAreaSize;

    const hRatio = this.panAreaSize.x / this.elementSize.x;
    const vRatio = this.panAreaSize.y / this.elementSize.y;

    this.fit = Math.min(1, hRatio < vRatio ? hRatio : vRatio);
    this.fill = Math.min(1, hRatio > vRatio ? hRatio : vRatio);

    // zoom.vFill defines zoom level of the image
    // when it has 100% of viewport vertical space (height)
    this.vFill = Math.min(1, vRatio);

    this.initial = this._getInitial();
    this.secondary = this._getSecondary();
    this.max = Math.max(
      this.initial,
      this.secondary,
      this._getMax()
    );

    this.min = Math.min(
      this.fit,
      this.initial,
      this.secondary
    );
  }

  /**
   * Parses user-defined zoom option.
   *
   * @param {Mixed} optionPrefix Zoom level option prefix (initial, secondary, max)
   */
  _parseZoomLevelOption(optionPrefix) {
    // zoom.initial
    // zoom.secondary
    // zoom.max
    const optionValue = this.options[optionPrefix + 'ZoomLevel'];

    if (!optionValue) {
      return;
    }

    if (typeof optionValue === 'function') {
      return optionValue(this);
    }

    if (optionValue === 'fill') {
      return this.fill;
    }

    if (optionValue === 'fit') {
      return this.fit;
    }

    return Number(optionValue);
  }

  /**
   * Get zoom level to which image will be zoomed after double-tap gesture,
   * or when user clicks on zoom icon,
   * or mouse-click on image itself.
   * If you return 1 image will be zoomed to its original size.
   *
   * @return {Number}
   */
  _getSecondary() {
    let currZoomLevel = this._parseZoomLevelOption('secondary');

    if (currZoomLevel) {
      return currZoomLevel;
    }

    // 2.5x of "fit" state, but not larger than original
    currZoomLevel = Math.min(1, this.fit * 2.5);

    if (currZoomLevel * this.elementSize.x > MAX_IMAGE_WIDTH) {
      currZoomLevel = MAX_IMAGE_WIDTH / this.elementSize.x;
    }

    return currZoomLevel;
  }

  /**
   * Get initial image zoom level.
   *
   * @return {Number}
   */
  _getInitial() {
    return this._parseZoomLevelOption('initial') || this.fit;
  }

  /**
   * Maximum zoom level when user zooms
   * via zoom/pinch gesture,
   * via cmd/ctrl-wheel or via trackpad.
   *
   * @return {Number}
   */
  _getMax() {
    const currZoomLevel = this._parseZoomLevelOption('max');

    if (currZoomLevel) {
      return currZoomLevel;
    }

    // max zoom level is x4 from "fit state",
    // used for zoom gesture and ctrl/trackpad zoom
    return Math.max(1, this.fit * 4);
  }
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
function lazyLoadSlide(index, instance) {
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
    image.src = itemData.src;
    if (itemData.srcset) {
      image.srcset = itemData.srcset;
    }
  }
}

function dynamicImportModule(module) {
  // TODO: polyfill import?
  return import(module);
}

function dynamicImportPlugin(pluginKey, pluginItem) {
  return new Promise((resolve) => {
    if (typeof pluginItem === 'string') {
      dynamicImportModule(pluginItem).then((module) => {
        resolve({
          pluginKey,
          moduleClass: module.default
        });
      }).catch(resolve);
    } else {
      resolve();
    }
  });
}

/**
 * Dynamically load CSS file.
 *
 * Based on loadCSS by Filament Group:
 * https://github.com/filamentgroup/loadCSS
 * https://filamentgroup.com
 *
 * @param {String} href URL
 */
function loadCSS(href) {
  return new Promise((resolve, reject) => {
    // try to find existing CSS with the same href
    let link = document.head.querySelector(`link[href="${href}"]`);

    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'all';
      document.head.appendChild(link);
    } else if (link.dataset.loaded) {
      // already loaded
      resolve();
      return;
    }

    link.onload = () => {
      link.dataset.loaded = true;
      requestAnimationFrame(() => resolve());
    };
    link.onerror = () => {
      link.remove();
      reject();
    };
  });
}

/**
 * Base PhotoSwipe event object
 */
class PhotoSwipeEvent {
  constructor(type, details) {
    this.type = type;
    if (details) {
      Object.assign(this, details);
    }
  }

  preventDefault() {
    this.defaultPrevented = true;
  }
}

/**
 * PhotoSwipe base class that can listen and dispatch for events.
 * Shared by PhotoSwipe Core and PhotoSwipe Lightbox, extended by base.js
 */
class Eventable {
  constructor() {
    this._listeners = {};
  }

  on(name, fn) {
    if (!this._listeners[name]) {
      this._listeners[name] = [];
    }
    this._listeners[name].push(fn);

    // When binding events to lightbox,
    // also bind events to PhotoSwipe Core,
    // if it's open.
    if (this.pswp) {
      this.pswp.on(name, fn);
    }
  }

  off(name, fn) {
    if (this._listeners[name]) {
      this._listeners[name] = this._listeners[name].filter(listener => (fn !== listener));
    }

    if (this.pswp) {
      this.pswp.off(name, fn);
    }
  }

  dispatch(name, details) {
    if (this.pswp) {
      return this.pswp.dispatch(name, details);
    }

    const event = new PhotoSwipeEvent(name, details);

    if (!this._listeners) {
      return event;
    }

    if (this._listeners[name]) {
      this._listeners[name].forEach((listener) => {
        listener.call(this, event);
      });
    }

    return event;
  }
}

/**
 * PhotoSwipe base class that can retrieve data about every slide.
 * Shared by PhotoSwipe Core and PhotoSwipe Lightbox
 */

class PhotoSwipeBase extends Eventable {
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

    // allow to filter number of items
    const event = this.dispatch('numItems', {
      dataSource,
      numItems
    });

    return event.numItems;
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

    // allow to filter itemData
    const event = this.dispatch('itemData', {
      itemData: itemData || {},
      index
    });

    return event.itemData;
  }

  /**
   * Get array of gallery DOM elements,
   * based on childSelector and gallery element.
   *
   * @param {Element} galleryElement
   */
  _getGalleryDOMElements(galleryElement) {
    if (this.options.childSelector) {
      return galleryElement.querySelectorAll(this.options.childSelector) || [];
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

    if (!linkEl) {
      return itemData;
    }

    // src comes from data-pswp-src attribute,
    // if it's empty link href is used
    itemData.src = linkEl.dataset.pswpSrc || linkEl.href;

    itemData.srcset = linkEl.dataset.pswpSrcset;

    itemData.w = parseInt(linkEl.dataset.pswpWidth, 10);
    itemData.h = parseInt(linkEl.dataset.pswpHeight, 10);

    const thumbnailEl = element.querySelector('img');

    if (thumbnailEl) {
      // define msrc only if it's the first slide,
      // as rendering (even small stretched thumbnail) is an expensive operation
      itemData.msrc = thumbnailEl.currentSrc || thumbnailEl.src;
      itemData.alt = thumbnailEl.getAttribute('alt');
    }

    if (linkEl.dataset.cropped) {
      itemData.thumbCropped = true;
    }

    return itemData;
  }
}

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
 * gallerySelector
 * childSelector - child selector relative to the parent (should be inside)
 *
 */

class PhotoSwipeLightbox extends PhotoSwipeBase {
  constructor(options) {
    super();
    this.options = options;
    this._additionalDynamicCSS = [];
    this._pluginClasses = {};
    this._uid = 0;
  }

  init() {
    this.onThumbnailsClick = this.onThumbnailsClick.bind(this);

    if (this.options && this.options.gallerySelector) {
      // Bind click events to each gallery
      const galleryElements = document.querySelectorAll(this.options.gallerySelector);
      galleryElements.forEach((galleryElement) => {
        galleryElement.addEventListener('click', this.onThumbnailsClick, false);
      });
    }
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

    const clickedIndex = this.getClickedIndex(e);
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
    if (this.options.getClickedIndexFn) {
      return this.options.getClickedIndexFn.call(this, e);
    }

    const clickedTarget = e.target;
    const clickedGallery = e.currentTarget;

    if (this.options.childSelector) {
      const clickedChild = clickedTarget.closest(this.options.childSelector);
      const childElements = clickedGallery.querySelectorAll(this.options.childSelector);

      if (clickedChild) {
        for (let i = 0; i < childElements.length; i++) {
          if (clickedChild === childElements[i]) {
            return i;
          }
        }
      }
    } else {
      // There is only one item (which is gallerySelector)
      return 0;
    }
  }

  /**
   * Load JS/CSS files and open PhotoSwipe afterwards.
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
   * Load JS/CSS files and the slide content by index
   *
   * @param {Integer} index
   */
  preload(index, dataSource) {
    const { options } = this;

    if (dataSource) {
      options.dataSource = dataSource;
    }

    // Add the main module
    const promiseArray = [dynamicImportModule(options.pswpModule)];

    // Add plugin modules
    Object.keys(this._pluginClasses).forEach((pluginKey) => {
      promiseArray.push(dynamicImportPlugin(
        pluginKey,
        this._pluginClasses[pluginKey]
      ));
    });

    // Add custom-defined promise, if any
    if (typeof options.openPromise === 'function') {
      // allow developers to perform some task before opening
      promiseArray.push(options.openPromise());
    }

    if (options.preloadFirstSlide !== false && index >= 0) {
      lazyLoadSlide(index, this);
    }

    // Load main CSS
    if (options.pswpCSS) {
      promiseArray.push(loadCSS(options.pswpCSS));
    }

    // Load additional CSS, if any
    this._additionalDynamicCSS.forEach((href) => {
      promiseArray.push(loadCSS(href));
    });

    // Wait till all promises resolve and open PhotoSwipe
    const uid = ++this._uid;
    Promise.all(promiseArray).then((iterableModules) => {
      iterableModules.forEach((item) => {
        if (item && item.pluginKey && item.moduleClass) {
          this._pluginClasses[item.pluginKey] = item.moduleClass;
        }
      });

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
    const pswp = new module.default( // eslint-disable-line
      null,
      this.options
    );
    pswp.pluginClasses = this._pluginClasses;

    this.pswp = pswp;
    window.pswp = pswp;

    // map listeners from Lightbox to PhotoSwipe Core
    Object.keys(this._listeners).forEach((name) => {
      this._listeners[name].forEach((fn) => {
        pswp.on(name, fn);
      });
    });

    pswp.on('destroy', () => {
      // clean up public variables
      this.pswp = null;
      window.pswp = null;
    });

    pswp.init();
  }

  /**
   * Register a plugin.
   *
   * @param {String} name
   * @param {Class|String} pluginClass Plugin class or path to module (string).
   */
  addPlugin(name, pluginClass) {
    this._pluginClasses[name] = pluginClass;
  }

  /**
   * Add CSS file that will be loaded when PhotoSwipe dialog is opened.
   *
   * @param {String} href CSS file URL.
   */
  addCSS(href) {
    this._additionalDynamicCSS.push(href);
  }

  destroy() {
    if (this.pswp) {
      this.pswp.close();
    }

    this.shouldOpen = false;
    this._listeners = null;

    const galleryElements = document.querySelectorAll(this.options.gallerySelector);
    galleryElements.forEach((galleryElement) => {
      galleryElement.removeEventListener('click', this.onThumbnailsClick, false);
    });
  }
}

export default PhotoSwipeLightbox;
//# sourceMappingURL=photoswipe-lightbox.esm.js.map
