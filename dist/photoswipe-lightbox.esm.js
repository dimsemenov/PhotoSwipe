/*!
  * PhotoSwipe Lightbox 5.3.4 - https://photoswipe.com
  * (c) 2022 Dmytro Semenov
  */
/** @typedef {import('../photoswipe.js').Point} Point */

/** @typedef {undefined | null | false | '' | 0} Falsy */
/** @typedef {keyof HTMLElementTagNameMap} HTMLElementTagName */

/**
 * @template {HTMLElementTagName | Falsy} [T="div"]
 * @template {Node | undefined} [NodeToAppendElementTo=undefined]
 * @param {string=} className
 * @param {T=} [tagName]
 * @param {NodeToAppendElementTo=} appendToEl
 * @returns {T extends HTMLElementTagName ? HTMLElementTagNameMap[T] : HTMLElementTagNameMap['div']}
 */
function createElement(className, tagName, appendToEl) {
  const el = document.createElement(tagName || 'div');
  if (className) {
    el.className = className;
  }
  if (appendToEl) {
    appendToEl.appendChild(el);
  }
  // @ts-expect-error
  return el;
}

/**
 * Get transform string
 *
 * @param {number} x
 * @param {number=} y
 * @param {number=} scale
 */
function toTransformString(x, y, scale) {
  let propValue = 'translate3d('
    + x + 'px,' + (y || 0) + 'px'
    + ',0)';

  if (scale !== undefined) {
    propValue += ' scale3d('
      + scale + ',' + scale
      + ',1)';
  }

  return propValue;
}

/**
 * Apply width and height CSS properties to element
 *
 * @param {HTMLElement} el
 * @param {string | number} w
 * @param {string | number} h
 */
function setWidthHeight(el, w, h) {
  el.style.width = (typeof w === 'number') ? (w + 'px') : w;
  el.style.height = (typeof h === 'number') ? (h + 'px') : h;
}

/** @typedef {LOAD_STATE[keyof LOAD_STATE]} LoadState */
/** @type {{ IDLE: 'idle'; LOADING: 'loading'; LOADED: 'loaded'; ERROR: 'error' }} */
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
 * @param {MouseEvent | KeyboardEvent} e
 */
function specialKeyUsed(e) {
  if (e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
    return true;
  }
}

/**
 * Parse `gallery` or `children` options.
 *
 * @param {import('../photoswipe.js').ElementProvider} option
 * @param {string=} legacySelector
 * @param {HTMLElement | Document} [parent]
 * @returns HTMLElement[]
 */
