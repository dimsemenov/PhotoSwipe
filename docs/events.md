---
id: events
title: Events
sidebar_label: Events
---

```js
const lightbox = new PhotoSwipeLightbox({
  // options...
});
lightbox.init();
```  

All events can be bound directly to lightbox, they'll automatically map to PhotoSwipe core when it's open.

## Initialization events

<PswpCodePreview galleryID="test-init-events">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-init-events',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.on('beforeOpen', () => {
  console.log('beforeOpen');
  // photoswipe starts to open
});

lightbox.on('firstUpdate', () => {
  console.log('firstUpdate');
  // photoswipe keeps opening
  // you may modify initial index or basic DOM structure
});

lightbox.on('initialLayout', () => {
  console.log('initialLayout');
  // photoswipe measures size of various elements
  // if you need to read getBoundingClientRect of something - do it here
});

lightbox.on('change', () => {
  // triggers when slide is switched, and at initialization
  console.log('change');
});

lightbox.on('afterInit', () => {
  console.log('afterInit');
  // photoswipe fully initialized and opening transition is running (if available)
});

lightbox.on('bindEvents', () => {
  console.log('bindEvents');
  // photoswipe binds DOM events (such as pointer events, wheel, etc)
});
lightbox.init();
```

</PswpCodePreview>

## Opening or closing transition events

The events will trigger even if transition is disabled.

<PswpCodePreview galleryID="test-opening-closing-events">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-opening-closing-events',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.on('openingAnimationStart', () => {
  console.log('openingAnimationStart');
});
lightbox.on('openingAnimationEnd', () => {
  console.log('openingAnimationEnd');
});
lightbox.on('closingAnimationStart', () => {
  console.log('closingAnimationStart');
});
lightbox.on('closingAnimationEnd', () => {
  console.log('closingAnimationEnd');
});
lightbox.init();
```

</PswpCodePreview>


## Closing events

<PswpCodePreview galleryID="test-closing-events">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-closing-events',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.on('close', () => {
  // PhotoSwipe starts to close, unbind most events here
  console.log('close');
});
lightbox.on('destroy', () => {
  // PhotoSwipe is fully closed, destroy everything
  console.log('destroy');
});
lightbox.init();
```

</PswpCodePreview>


## Pointer and gesture events

<PswpCodePreview galleryID="test-pointer-events">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-pointer-events',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.on('pointerDown', (e) => {
  console.log('pointerDown', e.originalEvent);
});
lightbox.on('pointerMove', (e) => {
  console.log('pointerMove', e.originalEvent);
});
lightbox.on('pointerUp', (e) => {
  console.log('pointerUp', e.originalEvent);
});
lightbox.on('pinchClose', (e) => {
  // triggered when using pinch to close gesture
  // can be default prevented
  console.log('pinchClose', e.bgOpacity);
});
lightbox.on('verticalDrag', (e) => {
  // triggered when using vertical drag to close gesture
  // can be default prevented
  console.log('verticalDrag', e.panY);
});
lightbox.init();
```

</PswpCodePreview>

## Slide content events

Refer to [Custom Content](/custom-content) section of docs for examples.

<PswpCodePreview galleryID="test-content-events">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
import PhotoSwipe from '/photoswipe/photoswipe.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--test-content-events',
  children: 'a',
  pswpModule: PhotoSwipe
});
lightbox.on('contentInit', ({ content }) => {
  console.log('contentInit', content);
});
lightbox.on('contentLoad', ({ content, isLazy }) => {
  // content starts to load 
  // can be default prevented
  // assign elements to `content.element`
  console.log('contentLoad', content, isLazy);
});
lightbox.on('contentLoadImage', ({ content, isLazy }) => {
  // similar to the previous one, but triggers only for image content
  // can be default prevented
  console.log('contentLoadImage', content, isLazy);
});
lightbox.on('loadComplete', ({ content, slide }) => {
  console.log('loadComplete', content);
});
lightbox.on('contentResize', ({ content, width, height }) => {
  // content will be resized
  // can be default prevented
  console.log('contentResize', content, width, height);
});
lightbox.on('imageSizeChange', ({ content, width, height, slide }) => {
  // content.element is image
  console.log('imageSizeChange', content, width, height, slide, slide.index);
});
lightbox.on('contentLazyLoad', ({ content }) => {
  // content start to lazy-load
  // can be default prevented
  console.log('contentLazyLoad', content);
});
lightbox.on('contentAppend', ({ content }) => {
  // content is added to dom
  // can be default prevented
  // content.slide.container.appendChild(content.element);
  console.log('contentAppend', content);
});
lightbox.on('contentActivate', ({ content }) => {
  // content becomes active (the current slide)
  // can be default prevented
  console.log('contentActivate', content);
});
lightbox.on('contentDeactivate', ({ content }) => {
  // content becomes inactive
  // can be default prevented
  console.log('contentDeactivate', content);
});
lightbox.on('contentRemove', ({ content }) => {
  // content is removed from DOM
  // can be default prevented
  console.log('contentRemove', content);
});
lightbox.on('contentDestroy', ({ content }) => {
  // content will be destroyed
  // can be default prevented
  console.log('contentDestroy', content);
});
lightbox.init();
```

</PswpCodePreview>