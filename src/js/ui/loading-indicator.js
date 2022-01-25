export const loadingIndicator = {
  name: 'preloader',
  appendTo: 'bar',
  order: 7,
  html: {
    isCustomSVG: true,
    inner: '<path fill-rule="evenodd" clip-rule="evenodd" d="M21.2 16a5.2 5.2 0 1 1-5.2-5.2V8a8 8 0 1 0 8 8h-2.8Z" id="pswp__icn-loading"/>',
    outlineID: 'pswp__icn-loading'
  },
  onInit: (indicatorElement, pswp) => {
    let isVisible;
    let delayTimeout;

    const toggleIndicatorClass = (className, add) => {
      indicatorElement.classList[add ? 'add' : 'remove']('pswp__preloader--' + className);
    };

    const setIndicatorVisibility = (visible) => {
      if (isVisible !== visible) {
        isVisible = visible;
        toggleIndicatorClass('active', visible);
      }
    };

    const updatePreloaderVisibility = () => {
      if (!pswp.currSlide.isLoading()) {
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
          setIndicatorVisibility(pswp.currSlide.isLoading());
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
