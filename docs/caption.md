---
id: caption
title: Caption
sidebar_label: Caption
---

For now, PhotoSwipe does not support caption out of box, example below shows how to add it via API.

Please make sure that important captions are always accessible without PhotoSwipe — the lightbox is disabled in unsupported browsers. There are also accessibility concerns - screen readers won't be able to properly access the text.


<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js

import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  gallery:'#gallery--with-custom-caption',
  children:'.pswp-gallery__item',
  
  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.on('uiRegister', function() {
  lightbox.pswp.ui.registerElement({
    name: 'custom-caption',
    order: 9,
    isButton: false,
    appendTo: 'root',
    html: 'Caption text',
    onInit: (el, pswp) => {
      lightbox.pswp.on('change', () => {
        const currSlideElement = lightbox.pswp.currSlide.data.element;
        let captionHTML = '';
        if (currSlideElement) {
          const hiddenCaption = currSlideElement.querySelector('.hidden-caption-content');
          if (hiddenCaption) {
            // get caption from element with class hidden-caption-content
            captionHTML = hiddenCaption.innerHTML;
          } else {
            // get caption from alt attribute
            captionHTML = currSlideElement.querySelector('img').getAttribute('alt');
          }
        }
        el.innerHTML = captionHTML || '';
      });
    }
  });
});
lightbox.init();

```

```pswp_example css
.pswp__custom-caption {
  background: rgba(75, 150, 75, 0.75);
  font-size: 16px;
  color: #fff;
  width: calc(100% - 32px);
  max-width: 400px;
  padding: 2px 8px;
  border-radius: 4px;

  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
}
.pswp__custom-caption a {
  color: #fff;
  text-decoration: underline;
}
.hidden-caption-content {
  display: none;
}
```



```pswp_example gallery
{ 
  "template":"caption",
  "id":"with-custom-caption"
}
```

</div> 
<!-- PhotoSwipe example block END -->

## Sidebar caption

// TODO