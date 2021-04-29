// Delay before indicator will be shown
// (if image is loaded during it - the indicator will not be displayed at all)
const SHOW_DELAY = 1100; // ms

// Loading indicator fade-out duration
const FADE_OUT_DURATION = 350; // ms

// Indicator width/height, used for centering
// (it can not be centered via CSS,
//  as viewport might be adjusted via JS padding option)
const INDICATOR_SIZE = 24;

export const loadingIndicator = {
  name: 'preloader',
  appendTo: 'wrapper',
  onInit: (indicatorElement, pswp) => {
    let isVisible;
    let delayTimeout;
    let hidingTimeout;

    const updateIndicatorPosition = () => {
      if (isVisible) {
        indicatorElement.style.left = Math.round((pswp.viewportSize.x - INDICATOR_SIZE) / 2) + 'px';
        indicatorElement.style.top = Math.round((pswp.viewportSize.y - INDICATOR_SIZE) / 2) + 'px';
      }
    };

    const toggleIndicatorClass = (className, add) => {
      indicatorElement.classList[add ? 'add' : 'remove']('pswp__preloader--' + className);
    };

    const setIndicatorVisibility = (visible) => {
      if (isVisible !== visible) {
        isVisible = visible;

        clearTimeout(hidingTimeout);
        toggleIndicatorClass('hiding', !visible);

        if (!visible) {
          // Fade out
          hidingTimeout = setTimeout(() => {
            toggleIndicatorClass('active', false);
          }, FADE_OUT_DURATION);
        } else {
          updateIndicatorPosition();
          // Fade in
          toggleIndicatorClass('active', true);
        }
      }
    };

    pswp.on('change', () => {
      if (!pswp.currSlide.isLoading) {
        setIndicatorVisibility(false);
        return;
      }

      clearTimeout(delayTimeout);

      // display loading indicator with delay
      delayTimeout = setTimeout(() => {
        setIndicatorVisibility(pswp.currSlide.isLoading);
      }, SHOW_DELAY);
    });

    pswp.on('loadComplete', (e) => {
      if (pswp.currSlide === e.slide) {
        setIndicatorVisibility(false);
      }
    });

    pswp.on('resize', updateIndicatorPosition);
  }
};
