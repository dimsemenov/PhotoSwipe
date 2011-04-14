// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(Util, FullSizeImageClass){

	/*
	 * Class: Code.PhotoSwipe.SliderItemClass
	 */
	Code.PhotoSwipe.SliderItemClass = Code.PhotoSwipe.EventClass.extend({
		
		el: null,
		imageEl: null,
		parentEl: null,
		fullSizeImage: null,
		
		fullSizeImageLoadEventHandler: null,
		
		/*
		 * Function: init
		 */
		init: function(parentEl){
			
			this._super();
			
			this.parentEl = parentEl;	
			
			this.fullSizeImageLoadEventHandler = this.onFullSizeImageLoad.bind(this);
			
			// Create element and append to parentEl
			this.el = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.SliderItemClass.CssClasses.item + ' ' + Code.PhotoSwipe.SliderItemClass.CssClasses.loading }, '');
			Util.DOM.setStyle(this.el, {
				position: 'absolute',
				overflow: 'hidden',
				top: 0
			});
			Util.DOM.resetTranslate(this.el);
			Util.DOM.appendChild(this.el, this.parentEl);
			
			// Create image element and append to slider item
			this.imageEl = new Image();
			Util.DOM.setStyle(this.imageEl, {
				display: 'block',
				position: 'absolute',
				margin: 0,
				padding: 0
			});
			Util.DOM.hide(this.imageEl);
			Util.DOM.appendChild(this.imageEl, this.el);
			
		},
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(width, height, xPos){
			
			Util.DOM.width(this.el, width);
			Util.DOM.height(this.el, height);
			Util.DOM.setStyle(this.el, 'left', xPos + 'px');
			
			this.resetImagePosition();
			
		},
		
		
		
		/*
		 * Function: resetImagePosition
		 */
		resetImagePosition: function(){
			
			if (Util.isNothing(this.fullSizeImage)){
				return;
			}
			
			var src = Util.DOM.getAttribute(this.imageEl, 'src');
			
			var 
				scale, 
				newWidth, 
				newHeight, 
				newTop, 
				newLeft,
				maxWidth = Util.DOM.width(this.el),
				maxHeight = Util.DOM.height(this.el);
			
			if (this.fullSizeImage.isLandscape) {
				// Ensure the width fits the screen
				scale = maxWidth / this.fullSizeImage.naturalWidth;
			}
			else {
				// Ensure the height fits the screen
				scale = maxHeight / this.fullSizeImage.naturalHeight;
			}
			
			newWidth = Math.round(this.fullSizeImage.naturalWidth * scale);
			newHeight = Math.round(this.fullSizeImage.naturalHeight * scale);
			
			if (this.fullSizeImage.scaleMethod === 'zoom'){
				
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
			else if (this.fullSizeImage.scaleMethod === 'fit') {
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
			
			newTop = ((maxHeight - newHeight) / 2) + 'px';
			newLeft = ((maxWidth - newWidth) / 2) + 'px';
			
			Util.DOM.width(this.imageEl, newWidth);
			Util.DOM.height(this.imageEl, newHeight);
			Util.DOM.setStyle(this.imageEl, {
				top: newTop,
				left: newLeft
			});
			
			Util.DOM.show(this.imageEl);
			
		},
		
		
		
		/*
		 * Function: setFullSizeImage
		 */
		setFullSizeImage: function(fullSizeImage){
			
			this.fullSizeImage = fullSizeImage;
			
			Util.DOM.removeClass(this.el, Code.PhotoSwipe.SliderItemClass.CssClasses.loading);
			Util.DOM.removeClass(this.el, Code.PhotoSwipe.SliderItemClass.CssClasses.imageError);
			
			// Something is wrong!
			if (Util.isNothing(this.fullSizeImage)) {
				this.fullSizeImage = null;
				Util.DOM.addClass(this.el, Code.PhotoSwipe.SliderItemClass.CssClasses.imageError);
				this.hideImage();
				return;
			}
						
			// Still loading
			if (!this.fullSizeImage.hasLoaded) {
				
				Util.DOM.addClass(this.el, Code.PhotoSwipe.SliderItemClass.CssClasses.loading);
				this.hideImage();
				
				if (!this.fullSizeImage.isLoading){
				
					// Trigger off the load
					this.fullSizeImage.addEventListener(
						FullSizeImageClass.EventTypes.onLoad, 
						this.fullSizeImageLoadEventHandler
					);
				
				
					this.fullSizeImage.load();
					
				}
				
				return;
			
			}
			
			// Loaded so show the image
			Util.DOM.setAttribute(this.imageEl, 'src', this.fullSizeImage.src);
			
			this.resetImagePosition();
	
			this.dispatchEvent(Code.PhotoSwipe.SliderItemClass.EventTypes.onFullSizeImageDisplay);
			
		},
		
		
		/*
		 * Function: onFullSizeImageLoad
		 */
		onFullSizeImageLoad: function(e){
			
			e.target.removeEventListener(FullSizeImageClass.EventTypes.onLoad, this.fullSizeImageLoadEventHandler);
			
			if (Util.isNothing(this.fullSizeImage) || e.target.index !== this.fullSizeImage.index){
				// Chances are the user has moved the slider
				// and the image to display in the item has now changed
				// from when the item originally called the fullSizeImage
				// to load. If that's the case, rethrow the event, the 
				// slider will be listening for this and can find a
				// relevant slideitem for the loaded image
				this.dispatchEvent({ 
					type: Code.PhotoSwipe.SliderItemClass.EventTypes.onFullSizeImageLoadAnomaly, 
					target: this, 
					fullSizeImage: e.target 
				});
			}
			else{
				this.setFullSizeImage(e.target);
			}
			
		},
		
		
		/*
		 * Function: hideImage
		 */
		hideImage: function(){
			
			Util.DOM.removeAttribute(this.imageEl, 'src');
			Util.DOM.hide(this.imageEl);
			
		}
	
	
	});

	
	Code.PhotoSwipe.SliderItemClass.CssClasses = {
		item: 'ps-slider-item',
		loading: 'ps-slider-item-loading',
		imageError: 'ps-slider-item-image-error'
	};

	
	Code.PhotoSwipe.SliderItemClass.EventTypes = {
		onFullSizeImageDisplay: 'onFullSizeImageDisplay',
		onFullSizeImageLoadAnomaly: 'onFullSizeImageLoadAnomaly'
	};
	
	
})(Code.PhotoSwipe.Util, Code.PhotoSwipe.FullSizeImageClass);
