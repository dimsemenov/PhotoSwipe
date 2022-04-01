import React, { useEffect } from 'react';
import Lightbox from '../../static/photoswipe/photoswipe-lightbox.esm.js';
import PhotoSwipe from '../../static/photoswipe/photoswipe.esm.js'

import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin';
import 'photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css';

const baseCdnUrl = 'https://cdn.photoswipe.com/photoswipe-demo-images/photos/home-demo/';
const imagesData = [
  {
    caption: `<strong>Test Caption</strong><br>
    Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.`,
    width: 2500,
    height: 3125,
    src: `${baseCdnUrl}luca-bravo-ny6qxqv_m04-unsplash_snrzpf/luca-bravo-ny6qxqv_m04-unsplash_snrzpf_c_scale,w_2500.jpg`,
    thumbSrc: `${baseCdnUrl}luca-bravo-ny6qxqv_m04-unsplash_snrzpf/luca-bravo-ny6qxqv_m04-unsplash_snrzpf_c_scale,w_664.jpg`,
    thumbSrcset: `${baseCdnUrl}luca-bravo-ny6qxqv_m04-unsplash_snrzpf/thumb.jpg 524w,
    ${baseCdnUrl}luca-bravo-ny6qxqv_m04-unsplash_snrzpf/luca-bravo-ny6qxqv_m04-unsplash_snrzpf_c_scale,w_664.jpg 664w,
    ${baseCdnUrl}luca-bravo-ny6qxqv_m04-unsplash_snrzpf/luca-bravo-ny6qxqv_m04-unsplash_snrzpf_c_scale,w_932.jpg 932w`,
    srcset: `${baseCdnUrl}luca-bravo-ny6qxqv_m04-unsplash_snrzpf/luca-bravo-ny6qxqv_m04-unsplash_snrzpf_c_scale,w_300.jpg 300w,
    ${baseCdnUrl}luca-bravo-ny6qxqv_m04-unsplash_snrzpf/luca-bravo-ny6qxqv_m04-unsplash_snrzpf_c_scale,w_664.jpg 664w,
    ${baseCdnUrl}luca-bravo-ny6qxqv_m04-unsplash_snrzpf/luca-bravo-ny6qxqv_m04-unsplash_snrzpf_c_scale,w_932.jpg 932w,
    ${baseCdnUrl}luca-bravo-ny6qxqv_m04-unsplash_snrzpf/luca-bravo-ny6qxqv_m04-unsplash_snrzpf_c_scale,w_1355.jpg 1355w,
    ${baseCdnUrl}luca-bravo-ny6qxqv_m04-unsplash_snrzpf/luca-bravo-ny6qxqv_m04-unsplash_snrzpf_c_scale,w_2500.jpg 2500w`
  },


  {
    width: 2500,
    height: 1667,
    caption: `<strong>Another Test Caption</strong><br>
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`, 
    src: `${baseCdnUrl}luca-bravo-O453M2Liufs-unsplash_qqt53u/luca-bravo-O453M2Liufs-unsplash_qqt53u_c_scale,w_2500.jpg`,
    thumbSrc: `${baseCdnUrl}luca-bravo-O453M2Liufs-unsplash_qqt53u/luca-bravo-O453M2Liufs-unsplash_qqt53u_c_scale,w_300.jpg`,
    thumbSrcset: `${baseCdnUrl}luca-bravo-O453M2Liufs-unsplash_qqt53u/luca-bravo-O453M2Liufs-unsplash_qqt53u_c_scale,w_300.jpg 300w,
    ${baseCdnUrl}luca-bravo-O453M2Liufs-unsplash_qqt53u/thumb.jpg 393w,
    ${baseCdnUrl}luca-bravo-O453M2Liufs-unsplash_qqt53u/luca-bravo-O453M2Liufs-unsplash_qqt53u_c_scale,w_612.jpg 612w,
    ${baseCdnUrl}luca-bravo-O453M2Liufs-unsplash_qqt53u/luca-bravo-O453M2Liufs-unsplash_qqt53u_c_scale,w_826.jpg 826w`,
    srcset: `${baseCdnUrl}luca-bravo-O453M2Liufs-unsplash_qqt53u/luca-bravo-O453M2Liufs-unsplash_qqt53u_c_scale,w_300.jpg 300w,
    ${baseCdnUrl}luca-bravo-O453M2Liufs-unsplash_qqt53u/luca-bravo-O453M2Liufs-unsplash_qqt53u_c_scale,w_612.jpg 612w,
    ${baseCdnUrl}luca-bravo-O453M2Liufs-unsplash_qqt53u/luca-bravo-O453M2Liufs-unsplash_qqt53u_c_scale,w_826.jpg 826w,
    ${baseCdnUrl}luca-bravo-O453M2Liufs-unsplash_qqt53u/luca-bravo-O453M2Liufs-unsplash_qqt53u_c_scale,w_1115.jpg 1115w,
    ${baseCdnUrl}luca-bravo-O453M2Liufs-unsplash_qqt53u/luca-bravo-O453M2Liufs-unsplash_qqt53u_c_scale,w_1400.jpg 1400w,
    ${baseCdnUrl}luca-bravo-O453M2Liufs-unsplash_qqt53u/luca-bravo-O453M2Liufs-unsplash_qqt53u_c_scale,w_2500.jpg 2500w`
  },
  {
    width: 2500,
    height: 1667,
    caption: `<strong>Long caption</strong><br>
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?`, 
    src: `${baseCdnUrl}luca-bravo-VowIFDxogG4-unsplash_ibrktu/luca-bravo-VowIFDxogG4-unsplash_ibrktu_c_scale,w_2500.jpg`,
    thumbSrc: `${baseCdnUrl}luca-bravo-VowIFDxogG4-unsplash_ibrktu/luca-bravo-VowIFDxogG4-unsplash_ibrktu_c_scale,w_300.jpg`,
    thumbSrcset: `${baseCdnUrl}luca-bravo-VowIFDxogG4-unsplash_ibrktu/luca-bravo-VowIFDxogG4-unsplash_ibrktu_c_scale,w_300.jpg 300w,
    ${baseCdnUrl}luca-bravo-VowIFDxogG4-unsplash_ibrktu/thumb.jpg 393w,
    ${baseCdnUrl}luca-bravo-VowIFDxogG4-unsplash_ibrktu/luca-bravo-VowIFDxogG4-unsplash_ibrktu_c_scale,w_639.jpg 639w`,
    srcset: `${baseCdnUrl}luca-bravo-VowIFDxogG4-unsplash_ibrktu/luca-bravo-VowIFDxogG4-unsplash_ibrktu_c_scale,w_300.jpg 300w,
    ${baseCdnUrl}luca-bravo-VowIFDxogG4-unsplash_ibrktu/luca-bravo-VowIFDxogG4-unsplash_ibrktu_c_scale,w_639.jpg 639w,
    ${baseCdnUrl}luca-bravo-VowIFDxogG4-unsplash_ibrktu/luca-bravo-VowIFDxogG4-unsplash_ibrktu_c_scale,w_1176.jpg 1176w,
    ${baseCdnUrl}luca-bravo-VowIFDxogG4-unsplash_ibrktu/luca-bravo-VowIFDxogG4-unsplash_ibrktu_c_scale,w_1200.jpg 1200w,
    ${baseCdnUrl}luca-bravo-VowIFDxogG4-unsplash_ibrktu/luca-bravo-VowIFDxogG4-unsplash_ibrktu_c_scale,w_1385.jpg 1385w,
    ${baseCdnUrl}luca-bravo-VowIFDxogG4-unsplash_ibrktu/luca-bravo-VowIFDxogG4-unsplash_ibrktu_c_scale,w_1834.jpg 1834w,
    ${baseCdnUrl}luca-bravo-VowIFDxogG4-unsplash_ibrktu/luca-bravo-VowIFDxogG4-unsplash_ibrktu_c_scale,w_2500.jpg 2500w`
  },

  {
    width: 2500,
    height: 1667,
    caption: `<strong>Lorem Ipsum</strong><br>Unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.`, 
    src: `${baseCdnUrl}luca-bravo-zAjdgNXsMeg-unsplash_q6zdih/luca-bravo-zAjdgNXsMeg-unsplash_q6zdih_c_scale,w_2500.jpg`,
    thumbSrc: `${baseCdnUrl}luca-bravo-zAjdgNXsMeg-unsplash_q6zdih/luca-bravo-zAjdgNXsMeg-unsplash_q6zdih_c_scale,w_300.jpg`,
    thumbSrcset: `${baseCdnUrl}luca-bravo-zAjdgNXsMeg-unsplash_q6zdih/luca-bravo-zAjdgNXsMeg-unsplash_q6zdih_c_scale,w_300.jpg 300w,
    ${baseCdnUrl}luca-bravo-zAjdgNXsMeg-unsplash_q6zdih/thumb.jpg 393w,
    ${baseCdnUrl}luca-bravo-zAjdgNXsMeg-unsplash_q6zdih/luca-bravo-zAjdgNXsMeg-unsplash_q6zdih_c_scale,w_627.jpg 627w,
    ${baseCdnUrl}luca-bravo-zAjdgNXsMeg-unsplash_q6zdih/luca-bravo-zAjdgNXsMeg-unsplash_q6zdih_c_scale,w_861.jpg 861w`,
    srcset: `${baseCdnUrl}luca-bravo-zAjdgNXsMeg-unsplash_q6zdih/luca-bravo-zAjdgNXsMeg-unsplash_q6zdih_c_scale,w_300.jpg 300w,
    ${baseCdnUrl}luca-bravo-zAjdgNXsMeg-unsplash_q6zdih/luca-bravo-zAjdgNXsMeg-unsplash_q6zdih_c_scale,w_627.jpg 627w,
    ${baseCdnUrl}luca-bravo-zAjdgNXsMeg-unsplash_q6zdih/luca-bravo-zAjdgNXsMeg-unsplash_q6zdih_c_scale,w_861.jpg 861w,
    ${baseCdnUrl}luca-bravo-zAjdgNXsMeg-unsplash_q6zdih/luca-bravo-zAjdgNXsMeg-unsplash_q6zdih_c_scale,w_1057.jpg 1057w,
    ${baseCdnUrl}luca-bravo-zAjdgNXsMeg-unsplash_q6zdih/luca-bravo-zAjdgNXsMeg-unsplash_q6zdih_c_scale,w_1441.jpg 1441w,
    ${baseCdnUrl}luca-bravo-zAjdgNXsMeg-unsplash_q6zdih/luca-bravo-zAjdgNXsMeg-unsplash_q6zdih_c_scale,w_1881.jpg 1881w,
    ${baseCdnUrl}luca-bravo-zAjdgNXsMeg-unsplash_q6zdih/luca-bravo-zAjdgNXsMeg-unsplash_q6zdih_c_scale,w_2500.jpg 2500w`
  },


  {
    width: 2500,
    height: 1667,
    caption: `<strong>Test Caption</strong><br/>
    Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?<br/>`, 
    src: `${baseCdnUrl}luca-bravo-A-fubu9QJxE-unsplash_jxy5p8/luca-bravo-A-fubu9QJxE-unsplash_jxy5p8_c_scale,w_2500.jpg`,
    thumbSrc: `${baseCdnUrl}luca-bravo-A-fubu9QJxE-unsplash_jxy5p8/luca-bravo-A-fubu9QJxE-unsplash_jxy5p8_c_scale,w_300.jpg`,
    thumbSrcset: `${baseCdnUrl}luca-bravo-A-fubu9QJxE-unsplash_jxy5p8/luca-bravo-A-fubu9QJxE-unsplash_jxy5p8_c_scale,w_300.jpg 300w,
    ${baseCdnUrl}luca-bravo-A-fubu9QJxE-unsplash_jxy5p8/thumb.jpg 393w,
    ${baseCdnUrl}luca-bravo-A-fubu9QJxE-unsplash_jxy5p8/luca-bravo-A-fubu9QJxE-unsplash_jxy5p8_c_scale,w_649.jpg 649w,
    ${baseCdnUrl}luca-bravo-A-fubu9QJxE-unsplash_jxy5p8/luca-bravo-A-fubu9QJxE-unsplash_jxy5p8_c_scale,w_996.jpg 996w`,
    srcset: `${baseCdnUrl}luca-bravo-A-fubu9QJxE-unsplash_jxy5p8/luca-bravo-A-fubu9QJxE-unsplash_jxy5p8_c_scale,w_300.jpg 300w,
    ${baseCdnUrl}luca-bravo-A-fubu9QJxE-unsplash_jxy5p8/luca-bravo-A-fubu9QJxE-unsplash_jxy5p8_c_scale,w_649.jpg 649w,
    ${baseCdnUrl}luca-bravo-A-fubu9QJxE-unsplash_jxy5p8/luca-bravo-A-fubu9QJxE-unsplash_jxy5p8_c_scale,w_996.jpg 996w,
    ${baseCdnUrl}luca-bravo-A-fubu9QJxE-unsplash_jxy5p8/luca-bravo-A-fubu9QJxE-unsplash_jxy5p8_c_scale,w_1188.jpg 1188w,
    ${baseCdnUrl}luca-bravo-A-fubu9QJxE-unsplash_jxy5p8/luca-bravo-A-fubu9QJxE-unsplash_jxy5p8_c_scale,w_1303.jpg 1303w,
    ${baseCdnUrl}luca-bravo-A-fubu9QJxE-unsplash_jxy5p8/luca-bravo-A-fubu9QJxE-unsplash_jxy5p8_c_scale,w_1840.jpg 1840w,
    ${baseCdnUrl}luca-bravo-A-fubu9QJxE-unsplash_jxy5p8/luca-bravo-A-fubu9QJxE-unsplash_jxy5p8_c_scale,w_2500.jpg 2500w`
  },


];

