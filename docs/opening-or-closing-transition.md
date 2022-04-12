---
id: opening-or-closing-transition
title: Opening or closing transition
sidebar_label: Opening or closing transition
---

To adjust opening or closing transition type use lightbox option `showHideAnimationType` (`String`). It supports three values - `zoom` (default), `fade` (default if there is no thumbnail) and `none`.

Animations are automatically disabled if user `(prefers-reduced-motion: reduce)`.


## zoom

<PswpCodePreview galleryID="zoom-transition">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--zoom-transition',
  children: 'a',
  showHideAnimationType: 'zoom',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.init();
```

</PswpCodePreview>

If you're using a different datasource, for example Array of images and you still want to use zoom transition, please refer to [Separate DOM and data](/data-sources#separate-dom-and-data) guide.

## fade

<PswpCodePreview galleryID="fade-transition" numItems="5">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--fade-transition',
  children:'a',
  showHideAnimationType: 'fade',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.init();
```

</PswpCodePreview>

## none

Automatically selected if user agent `(prefers-reduced-motion: reduce)`.

<PswpCodePreview galleryID="none-transition" numItems="8">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--none-transition',
  children: 'a',
  showHideAnimationType: 'none',

  // optionally disable zoom transition,
  // to create more consistent experience
  zoomAnimationDuration: false,

  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.init();
```

</PswpCodePreview>

## Transition duration and easing

Use options `showAnimationDuration` and `hideAnimationDuration` (`Integer`, default `333`).

Option `easing` (`String`, default `cubic-bezier(.4,0,.22,1)`) accepts any [CSS timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function). It is applied to any zoom transition (including double-tap).

Both options can be modified dynamically while PhotoSwipe is opened.

In the example below transition duration is set to 1000ms (1s). Easing is defined dynamically (opening transition gets ease-out-back, zoom transitions gets ease-in-out-back, and closing transition gets ease-in-back):

<PswpCodePreview galleryID="customized-transition">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';

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

  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
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

</PswpCodePreview>

## Animating from cropped thumbnail

1. Use thumbnail image that matches aspect ratio of the large image. Animation from thumbnails that are cropped on server side is not supported.
2. Crop thumbnail via CSS using `object-fit:cover`. If you're using a different `object-position` - use [Object Position plugin](https://github.com/vovayatsyuk/photoswipe-object-position) by Vova Yatsyuk, or adjust it manually via `thumbBounds` filter.
3. Add `data-cropped="true"` attribute to links that open PhotoSwipe.

import { basicCroppedTemplate } from '@site/src/components/PswpCodePreview/gallery-templates/basic--cropped.js';

<PswpCodePreview galleryID="cropped-thumbs" numItems="6" templateFn={basicCroppedTemplate}>

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--cropped-thumbs',
  children:'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.init();
```

</PswpCodePreview>

## Hiding elements that overlap thumbnails

If you have some element that overlays thumbnail, you may want to fade it out when PhotoSwipe is opening, and fade it back in when PhotoSwipe is closed.


import { basicBadgesTemplate } from '@site/src/components/PswpCodePreview/gallery-templates/basic--badges.js';

<PswpCodePreview galleryID="badges" numItems="6" templateFn={basicBadgesTemplate}>

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery:'#gallery--badges',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
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

```css pswpcode
.badge {
  position: absolute;
  bottom: 5px;
  left: 5px;
  padding: 5px;
  color: #FFF;
  background: rgba(0,0,0,0.5);
  line-height: 1;
  transition: opacity 100ms linear;
  font-size: 16px;
  font-weight: normal;
}
.badge--hidden {
  opacity: 0;
}
```

</PswpCodePreview>

You may use this technique to hide any element that might interfere with the transition. For example, fixed header, sharing icons or carousel arrows.
