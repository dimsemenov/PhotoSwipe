---
id: adding-custom-buttons
title: Adding Buttons
sidebar_label: Adding custom buttons
---

Use method `pswp.ui.registerElement` to add any interactive element inside PhotoSwipe. It must be called within or after `uiRegister` event. For example:

## Adding button to toolbar

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js

import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  gallery:'#gallery--with-custom-button',
  children:'a',
  
  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.on('uiRegister', function() {
  lightbox.pswp.ui.registerElement({
    name: 'test-button',
    order: 9,
    isButton: true,
    html: 'Test',
    onClick: (event, el) => {
      if ( confirm('Do you want to toggle zoom?') ) {
        lightbox.pswp.toggleZoom();
      }
    }
  });
});
lightbox.init();

```

```pswp_example css
button.pswp__button--test-button {
  background: #136912 !important;
  font-size: 20px;
  color: #fff;
}
```



```pswp_example gallery
{ 
  "id":"with-custom-button",
  "autoImages":"4"
}
```

</div> 
<!-- PhotoSwipe example block END -->


## Adding HTML indicator to toolbar

Display zoom level of the current image.

<!-- PhotoSwipe example block START -->
<div class="pswp-example">

```pswp_example js
import PhotoSwipeLightbox from '/v5/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  gallery:'#gallery--with-custom-toolbar-indicator',
  children:'a',
  
  pswpModule: '/v5/photoswipe/photoswipe.esm.js'
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.on('uiRegister', function() {
  lightbox.pswp.ui.registerElement({
    name: 'zoom-level-indicator',
    order: 9,
    onInit: (el, pswp) => {
      pswp.on('zoomPanUpdate', (e) => {
        if (e.slide === pswp.currSlide) {
          el.innerText = 'Zoom level is ' + Math.round(pswp.currSlide.currZoomLevel * 100) + '%';
        }
      });
    }
  });
});
lightbox.init();
```

```pswp_example css
.pswp__zoom-level-indicator {
  background: #136912;
  font-size: 16px;
  line-height: 1;
  font-weight: bold;
  color: #fff;
  height: auto;
  align-self: center;
  padding: 4px 6px 5px;
  margin-right: 4px;
}
```

```pswp_example gallery
{ 
  "id":"with-custom-toolbar-indicator",
  "autoImages":"3"
}
```

</div> 
<!-- PhotoSwipe example block END -->

## ui.registerElement explanation

```js
let myTestElement = {
  // Unique name of the UI element,
  // it will be part of class attribute
  // pswp__button--test123 (for buttons)
  // pswp__test123 (for other elements)
  name: 'test123',

  // Order of element, default order elements:
  // counter - 5, zoom button - 10, info - 15, close - 20.
  order: 9,

  // Whether element should be 
  // rendered as <button> or <div>
  isButton: true,

  // Button title, optional
  title: 'Button title', 
  
  // html string, will be added inside button, optional
  // can also be an object with svg data (used internally)
  html: 'Test', 

  // Element container, possible values:
  // - 'bar'  (top toolbar, .pswp__top-bar, default value), 
  // - 'wrapper' (scroll viewport wrapper, .pswp__scroll-wrap),
  // - 'root' (root element of the dialog, .pswp) 
  // If you add a text inside 'wrapper' - it won't be selectable,
  // as PhotoSwipe intersects all touch events there.
  position: 'bar',

  // callback is triggered right before 
  // corresponding element is added to DOM
  // (while dialog is opening/creating)
  onInit: function(el, pswp) {
    // el - reference to your DOM element
    // pswp - PhotoSwipe object
    // You may modify element here, for example:
    el.classList.add('my-test-class');
  }, 

  // when user clicks or taps on element
  onClick: function (event, el, pswp) {
    console.log('clicked element:', el);
  }
};

// registerElement method must be called within or after uiRegister event
pswp.ui.registerElement(myTestElement);
```

All default buttons and elements also use this syntax, so you can look up more examples in folder `/src/js/ui/` within repository.