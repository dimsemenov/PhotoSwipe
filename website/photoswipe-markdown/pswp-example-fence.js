const generateGallery = require('./generate-gallery');

let inputUID = 1;

// ```pswp_example
function pswpExampleFence(md) {
  // Print two versions of a code block -
  // normal and highlighted.
  //
  // Usage example:
  // ```pswp_example js
  // alert('hello world');
  // ```
  md.renderer.rules.fence_custom.pswp_example = (tokens, idx, options/*, env, instance*/) => {
    const fences = tokens[idx].params.split(/\s+/g);
    if (!fences[1]) {
      return 'Please provide fence highlighter lang (js, html or css)';
    }

    let lang = fences[1];
    let rawContent = tokens[idx].content;
    let isHidden = false;

    if (!rawContent) {
      return '';
    }

    // Parse "```pswp_example gallery"
    // see generate-gallery.js for more info
    if (lang === 'gallery') {
      const galleryData = generateGallery(rawContent);
      rawContent = galleryData.html;
      if (!rawContent) {
        return '';
      }
      if (!galleryData.displayHTML) {
        isHidden = true;
      }

      tokens[idx].content = rawContent;
      lang = 'html';
    }

    tokens[idx].params = lang;
    // eslint-disable-next-line no-use-before-define
    let out = pswpExampleFenceCodeBlock(tokens, idx, options, isHidden);


    switch (lang) {
      case 'js':
        out += `<script type="module">${rawContent}</script>`;
        break;
      case 'css':
        out += `<style>${rawContent}</style>`;
        break;
      case 'html':
        out += `<div class="pswp-example__preview docs-styled-scrollbar">${rawContent}</div>`;
        break;
    }

    return out;
  };
}


// Override default fence method of remarkable
// https://github.com/jonschlinkert/remarkable/blob/fa88dcac16832ab26f068c30f0c070c3fec0d9da/lib/rules.js#L45
function pswpExampleFenceCodeBlock(tokens, idx, options, isHidden) {
  const token = tokens[idx];
  let langClassName = '';
  const { langPrefix } = options;
  let langName = ''; 
  let fences; 
  let fenceName;
  let highlighted;

  if (token.params) {
    fences = token.params.split(/\s+/g);
    fenceName = fences.join(' ');

    langName = fenceName;
    langClassName = langPrefix + langName;
  }

  if (options.highlight) {
    highlighted = options.highlight.apply(options.highlight, [token.content].concat(fences));
  }

  let preClassName = 'pswp-example__code--' + langName;
  if (isHidden) {
    preClassName += ' pswp-example__code--hidden';
  }

  let out = '';

  if (isHidden) {
    const id = 'pswp-cb-' + (inputUID++);
    out += `<input id="${id}" type="checkbox" class="hidden-cb"><label for="${id}" class="pswp-example__toggle">Display HTML</label>`;
  }

  out += `<pre class="${preClassName}"><code class="docs-styled-scrollbar ${langClassName}">${highlighted}</code></pre>`;

  return out;
}

module.exports = pswpExampleFence;