function GalleryItem(props) {
  const attributes = {
    style: { 
      paddingBottom:  props.cropped ? 1 / props.aspectRatio * 100 + '%'  : props.height / props.width * 100 + '%'
    },
    href: props.src,
    'data-pswp-srcset': props.srcset,
    'data-pswp-width': props.width,
    'data-pswp-height': props.height,
    target: '_blank',
    ...( props.cropped && { 'data-cropped': true } )
  };

  const figureAttributes = {
    style: {},
    className: 'pswp-docs__home-gallery-item'
  };

  let sizes = props.sizes;
  if (props.justifiedRow) {
    figureAttributes.style.flex = props.width / props.height * 100;
    const widthRatio = ( props.width / props.height) / props.aspectRatioSumm;
    sizes = `(min-width: 1124px) ${Math.ceil(600 * widthRatio)}px, ${Math.ceil(100 * widthRatio)}vw`;
  }

  return (
    <figure {...figureAttributes}>
      <a {...attributes}>
      <img
        sizes={sizes}
        srcSet={props.thumbSrcset}
        src={props.thumbSrc}
        alt="" />
      { props.caption && <figcaption dangerouslySetInnerHTML={{__html: props.caption}}></figcaption> }
      </a>
    </figure>
  );
}

export function GalleryExampleOpenZoomed(props) {
  useEffect(() => {
    let lightbox = new Lightbox({
      gallery: '#gallery--open-zooomed figure > a',
      initialZoomLevel: 'fill',
      secondaryZoomLevel: 'fill',
      maxZoomLevel: 3,
      pswpModule: PhotoSwipe
    });
    lightbox.init();

    return function cleanup() {
      lightbox.destroy();
      lightbox = null;
    };
  }, []);

  return (
    <GalleryExample id="gallery--open-zooomed" items={[3, 4]} cropped={false} justifiedRow={true} />
  )
}


