---
id: opening-or-closing-transition
title: Opening or closing transition
sidebar_label: Opening or closing transition
---






To adjust opening or closing transition type use lightbox option `showHideAnimationType` (`String`). It supports three values - `zoom` (default), `fade` (default in no thumbnail) and `none`.

## zoom

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--zoom-transition',
  children: 'a',
  showHideAnimationType: 'zoom',
  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});
lightbox.init();
```

```pswp_example gallery
{ "autoImages":3, "id":"zoom-transition" }
```

</div> 
<!-- PhotoSwipe example block END -->

## fade

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--fade-transition',
  children:'a',
  showHideAnimationType: 'fade',
  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});
lightbox.init();
```

```pswp_example gallery
{ "autoImages":5, "id":"fade-transition" }
```

</div> 
<!-- PhotoSwipe example block END -->

## none

Automatically selected if user agent `(prefers-reduced-motion: reduce)`.

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--none-transition',
  children: 'a',
  showHideAnimationType: 'none',

  // optionally disable zoom transition,
  // to create more consistent experience
  zoomAnimationDuration: false,

  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});
lightbox.init();
```

```pswp_example gallery
{ "autoImages":8, "id":"none-transition" }
```

</div> 
<!-- PhotoSwipe example block END -->

## Transition duration and easing

Use options `showAnimationDuration` and `hideAnimationDuration` (`Integer`, default `333`).

Option `easing` (`String`, default `cubic-bezier(.4,0,.22,1)`) accepts any [CSS timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function). It is applied to any zoom transition (including double-tap).

Both options can be modified dynamically while PhotoSwipe is opened.

In the example below transition duration is set to 1000ms (1s). Easing is defined dynamically (opening transition gets ease-out-back, zoom transitions gets ease-in-out-back, and closing transition gets ease-in-back):

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const backEasing = {
  in: 'cubic-bezier(0.6, -0.28, 0.7, 1)',
  out: 'cubic-bezier(0.3, 0, 0.32, 1.275)',
  inOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--customized-transition',
  children:'a',

  showHideAnimationType: 'zoom',
  showAnimationDuration: 1000,
  hideAnimationDuration: 1000,

  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});
lightbox.on('firstUpdate', () => {
  lightbox.pswp.options.easing = backEasing.out;
});
lightbox.on('initialZoomInEnd', () => {
  lightbox.pswp.options.easing = backEasing.inOut;
});
lightbox.on('close', () => {
  lightbox.pswp.options.easing = backEasing.in;
});
lightbox.init();
```

```pswp_example gallery
{ "autoImages":3, "id":"customized-transition" }
```

</div> 
<!-- PhotoSwipe example block END -->

## Animating from cropped thumbnail

Step 1: use thumbnail image that matches aspect ratio of the large image.

Step 2: crop thumbnail via CSS. For example, using `object-fit:cover`, or `background-size:cover`.

Step 3: add `data-cropped="true"` attribute to your links that opens PhotoSwipe.


<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--cropped-thumbs',
  children:'a',
  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});
lightbox.init();
```

```pswp_example gallery
{ 
  "autoImages":5, 
  "id":"cropped-thumbs", 
  "template":"basic--cropped"
}
```

</div> 
<!-- PhotoSwipe example block END -->





## Hiding elements that overlap thumbnails

If you have some element that overlays thumbnail, you may want to fade it out when PhotoSwipe is opening, and fade it back in when PhotoSwipe is closed.

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--badges',
  children: 'a',
  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});

let firstElWithBadge;
let lastElWithBadge;

// Gallery is starting to open
lightbox.on('afterInit', () => {
  firstElWithBadge = lightbox.pswp.currSlide.data.element;
  hideBadge(firstElWithBadge);
});

// Gallery is starting to close
lightbox.on('close', () => {
  lastElWithBadge = lightbox.pswp.currSlide.data.element;
  if(lastElWithBadge !== firstElWithBadge) {
    showBadge(firstElWithBadge);
    hideBadge(lastElWithBadge);
  }
});

// Gallery is closed
lightbox.on('destroy', () => {
    showBadge(lastElWithBadge);
});

lightbox.init();

function hideBadge(el) {
  el.querySelector('.badge')
    .classList
    .add('badge--hidden');
};
function showBadge(el) {
  el.querySelector('.badge')
    .classList
    .remove('badge--hidden');
}
```

```pswp_example css
.badge {
  position: absolute;
  bottom: 5px;
  left: 5px;
  padding: 5px;
  color: #FFF;
  background: rgba(0,0,0,0.5);
  line-height: 1;
  transition: opacity 100ms linear;
}
.badge--hidden {
  opacity: 0;
}
```


```pswp_example gallery
{ 
  "id":"badges",
  "autoImages":6,
  "template":"basic--badges",
  "captionHTML":"<div class=\"badge\">Badge %index%</div>"
}
```

</div> 
<!-- PhotoSwipe example block END -->

You may use this technique to hide any element that might interfere with the transition. For example, fixed header, sharing icons or carousel arrows.
