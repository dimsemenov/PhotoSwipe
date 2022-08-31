---
id: native-fullscreen-on-open
title: Trigger native fullscreen when lightbox opens
sidebar_label: Native fullscreen on open
---

There is [an unoficial fullscreen plugin by @arnowelzel](https://github.com/arnowelzel/photoswipe-fullscreen) that might be useful.

You may use asynchronous initialization to open gallery in fullscreen mode right away. Fullscreen API is [supported in all major browsers](https://caniuse.com/#feat=fullscreen), except mobile Safari. Fullscreen in mobile Chrome on Android works exceptionally well in landscape orientation as it removes toolbars.

To implement it, create a promise that is resolved after fullscreen mode is entered and pass it to lightbox as an `openPromise` option.

<PswpCodePreview>

```js pswpcode  
import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';

// Simple fullscreen API
const fullscreenAPI = getFullscreenAPI();

// Create custom container
// which will be stretched to fullscreen.
//
// (we can not use PhotoSwipe root element (.pswp),
//  as it is created only after openPromise is resolved)
//
const pswpContainer = getContainer();

function getFullscreenPromise() {
  // Always resolve promise,
  // as wa want to open lightbox 
  // (no matter if fullscreen is supported or not)
  return new Promise((resolve) => {
    if (!fullscreenAPI || fullscreenAPI.isFullscreen()) {
      // fullscreen API not supported, or already fullscreen
      resolve();
      return;
    }

    document.addEventListener(fullscreenAPI.change, (event) => {
      pswpContainer.style.display = 'block';
      // delay to make sure that browser fullscreen animation is finished
      setTimeout(function() {
        resolve();
      }, 300);
    }, { once: true });

    fullscreenAPI.request(pswpContainer);
  });
}

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--native-fs',
  children: 'a',
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),

  // Add function that returns promise
  openPromise: getFullscreenPromise,
  
  // Append PhotoSwipe to our container
  appendToEl: fullscreenAPI ? pswpContainer : document.body,

  // disable opening/closing animations
  showAnimationDuration: 0,
  hideAnimationDuration: 0,

  // Add if you're using responsive images
  // since viewport size is unpredictable
  // at initialization
  preloadFirstSlide: false
});
lightbox.on('close', () => {
  pswpContainer.style.display = 'none';
  if (fullscreenAPI && fullscreenAPI.isFullscreen()) {
    fullscreenAPI.exit();
  }
});
lightbox.init();

// Simple fullscreen API helper,
// supports unprefixed and webkit-prefixed versions
function getFullscreenAPI() {
  let api;
  let enterFS;
  let exitFS;
  let elementFS;
  let changeEvent;
  let errorEvent;

  if (document.documentElement.requestFullscreen) {
    enterFS = 'requestFullscreen';
    exitFS = 'exitFullscreen';
    elementFS = 'fullscreenElement';
    changeEvent = 'fullscreenchange';
    errorEvent = 'fullscreenerror';
  } else if (document.documentElement.webkitRequestFullscreen) {
    enterFS = 'webkitRequestFullscreen';
    exitFS = 'webkitExitFullscreen';
    elementFS = 'webkitFullscreenElement';
    changeEvent = 'webkitfullscreenchange';
    errorEvent = 'webkitfullscreenerror';
  }

  if (enterFS) {
    api = {
      request: function (el) {
        if (enterFS === 'webkitRequestFullscreen') {
          el[enterFS](Element.ALLOW_KEYBOARD_INPUT);
        } else {
          el[enterFS]();
        }
      },

      exit: function () {
        return document[exitFS]();
      },

      isFullscreen: function () {
        return document[elementFS];
      },

      change: changeEvent,
      error: errorEvent
    };
  }

  return api;
};

function getContainer() {
  const pswpContainer = document.createElement('div');
  pswpContainer.style.background = '#000';
  pswpContainer.style.width = '100%';
  pswpContainer.style.height = '100%';
  pswpContainer.style.display = 'none';
  document.body.appendChild(pswpContainer);
  return pswpContainer;
}
```

```html pswpcode
<div class="pswp-gallery" id="gallery--native-fs">
<a href="https://dummyimage.com/1500x1000/555/fff/?text=1st-1500x1000" 
    data-pswp-srcset="
      https://dummyimage.com/1500x1000/555/fff/?text=1st-1500x1000 1500w,
      https://dummyimage.com/1200x800/555/fff/?text=1st-1200x800 1200w,
      https://dummyimage.com/600x400/555/fff/?text=1st-600x400 600w,
      https://dummyimage.com/300x200/555/fff/?text=1st-300x200 300w" 
    data-pswp-width="1500" 
    data-pswp-height="1000"
    target="_blank">
    <img src="https://dummyimage.com/300x200/555/fff/?text=1st" alt="">
  </a>

  <a href="https://source.unsplash.com/Volo9FYUAzU/1620x1080" data-pswp-width="1620" data-pswp-height="1080" data-cropped="true" target="_blank">
    <img src="https://source.unsplash.com/Volo9FYUAzU/162x108" alt="" />
  </a>
  <a href="https://source.unsplash.com/WLUHO9A_xik/1600x900" data-pswp-width="1600" data-pswp-height="900" data-cropped="true" target="_blank">
    <img src="https://source.unsplash.com/WLUHO9A_xik/160x90" alt="" />
  </a>
  <a href="https://source.unsplash.com/RJzHlbKf6eY/1950x1300" data-pswp-width="1950" data-pswp-height="1300" data-cropped="true" target="_blank">
    <img src="https://source.unsplash.com/RJzHlbKf6eY/195x130" alt="" />
  </a>
</div>
```

</PswpCodePreview>

