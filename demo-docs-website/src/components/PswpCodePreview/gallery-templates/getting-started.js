export function gettingStartedTemplate(props) {
  return `<div class="pswp-gallery pswp-gallery--single-column" id="gallery--${props.id}">
  <a href="${props.img[1].src}" 
    data-pswp-width="${props.img[1].width}" 
    data-pswp-height="${props.img[1].height}" 
    target="_blank">
    <img src="${props.img[1].thumbSrc}" alt="" />
  </a>
  <!-- cropped thumbnail: -->
  <a href="${props.img[6].src}" 
    data-pswp-width="${props.img[6].width}" 
    data-pswp-height="${props.img[6].height}" 
    data-cropped="true" 
    target="_blank">
    <img src="${props.img[6].thumbSrc}" alt="" />
    Cropped
  </a>
  <!-- data-pswp-src with custom URL in href -->
  <a href="https://unsplash.com" 
    data-pswp-src="${props.img[2].src}"
    data-pswp-width="${props.img[2].width}" 
    data-pswp-height="${props.img[2].height}" 
    target="_blank">
    <img src="${props.img[2].thumbSrc}" alt="" />
  </a>
  <!-- Without thumbnail: -->
  <a href="http://example.com" 
    data-pswp-src="${props.img[4].src}"
    data-pswp-width="${props.img[4].width}" 
    data-pswp-height="${props.img[4].height}" 
    target="_blank">
    No thumbnail
  </a>
  <!-- wrapped with any element: -->
  <div>
    <a href="${props.img[5].src}"
      data-pswp-width="${props.img[5].width}" 
      data-pswp-height="${props.img[5].height}" 
      target="_blank">
      <img src="${props.img[5].thumbSrc}" alt="" />
    </a>
  </div>
</div>`;
}
