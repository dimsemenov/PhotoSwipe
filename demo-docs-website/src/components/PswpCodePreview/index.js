import React from 'react';
import CodeBlock from '../../theme/CodeBlock';
import { pswpDemoImages } from './demo-images';
import { basicTemplate } from './gallery-templates/basic';

let uidCounter = 1;

/**
 * Get the smallest size (but not smaller than minSize)
 *
 * @param {Array} sizes
 * @param {Integer} minSize
 */
const getSmallestImageSize = (sizes, minSize) => {
  sizes = sizes.filter(size => size.width >= minSize);
  return sizes.reduce((a, b) => (a.width < b.width ? a : b));
};

/**
 * Generates gallery for demo
 * 
 * Supported params:
 *   displayHTML: false|true (whether HTML code block should be visible)
 *   numItems: Integer (number of images to display)
 *   galleryID: String (ID attribute)
*/
function generateGallery(galleryData) {
  

  const thumbnailSize = 70;
  const cdnURL = 'https://cdn.photoswipe.com/photoswipe-demo-images/photos/';
  const templateProps = {
    numItems: Math.min(parseInt(galleryData.numItems, 10) || 3, 11),
    id: galleryData.galleryID || (uidCounter++),
    img: [],
    cdnURL
  };
  const { orientation } = galleryData;
  let demoImages = [ ...pswpDemoImages ];

  if (orientation === 'landscape') {
    demoImages = demoImages.filter((imageData) => {
      return imageData.sizes[0].width >= imageData.sizes[0].height;
    });
  } else if (orientation === 'portrait') {
    demoImages = demoImages.filter((imageData) => {
      return imageData.sizes[0].width <= imageData.sizes[0].height;
    });
  }

  demoImages.forEach((imageData, index) => {
    const largest = imageData.sizes[0];
    const thumbnail = getSmallestImageSize(imageData.sizes, thumbnailSize);
    templateProps.img.push({
      index,
      width: largest.width,
      height: largest.height,
      src: cdnURL + largest.src,
      thumbSrc: cdnURL + thumbnail.src
    });
  });

  if (galleryData.templateFn) {
    return galleryData.templateFn(templateProps);
  }
  
  
  return basicTemplate(templateProps);
}

export default function PswpCodePreview(props) {
  return (
    <div className='pswp-example'>
      { props.children }
      { props.galleryID && <CodeBlock language='html' pswpcode displayHTML={props.displayHTML}>{generateGallery(props)}</CodeBlock> }
    </div>
  );
}
