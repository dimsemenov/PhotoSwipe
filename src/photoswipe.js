// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, Util, ElementClass, DocumentOverlayClass, FullSizeImageClass, ViewportClass, SliderClass, CaptionClass, ToolbarClass, CaptionToolbarClass, ZoomPanRotateClass){

	var photoSwipe = SimpleClass.extend({
		
		fullSizeImages: null,
		
		documentOverlay: null,
		viewport: null,
		slider: null,
		captionAndToolbar: null,
		zoomPanRotate: null,
		
		settings: null,
		currentIndex: null,	
		isBusy: null,
		isActive: null,
		currentHistoryHashValue: null,
		isBackEventSupported: null,
		
		slideshowTimeout: null,
		isSlideshowActive: null,
		
		lastShowPrevTrigger: null,
		
		backButtonClicked: null,
		
		viewportFadeInEventHandler: null,
		windowOrientationChangeEventHandler: null,
		windowScrollEventHandler: null,
		windowHashChangeHandler: null,
		keyDownEventHandler: null,
		viewportTouchEventHandler: null,
		viewportFadeOutEventHandler: null,
		sliderDisplayCurrentFullSizeImageEventHandler: null,
		toolbarClickEventHandler: null,
		captionAndToolbarShowEventHandler: null,
		captionAndToolbarHideEventHandler: null,
		orientationEventName: null,
		
		
		/*
		 * Function: init
		 */
		init: function(){
									
			this.currentIndex = 0;
			this.isBusy = false;
			this.isActive = false;
			this.isSlideshowActive = false;
			this.backButtonClicked = false;
			
			this.settings = { 
				getImageSource: Code.PhotoSwipe.GetImageSource,
				getImageCaption: Code.PhotoSwipe.GetImageCaption,
				getImageMetaData: Code.PhotoSwipe.GetImageMetaData,
				fadeInSpeed: 250,
				fadeOutSpeed: 500,
				slideSpeed: 250,
				swipeThreshold: 50,
				swipeTimeThreshold: 250,
				loop: true,
				slideshowDelay: 3000,
				imageScaleMethod: 'fit', // Either "fit" or "zoom"
				preventHide: false,
				zIndex: 1000,
				backButtonHideEnabled: true,
				jQueryMobile: ( !Util.isNothing(window.jQuery) && !Util.isNothing(window.jQuery.mobile) ),
				jQueryMobileDialogHash: '&ui-state=dialog',
				
				
				/* 
					iOS users can use two digit gestures to zoom in and out.
					Other's can only zoom in and pan around by double tapping / clicking
				*/ 
				allowUserZoom: true, 
				allowRotationOnUserZoom: true,
				maxUserZoom: 5.0,
				minUserZoom: 0.5,
				adjustUserPanToZoom: true,
				doubleClickSpeed: 300,
				doubleClickZoom: 2.5,
				
				captionAndToolbarHide: false,
				captionAndToolbarHideOnSwipe: true,
				captionAndToolbarFlipPosition: false,
				captionAndToolbarAutoHideDelay: 5000,
				captionAndToolbarOpacity: 0.8,
				captionAndToolbarShowEmptyCaptions: true				
			};
						
			if (Util.browser.isAndroid){
				if (navigator.userAgent.indexOf('2.1')){
					this.isBackEventSupported = true;
				}
			}
			if (!this.isBackEventSupported){
				this.isBackEventSupported = 'onhashchange' in window;
			}
			
			if (this.settings.preventHide){
				this.settings.backButtonHideEnabled = false;
			}
			
			
			// Set pointers to event handlers
			this.viewportFadeInEventHandler = this.onViewportFadeIn.bind(this);
			this.windowOrientationChangeEventHandler = this.onWindowOrientationChange.bind(this);
			this.windowScrollEventHandler = this.onWindowScroll.bind(this);
			this.windowHashChangeHandler = this.onWindowHashChange.bind(this);
			this.keyDownEventHandler = this.onKeyDown.bind(this);
			this.viewportTouchEventHandler = this.onViewportTouch.bind(this);
			this.viewportFadeOutEventHandler = this.onViewportFadeOut.bind(this);
			this.sliderDisplayCurrentFullSizeImageEventHandler = this.onSliderDisplayCurrentFullSizeImage.bind(this);
			this.toolbarClickEventHandler = this.onToolbarClick.bind(this);
			this.captionAndToolbarShowEventHandler = this.onCaptionAndToolbarShow.bind(this);
			this.captionAndToolbarHideEventHandler = this.onCaptionAndToolbarHide.bind(this);
						
		},
		
		
		
		/*
		 * Function: setOptions
		 */
		setOptions: function(options){
			
			Util.extend(this.settings, options);
			
			if (this.settings.preventHide){
				this.settings.backButtonHideEnabled = false;
			}
			
		},
		
		
		
		/*
		 * Function: setImages
		 * Set images from DOM elements. Could be a list of image
		 * elments or anchors containing image elements etc.
		 * By default the gallery assumes the latter. If you change
		 * this, remember to set your own getImageSource and getImageCaption
		 * methods so the gallery knows what to look for.
		 */
		setImages: function(thumbEls){
			
			if (!Util.isArray){
				throw "thumbEls is not an array";
			}
			
			this.currentIndex = 0; 
			
			this.fullSizeImages = [];
			
			for (var i=0; i<thumbEls.length; i++){
				
				var thumbEl = thumbEls[i];
				
				// Create a new fullSizeImage object
				var fullSizeImage = new FullSizeImageClass(
					i, 
					this.settings.imageScaleMethod,
					this.settings.getImageSource(thumbEl), 
					this.settings.getImageCaption(thumbEl),
					this.settings.getImageMetaData(thumbEl)
				);
				
				// Add it to our internal array
				this.fullSizeImages.push(fullSizeImage);
				
			}
			
		},
		
		
		
		/*
		 * Function: show
		 */
		show: function(startingIndex){
			
			if (this.isBusy || this.isActive){
				return;
			}
			
			if (!Util.isNumber(startingIndex)){
				throw "startingIndex must be a number";
			}
			
			if (Util.isNothing(this.fullSizeImages)){
				throw "need to set images before showing the gallery";
			}
			
			this.backButtonClicked = false;
			this.isActive = true;
			this.isBusy = true;
						
			this.lastShowPrevTrigger = Code.PhotoSwipe.ShowPrevTriggers.show;
			
			Util.DOM.addClass(document.body, Code.PhotoSwipe.CssClasses.activeBody);
			
			
			// Check index is in acceptable bounds
			// If not, default it to the first index
			startingIndex = window.parseInt(startingIndex);
			if (startingIndex < 0 || startingIndex >= this.fullSizeImages.length){
				startingIndex = 0;
			}
			
			this.currentIndex = startingIndex;
			
			if (Util.isNothing(this.documentOverlay)){
				this.build();
			}
			else{
				this.resetPosition();
			}
			
			// Fade in the viewport overlay,
			// then show the viewport, slider and toolbar etc
			Util.Events.add(this.viewport, ElementClass.EventTypes.onFadeIn, this.viewportFadeInEventHandler);
			
			Util.Events.fire(this, {
				type: Code.PhotoSwipe.EventTypes.onBeforeShow,
				target: this
			});
			
			this.viewport.fadeIn();
			
		},
		
		
		
		/*
		 * Function: build
		 */
		build: function(){
			
			// Create the document overlay
			this.documentOverlay = new DocumentOverlayClass({ 
				fadeInSpeed: this.settings.fadeInSpeed,
				fadeOutSpeed: this.settings.fadeOutSpeed,
				zIndex: this.settings.zIndex
			});
			
			// Create the viewport
			this.viewport = new ViewportClass({ 
				fadeInSpeed: this.settings.fadeInSpeed,
				fadeOutSpeed: this.settings.fadeOutSpeed, 
				swipeThreshold: this.settings.swipeThreshold,
				swipeTimeThreshold: this.settings.swipeTimeThreshold,
				zIndex: this.settings.zIndex+1,
				doubleClickSpeed: this.settings.doubleClickSpeed
			});
			
			// Create the slider
			this.slider = new SliderClass(
				{
					fadeInSpeed: this.settings.fadeInSpeed,
					fadeOutSpeed: this.settings.fadeOutSpeed,
					slideSpeed: this.settings.slideSpeed
				}, 
				this.viewport.el
			);
				
			this.captionAndToolbar = new CaptionToolbarClass({
				
				opacity: this.settings.captionAndToolbarOpacity,
				fadeInSpeed: this.settings.fadeInSpeed,
				fadeOutSpeed: this.settings.fadeOutSpeed,
				autoHideDelay: this.settings.captionAndToolbarAutoHideDelay,
				flipPosition: this.settings.captionAndToolbarFlipPosition,
				showEmptyCaptions: this.settings.captionAndToolbarShowEmptyCaptions,
				hideClose: this.settings.preventHide,
				zIndex: this.settings.zIndex+3
			
			});
			
			this.resetPosition();
			
		},
		
		
		
		/*
		 * Function: addEventHandlers
		 */
		addEventHandlers: function(){
			
			// Set window handlers
			if (Util.browser.isAndroid){
				// For some reason, resize was more stable than orientationchange in Android
				// This fix was added in v1.0.5 - needs reviewing
				this.orientationEventName = 'resize';
			}
			else{
				var supportsOrientationChange = 'onorientationchange' in window;
				this.orientationEventName = supportsOrientationChange ? 'orientationchange' : 'resize';
			}
			
			Util.Events.add(window, this.orientationEventName, this.windowOrientationChangeEventHandler);
			
			Util.Events.add(window, 'scroll', this.windowScrollEventHandler);
					
			if (this.isBackEventSupported && this.settings.backButtonHideEnabled){
				
				if (this.settings.jQueryMobile){
					window.location.hash = this.settings.jQueryMobileDialogHash;
				}
				else{
					this.currentHistoryHashValue = 'PhotoSwipe' + new Date().getTime().toString();
					window.location.hash = this.currentHistoryHashValue;
				}
				
				Util.Events.add(window, 'hashchange', this.windowHashChangeHandler);
				
			}
			
			// Set keydown event handlers for desktop browsers
			Util.Events.add(document, 'keydown', this.keyDownEventHandler);
			
			// Set viewport handlers
			Util.Events.add(this.viewport, ViewportClass.EventTypes.onTouch, this.viewportTouchEventHandler);
			
			// Set slider handlers
			Util.Events.add(this.slider, SliderClass.EventTypes.onDisplayCurrentFullSizeImage, this.sliderDisplayCurrentFullSizeImageEventHandler);
			
			// Set captionAndToolbar handlers
			Util.Events.add(this.captionAndToolbar, ToolbarClass.EventTypes.onClick, this.toolbarClickEventHandler);
			Util.Events.add(this.captionAndToolbar, CaptionToolbarClass.EventTypes.onShow, this.captionAndToolbarShowEventHandler);
			Util.Events.add(this.captionAndToolbar, CaptionToolbarClass.EventTypes.onHide, this.captionAndToolbarHideEventHandler);
						
		},
		
		
		
		/*
		 * Function: removeEventHandlers
		 */
		removeEventHandlers: function(){
			
			// Remove window handlers
			Util.Events.remove(window, this.orientationEventName, this.windowOrientationChangeEventHandler);
			
			Util.Events.remove(window, 'scroll', this.windowScrollEventHandler);
			
			if (this.isBackEventSupported && this.settings.backButtonHideEnabled){
				Util.Events.remove(window, 'hashchange', this.windowHashChangeHandler);
			}
			
			// Remove keydown event handlers for desktop browsers
			Util.Events.remove(document, 'keydown', this.keyDownEventHandler);
			
			// Remove viewport handlers
			Util.Events.remove(this.viewport, ViewportClass.EventTypes.onTouch, this.viewportTouchEventHandler);
			
			// Remove slider handlers
			Util.Events.remove(this.slider, SliderClass.EventTypes.onDisplayCurrentFullSizeImage, this.sliderDisplayCurrentFullSizeImageEventHandler);
			
			// Remove captionAndToolbar handlers
			Util.Events.remove(this.captionAndToolbar, ToolbarClass.EventTypes.onClick, this.toolbarClickEventHandler);
			Util.Events.remove(this.captionAndToolbar, CaptionToolbarClass.EventTypes.onShow, this.captionAndToolbarShowEventHandler);
			Util.Events.remove(this.captionAndToolbar, CaptionToolbarClass.EventTypes.onHide, this.captionAndToolbarHideEventHandler);
			
		},
		
		
		
		/*
		 * Function: onViewportFadeIn
		 */
		onViewportFadeIn: function(e){
			
			// Remove the ElementClass.EventTypes.onFadeIn
			// event handler
			Util.Events.remove(this.viewport, ElementClass.EventTypes.onFadeIn, this.viewportFadeInEventHandler);
			
			this.documentOverlay.show();
			
			this.slider.fadeIn();
			
			this.addEventHandlers();
			
			this.slider.setCurrentFullSizeImage(this.fullSizeImages[this.currentIndex]);
			
			this.isBusy = false;
			
			Util.Events.fire(this, {
				type: Code.PhotoSwipe.EventTypes.onShow,
				target: this
			});
			
		},
		
		
		
		/*
		 * Function: setSliderPreviousAndNextFullSizeImages
		 */
		setSliderPreviousAndNextFullSizeImages: function(){
			
			var 
				lastIndex,
				previousFullSizeImage = null,
				nextFullSizeImage = null;
			
			if (this.fullSizeImages.length > 1) {
				
				lastIndex = this.fullSizeImages.length - 1;
				
				// Current image is the last 
				if (this.currentIndex === lastIndex) {
				
					if (this.settings.loop) {
						nextFullSizeImage = this.fullSizeImages[0];
					}
					previousFullSizeImage = this.fullSizeImages[this.currentIndex - 1];
					
				}
				
				// Current image is the first
				else if (this.currentIndex === 0) {
					
					nextFullSizeImage = this.fullSizeImages[this.currentIndex + 1];
					if (this.settings.loop) {
						previousFullSizeImage = this.fullSizeImages[lastIndex];
					}
				
				}
				
				// Current image is in the middle of the thumbs  
				else {
					
					nextFullSizeImage = this.fullSizeImages[this.currentIndex + 1];
					previousFullSizeImage = this.fullSizeImages[this.currentIndex - 1];
				
				}
				
			}
			
			this.slider.setPreviousAndNextFullSizeImages(previousFullSizeImage, nextFullSizeImage);
		
		},
		
		
		
		/*
		 * Function: onKeyDown
		 */
		onKeyDown: function(e){
			
			this.stopSlideshow();
			
			if (e.keyCode === 37) { // Left
				e.preventDefault();
				this.lastShowPrevTrigger = Code.PhotoSwipe.ShowPrevTriggers.keyboard;
				this.showPrevious();
			}
			else if (e.keyCode === 39) { // Right
				e.preventDefault();
				this.lastShowPrevTrigger = Code.PhotoSwipe.ShowPrevTriggers.keyboard;
				this.showNext();
			}
			else if (e.keyCode === 38 || e.keyCode === 40) { // Up and down
				e.preventDefault();
			}
			else if (e.keyCode === 27) { // Escape
				e.preventDefault();
				this.hide();
			}
			else if (e.keyCode === 32) { // Spacebar
				if (!this.settings.hideToolbar){
					this.toggleCaptionAndToolbar();
				}
				else{
					this.hide();
				}
				e.preventDefault();
			}
			
		},
		
		
		
		/*
		 * Function: onWindowOrientationChange
		 */
		onWindowOrientationChange: function(e){
			
			this.resetPosition();
			
		},
		
		
		
		/*
		 * Function: onWindowScroll
		 */
		onWindowScroll: function(e){
			
			this.resetPosition();
			
		},
		
		
		/*
		 * Function: onWindowHashChange
		 */
		onWindowHashChange: function(e){
			
			var compareHash = '#' + 
				((this.settings.jQueryMobile) ? this.settings.jQueryMobileDialogHash : this.currentHistoryHashValue);
			
			if (window.location.hash !== compareHash){
				this.backButtonClicked = true;
				this.hide();
			}
			
		},
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			this.removeZoomPanRotate();
			
			this.viewport.resetPosition();
			this.slider.resetPosition();
			this.documentOverlay.resetPosition();
			this.captionAndToolbar.resetPosition();
			
			Util.Events.fire(this, {
				type: Code.PhotoSwipe.EventTypes.onResetPosition,
				target: this
			});
			
		},
		
		
		
		/*
		 * Function: canUserZoom
		 */
		canUserZoom: function(){
			
			if (!Util.browser.isCSSTransformSupported){
				return false;
			}
			
			if (!this.settings.allowUserZoom){
				return false;
			}
			
			if (this.isBusy){
				return false;
			}
			
			if (Util.isNothing(this.slider.currentItem.fullSizeImage)){
				return false;
			}
			
			if (!this.slider.currentItem.fullSizeImage.hasLoaded){
				return false;
			}
			
			return true;
			
		},
		
		
		
		/*
		 * Function: isZoomActive
		 */
		isZoomActive: function(){
			
			return (!Util.isNothing(this.zoomPanRotate));
		
		},
		
		
		
		/*
		 * Function: onViewportTouch
		 */
		onViewportTouch: function(e){
						
			switch(e.action){
				
				case ViewportClass.Actions.gestureStart:
					
					this.createZoomPanRotate();
					break;
					
				case ViewportClass.Actions.gestureChange:
				
					if (this.isZoomActive()){
						this.zoomPanRotate.zoomRotate(e.scale, (this.settings.allowRotationOnUserZoom) ? e.rotation : 0);
					}
					break;
					
				case ViewportClass.Actions.gestureEnd:
				
					if (this.isZoomActive()){
						this.zoomPanRotate.setStartingScaleAndRotation(e.scale, (this.settings.allowRotationOnUserZoom) ? e.rotation : 0);
					}
					break;
					
				case ViewportClass.Actions.touchStart:
				
					this.stopSlideshow();
					if (this.isZoomActive()){
						this.zoomPanRotate.panStart(e.point);
					}
					break;
					
				case ViewportClass.Actions.touchMove:
					
					if (this.isZoomActive()){
						this.zoomPanRotate.pan(e.point);
					}
					break;
					
				case ViewportClass.Actions.click:
					
					this.stopSlideshow();
					if (!this.settings.hideToolbar){
						this.toggleCaptionAndToolbar();
					}
					else{
						this.hide();
					}
					Util.Events.fire(this, {
						type: Code.PhotoSwipe.EventTypes.onViewportClick,
						target: this
					});
					break;
				
				case ViewportClass.Actions.doubleClick:
					
					if (!this.isZoomActive()){
						
						// Take into consideration the window scroll
						e.point.x -= Util.DOM.windowScrollLeft();
						e.point.y -= Util.DOM.windowScrollTop();
						
						// Just make sure that if the user clicks out of the image
						// that the image does not pan out of view!
						var 
							imageTop = window.parseInt(Util.DOM.getStyle(this.slider.currentItem.imageEl, 'top'), 10),
							imageLeft = window.parseInt(Util.DOM.getStyle(this.slider.currentItem.imageEl, 'left'), 10),
							imageRight = imageLeft + Util.DOM.width(this.slider.currentItem.imageEl),
							imageBottom = imageTop + Util.DOM.height(this.slider.currentItem.imageEl);
						
						if (e.point.x < imageLeft){
							e.point.x = imageLeft;
						}
						else if (e.point.x > imageRight){
							e.point.x = imageRight;
						}
						
						if (e.point.y < imageTop){
							e.point.y = imageTop;
						}
						else if (e.point.y > imageBottom){
							e.point.y = imageBottom;
						}
						this.createZoomPanRotate();
						this.zoomPanRotate.zoomAndPanToPoint(this.settings.doubleClickZoom, e.point);
					}
					else{
						// This is timeout is a hack. For some reason on iOS the double click
						// to remove the ZoomPan layer was massively delayed. This fixed it!?
						var self = this;
						window.setTimeout(function(){
							self.removeZoomPanRotate();
						});
					}
					break;
				
				case ViewportClass.Actions.swipeLeft:
					
					this.stopSlideshow();
					this.lastShowPrevTrigger = Code.PhotoSwipe.ShowPrevTriggers.swipe;
					this.showNext();
					break;
					
				case ViewportClass.Actions.swipeRight:
					
					this.stopSlideshow();
					this.lastShowPrevTrigger = Code.PhotoSwipe.ShowPrevTriggers.swipe;
					this.showPrevious();
					break;
					
			}
			
		},
		
		
		
		/*
		 * Function: onViewportFadeOut
		 */
		onViewportFadeOut: function(e){
			
			Util.Events.remove(this.viewport, ElementClass.EventTypes.onFadeOut, this.viewportFadeOutEventHandler);
			
			this.isBusy = false;
			this.isActive = false;
			
			Util.Events.fire(this, {
				type: Code.PhotoSwipe.EventTypes.onHide,
				target: this
			});
			
			this.goBackInHistory();
			
		},
		
		
		
		/*
		 * Function: hide
		 */
		hide: function(){
			
			if (this.isBusy || this.settings.preventHide){
				return;
			}
			
			if (!this.isActive){
				return;
			}
			
			this.isBusy = true;
			
			this.removeZoomPanRotate();
			
			this.removeEventHandlers();
			
			this.documentOverlay.hide();
			this.captionAndToolbar.hide();
			this.slider.hide();
			
			Util.DOM.removeClass(document.body, Code.PhotoSwipe.CssClasses.activeBody);
			
			Util.Events.add(this.viewport, ElementClass.EventTypes.onFadeOut, this.viewportFadeOutEventHandler);
			
			Util.Events.fire(this, {
				type: Code.PhotoSwipe.EventTypes.onBeforeHide,
				target: this
			});
			
			this.viewport.fadeOut();
			
		},
		
		
		/*
		 * Function: hideImmediately
		 */
		hideImmediately: function(){
			
			if (!this.isActive){
				return;
			}
			
			Util.Events.fire(this, {
				type: Code.PhotoSwipe.EventTypes.onBeforeHide,
				target: this
			});
			
			this.removeZoomPanRotate();
			this.removeEventHandlers();
			this.documentOverlay.hide();
			this.captionAndToolbar.hide();
			this.slider.hide();
			this.viewport.hide();
			
			Util.DOM.removeClass(document.body, Code.PhotoSwipe.CssClasses.activeBody);
			
			this.isBusy = false;
			this.isActive = false;
			
			Util.Events.fire(this, {
				type: Code.PhotoSwipe.EventTypes.onHide,
				target: this
			});
			
			this.goBackInHistory();
		},
		
		
		/*
		 * Function: goBackInHistory
		 */
		goBackInHistory: function(){
			
			if (this.isBackEventSupported && this.settings.backButtonHideEnabled){	
				if ( !this.backButtonClicked ){
					window.history.back();
				}
			}
			
		},
		
		
		/*
		 * Function: showNext
		 */
		showNext: function(){
			
			if (this.isBusy){
				return;
			}
			
			this.isBusy = true;
			
			this.cleanUpZoomPanRotateForNextPrevious();
			
			this.setCaptionAndToolbarOnShowPreviousNext();
			
			this.slider.showNext();
			
			Util.Events.fire(this, {
				type: Code.PhotoSwipe.EventTypes.onShowNext,
				target: this
			});
			
		},
		
		
		
		/*
		 * Function: showPrevious
		 */
		showPrevious: function(){
			
			if (this.isBusy){
				return;
			}
			
			this.isBusy = true;
			
			this.cleanUpZoomPanRotateForNextPrevious();
			
			this.setCaptionAndToolbarOnShowPreviousNext();
			
			if (this.wasUserZoomActive){
				Util.DOM.hide(this.slider.currentItem.imageEl);
			}
			
			this.slider.showPrevious();
			
			Util.Events.fire(this, {
				type: Code.PhotoSwipe.EventTypes.onShowPrevious,
				target: this
			});
			
		},
		
		
		
		/*
		 * Function: cleanUpZoomPanRotateForNextPrevious
		 */
		cleanUpZoomPanRotateForNextPrevious: function(){
		
			if (!Util.isNothing(this.zoomPanRotate)){
				if (this.settings.loop){
					Util.DOM.hide(this.slider.currentItem.imageEl);
				}
				else{
					if (this.currentIndex > 0 && this.currentIndex < this.fullSizeImages.length - 2){
						Util.DOM.hide(this.slider.currentItem.imageEl);
					}
				}
			}
			
			this.removeZoomPanRotate();
			
		},
		
		
		
		/*
		 * Function: setCaptionAndToolbarOnShowPreviousNext
		 */
		setCaptionAndToolbarOnShowPreviousNext: function(){
		
			if (this.settings.captionAndToolbarHide){
				return;
			}
			
			var resetAutoTimeout = false;
			
			switch (this.lastShowPrevTrigger){
				
				case Code.PhotoSwipe.ShowPrevTriggers.toolbar:
					resetAutoTimeout = true;
					break;
					
				case Code.PhotoSwipe.ShowPrevTriggers.slideshow:
					resetAutoTimeout = false;
					break;
				
				default: 
					resetAutoTimeout = !this.settings.captionAndToolbarHideOnSwipe;
					break;
			}
			
			
			if (resetAutoTimeout) {
				
				// Reset the caption and toolbar's fadeOut timeout
				this.captionAndToolbar.resetAutoHideTimeout();
					
			}
			else{
				
				this.fadeOutCaptionAndToolbar();
				
			}
						
		},
		
		
		
		/*
		 * Function: onSliderDisplayCurrentFullSizeImage
		 */
		onSliderDisplayCurrentFullSizeImage: function(e){
			
			this.currentIndex = e.fullSizeImage.index;
			
			
			// Set caption and toolbar
			if (!this.settings.captionAndToolbarHide){
				
				if (this.settings.loop) {
					this.captionAndToolbar.setNextState(false);
					this.captionAndToolbar.setPreviousState(false);
				}
				else{
					if (this.currentIndex >= this.fullSizeImages.length - 1) {
						this.captionAndToolbar.setNextState(true);
					}
					else {
						this.captionAndToolbar.setNextState(false);
					}
					
					if (this.currentIndex < 1) {
						this.captionAndToolbar.setPreviousState(true);
					}
					else {
						this.captionAndToolbar.setPreviousState(false);
					}
				}
				
				this.captionAndToolbar.setCaptionValue(this.fullSizeImages[this.currentIndex].caption);
				
				var fadeIn = false;
				
				switch (this.lastShowPrevTrigger){
					
					case Code.PhotoSwipe.ShowPrevTriggers.toolbar:
						fadeIn = true;
						break;
						
					case Code.PhotoSwipe.ShowPrevTriggers.show:
						fadeIn = true;
						break;
						
					case Code.PhotoSwipe.ShowPrevTriggers.slideshow:
						fadeIn = false;
						break;
						
					default:
						fadeIn = !this.settings.captionAndToolbarHideOnSwipe;
						break;
					
				}
				
				
				if (fadeIn){
					
					Util.Events.fire(this, {
						type: Code.PhotoSwipe.EventTypes.onBeforeCaptionAndToolbarShow,
						target: this
					});
					
					this.captionAndToolbar.fadeIn();
					
				}
				
				Util.Events.fire(this, { 
					type: Code.PhotoSwipe.EventTypes.onDisplayImage, 
					target: this, 
					image: this.fullSizeImages[this.currentIndex] 
				});
				
			}
			
			this.lastShowPrevTrigger = '';
			
			// Set the previous and next images for the slider
			this.setSliderPreviousAndNextFullSizeImages();
			
			if (this.isSlideshowActive){
				
				this.fireSlideshowTimeout();

			}
			
			this.isBusy = false;
			
		},
		
		
		
		/*
		 * Function: toggleCaptionAndToolbar
		 */
		toggleCaptionAndToolbar: function(){
			
			if (this.settings.captionAndToolbarHide){
				
				this.captionAndToolbar.hide();
				return;
				
			}
			
			if (this.captionAndToolbar.isHidden){
				
				Util.Events.fire(this, {
					type: Code.PhotoSwipe.EventTypes.onBeforeCaptionAndToolbarShow,
					target: this
				});
				this.captionAndToolbar.fadeIn();

			}
			else{
				
				Util.Events.fire(this, {
					type: Code.PhotoSwipe.EventTypes.onBeforeCaptionAndToolbarHide,
					target: this
				});
				this.captionAndToolbar.fadeOut();
				
			}
			
			
		},
		
		
		
		/*
		 * Function: fadeOutCaptionAndToolbar
		 */
		fadeOutCaptionAndToolbar: function(){
			
			if (!this.settings.captionAndToolbarHide && !this.captionAndToolbar.isHidden){
				Util.Events.fire(this, {
					type: Code.PhotoSwipe.EventTypes.onBeforeCaptionAndToolbarHide,
					target: this
				});
				this.captionAndToolbar.fadeOut();
			}
		
		},
		
		
		
		/*
		 * Function: onToolbarClick
		 */
		onToolbarClick: function(e){
			
			this.stopSlideshow();
			
			switch (e.action){
				
				case ToolbarClass.Actions.previous:
					this.lastShowPrevTrigger = Code.PhotoSwipe.ShowPrevTriggers.toolbar;
					this.showPrevious();
					break;
					
				case ToolbarClass.Actions.next:
					this.lastShowPrevTrigger = Code.PhotoSwipe.ShowPrevTriggers.toolbar;
					this.showNext();
					break;
				
				case ToolbarClass.Actions.play:
					this.startSlideshow();
					break;
				
				default:
					this.hide();
					break;
					
			}
			
		},
		
		
		
		/*
		 * Function: startSlideshow
		 */
		startSlideshow: function(){
			
			if (this.isBusy){
				return;
			}
			
			if (!Util.isNothing(this.slideshowTimeout)){
				window.clearTimeout(this.slideshowTimeout);
			}
				
			this.removeZoomPanRotate();
			
			this.isSlideshowActive = true;
			
			this.fadeOutCaptionAndToolbar();
			
			this.fireSlideshowTimeout();
			
			Util.Events.fire(this, {
				type: Code.PhotoSwipe.EventTypes.onSlideshowStart,
				target: this
			});
			
		},
		
		
		
		/*
		 * Function: stopSlideshow
		 */
		stopSlideshow: function(){
			
			if (!Util.isNothing(this.slideshowTimeout)){
				window.clearTimeout(this.slideshowTimeout);
			}
						
			this.isSlideshowActive = false;
			
			Util.Events.fire(this, {
				type: Code.PhotoSwipe.EventTypes.onSlideshowStop,
				target: this
			});
			
		},
		
		
	
		
		/*
		 * Function: fireSlideshowTimeout
		 */
		fireSlideshowTimeout: function(){
				
			var fire = false;
			
			if (this.settings.loop){
				if (this.fullSizeImages.length > 1){
					fire = true;
				}
			}
			else{
				if (this.currentIndex < this.fullSizeImages.length-1){
					fire = true;
				}
			}
			
			if (fire){
				
				this.lastShowPrevTrigger = Code.PhotoSwipe.ShowPrevTriggers.slideshow;
				this.slideshowTimeout = window.setTimeout(
					this.showNext.bind(this),
					this.settings.slideshowDelay
				);
			
			}
			
		},
		
		
		/*
		 * Function: createZoomPanRotate
		 */
		createZoomPanRotate: function(){
			
			if (this.canUserZoom()){
				this.stopSlideshow();
				if (!this.isZoomActive()){
					this.zoomPanRotate = new ZoomPanRotateClass(
						{
							maxZoom: this.settings.maxUserZoom,
							minZoom: this.settings.minUserZoom,
							adjustPanToZoom: this.settings.adjustUserPanToZoom
						}, 
						this.viewport.el, 
						this.slider.currentItem.imageEl
					);
				}
				this.fadeOutCaptionAndToolbar();
			}
				
		},
		
		
		/*
		 * Function: removeZoomPanRotate
		 */
		removeZoomPanRotate: function(){
			
			if (Util.isNothing(this.zoomPanRotate)){
				return;
			}
			
			this.zoomPanRotate.removeFromDOM();
						
			this.zoomPanRotate = null;
		
		},
		
		
		/*
		 * Function: onCaptionAndToolbarShow
		 */
		onCaptionAndToolbarShow: function(){
			Util.Events.fire(this, {
				type: Code.PhotoSwipe.EventTypes.onCaptionAndToolbarShow,
					target: this
			});
		},
		
		
		/*
		 * Function: onCaptionAndToolbarHide
		 */
		onCaptionAndToolbarHide: function(){
			Util.Events.fire(this, {
				type: Code.PhotoSwipe.EventTypes.onCaptionAndToolbarHide,
					target: this
			});
		}
		
	});
	
	
	Code.PhotoSwipe.CssClasses = {
		activeBody: 'ps-active'
	};
	
	
	Code.PhotoSwipe.ShowPrevTriggers = {
		
		show: 'show',
		toolbar: 'toobar',
		swipe: 'swipe',
		keyboard: 'keyboard',
		slideshow: 'slideshow'
		
	};
	
	
	Code.PhotoSwipe.EventTypes = {
		
		onBeforeShow: 'PhotoSwipeOnBeforeShow',
		onShow: 'PhotoSwipeOnShow',
		onBeforeHide: 'PhotoSwipeOnBeforeHide',
		onHide: 'PhotoSwipeOnHide',
		onShowNext: 'PhotoSwipeOnShowNext',
		onShowPrevious: 'PhotoSwipeOnShowPrevious',
		onDisplayImage: 'PhotoSwipeOnDisplayImage',
		onResetPosition: 'PhotoSwipeOnResetPosition',
		onSlideshowStart: 'PhotoSwipeOnSlideshowStart',
		onSlideshowStop: 'PhotoSwipeOnSlideshowStop',
		onBeforeCaptionAndToolbarShow: 'PhotoSwipeOnBeforeCaptionAndToolbarShow',
		onCaptionAndToolbarShow: 'PhotoSwipeOnCaptionAndToolbarShow',
		onBeforeCaptionAndToolbarHide: 'PhotoSwipeOnBeforeCaptionAndToolbarHide',
		onCaptionAndToolbarHide: 'PhotoSwipeOnCaptionAndToolbarHide',
		onViewportClick: 'PhotoSwipeOnViewportClick'
		
	};
	
	
	/*
	 * Function: Code.PhotoSwipe.GetImageSource
	 * Default method for returning an image's source
	 */
	Code.PhotoSwipe.GetImageSource = function(el){
		return el.href;
	};
	
	
	
	/*
	 * Function: Code.PhotoSwipe.GetImageCaption
	 * Default method for returning an image's caption
	 * Assumes the el is an anchor and the first child is the
	 * image. The returned value is the "alt" attribute of the
	 * image.
	 */
	Code.PhotoSwipe.GetImageCaption = function(el){
		if (el.nodeName === "IMG"){
			return Util.DOM.getAttribute(el, 'alt'); 
		}
		var i, childEl;
		for (i=0; i<el.childNodes.length; i++){
			childEl = el.childNodes[i];
			if (el.childNodes[i].nodeName === 'IMG'){
				return Util.DOM.getAttribute(childEl, 'alt'); 
			}
		}
	};
	
	
	
	/*
	 * Function: Code.PhotoSwip.GetImageMetaData
	 * Can be used if you wish to store additional meta
	 * data against the full size image
	 */
	Code.PhotoSwipe.GetImageMetaData = function(el){
		
		return  {};
		
	};
	
	
	Code.PhotoSwipe.Current = new photoSwipe();
	
	
	Code.photoSwipe = function(thumbEls, containerEl, opts){
		
		var useEventDelegation = true;
		
		if (Util.isNothing(thumbEls)){
			return;
		}
		
		/* See if there is a container element, if so we will use event delegation */
		
		if (Util.isNothing(containerEl)){
			containerEl = document.documentElement;
			useEventDelegation = false;
		}
		
		if (Util.isString(containerEl)){
			containerEl = document.documentElement.querySelector(containerEl);
		}
		
		if (Util.isNothing(containerEl)){
			throw 'Unable to find container element'; 
		}
		
		if (Util.isString(thumbEls)){
			thumbEls = containerEl.querySelectorAll(thumbEls);
		}
		
		if (Util.isNothing(thumbEls)){
			return;
		}
		
		
		var onClick = function(e){
		
			e.preventDefault();
					
			showPhotoSwipe(e.currentTarget);
			
		};
		
		var showPhotoSwipe = function(clickedEl){
			
			var startingIndex;
			for (startingIndex = 0; startingIndex < thumbEls.length; startingIndex++){
				if (thumbEls[startingIndex] === clickedEl){
					break;
				}
			}
			
			Code.PhotoSwipe.Current.show(startingIndex);
				
		};
		
		
		
		// Set up the options 
		Code.PhotoSwipe.Current.setOptions(opts);
		
		
		// Tell PhotoSwipe about the photos
		Code.PhotoSwipe.Current.setImages(thumbEls);
		
		
		if (useEventDelegation){
			
			/*
			 * Use event delegation rather than setting a click event on each 
			 * thumb element.
			 */
			containerEl.addEventListener('click', function(e){
			
				if (e.target === e.currentTarget){
					return;
				}
					
				e.preventDefault();
					
				var findNode = function(clickedEl, targetNodeName, stopAtEl){
					
					if (Util.isNothing(clickedEl) || Util.isNothing(targetNodeName) || Util.isNothing(stopAtEl)){
						return null;
					}
					
					if (clickedEl.nodeName === targetNodeName){
						return clickedEl;
					}
					
					if (clickedEl === stopAtEl){
						return null;
					}
										
					return findNode(clickedEl.parentNode, targetNodeName, stopAtEl);
				};
				
				
				var clickedEl = findNode(e.target, thumbEls[0].nodeName, e.currentTarget);
				
				if (Util.isNothing(clickedEl)){
					return;
				}
				
				showPhotoSwipe(clickedEl);
			
			}, false);
			
		}
		else{
						
			// Add a click event handler on each element
			for (var i = 0; i < thumbEls.length; i++){
				
				var thumbEl = thumbEls[i];
				thumbEl.addEventListener('click', onClick, false);
				
			}
		
		}
		
		return thumbEls;
			
	};
	
	
	
	/*
	 * jQuery plugin
	 */
	if (!Util.isNothing(window.jQuery)){
	
		window.jQuery.fn.photoSwipe = function (opts) {
			
			var thumbEls = this;
			Code.PhotoSwipe.Current.setOptions(opts);
			Code.PhotoSwipe.Current.setImages(thumbEls);
			
			$(thumbEls).live('click', function(e){
				
				e.preventDefault();
				
				var startingIndex = $(thumbEls).index($(e.currentTarget));
				Code.PhotoSwipe.Current.show(startingIndex);
				
			});
			
		};
		
	}
	
	
})
(
	window,
	Code.PhotoSwipe.Util, 
	Code.PhotoSwipe.ElementClass,
	Code.PhotoSwipe.DocumentOverlayClass,
	Code.PhotoSwipe.FullSizeImageClass,
	Code.PhotoSwipe.ViewportClass,
	Code.PhotoSwipe.SliderClass,
	Code.PhotoSwipe.CaptionClass,
	Code.PhotoSwipe.ToolbarClass,
	Code.PhotoSwipe.CaptionToolbarClass,
	Code.PhotoSwipe.ZoomPanRotateClass
);