export function GalleryExampleDynamicCaptionPlugin(props) {
  useEffect(() => {
    const smallScreenPadding = {
      top: 0, bottom: 0, left: 0, right: 0
    };
    const largeScreenPadding = {
      top: 20, bottom: 20, left: 50, right: 50
    };
    let lightbox = new Lightbox({
      gallery: '#gallery--dynamic-caption',
      children: '.pswp-docs__home-gallery-item > a',
      paddingFn: (viewportSize) => {
        return viewportSize.x < 700 ? smallScreenPadding : largeScreenPadding
      },
      pswpModule: () => import('../../static/photoswipe/photoswipe.esm.js')
    });
    lightbox.init();

    let captionPlugin = new PhotoSwipeDynamicCaption(lightbox, {
      type: 'auto',
      captionContent: 'figcaption'
    });

    return function cleanup() {
      lightbox.destroy();
      lightbox = null;
      captionPlugin = null;
    };
  }, []);

  return (
    <GalleryExample id="gallery--dynamic-caption" items={[0,1,2]} cropped={false} justifiedRow={true} />
  )
}


export function GalleryExample(props) {

  const aspectRatioSumm = imagesData.reduce((summ, image, index) => {
    if (props.items && !props.items.includes(index)) {
      return summ;
    }
    return summ + image.width / image.height;
  }, 0);

  const galleryItems = imagesData.map((image, index) => {
    if (props.items && !props.items.includes(index)) {
      return;
    }

    return <GalleryItem 
      key={index} 
      {...image} 
      cropped={props.cropped} 
      aspectRatio={1} 
      aspectRatioSumm={aspectRatioSumm}
      justifiedRow={props.justifiedRow} />
  });

  return (
    <div className="pswp-docs__home-gallery-example" id={props.id} data-summ={aspectRatioSumm}>
      {galleryItems}
    </div>
  );
}

