---

layout: default

title: PhotoSwipe Documentation

description: The complete guide on how to use PhotoSwipe image gallery

addjs: true

canonical_url: http://photoswipe.com/documentation.html

buildtool: true

markdownpage: true

---

# <a href="./">PhotoSwipe</a> Documentation

[GitHub](https://github.com/dimsemenov/PhotoSwipe) &middot; [@photoswipe on Twitter](https://github.com/dimsemenov/PhotoSwipe) &middot; [feature requests & ideas](https://photoswipe.uservoice.com/forums/275302-feature-requests-ideas)


First things that you should know before you start:

- PhotoSwipe is made simple and fast for end users, not for developers. It aint simple jQuery plugin, at least basic JavaScript knowledge is required to install.
- PhotoSwipe requires to define image dimensions. If your app is unable to retrieve them - consider using some other script.
- If you use PhotoSwipe on non-responsive website &ndash; controls will be scaled on mobile (as whole page is scaled). So you'll need to implement custom controls (e.g. single large close button in top right corner).
- All code in documentation is pure Vanilla JS and supports IE 8 and above. If your website or app uses some JavaScript framework (like jQuery or MooTools), or you don't need to support old browsers – feel free to simplify code.


## Initialization

### <a name="init-include-files"></a>Step 1: include JS and CSS files

You can find them in `dist/` folder of [GitHub](https://github.com/dimsemenov/PhotoSwipe) repository.

```html
<!-- Core CSS file -->
<link rel="stylesheet" href="path/to/photoswipe.css"> 

<!-- Skin CSS file (optional)
	 In folder of skin CSS file there are also:
	 - .png and .svg icons sprite, 
	 - preloader.gif (for browsers that do not support CSS animations) -->
<link rel="stylesheet" href="path/to/default-skin/default-skin.css"> 

<!-- Core JS file -->
<script src="path/to/photoswipe.min.js"></script> 

<!-- UI JS file -->
<script src="path/to/photoswipe-ui-default.min.js"></script> 
```

It doesn't matter how and where will you include JS and CSS files. Code is executed only when you call `new PhotoSwipe()`. So feel free to defer loading of files if you don't need PhotoSwipe to be opened initially. 

PhotoSwipe also supports AMD loaders (like RequireJS) and CommonJS, use them like so:

```javascript
require([ 
		'path/to/photoswipe.js', 
		'path/to/photoswipe-ui-default.js' 
	], function( PhotoSwipe, PhotoSwipeUI_Default ) {

	//  	var gallery = new PhotoSwipe( someElement, PhotoSwipeUI_Default ...
	//  	gallery.init() 
	//  	...

});
```

### <a name="init-add-pswp-to-dom"></a>Step 2: add PhotoSwipe (.pswp) element to DOM 

You can add HTML code dynamically (directly before the initialization), or have in HTML of page initially (like it's done on demo page). This code can be appended anywhere, but ideally before the closing `</body>`. You may reuse it across multiple galleries (as long as you use same UI class).

```html
<!-- Root element of PhotoSwipe. Must have class pswp. -->
<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

	<!-- Background of PhotoSwipe. 
		 It's a separate element, as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>

	<!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap">

		<!-- Container that holds slides. PhotoSwipe keeps only 3 slides in DOM to save memory. -->
		<div class="pswp__container">
			<!-- don't modify these 3 pswp__item elements, data is added later on -->
			<div class="pswp__item"></div>
			<div class="pswp__item"></div>
			<div class="pswp__item"></div>
		</div>

		<!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
	    <div class="pswp__ui pswp__ui--hidden">

	        <div class="pswp__top-bar">

				<!--  Controls are self-explanatory. Order can be changed. -->
				
				<div class="pswp__counter"></div>

				<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

				<button class="pswp__button pswp__button--share" title="Share"></button>

				<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

				<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

				<!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
				<!-- element will get class pswp__preloader--active when preloader is running -->
				<div class="pswp__preloader">
					<div class="pswp__preloader__icn">
					  <div class="pswp__preloader__cut">
					    <div class="pswp__preloader__donut"></div>
					  </div>
					</div>
				</div>
	        </div>

	        <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
				<div class="pswp__share-tooltip"></div> 
	        </div>

			<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
			</button>
			
			<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
			</button>

			<div class="pswp__caption">
				<div class="pswp__caption__center"></div>
			</div>

	      </div>

	    </div>

</div>


```

Order of `pswp__bg`, `pswp__scroll-wrap`, `pswp__container` and `pswp__item` elements should not be changed.

You might ask, why PhotoSwipe doesn't add this code automatically via JS, reason is simple &ndash; just to save file size, in case if you need some modification of this code.

### Step 3: initialize

Execute `PhotoSwipe` contructor. It accepts 4 arguments:

1. `.pswp` element from step 2 (it must be added to DOM).
2. PhotoSwipe UI class. If you included default `photoswipe-ui-default.js`, class will be `PhotoSwipeUI_Default`. Can be `false`.
3. Array with objects (slides).
4. Options.


```javascript
var pswpElement = document.querySelectorAll('.pswp')[0];

// build items array
var items = [
	{
		src: 'https://placekitten.com/600/400',
		w: 600,
		h: 400
	},
	{
		src: 'https://placekitten.com/1200/900',
		w: 1200,
		h: 900


	}
];

// define options (if needed)
var options = {
	// optionName: 'option value'
	// for example:
	index: 0 // start at first slide
};

// Initializes and opens PhotoSwipe
var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
gallery.init();
```

At the end you should get something like this:

<div class="codepen-embed">
	<p data-height="600" data-theme-id="10447" data-slug-hash="gbadPv" data-default-tab="result" data-user="dimsemenov" class='codepen'>
		<a href="http://codepen.io/dimsemenov/pen/gbadPv/" target="_blank"><strong>View example on CodePen &rarr;</strong></a>
	</p>
	<!-- <script async src="//assets.codepen.io/assets/embed/ei.js"></script> -->
</div>


## Creating an array of slide objects

Each object in array should contain data about slide, it can be anything that you wish to display in PhotoSwipe - path to image, caption HTML string, number of shares, comments, etc.

During the navigation PhotoSwipe adds its own properties to this object (like `minZoom` or `loaded`).

```javascript
var slides = [

	// slide 1
	{

		src: 'path/to/image1.jpg', // path to image
		w: 1024, // image width
		h: 768, // image height

		msrc: 'path/to/small-image.jpg', // small image placeholder,
						// main (large) image loads on top of it,
						// if you skip this parameter - grey rectangle will be displayed,
						// try to use this property only when small image was loaded before

		title: 'Image Caption'  // used by Default PhotoSwipe UI
								// if you skip it, there won't be any caption
								

		// You may add more properties here and use them.
		// For example, demo gallery uses "author" property, which is used in caption.
		// author: 'John Doe'
		
	},

	// slide 2
	{
		src: 'path/to/image2.jpg', 
		w: 600, 
		h: 600

		// etc.
	}

	// etc.

];
```

You can dynamically add more slides to this array (after PhotoSwipe is opened), e.g.:

```javascript
// just push item to array
yourPhotoSwipeInstance.items.push({
    src: "path/to/image.jpg", 
    w:1200,
    h:500 
}); 
```

Currently, you can not dynamically modify image of current slide, and two nearby slides, but this feature is planned.

### How to build array of slides from list of links

For example, you have a list of links/thumbnails that looks like this:

```html
<div class="my-gallery">

    <a href="path/to/image1.jpg" data-size="1600x1600">
    	<img src="path/to/thumbnail-image1.jpg" />
    	<figure>This is dummy caption 1.</figure>
    </a>

    <a href="path/to/image2.jpg" data-size="1600x1600">
    	<img src="path/to/thumbnail-image2.jpg" />
    	<figure>This is dummy caption 2.</figure>
    </a>
	
	<!-- etc. -->

</div>
 ```

... and you want click on thumbnail to open PhotoSwipe with large image (like it's done on demo page). All you need to do is:

1. Bind click event to links.
2. After user clicked on one of thumbnail, find its index.
3. Create an array of slide objects from DOM elements – loop through all links and retrieve `href` attribute (large image url), `data-size` attribute (its size), `src` of thumbnail, and contents of `figure` element (caption content).

PhotoSwipe doesn't really care how will you do this. If you use framework like jQuery or MooTools, or if you don't need to support IE8, code can be simplified dramatically.

Here is pure Vanilla JS implementation with IE8 support:

```javascript
var parseThumbnailElements = function(el) {
    var thumbElements = el.childNodes,
        numNodes = thumbElements.length,
        items = [],
        el,
        childElements,
        thumbnailEl,
        size,
        item;

    for(var i = 0; i < numNodes; i++) {
        el = thumbElements[i];

        // include only element nodes 
        if(el.nodeType !== 1) {
          continue;
        }

		childElements = el.children;

        size = el.getAttribute('data-size').split('x');

		// create slide object
        item = {
          src: el.getAttribute('href'),
          w: parseInt(size[0], 10),
          h: parseInt(size[1], 10)
        };
      
        item.el = el; // save link to element for getThumbBoundsFn
      
        if(childElements.length > 0) {
          item.msrc = childElements[0].getAttribute('src'); // thumbnail url
          if(childElements.length > 1) {
              item.title = childElements[1].innerHTML; // caption (contents of figure)
          }
        }

        items.push(item);
    }

    return items;
};

// find nearest parent element
var closest = function closest(el, fn) {
	return el && ( fn(el) ? el : closest(el.parentNode, fn) );
};

var onThumbnailsClick = function(e) {
	e = e || window.event;
	e.preventDefault ? e.preventDefault() : e.returnValue = false;

	var eTarget = e.target || e.srcElement;

	var clickedListItem = closest(eTarget, function(el) {
		return el.tagName === 'A';
	});

	if(!clickedListItem) {
		return;
	}

	var childNodes = clickedListItem.parentNode.childNodes,
	    numChildNodes = childNodes.length,
	    nodeIndex = 0,
	    index;

	for (var i = 0; i < numChildNodes; i++) {
		if(childNodes[i].nodeType !== 1) { 
			continue; 
		}

		if(childNodes[i] === clickedListItem) {
			index = nodeIndex;
			break;
		}
		nodeIndex++;
	}

	if(index >= 0) {
		openPhotoSwipe( index );
	}
	return false;
};

var photoswipeParseHash = function() {
  var hash = window.location.hash.substring(1),
	params = {};

	if(hash.length < 5) { // pid=1
		return params;
	}

	var vars = hash.split('&');
	for (var i = 0; i < vars.length; i++) {
		if(!vars[i]) {
			continue;
		}
		var pair = vars[i].split('=');  
		if(pair.length < 2) {
			continue;
		}           
		params[pair[0]] = pair[1];
	}
	if(!params.hasOwnProperty('pid')) {
		return params;
	}
	params.pid = parseInt(params.pid,10)-1;
	if( !(params.pid >= 0) ) {
		params.pid = 0;
	}
	return params;
};


var openPhotoSwipe = function(index, disableAnimation) {
    var pswpElement = document.querySelectorAll('.pswp')[0],
    	gallery,
    	options;

	if(!items) {
		// build slides array, only once
		items = parseThumbnailElements(galleryElement);
	}
    
    // define options (if needed)
    options = {
    	index: index,
        
		getThumbBoundsFn: function(index) {
			// See Options->getThumbBoundsFn section of docs for more info
			var thumbnail = items[index].el.children[0],
				pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
				rect = thumbnail.getBoundingClientRect(); 

			return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
		}
    };

    if(disableAnimation) {
    	options.hideAnimationDuration = options.showAnimationDuration = 0;
    }
    
    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
};

var items;
var galleryElement = document.querySelectorAll('.my-simple-gallery')[0];
galleryElement.onclick = onThumbnailsClick;

// parse URL
var hashData = photoswipeParseHash();
if(hashData.pid >= 0) {
	openGallery(hashData.pid, true);
}

```

Example:

<div class="codepen-embed">
	<p data-height="600" data-theme-id="10447" data-slug-hash="ZYbPJM" data-default-tab="result" data-user="dimsemenov" class='codepen'>
		<a href="http://codepen.io/dimsemenov/pen/ZYbPJM/" target="_blank"><strong>View example on CodePen &rarr;</strong></a>
	</p>
	
</div>


## Core options

### `index` <code class="default">integer</code> <code class="default">0</code>

Start slide index. `0` is the first slide.

### `getThumbBoundsFn` <code class="default">function</code> <code class="default">undefined</code>

Function should return object with coordinates from which initial zoom-in animation will start (or zoom-out animation will end). 

Object should contain three properties: `x` (X position, relative to document), `y` (Y position, relative to document), `w` (width of element). Height will be calculated automatically based on size of large image. For example if you return `{x:0,y:0,w:50}` zoom animation will start in top left corner of your page.

Function has one argument - `index` of item that is opening or closing.

Example that calculates position of thumbnail: 

```javascript
getThumbBoundsFn: function(index) {

	// find thumbnail element
	var thumbnail = document.querySelectorAll('.my-gallery-thumbnails')[index];
	
	// get window scroll Y
	var pageYScroll = window.pageYOffset || document.documentElement.scrollTop; 
	// optionally get horizontal scroll

	// get position of element relative to viewport
	var rect = thumbnail.getBoundingClientRect(); 
	
	// w = width
	return {x:rect.left, y:rect.top + pageYScroll, w:rect.height};


	// Good guide on how to get element coordinates:
	// http://javascript.info/tutorial/coordinates
}
```

If dimensions of your small thumbnail don't match dimensions of large image, consider enabling zoom+fade transition. You can do this by adding option `showHideOpacity:true` (try adding it to [above CodePen](http://codepen.io/dimsemenov/pen/NPGOob/) to test how it looks). Or disable transition entirely by adding `hideAnimationDuration:0, showAnimationDuration:0`.

If you want to "hide" small thumbnail during the animation use `opacity:0`, not `visibility:hidden` or `display:none`. Don't force Paint and Layout at the beginning of animation to avoid lag.


### `showAnimationDuration` <code class="default">integer</code> <code class="default">333</code>

Initial zoom-in transition duration in milliseconds. Set to `0` to disable.
Besides this JS option, you need also to change transition duration in PhotoSwipe CSS file:

```css
.pswp--animate_opacity,
.pswp__bg,
.pswp__caption,
.pswp__top-bar,
.pswp--has_mouse .pswp__button--arrow--left,
.pswp--has_mouse .pswp__button--arrow--right{
	-webkit-transition: opacity 333ms cubic-bezier(.4,0,.22,1);
	transition: opacity 333ms cubic-bezier(.4,0,.22,1);
}
```

If you use Sass, you can just edit value of variable `$pswp__show-hide-transition-duration` in `_main-settings.scss`.

### `hideAnimationDuration` <code class="default">integer</code> <code class="default">333</code>

The same as previous option, just for closing (zoom-out) transition. After PhotoSwipe is opened `pswp--open` class will be added to root element, you may use it to apply different transition duration in CSS.


### `showHideOpacity` <code class="default">boolean</code> <code class="default">false</code>

If set to `false` background `opacity` and image `scale` will be animated (image opacity is always 1). 
If set to `true` root PhotoSwipe element `opacity` and image `scale` will be animated. Enable it when dimensions of your small thumbnail don't match dimensions of large image 


### `bgOpacity` <code class="default">number</code> <code class="default">1</code>

Background (`.pswp__bg`) opacity. Should be a number from 0 to 1, e.g. `0.7`. This style is defined via JS, not via CSS, as this value is used for a few gesture-based transitions.


### `spacing` <code class="default">number</code> <code class="default">0.12</code>

Spacing ratio between slides. For example, `0.12` will render as a 12% of sliding viewport width (rounded). 


### `allowPanToNext` <code class="default">boolean</code> <code class="default">true</code>

Allow swipe navigation to next/prev item when current item is zoomed. Option is always `false` on devices that don't have hardware touch support.


### `loop` <code class="default">boolean</code> <code class="default">true</code>

Loop slides when using swipe gesture. If set to `true` you'll be able to swipe from last to first image. Option is always `false` when there are less than 3 slides.

This option has no relation to arrows navigation. Arrows loop is turned on permanently. You can modify this behavior by making custom UI.


### `pinchToClose` <code class="default">boolean</code> <code class="default">true</code>

Pinch to close gallery gesture. The gallery’s background will gradually fade out as the user zooms out. When the gesture is complete, the gallery will close.


### `closeOnScroll` <code class="default">boolean</code> <code class="default">true</code>

Close gallery on page scroll. Option works just for devices without hardware touch support.


### `closeOnVerticalDrag` <code class="default">boolean</code> <code class="default">true</code>

Close gallery when dragging vertically and when image is not zoomed. Always `false` when mouse is used.
 

### `mouseUsed` <code class="default">boolean</code> <code class="default">false</code>

Option allow you to predefine if mouse is used or not. Some PhotoSwipe feature depend on it, for example default UI left/right arrows will be displayed only after mouse is used. If set to `false`, PhotoSwipe will start detecting when mouse is used by itself, `mouseUsed` event triggers when mouse is found.


### `escKey` <code class="default">boolean</code> <code class="default">true</code>

`esc` keyboard key to close PhotoSwipe. Option can be changed dynamically (`yourPhotoSwipeInstance.options.escKey = false;`).


### `arrowKeys` <code class="default">boolean</code> <code class="default">true</code>

Keyboard left or right arrow key navigation. Option can be changed dynamically (`yourPhotoSwipeInstance.options.arrowKeys = false;`).


### `history` <code class="default">boolean</code> <code class="default">true</code>

If set to `false` disables history module (back button to close gallery, unique URL for each slide). You can also just exclude `history.js` module from your build.


### `errorMsg` <code class="default">string</code> <code class="default"><div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div></code>

Error message when image was not loaded. `%url%` will be replace by URL of image.


### `preload` <code class="default">array</code> <code class="default">[1,1]</code>

Lazy loading of nearby slides based on direction of movement. Should be an array with two integers, first one - number of items to preload before current image, second one - after the current image. E.g. if you set it to [1,3], it'll load 1 image before the current, and 3 images after current. Values can not be less than 1.


### `mainClass` <code class="default">string</code> <code class="default">undefined</code>

String with name of class that will be added to root element of PhotoSwipe (`.pswp`). Can contain multiple classes separated by space.


### `getNumItemsFn` <code class="default">function</code>

Function that should return total number of items in gallery. By default it returns length of slides array. Don't put very complex code here, function is executed very often.

### `focus` <code class="default">boolean</code> <code class="default">true</code>

Will set focus on PhotoSwipe element after it's open.



## Default UI options

Options of `PhotoSwipeUI_Default` (`dist/ui/photoswipe-ui-default.js`).

```javascript
// size of top & bottom bars in pixels,
// "bottom" parameter can be 'auto' (will calculate height of caption)
// option applies only when mouse is used, 
// or width of screen is more than 1200px
// 
// (Also refer to `parseVerticalMargin` event)
barsSize: {top:44, bottom:'auto'}, 




// Part of element classes click on which should close the PhotoSwipe.
// In HTML code class should start with pswp__, e.g.: pswp__item, pswp__caption
closeElClasses: ['item', 'caption', 'zoom-wrap', 'ui', 'top-bar'], 

// Adds class pswp__ui--idle to pswp__ui element when mouse isn't moving for 4000ms
timeToIdle: 4000,

// Same as above, but this timer applies when mouse leaves the window
timeToIdleOutside: 1000,

// Delay until loading indicator is displayed
loadingIndicatorDelay: 1000,

// Function that should parse 
addCaptionHTMLFn: function(item, captionEl, isFake) {
	// item - slide object
	// captionEl - caption DOM element
	// isFake  - true when content is added to fake caption container
	// 			(used to get size of next/prev caption)
	
	if(!item.title) {
		captionEl.children[0].innerHTML = '';
		return false;
	}
	captionEl.children[0].innerHTML = item.title;
	return true;
},

// Buttons/elements
closeEl:true,
captionEl: true,
fullscreenEl: true,
zoomEl: true,
shareEl: true,
counterEl: true,
arrowEl: true,
preloaderEl: true,

// Tap on image should close it
tapToClose: false,

// Tap should toggle visibility of controls
tapToToggleControls: true,

// variables for URL:
// {{url}} (url to current page)
// {{text}} (title)
// {{image_url}} (image url)
// {{raw_image_url}} (not encoded image url)
shareButtons: [
	{id:'facebook', label:'Share on Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}'},
	{id:'twitter', label:'Tweet', url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
	{id:'pinterest', label:'Pin it', url:'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'},
	{id:'download', label:'Download image', url:'{{raw_image_url}}', download:true}
],

// Separator for "1 of X" counter
indexIndicatorSep: ' / '
```

## Public Methods & Properties

You can get PhotoSwipe instance object during the initialization: `var yourPhotoSwipeInstance = new PhotoSwipe( ...`.

```javascript
var pswp = new PhotoSwipe( /* ... */ );
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

// returns current item index (int)
pswp.getCurrentIndex();

// returns current zoom level
pswp.getZoomLevel();

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


// current slide object
pswp.currItem

// size of sliding viewport
pswp.viewportSize

// object holds all functions from framework
// framework-bridge.js
pswp.framework

// UI object
pswp.ui

// Self explanatory boolean propeties:
pswp.isDragging
pswp.isZooming
pswp.isMainScrollAnimating

// background element (pswp__bg)
pswp.bg

// container element (pswp__container)
pswp.container 



```




## Events

PhotoSwipe uses very simple Event/Messaging system. It has two methods `shout` (triggers event) and `listen` (handles event). It's a one way callback system, you can not unbind listener. But all listeners are cleared when PhotoSwipe closed. For example:

```javascript
var pswp = new PhotoSwipe(/* ... */);

pswp.listen('helloWorld', function(name) {
	alert('Name is: ' + name);
});

pswp.shout('helloWorld', 'John' /* you may pass more arguments */)
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
```

Take a look in source of `src/js/ui/photoswipe-ui-default.js`, it's built just using public events, methods and properties.




## About

PhotoSwipe is in beta, more detailed documentation coming soon. For now please report bugs through [GitHub](https://github.com/dimsemenov/PhotoSwipe) and suggest features on [UserVoice](https://photoswipe.uservoice.com/forums/275302-feature-requests-ideas).

To get notified about updates follow [@photoswipe on Twitter](https://github.com/dimsemenov/PhotoSwipe) and star/watch project on [GitHub](https://github.com/dimsemenov/PhotoSwipe).

<iframe src="http://ghbtns.com/github-btn.html?user=dimsemenov&amp;repo=photoswipe&amp;type=watch&amp;count=true&amp;size=large" allowtransparency="true" frameborder="0" scrolling="0" width="155" height="30" style=""></iframe>

<p style="
    margin-top: 100px;
    margin-bottom: 100px;
    text-align: center;
"><span title="Coded">&lt;/&gt;</span> with <span title="love">&lt;3</span> in <a class="ukraine-flag" href="http://en.wikipedia.org/wiki/Ukraine" title="Ukraine"></a> by <a href="http://twitter.com/dimsemenov">@dimsemenov</a></p>





















