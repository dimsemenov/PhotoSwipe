export function srcsetTemplate(props) {
  const items = [{ thumbSrc: '1-300x200.png', largeSrc: '1-1500x1000.png', width: 1500, height: 1000, srcset: '%1-600x400.png 600w, %1-1200x800.png 1200w, %1-1500x1000.png 1500w' }, { thumbSrc: '2-300x200.png', largeSrc: '2-1500x1000.png', width: 1500, height: 1000, srcset: '%2-600x400.png 600w, %2-1200x800.png 1200w, %2-1500x1000.png 1500w' }, { thumbSrc: '3-300x300.png', largeSrc: '3-1500x1500.png', width: 1500, height: 1500, srcset: '%3-600x600.png 600w, %3-1200x1200.png 1200w, %3-1500x1500.png 1500w' }, { thumbSrc: '4-200x300.png', largeSrc: '4-1000x1500.png', width: 1000, height: 1500, srcset: '%4-400x600.png 400w, %4-800x1200.png 800w, %4-1000x1500.png 1000w' }];
  let out = `<div class="pswp-gallery" id="gallery--${props.id}">\n`;
  const baseURL = props.cdnURL + 'srcset-test/';
  items.forEach((item) => {
    const srcset = item.srcset.replace(/%/g, baseURL);
    out += `  <a href="${baseURL + item.largeSrc}" 
    data-pswp-width="${item.width}" 
    data-pswp-height="${item.height}" 
    data-pswp-srcset="${srcset}" 
    target="_blank">
    <img src="${baseURL + item.thumbSrc}" alt="" />
  </a>\n`;
  });
  out += '</div>';
  return out;
}
