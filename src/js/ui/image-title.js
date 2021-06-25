export const imageTitle = {
  name: 'title',
  title: 'Title',
  class: 'image--title',
  order: 6,
  onInit: (titleElement, pswp) => {
    pswp.on('change', () => {
      titleElement.innerHTML = pswp.currItemData.alt;
    });
  }
};
