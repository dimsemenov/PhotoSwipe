// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, Util){
	
	/*
	 * Class: Code.PhotoSwipe.CaptionClass
	 */
	Code.PhotoSwipe.CaptionClass = Code.PhotoSwipe.ElementClass.extend({
		
		contentEl: null,
		
		touchMoveHandler: null,
		
		captionValue: null,
		
		
		/*
		 * Function: init
		 */
		init: function(options){
			
			this.settings = {
				position: 'top',
				zIndex: 1000
			};
			
			Util.extend(this.settings, options);
			
			this._super(this.settings);
			
			this.captionValue = '';
			
			this.touchMoveHandler = this.onTouchMove.bind(this);
			
			// Create element and append to body
			var cssClass = Code.PhotoSwipe.CaptionClass.CssClasses.caption;
			if (this.settings.position === 'bottom'){
				cssClass = cssClass + ' ' + Code.PhotoSwipe.CaptionClass.CssClasses.bottom;
			}
			
			this.el = Util.DOM.createElement('div', { 'class': cssClass }, '');
			Util.DOM.setStyle(this.el, {
				left: 0,
				position: 'absolute',
				overflow: 'hidden',
				zIndex: this.settings.zIndex,
				opacity: 0
			});
			Util.DOM.hide(this.el);
			Util.DOM.appendToBody(this.el);
			
			this.contentEl = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.CaptionClass.CssClasses.content }, '');
			Util.DOM.appendChild(this.contentEl, this.el);
			
		},
		
		
		
		/*
		 * Function: addEventListeners
		 */
		addEventListeners: function(){
			
			if (Util.browser.touchSupported){
				Util.DOM.addEventListener(this.el, 'touchmove', this.touchMoveHandler);
			}
			
		},
		
		
		
		/*
		 * Function: removeEventListeners
		 */
		removeEventListeners: function(){
			
			if (Util.browser.touchSupported){
				Util.DOM.removeEventListener(this.el, 'touchmove', this.touchMoveHandler);
			}
						
		},
		
		
		
		/*
		 * Function: onTouch
		 */
		onTouchMove: function(e){
			
			e.preventDefault();
			
		},
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			var top;
						
			if (this.settings.position === 'bottom') {
				top = Util.DOM.windowHeight() - Util.DOM.outerHeight(this.el) + Util.DOM.windowScrollTop();
			}
			else {
				top = Util.DOM.windowScrollTop();
			}
			
			Util.DOM.setStyle(this.el, 'top', top + 'px');
			Util.DOM.width(this.el, Util.DOM.bodyWidth());
			
		},
		
		
		
		/*
		 * Function: setCaptionValue
		 */
		setCaptionValue: function(captionValue){
		
			Util.DOM.removeChildren(this.contentEl);
			
			captionValue = Util.coalesce(captionValue, '\u00A0');
			
			if (Util.isObject(captionValue)){
				Util.DOM.appendChild(captionValue, this.contentEl);
			}
			else{
				if (captionValue === ''){
					captionValue = '\u00A0';
				}
				Util.DOM.appendText(captionValue, this.contentEl);	
			}
			
			this.captionValue = (captionValue === '\u00A0') ? '' : captionValue;
			
			//Util.DOM.show(this.el);
			//var height = Util.DOM.height(this.el);
			//Util.DOM.hide(this.el);
			//console.log(height);			
			
		}

		
	
	});
	
	
	Code.PhotoSwipe.CaptionClass.CssClasses = {
		caption: 'ps-caption',
		bottom: 'ps-caption-bottom',
		content: 'ps-caption-content'
	};

})
(
	window,
	Code.PhotoSwipe.Util
);
