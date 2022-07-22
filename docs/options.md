---
id: options
title: Options
sidebar_label: Options
---

### bgOpacity

Number, `0.8`. 

Background backdrop opacity, always define it via this option and not via CSS rgba color.

<PswpCodePreview galleryID="test-bgopacity">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-bgopacity',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  bgOpacity: 0.2,
});
lightbox.init();
```

</PswpCodePreview>

### spacing

Number, `0.1`. Spacing between slides. Defined as ratio relative to the viewport width (0.1 = 10% of viewport).

<PswpCodePreview galleryID="test-spacing" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-spacing',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  spacing: 0.5, // 50% of viewport width
});
lightbox.init();
```

</PswpCodePreview>

### allowPanToNext

Boolean, `true`. Allow swipe navigation to the next slide when the current slide is zoomed. Does not apply to mouse events.

<PswpCodePreview galleryID="test-spacing" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-spacing',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  allowPanToNext: false
});
lightbox.init();
```

</PswpCodePreview>


### loop

Boolean, `true`. If set to true you'll be able to swipe from the last to the first image. Option is always `false` when there are less than 3 slides.

<PswpCodePreview galleryID="test-loop" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-loop',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  loop: false
});
lightbox.init();
```

</PswpCodePreview>



### wheelToZoom

Boolean, `undefined`. By default PhotoSwipe zooms image with ctrl-wheel, if you enable this option - image will zoom just via wheel.

<PswpCodePreview galleryID="test-wheelToZoom" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-wheelToZoom',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  wheelToZoom: true
});
lightbox.init();
```

</PswpCodePreview>

### pinchToClose

Boolean, `true`. Pinch touch gesture to close the gallery.

<PswpCodePreview galleryID="test-pinch-to-close" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-pinch-to-close',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  pinchToClose: false
});
lightbox.init();
```

</PswpCodePreview>

### closeOnVerticalDrag

Boolean, `true`. Vertical drag gesture to close the PhotoSwipe.

<PswpCodePreview galleryID="close-on-vertical-drag" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--close-on-vertical-drag',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  closeOnVerticalDrag: false
});
lightbox.init();
```

</PswpCodePreview>


### padding
  
Object, `{ top: 0, bottom: 0, left: 0, right: 0 }`. Slide area padding (in pixels).

<PswpCodePreview galleryID="test-padding" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-padding',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  padding: { top: 20, bottom: 40, left: 100, right: 100 }
});
lightbox.init();
```

</PswpCodePreview>

### paddingFn

Function, should return padding object. The option is checked frequently, so make sure it's performant. Overrides `padding` option if defined. For example:


<PswpCodePreview galleryID="test-paddingfn" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-paddingfn',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),

  paddingFn: (viewportSize, itemData, index) => {
    return {
      // check based on slide index
      top: index === 0 ? 100 : 0,

      // check based on viewport size
      bottom: viewportSize.x < 600 ? 0 : 200,

      // check based on image size
      left: itemData.w < 2000 ? 50 : 0,

      right: 0
    };
  }
});
lightbox.init();
```

</PswpCodePreview>

### hideAnimationDuration, showAnimationDuration, zoomAnimationDuration

Number, `333`. Transition duration in milliseconds, can be `0`. [Example here](opening-or-closing-transition.md#transition-duration-and-easing).

### easing

String, `'cubic-bezier(.4,0,.22,1)'`. CSS easing function for open/close/zoom transitions. [Example here](opening-or-closing-transition.md#transition-duration-and-easing).


### escKey

Boolean, `true`. Esc key to close.

<PswpCodePreview galleryID="test-esc-key" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-esc-key',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  escKey: false
});
lightbox.init();
```

</PswpCodePreview>


### arrowKeys

Boolean, `true`. Left/right arrow keys for navigation.

<PswpCodePreview galleryID="test-arrow-keys" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-arrow-keys',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  arrowKeys: false
});
lightbox.init();
```

</PswpCodePreview>


### returnFocus

Boolean, `true`. Restore focus the last active element after PhotoSwipe is closed. 

<PswpCodePreview galleryID="test-restore-focus" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-restore-focus',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  returnFocus: false
});
lightbox.init();
```

</PswpCodePreview>

### clickToCloseNonZoomable

Boolean, `true`. If image is not zoomable (for example, smaller than viewport) it can be closed by clicking on it.

<PswpCodePreview>

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--clickToCloseNonZoomable',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  clickToCloseNonZoomable: false
});
lightbox.init();
```

```html pswpcode 
<div class="pswp-gallery" id="gallery--clickToCloseNonZoomable">
  <a data-pswp-width="300" data-pswp-height="200" href="https://dummyimage.com/300x200/555/fff/?text=1st-300x200" target="_blank">
    <img src="https://dummyimage.com/150x100/555/fff/?text=1st-150x100" alt="">
  </a>
  <a data-pswp-width="1000" data-pswp-height="1000" href="https://dummyimage.com/1000x1000/555/fff/?text=2nd-1000x1000" target="_blank">
    <img src="https://dummyimage.com/100x100/555/fff/?text=2nd-100x100" alt="">
  </a>
  <a data-pswp-width="100" data-pswp-height="700" href="https://dummyimage.com/100x700/555/fff/?text=3rd-100x700" target="_blank">
    <img src="https://dummyimage.com/50x350/555/fff/?text=3rd-50x350" alt="">
  </a>
</div>
```

</PswpCodePreview>

### imageClickAction, bgClickAction, tapAction, doubleTapAction

Refer to [click and tap actions](click-and-tap-actions.md) page.

### preloaderDelay

Number (ms), `2000`. Delay before the loading indicator will be displayed, if image is loaded during it - the indicator will not be displayed at all. Can be zero.

<PswpCodePreview galleryID="test-preloader-delay" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-preloader-delay',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  preloaderDelay: 0
});
lightbox.init();
```

