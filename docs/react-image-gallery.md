---
id: react-image-gallery
title: Image Gallery for React
sidebar_label: for React
---


1. Install PhotoSwipe, for example `npm i photoswipe#beta --s`
2. Generate HTML markup for your gallery
3. Initialize PhotoSwipe when component with HTML markup is mounted.
4. Don't forget to call destroy() when component is unmounted to avoid memory leak.

Here's how to create a simple image grid component:

```js
import React from "react";
import PhotoSwipeLightbox from "photoswipe/dist/photoswipe-lightbox.esm.js";
import "photoswipe/dist/photoswipe.css";

class SimpleGallery extends React.Component {
  componentDidMount() {
    if (!this.lightbox) {
      this.lightbox = new PhotoSwipeLightbox({
        gallery: "#" + this.props.galleryID,
        children: "a",
        pswpModule: () => import("photoswipe")
      });
      this.lightbox.init();
    }
  }

  componentWillUnmount() {
    if (this.lightbox) {
      this.lightbox.destroy();
      this.lightbox = null;
    }
  }

  render() {
    return (
      <div className="pswp-gallery" id={this.props.galleryID}>
        {this.props.images.map((image, index) => (
          <a
            href={image.largeURL}
            data-pswp-width={image.width}
            data-pswp-height={image.height}
            key={this.props.galleryID + "-" + index}
            target="_blank"
            rel="noreferrer"
          >
            <img src={image.thumbnailURL} alt="" />
          </a>
        ))}
      </div>
    );
  }
}

export default SimpleGallery;
```

Please refer to codesandbox below for the full code.

<iframe src="https://codesandbox.io/embed/photoswipe-simple-react-demo-o00gz5?autoresize=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2FSimpleGallery.js&theme=light"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="photoswipe-simple-react-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>