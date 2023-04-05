---
id: custom-content
title: Custom Content in Slides
sidebar_label: Custom content
---

By default PhotoSwipe can only show images or raw HTML content, but you may use content events and filters to support new types.

Please note that PhotoSwipe is mainly designed to display photos. There are issues with displaying other types of content - for example, you can't swipe over iframes. Always have a fallback, for example if you embed Google Map - make sure that there is an outbound link to it.

## Using WebP image format

The example below uses `<picture>` instead of `<img>` for slides that support webp. The webp image source is retrieved from `data-pswp-webp-src` attribute.

import { contentTypesTemplate } from '@site/src/components/PswpCodePreview/gallery-templates/content-types.js';

<PswpCodePreview galleryID="webp-demo" templateFn={contentTypesTemplate} displayHTML>

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--webp-demo',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});

// Parse data-pswp-webp-src attribute
lightbox.addFilter('itemData', (itemData, index) => {
  const webpSrc = itemData.element.dataset.pswpWebpSrc;
  if (webpSrc) {
    itemData.webpSrc = webpSrc;
  }
  return itemData;
});

// use <picture> instead of <img>
lightbox.on('contentLoad', (e) => {
    const { content, isLazy } = e;

    if (content.data.webpSrc) {
      // prevent to stop the default behavior
      e.preventDefault();

      content.pictureElement = document.createElement('picture');
      
      const sourceWebp = document.createElement('source');
      sourceWebp.srcset = content.data.webpSrc;
      sourceWebp.type = 'image/webp';

      const sourceJpg = document.createElement('source');
      sourceJpg.srcset = content.data.src;
      sourceJpg.type = 'image/jpeg';

      content.element = document.createElement('img');
      content.element.src = content.data.src;
      content.element.setAttribute('alt', '');
      content.element.className = 'pswp__img';

      content.pictureElement.appendChild(sourceWebp);
      content.pictureElement.appendChild(sourceJpg);
      content.pictureElement.appendChild(content.element);

      content.state = 'loading';

      if (content.element.complete) {
        content.onLoaded();
      } else {
        content.element.onload = () => {
          content.onLoaded();
        };

        content.element.onerror = () => {
          content.onError();
        };
      }
    }
});


// by default PhotoSwipe appends <img>,
// but we want to append <picture>
lightbox.on('contentAppend', (e) => {
  const { content } = e;
  if (content.pictureElement && !content.pictureElement.parentNode) {
    e.preventDefault();
    content.slide.container.appendChild(content.pictureElement);
  }
});

// for next/prev navigation with <picture>
// by default PhotoSwipe removes <img>,
// but we want to remove <picture>
lightbox.on('contentRemove', (e) => {
  const { content } = e;
  if (content.pictureElement && content.pictureElement.parentNode) {
    e.preventDefault();
    content.pictureElement.remove();
  }
});

lightbox.init();
```

</PswpCodePreview>

## Google Maps demo

Another example that shows a map `<iframe>`. 

To define the type of slide, you may use `data-pswp-type` attribute (or `type` property of the slide object). Built-in types are `image` and `html`. The example below uses a custom `google-map` type.

```html
<a data-pswp-type="google-map" data-google-map-url="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d325518.68780316407!2d30.252511957059642!3d50.4016990487754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cf4ee15a4505%3A0x764931d2170146fe!2z0JrQuNC10LIsIDAyMDAw!5e0!3m2!1sru!2sua!4v1647422169265!5m2!1sru!2sua" href="https://maps.google.com/maps?ll=50.402036,30.532691&z=10&t=m&mapclient=embed&q=%D0%9A%D0%B8%D0%B5%D0%B2%2002000" target="_blank"><img src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/map-thumb.png" alt=""></a>
```

<PswpCodePreview>

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--google-map-demo',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});

// parse data-google-map-url attribute
lightbox.addFilter('itemData', (itemData, index) => {
  const googleMapUrl = itemData.element.dataset.googleMapUrl;
  if (googleMapUrl) {
    itemData.googleMapUrl = googleMapUrl;
  }
  return itemData;
});

// override slide content
lightbox.on('contentLoad', (e) => {
    const { content } = e;
    if (content.type === 'google-map') {
      // prevent the deafult behavior
      e.preventDefault();

      // Create a container for iframe
      // and assign it to the `content.element` property
      content.element = document.createElement('div');
      content.element.className = 'pswp__google-map-container';

      const iframe = document.createElement('iframe');
      iframe.setAttribute('allowfullscreen', '');
      iframe.src = content.data.googleMapUrl;
      content.element.appendChild(iframe);
    }
});

lightbox.init();
```

```css pswpcode 
.pswp__google-map-container {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.pswp__google-map-container iframe {
  background: #444;
  width: 100%;
  height: 100%;
  max-width: 800px;
  max-height: 600px;
  pointer-events: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

```html pswpcode
<div class="pswp-gallery" id="gallery--google-map-demo">
<a href="https://maps.google.com/maps?ll=50.402036,30.532691&z=10&t=m&mapclient=embed&q=%D0%9A%D0%B8%D0%B5%D0%B2%2002000" data-google-map-url="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d325518.68780316407!2d30.252511957059642!3d50.4016990487754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cf4ee15a4505%3A0x764931d2170146fe!2z0JrQuNC10LIsIDAyMDAw!5e0!3m2!1sru!2sua!4v1647422169265!5m2!1sru!2sua" data-pswp-type="google-map" target="_blank">
    <img src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/map-thumb.png" alt="">
  </a>
<a href="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg" data-pswp-width="1669" data-pswp-height="2500" target="_blank">
    <img src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-200.jpg" alt="">
  </a>
<a href="https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-2500.jpg" data-pswp-width="2500" data-pswp-height="1666" target="_blank">
    <img src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-200.jpg" alt="">
  </a>
</div>
```

</PswpCodePreview>
