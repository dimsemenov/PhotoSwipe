import {
  createElement,
  equalizePoints,
  pointsEqual,
  clamp,
} from './util/util.js';

import DOMEvents from './util/dom-events.js';
import Slide from './slide/slide.js';
import Gestures from './gestures/gestures.js';
import MainScroll from './main-scroll.js';

import Keyboard from './keyboard.js';
import Animations from './util/animations.js';
import ScrollWheel from './scroll-wheel.js';
import UI from './ui/ui.js';
import { getViewportSize } from './util/viewport-size.js';
import { getThumbBounds } from './slide/get-thumb-bounds.js';
import PhotoSwipeBase from './core/base.js';
import Opener from './opener.js';
import ContentLoader from './slide/loader.js';

/** @typedef {any} PhotoSwipeLightbox TODO */
/** @typedef {'fit' | 'fill' | number | ((zoomLevelObject: any) => any)} ZoomLevel TODO */
/** @typedef {{ x?: number; y?: number; id?: string }} Point */
/** @typedef {{ x: number; y: number }} Size */
/** @typedef {{ top: number; bottom: number; left: number; right: number }} Padding */

/**
 * @typedef {Object} PhotoSwipeOptions
 *
 * @prop {PhotoSwipeItem[]} dataSource
 * @prop {boolean=} allowPanToNext
 * @prop {number=} spacing
 * @prop {boolean=} loop
 * @prop {boolean=} pinchToClose
 * @prop {boolean=} closeOnVerticalDrag
 * @prop {Padding=} padding
 * @prop {(viewportSize: Size, itemData: PhotoSwipeItem, index: number) => Padding} [paddingFn]
 * @prop {number=} hideAnimationDuration
 * @prop {number=} showAnimationDuration
 * @prop {number=} zoomAnimationDuration
 * @prop {'zoom' | 'fade' | 'none'} [showHideAnimationType]
 * @prop {boolean=} escKey
 * @prop {boolean=} arrowKeys
 * @prop {boolean=} returnFocus
 * @prop {number=} maxWidthToAnimate
 * @prop {boolean=} clickToCloseNonZoomable
 * @prop {string=} imageClickAction
 * @prop {string=} bgClickAction
 * @prop {string=} tapAction
 * @prop {string=} doubleTapAction
 * @prop {string=} indexIndicatorSep
 * @prop {number=} preloaderDelay
 * @prop {number=} panPaddingRatio
 * @prop {number=} bgOpacity
 * @prop {number=} index
 * @prop {string=} errorMsg
 * @prop {[number, number]=} preload
 * @prop {string=} easing
 * @prop {number=} paddingTop
 * @prop {number=} paddingBottom
 * @prop {number=} paddingLeft
 * @prop {number=} paddingRight
 * @prop {string=} gallerySelector
 * @prop {string=} childSelector
 * @prop {(pswp: PhotoSwipeLightbox, e: Event) => number} [getClickedIndexFn]
 * @prop {string=} arrowPrevSVG
 * @prop {string=} arrowNextSVG
 * @prop {string=} mainClass
 * @prop {string=} closeTitle
 * @prop {string=} zoomTitle
 * @prop {string=} arrowPrevTitle
 * @prop {string=} arrowNextTitle
 * @prop {boolean=} arrowPrev
 * @prop {boolean=} arrowNext
 * @prop {boolean=} zoom
 * @prop {boolean=} close
 * @prop {boolean=} counter
 * @prop {ZoomLevel=} initialZoomLevel
 * @prop {ZoomLevel=} secondaryZoomLevel
 * @prop {ZoomLevel=} maxZoomLevel
 * @prop {boolean=} mouseMovePan
 * @prop {Promise<any>} [openPromise] // TODO
 * @prop {HTMLElement=} appendToEl
 * @prop {Point | null} [initialPointerPos]
 * @prop {(options: PhotoSwipeOptions, pswp: PhotoSwipe) => { x: number; y: number }} [getViewportSizeFn]
 */

/**
 * @typedef {_PhotoSwipeItemProps & Record<string, any>} PhotoSwipeItem
 * @typedef {Object} _PhotoSwipeItemProps
 * @prop {HTMLElement=} element
 * @prop {string=} src
 * @prop {string=} srcset
 * @prop {number=} w
 * @prop {number=} h
 * @prop {string=} msrc
 * @prop {string=} alt
 * @prop {boolean=} thumbCropped
 * @prop {string=} html
 * @prop {'image' | 'html'} [type]
 * @prop {'image' | 'html'} [type]
 */

