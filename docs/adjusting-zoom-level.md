---
id: adjusting-zoom-level
title: Adjusting Zoom Level
sidebar_label: Adjusting zoom level
---

Photoswipe has three zoom level options:

- `initialZoomLevel` - zoom level when photoswipe is opened.
- `secondaryZoomLevel` - zoom level when user clicks "zoom" button, double-taps image, or clicks an image. If it equals to initial - secondary zoom functionality is disabled.
- `maxZoomLevel` - maximum zoom level when user zooms via zoom/pinch gesture, via ctrl-wheel or via trackpad. Always highest among three.


## Supported values

Each zoom level option can be:

- A positive `Number`, where `1` is original image size.
- A `String`:
  - `'fit'` - image fits into viewport. 
  - `'fill'` - image fills the viewport (similar to `background-size:cover`).
  - In both cases image will not be larger than original.
- A `Function` that should return number. Use it to define dynamic zoom level. Function is called separately for each image when it is rendered, or resized, or lazy-loaded. For example to set custom `secondaryZoomLevel`:

```js
secondaryZoomLevel: (zoomLevelObject) => {
  // zoomLevelObject is instance of ZoomLevel class
  console.log('Element size:', zoomLevelObject.elementSize);
  console.log('Pan area size (viewport minus padding):', zoomLevelObject.panAreaSize);
  console.log('Item index:', zoomLevelObject.index);
  console.log('Item data:', zoomLevelObject.itemData);

  // return desired zoom level
  return 1;
}
```

## Default behaviour

- Initial zoom level is `fit`.
- Secondary zoom level is `2.5x` of `fit`, but not wider than `3000px`.
- Maximum zoom level is `4x` of `fit`.

<PswpCodePreview galleryID="open-in-original-size" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--open-in-original-size',
  children:'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.init();
```

</PswpCodePreview>



## Open images in `fill` state

<PswpCodePreview galleryID="open-in-fill-state" numItems="6">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--open-in-fill-state',
  children:'a',

  initialZoomLevel: 'fill',
  secondaryZoomLevel: 1,
  maxZoomLevel: 2,

  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.init();
```

</PswpCodePreview>

## Secondary zoom level is higher than initial

<PswpCodePreview galleryID="secondary-zoom-higher">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--secondary-zoom-higher',
  children: 'a',
  mouseMovePan: true,

  initialZoomLevel: 'fit',
  secondaryZoomLevel: 1.5,
  maxZoomLevel: 1,

  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.init();
```

</PswpCodePreview>

## Initial zoom level is higher than secondary

Initial zoom level is set to `1` (original image size), you may want to disable opening closing transition (`showHideAnimationType:'none'`) - as the larger the image - the harder it is to animate it smoothly. In this example it's not disabled, just to show you how it behaves:

<PswpCodePreview galleryID="initial-higher">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--initial-higher',
  children: 'a',
  mouseMovePan: true,

  initialZoomLevel: 1,
  secondaryZoomLevel: 'fit',
  maxZoomLevel: 4,

  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.init();
```

</PswpCodePreview>

## Initial and secondary zoom level are equal

<PswpCodePreview galleryID="zoom-levels-equal">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--zoom-levels-equal',
  children: 'a',
  mouseMovePan: true,

  initialZoomLevel: 'fill',
  secondaryZoomLevel: 'fill',
  maxZoomLevel: 3,

  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.init();
```

</PswpCodePreview>

## Image is smaller than initial and secondary

<PswpCodePreview>

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery:'#very-small-image',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.init();
```

```html pswpcode
<a id="very-small-image" href="https://dummyimage.com/200x200/555/fff/" data-pswp-width="200" data-pswp-height="200" target="_blank">
  <img src="https://dummyimage.com/100x100/555/fff/?text=small%20image" alt="" />
</a>
```

</PswpCodePreview>

## Dynamic zoom level

Change zoom levels based on viewport size and device orientation:

- fill 100% height of viewport on phones with portrait orientation,
- otherwise fit image into viewport

<PswpCodePreview galleryID="dynamic-zoom-level" orientation="landscape" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';


function isPhonePortrait() {
  return window.matchMedia('(max-width: 600px) and (orientation: portrait)').matches;
}

const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--dynamic-zoom-level',
  children:'a',
  

  initialZoomLevel: (zoomLevelObject) => {
    if (isPhonePortrait()) {
      return zoomLevelObject.vFill;
    } else {
      return zoomLevelObject.fit;
    }
  },
  secondaryZoomLevel: (zoomLevelObject) => {
    if (isPhonePortrait()) {
      return zoomLevelObject.fit;
    } else {
      return 1;
    }
  },

  maxZoomLevel: 1,

  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.init();
```

</PswpCodePreview>