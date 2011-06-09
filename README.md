PhotoSwipe - The web image gallery for your mobile device
=========================================================

[www.photoswipe.com](http://www.photoswipe.com)

Inspired by the iOS photo viewer and Google images for mobile, PhotoSwipe is a HTML/CSS/JavaScript based image gallery specifically targeting mobile devices.

The current version supports mobile handsets running WebKit based browsers, i.e. iOS, Android and Blackberry 6.

PhotoSwipe also runs on the desktop and has been tested on Chrome, Firefox, Safari and Internet Explorer 8 and above.

Latest Release v1.0.11
---------------------
[Download](http://github.com/downloads/codecomputerlove/PhotoSwipe/code-photoswipe.v1.0.11.zip)

- Panning speed with zoomed images now runs at correct speed thanks to [heardfrom](https://github.com/heardfrom) and [cilogi](https://github.com/cilogi)

- Added maximum and minimum user zoom settings

- Should now play nicely if including MooTools thanks to [chameron](https://github.com/chameron)


Features
--------

- Optimised for mobile devices running a WebKit browser.

- Runs on modern desktop browsers, including Internet Explorer 8 and above.

- Multiple input options including swipe gestures (both mouse and screen touches), keyboard control and an interactive on screen toolbar.

- Responsive to device orientation changes.

- Automatically scales images to maximise screen size and orientation.

- Zoom / pan and rotate images (as of v1.0.4 - experimental iOS devices only)

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
  
    - Set the speeds of all animations used, from sliding in to fading.


		
		
Getting Started
---------------

PhotoSwipe comes with an example site to help you get started. 

There are two distributions of the library:

- The default distribution optimised for WebKit and Mozilla based browsers. This distribution uses standard DOM querying and manipulation. It also uses CSS3 transformations for animations.

- The jQuery distribution that uses jQuery as it's engine. 

It is recommended for WebKit based mobile devices to use the default distribution. This distribution will run faster. It does not require jQuery (so one less library to download to your mobile device). It also uses CSS3 to achieve animation effects. This is extremely noticable when running on an iOS device as animation will use hardware acceleration and will feel more "native" to the device. The default distribution will also work on desktop WebKit browsers (such as Chrome and Safari) as well as Firefox.

Use the jQuery distibution if you need to support a wider range of browsers such as Internet Explorer etc. By default, this distribution will not use hardware acceleration for animation on iOS devices so is noticably slower. You can however override the default animation functionality in jQuery by including the excellent [Animate Enhanced](https://github.com/benbarnett/jQuery-Animate-Enhanced) library (example included).

Both default and jQuery distribution come with a jQuery plugin wrapper to bind elements to the gallery. So for the default distribution, if you really need to, you can still use jQuery to find your images in your HTML document, hook into the jQuery DOM ready event and use the jQuery PhotoSwipe plugin to display the library. The gallery will still be running on the default optimised engine, but you have the convience of jQuery to set things up should you need to.



Getting Started - Default Distribution
--------------------------------------

See "examples/index.html". 

This example assumes no jQuery at all and is heavily optimised for WebKit and Mozilla browsers.

	// Set up PhotoSwipe with all anchor tags in the Gallery container 
	document.addEventListener('DOMContentLoaded', function(){
		
		Code.photoSwipe('a', '#Gallery');
		
	}, false);
	
	
Getting Started - Default Distribution (with jQuery plugin)
-----------------------------------------------------------
	
See "examples/jquery-plugin.html". 

This example assumes you want to use the convience of jQuery for initiating the gallery, but still the  optimised engine for WebKit and Mozilla browsers.

	$(document).ready(function(){
			
		$("#Gallery a").photoSwipe();
				
	});

	
Getting Started - Default Distribution (with jQuery engine)
-----------------------------------------------------------

See "examples/jquery-engine.html". 

This example assumes you want to use jQuery for the gallery's engine as well as initiating the gallery. It is not advised to use this approach if you are targetting mobile WebKit based devices.

	
Options
-------

- **fadeInSpeed**: The speed of any fading-in elements in milliseconds. Default "250"

- **fadeOutSpeed**: The speed of any fading-out elements in milliseconds. Default "500"

- **slideSpeed**: How fast images slide into view in milliseconds. Default "250"
	
- **swipeThreshold**: How many pixels your finger has to move across the screen to register a swipe gesture. Default "50"

- **swipeTimeThreshold**: A swipe must take no longer than this value in milli-seconds to be registered as a swipe gesture. Default "250"

- **loop**: Whether the gallery auto-loops back to the beginning when you reach the end. Default "true"

- **slideshowDelay**: The delay between showing the next image when in slideshow mode. Default "3000"
	
- **imageScaleMethod**: How images will fit onto the screen. Either "fit" or "zoom". "fit" ensures the image always fits the screen. "zoom" the image will always fill the full screen, this may cause the image to be "zoomed" in and cropped. Default "fit"

- **preventHide**: Once PhotoSwipe is active, prevents the user closing it. Useful for "exclusive mode" (see examples/exclusive-mode.html). Default "false"

- **zIndex**: The intial zIndex for PhotoSwipe. Default "1000"

- **backButtonHideEnabled**: This will hide the gallery when the user hits the back button. Useful for Android  and Blackberry. Works in BB6, Android v2.1 and above and iOS 4 and above. Default "true"

- **allowUserZoom**: iOS only - Allow the user to zoom / pan around images. Default "true" 

- **allowRotationOnUserZoom**: iOS only - Allow the user to rotate images whilst zooming / panning. Default "true" 

- **maxUserZoom**: iOS only - The maximum a user can zoom into an image. Default 5.0 (set to zero for this to be ignored)

- **minUserZoom**: iOS only - The minimum a user can zoom out of an image. Default 0.5 (set to zero for this to be ignored)

- **adjustUserPanToZoom**: iOS only - Adjusts the speed of panning to match the current zoom value. Default "true"

- **captionAndToolbarHide**: Hide the caption and toolbar. Default "false"

- **captionAndToolbarHideOnSwipe**: Hide the caption and toolbar when you swipe to the next image. Default "true"

- **captionAndToolbarFlipPosition**: Place the caption at the bottom and the toolbar at the top. Default "false"

- **captionAndToolbarAutoHideDelay**: How long to wait before the caption and toolbar automatically disappear. Default "5000". Set to "0" to prevent auto disappearing

- **captionAndToolbarOpacity**: The opacity of the caption and toolbar. Default "0.8"

- **captionAndToolbarShowEmptyCaptions**: Shows a blank caption area even if a caption cannot be found for the current image. Default "false" 

- **jQueryMobile**: Whether PhotoSwipe is integrated into a jQuery Mobile project or not. By default, PhotoSwipe will try and work this out for you.

- **jQueryMobileDialogHash**: The window hash tag used by jQuery Mobile and dialog pages. Default "&ui-state=dialog".

- **getImageSource**: Function to specify how the gallery obatins image sources. By default, the gallery assumes you send it a list of images with each image wrapped in an anchor tag. The anchor tag will contain the URL to the full size image. You can change this e.g. if you supply a list of images without an anchor tag, and supply the full size URL on the image's "rel" attribute:

		Code.photoSwipe('a', '#Gallery', {
		
			getImageSource: function(el){ 
				return el.getAttribute('rel'); 
			}
		
		});
	
- **getImageCaption**: Like "getImageSource", function to specify how the gallery obatins image captions. By default, the gallery looks for an image's "alt" tag.


-- **getImageMetaData**: Function to associated additional meta data against an image in the gallery. This meta data can then be used in your own code if you listen to the "onDisplayImage" event.

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
