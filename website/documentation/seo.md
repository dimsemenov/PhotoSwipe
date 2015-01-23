---

layout: default

title: SEO Friendly JavaScript Image Gallery Markup

h1_title: Image Gallery SEO

description: Ideal HTML markup for JavaScript image gallery (lightbox type).

addjs: true

canonical_url: http://photoswipe.com/documentation/seo.html

buildtool: true

markdownpage: true

---

PhotoSwipe does not force any HTML markup, you have full control. Simplest markup is a list of thumbnails that link to large image, simplest example:

```html
<a href="large-image.jpg">
    <img src="small-image.jpg" alt="Image description" />
</a>
...
```

If you have long caption that doesn't fit in `alt` or it just contains HTML tags, you may use `<figure>` and `<figcaption>`:

```html
<figure>
	<a href="large-image.jpg">
	    <img src="small-image.jpg" alt="Image description" />
	</a>
	<figcaption>Long image description</figcaption>
</figure>
...
```

You can go further and use [Schema.org markup for ImageGallery](http://schema.org/ImageGallery) and [ImageObject](http://schema.org/ImageObject), it should look like this:

```html
<div itemscope itemtype="http://schema.org/ImageGallery">

	<figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
		<a href="large-image.jpg" itemprop="contentUrl">
		    <img src="small-image.jpg" itemprop="thumbnail" alt="Image description" />
		</a>

		<!-- optionally use this method to store image dimensions for PhotoSwipe -->
		<meta itemprop="width" content="300">
		<meta itemprop="height" content="600">

		<figcaption itemprop="caption description">
			Long image description

			<!-- optionally define copyright -->
			<span itemprop="copyrightHolder">Photo: AP</span>
		</figcaption>
	</figure>

	<figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
		<a href="large-image.jpg" itemprop="contentUrl">
		    <img src="small-image.jpg" itemprop="thumbnail" alt="Image description" />
		</a>
		<figcaption itemprop="caption description">Long image description</figcaption>
	</figure>

	...x

</div>
```

If you don't want thumbnails to be visible on page, e.g. you have 50 images in gallery and you show just first 3 thumbnails + link "view all images (50)", you definitely should use [Schema.org markup](http://schema.org/ImageGallery) and you should have all 50 links (with text in contents of link element instead of thumbnail) in DOM (you may hide them with `display:none`). Example:

```html
<div itemscope itemtype="http://schema.org/ImageGallery">

	<figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
		<a href="large-image-1.jpg" itemprop="contentUrl">
		    <figcaption itemprop="caption description">Long image description 1</figcaption>
		</a>
	</figure>

	<figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
		<a href="large-image-2.jpg" itemprop="contentUrl">
		    <figcaption itemprop="caption description">Long image description 2</figcaption>
		</a>
	</figure>

	...

</div>
```

In all above cases, `large-image.jpg` will be perfectly indexed. The caption element will be crawled even if you hide it with `display:none`, just keep the text relevant, non-spammy &ndash; don't stuff it with keywords.



### Additional recommendations


- Keep `alt` attribute short and descriptive. Leave long description for caption element.
- Feel free to use `srcset` or `<picture>` for thumbnails.
- Twitter has a ["Gallery Card"](https://dev.twitter.com/cards/types/gallery), which allows you to display up to 4 images of gallery when page is shared via Twitter. 
- [Google image publishing guidelines](https://support.google.com/webmasters/answer/114016).
- Use [Google](https://developers.google.com/webmasters/structured-data/testing-tool/) or [Yandex](https://webmaster.yandex.com/microtest.xml) structured data testing tool to validate your Schema.org markup. 
- Optimize images size and format:  
	- [Good guide by Ilya Grigorik](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization).
	- Tools: for Mac there is [ImageOptim](https://imageoptim.com/), for Windows &ndash; [FileOptimizer](http://nikkhokkho.sourceforge.net/static.php?page=FileOptimizer) or [JPEGmini](http://www.jpegmini.com/windows) (limited lite version). Also there are a bunch of server-side/command-line tools like [ImageMagick](http://www.imagemagick.org/) or [jpegtran](http://jpegclub.org/jpegtran/).
	- If you serve different images for high-DPI screens, reduce their JPEG quality to 20-40% to save file size, [good article about this](http://www.netvlies.nl/blog/design-interactie/retina-revolution). 
- Even though search engines index direct link to the image file quite well, having a separate HTML page for each image (with descriptive title, description and comments) is better.
- You don't need to create image sitemap if you have links to images or/and valid Schema.org markup, but it can help you [track how well they are indexed](http://webmasters.stackexchange.com/a/5151).



Know how this page can be improved? [Please suggest an edit!](https://github.com/dimsemenov/PhotoSwipe/blob/master/website/documentation/seo.md)






