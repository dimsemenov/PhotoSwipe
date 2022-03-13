---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---


Before you start:

- PhotoSwipe requires predefined image dimensions, you must define width and height of each image.
- PhotoSwipe is not designed to display very large images. Serve responsive images. Maximum recommended size is 3000x3000px. However, there is an [experimental tiling plugin](https://github.com/dimsemenov/photoswipe-deep-zoom-plugin) that allows to show extremely large images.
- PhotoSwipe works only in modern browsers. The script is distributed as ES6 module, thus it will work only in browsers that support them ([caniuse](https://caniuse.com/#feat=es6-module)). You can transpile it to ES5, but it's redundant.


## Initialization

```
npm install --save photoswipe#beta
```

The PhotoSwipe consists of three parts:

1. **Core** (`photoswipe.esm.js`).
2. **Lightbox** (`photoswipe-lightbox.esm.js`) - loads **Core** and chooses when PhotoSwipe should be opened. Its file size is significantly smaller. It also loads the first image (in parallel with **Core**).
3. **CSS** (`photoswipe.css`) - a single file that controls all the styling. There are no external assets for icons - all of them are dynamically generated via JS and very tiny. Refer to [styling](/styling) for more info.

JS files are separated, so you can dynamically load **Core** only when user actually needs it, thus reducing the size of your main bundle.

If you aren't using any bundlers of frameworks, you may use a single `<script type="module">` to initialize everything.

### With dynamic import

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

  // setup PhotoSwipe Core dynamic import
  pswpModule: () => import('/v5/photoswipe/photoswipe.esm.js')
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

### Without dynamic import

Use this method when PhotoSwipe is one of the primary features of your page.

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example html
<script type="module">
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
import PhotoSwipe from '/v5/photoswipe/photoswipe.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--no-dynamic-import',
  children: 'a',
  pswpModule: PhotoSwipe
});
lightbox.init();
</script>
```

```pswp_example gallery
{ 
  "id":"no-dynamic-import"
}
```

</div> 
<!-- PhotoSwipe example block END -->



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

  pswpModule: () => import('/v5/photoswipe/photoswipe.esm.js')
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
  pswpModule: () => import('/v5/photoswipe/photoswipe.esm.js')
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

## Supported browsers and fallback

- The PhotoSwipe supports all browsers that [support ES6 modules](https://caniuse.com/#search=module).
  - Thus, it will not work in IE11, Opera Mini, UC browser, and old versions of Chrome, Safari and Firefox. Check your website/region statistics before deciding whether you should use PhotoSwipe or not.
- Users in unsupported browsers will still be able to view the large image if you use recommended HTML markup - link to image, or link to page that contains image (for example, in WordPress you may link to an attachment page).
- You may add any fallback via `script type="nomodule"`.
