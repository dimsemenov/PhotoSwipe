---
id: data-sources
title: Data Sources
sidebar_label: Data Sources
---

## From an Array (or NodeList)

Pass an array of any items via `dataSource` option. Its length will determine amount of slides (which may be modified further from [numItems event](#dynamically-generated-data)).

Each item should contain data that you need to generate slide (for image slide it would be `src` (image URL), `w` (width), `h` height, `srcset`, `alt`).

If these properties are not present in your initial array, you may "pre-parse" each item from  [itemData event](#dynamically-generated-data).

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  dataSource: [

    // simple image
    {
      src: 'https://source.unsplash.com/Volo9FYUAzU/1620x1080',
      w: 1620,
      h: 1080,
      alt: 'test image 1'
    },

    {
      src: 'https://source.unsplash.com/RJzHlbKf6eY/1950x1300',
      w: 1950,
      h: 1300,
      alt: 'test image 2'
    },

    // responsive image
    {
      srcset: 'https://dummyimage.com/1500x1000/555/fff/?text=1500x1000 1500w, https://dummyimage.com/1200x800/555/fff/?text=1200x800 1200w, https://dummyimage.com/600x400/555/fff/?text=600x400 600w',
      src: 'https://dummyimage.com/1500x1000/555/fff/?text=1500x1000',
      w: 1500,
      h: 1000,
      alt: 'test image 3',
    },

    // HTML slide
    {
      html: '<div class="custom-html-slide">This is custom HTML slide. <a href="http://example.com" target="_blank" rel="nofollow">Test Link</a>.</div>'
    }

  ],
  showHideAnimationType: 'none',
  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.init();

document.querySelector('#btn-open-pswp-from-arr').onclick = () => {
  lightbox.loadAndOpen(0); // open the first image
};
```

```pswp_example css
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

```pswp_example html
<button id="btn-open-pswp-from-arr" type="button">Open PhotoSwipe</button>
```

</div> 
<!-- PhotoSwipe example block END -->







## Custom last slide

You might want to add a custom last slide, for example to show related galleries. To add it, increase total number of slides by 1 from `numItems` event and make sure that correct `itemData` is returned for the last slide.

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  gallery: '#gallery--custom-last-slide',
  children: 'a',
  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.on('numItems', (e) => {
  e.numItems++;
});
lightbox.on('itemData', (e) => {
  if (e.index === lightbox.getNumItems() - 1) {
    e.itemData = {
      html: '<div class="custom-html-slide">This is custom HTML slide. <a href="http://example.com" target="_blank" rel="nofollow">Link</a>.</div>',
    };
  }
});
lightbox.init();
```

```pswp_example gallery
{
  "id":"custom-last-slide"
}
```

</div> 
<!-- PhotoSwipe example block END -->

## Dynamically generated data

Event `numItems` allows you to override total number of slides. Event `itemData` will trigger every time PhotoSwipe requests data about the slide, which usually happens before slide is displayed or lazy-loaded.

The example below creates a gallery with 1000 images.

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  showHideAnimationType: 'none',
  pswpModule: '/v5/photoswipe/photoswipe.esm.js',
  preload: [1,2]
};
const lightbox = new PhotoSwipeLightbox(options);

lightbox.on('itemData', (e) => {
  e.itemData = {
    src: 'https://dummyimage.com/100x100/555/fff/?text=' + (e.index + 1),
    w: 100,
    h: 100
  };
});
lightbox.on('numItems', (e) => {
  e.numItems = 1000;
});

lightbox.init();

document.querySelector('#btn-open-pswp-dyn-gen').onclick = () => {
  
  lightbox.loadAndOpen(0);
};
```

```pswp_example html
<button id="btn-open-pswp-dyn-gen" type="button">Open PhotoSwipe</button>
```

</div> 
<!-- PhotoSwipe example block END -->


## Custom HTML markup

You may completely override default requirements for HTML markup. In the example below we add thumbnail as `background-image`, define custom attribute for image size and make sure that zoom transition runs from `<a>` rather than from `<img>` within.

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--custom-html-markup',
  children: 'a',

  // Adjust thumbnail selector,
  // (for opening/closing zoom transition)
  thumbSelector: 'a',

  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
});

lightbox.on('itemData', (e) => {
  const { itemData } = e;

  // element is children
  const { element } = itemData; 

  itemData.src = element.href;
  const sizeAttr = element.dataset.mySize;
  itemData.w = Number(sizeAttr.split('x')[0]);
  itemData.h = Number(sizeAttr.split('x')[1]);
  itemData.msrc = element.dataset.thumbSrc;
  itemData.thumbCropped = true;
});

lightbox.init();
```



```pswp_example gallery
{ 
  "id": "custom-html-markup",
  "template": "custom-html-markup-data-source",
  "displayHTML": true
}
```

```pswp_example css
#gallery--custom-html-markup a {
  width: 100px;
  height: 100px;

  background-size: cover;
  background-position: 50% 50%;

  text-indent: -300px;
  overflow: hidden;
}
```

</div> 
<!-- PhotoSwipe example block END -->

