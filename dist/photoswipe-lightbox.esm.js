/*!
  * PhotoSwipe Lightbox 5.1.8 - https://photoswipe.com
  * (c) 2022 Dmitry Semenov
  */
/**
  * Creates element and optionally appends it to another.
  *
  * @param {String} className
  * @param {String|NULL} tagName
  * @param {Element|NULL} appendToEl
  */
function createElement(className, tagName, appendToEl) {
  const el = document.createElement(tagName || 'div');
  if (className) {
    el.className = className;
  }
  if (appendToEl) {
    appendToEl.appendChild(el);
  }
  return el;
}

/**
 * Apply width and height CSS properties to element
 */
function setWidthHeight(el, w, h) {
  el.style.width = (typeof w === 'number') ? (w + 'px') : w;
  el.style.height = (typeof h === 'number') ? (h + 'px') : h;
}

const LOAD_STATE = {
  IDLE: 'idle',
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
};


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

/**
 * Parse `gallery` or `children` options.
 *
 * @param {Element|NodeList|String} option
 * @param {String|null} legacySelector
 * @param {Element|null} parent
 * @returns Element[]
 */
function getElementsFromOption(option, legacySelector, parent = document) {
  let elements = [];

  if (option instanceof Element) {
    elements = [option];
  } else if (option instanceof NodeList || Array.isArray(option)) {
    elements = Array.from(option);
  } else {
    const selector = typeof option === 'string' ? option : legacySelector;
    if (selector) {
      elements = Array.from(parent.querySelectorAll(selector));
    }
  }

  return elements;
}

function dynamicImportModule(module) {
  return typeof module === 'string' ? import(/* webpackIgnore: true */ module) : module;
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
    this._filters = {};
  }

  addFilter(name, fn, priority = 100) {
    if (!this._filters[name]) {
      this._filters[name] = [];
    }

    this._filters[name].push({ fn, priority });
    this._filters[name].sort((f1, f2) => f1.priority - f2.priority);

    if (this.pswp) {
      this.pswp.addFilter(name, fn, priority);
    }
  }

  removeFilter(name, fn) {
    if (this._filters[name]) {
      this._filters[name] = this._filters[name].filter(filter => (filter.fn !== fn));
    }

    if (this.pswp) {
      this.pswp.removeFilter(name, fn);
    }
  }

  applyFilters(name, ...args) {
    if (this._filters[name]) {
      this._filters[name].forEach((filter) => {
        args[0] = filter.fn.apply(this, args);
      });
    }
    return args[0];
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
    this.state = LOAD_STATE.IDLE;
  }

  setSlide(slide) {
    this.slide = slide;
    this.pswp = slide.pswp;
  }

  /**
   * Load the content
   *
   * @param {Boolean} isLazy If method is executed by lazy-loader
   */
  load(/* isLazy */) {
    if (!this.element) {
      this.element = createElement('pswp__content');
      this.element.style.position = 'absolute';
      this.element.style.left = 0;
      this.element.style.top = 0;
      this.element.innerHTML = this.data.html || '';
    }
  }

  isZoomable() {
    return false;
  }

  usePlaceholder() {
    return false;
  }

  activate() {

  }

  deactivate() {

  }

  setDisplayedSize(width, height) {
    if (this.element) {
      setWidthHeight(this.element, width, height);
    }
  }

  onLoaded() {
    this.state = LOAD_STATE.LOADED;

    if (this.slide) {
      this.pswp.dispatch('loadComplete', { slide: this.slide });
    }
  }

  isLoading() {
    return (this.state === LOAD_STATE.LOADING);
  }

  // If the placeholder should be kept in DOM
  keepPlaceholder() {
    return this.isLoading();
  }

  onError() {
    this.state = LOAD_STATE.ERROR;

    if (this.slide) {
      this.pswp.dispatch('loadComplete', { slide: this.slide, isError: true });
      this.pswp.dispatch('loadError', { slide: this.slide });
    }
  }

  getErrorElement() {
    return false;
  }


  remove() {
    this.isAttached = false;
    if (this.element && this.element.parentNode) {
      this.element.remove();
    }
  }

  appendTo(container) {
    this.isAttached = true;
    if (this.element && !this.element.parentNode) {
      container.appendChild(this.element);
    }
  }

  destroy() {

  }
}

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

