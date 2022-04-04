export function captionTemplate(props) {
  return `<div class="pswp-gallery pswp-gallery--with-caption" id="gallery--${props.id}">
  <div class="pswp-gallery__item">
    <a  
      href="${props.img[1].src}" 
      data-pswp-width="${props.img[1].width}" 
      data-pswp-height="${props.img[1].height}" 
      target="_blank">
      <img src="${props.img[1].thumbSrc}" alt="Caption 1" />
    </a>
    <div class="hidden-caption-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="https://example.com" target="_blank" rel="nofollow">Test link &rarr;</a></div>
  </div>

  <div class="pswp-gallery__item">
    <a  
      href="${props.img[2].src}" 
      data-pswp-width="${props.img[2].width}" 
      data-pswp-height="${props.img[2].height}" 
      target="_blank">
      <img src="${props.img[2].thumbSrc}" alt="Caption 2" />
    </a>
  </div>

  <div class="pswp-gallery__item">
    <a  
      href="${props.img[3].src}" 
      data-pswp-width="${props.img[3].width}" 
      data-pswp-height="${props.img[3].height}" 
      target="_blank">
      <img src="${props.img[3].thumbSrc}" alt="Caption 3" />
    </a>
  </div>
  
  <div class="pswp-gallery__item">
    <a  
      href="${props.img[4].src}" 
      data-pswp-width="${props.img[4].width}" 
      data-pswp-height="${props.img[4].height}" 
      target="_blank">
      <img src="${props.img[4].thumbSrc}" alt="Caption 4" />
    </a>
  </div>

  
</div>`;
}