export default function GalleryHeader() {
  useEffect(() => {
    let lightbox = new Lightbox({
      gallery: '#gallery--header-home',
      children: '.pswp-docs__home-gallery-item > a',
      pswpModule: () => import('../../static/photoswipe/photoswipe.esm.js')
    });
    lightbox.init();

    return function cleanup() {
      lightbox.destroy();
      lightbox = null;
    };
  }, []);

  return (
    <div className="pswp-docs__home-gallery" id="gallery--header-home">
      <GalleryItem {...imagesData[0]}
        aspectRatio={1} 
        cropped={true}
        sizes="(min-width: 1124px) 524px, 50vw" />
      <GalleryItem {...imagesData[1]}
        aspectRatio={1} 
        cropped={true}
        sizes="(min-width: 1124px) 393px, 35vw" />
      <GalleryItem {...imagesData[2]}
        aspectRatio={1} 
        cropped={true}
        sizes="(min-width: 1124px) 393px, 35vw" />
      <GalleryItem {...imagesData[3]}
        aspectRatio={1}
        cropped={true}
        sizes="(min-width: 1124px) 393px, 35vw" />
      <GalleryItem {...imagesData[4]}
        aspectRatio={1} 
        cropped={true}
        sizes="(min-width: 1124px) 393px, 35vw" />
      <div className='pswp-docs__home-gallery-credit'>Photos by Luca Bravo</div>
    </div>
  );
}
