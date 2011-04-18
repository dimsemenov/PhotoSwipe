// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(Util){
	
	/*
	 * Class: Code.PhotoSwipe.ViewportClass
	 */
	Code.PhotoSwipe.ViewportClass = Code.PhotoSwipe.ElementClass.extend({
		
		touchStartPoint: null,
		touchFingerCount: null,
		
		touchStartHandler: null,
		touchMoveHandler: null,
		touchEndHandler: null,
		
		mouseDownHandler: null,
		mouseUpHandler: null,
		
		
		/*
		 * Function: init
		 */
		init: function(options){
			
			this.settings = {
				swipeThreshold: 500,
				zIndex: 1000
			};
			
			Util.extend(this.settings, options);
			
			this._super(this.settings);
			
			this.touchFingerCount = 0;
			this.touchStartPoint = { x: 0, y: 0 };
			
			this.touchStartHandler = this.onTouchStart.bind(this);
			this.touchMoveHandler = this.onTouchMove.bind(this);
			this.touchEndHandler = this.onTouchEnd.bind(this);
			
			this.mouseDownHandler = this.onMouseDown.bind(this);
			this.mouseUpHandler = this.onMouseUp.bind(this);
			
			// Create element and append to body
			this.el = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.ViewportClass.CssClasses.viewport }, '');
			Util.DOM.setStyle(this.el, {
				position: 'absolute',
				left: 0,
				zIndex: this.settings.zIndex,
				overflow: 'hidden'
			});
			Util.DOM.hide(this.el);
			Util.DOM.appendToBody(this.el);

		},
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			// Set the height and width to fill the document
			Util.DOM.setStyle(this.el, {
				top: Util.DOM.windowScrollTop()  + 'px'
			});
			
			Util.DOM.width(this.el, Util.DOM.bodyWidth());
			Util.DOM.height(this.el, Util.DOM.windowHeight());

		},
		
		
		/*
		 * Function: addEventListeners
		 */
		addEventListeners: function(){
			
			try{
				Util.DOM.addEventListener(this.el, 'touchstart', this.touchStartHandler);
				Util.DOM.addEventListener(this.el, 'touchmove', this.touchMoveHandler);
				Util.DOM.addEventListener(this.el, 'touchend', this.touchEndHandler);
			}
			catch (err){ }
			
			Util.DOM.addEventListener(this.el, 'mousedown', this.mouseDownHandler);
			Util.DOM.addEventListener(this.el, 'mouseup', this.mouseUpHandler);
			
		},
		
		
		
		/*
		 * Function: removeEventListeners
		 */
		removeEventListeners: function(){
			
			try{
				Util.DOM.removeEventListener(this.el, 'touchstart', this.touchStartHandler);
				Util.DOM.removeEventListener(this.el, 'touchmove', this.touchMoveHandler);
				Util.DOM.removeEventListener(this.el, 'touchend', this.touchEndHandler);
			}
			catch (err){ }
			
			Util.DOM.removeEventListener(this.el, 'mousedown', this.mouseDownHandler);
			Util.DOM.removeEventListener(this.el, 'mouseup', this.mouseUpHandler);
			
		},
		
		
		
		/*
		 * Function: setCurrentTouchPoint
		 */
		setCurrentTouchPoint: function(touchPoint, touches){
			
			this.touchFingerCount = touches.length;
			
			if (this.touchFingerCount === 1){
				touchPoint.x = touches[0].pageX;
				touchPoint.y = touches[0].pageY;
			}
			else{
				this.touchFingerCount = 0;
				touchPoint.x = 0;
				touchPoint.y = 0;
			}
			
		},
		
		
		
		/*
		 * Function: onTouch
		 */
		onTouchStart: function(e){
			
			e.preventDefault();
						
			this.setCurrentTouchPoint(this.touchStartPoint, Util.DOM.getTouchEvent(e).touches);
			
		},
		
		
		
		/*
		 * Function: onTouchMove
		 * For some reason, even though it's not a requirement,
		 * if we don't listen out for the touchmove event,
		 * we are unable to detect the swipe on Blackberry6
		 */
		onTouchMove: function(e){
			
			e.preventDefault();
		
		},
		
		
		
		/*
		 * Function: onTouchEnd
		 */
		onTouchEnd: function(e){
			
			e.preventDefault();
			
			var touchEndPoint = { x:0, y:0 };
			
			var touchEvent = Util.DOM.getTouchEvent(e);
			
			if (!Util.isNothing(touchEvent.changedTouches)){
				// http://backtothecode.blogspot.com/2009/10/javascript-touch-and-gesture-events.html
				// iOS removed the current touch from e.touches on "touchend"
				// Need to look into e.changedTouches
				this.setCurrentTouchPoint(touchEndPoint, touchEvent.changedTouches);
			}
			else{
				this.setCurrentTouchPoint(touchEndPoint, touchEvent.touches);
			}
				
			if (this.touchFingerCount == 1){
				
				this.fireTouchEvent(this.touchStartPoint, touchEndPoint);
				
			}
			
		},
		
		
		
		/*
		 * Function: onMouseDown
		 */
		onMouseDown: function(e){
			
			e.preventDefault();
			
			this.touchStartPoint = Util.DOM.getMousePosition(e);
		
		},
		
		
		
		/*
		 * Function: onMouseUp
		 */
		onMouseUp: function(e){
		
			e.preventDefault();
			
			this.fireTouchEvent(this.touchStartPoint, Util.DOM.getMousePosition(e));
			
		},
		
		
		
		/*
		 * Function: fireTouchEvent
		 */
		fireTouchEvent: function(touchStartPoint, touchEndPoint){
			
			var action;
			
			var distance = touchEndPoint.x - touchStartPoint.x;
				
			if (Math.abs(distance) >= this.settings.swipeThreshold){
			
				if (distance < 0){
					
					// Swipe left
					action = Code.PhotoSwipe.ViewportClass.Actions.swipeLeft;
					
				}
				else{
					
					// Swipe right
					action = Code.PhotoSwipe.ViewportClass.Actions.swipeRight;
					
				}
				
			}
			else{
				
				// Click
				action = Code.PhotoSwipe.ViewportClass.Actions.click;
			
			}
			
			if (Util.isNothing(action)){
				return;
			}
			
			this.dispatchEvent({ 
				type: Code.PhotoSwipe.ViewportClass.EventTypes.onTouch, 
				target: this, 
				action: action 
			});
			
		}
		
	});
	
	
	Code.PhotoSwipe.ViewportClass.CssClasses = {
		viewport: 'ps-viewport'
	};
	
	
	Code.PhotoSwipe.ViewportClass.Actions = {
		click: 'click',
		swipeLeft: 'swipeLeft',
		swipeRight: 'swipeRight'
	};
	
	Code.PhotoSwipe.ViewportClass.EventTypes = {
		onTouch: 'onTouch'
	};
	
	
})(Code.PhotoSwipe.Util);
