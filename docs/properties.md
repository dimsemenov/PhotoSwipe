---
id: properties
title: Properties
sidebar_label: Properties
---


*page is under construction*

When PhotoSwipe is open, you can access its instance globally via `window.pswp`.

<PswpCodePreview numItems="4" galleryID="custom-bg">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--custom-bg',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.init();

lightbox.on('beforeOpen', () => {
  console.log('PhotoSwipe Core instance:', lightbox.pswp);

  const { pswp } = lightbox;
  console.log('Options (read-only):', pswp.options);
});
lightbox.on('afterInit', () => {
  const { pswp } = lightbox;
  // Elements:
  console.log('Root element', pswp.element);
  console.log('Background element', pswp.bg);
  console.log('Scroll wrapper element', pswp.scrollWrap);
});
lightbox.on('change', () => {
  const { pswp } = lightbox;
  console.log('Slide index', pswp.currIndex);
  console.log('Slide object', pswp.currSlide);
  console.log('Slide object data', pswp.currSlide.data);
});
```

</PswpCodePreview>
