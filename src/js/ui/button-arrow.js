/*
  Backward and forward arrow buttons
 */

/** @typedef {import('./ui-element.js').UIElementData} UIElementData */
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */

/**
 *
 * @param {HTMLElement} element
 * @param {PhotoSwipe} pswp
 * @param {boolean} [isNextButton]
 */
function initArrowButton(element, pswp, isNextButton) {
  element.classList.add('pswp__button--arrow');
  // TODO: this should point to a unique id for this instance
  element.setAttribute('aria-controls', 'pswp__items');
  pswp.on('change', () => {
    if (!pswp.options.loop) {
      if (isNextButton) {
        /** @type {HTMLButtonElement} */
        (element).disabled = !(pswp.currIndex < pswp.getNumItems() - 1);
      } else {
        /** @type {HTMLButtonElement} */
        (element).disabled = !(pswp.currIndex > 0);
      }
    }
  });
}

const iconPath = 'M29 43l-3 3-16-16 16-16 3 3-13 13 13 13z';

/** @type {UIElementData} */
export const arrowPrev = {
  name: 'arrowPrev',
  className: 'pswp__button--arrow--prev',
  title: 'Previous',
  order: 10,
  isButton: true,
  appendTo: 'wrapper',
  html: {
    isCustomSVG: true,
    size: 60,
    inner: `<path d="${iconPath}" id="pswp__icn-arrow-prev"/>`,
    outlineID: 'pswp__icn-arrow-prev'
  },
  onClick: 'prev',
  onInit: initArrowButton
};

/** @type {UIElementData} */
export const arrowNext = {
  name: 'arrowNext',
  className: 'pswp__button--arrow--next',
  title: 'Next',
  order: 11,
  isButton: true,
  appendTo: 'wrapper',
  html: {
    isCustomSVG: true,
    size: 60,
    inner: `<path d="${iconPath}" id="pswp__icn-arrow-next"/>`,
    outlineID: 'pswp__icn-arrow-next'
  },
  onClick: 'next',
  onInit: (el, pswp) => {
    initArrowButton(el, pswp, true);
  }
};
