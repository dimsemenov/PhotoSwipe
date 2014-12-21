---

layout: default

title: PhotoSwipe API

h1_title: API

description: Public methods, properties and events of PhotoSwipe JavaScript image gallery.

addjs: true

canonical_url: http://photoswipe.com/documentation/api.html

buildtool: true

markdownpage: true

---

All methods and properties listed on this page are public. If you want to take a look at example of what API can do, take a look in [source of default PhotoSwipe UI](https://github.com/dimsemenov/PhotoSwipe/blob/master/src/js/ui/photoswipe-ui-default.js).

You can get PhotoSwipe instance object during the initialization, e.g.:

```javascript
var photoswipeInstance = new PhotoSwipe( /* ... */ );
```

## Methods

```javascript
var pswp = new PhotoSwipe( /* ... */ );

// Intialise gallery (open it)
pswp.init();


// Go to slide by index (int)
pswp.goTo(index);

// Go to next slide
pswp.next();

// Go to previous slide
pswp.prev();

// Update size of gallery.
// Has one parameter, if you set it to "true", 
// it'll force update size
// (even if viewport size hasn't changed) 
pswp.updateSize(force);

// close gallery
pswp.close();

// destroy gallery
// function is automatically called after close()
pswp.destroy()

// Zoom current item to (optionally with animation)
// @param  {number} destZoomLevel Destination scale number. 1 - original.  pswp.currItem.fitRatio - image will fit into viewport.
// @param  {object} centerPoint   Object of x and y coordinates, relative to viewport.
// @param  {int}    speed         Animation duration. Can be 0.
// @param  {function} easingFn    Optional easing function.
// @param  {function} updateFn    Optional function that will run.
//
// For example: 
// pswp.zoomTo(2, {x:pswp.viewportSize.x/2,y:pswp.viewportSize.y/2}, 2000);
// (will 2x zoom to center of image)
// 
pswp.zoomTo(destZoomLevel, centerPoint, speed);


// Apply zoom and pan to current image
// e.g. pswp.applyZoomPan(1, 0, 0) will
// zoom current image to original size
// and will place it in top left corner
pswp.applyZoomPan(zoomLevel, panX, panY);
```

## Properties

```javascript

// current slide object
pswp.currItem

// size of sliding viewport
pswp.viewportSize

// object holds all functions from framework
// framework-bridge.js
pswp.framework

// UI object (e.g. PhotoSwipeUI_Default instance)
pswp.ui

// background element (pswp__bg)
pswp.bg

// container element (pswp__container)
pswp.container


// Even though methods below aren't technically properties, we list them here:

// current item index (int)
pswp.getCurrentIndex();

// current zoom level
pswp.getZoomLevel();

// one (or more) pointer is used
pswp.isDragging();

// two (or more) pointers are used
pswp.isZooming();

// when transition between slides runs (after swipe)
pswp.isMainScrollAnimating();
```

## Events

PhotoSwipe uses very simple Event/Messaging system. It has two methods `shout` (triggers event) and `listen` (handles event). For now there is no method to unbind listener, but all of them are cleared when PhotoSwipe is closed.

```javascript
var pswp = new PhotoSwipe(/* ... */);

pswp.listen('helloWorld', function(name) {
	alert('Name is: ' + name);
});

pswp.shout('helloWorld', 'John' /* you may pass more arguments */);
```

Available events:

```javascript

// Before slides change. 
// Update UI here (like "1 of X" indicator)
pswp.listen('beforeChange', function() { });

// After slides change
pswp.listen('afterChange', function() { });

// Image loaded
pswp.listen('imageLoadComplete', function(index, item) { });


// allow you to call preventDefault of down and up events
pswp.listen('preventDragEvent', function(e, isDown, preventObj) {
	// e - original event
	// isDown - true = drag start, false = drag release

	// This line will force e.preventDefault() on:
	// touchstart/mousedown/pointerdown events
	// as well as on:
	// touchend/mouseup/pointerup events
	preventObj.prevent = true;
});

// Viewport size is changed
pswp.listen('resize', function() { });

// Triggers when PhotoSwipe "reads" slide object data
// use it to dynamically change properties, e.g.:
pswp.listen('gettingData', function(index, item) {
	if( something ) {
		item.src = item.something;
	} else {
		item.src = item.somethingElse;
	}
});

// Mouse was used (trigger only once)
pswp.listen('mouseUsed', function() { });

// Opening zoom in animation
pswp.listen('initialZoomIn', function() { });

// Opening zoom in animation finished
pswp.listen('initialZoomInEnd', function() { });


// Allows overriding vertical margin for individual items
pswp.listen('parseVerticalMargin', function(item) { 
	// For example:
	var gap = item.vGap;

	gap.top = 50; // There will be 50px gap from top of viewport
	gap.bottom = 100; // and 100px gap from the bottom
})


// Gallery starts closing
pswp.listen('close', function() { });

// Gallery unbinds events
pswp.listen('unbindEvents', function() { });

// Closing zoom out animation
pswp.listen('initialZoomOut', function() { });

// After PhotoSwipe is closed
// clean up your stuff here
pswp.listen('destroy', function() { });

// PhotoSwipe has a special event called pswpTap.
// It's dispatched using default JavaScript event model.
// So you can, for example, call stopPropagation on it.
// pswp.framework.bind - is a shorthand for addEventListener
pswp.framework.bind( pswp.scrollWrap /* bind on any element of gallery */, 'pswpTap', function(e) {
    console.log('tap', e, e.detail);
    // e.detail.origEvent  // original event that finished tap (e.g. mouseup or touchend)
    // e.detail.target // e.target of original event
    // e.detail.releasePoint // object with x/y coordinates of tap
    // e.detail.pointerType // mouse, touch, or pen
});

```

Some method or property is missing? Know how this page can be improved? [Suggest an edit!](https://github.com/dimsemenov/PhotoSwipe/blob/master/website/documentation/responsive-images.md)

