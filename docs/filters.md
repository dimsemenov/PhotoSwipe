---
id: filters
title: Filters
sidebar_label: Filters
---

Filters allow to modify data, they expect to have something returned back to them.

### numItems

Modify the total amount of slides. Example on [Data sources](/data-sources#custom-last-slide) page.

```js
lightbox.addFilter('numItems', (numItems, dataSource) => {
  return numItems;
});
```

### itemData

Modify slide item data. Example on [Data sources](/data-sources#custom-last-slide) page.

```js
lightbox.addFilter('itemData', (itemData, index) => {
  return itemData;
});
```

### domItemData

Modify item data when it's parsed from DOM element.  Example on [Data sources](/data-sources#custom-html-markup) page.

```js
lightbox.addFilter('domItemData', (itemData, element, linkEl) => {
  return itemData;
});
```

### clickedIndex

Modify clicked gallery item index.

```js
lightbox.addFilter('clickedIndex', (clickedIndex, e) => {
  return clickedIndex;
});
```

### placeholderSrc

Modify placeholder image source.

```js
lightbox.addFilter('placeholderSrc', (placeholderSrc, content) => {
  return placeholderSrc;
});
```

### isContentLoading

Modify if the content is currently loading.

```js
lightbox.addFilter('isContentLoading', (isContentLoading, content) => {
  return isContentLoading;
});
```

### isContentZoomable

Modify if the content can be zoomed.

```js
lightbox.addFilter('isContentZoomable', (isContentZoomable, content) => {
  return isContentZoomable;
});
```

### useContentPlaceholder

Modify if the placeholder should be used for the content.

```js
lightbox.addFilter('useContentPlaceholder', (useContentPlaceholder, content) => {
  return useContentPlaceholder;
});
```

### isKeepingPlaceholder

Modify if the placeholder should be kept after the content is loaded.

```js
lightbox.addFilter('isKeepingPlaceholder', (isKeepingPlaceholder, content) => {
  return isKeepingPlaceholder;
});
```

### contentErrorElement

Modify an element when the content has error state (for example, if image cannot be loaded).

<PswpCodePreview>

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--content-error-element',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.addFilter('contentErrorElement', (contentErrorElement, content) => {
  const el = document.createElement('div');
  el.className = 'pswp__error-msg';
  el.innerHTML = `<a href="${content.data.src}" target="_blank">The image #${content.slide.index + 1}</a> cannot be loaded</a>`;
  return el;
});
lightbox.init();
```

```html pswpcode 
<div class="pswp-gallery pswp-gallery--single-column" id="gallery--content-error-element">
  <a data-pswp-width="900" data-pswp-height="600" href="https://example.com/broken-image-link" target="_blank">
    <img src="https://dummyimage.com/300x200/555/fff/?text=404+1st" alt="">
  </a>
  <a data-pswp-width="1000" data-pswp-height="1000" href="https://dummyimage.com/1000x1000/555/fff/?text=1000x1000-2nd" target="_blank">
    <img src="https://dummyimage.com/100x100/555/fff/?text=100x100+2nd" alt="">
  </a>
  <a data-pswp-width="1200" data-pswp-height="800" href="https://example.com/another-broken-image-link" target="_blank">
    <img src="https://dummyimage.com/300x200/555/fff/?text=404+3rd" alt="">
  </a>
</div>
```

</PswpCodePreview>



### uiElement

Modify a UI element that's being created.

<PswpCodePreview galleryID="test-ui-element-filter">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-ui-element-filter',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.addFilter('uiElement', (element, data) => {
  if (data.name === 'arrowNext') {
    element.style.background = 'red';
  }
  return element;
});
lightbox.init();
```

</PswpCodePreview>


### thumbEl

Modify the thubmnail element from which opening zoom animation starts or ends.

```js
lightbox.addFilter('thumbEl', (thumbnail, itemData, index) => {
  return thumbnail;
});
```

### thumbBounds

Modify the thubmnail bounds from which opening zoom animation starts or ends.

```js
lightbox.addFilter('thumbBounds', (thumbBounds, itemData, index) => {
  return thumbBounds;
});
```