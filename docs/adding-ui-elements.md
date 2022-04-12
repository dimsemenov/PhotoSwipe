---
id: adding-ui-elements
title: Adding UI elements
sidebar_label: Adding UI elements
---

Use method `pswp.ui.registerElement` to add any interactive element inside PhotoSwipe. It must be called within or after `uiRegister` event. For example:

## Adding a Button to the Toolbar

<PswpCodePreview galleryID="with-custom-button" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  gallery:'#gallery--with-custom-button',
  children:'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.on('uiRegister', function() {
  lightbox.pswp.ui.registerElement({
    name: 'test-button',
    ariaLabel: 'Toggle zoom',
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

```css pswpcode
button.pswp__button--test-button {
  background: #136912 !important;
  font-size: 20px;
  color: #fff;
}
```

</PswpCodePreview>


## Adding HTML Indicator to the Toolbar

Display zoom level of the current image.

<PswpCodePreview galleryID="with-custom-toolbar-indicator">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  gallery:'#gallery--with-custom-toolbar-indicator',
  children:'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
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

```css pswpcode
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

</PswpCodePreview>


## Adding Download Button

When you provide an SVG, make sure that it has `aria-hidden="true"` and `pswp__icn` class to preserve styling.

<PswpCodePreview galleryID="with-download-button" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  gallery:'#gallery--with-download-button',
  children:'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.on('uiRegister', function() {
  lightbox.pswp.ui.registerElement({
    name: 'download-button',
    order: 8,
    isButton: true,
    tagName: 'a',

    // SVG with outline
    html: {
      isCustomSVG: true,
      inner: '<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
      outlineID: 'pswp__icn-download'
    },

    // Or provide full svg:
    // html: '<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" class="pswp__icn"><path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" /></svg>',

    // Or provide any other markup:
    // html: '<i class="fa-solid fa-download"></i>' 

    onInit: (el, pswp) => {
      el.setAttribute('download', '');
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');

      pswp.on('change', () => {
        console.log('change');
        el.href = pswp.currSlide.data.src;
      });
    }
  });
});
lightbox.init();

```

```css pswpcode
button.pswp__button--test-button {
  background: #136912 !important;
  font-size: 20px;
  color: #fff;
}
```

</PswpCodePreview>


## Adding Navigation Indicator (bullets)


<PswpCodePreview galleryID="with-bullets" numItems="4">

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  gallery:'#gallery--with-bullets',
  children:'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.on('uiRegister', function() {
  lightbox.pswp.ui.registerElement({
    name: 'bulletsIndicator',
    className: 'pswp__bullets-indicator',
    appendTo: 'wrapper',
    onInit: (el, pswp) => {
      const bullets = [];
      let bullet;
      let prevIndex = -1;

      for (let i = 0; i < pswp.getNumItems(); i++) {
        bullet = document.createElement('div');
        bullet.className = 'pswp__bullet';
        bullet.onclick = (e) => {
          pswp.goTo(bullets.indexOf(e.target));
        };
        el.appendChild(bullet);
        bullets.push(bullet);
      }

      pswp.on('change', (a,) => {
        if (prevIndex >= 0) {
          bullets[prevIndex].classList.remove('pswp__bullet--active');
        }
        bullets[pswp.currIndex].classList.add('pswp__bullet--active');
        prevIndex = pswp.currIndex;
      });
    }
  });
});
lightbox.init();

```

```css pswpcode
.pswp__bullets-indicator {
  display: flex;
  flex-direction: row;
  align-items: center;

  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%, 0);
}
.pswp__bullet {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #fff;
  margin: 0 5px;
}
.pswp__bullet--active { 
  background: green;
}
```

</PswpCodePreview>


## ui.registerElement() API

```js
// registerElement method must be called within or after uiRegister event
pswp.ui.registerElement({
  // Unique name of the UI element,
  name: 'test123',

  // Classname of the element. 
  // Optional, if not defined - name will be used 
  // in format pswp__button--name, or pswp__name
  className: undefined,

  // Order of element, default order elements:
  // counter - 5, zoom button - 10, info - 15, close - 20.
  order: 9,

  // If element should be 
  // rendered as button
  isButton: true,

  // Element tag name,
  // Optional, if not defined - button or div will be used
  tagName: 'a',

  // Button title, optional
  title: 'Button title', 

  // Button aria-label attribute,
  // if not defined - title will be used
  ariaLabel: undefined,
  
  // html string, will be added inside button, optional
  // can also be an object with svg data
  html: 'Test', 

  // Element container, possible values:
  // - 'bar'  (top toolbar, .pswp__top-bar, default value), 
  // - 'wrapper' (scroll viewport wrapper, .pswp__scroll-wrap),
  // - 'root' (root element of the dialog, .pswp) 
  // If you add a text inside 'wrapper' - it won't be selectable,
  // as PhotoSwipe intersects all touch events there.
  appendTo: 'bar',

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
});
```

All default buttons and elements also use this syntax, so you can look up more examples in folder `/src/js/ui/` within the repository.

If you need to override or slightly adjust existing buttons - feel free to use [`uiElement` filter](/filters#uielement).

`registerElement` is not the only method to add various UI elements, it's just an optional shortcut. Feel free to append elements manually.