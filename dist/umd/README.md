`umd/` folder contains transpiled version of PhotoSwipe in universal module definition format.

Use it only if you are unable to use ESM version.

Basic example:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Test Gallery</title>
  </head>
  <body>

    <script src="./photoswipe.umd.min.js"></script>
    <script src="./photoswipe-lightbox.umd.min.js"></script>
    
    <link rel="stylesheet" href="../photoswipe.css">

    <div class="test-gallery">
      <a href="https://dummyimage.com/1200x600/000/fff" data-pswp-width="1200" data-pswp-height="600">
        <img src="https://dummyimage.com/120x60/000/fff" alt="" />
      </a>
      <a href="https://dummyimage.com/1200x1200/000/fff" data-pswp-width="1200" data-pswp-height="1200">
        <img src="https://dummyimage.com/60x60/000/fff" alt="" />
      </a>
      <a href="https://dummyimage.com/600x1200/000/fff" data-pswp-width="600" data-pswp-height="1200">
        <img src="https://dummyimage.com/30x60/000/fff" alt="" />
      </a>
    </div>
    
    <script type="text/javascript">
      var lightbox = new PhotoSwipeLightbox({
        gallery: '.test-gallery',
        children: 'a',
        // dynamic import is not supported in UMD version
        pswpModule: PhotoSwipe 
      });
      lightbox.init();
    </script>

  </body>
</html>

```