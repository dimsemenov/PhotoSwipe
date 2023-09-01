// eslint-disable-next-line import/no-extraneous-dependencies
import { terser } from 'rollup-plugin-terser';
import { babel } from '@rollup/plugin-babel';

import pkg from '../package.json';

const year = new Date().getFullYear();

function getBanner(name) {
  return `/*!
  * ${name} ${pkg.version} - https://photoswipe.com
  * (c) ${year} Dmytro Semenov
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

function getBabelPlugin() {
  return babel({
    exclude: 'node_modules/**'
  })
}

const baseOutputDir = 'demo-docs-website/static/photoswipe/';
export const lightboxJS = {
  input: 'src/js/lightbox/lightbox.js',
  output: {
    banner: getBanner('PhotoSwipe Lightbox'),
    file: baseOutputDir + 'photoswipe-lightbox.esm.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [getBabelPlugin()]
};

export const coreJS = {
  input: 'src/js/photoswipe.js',
  output: {
    banner: getBanner('PhotoSwipe'),
    file: baseOutputDir + 'photoswipe.esm.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [getBabelPlugin()]
};

export const minLightboxJS = {
  input: 'src/js/lightbox/lightbox.js',
  output: {
    banner: getBanner('PhotoSwipe Lightbox'),
    file: baseOutputDir + 'photoswipe-lightbox.esm.min.js',
    format: 'esm'
  },
  plugins: [getBabelPlugin(), getMinifyPlugin()]
};

export const minCoreJS = {
  input: 'src/js/photoswipe.js',
  output: {
    banner: getBanner('PhotoSwipe'),
    file: baseOutputDir + 'photoswipe.esm.min.js',
    format: 'esm',
  },
  plugins: [getBabelPlugin(), getMinifyPlugin()]
};

// UMD config
const umdBaseOutputDir = 'demo-docs-website/static/photoswipe/umd/';
export const umdMinLightboxJS = {
  input: 'src/js/lightbox/lightbox.js',
  output: {
    name: 'PhotoSwipeLightbox',
    banner: getBanner('PhotoSwipe Lightbox'),
    file: umdBaseOutputDir + 'photoswipe-lightbox.umd.min.js',
    format: 'umd'
  },
  plugins: [getBabelPlugin(), getMinifyPlugin()]
};

export const umdMinCoreJS = {
  input: 'src/js/photoswipe.js',
  output: {
    name: 'PhotoSwipe',
    banner: getBanner('PhotoSwipe'),
    file: umdBaseOutputDir + 'photoswipe.umd.min.js',
    format: 'umd',
  },
  plugins: [getBabelPlugin(), getMinifyPlugin()]
};
