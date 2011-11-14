PhotoSwipe - The web image gallery for your mobile device
=========================================================

web: [www.photoswipe.com](http://www.photoswipe.com), [www.codecomputerlove.com](http://www.codecomputerlove.com)

twitter: [@photoswipe](http://twitter.com/#!/photoswipe)

Inspired by the iOS photo viewer and Google images for mobile, PhotoSwipe is a HTML/CSS/JavaScript based image gallery specifically targeting mobile devices.

The current version supports mobile handsets running WebKit based browsers, i.e. iOS, Android and Blackberry 6.

PhotoSwipe also runs on the desktop and has been tested on Chrome, Firefox, Safari and Internet Explorer 8 and above and in a limited capacity on Windows Phone 7 (Mango).



Have you used PhotoSwipe? It'd be great to hear from you!
---------------------------------------------------------

It'd be fantastic to see how you have implemented PhotoSwipe on your site! We're looking at showcasing some of the best on [photoswipe.com](http://www.photoswipe.com). Feel free to drop us a tweet at [@photoswipe](http://twitter.com/#!/photoswipe) and tell us all about it!



Latest Release v3.0.4
---------------------
[Download](http://github.com/downloads/codecomputerlove/PhotoSwipe/code.photoswipe-3.0.4.zip)

- Fixed issue with toolbar buttons when a gallery has less than 3 images.

**Changes for v3**

- You can now specify a target for PhotoSwipe. It doesn't have to run in full screen anymore! To do this, you specify a "target" as part of PhotoSwipe settings. The target MUST be a valid DOM element for it to work. See examples "12-custom-target.html", "13-custom-target-with-indicators.html" for more details.

- Multi-line captions when caption bar placed at the bottom should now be fixed.

- Fixed issue where toolbar and caption remained visible when zooming in and captionAndToolbarAutoHideDelay = 0.

- Upgraded to jQuery Mobile 1.0 RC2

- Upgraded Code.Util to 1.0.6

- Work around for issue #141 now officially added - when rotating an app with PhotoSwipe displayed in a UIWebView, PhotoSwipe does not rotate. This seems to be an issue with UIWebView not PhotoSwipe. To enable this work around, set "enableUIWebViewRepositionTimeout = true" when creating your PhotoSwipe instance. You can also specify the frequency of this timeout by setting "uiWebViewResetPositionDelay" (default 500ms) - **Please Note** This is not needed for PhoneGap apps, nor web apps added to your homescreen.

**Important notes about the examples and Internet Explorer**

The majority of the bundled examples supplied with PhotoSwipe are running the optimised non-jQuery version. These examples will error on Internet Explorer. This is by design. They will work if you use the jQuery version of PhotoSwipe. Please read the "Getting Started" section below for more information regarding the different implementations of PhotoSwipe.



Features
--------

- Optimised for mobile devices running a WebKit browser.

- Runs on modern desktop browsers, including Internet Explorer 8 and above.

- From v3 can be run within a div on your page as well as "full screen".

- Multiple input options including swipe gestures (both mouse and screen touches), keyboard control and an interactive on screen toolbar.

- Responsive to device orientation changes.

- Automatically scales images to maximise screen size and orientation.

- Zoom and pan around images

- Rotate image (iOS only)

- Works with your markup and semantic structure. Does not enforce any specific markup.

- Supports image captions.

- Slideshow feature to automatically play through images in the gallery.

- Uses hardware acceleration where possible for smoother transitions and effects.

- Can be integrated into jQuery Mobile.

- Comprehensive customisation options:

    - Presentation controlled via CSS

    - Set whether the gallery loops or not i.e. when you reach the end, is the next image the first image, or does the gallery show a bounce effect to indicate that you have reached the end.
  
    - Hide or show captions and toolbar

    - Change caption and toolbar positions

    - Provide your own toolbar HTML

    - Set the speeds of all animations used, from sliding in to fading.



Getting Started
---------------

PhotoSwipe comes with an example site to help you get started. 

There are two distributions of the library:

- The default distribution optimised for WebKit and Mozilla based browsers. This distribution uses standard DOM querying and manipulation. It also uses CSS3 transformations for animations.

- The jQuery distribution that uses jQuery as it's engine. 

It is recommended for WebKit based mobile devices to use the default distribution. This negates a lot of the overhead from using jQuery. It does not require jQuery (so one less library to download to your mobile device!). The default distribution will also work on desktop WebKit browsers (such as Chrome and Safari) as well as Firefox 4 and above.

Use the jQuery distibution if you need to support a wider range of browsers such as Internet Explorer etc. 



Getting Started - Default Distribution
--------------------------------------

See "examples/01-default.html". 

This example assumes no jQuery at all and is heavily optimised for WebKit and Mozilla browsers. PhotoSwipe.attach takes three parameters, an array of HTML elements, optional options and optional instance ID string.

	// Set up PhotoSwipe with all anchor tags in the Gallery container 
	document.addEventListener('DOMContentLoaded', function(){
		
		var myPhotoSwipe = PhotoSwipe.attach( window.document.querySelectorAll('#Gallery a'), { enableMouseWheel: false , enableKeyboard: false } );
		
	}, false);


PhotoSwipe can be initiated without being attached to HTML elements. See "examples/09-exclusive-mode-no-thumbnails.html" for more information.



Getting Started - Default Distribution (with jQuery engine)
-----------------------------------------------------------

See "examples/02-jquery.html". The plugin takes two parameters both of which optional; an options objectand an instance ID string.

	// Set up PhotoSwipe with all anchor tags in the Gallery container 
	$(document).ready(function(){
		
		var myPhotoSwipe = $("#Gallery a").photoSwipe({ enableMouseWheel: false , enableKeyboard: false });
		
	});



Options
-------

- **allowUserZoom**: Allow the user to zoom / pan around images. Default = true 

- **autoStartSlideshow**: Automatically starts the slideshow mode when PhotoSwipe is activated. Default = false

- **allowRotationOnUserZoom**: iOS only - Allow the user to rotate images whilst zooming / panning. Default = false

- **backButtonHideEnabled**: This will hide the gallery when the user hits the back button. Useful for Android  and Blackberry. Works in BB6, Android v2.1 and above and iOS 4 and above. Default = true

- **captionAndToolbarAutoHideDelay**: How long to wait before the caption and toolbar automatically disappear. Default = 5000. Set to 0 to prevent auto disappearing

- **captionAndToolbarFlipPosition**: Place the caption at the bottom and the toolbar at the top. Default = false

- **captionAndToolbarHide**: Hide the caption and toolbar. Default = false

- **captionAndToolbarOpacity**: The opacity of the caption and toolbar. Default = 0.8

- **captionAndToolbarShowEmptyCaptions**: Shows a blank caption area even if a caption cannot be found for the current image. Default = true

- **cacheMode**: Code.PhotoSwipe.Cache.Mode.normal (default) or Code.PhotoSwipe.Cache.Mode.aggressive. Changes how PhotoSwipe manages it's cache. Aggressive will purposely set images that are not either the current, next or previous to be an empty "spacer" type image. This helps on older iOS versions if you have excessively large images. In the main, normal should suffice

- **doubleTapSpeed**: Double tap speed in milliseconds. Default = 300

- **doubleTapZoomLevel**: When the user double taps an image, the default "zoom-in" level. Default = 2.5

- **enableDrag**: Enables dragging the next / previous image into view. Default = true

- **enableKeyboard**: Enables keyboard support. Default = true

- **enableMouseWheel**: Enables mouse wheel support. Default = true

- **enableUIWebViewRepositionTimeout**: If enabled, continually checks to see if the device orientation has changed. Required as a work around for issue #141. Default = false

- **fadeInSpeed**: The speed of any fading-in elements in milliseconds. Default = 250

- **fadeOutSpeed**: The speed of any fading-out elements in milliseconds. Default = 250

- **imageScaleMethod**: How images will fit onto the screen. Either "fit", "fitNoUpscale" or "zoom". "fit" ensures the image always fits the screen. "fitNoUpscale" works like "fit" but will never upscale the image. "zoom" the image will always fill the full screen, this may cause the image to be "zoomed" in and cropped. Default = "fit"

- **invertMouseWheel**: By default, moving the mouse wheel down will move to the next image, up to the previous. Setting this to true reverses this. Default = false

- **jQueryMobile**:Whether PhotoSwipe is integrated into a jQuery Mobile project or not. By default, PhotoSwipe will try and work this out for you

- **jQueryMobileDialogHash**: The window hash tag used by jQuery Mobile and dialog pages. Default = "&ui-state=dialog"

- **loop**: Whether the gallery auto-loops back to the beginning when you reach the end. Default = true

- **margin**: The margin between each image in pixels. Default = 20

- **maxUserZoom**: The maximum a user can zoom into an image. Default = 5.0 (set to zero for this to be ignored)

- **minUserZoom**: The minimum a user can zoom out of an image. Default = 0.5 (set to zero for this to be ignored)

- **mouseWheelSpeed**: How responsive the mouse wheel is. Default = 500

- **nextPreviousSlideSpeed**: How fast images are displayed when the next/previous buttons are clicked in milliseconds. Default = 0 (immediately)

- **preventHide**: Prevents the user closing PhotoSwipe. Also hides the "close" button from the toolbar. Useful for "exclusive mode" (see examples/08-exclusive-mode.html). Default = false

- **preventSlideshow**: Prevents the slideshow being activated. Also hides the "play" button from the toolbar. Default = false

- **preventDefaultTouchEvents**: Prevents device default touch events (i.e. stops the user scrolling the screen upwards etc). Default = true

- **slideshowDelay**: The delay between showing the next image when in slideshow mode in milliseconds. Default = 3000

- **slideSpeed**: How fast images slide into view in milliseconds. Default = 250

- **swipeThreshold**: How many pixels your finger has to move across the screen to register a swipe gesture. Default = 50

- **swipeTimeThreshold**: A swipe must take no longer than this value in milliseconds to be registered as a swipe gesture. Default = 250

- **slideTimingFunction**: Easing function used when sliding. Default = "ease-out

- **target**: DOM Target for PhotoSwipe. By default "window" which will mean PhotoSwipe runs "fullscreen". Value must be a valid DOM element.

- **uiWebViewResetPositionDelay**: Related to enableUIWebViewRepositionTimeout. Default = 500

- **zIndex**: The intial zIndex for PhotoSwipe. Default = 1000



Options - Custom Functions
--------------------------

You can provide your own functions to tell PhotoSwipe how to work with your mark up etc.

- **getToolbar**: Function that returns the HTML string to be used for the toolbar content

- **getImageSource**: Function to specify how the gallery obatins image sources. By default, the gallery assumes you send it a list of images with each image wrapped in an anchor tag. The anchor tag will contain the URL to the full size image. You can change this e.g. if you supply a list of images without an anchor tag, and supply the full size URL on the image's "rel" attribute:


		document.addEventListener('DOMContentLoaded', function(){
		
			var myPhotoSwipe = PhotoSwipe.attach( window.document.querySelectorAll('#Gallery a'), {
			
				getImageSource: function(el){ 
					return el.getAttribute('rel'); 
				}
				
			} );
		
		}, false);


- **getImageCaption**: Like "getImageSource", function to specify how the gallery obatins image captions. By default, the gallery looks for an image's "alt" tag.


- **getImageMetaData**: Function to associated additional meta data against an image in the gallery. This meta data can then be used in your own code if you listen to the "onDisplayImage" event.

		getImageMetaData: function(el){
				
			return {
				longDescription: el.getAttribute(el, 'data-long-description')
			}
			
		}



Keyboard controls for desktop browsers
--------------------------------------

- **Left cursor**: Previous image

- **Right cursor**: Next image

- **Escape**: Close gallery

- **Space bar**: Show toolbar / caption if they have faded from view. If both are hidden via the configuration, space bar will close the gallery

- **Enter**: Start slideshow