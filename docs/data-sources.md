---
id: data-sources
title: Data Sources
sidebar_label: Data sources
---

## From an Array (or NodeList)

Pass an array of any items via `dataSource` option. Its length will determine amount of slides (which may be modified further from [numItems event](#dynamically-generated-data)).

Each item should contain data that you need to generate slide (for image slide it would be `src` (image URL), `width` (image width), `height`, `srcset`, `alt`).

If these properties are not present in your initial array, you may "pre-parse" each item from  [itemData filter](#dynamically-generated-data).


### Without Lightbox module

The Lightbox module connects gallery grid DOM to PhotoSwipe, thus when using a button, it's completely optional and you can just use PhotoSwipe core directly, for example:

<PswpCodePreview>

```js pswpcode
import PhotoSwipe from '/photoswipe/photoswipe.esm.js';

const options = {
  dataSource: [

    // simple image
    {
      src: 'https://source.unsplash.com/Volo9FYUAzU/1620x1080',
      width: 1620,
      height: 1080,
      alt: 'test image 1'
    },

    {
      src: 'https://source.unsplash.com/RJzHlbKf6eY/1950x1300',
      width: 1950,
      height: 1300,
      alt: 'test image 2'
    },

    // responsive image
    {
      srcset: 'https://dummyimage.com/1500x1000/555/fff/?text=1500x1000 1500w, https://dummyimage.com/1200x800/555/fff/?text=1200x800 1200w, https://dummyimage.com/600x400/555/fff/?text=600x400 600w',
      src: 'https://dummyimage.com/1500x1000/555/fff/?text=1500x1000',
      width: 1500,
      height: 1000,
      alt: 'test image 3',
    },

    // HTML slide
    {
      html: '<div class="custom-html-slide">This is custom HTML slide. <a href="http://example.com" target="_blank" rel="nofollow">Test Link</a>.</div>'
    }

  ],
  showHideAnimationType: 'none'
};

document.querySelector('#btn-open-pswp-from-arr').onclick = () => {
  options.index = 0; // defines start slide index
  const pswp = new PhotoSwipe(options);
  pswp.init(); // initializing PhotoSwipe core adds it to DOM
};
```

```css pswpcode
.custom-html-slide {
  font-size: 40px;
  line-height: 45px;
  max-width: 400px;
  width: 100%;
  padding: 0 20px;
  margin: 50px auto 0;
  color: #fff;
}
.custom-html-slide a {
  color: #fff;
  text-decoration: underline;
}
```

```html pswpcode
<button id="btn-open-pswp-from-arr" type="button">Open PhotoSwipe</button>
```

</PswpCodePreview>


### With Lightbox module

This example is identical to the previous one, but using Lightbox and dynamically loading the core.

<PswpCodePreview>

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';

const options = {
  dataSource: [

    // simple image
    {
      src: 'https://source.unsplash.com/Volo9FYUAzU/1620x1080',
      width: 1620,
      height: 1080,
      alt: 'test image 1'
    },

    {
      src: 'https://source.unsplash.com/RJzHlbKf6eY/1950x1300',
      width: 1950,
      height: 1300,
      alt: 'test image 2'
    },

    // responsive image
    {
      srcset: 'https://dummyimage.com/1500x1000/555/fff/?text=1500x1000 1500w, https://dummyimage.com/1200x800/555/fff/?text=1200x800 1200w, https://dummyimage.com/600x400/555/fff/?text=600x400 600w',
      src: 'https://dummyimage.com/1500x1000/555/fff/?text=1500x1000',
      width: 1500,
      height: 1000,
      alt: 'test image 3',
    },

    // HTML slide
    {
      html: '<div class="custom-html-slide">This is custom HTML slide. <a href="http://example.com" target="_blank" rel="nofollow">Test Link</a>.</div>'
    }

  ],
  showHideAnimationType: 'none',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.init();

document.querySelector('#btn-open-pswp-from-arr-lightbox').onclick = () => {
  lightbox.loadAndOpen(0); // defines start slide index
};
```

```html pswpcode
<button id="btn-open-pswp-from-arr-lightbox" type="button">Open PhotoSwipe</button>
```

</PswpCodePreview>


## Custom last slide

To add a custom last slide increase the total number of slides by one using `numItems` filter and make sure that correct `itemData` is returned for the last slide.

<PswpCodePreview galleryID="custom-last-slide">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--custom-last-slide',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),

});
lightbox.addFilter('numItems', (numItems) => {
  return ++numItems;
});
lightbox.addFilter('itemData', (itemData, index) => {
  if (index === lightbox.getNumItems() - 1) {
    return {
      html: '<div class="custom-html-slide">This is custom HTML slide. <a href="http://example.com" target="_blank" rel="nofollow">Link</a>.</div>',
    };
  }
  return itemData;
});
lightbox.init();
```

</PswpCodePreview>

## Dynamically generated data

The filter `numItems` allows you to override the total number of slides. And `itemData` will trigger every time PhotoSwipe requests data about the slide, which usually happens before slide is displayed or lazy-loaded.

The example below creates a gallery with 1000 images.

<PswpCodePreview>

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  showHideAnimationType: 'none',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
  preload: [1,2],
});
lightbox.addFilter('numItems', (numItems) => {
  return 1000;
});
lightbox.addFilter('itemData', (itemData, index) => {
  return {
    src: 'https://dummyimage.com/100x100/555/fff/?text=' + (index + 1),
    width: 100,
    height: 100
  };;
});
lightbox.init();

document.querySelector('#btn-open-pswp-dyn-gen').onclick = () => {
  lightbox.loadAndOpen(0);
};
```

```html pswpcode
<button id="btn-open-pswp-dyn-gen" type="button">Open PhotoSwipe</button>
```

</PswpCodePreview>


## Custom HTML markup

You may completely override default requirements for HTML markup. In the example below we add thumbnail as `background-image`, a custom attribute that stores image size, and make sure that zoom transition runs from `<a>` rather than from `<img>` within.

We also use `domItemData` filter, instead of `itemData`. It fires only once per each slide.

import { customHTMLDataSourceTemplate } from '@site/src/components/PswpCodePreview/gallery-templates/custom-html-markup-data-source.js';

<PswpCodePreview galleryID="custom-html-markup" numItems="6" displayHTML templateFn={customHTMLDataSourceTemplate}>

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--custom-html-markup',
  children: 'a',

  // Adjust thumbnail selector,
  // (for opening/closing zoom transition)
  thumbSelector: 'a',

  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});

lightbox.addFilter('domItemData', (itemData, element, linkEl) => {
  if (linkEl) {
    const sizeAttr = linkEl.dataset.mySize;

    itemData.src = linkEl.href;
    itemData.w = Number(sizeAttr.split('x')[0]);
    itemData.h = Number(sizeAttr.split('x')[1]);
    itemData.msrc = linkEl.dataset.thumbSrc;
    itemData.thumbCropped = true;
  }

  return itemData;
});

lightbox.init();
```

```css pswpcode
#gallery--custom-html-markup a {
  width: 100px;
  height: 100px;

  background-size: cover;
  background-position: 50% 50%;

  text-indent: -300px;
  overflowidth: hidden;
}
```

</PswpCodePreview>


## Separate DOM and data

If data is provided as array, but you still want to keep zoom animation. This is often the case when using some kind of dynamic image grid with paging or infinite scroll.

How-to:

1. Pass array of images to `dataSource` option.
2. Use `thumbEl` filter to provide source of thumbnail element. PhotoSwipe will use its coordinates for animation.
3. Use `placeholderSrc` filter to provide the source of placeholder image. Alternatively, you may define `msrc` property in your data array.
4. Bind `click` event to gallery elements and call method `lightbox.loadAndOpen(3)` (where `3` is image index in your array).

In the example below there are ten images in array, but only three are in DOM.

<PswpCodePreview displayHTML numItems="6">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';

const images = [
  { id: 1, src: 'https://dummyimage.com/1500x1000/555/fff/?text=Image+1', width: 1500, height: 1000 },
  { id: 2, src: 'https://dummyimage.com/1500x1000/555/fff/?text=Image+2', width: 1500, height: 1000 },
  { id: 3, src: 'https://dummyimage.com/1500x1000/555/fff/?text=Image+3', width: 1500, height: 1000 },
  { id: 4, src: 'https://dummyimage.com/1500x1000/555/fff/?text=Image+4', width: 1500, height: 1000 },
  { id: 5, src: 'https://dummyimage.com/1500x1000/555/fff/?text=Image+5', width: 1500, height: 1000 },
  { id: 6, src: 'https://dummyimage.com/1500x1000/555/fff/?text=Image+6', width: 1500, height: 1000 },
  { id: 7, src: 'https://dummyimage.com/1500x1000/555/fff/?text=Image+7', width: 1500, height: 1000 },
  { id: 8, src: 'https://dummyimage.com/1500x1000/555/fff/?text=Image+8', width: 1500, height: 1000 },
  { id: 9, src: 'https://dummyimage.com/1500x1000/555/fff/?text=Image+9', width: 1500, height: 1000 },
  { id: 10, src: 'https://dummyimage.com/1500x1000/555/fff/?text=Image+10', width: 1500, height: 1000 },
];
const galleryEl = document.querySelector('#gallery--mixed-source');

const lightbox = new PhotoSwipeLightbox({
  dataSource: images,
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
});
lightbox.addFilter('thumbEl', (thumbEl, data, index) => {
  const el = galleryEl.querySelector('[data-id="' + data.id + '"] img');
  if (el) {
    return el;
  }
  return thumbEl;
});
lightbox.addFilter('placeholderSrc', (placeholderSrc, slide) => {
  const el = galleryEl.querySelector('[data-id="' + slide.data.id + '"] img');
  if (el) {
    return el.src;
  }
  return placeholderSrc;
});
lightbox.init();

// expose to use within onclick attribute
window.pswpLightbox = lightbox;
```

```html pswpcode pswpdisplayhtml
<div class="pswp-gallery" id="gallery--mixed-source">
  <a onclick="pswpLightbox.loadAndOpen(2);return false;"
    data-id="3" 
    href="https://dummyimage.com/1500x1000/555/fff/?text=Image+3" 
    target="_blank">
    <img src="https://dummyimage.com/150x100/555/fff/?text=Thumb+3" alt="">
  </a>
  <a onclick="pswpLightbox.loadAndOpen(3);return false;" 
    data-id="4" 
    href="https://dummyimage.com/1500x1000/555/fff/?text=Image+4" 
    target="_blank">
    <img src="https://dummyimage.com/150x100/555/fff/?text=Thumb+4" alt="">
  </a>
  <a onclick="pswpLightbox.loadAndOpen(4);return false;" 
    data-id="5" 
    href="https://dummyimage.com/1500x1000/555/fff/?text=Image+5" 
    target="_blank">
    <img src="https://dummyimage.com/150x100/555/fff/?text=Thumb+5" alt="">
  </a>
</div>
```

</PswpCodePreview>