/** @type {Partial<PhotoSwipeOptions>} */
const defaultOptions = {
  allowPanToNext: true,
  spacing: 0.1,
  loop: true,
  pinchToClose: true,
  closeOnVerticalDrag: true,
  hideAnimationDuration: 333,
  showAnimationDuration: 333,
  zoomAnimationDuration: 333,
  escKey: true,
  arrowKeys: true,
  returnFocus: true,
  maxWidthToAnimate: 4000,
  clickToCloseNonZoomable: true,
  imageClickAction: 'zoom-or-close',
  bgClickAction: 'close',
  tapAction: 'toggle-controls',
  doubleTapAction: 'zoom',
  indexIndicatorSep: ' / ',
  preloaderDelay: 2000,
  bgOpacity: 0.8,

  index: 0,
  errorMsg: 'The image cannot be loaded',
  preload: [1, 2],
  easing: 'cubic-bezier(.4,0,.22,1)'
};

class PhotoSwipe extends PhotoSwipeBase {
  /**
   * @param {PhotoSwipeOptions} options
   */
  constructor(options) {
    super();

    this._prepareOptions(options);

    /**
     * offset of viewport relative to document
     *
     * @type {{ x?: number; y?: number }}
     */
    this.offset = {};

    /**
     * @type {{ x?: number; y?: number }}
     * @private
     */
    this._prevViewportSize = {};

    /**
     * Size of scrollable PhotoSwipe viewport
     *
     * @type {{ x?: number; y?: number }}
     */
    this.viewportSize = {};

    /**
     * background (backdrop) opacity
     *
     * @type {number}
     */
    this.bgOpacity = 1;

    this.events = new DOMEvents();

    /** @type {Animations} */
    this.animations = new Animations();

    this.mainScroll = new MainScroll(this);
    this.gestures = new Gestures(this);
    this.opener = new Opener(this);
    this.keyboard = new Keyboard(this);
    this.contentLoader = new ContentLoader(this);
  }

  init() {
    if (this.isOpen || this.isDestroying) {
      return;
    }

    this.isOpen = true;
    this.dispatch('init'); // legacy
    this.dispatch('beforeOpen');

    this._createMainStructure();

    // add classes to the root element of PhotoSwipe
    let rootClasses = 'pswp--open';
    if (this.gestures.supportsTouch) {
      rootClasses += ' pswp--touch';
    }
    if (this.options.mainClass) {
      rootClasses += ' ' + this.options.mainClass;
    }
    this.element.className += ' ' + rootClasses;

    this.currIndex = this.options.index || 0;
    this.potentialIndex = this.currIndex;
    this.dispatch('firstUpdate'); // starting index can be modified here

    // initialize scroll wheel handler to block the scroll
    this.scrollWheel = new ScrollWheel(this);

    // sanitize index
    if (Number.isNaN(this.currIndex)
        || this.currIndex < 0
        || this.currIndex >= this.getNumItems()) {
      this.currIndex = 0;
    }

    if (!this.gestures.supportsTouch) {
      // enable mouse features if no touch support detected
      this.mouseDetected();
    }

    // causes forced synchronous layout
    this.updateSize();

    this.offset.y = window.pageYOffset;

    this._initialItemData = this.getItemData(this.currIndex);
    // @ts-expect-error TODO
    this.dispatch('gettingData', this.currIndex, this._initialItemData, true);

    // *Layout* - calculate size and position of elements here
    this._initialThumbBounds = this.getThumbBounds();
    this.dispatch('initialLayout');

    this.on('openingAnimationEnd', () => {
      // Add content to the previous and next slide
      this.setContent(this.mainScroll.itemHolders[0], this.currIndex - 1);
      this.setContent(this.mainScroll.itemHolders[2], this.currIndex + 1);

      this.mainScroll.itemHolders[0].el.style.display = 'block';
      this.mainScroll.itemHolders[2].el.style.display = 'block';

      this.appendHeavy();

      this.contentLoader.updateLazy();

      this.events.add(window, 'resize', this._handlePageResize.bind(this));
      this.events.add(window, 'scroll', this._updatePageScrollOffset.bind(this));
      this.dispatch('bindEvents');
    });

    // set content for center slide (first time)
    this.setContent(this.mainScroll.itemHolders[1], this.currIndex);
    this.dispatch('change');

    this.opener.open();

    this.dispatch('afterInit');

    return true;
  }

