[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner-direct.svg)](https://savelife.in.ua/en/)


PhotoSwipe v5 — JavaScript image gallery and lightbox

**[Demo](https://photoswipe.com)** | **[Documentation](https://photoswipe.com/getting-started/)**

[![Sponsor via OpenCollective](https://img.shields.io/opencollective/all/photoswipe?label=Sponsor%20via%20OpenCollective)](https://opencollective.com/photoswipe)
[![Follow on Twitter](https://img.shields.io/twitter/follow/photoswipe?style=social)](https://twitter.com/intent/user?screen_name=photoswipe)


### Repo structure

- `dist/` - main JS and CSS
- `src/` - source JS and CSS.
  - `src/js/photoswipe.js` - entry for PhotoSwipe Core.
  - `src/js/lightbox/lightbox.js` - entry for PhotoSwipe Lightbox.
- `docs/` - documentation markdown files.
- `demo-docs-website/` - website with documentation, demos and manual tests.
- `build/` - rollup build config.

To build JS and CSS in `dist/` directory, run `npm run build`.

To run the demo website and automatically rebuild files during development, run `npm install` in `demo-docs-website/` and `npm run watch` in the root directory.

### Older versions

Documentation for the old version (v4) can be found [here](https://photoswipe.com/v4-docs/getting-started.html) and [the code for 4.1.3 is here](https://github.com/dimsemenov/PhotoSwipe/tree/v4.1.3).

---

This project is tested with [BrowserStack](https://www.browserstack.com/).
