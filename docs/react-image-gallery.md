---
id: react-image-gallery
title: Image Gallery with Lightbox for React
sidebar_label: for React
---

Here's a basic example of how to attach PhotoSwipe Lightbox to a simple image grid in React. ([edit Stackblitz](https://stackblitz.com/edit/react-ts-gvpqsb?file=SimpleGallery.js)). The example creates a simple component from an array of image URLs and sizes.

The example uses dynamic import - PhotoSwipe JS starts loading only after the user clicks on a thumbnail. If you'd like to load PhotoSwipe initially - set `pswpModule: PhotoSwipe` as [shown here](/getting-started/#without-dynamic-import).

<iframe src="https://stackblitz.com/edit/react-ts-gvpqsb?embed=1&file=SimpleGallery.js&hideNavigation=1"></iframe>

If you want to provide images data directly to PhotoSwipe, refer to [Data sources page](/data-sources).
