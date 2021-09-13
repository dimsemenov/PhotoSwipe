---
id: adjusting-zoom-level
title: Adjusting Zoom Level
sidebar_label: Adjusting Zoom Level
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

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--open-in-original-size',
  children:'a',

  // works nice with mousemove pan
  mouseMovePan: true,

  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});
lightbox.init();
```

```pswp_example gallery
{ 
  "id":"open-in-original-size",
  "autoImages":6
}
```

</div> 
<!-- PhotoSwipe example block END -->



## Open images in `fill` state

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--open-in-fill-state',
  children:'a',

  initialZoomLevel: 'fill',
  secondaryZoomLevel: 1,
  maxZoomLevel: 2,

  mouseMovePan: true,

  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});
lightbox.init();
```

```pswp_example gallery
{ 
  "id":"open-in-fill-state",
  "autoImages":6
}
```

</div> 
<!-- PhotoSwipe example block END -->

## Secondary zoom level is higher than initial

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--secondary-zoom-higher',
  children: 'a',
  mouseMovePan: true,

  initialZoomLevel: 'fit',
  secondaryZoomLevel: 1.5,
  maxZoomLevel: 1,

  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});
lightbox.init();
```

```pswp_example gallery
{ 
  "id":"secondary-zoom-higher"
}
```

</div> 
<!-- PhotoSwipe example block END -->

## Initial zoom level is higher than secondary

Initial zoom level is set to `1` (original image size), you may want to disable opening closing transition (`showHideAnimationType:'none'`) - as the larger the image - the harder it is to animate it smoothly. In this example it's not disabled, just to show you how it behaves:

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--initial-higher',
  children: 'a',
  mouseMovePan: true,

  initialZoomLevel: 1,
  secondaryZoomLevel: 'fit',
  maxZoomLevel: 4,

  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});
lightbox.init();
```

```pswp_example gallery
{ 
  "id":"initial-higher"
}
```

</div> 
<!-- PhotoSwipe example block END -->

## Initial and secondary zoom level are equal

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--zoom-levels-equal',
  children: 'a',
  mouseMovePan: true,

  initialZoomLevel: 'fill',
  secondaryZoomLevel: 'fill',
  maxZoomLevel: 3,

  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});
lightbox.init();
```

```pswp_example gallery
{ 
  "id":"zoom-levels-equal"
}
```

</div> 
<!-- PhotoSwipe example block END -->

## Image is smaller than initial and secondary

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery:'#very-small-image',
  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});
lightbox.init();
```

```pswp_example html
<a id="very-small-image" href="https://dummyimage.com/200x200/555/fff/" data-pswp-width="200" data-pswp-height="200" target="_blank">
  <img src="https://dummyimage.com/100x100/555/fff/?text=small%20image" alt="" />
</a>
```

</div> 
<!-- PhotoSwipe example block END -->

## Dynamic zoom level

Change zoom levels based on viewport size and device orientation:

- fill 100% height of viewport on phones with portrait orientation,
- otherwise fit image into viewport

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';


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

  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});
lightbox.init();
```

```pswp_example gallery
{ 
  "id":"dynamic-zoom-level",
  "orientation":"landscape",
  "autoImages": 4
}
```

</div> 
<!-- PhotoSwipe example block END -->