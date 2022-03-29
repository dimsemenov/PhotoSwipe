import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import GalleryHeader, { GalleryExampleDynamicCaptionPlugin, GalleryExampleOpenZoomed } from './_index-gallery-header';
import CodeBlock from '../theme/CodeBlock';
import packageInfo from '../../../package.json';
import DeepZoomGalleryDemo from './_index-deep-zoom-demo';
import Head from '@docusaurus/Head';

function HomepageHeader() {
  return (
    <div className="pswp-docs__home-block pswp-docs__header-intro container">
      <Head>
        <html className="pswp-docs__home" />
        <title>PhotoSwipe: Responsive JavaScript Image Gallery</title>
      </Head>
      <div className="row">
        <div className="col col--12 pswp-docs__header-title-text">
          <h1>PhotoSwipe <span>{packageInfo.version}</span></h1>
          <p>JavaScript image gallery and lightbox</p>
          <a href="/getting-started">Documentation and examples<svg viewBox="0 0 448 512"><path d="M438.6 278.6l-160 160C272.4 444.9 264.2 448 256 448s-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L338.8 288H32C14.33 288 .0016 273.7 .0016 256S14.33 224 32 224h306.8l-105.4-105.4c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160C451.1 245.9 451.1 266.1 438.6 278.6z"/></svg></a>
        </div>
      </div>
      <div className="row">
        <div className="col col--12">
          <GalleryHeader />
        </div>
      </div>
    </div>
  );
}

function WhatsNew() {
  const initCodeExample = `<script type="module">
import Lightbox from './photoswipe-lightbox.esm.js';
const lightbox = new Lightbox({
  gallery: '#my-gallery',
  children: 'a',
  pswpModule: () => import('./photoswipe.esm.js')
});
lightbox.init();
</script>`;

  return (
    <div className="pswp-docs__home-block container pswp-docs__whats-new">
      <div className="row">
        <div className="col col--12 pswp-docs__home-block-main-col">
          <h2>What’s new in v5</h2>

          <h4>Code quality and rewrite in ES6</h4>
          <p>The script is now distributed as an ES module and does not require a build step to use. <a href="/getting-started">The documentation</a> is also updated and now includes more examples.</p>

          <h4>Simpler initialization and dynamic import support</h4>
          <p>PhotoSwipe now supports dynamic import and does not block page rendering.</p>
          <CodeBlock language="html">{initCodeExample}</CodeBlock>

          <h4>Animation and gesture engine update</h4>
          <p>Improved performance of most animations, touch gestures should feel more fluid now. 
            The initial opening or closing <a href="/opening-or-closing-transition#animating-from-cropped-thumbnail">transition can be run from a CSS-cropped thumbnail</a>, as you can see on the top of this page.</p>

          <h4>Single CSS file and no external assets</h4>
          <p>Using CSS variables, default icons are dynamically generated and tiny.<br/><a href="/styling">Styling guide &rarr;</a></p>

          <h4>Built-in responsive images support</h4>
          <p>PhotoSwipe also dynamically loads larger images as a user zooms via srcset.</p>

          <h4>Open images in a zoomed state</h4>
          <p>It's now much easier to control zoom level, refer to the <a href="/adjusting-zoom-level">Adjusting Zoom Level</a> section of docs for more info. The example below opens images in a zoomed state and individually.</p>
          <GalleryExampleOpenZoomed />

          <h4>Removed features from the core</h4>
          <p>Some built-in features were removed in v5, either because they are using outdated technology or just rarely used. Some of them are or will be replaced by a plugin. These include:</p>
          <ul>
            <li>History API (#hash-based navigation is outdated)</li>
            <li>Social sharing (unreliable URL, lack of Opengraph support)</li>
            <li>Fullscreen button (rarely used, double fullscreen). <a href="/native-fullscreen-on-open">Related example in docs &rarr;</a></li>
            <li>Caption (accessibility problems). Refer to the <a href="/caption">caption section of docs</a>.</li>
            <li>Inline gallery support (v5 is mainly designed to be used as a dialog).</li>
          </ul>

          <h2>Plugins</h2>

          <h4><a href="https://github.com/dimsemenov/photoswipe-dynamic-caption-plugin">Dynamic Caption plugin</a></h4>
          
          <p>
            A plugin that dynamically positions the caption below or aside 
            depending on the available free space.<br/>
          </p>
          <GalleryExampleDynamicCaptionPlugin />

          <h4><a href="https://github.com/dimsemenov/photoswipe-deep-zoom-plugin">Tiled Deep Zoom plugin</a> (experimental)</h4>
          <p>
            Tile-based image viewer that allows displaying of extremely large images.
            Unlike conventional tile-viewers (such as Leaflet or OpenSeaDragon) 
            it displays tiles only after the user zooms beyond the primary image,
            and keeps all default PhotoSwipe navigation between slides.<br/>
          </p>
          <DeepZoomGalleryDemo />


          <h2>License</h2>

          <p>PhotoSwipe is free for personal or commercial projects (MIT license).<br/>Please <a href="https://opencollective.com/photoswipe">support the development on Open Collective</a> if you find it useful.</p>

        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      description="Open-source JavaScript image gallery and lightbox.">
      <HomepageHeader />
      <WhatsNew />
    </Layout>
  );
}
