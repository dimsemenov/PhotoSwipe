export const counterIndicator = {
  name: 'counter',
  order: 5,
  onInit: (counterElement, pswp) => {
    pswp.on('change', () => {
      counterElement.innerHTML = (pswp.currIndex + 1)
                                  + pswp.options.indexIndicatorSep
                                  + pswp.getNumItems();
    });
  }
};
