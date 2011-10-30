// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.Carousel');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	PhotoSwipe.Carousel.CarouselClass = klass({
		
		
		
		el: null,
		contentEl: null,
		settings: null,
		cache: null,
		slideByEndHandler: null,
		currentCacheIndex: null,
		isSliding: null,
		isSlideshowActive: null,
		lastSlideByAction: null,
		touchStartPoint: null,
		touchStartPosition: null,
		imageLoadHandler: null,
		imageErrorHandler: null,
		slideshowTimeout: null,
		
		
		
		/*
		 * Function: dispose
		 */
		dispose: function(){
		
			var prop, i, j;
			
			for (i=0, j=this.cache.images.length; i<j; i++){
				Util.Events.remove(this.cache.images[i], PhotoSwipe.Image.EventTypes.onLoad, this.imageLoadHandler);
				Util.Events.remove(this.cache.images[i], PhotoSwipe.Image.EventTypes.onError, this.imageErrorHandler);
			}
			
			this.stopSlideshow();
			Util.Animation.stop(this.el);
			Util.DOM.removeChild(this.el, this.el.parentNode);
			
			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}
		
		},
		
		
		
		/*
		 * Function: initialize
		 */
		initialize: function(cache, options){
			
			//this.supr(true);
			
			var i, totalItems, itemEl;
			
			this.cache = cache;
			this.settings = options;
			this.slideByEndHandler = this.onSlideByEnd.bind(this);
			this.imageLoadHandler = this.onImageLoad.bind(this);
			this.imageErrorHandler = this.onImageError.bind(this);
			this.currentCacheIndex = 0;
			this.isSliding = false;
			this.isSlideshowActive = false;
			
			// No looping if < 3 images
			if (this.cache.images.length < 3){
				this.settings.loop = false;
			}
			
			// Main container 
			this.el = Util.DOM.createElement(
				'div', 
				{ 
					'class': PhotoSwipe.Carousel.CssClasses.carousel
				}, 
				''
			);
			Util.DOM.setStyle(this.el, {
				display: 'block',
				position: 'absolute',
				left: 0,
				top: 0,
				overflow: 'hidden',
				zIndex: this.settings.zIndex
			});
			Util.DOM.hide(this.el);
			
			
			// Content
			this.contentEl = Util.DOM.createElement(
				'div', 
				{ 
					'class': PhotoSwipe.Carousel.CssClasses.content
				}, 
				''
			);
			Util.DOM.setStyle(this.contentEl, {
				display: 'block',
				position: 'absolute',
				left: 0,
				top: 0
			});
			
			Util.DOM.appendChild(this.contentEl, this.el);
			
			
			// Items
			totalItems = (cache.images.length < 3) ? cache.images.length : 3;
			
			for (i=0; i<totalItems; i++){
				
				itemEl = Util.DOM.createElement(
					'div', 
					{ 
						'class': PhotoSwipe.Carousel.CssClasses.item + 
						' ' + PhotoSwipe.Carousel.CssClasses.item + '-'+ i
					}, 
					''
				);
				Util.DOM.setAttribute(itemEl, 'style', 'float: left;');
				Util.DOM.setStyle(itemEl, {
					display: 'block',
					position: 'relative',
					left: 0,
					top: 0,
					overflow: 'hidden'
				});
				
				if (this.settings.margin > 0){
					Util.DOM.setStyle(itemEl, {
						marginRight: this.settings.margin + 'px'
					});
				}
				
				Util.DOM.appendChild(itemEl, this.contentEl);
				
			}
			
			
			if (this.settings.target === window){
				Util.DOM.appendToBody(this.el);
			}
			else{
				Util.DOM.appendChild(this.el, this.settings.target);
			}
			
		},
		
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			var width, height, top, itemWidth, itemEls, contentWidth, i, j, itemEl, imageEl;
			
			if (this.settings.target === window){
				width = Util.DOM.windowWidth();
				height = Util.DOM.windowHeight();
				top = Util.DOM.windowScrollTop()  + 'px';
			}
			else{
				width = Util.DOM.width(this.settings.target);
				height = Util.DOM.height(this.settings.target);
				top = '0px';
			}
			
			itemWidth = (this.settings.margin > 0) ? width + this.settings.margin : width;
			itemEls = Util.DOM.find('.' + PhotoSwipe.Carousel.CssClasses.item, this.contentEl);
			contentWidth = itemWidth * itemEls.length;
			
			
			// Set the height and width to fill the document
			Util.DOM.setStyle(this.el, {
				top: top,
				width: width,
				height: height
			});
			
			
			// Set the height and width of the content el
			Util.DOM.setStyle(this.contentEl, {
				width: contentWidth,
				height: height
			});
			
			
			// Set the height and width of item elements
			for (i=0, j=itemEls.length; i<j; i++){
				
				itemEl = itemEls[i];
				Util.DOM.setStyle(itemEl, {
					width: width,
					height: height
				});
				
				// If an item has an image then resize that
				imageEl = Util.DOM.find('img', itemEl)[0];
				if (!Util.isNothing(imageEl)){
					this.resetImagePosition(imageEl);
				}
				
			}
			
			this.setContentLeftPosition();
			
			
		},
		
		
		
		/*
		 * Function: resetImagePosition
		 */
		resetImagePosition: function(imageEl){
			
			if (Util.isNothing(imageEl)){
				return;
			}
			
			var 
				src = Util.DOM.getAttribute(imageEl, 'src'),
				scale, 
				newWidth, 
				newHeight, 
				newTop, 
				newLeft,
				maxWidth = Util.DOM.width(this.el),
				maxHeight = Util.DOM.height(this.el);
			
			if (this.settings.imageScaleMethod === 'fitNoUpscale'){
				
				newWidth = imageEl.naturalWidth;
				newHeight =imageEl.naturalHeight;
				
				if (newWidth > maxWidth){
					scale = maxWidth / newWidth;
					newWidth = Math.round(newWidth * scale);
					newHeight = Math.round(newHeight * scale);
				}
				
				if (newHeight > maxHeight){
					scale = maxHeight / newHeight;
					newHeight = Math.round(newHeight * scale);
					newWidth = Math.round(newWidth * scale);
				}
				
			}
			else{
				
				if (imageEl.isLandscape) {
					// Ensure the width fits the screen
					scale = maxWidth / imageEl.naturalWidth;
				}
				else {
					// Ensure the height fits the screen
					scale = maxHeight / imageEl.naturalHeight;
				}
				
				newWidth = Math.round(imageEl.naturalWidth * scale);
				newHeight = Math.round(imageEl.naturalHeight * scale);
				
				if (this.settings.imageScaleMethod === 'zoom'){
					
					scale = 1;
					if (newHeight < maxHeight){
						scale = maxHeight /newHeight;	
					}
					else if (newWidth < maxWidth){
						scale = maxWidth /newWidth;	
					}
					
					if (scale !== 1) {
						newWidth = Math.round(newWidth * scale);
						newHeight = Math.round(newHeight * scale);
					}
					
				}
				else if (this.settings.imageScaleMethod === 'fit') {
					// Rescale again to ensure full image fits into the viewport
					scale = 1;
					if (newWidth > maxWidth) {
						scale = maxWidth / newWidth;
					}
					else if (newHeight > maxHeight) {
						scale = maxHeight / newHeight;
					}
					if (scale !== 1) {
						newWidth = Math.round(newWidth * scale);
						newHeight = Math.round(newHeight * scale);
					}
				}
			
			}
			
			newTop = Math.round( ((maxHeight - newHeight) / 2) ) + 'px';
			newLeft = Math.round( ((maxWidth - newWidth) / 2) ) + 'px';
			
			Util.DOM.setStyle(imageEl, {
				position: 'absolute',
				width: newWidth,
				height: newHeight,
				top: newTop,
				left: newLeft,
				display: 'block'
			});
		
		},
		
		
		
		/*
		 * Function: setContentLeftPosition
		 */
		setContentLeftPosition: function(){
		
			var width, itemEls, left;
			if (this.settings.target === window){
				width = Util.DOM.windowWidth();
			}
			else{
				width = Util.DOM.width(this.settings.target);
			}
			
			itemEls = this.getItemEls();
			left = 0;
				
			if (this.settings.loop){
				left = (width + this.settings.margin) * -1;
			}
			else{
				
				if (this.currentCacheIndex === this.cache.images.length-1){
					left = ((itemEls.length-1) * (width + this.settings.margin)) * -1;
				}
				else if (this.currentCacheIndex > 0){
					left = (width + this.settings.margin) * -1;
				}
				
			}
			
			Util.DOM.setStyle(this.contentEl, {
				left: left + 'px'
			});
			
		},
		
		
		
		/*
		 * Function: 
		 */
		show: function(index){
			
			this.currentCacheIndex = index;
			this.resetPosition();
			this.setImages(false);
			Util.DOM.show(this.el);
			
			Util.Animation.resetTranslate(this.contentEl);
			var 
				itemEls = this.getItemEls(),
				i, j;
			for (i=0, j=itemEls.length; i<j; i++){
				Util.Animation.resetTranslate(itemEls[i]);
			}
			
			Util.Events.fire(this, {
				type: PhotoSwipe.Carousel.EventTypes.onSlideByEnd,
				target: this,
				action: PhotoSwipe.Carousel.SlideByAction.current,
				cacheIndex: this.currentCacheIndex
			});
			
		},
		
		
		
		/*
		 * Function: setImages
		 */
		setImages: function(ignoreCurrent){
			
			var 
				cacheImages,
				itemEls = this.getItemEls(),
				nextCacheIndex = this.currentCacheIndex + 1,
				previousCacheIndex = this.currentCacheIndex - 1;
			
			if (this.settings.loop){
				
				if (nextCacheIndex > this.cache.images.length-1){
					nextCacheIndex = 0;
				}
				if (previousCacheIndex < 0){
					previousCacheIndex = this.cache.images.length-1;
				}
				
				cacheImages = this.cache.getImages([
					previousCacheIndex,
					this.currentCacheIndex,
					nextCacheIndex
				]);
				
				if (!ignoreCurrent){
					// Current
					this.addCacheImageToItemEl(cacheImages[1], itemEls[1]);
				}
				// Next
				this.addCacheImageToItemEl(cacheImages[2], itemEls[2]);
				// Previous
				this.addCacheImageToItemEl(cacheImages[0], itemEls[0]);
				
			}
			else{
			
				if (itemEls.length === 1){
					if (!ignoreCurrent){
						// Current
						cacheImages = this.cache.getImages([
							this.currentCacheIndex
						]);
						this.addCacheImageToItemEl(cacheImages[0], itemEls[0]);
					}
				}
				else if (itemEls.length === 2){
					
					if (this.currentCacheIndex === 0){
						cacheImages = this.cache.getImages([
							this.currentCacheIndex,
							this.currentCacheIndex + 1
						]);
						if (!ignoreCurrent){
							this.addCacheImageToItemEl(cacheImages[0], itemEls[0]);
						}
						this.addCacheImageToItemEl(cacheImages[1], itemEls[1]);
					}
					else{
						cacheImages = this.cache.getImages([
							this.currentCacheIndex - 1,
							this.currentCacheIndex
						]);
						if (!ignoreCurrent){
							this.addCacheImageToItemEl(cacheImages[1], itemEls[1]);
						}
						this.addCacheImageToItemEl(cacheImages[0], itemEls[0]);
					}
					
				}
				else{
					
					if (this.currentCacheIndex === 0){
						cacheImages = this.cache.getImages([
							this.currentCacheIndex,
							this.currentCacheIndex + 1,
							this.currentCacheIndex + 2
						]);
						if (!ignoreCurrent){
							this.addCacheImageToItemEl(cacheImages[0], itemEls[0]);
						}
						this.addCacheImageToItemEl(cacheImages[1], itemEls[1]);
						this.addCacheImageToItemEl(cacheImages[2], itemEls[2]);
					}
					else if (this.currentCacheIndex === this.cache.images.length-1){
						cacheImages = this.cache.getImages([
							this.currentCacheIndex - 2,
							this.currentCacheIndex - 1,
							this.currentCacheIndex
						]);
						if (!ignoreCurrent){
							// Current
							this.addCacheImageToItemEl(cacheImages[2], itemEls[2]);
						}
						this.addCacheImageToItemEl(cacheImages[1], itemEls[1]);
						this.addCacheImageToItemEl(cacheImages[0], itemEls[0]);
					}
					else{
						cacheImages = this.cache.getImages([
							this.currentCacheIndex - 1,
							this.currentCacheIndex,
							this.currentCacheIndex + 1
						]);
						
						if (!ignoreCurrent){
							// Current
							this.addCacheImageToItemEl(cacheImages[1], itemEls[1]);
						}
						// Next
						this.addCacheImageToItemEl(cacheImages[2], itemEls[2]);
						// Previous
						this.addCacheImageToItemEl(cacheImages[0], itemEls[0]);
					}
					
				}
			
			}
		
		},
		
		
		
		/*
		 * Function: addCacheImageToItemEl
		 */
		addCacheImageToItemEl: function(cacheImage, itemEl){
			
			Util.DOM.removeClass(itemEl, PhotoSwipe.Carousel.CssClasses.itemError);
			Util.DOM.addClass(itemEl, PhotoSwipe.Carousel.CssClasses.itemLoading);
			
			Util.DOM.removeChildren(itemEl);
			
			Util.DOM.setStyle(cacheImage.imageEl, {
				display: 'none'
			});
			Util.DOM.appendChild(cacheImage.imageEl, itemEl);
			
			Util.Animation.resetTranslate(cacheImage.imageEl);
			
			Util.Events.add(cacheImage, PhotoSwipe.Image.EventTypes.onLoad, this.imageLoadHandler);
			Util.Events.add(cacheImage, PhotoSwipe.Image.EventTypes.onError, this.imageErrorHandler);
			
			cacheImage.load();
			
		},
		
		
		
		/*
		 * Function: slideCarousel
		 */
		slideCarousel: function(point, action, speed){
			
			if (this.isSliding){
				return;
			}
			
			var width, diffX, slideBy;
			
			if (this.settings.target === window){
				width = Util.DOM.windowWidth() + this.settings.margin;
			}
			else{
				width = Util.DOM.width(this.settings.target) + this.settings.margin;
			}
			
			speed = Util.coalesce(speed, this.settings.slideSpeed);
			
			if (window.Math.abs(diffX) < 1){
				return;
			}
			
			
			switch (action){
				
				case Util.TouchElement.ActionTypes.swipeLeft:
					
					slideBy = width * -1;
					break;
					
				case Util.TouchElement.ActionTypes.swipeRight:
				
					slideBy = width;
					break;
				
				default:
					
					diffX = point.x - this.touchStartPoint.x;
					
					if (window.Math.abs(diffX) > width / 2){
						slideBy = (diffX > 0) ? width : width * -1;
					}
					else{
						slideBy = 0;
					}
					break;
			
			}
			
			if (slideBy < 0){
				this.lastSlideByAction = PhotoSwipe.Carousel.SlideByAction.next;
			}
			else if (slideBy > 0){
				this.lastSlideByAction = PhotoSwipe.Carousel.SlideByAction.previous;
			}
			else{
				this.lastSlideByAction = PhotoSwipe.Carousel.SlideByAction.current;
			}
			
			// Check for non-looping carousels
			// If we are at the start or end, spring back to the current item element
			if (!this.settings.loop){
				if ( (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.previous && this.currentCacheIndex === 0 ) || (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.next && this.currentCacheIndex === this.cache.images.length-1) ){
					slideBy = 0;
					this.lastSlideByAction = PhotoSwipe.Carousel.SlideByAction.current;
				}
			}
			
			this.isSliding = true;
			this.doSlideCarousel(slideBy, speed);
			
		},
		
		
		
		/*
		 * Function: 
		 */
		moveCarousel: function(point){
			
			if (this.isSliding){
				return;
			}
			
			if (!this.settings.enableDrag){
				return;
			}
			
			this.doMoveCarousel(point.x - this.touchStartPoint.x);
			
		},
		
		
		
		/*
		 * Function: getItemEls
		 */
		getItemEls: function(){
		
			return Util.DOM.find('.' + PhotoSwipe.Carousel.CssClasses.item, this.contentEl);
		
		},
		
		
		
		/*
		 * Function: previous
		 */
		previous: function(){
			
			this.stopSlideshow();
			this.slideCarousel({x:0, y:0}, Util.TouchElement.ActionTypes.swipeRight, this.settings.nextPreviousSlideSpeed);
		
		},
		
		
		
		/*
		 * Function: next
		 */
		next: function(){
			
			this.stopSlideshow();
			this.slideCarousel({x:0, y:0}, Util.TouchElement.ActionTypes.swipeLeft, this.settings.nextPreviousSlideSpeed);
		
		},
		
		
		
		/*
		 * Function: slideshowNext
		 */
		slideshowNext: function(){
		
			this.slideCarousel({x:0, y:0}, Util.TouchElement.ActionTypes.swipeLeft);
		
		},
		
		
		
		
		/*
		 * Function: startSlideshow
		 */
		startSlideshow: function(){
			
			this.stopSlideshow();
			
			this.isSlideshowActive = true;
			
			this.slideshowTimeout = window.setTimeout(this.slideshowNext.bind(this), this.settings.slideshowDelay);
			
			Util.Events.fire(this, {
				type: PhotoSwipe.Carousel.EventTypes.onSlideshowStart,
				target: this
			});
			
		},
		
		
		
		/*
		 * Function: stopSlideshow
		 */
		stopSlideshow: function(){
			
			if (!Util.isNothing(this.slideshowTimeout)){
			
				window.clearTimeout(this.slideshowTimeout);
				this.slideshowTimeout = null;
				this.isSlideshowActive = false;
				
				Util.Events.fire(this, {
					type: PhotoSwipe.Carousel.EventTypes.onSlideshowStop,
					target: this
				});
			
			}
			
		},
		
		
		
		/*
		 * Function: onSlideByEnd
		 */
		onSlideByEnd: function(e){
			
			if (Util.isNothing(this.isSliding)){
				return;
			}
			
			var itemEls = this.getItemEls();
			
			this.isSliding = false;
			
			if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.next){
				this.currentCacheIndex = this.currentCacheIndex + 1;
			}
			else if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.previous){
				this.currentCacheIndex = this.currentCacheIndex - 1;
			}
			
			if (this.settings.loop){
				
				if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.next){
					// Move first to the last
					Util.DOM.appendChild(itemEls[0], this.contentEl);
				}
				else if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.previous){
					// Move the last to the first
					Util.DOM.insertBefore(itemEls[itemEls.length-1], itemEls[0], this.contentEl);
				}
				
				if (this.currentCacheIndex < 0){
					this.currentCacheIndex = this.cache.images.length - 1;
				}
				else if (this.currentCacheIndex === this.cache.images.length){
					this.currentCacheIndex = 0;
				}
				
			}
			else{
				
				if (this.cache.images.length > 3){
					
					if (this.currentCacheIndex > 1 && this.currentCacheIndex < this.cache.images.length-2){
						if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.next){
							// Move first to the last
							Util.DOM.appendChild(itemEls[0], this.contentEl);
						}
						else if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.previous){
							// Move the last to the first
							Util.DOM.insertBefore(itemEls[itemEls.length-1], itemEls[0], this.contentEl);
						}
					}
					else if (this.currentCacheIndex === 1){
						if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.previous){
							// Move the last to the first
							Util.DOM.insertBefore(itemEls[itemEls.length-1], itemEls[0], this.contentEl);
						}
					}
					else if (this.currentCacheIndex === this.cache.images.length-2){
						if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.next){
							// Move first to the last
							Util.DOM.appendChild(itemEls[0], this.contentEl);
						}
					}
				
				}
				
				
			}
			
			if (this.lastSlideByAction !== PhotoSwipe.Carousel.SlideByAction.current){
				this.setContentLeftPosition();
				this.setImages(true);
			}
			
			
			Util.Events.fire(this, {
				type: PhotoSwipe.Carousel.EventTypes.onSlideByEnd,
				target: this,
				action: this.lastSlideByAction,
				cacheIndex: this.currentCacheIndex
			});
			
			
			if (this.isSlideshowActive){
				
				if (this.lastSlideByAction !== PhotoSwipe.Carousel.SlideByAction.current){
					this.startSlideshow();
				}
				else{
					this.stopSlideshow();
				}
			
			}
			
			
		},
		
		
		
		/*
		 * Function: onTouch
		 */
		onTouch: function(action, point){
			
			this.stopSlideshow();
			
			switch(action){
				
				case Util.TouchElement.ActionTypes.touchStart:
					this.touchStartPoint = point;
					this.touchStartPosition = {
						x: window.parseInt(Util.DOM.getStyle(this.contentEl, 'left'), 0),
						y: window.parseInt(Util.DOM.getStyle(this.contentEl, 'top'), 0)
					};
					break;
				
				case Util.TouchElement.ActionTypes.touchMove:
					this.moveCarousel(point);
					break;
					
				case Util.TouchElement.ActionTypes.touchMoveEnd:
				case Util.TouchElement.ActionTypes.swipeLeft:
				case Util.TouchElement.ActionTypes.swipeRight:
					this.slideCarousel(point, action);
					break;
					
				case Util.TouchElement.ActionTypes.tap:
					break;
					
				case Util.TouchElement.ActionTypes.doubleTap:
					break;
				
				
			}
			
		},
		
		
		
		/*
		 * Function: onImageLoad
		 */
		onImageLoad: function(e){
			
			var cacheImage = e.target;
			
			if (!Util.isNothing(cacheImage.imageEl.parentNode)){
				Util.DOM.removeClass(cacheImage.imageEl.parentNode, PhotoSwipe.Carousel.CssClasses.itemLoading);
				this.resetImagePosition(cacheImage.imageEl);
			}
			
			Util.Events.remove(cacheImage, PhotoSwipe.Image.EventTypes.onLoad, this.imageLoadHandler);
			Util.Events.remove(cacheImage, PhotoSwipe.Image.EventTypes.onError, this.imageErrorHandler);
			
		},
		
		
		
		/*
		 * Function: onImageError
		 */
		onImageError: function(e){
			
			var cacheImage = e.target;
			
			if (!Util.isNothing(cacheImage.imageEl.parentNode)){
				Util.DOM.removeClass(cacheImage.imageEl.parentNode, PhotoSwipe.Carousel.CssClasses.itemLoading);
				Util.DOM.addClass(cacheImage.imageEl.parentNode, PhotoSwipe.Carousel.CssClasses.itemError);
			}
			
			Util.Events.remove(cacheImage, PhotoSwipe.Image.EventTypes.onLoad, this.imageLoadHandler);
			Util.Events.remove(cacheImage, PhotoSwipe.Image.EventTypes.onError, this.imageErrorHandler);
			
		}
		
		
		
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));