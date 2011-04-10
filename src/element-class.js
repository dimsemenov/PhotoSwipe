// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function (Util) {
	
	/*
	 * Class: Code.PhotoSwipe.ElementClass
	 * Most PhotoSwipe classes inherit from this class
	 * Provides hooks for fading in and out
	 */
	Code.PhotoSwipe.ElementClass = Code.PhotoSwipe.EventClass.extend({
		
		el: null,
		settings: null,
		isFading: null,
		isHidden: null,
		
		fadeInHandler: null,
		fadeOutHandler: null,
		
		
		/*
		 * Function: init
		 */
		init: function(options){
			
			this._super();
			
			this.settings = {
				opacity: 1,
				fadeInSpeed: 250,
				fadeOutSpeed: 500
			};
			
			Util.extend(this.settings, options);
			
			this.isFading = false;
			
			this.fadeInHandler = this.postFadeIn.bind(this);
			this.fadeOutHandler = this.postFadeOut.bind(this);
			this.isHidden = true;
			
		},
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
		},
		
		
		
		/*
		 * Function: show
		 */
		show: function(){
			
			if (this.el === null){
				return;
			}
			
			this.preShow();
			
			// Show
			Util.DOM.setStyle(this.el, 'opacity', this.settings.opacity);
			Util.DOM.show(this.el);
			
			this.postShow();
			
		},
		
		
		/*
		 * Function: preShow
		 */
		preShow: function(){
			
			this.stopFade();		
			
			// Set position
			this.resetPosition();
			
		
		},
		
		
		/*
		 * Function: postShow
		 * Overide this 
		 */
		postShow: function(){
			
			this.isHidden = false;
			this.addEventListeners();		
			this.dispatchEvent(Code.PhotoSwipe.ElementClass.EventTypes.onShow);
		
		},
		
	
		
		/*
		 * Function: fadeIn
		 */
		fadeIn: function(){
			
			if (this.el === null){
				return;
			}
			
			Util.DOM.setStyle(this.el, 'opacity', 0);
			
			this.fadeInFromCurrentOpacity();
			
		},
		
		
		/*
		 * Function: fadeInFromCurrentOpacity
		 */
		fadeInFromCurrentOpacity: function(){
			
			if (this.el === null){
				return;
			}
			
			this.preFadeIn();
			
			// Fade in
			Util.DOM.show(this.el);
			Util.Animation.fadeIn(
				this.el, 
				this.settings.opacity, 
				this.settings.fadeInSpeed, 
				this.fadeInHandler
			);
			
		},
		
		
		/*
		 * Function: preFadeIn
		 */
		preFadeIn: function(){
			
			this.stopFade();
			
			this.isFading = true;
			
			// Set position
			this.resetPosition();
			
		},
		
				
		/*
		 * Function: postFadeIn
		 */
		postFadeIn: function(e){
			
			this.isFading = false;
			this.isHidden = false;
			this.addEventListeners();			
			this.dispatchEvent(Code.PhotoSwipe.ElementClass.EventTypes.onFadeIn);
			
		},
		
		
				
		/*
		 * Function: hide
		 */
		hide: function(){
			
			if (this.el === null){
				return;
			}
			
			this.stopFade();
			
			Util.DOM.hide(this.el);
			
			this.postHide();
			
		},
		
		
		/*
		 * Function: postHide
		 * Overide this 
		 */
		postHide: function(){
			
			this.isHidden = true;
			this.removeEventListeners();	
			this.dispatchEvent(Code.PhotoSwipe.ElementClass.EventTypes.onHide);
			
		},
		
		
		/*
		 * Fuction: fadeOut
		 */
		fadeOut: function(){
			
			this.stopFade();
			
			this.isFading = true;
			
			Util.Animation.fadeOut(this.el, this.settings.fadeOutSpeed, this.fadeOutHandler);
			
		},
		
		
		/*
		 * Function: preFadeOut
		 */
		postFadeOut: function(e){
			
			this.isHidden = true;
			this.isFading = false;
	
			Util.DOM.hide(this.el);
			
			this.removeEventListeners();
			
			this.dispatchEvent(Code.PhotoSwipe.ElementClass.EventTypes.onFadeOut);
			
		},
		
		
		/*
		 * Function: stopFade
		 */
		stopFade: function(){
			
			if (this.el === null){
				return;
			}
			
			Util.Animation.stopFade(this.el);
			this.isFading = false;
		
		},
		
		
		/*
		 * Function: addEventListeners
		 */
		addEventListeners: function(){
					
		},
		
		
		/*
		 * Function: removeEventListeners
		 */
		removeEventListeners: function(){
						
		}
		
		
	});
	
	
	
	Code.PhotoSwipe.ElementClass.EventTypes = {
		onShow: 'onShow',
		onHide: 'onHide',
		onClick: 'onClick',
		onFadeIn: 'onFadeIn',
		onFadeOut: 'onFadeOut'
	};
	

})(Code.PhotoSwipe.Util);