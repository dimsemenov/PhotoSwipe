export function basicTemplate(props) {
  let out = `<div class="pswp-gallery" id="gallery--${props.id}">\n`;
  for (let i = 0; i < (props.numItems || 3); i++) {
    out += `  <a href="${props.img[i].src}" 
    data-pswp-width="${props.img[i].width}" 
    data-pswp-height="${props.img[i].height}" 
    target="_blank">
    <img src="${props.img[i].thumbSrc}" alt="" />
  </a>\n`;
  }
  out += '</div>';
  return out;
}
