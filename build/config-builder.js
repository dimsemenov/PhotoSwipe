// eslint-disable-next-line import/no-extraneous-dependencies
import { terser } from 'rollup-plugin-terser';

import pkg from '../package.json';

const year = new Date().getFullYear();

function getBanner(name) {
  return `/*!
  * ${name} ${pkg.version} - https://photoswipe.com
  * (c) ${year} Dmitry Semenov
  */`;
}

function getMinifyPlugin() {
  return terser({
    output: {
      comments: /^\**!/i,
    },
    mangle: {
      properties: {
        // mangle properties and func names that start with underscore
        regex: /^_/,
      }
    }
  });
}

const baseOutputDir = 'website/static/photoswipe/';

export const lightboxJS = {
  input: 'src/js/lightbox/lightbox.js',
  output: {
    banner: getBanner('PhotoSwipe Lightbox'),
    file: baseOutputDir + 'photoswipe-lightbox.esm.js',
    format: 'esm',
    sourcemap: true
  }
};

export const coreJS = {
  input: 'src/js/photoswipe.js',
  output: {
    banner: getBanner('PhotoSwipe'),
    file: baseOutputDir + 'photoswipe.esm.js',
    format: 'esm',
    sourcemap: true
  }
};


export const minLightboxJS = {
  input: 'src/js/lightbox/lightbox.js',
  output: {
    banner: getBanner('PhotoSwipe Lightbox'),
    file: baseOutputDir + 'photoswipe-lightbox.esm.min.js',
    format: 'esm'
  },
  plugins: [getMinifyPlugin()]
};

export const minCoreJS = {
  input: 'src/js/photoswipe.js',
  output: {
    banner: getBanner('PhotoSwipe'),
    file: baseOutputDir + 'photoswipe.esm.min.js',
    format: 'esm',
  },
  plugins: [getMinifyPlugin()]
};