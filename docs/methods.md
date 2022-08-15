---
id: methods
title: Methods
sidebar_label: Methods
---

## PhotoSwipeLightbox methods

```js
const lightbox = new PhotoSwipeLightbox({
  // options
});

// initialize lightbox, should be called only once,
// it's not included in the main constructor, so you may bind events before it
lightbox.init();

// Open slide by index
lightbox.loadAndOpen(0);

// unbinds all events, closes PhotoSwipe if it's open
lightbox.destroy();
```

## PhotoSwipe core methods

You can access PhotoSwipe core instance only after lightbox is opened (for example, within `beforeOpen` event).

Alternatively, you may use PhotoSwipe core without Lightbox, see example on [Data Sources page](/data-sources#without-lightbox-module).

```js
const lightbox = new PhotoSwipeLightbox({
  // options...
});
lightbox.init();

lightbox.on('beforeOpen', () => {
  const pswp = lightbox.pswp;

  // go to slide by index
  pswp.goTo(3);

  // go to next slide
  pswp.next();

  // go to previous slide
  pswp.prev();

  // close the PhotoSwipe (with animation, if enabled)
  // PhotoSwipe will automatically destroy after it's closed
  pswp.close();

  // instantly close and destroy the PhotoSwipe
  pswp.close();

  // zoom slide to
  pswp.currSlide.zoomTo(
    1, // slide zoom level, 1 - original image size
    { x: 0, y: 0 }, // zoom center point
    2000, // transition duration, can be 0
    false // wether pan/zoom bounds should be ignored
  );

  // pan slide to
  pswp.currSlide.panTo(
    100, // x position
    100, // y position
  );
});
```

## Dynamically adding or removing slides

PhotoSwipe parses and renders only nearby slides based on `preload` option (but not less than 2 nearby). 

The data about slides is stored within `pswp.options.dataSource` and its structure depends on the source. If you initialize PhotoSwipe from DOM elements (via `gallery` and `children` options) the `dataSource` will be:

```
pswp.options.dataSource = {
  gallery: <Gallery element>
  items: [
    <Child element>,
    <Child element>,
    <Child element>,
    // etc.
  ]
}
```

And if you pass array as a `dataSource`, it'll be just an array and you may modify it the same way:

```js
pswp.options.dataSource = [
  { src: 'image1.jpg', width: 100, height: 50 },
  { src: 'image2.jpg', width: 100, height: 50 },
  { src: 'image3.jpg', width: 100, height: 50 }
]
```

You may modify `pswp.options.dataSource` array however you wish - push new items, replace, sort, pop, shift, etc. 

If you modified slides that are currently active (current, next or previous) - call method `refreshSlideContent(slideIndex)` to reload a slide by index. For example:

<PswpCodePreview>

```js pswpcode
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  dataSource: [
    { src: 'https://dummyimage.com/800x600/555/fff/?text=1', width: 800, height: 600 },
    { src: 'https://dummyimage.com/800x600/555/fff/?text=2', width: 800, height: 600 },
    { src: 'https://dummyimage.com/800x600/555/fff/?text=3', width: 800, height: 600 },
    { src: 'https://dummyimage.com/800x600/555/fff/?text=4', width: 800, height: 600 },
    { src: 'https://dummyimage.com/800x600/555/fff/?text=5', width: 800, height: 600 },
  ],
  pswpModule: () => import('/photoswipe/photoswipe.esm.js')
});
lightbox.on('uiRegister', () => {
  const { pswp }  = lightbox;

  let replacedCount = 0;
  pswp.ui.registerElement({
    name: 'replaceCurrentSlide',
    className: 'pswp__button--test-button',
    order: 9,
    isButton: true,
    html: 'Replace Current Slide',
    onClick: (event, el) => {
      replacedCount++;
      pswp.options.dataSource[pswp.currSlide.index] = {
        src: 'https://dummyimage.com/800x600/555/fff/?text=New%20Slide%20' + replacedCount, width: 800, 
        height: 600
      };
      pswp.refreshSlideContent(pswp.currSlide.index);
    }
  });

  let addedCount = 0;
  pswp.ui.registerElement({
    name: 'addSlide',
    className: 'pswp__button--test-button',
    order: 9,
    isButton: true,
    html: 'Add Slide',
    onClick: (event, el) => {
      addedCount++;
      pswp.options.dataSource.push({
        src: 'https://dummyimage.com/800x600/555/fff/?text=Added%20slide%20' + addedCount, width: 800, 
        height: 600
      });
      pswp.refreshSlideContent(pswp.getNumItems() - 1);
    }
  });
});
lightbox.init();

document.querySelector('#btn-add-remove-test').onclick = () => {
  lightbox.loadAndOpen(0);
};
```

```html pswpcode
<button id="btn-add-remove-test" type="button">Open PhotoSwipe</button>
```

```css pswpcode
button.pswp__button--test-button {
  background: #136912 !important;
  font-size: 20px;
  color: #fff;
}
```

</PswpCodePreview>

Alternatively, you may omit `dataSource` option entirely and use filters to supply data and number of items, example on the [Data Sources page](/data-sources#dynamically-generated-data).

## UI

Refer to [Styling](/styling) page on how to adjust the UI (add buttons, modify icons, etc).
