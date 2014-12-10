---

layout: default

title: PhotoSwipe Documentation - Getting Started

h1_title: Getting Started

description: PhotoSwipe image gallery getting started guide.

addjs: true

canonical_url: http://photoswipe.com/documentation/getting-started.html

buildtool: true

markdownpage: true

---

First things that you should know before you start:

- PhotoSwipe is made simple and fast for end users, not for developers. It aint simple jQuery plugin, at least basic JavaScript knowledge is required to install.
- PhotoSwipe requires predefined image dimensions. If your app is unable to retrieve them - consider using some other script. [More about this](faq.html#image-size).
- If you use PhotoSwipe on non-responsive website &ndash; controls will be scaled on mobile (as whole page is scaled). So you'll need to implement custom controls (e.g. single large close button in top right corner).
- All code in documentation is pure Vanilla JS and supports IE 8 and above. If your website or app uses some JavaScript framework (like jQuery or MooTools), or you don't need to support old browsers – feel free to simplify code.
- If you have some question - [ask it through StackOverflow](http://stackoverflow.com/questions/ask?tags=javascript,photoswipe). If you need some feature or have some idea on how PhotoSwipe can be improved - post it on [UserVoice](https://photoswipe.uservoice.com/forums/275302-feature-requests-ideas). If you've found a bug - [open issue on GitHub](https://github.com/dimsemenov/PhotoSwipe/issues).


## Initialization

### <a name="init-include-files"></a>Step 1: include JS and CSS files

You can find them in [dist/](https://github.com/dimsemenov/PhotoSwipe/tree/master/dist) folder of [GitHub](https://github.com/dimsemenov/PhotoSwipe) repository. Sass and uncompiled JS files are in folder [src/](https://github.com/dimsemenov/PhotoSwipe/tree/master/src).

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

And also, you can install it via Bower (`bower install photoswipe`).

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

		<!-- Container that holds slides. 
				PhotoSwipe keeps only 3 slides in DOM to save memory. -->
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
4. [Options](options.html).


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


## Creating an Array of Slide Objects

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

## <a class="anchor" name="dom-to-slide-objects"></a> How to build array of slides from list of links

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
var initPhotoSwipeFromDOM = function(gallerySelector) {

	// parse slide data (url, title, size ...) from DOM elements (links)
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

	// triggers when user clicks on thumbnail
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

	    var clickedGallery = clickedListItem.parentNode;

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
	        openPhotoSwipe( index, clickedGallery );
	    }
	    return false;
	};

	// parse picture index and gallery index from URL (#&pid=1&gid=2)
	var photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1),
	    params = {};

	    if(hash.length < 5) {
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

	    if(params.gid) {
	    	params.gid = parseInt(params.gid, 10);
	    }

	    if(!params.hasOwnProperty('pid')) {
	        return params;
	    }
	    params.pid = parseInt(params.pid, 10);
	    return params;
	};

	var openPhotoSwipe = function(index, galleryElement, disableAnimation) {
	    var pswpElement = document.querySelectorAll('.pswp')[0],
	        gallery,
	        options,
	        items;

		items = parseThumbnailElements(galleryElement);

	    // define options (if needed)
	    options = {
	        index: index,

			// define gallery index (for URL)
	        galleryUID: galleryElement.getAttribute('data-pswp-uid'),

	        getThumbBoundsFn: function(index) {
	            // See Options -> getThumbBoundsFn section of docs for more info
	            var thumbnail = items[index].el.children[0],
	                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
	                rect = thumbnail.getBoundingClientRect(); 

	            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
	        }

	    };

	    if(disableAnimation) {
	        options.showAnimationDuration = 0;
	    }

	    // Pass data to PhotoSwipe and initialize it
	    gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
	    gallery.init();
	};

	// loop through all gallery elements and bind events
	var galleryElements = document.querySelectorAll( gallerySelector );
	for(var i = 0, l = galleryElements.length; i < l; i++) {
		galleryElements[i].setAttribute('data-pswp-uid', i+1);
		galleryElements[i].onclick = onThumbnailsClick;
	}

	// Parse URL and open gallery if it contains #&pid=3&gid=1
	var hashData = photoswipeParseHash();
	if(hashData.pid > 0 && hashData.gid > 0) {
		openPhotoSwipe( hashData.pid - 1 ,  galleryElements[ hashData.gid - 1 ], true );
	}
};

// execute above function
initPhotoSwipeFromDOM('.my-gallery');
```

Example on CodePen (`focus` & `history` options are disabled due to embed issues):

<div class="codepen-embed">
	<p data-height="600" data-theme-id="10447" data-slug-hash="ZYbPJM" data-default-tab="result" data-user="dimsemenov" class='codepen'>
		<a href="http://codepen.io/dimsemenov/pen/ZYbPJM/" target="_blank"><strong>View example on CodePen &rarr;</strong></a>
	</p>
</div>


## About

PhotoSwipe is in beta, more detailed documentation coming soon. For now please report bugs through [GitHub](https://github.com/dimsemenov/PhotoSwipe), suggest features on [UserVoice](https://photoswipe.uservoice.com/forums/275302-feature-requests-ideas) and ask qustions through [StackOverflow](http://stackoverflow.com/questions/ask?tags=javascript,photoswipe).

To get notified about updates follow [@photoswipe on Twitter](https://github.com/dimsemenov/PhotoSwipe) and star/watch project on [GitHub](https://github.com/dimsemenov/PhotoSwipe).

If you think that something should be improved in this documentation page, feel free to [suggest an edit on GitHub](https://github.com/dimsemenov/PhotoSwipe/blob/master/website/documentation/basics.md).

<iframe src="http://ghbtns.com/github-btn.html?user=dimsemenov&amp;repo=photoswipe&amp;type=watch&amp;count=true&amp;size=large" allowtransparency="true" frameborder="0" scrolling="0" width="155" height="30" style=""></iframe>













