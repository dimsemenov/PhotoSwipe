export function basicBadgesTemplate(props) {
  let out = `<div class="pswp-gallery pswp-gallery--single-column" id="gallery--${props.id}">`;
  for (let i = 0; i < (props.numItems || 4); i++) {
    out += `<a href="${props.img[i].src}" 
    data-pswp-width="${props.img[i].width}" 
    data-pswp-height="${props.img[i].height}" 
    target="_blank">
    <img src="${props.img[i].thumbSrc}" alt="" />
    <div class="badge">Badge ${i + 1}</div>
  </a>`;
  }
  out += '</div>';
  return out;
}
