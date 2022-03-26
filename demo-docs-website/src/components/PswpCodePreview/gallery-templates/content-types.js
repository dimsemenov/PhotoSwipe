export function contentTypesTemplate(props) {
  return `<div class="pswp-gallery" id="gallery--${props.id}">
    <a  
      href="${props.img[0].src}" 
      data-pswp-width="${props.img[0].width}" 
      data-pswp-height="${props.img[0].height}" 
      data-pswp-webp-src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/1/img-2500.webp"
      target="_blank">
      <img src="${props.img[0].thumbSrc}" alt="" />
    </a>

    <a  
      href="${props.img[2].src}" 
      data-pswp-width="${props.img[2].width}" 
      data-pswp-height="${props.img[2].height}" 
      target="_blank">
      <img src="${props.img[2].thumbSrc}" alt="" />
    </a>

    <a  
      href="${props.img[3].src}" 
      data-pswp-width="${props.img[3].width}" 
      data-pswp-height="${props.img[3].height}" 
      target="_blank">
      <img src="${props.img[3].thumbSrc}" alt="" />
    </a>
  
</div>`;
}
