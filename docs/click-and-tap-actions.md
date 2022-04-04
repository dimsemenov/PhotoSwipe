---
id: click-and-tap-actions
title: Click Actions
sidebar_label: Click actions
---

List of options:

- `imageClickAction` - click on image with mouse.
- `tapAction` - tap on PhotoSwipe viewport content (excluding buttons).
- `doubleTapAction` - double tap on anything. Tap delay is removed if this option is set to `false`.
- `bgClickAction` - click on area around image (background), with mouse.

## Supported action values

- `'zoom'` - zooms current image ([depending on secondary zoom level](adjusting-zoom-level.md)) (default `doubleTapAction`).
- `'zoom-or-close'` - image will be closed if it can not be zoomed (default `imageClickAction`).
- `'toggle-controls'` - toggle visibility of controls (default `tapAction`).
- `'next'` - move to the next slide
- `'close'` - close the gallery
- A Function that may perform any action, for example:

```js
imageClickAction: (releasePoint, e) => {}
```


## Click on image moves to the next slide

<PswpCodePreview galleryID="click-to-next">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  gallery:'#gallery--click-to-next',
  children:'a',

  imageClickAction: 'next',
  tapAction: 'next',
  
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.init();
```

</PswpCodePreview>


## Disable tap delay, click/tap to close

<PswpCodePreview galleryID="click-to-close">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  gallery:'#gallery--click-to-close',
  children:'a',

  initialZoomLevel: 'fill',
  secondaryZoomLevel: 'fit',

  imageClickAction: 'close',
  tapAction: 'close',

  // tap delay is removed if set to false
  doubleTapAction: false,
  
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.init();
```

```css pswpcode
/* override zoom cursor */
.pswp__img {
    cursor: pointer !important;
}
```

</PswpCodePreview>
