---

layout: default

title: PhotoSwipe Performance Tips

h1_title: Performance Tips

description: Suggestions on how to make gallery faster.

addjs: true

canonical_url: http://photoswipe.com/documentations/performance-tips.html

buildtool: true

markdownpage: true

---

## Animations

- Don't do anything during animations that can cause Paint or Layout. Don't append new elements to DOM. Don't change `display` or `visibility`. Don't breath. You can only change `transform` and `opacity`. Delay all your changes after animation ends &ndash; use events: `beforeChange` (slide switched), `initialZoomInEnd` (initial zoom in animation ended) and `initialZoomOutEnd` (initial zoom out animation ended). 
- Animation performance dramatically depends on size of image. The smaller image - the smoothier animation. So don't be lazy and [serve responsive images](responsive-images.html).
- Try to avoid complex `:hover` and `:active` effects on thumbnails that open PhotoSwipe if you have zoom-in/out animation enabled (apply first rule). 

## Including Files

- Default PhotoSwipe UI has `png` and `svg` sprite. By default it's loaded only after PhotoSwipe is opened. To make controls appear instantly, you may merge gallery sprite with your site "main" sprite, or preload it via CSS.
- Defer the loading of PhotoSwipe JS file(s) if gallery is not the main feature of your page. 
- Combine JS, minify and combine CSS files.

Know how this page can be improved? [Suggest an edit!](https://github.com/dimsemenov/PhotoSwipe/blob/master/website/documentation/responsive-images.md)
