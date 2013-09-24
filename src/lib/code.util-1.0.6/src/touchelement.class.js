// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, klass, Util){


	Util.registerNamespace('Code.Util.TouchElement');


	Util.TouchElement.TouchElementClass = klass({

		el: null,

		captureSettings: null,

		touchStartPoint: null,
		touchEndPoint: null,
		touchStartTime: null,
		doubleTapTimeout: null,

		touchStartHandler: null,
		touchMoveHandler: null,
		touchEndHandler: null,

		mouseDownHandler: null,
		mouseMoveHandler: null,
		mouseUpHandler: null,
		mouseOutHandler: null,

		gestureStartHandler: null,
		gestureChangeHandler: null,
		gestureEndHandler: null,

		swipeThreshold: null,
		swipeTimeThreshold: null,
		doubleTapSpeed: null,



		/*
		 * Function: dispose
		 */
		dispose: function(){

			var prop;

			this.removeEventHandlers();

			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}

		},



		/*
		 * Function: initialize
		 */
		initialize: function(el, captureSettings){

			this.el = el;

			this.captureSettings = {
				swipe: false,
				move: false,
				gesture: false,
				doubleTap: false,
				preventDefaultTouchEvents: true,
				allowVerticalScroll:false
			};

			Util.extend(this.captureSettings, captureSettings);

			this.swipeThreshold = 50;
			this.swipeTimeThreshold = 250;
			this.doubleTapSpeed = 250;

			this.touchStartPoint = { x: 0, y: 0 };
			this.touchEndPoint = { x: 0, y: 0 };

		},



		/*
		 * Function: addEventHandlers
		 */
		addEventHandlers: function(){

			if (Util.isNothing(this.touchStartHandler)){
				this.touchStartHandler = this.onTouchStart.bind(this);
				this.touchMoveHandler = this.onTouchMove.bind(this);
				this.touchEndHandler = this.onTouchEnd.bind(this);
				this.mouseDownHandler = this.onMouseDown.bind(this);
				this.mouseMoveHandler = this.onMouseMove.bind(this);
				this.mouseUpHandler = this.onMouseUp.bind(this);
				this.mouseOutHandler = this.onMouseOut.bind(this);
				this.gestureStartHandler = this.onGestureStart.bind(this);
				this.gestureChangeHandler = this.onGestureChange.bind(this);
				this.gestureEndHandler = this.onGestureEnd.bind(this);
			}

			Util.Events.add(this.el, 'touchstart', this.touchStartHandler);
			if (this.captureSettings.move){
				Util.Events.add(this.el, 'touchmove', this.touchMoveHandler);
			}
			Util.Events.add(this.el, 'touchend', this.touchEndHandler);

			Util.Events.add(this.el, 'mousedown', this.mouseDownHandler);

			if (Util.Browser.isGestureSupported && this.captureSettings.gesture){
				var el = this.el
		
				if(Util.Browser.iOS7 && el == window){
					el = document;
				}
				
				Util.Events.add(this.el, 'gesturestart', this.gestureStartHandler);
				Util.Events.add(this.el, 'gesturechange', this.gestureChangeHandler);
				Util.Events.add(this.el, 'gestureend', this.gestureEndHandler);
			}

		},



		/*
		 * Function: removeEventHandlers
		 */
		removeEventHandlers: function(){

			Util.Events.remove(this.el, 'touchstart', this.touchStartHandler);
			if (this.captureSettings.move){
				Util.Events.remove(this.el, 'touchmove', this.touchMoveHandler);
			}
			Util.Events.remove(this.el, 'touchend', this.touchEndHandler);
			Util.Events.remove(this.el, 'mousedown', this.mouseDownHandler);

			if (Util.Browser.isGestureSupported && this.captureSettings.gesture){
				Util.Events.remove(this.el, 'gesturestart', this.gestureStartHandler);
				Util.Events.remove(this.el, 'gesturechange', this.gestureChangeHandler);
				Util.Events.remove(this.el, 'gestureend', this.gestureEndHandler);
			}

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
		 * Function: fireTouchEvent
		 */
		fireTouchEvent: function(e){

			var
				action,
				distX = 0,
				distY = 0,
				dist = 0,
				self,
				endTime,
				diffTime;

			distX = this.touchEndPoint.x - this.touchStartPoint.x;
			distY = this.touchEndPoint.y - this.touchStartPoint.y;
			dist = Math.sqrt( (distX * distX) + (distY * distY) );

			if (this.captureSettings.swipe){
				endTime = new Date();
				diffTime = endTime - this.touchStartTime;

				// See if there was a swipe gesture
				if (diffTime <= this.swipeTimeThreshold){

					if (window.Math.abs(distX) >= this.swipeThreshold){

						Util.Events.fire(this, {
							type: Util.TouchElement.EventTypes.onTouch,
							target: this,
							point: this.touchEndPoint,
							action: (distX < 0) ? Util.TouchElement.ActionTypes.swipeLeft : Util.TouchElement.ActionTypes.swipeRight,
							targetEl: e.target,
							currentTargetEl: e.currentTarget
						});
						return;

					}


					if (window.Math.abs(distY) >= this.swipeThreshold){

						Util.Events.fire(this, {
							type: Util.TouchElement.EventTypes.onTouch,
							target: this,
							point: this.touchEndPoint,
							action: (distY < 0) ? Util.TouchElement.ActionTypes.swipeUp : Util.TouchElement.ActionTypes.swipeDown,
							targetEl: e.target,
							currentTargetEl: e.currentTarget
						});
						return;

					}

				}
			}


			if (dist > 1){

				Util.Events.fire(this, {
					type: Util.TouchElement.EventTypes.onTouch,
					target: this,
					action: Util.TouchElement.ActionTypes.touchMoveEnd,
					point: this.touchEndPoint,
					targetEl: e.target,
					currentTargetEl: e.currentTarget
				});
				return;
			}


			if (!this.captureSettings.doubleTap){

				Util.Events.fire(this, {
					type: Util.TouchElement.EventTypes.onTouch,
					target: this,
					point: this.touchEndPoint,
					action: Util.TouchElement.ActionTypes.tap,
					targetEl: e.target,
					currentTargetEl: e.currentTarget
				});
				return;

			}

			if (Util.isNothing(this.doubleTapTimeout)){

				this.doubleTapTimeout = window.setTimeout(function(){

					this.doubleTapTimeout = null;

					Util.Events.fire(this, {
						type: Util.TouchElement.EventTypes.onTouch,
						target: this,
						point: this.touchEndPoint,
						action: Util.TouchElement.ActionTypes.tap,
						targetEl: e.target,
						currentTargetEl: e.currentTarget
					});

				}.bind(this), this.doubleTapSpeed);

				return;

			}
			else{

				window.clearTimeout(this.doubleTapTimeout);
				this.doubleTapTimeout = null;

				Util.Events.fire(this, {
					type: Util.TouchElement.EventTypes.onTouch,
					target: this,
					point: this.touchEndPoint,
					action: Util.TouchElement.ActionTypes.doubleTap,
					targetEl: e.target,
					currentTargetEl: e.currentTarget
				});

			}

		},



		/*
		 * Function: onTouchStart
		 */
		onTouchStart: function(e){

			if (this.captureSettings.preventDefaultTouchEvents && !this.captureSettings.allowVerticalScroll){
				e.preventDefault();
			}

			// No longer need mouse events
			Util.Events.remove(this.el, 'mousedown', this.mouseDownHandler);

			var
				touchEvent = Util.Events.getTouchEvent(e),
				touches = touchEvent.touches;

			if (touches.length > 1 && this.captureSettings.gesture){
				this.isGesture = true;
				return;
			}

			this.touchStartTime = new Date();
			this.isGesture = false;
			this.touchStartPoint = this.getTouchPoint(touches);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchStart,
				point: this.touchStartPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});


		},



		/*
		 * Function: onTouchMove
		 */
		onTouchMove: function(e){



			if (this.isGesture && this.captureSettings.gesture){
				return;
			}

			var
				touchEvent = Util.Events.getTouchEvent(e),
				touches = touchEvent.touches;

			var point = this.getTouchPoint(touches);

			if(this.captureSettings.allowVerticalScroll && Math.abs(this.touchStartPoint.x - point.x) < Math.abs(this.touchStartPoint.y - point.y)){
				return;
			}

			if (this.captureSettings.preventDefaultTouchEvents){
				e.preventDefault();
			}

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchMove,
				point: point,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onTouchEnd
		 */
		onTouchEnd: function(e){

			if (this.isGesture && this.captureSettings.gesture){
				return;
			}

			// http://backtothecode.blogspot.com/2009/10/javascript-touch-and-gesture-events.html
			// iOS removed the current touch from e.touches on "touchend"
			// Need to look into e.changedTouches

			var
				touchEvent = Util.Events.getTouchEvent(e),
				touches = (!Util.isNothing(touchEvent.changedTouches)) ? touchEvent.changedTouches : touchEvent.touches;



			this.touchEndPoint = this.getTouchPoint(touches);

			if(this.captureSettings.allowVerticalScroll && Math.abs(this.touchStartPoint.x - this.touchEndPoint.x) < Math.abs(this.touchStartPoint.y - this.touchEndPoint.y)){
				return;
		   }

			if (this.captureSettings.preventDefaultTouchEvents){
				e.preventDefault();
			}

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchEnd,
				point: this.touchEndPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

			this.fireTouchEvent(e);

		},



		/*
		 * Function: onMouseDown
		 */
		onMouseDown: function(e){

			e.preventDefault();

			// No longer need touch events
			Util.Events.remove(this.el, 'touchstart', this.mouseDownHandler);
			Util.Events.remove(this.el, 'touchmove', this.touchMoveHandler);
			Util.Events.remove(this.el, 'touchend', this.touchEndHandler);

			// Add move/up/out
			if (this.captureSettings.move){
				Util.Events.add(this.el, 'mousemove', this.mouseMoveHandler);
			}
			Util.Events.add(this.el, 'mouseup', this.mouseUpHandler);
			Util.Events.add(this.el, 'mouseout', this.mouseOutHandler);

			this.touchStartTime = new Date();
			this.isGesture = false;
			this.touchStartPoint = Util.Events.getMousePosition(e);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchStart,
				point: this.touchStartPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onMouseMove
		 */
		onMouseMove: function(e){

			e.preventDefault();

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchMove,
				point: Util.Events.getMousePosition(e),
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onMouseUp
		 */
		onMouseUp: function(e){

			e.preventDefault();

			if (this.captureSettings.move){
				Util.Events.remove(this.el, 'mousemove', this.mouseMoveHandler);
			}
			Util.Events.remove(this.el, 'mouseup', this.mouseUpHandler);
			Util.Events.remove(this.el, 'mouseout', this.mouseOutHandler);

			this.touchEndPoint = Util.Events.getMousePosition(e);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchEnd,
				point: this.touchEndPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

			this.fireTouchEvent(e);

		},



		/*
		 * Function: onMouseOut
		 */
		onMouseOut: function(e){

			/*
			 * http://blog.stchur.com/2007/03/15/mouseenter-and-mouseleave-events-for-firefox-and-other-non-ie-browsers/
			 */
			var relTarget = e.relatedTarget;
			if (this.el === relTarget || Util.DOM.isChildOf(relTarget, this.el)){
				return;
			}

			e.preventDefault();

			if (this.captureSettings.move){
				Util.Events.remove(this.el, 'mousemove', this.mouseMoveHandler);
			}
			Util.Events.remove(this.el, 'mouseup', this.mouseUpHandler);
			Util.Events.remove(this.el, 'mouseout', this.mouseOutHandler);

			this.touchEndPoint = Util.Events.getMousePosition(e);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchEnd,
				point: this.touchEndPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

			this.fireTouchEvent(e);

		},



		/*
		 * Function: onGestureStart
		 */
		onGestureStart: function(e){

			e.preventDefault();

			var touchEvent = Util.Events.getTouchEvent(e);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.gestureStart,
				scale: touchEvent.scale,
				rotation: touchEvent.rotation,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onGestureChange
		 */
		onGestureChange: function(e){

			e.preventDefault();

			var touchEvent = Util.Events.getTouchEvent(e);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.gestureChange,
				scale: touchEvent.scale,
				rotation: touchEvent.rotation,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onGestureEnd
		 */
		onGestureEnd: function(e){

			e.preventDefault();

			var touchEvent = Util.Events.getTouchEvent(e);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.gestureEnd,
				scale: touchEvent.scale,
				rotation: touchEvent.rotation,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		}



	});



}
(
	window,
	window.klass,
	window.Code.Util
));
