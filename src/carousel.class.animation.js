// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, klass, Util, TouchElement){
	
	
	Util.registerNamespace('Code.PhotoSwipe.Carousel');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	PhotoSwipe.Carousel.CarouselClass = PhotoSwipe.Carousel.CarouselClass.extend({
	
		
		/*
		 * Function: getStartingPos
		 */
		getStartingPos: function(){
			
			var startingPos = this.touchStartPosition;
			
			if (Util.isNothing(startingPos)){
				startingPos = {
					x: window.parseInt(Util.DOM.getStyle(this.contentEl, 'left'), 0),
					y: window.parseInt(Util.DOM.getStyle(this.contentEl, 'top'), 0)
				};
			}
			
			return startingPos;
		
		},
		
		
		
		/*
		 * Function: doMoveCarousel
		 */
		doMoveCarousel: function(xVal){
			
			var style;
			
			if (Util.Browser.isCSSTransformSupported){
				
				style = {};
				
				style[Util.Animation._transitionPrefix + 'Property'] = 'all';
				style[Util.Animation._transitionPrefix + 'Duration'] = '';
				style[Util.Animation._transitionPrefix + 'TimingFunction'] = '';
				style[Util.Animation._transitionPrefix + 'Delay'] = '0';
				style[Util.Animation._transformLabel] = (Util.Browser.is3dSupported) ? 'translate3d(' + xVal + 'px, 0px, 0px)' : 'translate(' + xVal + 'px, 0px)';
				
				Util.DOM.setStyle(this.contentEl, style);
			
			}
			else if (!Util.isNothing(window.jQuery)){
				
				
				window.jQuery(this.contentEl).stop().css('left', this.getStartingPos().x + xVal + 'px');
				
			}
			
		},
		
		
		
		/*
		 * Function: doSlideCarousel
		 */
		doSlideCarousel: function(xVal, speed){
			
			var animateProps, transform;
			
			if (speed <= 0){
				
				this.slideByEndHandler();
				return;
				
			}
			
			
			if (Util.Browser.isCSSTransformSupported){
				
				transform = Util.coalesce(this.contentEl.style.webkitTransform, this.contentEl.style.MozTransform, this.contentEl.style.OTransform, this.contentEl.style.transform, '');
				if (transform.indexOf('translate3d(' + xVal) === 0){
					this.slideByEndHandler();
					return;
				}
				else if (transform.indexOf('translate(' + xVal) === 0){
					this.slideByEndHandler();
					return;
				}
				
				Util.Animation.slideBy(this.contentEl, xVal, 0, speed, this.slideByEndHandler, this.settings.slideTimingFunction);
				
			}
			else if (!Util.isNothing(window.jQuery)){
				
				animateProps = {
					left: this.getStartingPos().x + xVal + 'px'
				};
		
				if (this.settings.animationTimingFunction === 'ease-out'){
					this.settings.animationTimingFunction = 'easeOutQuad';
				}
				
				if ( Util.isNothing(window.jQuery.easing[this.settings.animationTimingFunction]) ){
					this.settings.animationTimingFunction = 'linear';
				}
			
				window.jQuery(this.contentEl).animate(
					animateProps, 
					this.settings.slideSpeed, 
					this.settings.animationTimingFunction,
					this.slideByEndHandler
				);
			
			}
			
			
		}
	
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util,
	window.Code.PhotoSwipe.TouchElement
));