</PswpCodePreview>

### indexIndicatorSep

String, ` / `. Used for slide count indicator ("1 of 10 ").

<PswpCodePreview galleryID="test-indexIndicatorSep" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-indexIndicatorSep',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  indexIndicatorSep: ' of '
});
lightbox.init();
```

</PswpCodePreview>

### getViewportSizeFn

Function `{x: width, y: height}`, `undefined`. A function that should return slide viewport width and height, in format `{x: 100, y: 100}`.

<PswpCodePreview galleryID="test-getViewportSizeFn" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-getViewportSizeFn',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  getViewportSizeFn: function(options, pswp) {
    return {
      x: document.documentElement.clientWidth - 200,
      y: window.innerHeight
    };
  }
});
lightbox.init();
```

</PswpCodePreview>



### errorMsg

String, `'The image cannot be loaded'`.

Message to display when the image wasn't able to load. If you need to display HTML - use [contentErrorElement filter](/filters#contenterrorelement).

<PswpCodePreview>

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--errorMsg',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  errorMsg: 'The photo cannot be loaded'
});
lightbox.init();
```

```html pswpcode 
<div class="pswp-gallery pswp-gallery--single-column" id="gallery--errorMsg">
  <a data-pswp-width="1200" data-pswp-height="800" href="https://picsum.photos/1200/800" target="_blank">
    <img src="https://dummyimage.com/300x200/555/fff/?text=0-random-image" alt="">
  </a>

  <a data-pswp-width="800" data-pswp-height="600" href="https://example.com/broken-image-link" target="_blank">
    <img src="https://dummyimage.com/300x200/555/fff/?text=1st-broken-large-image" alt="">
  </a>
  <a data-pswp-width="1000" data-pswp-height="1000" href="https://dummyimage.com/1000x1000/555/fff/?text=2nd-1000x1000" target="_blank">
    <img src="https://dummyimage.com/100x100/555/fff/?text=2nd-100x100" alt="">
  </a>
  <a data-pswp-width="800" data-pswp-height="600" href="https://example.com/another-broken-image-link" target="_blank">
    <img src="https://dummyimage.com/300x200/555/fff/?text=3rd-broken-image-link" alt="">
  </a>
</div>
```

</PswpCodePreview>

### preload

Array, `[1, 2]`. Lazy loading of nearby slides based on direction of movement. Should be an array with two integers, first one - number of items to preload before the current image, second one - after the current image. Two nearby images are always loaded.

<PswpCodePreview galleryID="test-preload" numItems="10">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-preload',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  preload: [1, 4]
});
lightbox.init();
```

</PswpCodePreview>


### mainClass

String, `undefined`. Class that will be added to the root element of PhotoSwipe, may contain multiple separated by space. Example on [Styling](/styling#modifying-icons) page.

### appendToEl

DOMElement, `document.body`. Element to which PhotoSwipe dialog will be appended when it opens.

<PswpCodePreview galleryID="test-appendToEl">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-appendToEl',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  appendToEl: document.querySelector('#__docusaurus')
});
lightbox.init();
```

</PswpCodePreview>

### maxWidthToAnimate

Integer, `4000`. Maximum width of image to animate, if initial rendered image width is larger than this value - the opening/closing transition will be automatically disabled.

<PswpCodePreview galleryID="test-maxWidthToAnimate">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-maxWidthToAnimate',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  maxWidthToAnimate: 800,
});
lightbox.init();
```

</PswpCodePreview>

## Lightbox module options

See [getting started](getting-started.md) and [data sources](data-sources.md) for examples.

### gallery

Element, NodeList, or CSS selector (string) for the gallery element.

### children

Element, NodeList, or CSS selector (string) for elements within `gallery`. For example, link elements. If not defined or set to false - root `gallery` node will be used.

### pswpModule

Function or Module, `undefined`. A function that should return import() promise (if you need dynamic import), for example:

```
pswpModule: () => import('photoswipe/dist/photoswipe.esm.js');
```

Or the PhotoSwipe Core module itself, for example:

```js
import PhotoSwipeLightbox from 'photoswipe/dist/photoswipe-lightbox.esm.js';
import PhotoSwipe from 'photoswipe/dist/photoswipe.esm.js';

const lightbox = new PhotoSwipeLightbox({
  pswpModule: PhotoSwipe
  // ...
});
```

### preloadFirstSlide

Boolean, `true`. Loads the first slide image in parallel with PhotoSwipe Core (while PhotoSwipe is opening).

<PswpCodePreview galleryID="test-appendToEl">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-appendToEl',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  preloadFirstSlide: false
});
lightbox.init();
```

</PswpCodePreview>


## Translating

A list of options that might need a translation:

```
closeTitle: 'Close',
zoomTitle: 'Zoom',
arrowPrevTitle: 'Previous',
arrowNextTitle: 'Next',

errorMsg: 'The image cannot be loaded',
indexIndicatorSep: ' / ',
```

<!-- internationalization, i18n, localization, language -->

Example:

<PswpCodePreview galleryID="test-i18n">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-i18n',
  children: 'a',

  closeTitle: 'Close the dialog',
  zoomTitle: 'Zoom the photo',
  arrowPrevTitle: 'Go to the previous photo',
  arrowNextTitle: 'Go to the next photo',

  errorMsg: 'The photo cannot be loaded',
  indexIndicatorSep: ' of ',

  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  preloadFirstSlide: false
});
lightbox.init();
```

</PswpCodePreview>