v5 is now available for testing, please visit [documentation and examples](https://photoswipe.com/v5/docs/getting-started/) and report any issues that you find.

[![Sponsor via OpenCollective](https://img.shields.io/opencollective/all/photoswipe?label=Sponsor%20via%20OpenCollective)](https://opencollective.com/photoswipe)
[![Follow on Twitter](https://img.shields.io/twitter/follow/photoswipe?style=social)](https://twitter.com/intent/user?screen_name=photoswipe)


### Repo structure

- `dist/` - main JS and CSS
- `src/` - source JS and CSS.
  - `src/js/photoswipe.js` - entry for PhotoSwipe Core.
  - `src/js/lightbox/lightbox.js` - entry for PhotoSwipe Lightbox.
- `docs/` - documentation markdown files.
- `website/` - website with documentation, demos and manual tests.
- `build/` - rollup build config.

### Build

- `npm run build` - builds and minifies JS and CSS to `dist/` directory. 
- `npm run lint` - lints JS files in `src/` with eslint (`npm run lint-auto-fix` to fix auto-fixable issues).

### Build docs and demos

- npm install in root
- npm install in `/website/` directory to get docusaurus (if you also need to build docs)
- `npm run watch` - watches changes for files in `src/` and `docs/`, starts Docusaurus - demo website with many examples where you perform manual tests, at 3000 port (visit [http://localhost:3000](http://localhost:3000)).


