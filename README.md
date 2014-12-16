# PhotoSwipe Repository 

[![Build Status](https://travis-ci.org/dimsemenov/PhotoSwipe.svg)](https://travis-ci.org/dimsemenov/PhotoSwipe) 
[![devDependency Status](https://david-dm.org/dimsemenov/PhotoSwipe/dev-status.svg)](https://david-dm.org/dimsemenov/PhotoSwipe#info=devDependencies)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dimsemenov/PhotoSwipe?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)


JavaScript image gallery for mobile and desktop. 

- [Documentation and getting started guide](http://photoswipe.com/documentation/getting-started.html).
- [Demo and plugin home page](http://photoswipe.com).

Optionally, install via Bower: `bower install photoswipe`.

## Location of stuff

- Generated popup JS, CSS files, SVG & PNG sprites are in folder `dist/`.
- Source files are in folder `src/`.
- Website (examples & documentation) is in folder `website/`.
- Documentation page itself is in `website/documentation.md`.

## Plugins or extensions

Wrote a plugin for some CMS? <a href='mailto:diiiimaaaa@gmail.com?subject="PhotoSwipe Plugin"'>Email me</a> and I'll post link to it here.

## Build 

To compile PhotoSwipe by yourself, first of make sure that you have [Node.js](http://nodejs.org/), [Grunt.js](https://github.com/cowboy/grunt), [Ruby](http://www.ruby-lang.org/) and [Jekyll](https://github.com/mojombo/jekyll/) installed, then:

1) Copy repository

	git clone https://github.com/dimsemenov/PhotoSwipe.git

2) Go inside PhotoSwipe folder that you fetched and install Node dependencies

	cd PhotoSwipe && npm install

3) Now simply run `grunt` to generate JS and CSS in folder `dist` and site in folder `_site/`.

	grunt

Optionally:

- Run `grunt watch` to automatically rebuild script when you change files in `src/` or in `website/`.
- If you don't have and don't want to install Jekyll, run `grunt nosite` to just build JS and CSS files related to popup in `dist/`.

## Using PhotoSwipe?

If you used PhotoSwipe in some interesting way, or on site of popular brand, I'd be very grateful if you <a href='mailto:diiiimaaaa@gmail.com?subject="Site that uses PhotoSwipe"'>shoot me</a> a link to it.

## License

Script is licensed under MIT license with one exception: Do not create a public WordPress plugin based on it, as I will develop it. If you need to use it for a public WordPress plugin right now, please ask me by email first. Thanks!

Attribution is not required, but much appreciated, especially if you're making product for developers.

## About

The script was created by [Code Computerlove](http://www.codecomputerlove.com/), a digital agency in Manchester. In March 2014, it [passed](https://twitter.com/PhotoSwipe/status/444134042787930113) on development to [Dmitry Semenov](http://twitter.com/dimsemenov).
