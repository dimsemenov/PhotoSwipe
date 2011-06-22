// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, Util){
	
	/*
	 * Class: Code.PhotoSwipe.ViewportClass
	 */
	Code.PhotoSwipe.ViewportClass = Code.PhotoSwipe.ElementClass.extend({
		
		touchStartPoint: null,
		
		touchStartTime: null,
		touchStartHandler: null,
		touchMoveHandler: null,
		touchEndHandler: null,
		
		gestureStartHandler: null,
		gestureChangeHandler: null,
		gestureEndHandler: null,
		
		isGesture: null,
		
		mouseDownHandler: null,
		mouseMoveHandler: null,
		mouseUpHandler: null,
		
		doubleClickTimeout: null,
		
		
		/*
		 * Function: init
		 */
		init: function(options){
			
			this.settings = {
				swipeThreshold: 500,
				swipeTimeThreshold: 250,
				zIndex: 1000,
				doubleClickSpeed: 300
			};
			
			Util.extend(this.settings, options);
			
			this._super(this.settings);
			
			this.touchStartPoint = { x: 0, y: 0 };
			
			if (Util.browser.touchSupported){
				this.touchStartHandler = this.onTouchStart.bind(this);
				this.touchMoveHandler = this.onTouchMove.bind(this);
				this.touchEndHandler = this.onTouchEnd.bind(this);
			}
			
			if (Util.browser.gestureSupported){
				this.gestureStartHandler = this.onGestureStart.bind(this);
				this.gestureChangeHandler = this.onGestureChange.bind(this);
				this.gestureEndHandler = this.onGestureEnd.bind(this);
			}
			
			this.mouseDownHandler = this.onMouseDown.bind(this);
			this.mouseMoveHandler = this.onMouseMove.bind(this);
			this.mouseUpHandler = this.onMouseUp.bind(this);
			
			// Create element and append to body
			this.el = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.ViewportClass.CssClasses.viewport, 'data-role': 'dialog' }, '');
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
						
			if (Util.browser.touchSupported){
				Util.DOM.addEventListener(this.el, 'touchstart', this.touchStartHandler);
				Util.DOM.addEventListener(this.el, 'touchmove', this.touchMoveHandler);
				Util.DOM.addEventListener(this.el, 'touchend', this.touchEndHandler);
			}
			
			if (Util.browser.gestureSupported){
				Util.DOM.addEventListener(this.el, 'gesturestart', this.gestureStartHandler);
				Util.DOM.addEventListener(this.el, 'gesturechange', this.gestureChangeHandler);
				Util.DOM.addEventListener(this.el, 'gestureend', this.gestureEndHandler);
			}
			
			Util.DOM.addEventListener(this.el, 'mousedown', this.mouseDownHandler);
			Util.DOM.addEventListener(this.el, 'mouseup', this.mouseUpHandler);
			
		},
		
		
		
		/*
		 * Function: removeEventListeners
		 */
		removeEventListeners: function(){
			
			if (Util.browser.touchSupported){
				Util.DOM.removeEventListener(this.el, 'touchstart', this.touchStartHandler);
				Util.DOM.removeEventListener(this.el, 'touchmove', this.touchMoveHandler);
				Util.DOM.removeEventListener(this.el, 'touchend', this.touchEndHandler);
			}
			
			if (Util.browser.gestureSupported){
				Util.DOM.removeEventListener(this.el, 'gesturestart', this.gestureStartHandler);
				Util.DOM.removeEventListener(this.el, 'gesturechange', this.gestureChangeHandler);
				Util.DOM.removeEventListener(this.el, 'gestureend', this.gestureEndHandler);
			}
			
			Util.DOM.removeEventListener(this.el, 'mousedown', this.mouseDownHandler);
			Util.DOM.removeEventListener(this.el, 'mouseup', this.mouseUpHandler);
			
		},
		
		
		
		/*
		 * Function: getTouchPoint
		 */
		getTouchPoint: function(touches){
			
			return {
				x: touches[0].pageX,
				y: touches[0].pageY
			};
			
		},
		
		
		/*
		 * Function: onGestureStart
		 */
		onGestureStart: function(e){
		
			e.preventDefault();
			
			var touchEvent = Util.DOM.getTouchEvent(e);
			
			this.dispatchEvent({ 
				type: Code.PhotoSwipe.ViewportClass.EventTypes.onTouch, 
				target: this, 
				action: Code.PhotoSwipe.ViewportClass.Actions.gestureStart,
				scale: touchEvent.scale,
				rotation: touchEvent.rotation
			});
			
		},
		
		
		/*
		 * Function: onGestureChange
		 */
		onGestureChange: function(e){
			
			e.preventDefault();
			
			var touchEvent = Util.DOM.getTouchEvent(e);
			
			this.dispatchEvent({ 
				type: Code.PhotoSwipe.ViewportClass.EventTypes.onTouch, 
				target: this, 
				action: Code.PhotoSwipe.ViewportClass.Actions.gestureChange,
				scale: touchEvent.scale,
				rotation: touchEvent.rotation
			});
						
		},
		
		
		/*
		 * Function: onGestureEnd
		 */
		onGestureEnd: function(e){
			
			e.preventDefault();
			
			var touchEvent = Util.DOM.getTouchEvent(e);
			
			this.dispatchEvent({ 
				type: Code.PhotoSwipe.ViewportClass.EventTypes.onTouch, 
				target: this, 
				action: Code.PhotoSwipe.ViewportClass.Actions.gestureEnd,
				scale: touchEvent.scale,
				rotation: touchEvent.rotation
			});
			
		},
		
		
		/*
		 * Function: onTouch
		 */
		onTouchStart: function(e){
			
			e.preventDefault();
			
			var 
				touchEvent = Util.DOM.getTouchEvent(e),
				touches = touchEvent.touches;
			
			if (touches.length > 1){
				this.isGesture = true;
				return;
			}
			
			this.dispatchEvent({ 
				type: Code.PhotoSwipe.ViewportClass.EventTypes.onTouch, 
				target: this, 
				action: Code.PhotoSwipe.ViewportClass.Actions.touchStart,
				point: this.getTouchPoint(touches)
			});
			
			
			this.touchStartTime = new Date();
			this.isGesture = false;
			this.touchStartPoint = this.getTouchPoint(touches);
			
		},
		
		
		
		/*
		 * Function: onTouchMove
		 * For some reason, even though it's not a requirement,
		 * if we don't listen out for the touchmove event,
		 * we are unable to detect the swipe on Blackberry6
		 */
		onTouchMove: function(e){
			
			e.preventDefault();
			
			if (this.isGesture){
				return;
			}
			
			var 
				touchEvent = Util.DOM.getTouchEvent(e),
				touches = touchEvent.touches;
			
			this.dispatchEvent({ 
				type: Code.PhotoSwipe.ViewportClass.EventTypes.onTouch, 
				target: this, 
				action: Code.PhotoSwipe.ViewportClass.Actions.touchMove,
				point: this.getTouchPoint(touches)
			});
			
		},
		
		
		
		/*
		 * Function: onTouchEnd
		 */
		onTouchEnd: function(e){
			
			e.preventDefault();
			
			if (this.isGesture){
				return;
			}
			
			// http://backtothecode.blogspot.com/2009/10/javascript-touch-and-gesture-events.html
			// iOS removed the current touch from e.touches on "touchend"
			// Need to look into e.changedTouches
			
			var 
				touchEvent = Util.DOM.getTouchEvent(e),
				touches = (!Util.isNothing(touchEvent.changedTouches)) ? touchEvent.changedTouches : touchEvent.touches,
				touchEndPoint = this.getTouchPoint(touches);
			
			this.dispatchEvent({ 
				type: Code.PhotoSwipe.ViewportClass.EventTypes.onTouch, 
				target: this, 
				action: Code.PhotoSwipe.ViewportClass.Actions.touchEnd,
				point: touchEndPoint
			});
			
			this.fireTouchEvent(this.touchStartPoint, touchEndPoint);
			
		},
		
		
		
		/*
		 * Function: onMouseDown
		 */
		onMouseDown: function(e){
						
			e.preventDefault();
			
			Util.DOM.addEventListener(this.el, 'mousemove', this.mouseMoveHandler);
			
			this.dispatchEvent({ 
				type: Code.PhotoSwipe.ViewportClass.EventTypes.onTouch, 
				target: this, 
				action: Code.PhotoSwipe.ViewportClass.Actions.touchStart,
				point: Util.DOM.getMousePosition(e)
			});
			
			this.touchStartTime = new Date();
			this.isGesture = false;
			this.touchStartPoint = Util.DOM.getMousePosition(e);
			
		},
		
		
		
		/*
		 * Function: onMouseMove
		 */
		onMouseMove: function(e){
			
			e.preventDefault();
			
			this.dispatchEvent({ 
				type: Code.PhotoSwipe.ViewportClass.EventTypes.onTouch, 
				target: this, 
				action: Code.PhotoSwipe.ViewportClass.Actions.touchMove,
				point: Util.DOM.getMousePosition(e)
			});
					
		},
		
		
		/*
		 * Function: onMouseUp
		 */
		onMouseUp: function(e){
		
			e.preventDefault();
			
			Util.DOM.removeEventListener(this.el, 'mousemove', this.mouseMoveHandler);
			
			this.fireTouchEvent(this.touchStartPoint, Util.DOM.getMousePosition(e));
			
		},
		
			
		
		
		/*
		 * Function: fireTouchEvent
		 */
		fireTouchEvent: function(touchStartPoint, touchEndPoint, waitingForDoubleClick){
			
			var 
				action,
				distance = touchEndPoint.x - touchStartPoint.x;
				
			if (Math.abs(distance) >= this.settings.swipeThreshold){
				
				var 
					endTime = new Date(),
					diffTime = endTime - this.touchStartTime;
			
				if (diffTime > this.settings.swipeTimeThreshold){
					return;
				}
			
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
				
				if (Util.isNothing(this.doubleClickTimeout)){
					
					var self = this;
					this.doubleClickTimeout = window.setTimeout(function(){
						
						self.doubleClickTimeout = null;
						
						self.dispatchEvent({ 
							type: Code.PhotoSwipe.ViewportClass.EventTypes.onTouch, 
							target: self, 
							action: Code.PhotoSwipe.ViewportClass.Actions.click,
							point: touchEndPoint				
						});
						
					}, this.settings.doubleClickSpeed);
					
					return;
					
				}
				else{
					
					window.clearTimeout(this.doubleClickTimeout);
					this.doubleClickTimeout = null;
					action = Code.PhotoSwipe.ViewportClass.Actions.doubleClick;
					
				}
				
				
			}
			
			if (Util.isNothing(action)){
				return;
			}
			
			this.dispatchEvent({ 
				type: Code.PhotoSwipe.ViewportClass.EventTypes.onTouch, 
				target: this, 
				action: action,
				point: touchEndPoint						
			});
			
		}
		
	});
	
	
	Code.PhotoSwipe.ViewportClass.CssClasses = {
		viewport: 'ps-viewport'
	};
	
	
	Code.PhotoSwipe.ViewportClass.Actions = {
		click: 'click',
		doubleClick: 'doubleClick',
		swipeLeft: 'swipeLeft',
		swipeRight: 'swipeRight',
		touchStart: 'touchStart',
		touchMove: 'touchMove',
		touchEnd: 'touchEnd',
		gestureStart: 'gestureStart',
		gestureChange: 'gestureChange',
		gestureEnd: 'gestureEnd'
	};
	
	
	Code.PhotoSwipe.ViewportClass.EventTypes = {
		onTouch: 'onTouch'
	};
	
	
})
(
	window,
	Code.PhotoSwipe.Util
);
