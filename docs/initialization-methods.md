---
id: initialization-methods
title: Initialization Methods
sidebar_label: Init methods
---

You don't need to use any bundlers to include PhotoSwipe, but it still supports them.

## Vanilla methods:

### as URL

PhotoSwipe core (`pswpModule`) will load only after lightbox starts to open to relief the initial page load. It must be either absolute URL, or URL relative to PhotoSwipeLightbox.

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example html
<script type="module">
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  pswpModule: '/v5/photoswipe/photoswipe.esm.js', // or './photoswipe.esm.js'

  gallery: '#gallery--pswp-module-as-url',
  children: 'a',
});
lightbox.init();
</script>
```

```pswp_example gallery
{ 
  "id":"pswp-module-as-url"
}
```

</div> 
<!-- PhotoSwipe example block END -->

### as Promise

This method is identical to the previous one. However, it's more friendly with module bundlers, since they will automatically generate the correct URL for `import()`.

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example html
<script type="module">
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  pswpModule: () => import('/v5/photoswipe/photoswipe.esm.js'),
  gallery: '#gallery--pswp-module-as-promise',
  children: 'a',
});
lightbox.init();
</script>
```

```pswp_example gallery
{ 
  "id":"pswp-module-as-promise"
}
```

</div> 
<!-- PhotoSwipe example block END -->


### as Module

Both Lightbox and core will load at the same time.

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example html
<script type="module">
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
import PhotoSwipe from '/v5/photoswipe/photoswipe.esm.js';

const lightbox = new PhotoSwipeLightbox({
  pswpModule: PhotoSwipe,
  gallery: '#gallery--pswp-module',
  children: 'a',
});
lightbox.init();
</script>
```

```pswp_example gallery
{ 
  "id":"pswp-module"
}
```

</div> 
<!-- PhotoSwipe example block END -->

