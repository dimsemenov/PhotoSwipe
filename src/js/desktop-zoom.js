/**
 * Zooming image on desktop and paning it with mouse wheel or trackpad.
 */

var _wheelDelta;
	// _trackpadSwipeThrottleTimeout,
	// _trackpadSwipePrev,
	// _trackpadLastEventTime,
	// _trackpadRunning,
	// _trackpadLastActionTime,
	// _trackpadDir;
	//_didAction;

_registerModule('DesktopZoom', {

	publicMethods: {
		handleMouseWheel: function(e) {

			if(_currZoomLevel <= self.currItem.fitRatio) {
				return true;
			}
			e.preventDefault();
			e.stopPropagation(); // allow just one event to fire

			// https://developer.mozilla.org/en-US/docs/Web/Events/wheel
			_wheelDelta.x = 0;

			if('deltaX' in e) {
				_wheelDelta.x = e.deltaX;
				_wheelDelta.y = e.deltaY;
			} else if('wheelDelta' in e) {
				if(e.wheelDeltaX) {
					_wheelDelta.x = -0.16 * e.wheelDeltaX;
				} 
				if(e.wheelDeltaY) {
					_wheelDelta.y = -0.16 * e.wheelDeltaY;
				} else {
					_wheelDelta.y = -0.16 * e.wheelDelta;
				}
			} else if('detail' in e) {
				_wheelDelta.y = e.detail;
			} else {
				return;
			}
		

			// TODO: use rAF instead of mousewheel?
			_calculatePanBounds(_currZoomLevel, true);
			self.panTo(_panOffset.x - _wheelDelta.x, _panOffset.y - _wheelDelta.y);

			/*
				// Experimental attempt to implement touchpad swipe gesture.
				// Didn't work as good as expected due to enreliable deceleration speed across different touchpads.
				// left for history
				
				if(!_trackpadDir) { 
					if(!_wheelDelta.y) {
						_trackpadDir = 'x';
					} else {
						if(Math.abs(_wheelDelta.y - _wheelDelta.x) > 10) {
							_trackpadDir = _wheelDelta.y > _wheelDelta.x ? 'y' : 'x';
						}
					}
				}
				if(!_trackpadDir) {
					return;
				}
				var delta = _wheelDelta[_trackpadDir];
				if(delta && Math.abs(delta) > 10) {
					
					var timeDiff = _getCurrentTime() - _trackpadLastEventTime;
					_trackpadLastEventTime = _getCurrentTime();

					if(timeDiff < 200 && _trackpadSwipePrev === (delta > 0)) {
						return;
					}
					
					_trackpadSwipePrev = (delta > 0);
					self[_trackpadSwipePrev ? 'next' : 'prev' ]();
				}
			*/
		},
		toggleDesktopZoom: function(centerPoint) {

			centerPoint = centerPoint || {x:_viewportSize.x/2, y:_viewportSize.y/2 + _initalWindowScrollY };
			var zoomOut = _currZoomLevel === 1;
			
			self.mouseZoomedIn = !zoomOut;


			self.zoomTo(zoomOut ? self.currItem.initialZoomLevel : 1, centerPoint, 333);
			framework[ (!zoomOut ? 'add' : 'remove') + 'Class'](template, 'pswp--zoomed-in');
		},
		setupDesktopZoom: function(onInit) {

			_wheelDelta = {};
			var events = 'wheel mousewheel DOMMouseScroll';
			

			_listen('bindEvents', function() {
				framework.bind(template, events,  self.handleMouseWheel);
			});
			_listen('unbindEvents', function() {
				if(_wheelDelta) {
					framework.unbind(template, events, self.handleMouseWheel);
				}
			});

			self.mouseZoomedIn = false;

			var hasDraggingClass,
				updateZoomable = function() {
					if(self.mouseZoomedIn) {
						framework.removeClass(template, 'pswp--zoomed-in');
						self.mouseZoomedIn = false;
					}
					if(_currZoomLevel < 1) {
						framework.addClass(template, 'pswp--zoom-allowed');
					} else {
						framework.removeClass(template, 'pswp--zoom-allowed');
					}
					removeDraggingClass();
				},
				removeDraggingClass = function() {
					if(hasDraggingClass) {
						framework.removeClass(template, 'pswp--dragging');
						hasDraggingClass = false;
					}
				};

			_listen('resize' , updateZoomable);
			_listen('afterChange' , updateZoomable);
			_listen('pointerDown', function() {
				if(self.mouseZoomedIn) {
					hasDraggingClass = true;
					framework.addClass(template, 'pswp--dragging');
				}
			});
			_listen('pointerUp', removeDraggingClass);

			if(!onInit) {
				updateZoomable();
			}
			
		},
		initDesktopZoom: function() {

			if(_oldIE) {
				// no zoom for old IE (<=8)
				return;
			}

			if(_likelyTouchDevice) {
				_listen('mouseUsed', function() {
					self.setupDesktopZoom();
				});
			} else {
				self.setupDesktopZoom(true);
			}

			
			

		}

	}
});
