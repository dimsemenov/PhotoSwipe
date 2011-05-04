// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, Util, SliderItemClass){

	/*
	 * Class: Code.PhotoSwipe.SliderClass
	 */
	Code.PhotoSwipe.SliderClass = Code.PhotoSwipe.ElementClass.extend({
		
		parentEl: null,
		parentElWidth: null,
		parentElHeight: null,
		items: null,
		scaleEl: null,
		
		lastScaleValue: null,
		
		previousItem: null,
		currentItem: null,
		nextItem: null,
		
		hasBounced: null,
		lastShowAction: null,
		bounceSlideBy: null,
		
		showNextEndEventHandler: null,
		showPreviousEndEventHandler: null,
		bounceStepOneEventHandler: null,
		bounceStepTwoEventHandler: null,
		
		sliderFullSizeImageLoadAnomalyEventHandler: null,
		
		
		/*
		 * Function: init
		 */
		init: function(options, parentEl){
			
			this.settings = {
				slideSpeed: 250
			};
			
			Util.extend(this.settings, options);
			
			this._super(this.settings);
			
			this.parentEl = parentEl;
				
			this.hasBounced = false;
			
			this.showNextEndEventHandler = this.onShowNextEnd.bind(this);
			this.showPreviousEndEventHandler = this.onShowPreviousEnd.bind(this);
			this.bounceStepOneEventHandler = this.onBounceStepOne.bind(this);
			this.bounceStepTwoEventHandler = this.onBounceStepTwo.bind(this);
			
			this.sliderFullSizeImageLoadAnomalyEventHandler = this.onSliderFullSizeImageLoadAnomaly.bind(this);
				
			// Create element and append to body
			this.el = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.SliderClass.CssClasses.slider }, '');
			Util.DOM.setStyle(this.el, {
				position: 'absolute',
				top: 0
			});
			Util.DOM.hide(this.el);
			Util.DOM.appendChild(this.el, parentEl);
			
			// Create previousItem, currentItem, nextItem
			this.items = [];
			this.items.push(new SliderItemClass(this.el));
			this.items.push(new SliderItemClass(this.el));
			this.items.push(new SliderItemClass(this.el));
			
			this.previousItem = this.items[0];
			this.currentItem = this.items[1];
			this.nextItem = this.items[2];
			
		},
		
		
		/*
		 * Function: addEventListeners
		 */
		addEventListeners: function(){
			
			for (var i = 0; i<this.items.length; i++){
				
				var item = this.items[i];
				
				item.addEventListener(
					SliderItemClass.EventTypes.onFullSizeImageLoadAnomaly,
					this.sliderFullSizeImageLoadAnomalyEventHandler
				);
				
			}
			
		},
		
		
		/*
		 * Function: removeEventListeners
		 */
		removeEventListeners: function(){
			
			for (var i = 0; i<this.items.length; i++){
				
				var item = this.items[i];
				
				item.removeEventListener(
					SliderItemClass.EventTypes.onFullSizeImageLoadAnomaly,
					this.sliderFullSizeImageLoadAnomalyEventHandler
				);
			
			}
			
		},
		

		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			Util.DOM.show(this.currentItem.imageContainerEl);
			
			this.parentElWidth = Util.DOM.width(this.parentEl);
			this.parentElHeight = Util.DOM.height(this.parentEl);
			
			// Set the width and height to the parentEl it is bound to
			Util.DOM.width(this.el, this.parentElWidth * 3);
			Util.DOM.height(this.el, this.parentElHeight);
			
			// Re-position items
			this.previousItem.resetPosition(this.parentElWidth, this.parentElHeight, 0);
			this.currentItem.resetPosition(this.parentElWidth, this.parentElHeight, this.parentElWidth);
			this.nextItem.resetPosition(this.parentElWidth, this.parentElHeight, this.parentElWidth * 2);
			
			// Center the slider in the parentEl
			this.center();
			
		},
		
		
		
		/*
		 * Function: center
		 */
		center: function(){
			
			Util.DOM.resetTranslate(this.el);
			
			Util.DOM.setStyle(this.el, {
				left: (this.parentElWidth * -1) + 'px'
			});
			
		},
		
		
		
		/*
		 * Function: setCurrentFullSizeImage
		 */
		setCurrentFullSizeImage: function (currentFullSizeImage) {
			
			this.currentItem.setFullSizeImage(currentFullSizeImage);
			
			this.dispatchDisplayCurrentFullSizeImage();
			
		},
		
		
		/*
		 * Function: setPreviousAndNextFullSizeImages
		 */
		setPreviousAndNextFullSizeImages: function (previousFullSizeImage, nextFullSizeImage) {
			
			this.nextItem.setFullSizeImage(nextFullSizeImage);
			this.previousItem.setFullSizeImage(previousFullSizeImage);
			
		},
		
		
		/*
		 * Function: showNext
		 */
		showNext: function(){
						
			this.lastShowAction = Code.PhotoSwipe.SliderClass.ShowActionTypes.next;
			this.hasBounced = false;
			
			if (Util.isNothing(this.nextItem.fullSizeImage)) {
				// Do a bounce effect
				this.bounce();	
				return;
			}
			
			var slideBy = this.parentElWidth * -1;
			
			Util.Animation.slideBy(this.el, slideBy, 0, this.settings.slideSpeed, this.showNextEndEventHandler);
		
		},
		
		
		/*
		 * Function: 
		 */
		showPrevious: function(){
			
			this.lastShowAction = Code.PhotoSwipe.SliderClass.ShowActionTypes.previous;
			this.hasBounced = false;
			
			if (Util.isNothing(this.previousItem.fullSizeImage)) {
				// Do a bounce effect
				this.bounce();	
				return;
			}
			
			var slideBy = this.parentElWidth;
			
			Util.Animation.slideBy(this.el, slideBy, 0, this.settings.slideSpeed, this.showPreviousEndEventHandler);
		
		},
		
		
		/*
		 * Function: bounce
		 */
		bounce: function () {
			
			Util.DOM.show(this.currentItem.imageContainerEl);
			
			this.hasBounced = true;
			
			this.bounceSlideBy = this.parentElWidth / 2;
			
			Util.Animation.slideBy(
				this.el, 
				(this.lastShowAction === Code.PhotoSwipe.SliderClass.ShowActionTypes.previous) ? this.bounceSlideBy : this.bounceSlideBy * -1, 
				0, 
				this.settings.slideSpeed, 
				this.bounceStepOneEventHandler
			);
			
		},
		
		
		/*
		 * Function: onBounceStepOne
		 */
		onBounceStepOne: function(e){
		
			Util.Animation.slideBy(
				this.el, 
				(this.lastShowAction === Code.PhotoSwipe.SliderClass.ShowActionTypes.previous) ? this.bounceSlideBy * -1 : this.bounceSlideBy, 
				0, 
				this.settings.slideSpeed, 
				this.bounceStepTwoEventHandler
			);
			
		},
		
		
		/*
		 * Function: onBounceStepTwo
		 */
		onBounceStepTwo: function(e){
			
			this.dispatchDisplayCurrentFullSizeImage();
			
		},
		
		
		
		/*
		 * Function: onShowNextEnd
		 */
		onShowNextEnd: function(){
			
			Util.DOM.show(this.currentItem.imageContainerEl);
						
			// Swap the next and current around, then re-center the slider
			Util.swapArrayElements(this.items, 1, 2);
			
			this.currentItem = this.items[1];
			this.nextItem = this.items[2];
			
			var parentElWidth = this.parentElWidth;
			Util.DOM.setStyle(this.currentItem.el, 'left', parentElWidth + 'px');
			Util.DOM.setStyle(this.nextItem.el, 'left', (parentElWidth*2) + 'px');
			
			this.center();
			
			this.dispatchDisplayCurrentFullSizeImage();
			
		},
		
		
		/*
		 * Function: onShowPreviousEnd
		 */
		onShowPreviousEnd: function(){
			
			Util.DOM.show(this.currentItem.imageContainerEl);
			
			// Swap the previous and current around, then re-center the slider
			Util.swapArrayElements(this.items, 1, 0);
			
			this.currentItem = this.items[1];
			this.previousItem = this.items[0];
			
			Util.DOM.setStyle(this.currentItem.el, 'left', this.parentElWidth + 'px');
			Util.DOM.setStyle(this.previousItem.el, 'left', '0px');
			
			this.center();
			
			this.dispatchDisplayCurrentFullSizeImage();
			
		},
		
		
		
		/*
		 * Function: onSliderFullSizeImageLoadAnomaly
		 * This is fired when a slider item has loaded an
		 * image, but the image loaded is not what it currently
		 * should be displaying
		 */
		onSliderFullSizeImageLoadAnomaly: function(e){
			
			var fullSizeImage = e.fullSizeImage;
			
			if (!Util.isNothing(this.currentItem.fullSizeImage)) {
				if (this.currentItem.fullSizeImage.index === fullSizeImage.index) {
					this.currentItem.setFullSizeImage(fullSizeImage);
					this.dispatchDisplayCurrentFullSizeImage();
					return;
				}
			}
			
			if (!Util.isNothing(this.nextItem.fullSizeImage)) {
				if (this.nextItem.fullSizeImage.index === fullSizeImage.index) {
					this.nextItem.setFullSizeImage(fullSizeImage);
					return;
				}
			}
			
			if (!Util.isNothing(this.previousItem.fullSizeImage)) {
				if (this.previousItem.fullSizeImage.index === fullSizeImage.index) {
					this.previousItem.setFullSizeImage(fullSizeImage);
					return;
				}
			}
		
		},
		
		
		/*
		 * Function: dispatchDisplayCurrentFullSizeImage
		 */
		dispatchDisplayCurrentFullSizeImage: function(){
			
			this.dispatchEvent({ 
				type: Code.PhotoSwipe.SliderClass.EventTypes.onDisplayCurrentFullSizeImage, 
				target: this, 
				fullSizeImage: this.currentItem.fullSizeImage 
			});
			
		}
		
	
	});

	Code.PhotoSwipe.SliderClass.CssClasses = {
		slider: 'ps-slider'
	};
	
	Code.PhotoSwipe.SliderClass.ShowActionTypes = {
		
		next: 'next',
		previous: 'previous'
	
	};
	
	Code.PhotoSwipe.SliderClass.EventTypes = {
		
		onDisplayCurrentFullSizeImage: 'onDisplayCurrentFullSizeImage'
	
	};
	
	
})
(
	window,
	Code.PhotoSwipe.Util, 
	Code.PhotoSwipe.SliderItemClass
);