function getElementsFromOption(option, legacySelector, parent = document) {
  /** @type {HTMLElement[]} */
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

/**
 * Check if variable is PhotoSwipe class
 *
 * @param {any} fn
 */
function isPswpClass(fn) {
  return typeof fn === 'function'
    && fn.prototype
    && fn.prototype.goTo;
}

/**
 * Check if browser is Safari
 *
 * @returns {boolean}
 */
function isSafari() {
  return !!(navigator.vendor && navigator.vendor.match(/apple/i));
}

/** @typedef {import('../lightbox/lightbox.js').default} PhotoSwipeLightbox */
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../photoswipe.js').PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import('../photoswipe.js').DataSource} DataSource */
/** @typedef {import('../ui/ui-element.js').UIElementData} UIElementData */
/** @typedef {import('../slide/content.js').default} ContentDefault */
/** @typedef {import('../slide/slide.js').default} Slide */
/** @typedef {import('../slide/slide.js').SlideData} SlideData */
/** @typedef {import('../slide/zoom-level.js').default} ZoomLevel */
/** @typedef {import('../slide/get-thumb-bounds.js').Bounds} Bounds */

/**
 * Allow adding an arbitrary props to the Content
 * https://photoswipe.com/custom-content/#using-webp-image-format
 * @typedef {ContentDefault & Record<string, any>} Content
 */
/** @typedef {{ x?: number; y?: number }} Point */

/**
 * @typedef {Object} PhotoSwipeEventsMap https://photoswipe.com/events/
 *
 *
 * https://photoswipe.com/adding-ui-elements/
 *
 * @prop {undefined} uiRegister
 * @prop {{ data: UIElementData }} uiElementCreate
 *
 *
 * https://photoswipe.com/events/#initialization-events
 *
 * @prop {undefined} beforeOpen
 * @prop {undefined} firstUpdate
 * @prop {undefined} initialLayout
 * @prop {undefined} change
 * @prop {undefined} afterInit
 * @prop {undefined} bindEvents
 *
 *
 * https://photoswipe.com/events/#opening-or-closing-transition-events
 *
 * @prop {undefined} openingAnimationStart
 * @prop {undefined} openingAnimationEnd
 * @prop {undefined} closingAnimationStart
 * @prop {undefined} closingAnimationEnd
 *
 *
 * https://photoswipe.com/events/#closing-events
 *
 * @prop {undefined} close
 * @prop {undefined} destroy
 *
 *
 * https://photoswipe.com/events/#pointer-and-gesture-events
 *
 * @prop {{ originalEvent: PointerEvent }} pointerDown
 * @prop {{ originalEvent: PointerEvent }} pointerMove
 * @prop {{ originalEvent: PointerEvent }} pointerUp
 * @prop {{ bgOpacity: number }} pinchClose can be default prevented
 * @prop {{ panY: number }} verticalDrag can be default prevented
 *
 *
 * https://photoswipe.com/events/#slide-content-events
 *
 * @prop {{ content: Content }} contentInit
 * @prop {{ content: Content; isLazy: boolean }} contentLoad can be default prevented
 * @prop {{ content: Content; isLazy: boolean }} contentLoadImage can be default prevented
 * @prop {{ content: Content; slide: Slide; isError?: boolean }} loadComplete
 * @prop {{ content: Content; slide: Slide }} loadError
 * @prop {{ content: Content; width: number; height: number }} contentResize can be default prevented
 * @prop {{ content: Content; width: number; height: number; slide: Slide }} imageSizeChange
 * @prop {{ content: Content }} contentLazyLoad can be default prevented
 * @prop {{ content: Content }} contentAppend can be default prevented
 * @prop {{ content: Content }} contentActivate can be default prevented
 * @prop {{ content: Content }} contentDeactivate can be default prevented
 * @prop {{ content: Content }} contentRemove can be default prevented
 * @prop {{ content: Content }} contentDestroy can be default prevented
 *
 *
 * undocumented
 *
 * @prop {{ point: Point; originalEvent: PointerEvent }} imageClickAction can be default prevented
 * @prop {{ point: Point; originalEvent: PointerEvent }} bgClickAction can be default prevented
 * @prop {{ point: Point; originalEvent: PointerEvent }} tapAction can be default prevented
 * @prop {{ point: Point; originalEvent: PointerEvent }} doubleTapAction can be default prevented
 *
 * @prop {{ originalEvent: KeyboardEvent }} keydown can be default prevented
 * @prop {{ x: number; dragging: boolean }} moveMainScroll
 * @prop {{ slide: Slide }} firstZoomPan
 * @prop {{ slide: Slide, data: SlideData, index: number }} gettingData
 * @prop {undefined} beforeResize
 * @prop {undefined} resize
 * @prop {undefined} viewportSize
 * @prop {undefined} updateScrollOffset
 * @prop {{ slide: Slide }} slideInit
 * @prop {{ slide: Slide }} afterSetContent
 * @prop {{ slide: Slide }} slideLoad
 * @prop {{ slide: Slide }} appendHeavy can be default prevented
 * @prop {{ slide: Slide }} appendHeavyContent
 * @prop {{ slide: Slide }} slideActivate
 * @prop {{ slide: Slide }} slideDeactivate
 * @prop {{ slide: Slide }} slideDestroy
 * @prop {{ destZoomLevel: number, centerPoint: Point, transitionDuration: number | false }} beforeZoomTo
 * @prop {{ slide: Slide }} zoomPanUpdate
 * @prop {{ slide: Slide }} initialZoomPan
 * @prop {{ slide: Slide }} calcSlideSize
 * @prop {undefined} resolutionChanged
 * @prop {{ originalEvent: WheelEvent }} wheel can be default prevented
 * @prop {{ content: Content }} contentAppendImage can be default prevented
 * @prop {{ index: number; itemData: SlideData }} lazyLoadSlide can be default prevented
 * @prop {undefined} lazyLoad
 * @prop {{ slide: Slide }} calcBounds
 * @prop {{ zoomLevels: ZoomLevel, slideData: SlideData }} zoomLevelsUpdate
 *
 *
 * legacy
 *
 * @prop {undefined} init
 * @prop {undefined} initialZoomIn
 * @prop {undefined} initialZoomOut
 * @prop {undefined} initialZoomInEnd
 * @prop {undefined} initialZoomOutEnd
 * @prop {{ dataSource: DataSource, numItems: number }} numItems
 * @prop {{ itemData: SlideData; index: number }} itemData
 * @prop {{ index: number, itemData: SlideData, instance: PhotoSwipe }} thumbBounds
 */

/**
 * @typedef {Object} PhotoSwipeFiltersMap https://photoswipe.com/filters/
 *
 * @prop {(numItems: number, dataSource: DataSource) => number} numItems
 * Modify the total amount of slides. Example on Data sources page.
 * https://photoswipe.com/filters/#numitems
 *
 * @prop {(itemData: SlideData, index: number) => SlideData} itemData
 * Modify slide item data. Example on Data sources page.
 * https://photoswipe.com/filters/#itemdata
 *
 * @prop {(itemData: SlideData, element: HTMLElement, linkEl: HTMLAnchorElement) => SlideData} domItemData
 * Modify item data when it's parsed from DOM element. Example on Data sources page.
 * https://photoswipe.com/filters/#domitemdata
 *
 * @prop {(clickedIndex: number, e: MouseEvent, instance: PhotoSwipeLightbox) => number} clickedIndex
 * Modify clicked gallery item index.
 * https://photoswipe.com/filters/#clickedindex
 *
 * @prop {(placeholderSrc: string | false, content: Content) => string | false} placeholderSrc
 * Modify placeholder image source.
 * https://photoswipe.com/filters/#placeholdersrc
 *
 * @prop {(isContentLoading: boolean, content: Content) => boolean} isContentLoading
 * Modify if the content is currently loading.
 * https://photoswipe.com/filters/#iscontentloading
 *
 * @prop {(isContentZoomable: boolean, content: Content) => boolean} isContentZoomable
 * Modify if the content can be zoomed.
 * https://photoswipe.com/filters/#iscontentzoomable
 *
 * @prop {(useContentPlaceholder: boolean, content: Content) => boolean} useContentPlaceholder
 * Modify if the placeholder should be used for the content.
 * https://photoswipe.com/filters/#usecontentplaceholder
 *
 * @prop {(isKeepingPlaceholder: boolean, content: Content) => boolean} isKeepingPlaceholder
 * Modify if the placeholder should be kept after the content is loaded.
 * https://photoswipe.com/filters/#iskeepingplaceholder
 *
 *
 * @prop {(contentErrorElement: HTMLElement, content: Content) => HTMLElement} contentErrorElement
 * Modify an element when the content has error state (for example, if image cannot be loaded).
 * https://photoswipe.com/filters/#contenterrorelement
 *
 * @prop {(element: HTMLElement, data: UIElementData) => HTMLElement} uiElement
 * Modify a UI element that's being created.
 * https://photoswipe.com/filters/#uielement
 *
 * @prop {(thumbnail: HTMLElement, itemData: SlideData, index: number) => HTMLElement} thumbEl
 * Modify the thubmnail element from which opening zoom animation starts or ends.
 * https://photoswipe.com/filters/#thumbel
 *
 * @prop {(thumbBounds: Bounds, itemData: SlideData, index: number) => Bounds} thumbBounds
 * Modify the thubmnail bounds from which opening zoom animation starts or ends.
 * https://photoswipe.com/filters/#thumbbounds
 *
 * @prop {(srcsetSizesWidth: number, content: Content) => number} srcsetSizesWidth
 *
 */

/**
 * @template {keyof PhotoSwipeFiltersMap} T
 * @typedef {{ fn: PhotoSwipeFiltersMap[T], priority: number }} Filter<T>
 */

/**
 * @template {keyof PhotoSwipeEventsMap} T
 * @typedef {PhotoSwipeEventsMap[T] extends undefined ? PhotoSwipeEvent<T> : PhotoSwipeEvent<T> & PhotoSwipeEventsMap[T]} AugmentedEvent
 */

/**
 * @template {keyof PhotoSwipeEventsMap} T
 * @typedef {(event: AugmentedEvent<T>) => void} EventCallback<T>
 */

/**
 * Base PhotoSwipe event object
 *
 * @template {keyof PhotoSwipeEventsMap} T
 */
class PhotoSwipeEvent {
  /**
   * @param {T} type
   * @param {PhotoSwipeEventsMap[T]} [details]
   */
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
    /**
     * @type {{ [T in keyof PhotoSwipeEventsMap]?: ((event: AugmentedEvent<T>) => void)[] }}
     */
    this._listeners = {};

    /**
     * @type {{ [T in keyof PhotoSwipeFiltersMap]?: Filter<T>[] }}
     */
    this._filters = {};

    /** @type {PhotoSwipe=} */
    this.pswp = undefined;

    /** @type {PhotoSwipeOptions} */
    this.options = undefined;
  }

  /**
   * @template {keyof PhotoSwipeFiltersMap} T
   * @param {T} name
   * @param {PhotoSwipeFiltersMap[T]} fn
   * @param {number} priority
   */
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

  /**
   * @template {keyof PhotoSwipeFiltersMap} T
   * @param {T} name
   * @param {PhotoSwipeFiltersMap[T]} fn
   */
  removeFilter(name, fn) {
    if (this._filters[name]) {
      // @ts-expect-error
      this._filters[name] = this._filters[name].filter(filter => (filter.fn !== fn));
    }

    if (this.pswp) {
      this.pswp.removeFilter(name, fn);
    }
  }

  /**
   * @template {keyof PhotoSwipeFiltersMap} T
   * @param {T} name
   * @param {Parameters<PhotoSwipeFiltersMap[T]>} args
   * @returns {Parameters<PhotoSwipeFiltersMap[T]>[0]}
   */
  applyFilters(name, ...args) {
    if (this._filters[name]) {
      this._filters[name].forEach((filter) => {
        // @ts-expect-error
        args[0] = filter.fn.apply(this, args);
      });
    }
    return args[0];
  }

  /**
   * @template {keyof PhotoSwipeEventsMap} T
   * @param {T} name
   * @param {EventCallback<T>} fn
   */
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

  /**
   * @template {keyof PhotoSwipeEventsMap} T
   * @param {T} name
   * @param {EventCallback<T>} fn
   */
  off(name, fn) {
    if (this._listeners[name]) {
      // @ts-expect-error
      this._listeners[name] = this._listeners[name].filter(listener => (fn !== listener));
    }

    if (this.pswp) {
      this.pswp.off(name, fn);
    }
  }

  /**
   * @template {keyof PhotoSwipeEventsMap} T
   * @param {T} name
   * @param {PhotoSwipeEventsMap[T]} [details]
   * @returns {AugmentedEvent<T>}
   */
  dispatch(name, details) {
    if (this.pswp) {
      return this.pswp.dispatch(name, details);
    }

    const event = /** @type {AugmentedEvent<T>} */ (new PhotoSwipeEvent(name, details));

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

class Placeholder {
  /**
   * @param {string | false} imageSrc
   * @param {HTMLElement} container
   */
  constructor(imageSrc, container) {
    // Create placeholder
    // (stretched thumbnail or simple div behind the main image)
    this.element = createElement(
      'pswp__img pswp__img--placeholder',
      imageSrc ? 'img' : '',
      container
    );

    if (imageSrc) {
      /** @type {HTMLImageElement} */
      (this.element).decoding = 'async';
      /** @type {HTMLImageElement} */
      (this.element).alt = '';
      /** @type {HTMLImageElement} */
      (this.element).src = imageSrc;
      this.element.setAttribute('role', 'presentation');
    }

    this.element.setAttribute('aria-hidden', 'true');
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  setDisplayedSize(width, height) {
    if (!this.element) {
      return;
    }

    if (this.element.tagName === 'IMG') {
      // Use transform scale() to modify img placeholder size
      // (instead of changing width/height directly).
      // This helps with performance, specifically in iOS15 Safari.
      setWidthHeight(this.element, 250, 'auto');
      this.element.style.transformOrigin = '0 0';
      this.element.style.transform = toTransformString(0, 0, width / 250);
    } else {
      setWidthHeight(this.element, width, height);
    }
  }

  destroy() {
    if (this.element.parentNode) {
      this.element.remove();
    }
    this.element = null;
  }
}

/** @typedef {import('./slide.js').default} Slide */
/** @typedef {import('./slide.js').SlideData} SlideData */
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../util/util.js').LoadState} LoadState */

class Content {
  /**
   * @param {SlideData} itemData Slide data
   * @param {PhotoSwipe} instance PhotoSwipe or PhotoSwipeLightbox instance
   * @param {number} index
   */
  constructor(itemData, instance, index) {
    this.instance = instance;
    this.data = itemData;
    this.index = index;

    /** @type {HTMLImageElement | HTMLDivElement} */
    this.element = undefined;

    this.displayedImageWidth = 0;
    this.displayedImageHeight = 0;

    this.width = Number(this.data.w) || Number(this.data.width) || 0;
    this.height = Number(this.data.h) || Number(this.data.height) || 0;

    this.isAttached = false;
    this.hasSlide = false;
    /** @type {LoadState} */
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
      }, 1000);
    }
  }

  /**
   * Preload content
   *
   * @param {boolean=} isLazy
   * @param {boolean=} reload
   */
  load(isLazy, reload) {
    if (this.slide && this.usePlaceholder()) {
      if (!this.placeholder) {
        const placeholderSrc = this.instance.applyFilters(
          'placeholderSrc',
          // use  image-based placeholder only for the first slide,
          // as rendering (even small stretched thumbnail) is an expensive operation
          (this.data.msrc && this.slide.isFirstSlide) ? this.data.msrc : false,
          this
        );
        this.placeholder = new Placeholder(
          placeholderSrc,
          this.slide.container
        );
      } else {
        const placeholderEl = this.placeholder.element;
        // Add placeholder to DOM if it was already created
        if (placeholderEl && !placeholderEl.parentElement) {
          this.slide.container.prepend(placeholderEl);
        }
      }
    }

    if (this.element && !reload) {
      return;
    }

    if (this.instance.dispatch('contentLoad', { content: this, isLazy }).defaultPrevented) {
      return;
    }

    if (this.isImageContent()) {
      this.element = createElement('pswp__img', 'img');
      // Start loading only after width is defined, as sizes might depend on it.
      // Due to Safari feature, we must define sizes before srcset.
      if (this.displayedImageWidth) {
        this.loadImage(isLazy);
      }
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
   * @param {boolean} isLazy
   */
  loadImage(isLazy) {
    const imageElement = /** @type HTMLImageElement */ (this.element);

    if (this.instance.dispatch('contentLoadImage', { content: this, isLazy }).defaultPrevented) {
      return;
    }

    this.updateSrcsetSizes();

    if (this.data.srcset) {
      imageElement.srcset = this.data.srcset;
    }

    imageElement.src = this.data.src;

    imageElement.alt = this.data.alt || '';

    this.state = LOAD_STATE.LOADING;

    if (imageElement.complete) {
      this.onLoaded();
    } else {
      imageElement.onload = () => {
        this.onLoaded();
      };

      imageElement.onerror = () => {
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
        this.append();
        this.slide.updateContentSize(true);
      }

      if (this.state === LOAD_STATE.LOADED || this.state === LOAD_STATE.ERROR) {
        this.removePlaceholder();
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
   * @returns {boolean} If the content is image
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

    // eslint-disable-next-line max-len
    if (this.instance.dispatch('contentResize', { content: this, width, height }).defaultPrevented) {
      return;
    }

    setWidthHeight(this.element, width, height);

    if (this.isImageContent() && !this.isError()) {
      const isInitialSizeUpdate = (!this.displayedImageWidth && width);

      this.displayedImageWidth = width;
      this.displayedImageHeight = height;

      if (isInitialSizeUpdate) {
        this.loadImage(false);
      } else {
        this.updateSrcsetSizes();
      }

      if (this.slide) {
        // eslint-disable-next-line max-len
        this.instance.dispatch('imageSizeChange', { slide: this.slide, width, height, content: this });
      }
    }
  }

  /**
   * @returns {boolean} If the content can be zoomed
   */
  isZoomable() {
    return this.instance.applyFilters(
      'isContentZoomable',
      this.isImageContent() && (this.state !== LOAD_STATE.ERROR),
      this
    );
  }

  /**
   * Update image srcset sizes attribute based on width and height
   */
  updateSrcsetSizes() {
    // Handle srcset sizes attribute.
    //
    // Never lower quality, if it was increased previously.
    // Chrome does this automatically, Firefox and Safari do not,
    // so we store largest used size in dataset.
    // Handle srcset sizes attribute.
    //
    // Never lower quality, if it was increased previously.
    // Chrome does this automatically, Firefox and Safari do not,
    // so we store largest used size in dataset.
    if (this.data.srcset) {
      const image = /** @type HTMLImageElement */ (this.element);
      const sizesWidth = this.instance.applyFilters(
        'srcsetSizesWidth',
        this.displayedImageWidth,
        this
      );

      if (!image.dataset.largestUsedSize
          || sizesWidth > parseInt(image.dataset.largestUsedSize, 10)) {
        image.sizes = sizesWidth + 'px';
        image.dataset.largestUsedSize = String(sizesWidth);
      }
    }
  }

  /**
   * @returns {boolean} If content should use a placeholder (from msrc by default)
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
   */
  lazyLoad() {
    if (this.instance.dispatch('contentLazyLoad', { content: this }).defaultPrevented) {
      return;
    }

    this.load(true);
  }

  /**
   * @returns {boolean} If placeholder should be kept after content is loaded
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

    if (this.placeholder) {
      this.placeholder.destroy();
      this.placeholder = null;
    }

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
      /** @type {HTMLElement} */
      let errorMsgEl = createElement('pswp__error-msg');
      errorMsgEl.innerText = this.instance.options.errorMsg;
      errorMsgEl = this.instance.applyFilters(
        'contentErrorElement',
        errorMsgEl,
        this
      );
      this.element = createElement('pswp__content pswp__error-msg-container');
      this.element.appendChild(errorMsgEl);
      this.slide.container.innerText = '';
      this.slide.container.appendChild(this.element);
      this.slide.updateContentSize(true);
      this.removePlaceholder();
    }
  }

  /**
   * Append the content
   */
  append() {
    if (this.isAttached) {
      return;
    }

    this.isAttached = true;

    if (this.state === LOAD_STATE.ERROR) {
      this.displayError();
      return;
    }

    if (this.instance.dispatch('contentAppend', { content: this }).defaultPrevented) {
      return;
    }

    const supportsDecode = ('decode' in this.element);

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
      // We do not do this in Safari due to partial loading bug.
      if (supportsDecode && this.slide && (!this.slide.isActive || isSafari())) {
        this.isDecoding = true;
        // purposefully using finally instead of then,
        // as if srcset sizes changes dynamically - it may cause decode error
        /** @type {HTMLImageElement} */
        (this.element).decode().catch(() => {}).finally(() => {
          this.isDecoding = false;
          this.appendImage();
        });
      } else {
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
      if (this.isImageContent() && this.isDecoding && !isSafari()) {
        // add image to slide when it becomes active,
        // even if it's not finished decoding
        this.appendImage();
      } else if (this.isError()) {
        this.load(false, true); // try to reload
      }

      if (this.slide.holderElement) {
        this.slide.holderElement.setAttribute('aria-hidden', 'false');
      }
    }
  }

  /**
   * Deactivate the content
   */
  deactivate() {
    this.instance.dispatch('contentDeactivate', { content: this });
    if (this.slide && this.slide.holderElement) {
      this.slide.holderElement.setAttribute('aria-hidden', 'true');
    }
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

    if (this.placeholder && this.placeholder.element) {
      this.placeholder.element.remove();
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
    }

    if (this.state === LOAD_STATE.LOADED || this.state === LOAD_STATE.ERROR) {
      this.removePlaceholder();
    }
  }
}

/** @typedef {import('../photoswipe.js').PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../slide/slide.js').SlideData} SlideData */

/**
 * @param {PhotoSwipeOptions} options
 * @param {PhotoSwipe} pswp
 */
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
 * paddingFn: (viewportSize, itemData, index) => {
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
 * @param {'left' | 'top' | 'bottom' | 'right'} prop
 * @param {PhotoSwipeOptions} options PhotoSwipe options
 * @param {{ x?: number; y?: number }} viewportSize PhotoSwipe viewport size, for example: { x:800, y:600 }
 * @param {SlideData} itemData Data about the slide
 * @param {number} index Slide index
 * @returns {number}
 */
function parsePaddingOption(prop, options, viewportSize, itemData, index) {
  /** @type {number} */
  let paddingValue;

  if (options.paddingFn) {
    paddingValue = options.paddingFn(viewportSize, itemData, index)[prop];
  } else if (options.padding) {
    paddingValue = options.padding[prop];
  } else {
    const legacyPropName = 'padding' + prop[0].toUpperCase() + prop.slice(1);
    // @ts-expect-error
    if (options[legacyPropName]) {
      // @ts-expect-error
      paddingValue = options[legacyPropName];
    }
  }

  return paddingValue || 0;
}

/**
 * @param {PhotoSwipeOptions} options
 * @param {{ x?: number; y?: number }} viewportSize
 * @param {SlideData} itemData
 * @param {number} index
 */
function getPanAreaSize(options, viewportSize, itemData, index) {
  return {
    x: viewportSize.x
      - parsePaddingOption('left', options, viewportSize, itemData, index)
      - parsePaddingOption('right', options, viewportSize, itemData, index),
    y: viewportSize.y
      - parsePaddingOption('top', options, viewportSize, itemData, index)
      - parsePaddingOption('bottom', options, viewportSize, itemData, index)
  };
}

const MAX_IMAGE_WIDTH = 4000;

/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../photoswipe.js').PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import('../slide/slide.js').SlideData} SlideData */

/** @typedef {'fit' | 'fill' | number | ((zoomLevelObject: ZoomLevel) => number)} ZoomLevelOption */

/**
 * Calculates zoom levels for specific slide.
 * Depends on viewport size and image size.
 */
class ZoomLevel {
  /**
   * @param {PhotoSwipeOptions} options PhotoSwipe options
   * @param {SlideData} itemData Slide data
   * @param {number} index Slide index
   * @param {PhotoSwipe=} pswp PhotoSwipe instance, can be undefined if not initialized yet
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
   * @param {number} maxWidth
   * @param {number} maxHeight
   * @param {{ x?: number; y?: number }} panAreaSize
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
   * @private
   * @param {'initial' | 'secondary' | 'max'} optionPrefix Zoom level option prefix (initial, secondary, max)
   */
  _parseZoomLevelOption(optionPrefix) {
    // eslint-disable-next-line max-len
    const optionName = /** @type {'initialZoomLevel' | 'secondaryZoomLevel' | 'maxZoomLevel'} */ (optionPrefix + 'ZoomLevel');
    const optionValue = this.options[optionName];

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
   * @private
   * @return {number}
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
   * @private
   * @return {number}
   */
  _getInitial() {
    return this._parseZoomLevelOption('initial') || this.fit;
  }

  /**
   * Maximum zoom level when user zooms
   * via zoom/pinch gesture,
   * via cmd/ctrl-wheel or via trackpad.
   *
   * @private
   * @return {number}
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
 * Lazy-load an image
 * This function is used both by Lightbox and PhotoSwipe core,
 * thus it can be called before dialog is opened.
 *
 * @param {SlideData} itemData Data about the slide
 * @param {PhotoSwipe | PhotoSwipeLightbox | PhotoSwipeBase} instance PhotoSwipe instance
 * @param {number} index
 * @returns Image that is being decoded or false.
 */
function lazyLoadData(itemData, instance, index) {
  // src/slide/content/content.js
  const content = instance.createContentFromData(itemData, index);

  if (!content || !content.lazyLoad) {
    return;
  }

  const { options } = instance;

  // We need to know dimensions of the image to preload it,
  // as it might use srcset and we need to define sizes
  // @ts-expect-error should provide pswp instance?
  const viewportSize = instance.viewportSize || getViewportSize(options, instance);
  const panAreaSize = getPanAreaSize(options, viewportSize, itemData, index);

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
 * @param {number} index Slide index
 * @param {PhotoSwipe | PhotoSwipeLightbox} instance PhotoSwipe or PhotoSwipeLightbox eventable instance
 */
function lazyLoadSlide(index, instance) {
  const itemData = instance.getItemData(index);

  if (instance.dispatch('lazyLoadSlide', { index, itemData }).defaultPrevented) {
    return;
  }

  return lazyLoadData(itemData, instance, index);
}

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

/**
 * @template T
 * @typedef {import('../types.js').Type<T>} Type<T>
 */

/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../photoswipe.js').PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import('../photoswipe.js').DataSource} DataSource */
/** @typedef {import('../slide/content.js').default} Content */
/** @typedef {import('../core/eventable.js').PhotoSwipeEventsMap} PhotoSwipeEventsMap */
/** @typedef {import('../core/eventable.js').PhotoSwipeFiltersMap} PhotoSwipeFiltersMap */

/**
 * @template T
 * @typedef {import('../core/eventable.js').EventCallback<T>} EventCallback<T>
 */

/**
 * PhotoSwipe Lightbox
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
  /**
   * @param {PhotoSwipeOptions} options
   */
  constructor(options) {
    super();
    /** @type {PhotoSwipeOptions} */
    this.options = options || {};
    this._uid = 0;
  }

  /**
   * Initialize lightbox, should be called only once.
   * It's not included in the main constructor, so you may bind events before it.
   */
  init() {
    this.onThumbnailsClick = this.onThumbnailsClick.bind(this);

    // Bind click events to each gallery
    getElementsFromOption(this.options.gallery, this.options.gallerySelector)
      .forEach((galleryElement) => {
        galleryElement.addEventListener('click', this.onThumbnailsClick, false);
      });
  }

  /**
   * @param {MouseEvent} e
   */
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
      gallery: /** @type {HTMLElement} */ (e.currentTarget)
    };

    if (clickedIndex >= 0) {
      e.preventDefault();
      this.loadAndOpen(clickedIndex, dataSource, initialPoint);
    }
  }

  /**
   * Get index of gallery item that was clicked.
   *
   * @param {MouseEvent} e click event
   */
  getClickedIndex(e) {
    // legacy option
    if (this.options.getClickedIndexFn) {
      return this.options.getClickedIndexFn.call(this, e);
    }

    const clickedTarget = /** @type {HTMLElement} */ (e.target);
    const childElements = getElementsFromOption(
      this.options.children,
      this.options.childSelector,
      /** @type {HTMLElement} */ (e.currentTarget)
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
   * @param {number} index
   * @param {DataSource=} dataSource
   * @param {{ x?: number; y?: number }} [initialPoint]
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
   * @param {number} index
   * @param {DataSource=} dataSource
   */
  preload(index, dataSource) {
    const { options } = this;

    if (dataSource) {
      options.dataSource = dataSource;
    }

    // Add the main module
    /** @type {Promise<Type<PhotoSwipe>>[]} */
    const promiseArray = [];

    const pswpModuleType = typeof options.pswpModule;
    if (isPswpClass(options.pswpModule)) {
      promiseArray.push(Promise.resolve(/** @type {Type<PhotoSwipe>} */ (options.pswpModule)));
    } else if (pswpModuleType === 'string') {
      throw new Error('pswpModule as string is no longer supported');
    } else if (pswpModuleType === 'function') {
      promiseArray.push(/** @type {() => Promise<Type<PhotoSwipe>>} */ (options.pswpModule)());
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

  /**
   * @private
   * @param {Type<PhotoSwipe> | { default: Type<PhotoSwipe> }} module
   * @param {number} uid
   */
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

    /**
     * Pass data to PhotoSwipe and open init
     *
     * @type {PhotoSwipe}
     */
    const pswp = typeof module === 'object'
        ? new module.default(this.options) // eslint-disable-line
        : new module(this.options); // eslint-disable-line

    this.pswp = pswp;
    window.pswp = pswp;

    // map listeners from Lightbox to PhotoSwipe Core
    /** @type {(keyof PhotoSwipeEventsMap)[]} */
    (Object.keys(this._listeners)).forEach((name) => {
      this._listeners[name].forEach((fn) => {
        pswp.on(name, /** @type {EventCallback<typeof name>} */(fn));
      });
    });

    // same with filters
    /** @type {(keyof PhotoSwipeFiltersMap)[]} */
    (Object.keys(this._filters)).forEach((name) => {
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

  /**
   * Unbinds all events, closes PhotoSwipe if it's open.
   */
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

export { PhotoSwipeLightbox as default };
//# sourceMappingURL=photoswipe-lightbox.esm.js.map