  /**
   * Get looped slide index
   * (for example, -1 will return the last slide)
   *
   * @param {number} index
   */
  getLoopedIndex(index) {
    const numSlides = this.getNumItems();

    if (this.options.loop) {
      if (index > numSlides - 1) {
        index -= numSlides;
      }

      if (index < 0) {
        index += numSlides;
      }
    }

    index = clamp(index, 0, numSlides - 1);

    return index;
  }

  appendHeavy() {
    this.mainScroll.itemHolders.forEach((itemHolder) => {
      if (itemHolder.slide) {
        itemHolder.slide.appendHeavy();
      }
    });
  }

  /**
   * Change the slide
   * @param  {number} index New index
   */
  goTo(index) {
    this.mainScroll.moveIndexBy(
      this.getLoopedIndex(index) - this.potentialIndex
    );
  }

  /**
   * Go to the next slide.
   */
  next() {
    this.goTo(this.potentialIndex + 1);
  }

  /**
   * Go to the previous slide.
   */
  prev() {
    this.goTo(this.potentialIndex - 1);
  }

  /**
   * @see slide/slide.js zoomTo
   * TODO
   *
   * @param {any[]} args
   */
  zoomTo(...args) {
    this.currSlide.zoomTo(...args);
  }

  /**
   * @see slide/slide.js toggleZoom
   */
  toggleZoom() {
    this.currSlide.toggleZoom();
  }

  /**
   * Close the gallery.
   * After closing transition ends - destroy it
   */
  close() {
    if (!this.opener.isOpen || this.isDestroying) {
      return;
    }

    this.isDestroying = true;

    this.dispatch('close');

    this.events.removeAll();
    this.opener.close();
  }

  /**
   * Destroys the gallery:
   * - instantly closes the gallery
   * - unbinds events,
   * - cleans intervals and timeouts
   * - removes elements from DOM
   */
  destroy() {
    if (!this.isDestroying) {
      this.options.showHideAnimationType = 'none';
      this.close();
      return;
    }

    this.dispatch('destroy');

    this.listeners = null;

    this.scrollWrap.ontouchmove = null;
    this.scrollWrap.ontouchend = null;

    this.element.remove();

    this.mainScroll.itemHolders.forEach((itemHolder) => {
      if (itemHolder.slide) {
        itemHolder.slide.destroy();
      }
    });

    this.contentLoader.destroy();
    this.events.removeAll();
  }

  /**
   * Refresh/reload content of a slide by its index
   *
   * @param {number} slideIndex
   */
  refreshSlideContent(slideIndex) {
    this.contentLoader.removeByIndex(slideIndex);
    this.mainScroll.itemHolders.forEach((itemHolder, i) => {
      let potentialHolderIndex = this.currSlide.index - 1 + i;
      if (this.canLoop()) {
        potentialHolderIndex = this.getLoopedIndex(potentialHolderIndex);
      }
      if (potentialHolderIndex === slideIndex) {
        // set the new slide content
        this.setContent(itemHolder, slideIndex, true);

        // activate the new slide if it's current
        if (i === 1) {
          this.currSlide = itemHolder.slide;
          itemHolder.slide.setIsActive(true);
        }
      }
    });

    this.dispatch('change');
  }


  /**
   * Set slide content
   *
   * @param {Record<string, any>} holder TODO mainScroll.itemHolders array item
   * @param {number} index Slide index
   * @param {boolean=} force If content should be set even if index wasn't changed
   */
  setContent(holder, index, force) {
    if (this.canLoop()) {
      index = this.getLoopedIndex(index);
    }

    if (holder.slide) {
      if (holder.slide.index === index && !force) {
        // exit if holder already contains this slide
        // this could be common when just three slides are used
        return;
      }

      // destroy previous slide
      holder.slide.destroy();
      holder.slide = null;
    }

    // exit if no loop and index is out of bounds
    if (!this.canLoop() && (index < 0 || index >= this.getNumItems())) {
      return;
    }

    const itemData = this.getItemData(index);
    holder.slide = new Slide(itemData, index, this);

    // set current slide
    if (index === this.currIndex) {
      this.currSlide = holder.slide;
    }

    holder.slide.append(holder.el);
  }

  getViewportCenterPoint() {
    return {
      x: this.viewportSize.x / 2,
      y: this.viewportSize.y / 2
    };
  }

