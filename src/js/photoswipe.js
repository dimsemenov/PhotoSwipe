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
  limitMaxZoom: true,

  clickToCloseNonZoomable: true,
  imageClickAction: 'zoom-or-close',
  bgClickAction: 'close',
  tapAction: 'toggle-controls',
  doubleTapAction: 'zoom',

  indexIndicatorSep: ' / ',
  
  preloaderDelay: 2000,

  bgOpacity: 0.8,

  index: 0,
  errorMsg: '<div class="pswp__error-msg"><a href="" target="_blank">The image</a> could not be loaded.</div>',
  preload: [1, 2],
  easing: 'cubic-bezier(.4,0,.22,1)'
};

class PhotoSwipe extends PhotoSwipeBase {
  constructor(items, options) {
    super();

    this.items = items;

    this._prepareOptions(options);

    // offset of viewport relative to document
    this.offset = {};

    this._prevViewportSize = {};

    // Size of scrollable PhotoSwipe viewport
    this.viewportSize = {};

    // background (backdrop) opacity
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

    if (this.getNumItems() < 3) {
      // disable loop if less than 3 items,
      // as we do not clone slides
      this.options.loop = false;
    }

    this.dispatch('init');

    this._createMainStructure();

    // init modules
    // _modules.forEach(function (module) {
    //   module();
    // });

    // add classes to the root element of PhotoSwipe
    let rootClasses = 'pswp--open';
    if (this.gestures.supportsTouch) {
      rootClasses += ' pswp--touch';
    }
    if (!this.options.allowMouseDrag) {
      rootClasses += ' pswp--no-mouse-drag';
    }
    if (this.options.mainClass) {
      rootClasses += ' ' + this.options.mainClass;
    }
    this.template.className += ' ' + rootClasses;

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
    this.dispatch('gettingData', this.currIndex, this._initialItemData, true);

    // *Layout* - calculate size and position of elements here
    this._initialThumbBounds = this.getThumbBounds();
    this.dispatch('initialLayout');

    this.on('initialZoomInEnd', () => {
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

    // remove placeholder when slide is loaded
    this.on('loadComplete', (e) => {
      if (e.slide.heavyAppended) {
        e.slide.removePlaceholder();
      }
    });

    this.on('loadError', (e) => {
      if (e.slide.heavyAppended) {
        e.slide.removePlaceholder();
        e.slide.displayError();
      }
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
   * @param {Integer} index
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

  /**
   * Get the difference between current index and provided index.
   * Used to determine the direction of movement
   * or if slide should be moved at all.
   *
   * @param {Integer} index
   */
  getIndexDiff(index) {
    if (this.options.loop) {
      const lastItemIndex = this.getNumItems() - 1;
      // Moving from the last to the first or vice-versa:
      if (this.currIndex === 0 && index === lastItemIndex) {
        // go back one slide
        return -1;
      } if (this.currIndex === lastItemIndex && index === 0) {
        // go forward one slide
        return 1;
      }
    }

    return index - this.currIndex;
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
   * @param  {Integer} New index
   */
  goTo(index) {
    index = this.getLoopedIndex(index);

    // TODO: allow to pause the event propagation?

    const indexChanged = this.mainScroll.moveIndexBy(index - this.potentialIndex);
    if (indexChanged) {
      this.dispatch('afterGoto');
    }
  }

  /**
   * Go to the next slide.
   */
  next() {
    this.goTo(this.potentialIndex + 1);
  }

  /**
   * Go to the next slide.
   */
  prev() {
    this.goTo(this.potentialIndex - 1);
  }

  /**
   * @see slide/slide.js zoomTo
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
   * - unbinds events,
   * - cleans intervals and timeouts
   * - removes elements from DOM
   */
  destroy() {
    if (!this.isDestroying) {
      this.close();
      return;
    }

    this.dispatch('destroy');

    this.listeners = null;

    this.scrollWrap.ontouchmove = null;
    this.scrollWrap.ontouchend = null;

    this.template.remove();
    this.contentLoader.destroy();
    this.events.removeAll();
  }

  setContent(holder, index) {
    // destroy previous slide to clean the memory
    if (holder.slide) {
      holder.slide.destroy();
    }

    if (this.options.loop) {
      index = this.getLoopedIndex(index);
    } else if (index < 0 || index >= this.getNumItems()) {
      // empty holder
      holder.el.innerHTML = '';
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
   * @param  {Boolean} force Update size even if size of viewport was not changed.
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

  applyBgOpacity(opacity) {
    this.bgOpacity = Math.max(opacity, 0);
    this.bg.style.opacity = this.bgOpacity * this.options.bgOpacity;
  }

  /**
   * Whether mouse is detected
   */
  mouseDetected() {
    if (!this.hasMouse) {
      this.hasMouse = true;
      this.template.classList.add('pswp--has_mouse');
    }
  }

  /**
   * Page resize event handler
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
   */
  _updatePageScrollOffset() {
    this.setScrollOffset(0, window.pageYOffset);
  }

  setScrollOffset(x, y) {
    this.offset.x = x;
    this.offset.y = y;
    this.dispatch('updateScrollOffset');
  }

  /**
   * Create main HTML structure of PhotoSwipe,
   * and add it to DOM
   */
  _createMainStructure() {
    // root DOM element of PhotoSwipe (.pswp)
    this.template = createElement('pswp');
    this.template.setAttribute('tabindex', -1);
    this.template.setAttribute('role', 'dialog');

    // Background is added as a separate element,
    // as animating opacity is faster than animating rgba()
    this.bg = createElement('pswp__bg', false, this.template);
    this.scrollWrap = createElement('pswp__scroll-wrap', false, this.template);
    this.container = createElement('pswp__container', false, this.scrollWrap);

    this.mainScroll.appendHolders();

    this.ui = new UI(this);
    this.ui.init();

    // append to DOM
    (this.options.appendToEl || document.body).appendChild(this.template);
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

  _prepareOptions(options) {
    if (window.matchMedia('(prefers-reduced-motion), (update: slow)').matches) {
      options.showHideAnimationType = 'none';
      options.zoomAnimationDuration = 0;
    }

    this.options = {
      ...defaultOptions,
      ...options
    };
  }
}

export default PhotoSwipe;
export { default as Content } from './slide/content/content.js';
export { default as ImageContent } from './slide/content/image.js';
