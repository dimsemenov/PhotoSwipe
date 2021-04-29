const fs = require('fs');

let uidCounter = 1;

function getImagesToRender(numImages) {
  const jsonString = fs.readFileSync('./photoswipe-markdown/demo-photos.json', 'utf8');
  const photosData = JSON.parse(jsonString);
  return photosData.slice(0, numImages);
}

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
 * @param {String} rawString JSON string
 * 
 * Supported params:
 *   displayHTML: false|true (whether HTML code block should be visible)
 *   autoImages: Integer (number of images to display)
 *   id: String (ID attribute)
*/
const generateGallery = (rawString) => {
  const parsedGalleryData = {};
  let galleryData;
  try {
    galleryData = JSON.parse(rawString);
  } catch (e) {
    return parsedGalleryData;
  }

  
  if (!galleryData) {
    return parsedGalleryData;
  }

  parsedGalleryData.displayHTML = galleryData.displayHTML;

  const thumbnailSize = 70;
  const cdnURL = 'https://cdn.photoswipe.com/photoswipe-demo-images/photos/';
  const templateProps = {
    numItems: Math.min(parseInt(galleryData.autoImages, 10), 11),
    id: galleryData.id || (uidCounter++),
    img: [],
    cdnURL
  };
  const { orientation } = galleryData;
  let availableImages = getImagesToRender(15);

  if (orientation === 'landscape') {
    availableImages = availableImages.filter((imageData) => {
      return imageData.sizes[0].width >= imageData.sizes[0].height;
    });
  } else if (orientation === 'portrait') {
    availableImages = availableImages.filter((imageData) => {
      return imageData.sizes[0].width <= imageData.sizes[0].height;
    });
  }
  
  availableImages.forEach((imageData, index) => {
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

  const templateFn = require('./gallery-templates/' + (galleryData.template || 'basic'));
  if (templateFn) {
    parsedGalleryData.html = templateFn(templateProps);
  }
  return parsedGalleryData;
};

module.exports = generateGallery;