  /**
   * Update size of all elements.
   * Executed on init and on page resize.
   *
   * @param {boolean=} force Update size even if size of viewport was not changed.
   */
  updateSize(force) {
    // let item;
    // let itemIndex;

    if (this.isDestroying) {
      // exit if PhotoSwipe is closed or closing
      // (to avoid errors, as resize event might be delayed)
      return;
    }

    //const newWidth = this.scrollWrap.clientWidth;
    //const newHeight = this.scrollWrap.clientHeight;

    const newViewportSize = getViewportSize(this.options, this);

    if (!force && pointsEqual(newViewportSize, this._prevViewportSize)) {
      // Exit if dimensions were not changed
      return;
    }

    //this._prevViewportSize.x = newWidth;
    //this._prevViewportSize.y = newHeight;
    equalizePoints(this._prevViewportSize, newViewportSize);

    this.dispatch('beforeResize');

    equalizePoints(this.viewportSize, this._prevViewportSize);

    this._updatePageScrollOffset();

    this.dispatch('viewportSize');

    // Resize slides only after opener animation is finished
    // and don't re-calculate size on inital size update
    this.mainScroll.resize(this.opener.isOpen);

    if (!this.hasMouse && window.matchMedia('(any-hover: hover)').matches) {
      this.mouseDetected();
    }

    this.dispatch('resize');
  }

  /**
   * @param {number} opacity
   */
  applyBgOpacity(opacity) {
    this.bgOpacity = Math.max(opacity, 0);
    this.bg.style.opacity = String(this.bgOpacity * this.options.bgOpacity);
  }

  /**
   * Whether mouse is detected
   */
  mouseDetected() {
    if (!this.hasMouse) {
      this.hasMouse = true;
      this.element.classList.add('pswp--has_mouse');
    }
  }

  /**
   * Page resize event handler
   *
   * @private
   */
  _handlePageResize() {
    this.updateSize();

    // In iOS webview, if element size depends on document size,
    // it'll be measured incorrectly in resize event
    //
    // https://bugs.webkit.org/show_bug.cgi?id=170595
    // https://hackernoon.com/onresize-event-broken-in-mobile-safari-d8469027bf4d
    if (/iPhone|iPad|iPod/i.test(window.navigator.userAgent)) {
      setTimeout(() => {
        this.updateSize();
      }, 500);
    }
  }

  /**
   * Page scroll offset is used
   * to get correct coordinates
   * relative to PhotoSwipe viewport.
   *
   * @private
   */
  _updatePageScrollOffset() {
    this.setScrollOffset(0, window.pageYOffset);
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  setScrollOffset(x, y) {
    this.offset.x = x;
    this.offset.y = y;
    this.dispatch('updateScrollOffset');
  }

  /**
   * Create main HTML structure of PhotoSwipe,
   * and add it to DOM
   *
   * @private
   */
  _createMainStructure() {
    // root DOM element of PhotoSwipe (.pswp)
    this.element = createElement('pswp');
    this.element.setAttribute('tabindex', '-1');
    this.element.setAttribute('role', 'dialog');

    // template is legacy prop
    this.template = this.element;

    // Background is added as a separate element,
    // as animating opacity is faster than animating rgba()
    this.bg = createElement('pswp__bg', false, this.element);
    this.scrollWrap = createElement('pswp__scroll-wrap', false, this.element);
    this.container = createElement('pswp__container', false, this.scrollWrap);

    this.mainScroll.appendHolders();

    this.ui = new UI(this);
    this.ui.init();

    // append to DOM
    (this.options.appendToEl || document.body).appendChild(this.element);
  }


  /**
   * Get position and dimensions of small thumbnail
   *   {x:,y:,w:}
   *
   * Height is optional (calculated based on the large image)
   */
  getThumbBounds() {
    return getThumbBounds(
      this.currIndex,
      this.currSlide ? this.currSlide.data : this._initialItemData,
      this
    );
  }

  /**
   * If the PhotoSwipe can have continious loop
   * @returns Boolean
   */
  canLoop() {
    return (this.options.loop && this.getNumItems() > 2);
  }

  /**
   * @param {PhotoSwipeOptions} options
   * @private
   */
  _prepareOptions(options) {
    if (window.matchMedia('(prefers-reduced-motion), (update: slow)').matches) {
      options.showHideAnimationType = 'none';
      options.zoomAnimationDuration = 0;
    }

    /** @type {PhotoSwipeOptions}*/
    this.options = {
      ...defaultOptions,
      ...options
    };
  }
}

export default PhotoSwipe;