/**
 * PhotoSwipe base class that can retrieve data about every slide.
 * Shared by PhotoSwipe Core and PhotoSwipe Lightbox
 */

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

/**
 * Parses padding option.
 * Supported formats:
 *
 * // Object
 * padding: {
 *  top: 0,
 *  bottom: 0,
 *  left: 0,
 *  right: 0
 * }
 *
 * // A function that returns the object
 * paddingFn: (viewportSize) => {
 *  return {
 *    top: 0,
 *    bottom: 0,
 *    left: 0,
 *    right: 0
 *  };
 * }
 *
 * // Legacy variant
 * paddingLeft: 0,
 * paddingRight: 0,
 * paddingTop: 0,
 * paddingBottom: 0,
 *
 * @param {String} prop 'left', 'top', 'bottom', 'right'
 * @param {Object} options PhotoSwipe options
 * @param {Object} viewportSize PhotoSwipe viewport size, for example: { x:800, y:600 }
 * @returns {Number}
 */
function parsePaddingOption(prop, options, viewportSize) {
  let paddingValue;

  if (options.paddingFn) {
    paddingValue = options.paddingFn(viewportSize)[prop];
  } else if (options.padding) {
    paddingValue = options.padding[prop];
  } else {
    const legacyPropName = 'padding' + prop[0].toUpperCase() + prop.slice(1);
    if (options[legacyPropName]) {
      paddingValue = options[legacyPropName];
    }
  }

  return paddingValue || 0;
}


function getPanAreaSize(options, viewportSize/*, pswp*/) {
  return {
    x: viewportSize.x
      - parsePaddingOption('left', options, viewportSize)
      - parsePaddingOption('right', options, viewportSize),
    y: viewportSize.y
      - parsePaddingOption('top', options, viewportSize)
      - parsePaddingOption('bottom', options, viewportSize)
  };
}

/**
 * Calculates zoom levels for specific slide.
 * Depends on viewport size and image size.
 */

const MAX_IMAGE_WIDTH = 4000;

class ZoomLevel {
  /**
   * @param {Object} options PhotoSwipe options
   * @param {Object} itemData Slide data
   * @param {Integer} index Slide index
   * @param {PhotoSwipe|undefined} pswp PhotoSwipe instance, can be undefined if not initialized yet
   */
  constructor(options, itemData, index, pswp) {
    this.pswp = pswp;
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

    if (this.pswp) {
      this.pswp.dispatch('zoomLevelsUpdate', { zoomLevels: this, slideData: this.itemData });
    }
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

    // 3x of "fit" state, but not larger than original
    currZoomLevel = Math.min(1, this.fit * 3);

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
 * Returns cache key by slide index and data
 *
 * @param {Object} itemData
 * @param {Integer} index
 * @returns {String}
 */
function getKey(itemData, index) {
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
function lazyLoadData(itemData, instance, index) {
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
function lazyLoadSlide(index, instance) {
  const itemData = instance.getItemData(index);

  if (instance.dispatch('lazyLoadSlide', { index, itemData }).defaultPrevented) {
    return;
  }

  return lazyLoadData(itemData, instance, index);
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
 * gallery - Element | Element[] | NodeList | string selector for the gallery element
 * children - Element | Element[] | NodeList | string selector for the gallery children
 *
 */

class PhotoSwipeLightbox extends PhotoSwipeBase {
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
    const promiseArray = [dynamicImportModule(options.pswpModule)];

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
        ? new module.default(null, this.options) // eslint-disable-line
        : new module(null, this.options); // eslint-disable-line

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

    // same with content types
    pswp.contentTypes = { ...this.contentTypes };

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
      this.pswp.close();
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
export { Content, ImageContent };
//# sourceMappingURL=photoswipe-lightbox.esm.js.map
