---
id: manual-tests
title: Manual Tests
sidebar_label: Manual Tests
---

This page contains a bunch of manual tests.


## With loop:true

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example html
<script type="module">
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--loop-1',
  children: 'a',
  loop: true,
  pswpModule: () => import('/v5/photoswipe/photoswipe.esm.js')
});
lightbox.init();
</script>
```

```pswp_example gallery
{ 
  "id":"loop-1",
  "autoImages":1
}
```

</div> 
<!-- PhotoSwipe example block END -->



<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example html
<script type="module">
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--loop-2',
  children: 'a',
  loop: true,
  pswpModule: () => import('/v5/photoswipe/photoswipe.esm.js')
});
lightbox.init();
</script>
```

```pswp_example gallery
{ 
  "id":"loop-2",
  "autoImages":2
}
```

</div> 
<!-- PhotoSwipe example block END -->


<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example html
<script type="module">
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--loop-3',
  children: 'a',
  loop: true,
  pswpModule: () => import('/v5/photoswipe/photoswipe.esm.js')
});
lightbox.init();
</script>
```

```pswp_example gallery
{ 
  "id":"loop-3",
  "autoImages":3
}
```

</div> 
<!-- PhotoSwipe example block END -->



<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example html
<script type="module">
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--loop-10',
  children: 'a',
  loop: true,
  pswpModule: () => import('/v5/photoswipe/photoswipe.esm.js')
});
lightbox.init();
</script>
```

```pswp_example gallery
{ 
  "id":"loop-10",
  "autoImages": 10
}
```

</div> 
<!-- PhotoSwipe example block END -->

## With loop:false


<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example html
<script type="module">
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--loop-disabled-1',
  children: 'a',
  loop: false,
  pswpModule: () => import('/v5/photoswipe/photoswipe.esm.js')
});
lightbox.init();
</script>
```

```pswp_example gallery
{ 
  "id":"loop-disabled-1",
  "autoImages":1
}
```

</div> 
<!-- PhotoSwipe example block END -->



<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example html
<script type="module">
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--loop-disabled-2',
  children: 'a',
  loop: false,
  pswpModule: () => import('/v5/photoswipe/photoswipe.esm.js')
});
lightbox.init();
</script>
```

```pswp_example gallery
{ 
  "id":"loop-disabled-2",
  "autoImages":2
}
```

</div> 
<!-- PhotoSwipe example block END -->


<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example html
<script type="module">
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--loop-disabled-3',
  children: 'a',
  loop: false,
  pswpModule: () => import('/v5/photoswipe/photoswipe.esm.js')
});
lightbox.init();
</script>
```

```pswp_example gallery
{ 
  "id":"loop-disabled-3",
  "autoImages":3
}
```

</div> 
<!-- PhotoSwipe example block END -->



<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example html
<script type="module">
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--loop-disabled-10',
  children: 'a',
  loop: false,
  pswpModule: () => import('/v5/photoswipe/photoswipe.esm.js')
});
lightbox.init();
</script>
```

```pswp_example gallery
{ 
  "id":"loop-disabled-10",
  "autoImages": 10
}
```

</div> 
<!-- PhotoSwipe example block END -->