---
id: options
title: Options
sidebar_label: Options
---

### bgOpacity

Number, `0.8`. Background opacity.

### paddingTop, paddingBottom, paddingLeft, paddingRight 
  
Number, 0. Slide area padding (in pixels).

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

### indexIndicatorSep

String, ` / `. Used for slide count indicator ("1 of 10 ").

### panPaddingRatio

Number, `0.15`. A virtual border around the slide, it makes it easier to zoom to the edge of the image (if user clicks on it - image will be zoomed and panned to the corresponding edge). Defined as ratio relative to pan area width and height.

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

### gallerySelector

String. CSS selector.

### childSelector

String|false. CSS selector for elements within `gallerySelector`. For example, link elements. If not defined or set to false - root `gallerySelector` node will be used.

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
