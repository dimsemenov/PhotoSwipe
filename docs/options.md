---
id: options
title: Options
sidebar_label: Options
---

### bgOpacity

Number, `0.8`. Background opacity.

### spacing

Number, `0.1`. Spacing between slides. Defined as ratio relative to the viewport width (0.1 = 10% of viewport).

### allowPanToNext

Boolean, `true`. Allow swipe navigation to the next slide when the current slide is zoomed.


### loop

Boolean, `true`. If set to true you'll be able to swipe from the last to the first image. Option is always `false` when there are less than 3 slides.

### pinchToClose

Boolean, `true`. Pinch to close.

### closeOnVerticalDrag

Boolean, `true`. Vertical drag to close.

### padding
  
Object, `{ top: 0, bottom: 0, left: 0, right: 0 }`. Slide area padding (in pixels).

### paddingFn

Function, should return padding object. Overrides `padding` option if defined. For example:

```
paddingFn: (viewportSize) => {
  return {
    top: 0,
    bottom: viewportSize.x < 600 ? 0 : 200,
    left: 0,
    right: 0
  };
}
```

### hideAnimationDuration, showAnimationDuration, zoomAnimationDuration

Number, `333`. Transition duration in milliseconds, can be `0`. See [example here](opening-or-closing-transition.md#transition-duration-and-easing).

### easing

String, `'cubic-bezier(.4,0,.22,1)'`. CSS easing function for open/close/zoom transitions.


### escKey

Boolean, `true`. Esc key to close.


### arrowKeys

Boolean, `true`. Left/right arrow keys for navigation.


### returnFocus

Boolean, `true`. Restore focus the last active element after PhotoSwipe is closed. 

### clickToCloseNonZoomable

Boolean, `true`. If image is not zoomable (for example, smaller than viewport) it can be closed by clicking on it.

### imageClickAction, bgClickAction, tapAction, doubleTapAction

Refer to [click and tap actions](click-and-tap-actions.md) page.

### preloaderDelay

Number (ms), `2000`. Delay before the loading indicator will be displayed, if image is loaded during it - the indicator will not be displayed at all. Can be zero.

### indexIndicatorSep

String, ` / `. Used for slide count indicator ("1 of 10 ").

### getViewportSizeFn

Function `{x: width, y: height}`, `null`. A function that should return PhotoSwipe viewport width and height, in format `{x: 100, y: 100}`, for example:

```js
getViewportSizeFn: function(options, pswp) {
  return {
    x: document.documentElement.clientWidth,
    y: window.innerHeight
  };
}
```

### getWheelZoomFactorFn

A function that should return a number. The number represents by how much the current image should be scaled after `wheel` event. For example:

```js
getWheelZoomFactorFn(e, pswp) {
  // pswp.currSlide.currZoomLevel - scale of the current slide image
  return e.deltaY < 0 ? 1.2 : 0.8;
}
```

### index

Number, `0`. Initial slide index.

### errorMsg

String, `<div class="pswp__error-msg"><a href="" target="_blank">The image</a> could not be loaded.</div>`. Message to display when image cannot be loaded. `href` attribute of the first `<a>` will be populated by the current image URL.

### preload

Array, `[1, 2]`. Lazy loading of nearby slides based on direction of movement. Should be an array with two integers, first one - number of items to preload before the current image, second one - after the current image.




### mainClass

String, `null`. Class that will be added to the root element of PhotoSwipe, may contain multiple separated by space.

### appendToEl

DOMElement, `document.body`. Element to which PhotoSwipe dialog will be appended when it opens.


## Lightbox module options

See [getting started](getting-started.md) and [data sources](data-sources.md) for examples.

### gallery

Element, NodeList, or CSS selector (string) for the gallery element. The legacy version of the option (`gallerySelector`) can also be used.


### children

Element, NodeList, or CSS selector (string) for elements within `gallery`. For example, link elements. If not defined or set to false - root `gallery` node will be used.

### pswpModule

String|Object, `null`. URL to PhotoSwipe Core module JS file or the module object itself, optional.

### preloadFirstSlide

Boolean, `true`. Loads the first slide image in parallel with PhotoSwipe Core.

### getClickedIndexFn

Function, `null`. A function that should return index of the clicked gallery item.

```js
getClickedIndexFn: function(e) {
  // e - event that triggered opening
  return 0; // open at first slide
}
```
