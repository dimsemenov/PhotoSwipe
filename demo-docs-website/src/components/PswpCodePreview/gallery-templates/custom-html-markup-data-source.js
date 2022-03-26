export function customHTMLDataSourceTemplate(props) {
  let out = `<div class="pswp-gallery pswp-gallery--single-column" id="gallery--${props.id}">\n`;
  for (let i = 0; i < (props.numItems || 3); i++) {
    out += `  <a href="${props.img[i].src}" 
    data-my-size="${props.img[i].width}x${props.img[i].height}" 
    data-thumb-src="${props.img[i].thumbSrc}"
    style="background-image:url(${props.img[i].thumbSrc})"
    target="_blank">Test ${i + 1}</a>\n`;
  }
  out += '</div>';
  return out;
}
