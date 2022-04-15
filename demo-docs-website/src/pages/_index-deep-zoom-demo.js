import React, { useEffect } from 'react';
import Lightbox from '../../static/photoswipe/photoswipe-lightbox.esm.js';

//import PhotoSwipeDeepZoom from 'photoswipe-deep-zoom-plugin';

const galleryHTML = `
  <figure style="flex: 132.13213213213;">
    <a style="padding-bottom:75.6818%" href="https://cdn.photoswipe.com/photoswipe-deep-zoom/old-map/full.jpg" data-pswp-width="1700" data-pswp-height="1285" data-pswp-tile-url="https://cdn.photoswipe.com/photoswipe-deep-zoom/old-map/{z}/{x}_{y}.jpeg" data-pswp-tile-size="254" data-pswp-tile-overlap="1" data-pswp-max-width="5832" data-pswp-max-height="4409" target="_blank">
      <img src="https://cdn.photoswipe.com/photoswipe-deep-zoom/old-map/thumb.jpg" alt="">
    </a>
    <figcaption class="caption">
      <a href="https://en.wikipedia.org/wiki/Cambriae_Typus"><strong>Cambriae Typus</strong></a>
      <br>
      Humphrey Llwyd
      <br>
      5,832px x 4,409px
    </figcaption>
  </figure>

  <figure style="flex: 80;">
    <a style="padding-bottom:124.7%" href="https://cdn.photoswipe.com/photoswipe-deep-zoom/a-sergeant-of-the-light-horse/full.jpg" data-pswp-width="1635" data-pswp-height="2048" data-pswp-tile-type="zoomify" data-pswp-tile-url="https://cdn.photoswipe.com/photoswipe-deep-zoom/a-sergeant-of-the-light-horse/TileGroup{zoomify_group}/{z}-{x}-{y}.jpg" data-pswp-tile-size="256" data-pswp-max-width="4578" data-pswp-max-height="5736" target="_blank">
      <img src="https://cdn.photoswipe.com/photoswipe-deep-zoom/a-sergeant-of-the-light-horse/thumb.jpg" alt="A sergeant of the Light Horse">
    </a>
    <figcaption class="caption">
      <a href="https://en.wikipedia.org/wiki/A_Sergeant_of_the_Light_Horse"><strong>A sergeant of the Light Horse</strong></a>
      <br>
      George Lambert
      <br>
      4,578px x 5,736px
    </figcaption>
  </figure>

  <figure style="flex: 126.34408602151;">
    <a style="padding-bottom:79.15%" href="https://cdn.photoswipe.com/photoswipe-deep-zoom/starry/starry_files/full.jpg" data-pswp-width="1700" data-pswp-height="1346" data-pswp-tile-url="https://cdn.photoswipe.com/photoswipe-deep-zoom/starry/starry_files/{z}/{x}_{y}.jpeg" data-pswp-tile-size="254" data-pswp-tile-overlap="1" data-pswp-max-width="30000" data-pswp-max-height="23756" target="_blank">
      <img src="https://cdn.photoswipe.com/photoswipe-deep-zoom/starry/thumb.jpg" alt="">
    </a>
    <figcaption class="caption">
      <a href="https://en.wikipedia.org/wiki/The_Starry_Night"><strong>The Starry Night</strong></a>
      <br>
      Vincent van Gogh
      <br>
      30,000px x 23,756px
    </figcaption>
  </figure>

  <figure style="flex: 93.418259023355;">
    <a style="padding-bottom:107%" data-pswp-group-id="1" href="https://cdn.photoswipe.com/photoswipe-demo-images/photos/chen-hongshou/large.jpg" data-pswp-width="1820" data-pswp-height="1948" target="_blank">
      <img src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/chen-hongshou/thumb.jpg" alt="">
    </a>
    <figcaption class="caption">
      <a href="https://en.wikipedia.org/wiki/Chen_Hongshou"><strong>Magnolia and Erect Rock</strong></a>
      <br>
      Chen Hongshou
      <br>
      1,820px x 1,948px (not tiled)
    </figcaption>
  </figure>

`;

export default function DeepZoomGalleryDemo() {

  useEffect(() => {
    let deepZoomPlugin;
    let lightbox = new Lightbox({
      gallery: '#gallery--deep-zoom',
      children: 'figure > a',
      pswpModule: () => import('../../static/photoswipe/photoswipe.esm.js'),

      // dynamically load deep zoom plugin
      openPromise: () => {
        // make sure it's initialized only once per lightbox
        if (!deepZoomPlugin) {
          return import('photoswipe-deep-zoom-plugin').then((deepZoomPluginModule) => {
            deepZoomPlugin = new deepZoomPluginModule.default(lightbox, {
              // deep zoom plugin options
            });
          })
        }
      },
      
      // Recommended PhotoSwipe options for this plugin
      allowPanToNext: false, // prevent swiping to the next slide when image is zoomed
      allowMouseDrag: true, // display dragging cursor at max zoom level
      wheelToZoom: true, // enable wheel-based zoom
      zoom: false // disable default zoom button
    });
    lightbox.init();

    return function cleanup() {
      if (lightbox) {
        lightbox.destroy();
        lightbox = null;
      }
      
      if (deepZoomPlugin) {
        deepZoomPlugin.destroy();
        deepZoomPlugin = null;
      }
    };
  }, []);

  return (
    <div id="gallery--deep-zoom" dangerouslySetInnerHTML={{__html: galleryHTML}} />
  )
}
