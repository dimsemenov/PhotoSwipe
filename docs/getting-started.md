---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---


Before you start:

- PhotoSwipe requires predefined image dimensions, you must define width and height of each image.
- PhotoSwipe is not designed to display very large images. Serve responsive images. Maximum recommended size is 3000x3000px. However, there is an [experimental tiling plugin](https://github.com/dimsemenov/photoswipe-deep-zoom-plugin) that allows to show extremely large images.
- PhotoSwipe is designed with progressive enhancement in mind and works only in modern browsers. Always provide an alternative way to view the content (for example, link to image).


## Initialization



The PhotoSwipe consists of three parts:

1. **Core** (`photoswipe.esm.js`).
2. **Lightbox** (`photoswipe-lightbox.esm.js`) - loads **Core** and chooses when PhotoSwipe should be opened. Its file size is significantly smaller. It also loads the first image (in parallel with **Core**).
3. **CSS** (`photoswipe.css`) - a single file that controls all the styling. There are no external assets for icons - all of them are dynamically generated via JS and very tiny. Refer to [styling](/styling) for more info.

JS files are separated, so you can dynamically load **Core** only when user actually needs it, thus reducing the size of your main bundle.

The recommended way to use PhotoSwipe is using a single `<script type="module"></script>`, for example:

```html
<script type="module">
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#my-gallery',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.init();
</script>
```

Alternatively, you may install PhotoSwipe via NPM or Yarn:

```
npm i --save photoswipe#beta
```

```js
import PhotoSwipeLightbox from 'photoswipe/lightbox';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#my-gallery',
  children: 'a',
  pswpModule: () => import('photoswipe')
});
lightbox.init();
```


### Basic vanilla JS example

import { gettingStartedTemplate } from '@site/src/components/PswpCodePreview/gallery-templates/getting-started.js';

<PswpCodePreview galleryID="getting-started" numItems="6" displayHTML templateFn={gettingStartedTemplate}>

```js pswpcode
// Include Lightbox 
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  // may select multiple "galleries"
  gallery: '#gallery--getting-started',

  // Elements within gallery (slides)
  children: 'a',

  // setup PhotoSwipe Core dynamic import
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.init();
```

</PswpCodePreview>

### Without dynamic import

You don't have to dynamically import pswpModule, especially if PhotoSwipe is one of the primary features of your page.

<PswpCodePreview galleryID="no-dynamic-import">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
// highlight-next-line
import PhotoSwipe from '/photoswipe/photoswipe.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--no-dynamic-import',
  children: 'a',
  // highlight-next-line
  pswpModule: PhotoSwipe
});

lightbox.init();
```

</PswpCodePreview>



## Required HTML markup

Each element that matches the selector should be or should contain link `<a>` element. The link must have such attributes:

  - Image URL in `href` or `data-pswp-src` attribute (latter has higher priority).
  - Image width in `data-pswp-width`.
  - Image height in `data-pswp-height`.

And optionally:

- `<img>` thumbnail within the link element that will be displayed before large image is loaded (applied only for the first image, can be adjusted via `thumbSelector`).
- Optional `data-cropped="true"` attribute if thumbnail is cropped.

PhotoSwipe API supports almost any markup and any datasource, [read more about it here](data-sources#custom-html-markup).

## Open each image individually

<PswpCodePreview  galleryID="individual">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  // highlight-next-line
  gallery: '#gallery--individual a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.init();
```

</PswpCodePreview>


## Responsive images with srcset

- Add `data-pswp-srcset` attribute. It supports the same markup as [native srcset](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset). 
- Attributes `data-pswp-width` and `data-pswp-height` should define the largest image size.
- `sizes` attribute will be generated automatically based on actual width of the image. For example, if user zooms-in - `sizes` will be adjusted to the new zoom level.


import { srcsetTemplate } from '@site/src/components/PswpCodePreview/gallery-templates/srcset-test.js';

<PswpCodePreview galleryID="responsive-images" templateFn={srcsetTemplate}>

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  gallery: '#gallery--responsive-images',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.init();
```

</PswpCodePreview>

## Supported browsers and fallback

- The PhotoSwipe supports all browsers that [support ES6 modules](https://caniuse.com/#search=module).
  - Thus, it might not work in IE11, Opera Mini, UC browser, and old versions of Chrome, Safari and Firefox. Check your website/region statistics before deciding whether you should use PhotoSwipe or not.
- Users in unsupported browsers will still be able to view the large image if you use recommended HTML markup - link to image, or link to pa age that contains image.
- You may add any fallback via `script type="nomodule"`.
