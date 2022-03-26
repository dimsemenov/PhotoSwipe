---
id: caption
title: Caption
sidebar_label: Caption
---

PhotoSwipe does not support caption out of box, but you may implement a basic caption via API, as you can see below. Or you may use a [dynamic caption plugin](https://github.com/dimsemenov/photoswipe-dynamic-caption-plugin). 

**Important!** Please make sure that caption is always accessible without PhotoSwipe for screen reader users — the lightbox is disabled in unsupported browsers. If you are unable to show the caption text on the page - make sure that image has a proper `alt` attribute, `aria-labelledby`, or `<figcaption>` inside `<figure>`.

import { captionTemplate } from '@site/src/components/PswpCodePreview/gallery-templates/caption.js';

<PswpCodePreview galleryID="with-custom-caption" templateFn={captionTemplate}>

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  gallery:'#gallery--with-custom-caption',
  children:'.pswp-gallery__item',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
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

```css pswpcode
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

</PswpCodePreview>
