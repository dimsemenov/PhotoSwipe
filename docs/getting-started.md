---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---


Before you start:

- This version is still under development, use in production on your own risk.
- PhotoSwipe requires predefined image dimensions.
- PhotoSwipe is not designed to display very large images. Serve responsive images. Maximum recommended size is 3000x3000px. Tiles plugin might be added in future.
- PhotoSwipe works only in modern browsers. The script is distributed as a ES6 module, thus it will work only in browsers that support them ([caniuse](https://caniuse.com/#feat=es6-module)).


## Initialization

The PhotoSwipe consists of parts:

1. **Core** (`photoswipe.esm.js`).
2. **Lightbox** (`photoswipe-lightbox.esm.js`) - loads **Core** and chooses when PhotoSwipe should be opened. Its file size is significantly smaller. It also loads the first image (in parallel with **Core**).

There is also `photoswipe.css` that controls [styling](styling.md):

```html
<link rel="stylesheet" href="/path/to/photoswipe.css"/>
```

You may use single `<script>` tag to load everything, always add `type="module"` to it, as both files are ES6 modules.

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example html
<script type="module">
// Include Lightbox 
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  // may select multiple "galleries"
  gallery: '#gallery--simple',

  // Elements within gallery (slides)
  children: 'a',

  // Include PhotoSwipe Core
  // and use absolute path (that starts with http(s)://)
  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});
lightbox.init();
</script>
```

```pswp_example gallery
{ 
  "template":"getting-started",
  "id":"simple",
  "displayHTML":true
}
```

</div> 
<!-- PhotoSwipe example block END -->

## Using with Webpack or any other module bundler

I recommend to load PhotoSwipe via dynamic import.
But if you do not want to bother with it and include everything in the main bundle, it can be done like this:

```js
import PhotoSwipeLightbox from 'photoswipe/dist/photoswipe-lightbox.esm.js';
import PhotoSwipe from 'photoswipe/dist/photoswipe.esm.js';

// don't forget to include CSS in some way
// import 'photoswipe/dist/photoswipe.css';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#my-gallery',
  children: 'a',
  pswpModule: PhotoSwipe
});
lightbox.init();
```

While v5 is in beta, you may install it like this:

```
npm install --save git://github.com/dimsemenov/photoswipe#v5-beta
```

If you have suggestions on how to improve initialization for some specific framework - feel free to open an issue.



## Required HTML markup

Each element that matches the selector should be or should contain link `<a>` element. The link must have such attributes:

  - Image URL in `href` or `data-pswp-src` attribute (latter has higher priority).
  - Image width in `data-pswp-width`.
  - Image height in `data-pswp-height`.

And optionally:

- `<img>` thumbnail within the link element that will be displayed before large image is loaded (applied only for the first image, can be adjusted via `thumbSelector`).
- Optional `data-cropped="true"` attribute if thumbnail is cropped.

PhotoSwipe API supports almost any markup and any datasource, [read more about it here](data-sources.md).

## Open each image individually

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  // Skip children
  gallery: '#gallery--individual a',

  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.init();
```

```pswp_example gallery
{ 
  "id":"individual"
}
```

</div> 
<!-- PhotoSwipe example block END -->


## Responsive images with srcset

- Add `data-pswp-srcset` attribute. It supports the same markup as [native srcset](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset). 
- Attributes `data-pswp-width` and `data-pswp-height` should define the largest image size.
- `sizes` attribute will be generated automatically based on actual width of the image. For example, if user zooms-in - `sizes` will be adjusted to the new zoom level.

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  gallery: '#gallery--responsive-images',
  children: 'a',
  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.init();
```

```pswp_example gallery
{ 
  "id":"responsive-images",
  "template":"srcset-test"
}
```

</div> 
<!-- PhotoSwipe example block END -->

## How initialization works

1. Lightbox (`photoswipe-lightbox.esm.js`) will be loaded when browser reaches the `import`. It won't block your page rendering as modules are deferred by default. It is also very light comparing to the PhotoSwipe core.
2. Lightbox will bind a single click event to each `gallery`.
3. After user clicks on any `children` the Lightbox will start loading core PhotoSwipe library, specifically:

    - PhotoSwipe core JS file that you may define via `pswpModule` option.
    - The first image.


## Supported browsers and fallback

- The PhotoSwipe supports all browsers that [support ES6 modules](https://caniuse.com/#search=module).
  - Thus, it will not work in IE11, Opera Mini, UC browser, and old versions of Chrome, Safari and Firefox. Check your website/region statistics before deciding whether you should use PhotoSwipe or not.
- Users in unsupported browsers will still be able to view the large image if you use recommended HTML markup - link to image, or link to page that contains image (for example, in WordPress you may link to an attachment page).
- It is not recommended to transpile the script to ES5 - it is not tested in it.
- You may add any fallback via `script type="nomodule"`.
