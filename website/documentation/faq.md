---

layout: default

title: PhotoSwipe FAQ and Known Issues

h1_title: FAQ & Known Issues

description: Frequently asked questions and known issues about PhotoSwipe image gallery.

addjs: true

canonical_url: http://photoswipe.com/documentation/faq.html

buildtool: true

markdownpage: true

---

## Known issues

### GIF images sometimes freeze on iOS8

iOS Safari has a bug that freezes GIF images that are shifted outside of the window (or outside of element with `overflow:hidden`). My recommendatiuon is to avoid using animated GIFs in PhotoSwipe at all, as they slow down animation performance in any mobile browser. But if you really need to use it, refer to [this hack](https://github.com/dimsemenov/PhotoSwipe/issues/662#issuecomment-66420874).


### Mobile browser crashes when opening PhotoSwipe

In most of cases, it can happen in iPhone or in old Android phones (before KitKat) with low memory limit. The #1 reason of crash is too big images (usually >2000px), avoid images larger than 1200px for an average 800x600 phone. Crash can also occur if you open PhotoSwipe during some process on your page (this can be initial page load/render, or some complex animation on page), try to delay PhotoSwipe initialization until page is rendered (18-300ms after document.ready), especially if you're opening large images.


## FAQ

### When WordPress plugin will be released?

Plugin is under development and will be released in early-mid 2015. You may [subscribe here](http://dimsemenov.com/subscribe.html) to get notified.



### <a name="image-size"></a> I'm unable to predefine image size, what to do?

Use another gallery script ([1](http://dimsemenov.com/plugins/magnific-popup/), [2](http://dimsemenov.com/plugins/royal-slider/gallery/)), or find a way:

- You can read size of an image by downloading only small part of it ([PHP version](http://stackoverflow.com/questions/4635936/super-fast-getimagesize-in-php), [Ruby](https://github.com/sdsykes/fastimage), [Node.js](http://stackoverflow.com/a/20111234/331460)).
- You can store size of image directly in its filename and parse it on frontend during PhotoSwipe initialization. 
- Most CMS store size of an image in database and have API to retrieve it.
- Most web API (Facebook, 500px, Instagram, Flickr, Twitter, YouTube, Vimeo etc.) return size of images.

Dimensions are used for progressive loading, stretched placeholder, initial zoom-in transition, paning, zooming, caption positioning.





Know how this page can be improved? [Suggest an edit!](https://github.com/dimsemenov/PhotoSwipe/blob/master/website/documentation/responsive-images.md)
