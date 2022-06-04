/** @type {import('./ui-element.js').UIElementData} UIElementData */
export const counterIndicator = {
  name: 'counter',
  order: 5,
  onInit: (counterElement, pswp) => {
    pswp.on('change', () => {
      counterElement.innerText = (pswp.currIndex + 1)
                                  + pswp.options.indexIndicatorSep
                                  + pswp.getNumItems();
    });
  }
};
