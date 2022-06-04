/** @type {import('./ui-element.js').UIElementData} UIElementData */
export const loadingIndicator = {
  name: 'preloader',
  appendTo: 'bar',
  order: 7,
  html: {
    isCustomSVG: true,
    // eslint-disable-next-line max-len
    inner: '<path fill-rule="evenodd" clip-rule="evenodd" d="M21.2 16a5.2 5.2 0 1 1-5.2-5.2V8a8 8 0 1 0 8 8h-2.8Z" id="pswp__icn-loading"/>',
    outlineID: 'pswp__icn-loading'
  },
  onInit: (indicatorElement, pswp) => {
    /** @type {boolean} */
    let isVisible;
    /** @type {NodeJS.Timeout} */
    let delayTimeout;

    /**
     * @param {string} className
     * @param {boolean} add
     */
    const toggleIndicatorClass = (className, add) => {
      indicatorElement.classList[add ? 'add' : 'remove']('pswp__preloader--' + className);
    };

    /**
     * @param {boolean} visible
     */
    const setIndicatorVisibility = (visible) => {
      if (isVisible !== visible) {
        isVisible = visible;
        toggleIndicatorClass('active', visible);
      }
    };

    const updatePreloaderVisibility = () => {
      if (!pswp.currSlide.content.isLoading()) {
        setIndicatorVisibility(false);
        if (delayTimeout) {
          clearTimeout(delayTimeout);
          delayTimeout = null;
        }
        return;
      }

      if (!delayTimeout) {
        // display loading indicator with delay
        delayTimeout = setTimeout(() => {
          setIndicatorVisibility(pswp.currSlide.content.isLoading());
          delayTimeout = null;
        }, pswp.options.preloaderDelay);
      }
    };

    pswp.on('change', updatePreloaderVisibility);

    pswp.on('loadComplete', (e) => {
      if (pswp.currSlide === e.slide) {
        updatePreloaderVisibility();
      }
    });

    // expose the method
    pswp.ui.updatePreloaderVisibility = updatePreloaderVisibility;
  }
};
