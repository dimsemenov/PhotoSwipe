//function(template, UiClass, items, options)

/* Core module. Contains swipe and pinch-zoom logic. */


var self = this;


/**
 * Static vars, don't change unless you know what you're doing.
 */
var DOUBLE_TAP_RADIUS = 25, 
	NUM_HOLDERS = 3;

/**
 * Options
 */
var _options = {
	allowPanToNext:true, // Allow navigation to next/prev item when current item is zoomed (using swipe gesture). Option is always false on non-touch devices.
	spacing: 0.12, // Spacing ratio between slides (during swipe). For example, 0.12 will render as a 12% of sliding viewport.
	bgOpacity: 1,
	
	mouseUsed: false,
	loop: true,
	pinchToClose: true,

	closeOnScroll: true,
	closeOnVerticalDrag: true,

	hideAnimationDuration: 333,
	showAnimationDuration: 333,
	showHideOpacity: false,

	focus: true,
	
	escKey: true,
	arrowKeys: true,

	mainScrollEndFriction: 0.35,
	panEndFriction: 0.35,

	// not fully implemented yet
	scaleMode: 'fit', // TODO
	modal: true, // TODO
	alwaysFadeIn: false // TODO
};
framework.extend(_options, options);



/**
 * Private helper variables & functions
 */

var _getEmptyPoint = function() { return {x:0,y:0}; };

var _isOpen,
	_isDestroying,
	_closedByScroll,
	_currentItemIndex,
	_containerStyle,
	_containerShiftIndex,
	_lastReleaseTime = 0,
	_currPanDist = _getEmptyPoint(),
	_startPanOffset = _getEmptyPoint(),
	_panOffset = _getEmptyPoint(),
	_centerPoint = _getEmptyPoint(),

	_upMoveEvents, // drag move, drag end & drag cancel events array
	_downEvents, // drag start events array
	_globalEventHandlers,

	
	_viewportSize = {},
	
	_currZoomLevel,
	_startZoomLevel,

	_translatePrefix,
	_translateSufix,

	_updateSizeInterval,

	
	
	_currPositionIndex = 0,
	_currZoomedItemIndex = 0,
	_slideSize = _getEmptyPoint(), // size of slide area, including spacing
	

	_scrollChanged,
	
	_itemHolders,
	_prevItemIndex,
	_indexDiff = 0, // difference of indexes since last content update
	
	_dragStartEvent,
	_dragMoveEvent,
	_dragEndEvent,
	_dragCancelEvent,
	_transformKey,
	_pointerEventEnabled,
	_isFixedPosition = true,
	_likelyTouchDevice,
	_modules = [],
	
	_requestAF,
	_cancelAF,
	_initalClassName,
	_initalWindowScrollY,
	_oldIE,
	_currentWindowScrollY,
	_features,
	_windowVisibleSize = {},

	// Registers PhotoSWipe module (History, Controller ...)
	_registerModule = function(name, module) {
		framework.extend(self, module.publicMethods);
		_modules.push(name);
	},

	_getLoopedId = function(index) {
		var numSlides = _getNumItems();
		if(index > numSlides - 1) {
			return index - numSlides;
		} else  if(index < 0) {
			return numSlides + index;
		}
		return index;
	},

	
	// Micro bind/trigger
	_listeners = {},
	_listen = function(name, fn) {
		if(!_listeners[name]) {
			_listeners[name] = [];
		}
		return _listeners[name].push(fn);
	},
	_shout = function(name) {
		var listeners = _listeners[name];

		if(listeners) {
			var args = Array.prototype.slice.call(arguments);
			args.shift();

			for(var i = 0; i < listeners.length; i++) {
				listeners[i].apply(self, args);
			}
		}
	},

	_getCurrentTime = function() {
		return new Date().getTime();
	},
	_applyBgOpacity = function(opacity) {
		_bgOpacity = opacity;
		self.bg.style.opacity = opacity * _options.bgOpacity;
	},
	
	_applyZoomTransform = function(styleObj,x,y,zoom) {
		styleObj[_transformKey] = _translatePrefix + x + 'px, ' + y + 'px' + _translateSufix + ' scale(' + zoom + ')';;//'scale3d(' + zoom + ',' + zoom + ',1)';//' scale(' + zoom + ')';
	},
	_applyCurrentZoomPan = function() {
		if(_currZoomElementStyle) {
			_applyZoomTransform(_currZoomElementStyle, _panOffset.x, _panOffset.y, _currZoomLevel);
		}
	},
	_applyZoomPanToItem = function(item) {
		_applyZoomTransform(item.container.style, item.initialPosition.x, item.initialPosition.y, item.initialZoomLevel);
	},
	_setTranslateX = function(x, elStyle) {
		elStyle[_transformKey] = _translatePrefix + x + 'px, 0px' + _translateSufix;
	},

	_moveMainScroll = function(x, dragging) {

		if(!_options.loop && dragging) {
			var newSlideIndexOffset = _currentItemIndex + (_slideSize.x * _currPositionIndex - x)/_slideSize.x; // if of current item during scroll (float)
			var delta = Math.round(x - _mainScrollPos.x);

			if( (newSlideIndexOffset < 0 && delta > 0) || 
				(newSlideIndexOffset >= _getNumItems()-1 && delta < 0) ) {
				x = _mainScrollPos.x + delta * _options.mainScrollEndFriction;
			} 
		}
		
		_mainScrollPos.x = x;
		_setTranslateX(x, _containerStyle);
	},
	
	_calculateZoomLevel = function(touchesDistance) {
		return  1 / _startPointsDistance * touchesDistance * _startZoomLevel;
	},
	_calculatePanOffset = function(axis, zoomLevel) {
		var m = _midZoomPoint[axis] - _offset[axis];
		return _startPanOffset[axis] + _currPanDist[axis] + m - m * ( zoomLevel / _startZoomLevel );
	},
	_isEqualPoints = function(p1, p2) {
		return p1.x === p2.x && p1.y === p2.y;
	},
	_isNearbyPoints = function(touch0, touch1) {
		return (Math.abs(touch0.x - touch1.x) < DOUBLE_TAP_RADIUS && Math.abs(touch0.y - touch1.y) < DOUBLE_TAP_RADIUS);
	},
	_equalizePoints = function(p1, p2) {
		p1.x = p2.x;
		p1.y = p2.y;
		if(p2.id) {
			p1.id = p2.id;
		}
	},
	_bindEvents = function() {
		framework.bind(document, 'keydown keyup', self);

		if(!_options.mouseUsed) {
			framework.bind(document, 'mousemove', _onFirstMouseMove);
		}

		framework.bind(window, 'resize scroll', self);

		_shout('bindEvents');
	},
	_unbindEvents = function() {
		framework.unbind(window, 'resize', self);
		framework.unbind(window, 'scroll', _globalEventHandlers.scroll);
		framework.unbind(document, 'keydown keyup', self);
		framework.unbind(document, 'mousemove', _onFirstMouseMove);

		if(_isDragging) {
			framework.unbind(window, _upMoveEvents, self);
		}

		_shout('unbindEvents');
	},
	

	_mouseMoveTimeout = null,
	_onFirstMouseMove = function(e) {
		// Wait until mouse move event is fired at least twice during 100ms
		// We do this, because some mobile browsers trigger it on touchstart
		if(_mouseMoveTimeout ) { 
			framework.unbind(document, 'mousemove', _onFirstMouseMove);
			framework.addClass(template, 'pswp--has_mouse');
			_options.mouseUsed = true;
			_shout('mouseUsed');
		}
		_mouseMoveTimeout = setTimeout(function() {
			_mouseMoveTimeout = null;
		}, 100);
	},
	
	_calculatePanBounds = function(zoomLevel, update) {
		var bounds = _calculateItemSize( self.currItem, _viewportSize, zoomLevel );
		if(update) {
			_currPanBounds = bounds;
		}
		return bounds;
	},

	// Return true if offset is out of the bounds
	_isOutOfBounds = function(axis, destPanBounds, destPanOffset, destZoomLevel) {
		if(destZoomLevel === self.currItem.initialZoomLevel) {
			destPanOffset[axis] = self.currItem.initialPosition[axis];
			return true;
		} else {
			destPanOffset[axis] = _calculatePanOffset(axis, destZoomLevel); 

			if(destPanOffset[axis] > destPanBounds.min[axis]) {
				destPanOffset[axis] = destPanBounds.min[axis];
				return true;
			} else if(destPanOffset[axis] < destPanBounds.max[axis] ) {
				destPanOffset[axis] = destPanBounds.max[axis];
				return true;
			}
		}
		return false;
	};


	



// Micro animation engine
var _animations = {},
	_numAnimations = 0,
	_stopAnimation = function(name) {
		if(_animations[name]) {
			if(_animations[name].raf) {
				_cancelAF( _animations[name].raf );
			}
			_numAnimations--;
			delete _animations[name];
		}
	},
	_registerStartAnimation = function(name) {
		if(_animations[name]) {
			_stopAnimation(name);
		}
		if(!_animations[name]) {
			_numAnimations++;
			_animations[name] = {};
		}
	},
	_stopAllAnimations = function() {
		for (var prop in _animations) {

			if( _animations.hasOwnProperty( prop ) ) {
				_stopAnimation(prop);
			} 
			
		}
	},
	_animateProp = function(name, b, endProp, d, easingFn, onUpdate, onComplete) {
		var startAnimTime = _getCurrentTime(), t;
		_registerStartAnimation(name);

		var animloop = function(){
			if ( _animations[name] ) {
				
				t = _getCurrentTime() - startAnimTime; // time diff
				//b - beginning (start prop)
				//d - anim duration

				if ( t >= d ) {
					_stopAnimation(name);
					onUpdate(endProp);
					if(onComplete) {
						onComplete();
					}
					return;
				}
				onUpdate( (endProp - b) * easingFn(t/d) + b );

				_animations[name].raf = _requestAF(animloop);
			}
		};
		animloop();
	},




	_showOrHideTimeout,
	/**
	 * Function manages open/close transitions of gallery
	 */
	_showOrHide = function(item, img, out, completeFn) {

		if(_showOrHideTimeout) {
			clearTimeout(_showOrHideTimeout);
		}

		_initialZoomRunning = true;
		_initialContentSet = true;
		
		var thumbBounds; // dimensions of small thumbnail ({x:,y:,w:}), height is optional, as calculated based on large image
		if(item.initialLayout) {
			thumbBounds = item.initialLayout;
			item.initialLayout = null;
		} else {
			thumbBounds = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
		}


		var complete = function() {

			_stopAnimation('initialZoom');
	 		if(!out) {
	 			_applyBgOpacity(1);
	 			if(img) {
	 				img.style.display = 'block';
	 			}
	 			framework.addClass(template, 'pswp--animated-in');
	 			_shout('initialZoomInEnd');
	 		}
			if(completeFn) {
				completeFn();
			}
			_initialZoomRunning = false;
		};

		var duration = out ? _options.hideAnimationDuration : _options.showAnimationDuration;



		// if bounds aren't provided, just open gallery without animation
		if(!thumbBounds || thumbBounds.x === undefined || !duration ) {
			_shout('initialZoom' + (out ? 'Out' : 'In') );
			
	 		_currZoomLevel = item.initialZoomLevel;
			_equalizePoints(_panOffset,  item.initialPosition );
			_applyCurrentZoomPan();


			// if(_options.showHideDuration) {
			// 	if(!out) {
			// 		complete();
			// 	}
			// 	// simple opacity transition
			// 	_showOrHideTimeout = setTimeout(function() {
			// 		if(_options.showHideOpacity) {
			// 			template.style.opacity = out ? 0 : 1;
			// 		}

			// 		if(out) {
			// 			_showOrHideTimeout = setTimeout(function() {
			// 				complete();
			// 			}, _options.showHideDuration + 20);
			// 		}
						
			// 	}, out ? 15 : 50);
			// } else {
				// no transition
				template.style.opacity = out ? 0 : 1;
				_applyBgOpacity(1);
				complete();
			//}
			
			return false;
		}


		
		// apply hw-acceleration to image
		if(item.miniImg) {
			item.miniImg.style.webkitBackfaceVisibility = 'hidden';
		}

		if(!out) {
			_currZoomLevel = thumbBounds.w / item.w;
			_panOffset.x = thumbBounds.x;
			_panOffset.y = thumbBounds.y - _initalWindowScrollY;

			if(_options.showHideOpacity) {
				template.style.opacity = 0.001;
				template.style.webkitBackfaceVisibility = 'hidden';
				//template.style.webkitTransition = 'opacity 0.3s linear';
			}
			_applyCurrentZoomPan();
		}

		_registerStartAnimation('initialZoom');
		

		if(out && !_closedByScroll) {
		 	framework.removeClass(template, 'pswp--animated-in');
		}

		
		_showOrHideTimeout = setTimeout(function() {

			_shout('initialZoom' + (out ? 'Out' : 'In') );
			

			if(!out) {

				// "in" animation always uses CSS transitions (instead of rAF)
				// CSS transition works faster here, as we may also want to animate other things, like ui on top of sliding area, which can be animated just via CSS
				_currZoomLevel = item.initialZoomLevel;
				_equalizePoints(_panOffset,  item.initialPosition );
				_applyCurrentZoomPan();
				_applyBgOpacity(1);

				if(_options.showHideOpacity) {
					template.style.opacity = 1;
				} else {
					_applyBgOpacity(1);
				}

				_showOrHideTimeout = setTimeout(complete, duration + 20);
			} else {

				// "out" animation uses rAF only when PhotoSwipe is closed by browser scroll, to recalculate position
				var destZoomLevel = thumbBounds.w / item.w,
					initialPanOffset = {
						x: _panOffset.x,
						y: _panOffset.y
					},
					initialZoomLevel = _currZoomLevel,
					scrollY = _initalWindowScrollY,
					initalBgOpacity = _bgOpacity,
					onUpdate = function(now) {
						if(_scrollChanged) {
							scrollY = framework.getScrollY();
							_scrollChanged = false;
						}
						
						if(now === 1) {
							_currZoomLevel = destZoomLevel;
							_panOffset.x = thumbBounds.x;
							_panOffset.y = thumbBounds.y  - scrollY;
							if(_closedByScroll) {
								complete();
							}
						} else {
							_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
							_panOffset.x = (thumbBounds.x - initialPanOffset.x) * now + initialPanOffset.x;
							_panOffset.y = (thumbBounds.y - scrollY - initialPanOffset.y) * now + initialPanOffset.y;
						}
						
						_applyCurrentZoomPan();
						if(_options.showHideOpacity) {
							template.style.opacity = 1 - now;
						} else {
							_applyBgOpacity( initalBgOpacity - now * initalBgOpacity );
						}

						//_applyBgOpacity( initalBgOpacity - now * initalBgOpacity );
					};

				if(_closedByScroll) {
					_animateProp('initialZoom', 0, 1, duration, framework.easing.cubic.out/*sine.inOut*/, onUpdate);
				} else {
					onUpdate(1);
					_showOrHideTimeout = setTimeout(complete, duration + 20);
				}
			}
		
		}, out ? 25 : 90); // Main purpose of this delay is to give browser time to paint and
				// create composite layers of PhotoSwipe UI parts (background, controls, caption, arrows).
				// Which avoids lag at the beginning of scale transition.
	
	

		return true;
	};
	


var publicMethods = {

	// make a few local variables and functions public
	shout: _shout,
	listen: _listen,
	viewportSize: _viewportSize,
	options: _options,

	isMainScrollAnimating: function() {
		return _mainScrollAnimating;
	},
	getZoomLevel: function() {
		return _currZoomLevel;
	},
	getCurrentIndex: function() {
		return _currentItemIndex;
	},
	isDragging: function() {
		return _isDragging;
	},	
	isZooming: function() {
		return _isZooming;
	},
	applyZoomPan: function(zoomLevel,panX,panY) {
		_panOffset.x = panX;
		_panOffset.y = panY;
		_currZoomLevel = zoomLevel;
		_applyCurrentZoomPan();
	},

	init: function() {
		if(_isOpen || _isDestroying) return;


		var i;

		self.framework = framework; // basic function
		self.template = template; // root DOM element of PhotoSwipe
		self.bg = template.children[0];

		_initalClassName = template.className;
		_isOpen = true;
				
		_features = framework.detectFeatures();
		_requestAF = _features.raf;
		_cancelAF = _features.caf;
		_transformKey = _features.transform;
		_oldIE = _features.oldIE;
		
		self.scrollWrap = template.children[1];
		self.container = self.scrollWrap.children[0];
		_containerStyle = self.container.style; // for fast access


		if(!_transformKey) {
			// Override zoom/pan/move functions in case old browser is used (most likely IE)
			
			_transformKey = 'left';
			framework.addClass(template, 'pswp--ie');

			_setTranslateX = function(x, elStyle) {
				elStyle.left = x + 'px';
			};
			_applyZoomPanToItem = function(item) {

				var s = item.container.style,
					w = item.fitRatio * item.w,
					h = item.fitRatio * item.h;

				s.width = w + 'px';
				s.height = h + 'px';
				s.left = item.initialPosition.x + 'px';
				s.top = item.initialPosition.y + 'px';

			};
			_applyCurrentZoomPan = function() {
				if(_currZoomElementStyle) {
					
					var s = _currZoomElementStyle;
					var item = self.currItem;


					var w = item.fitRatio * item.w;
					var h = item.fitRatio * item.h;

					s.width = w + 'px';
					s.height = h + 'px';


					s.left = _panOffset.x + 'px';
					s.top = _panOffset.y + 'px';
				}
				
			};
		} else {
			// setup 3d transforms
			var allow3dTransform = _features.perspective && !_likelyTouchDevice;
			_translatePrefix = 'translate' + (allow3dTransform ? '3d(' : '(');
			_translateSufix = _features.perspective ? ', 0px)' : ')';			
		}


		// helper function that builds touch/pointer/mouse events
		var addEventNames = function(pref, down, move, up, cancel) {
			_dragStartEvent = pref + down;
			_dragMoveEvent = pref + move;
			_dragEndEvent = pref + up;
			if(cancel) {
				_dragCancelEvent = pref + cancel;
			} else {
				_dragCancelEvent = '';
			}
		};

		// Objects that hold slides (there are only 3 in DOM)
		_itemHolders = [
			{el:self.container.children[0] , wrap:0, index: -1},
			{el:self.container.children[1] , wrap:0, index: -1},
			{el:self.container.children[2] , wrap:0, index: -1}
		];

		// hide nearby item holders until initial zoom animation finishes (to avoid extra Paints)
		_itemHolders[0].el.style.display = _itemHolders[2].el.style.display = 'none';



		_pointerEventEnabled = _features.pointerEvent;
		if(_pointerEventEnabled && _features.touch) {
			// we don't need touch events, if browser supports pointer events
			_features.touch = false;
		}
		
		if(_pointerEventEnabled) {
			if(navigator.pointerEnabled) {
				addEventNames( 'pointer', 'down', 'move', 'up', 'cancel' );
			} else {
				// IE10 pointer events are case-sensitive
				addEventNames( 'MSPointer', 'Down', 'Move', 'Up', 'Cancel');
			}
		} else if(_features.touch) {
			addEventNames('touch', 'start', 'move', 'end', 'cancel');
			_likelyTouchDevice = true;
		} else {
			addEventNames('mouse', 'down', 'move', 'up');	
		}

		_upMoveEvents = _dragMoveEvent + ' ' + _dragEndEvent  + ' ' +  _dragCancelEvent;
		_downEvents = _dragStartEvent;

		if(_pointerEventEnabled && !_likelyTouchDevice) {
			_likelyTouchDevice = (navigator.maxTouchPoints > 1) || (navigator.msMaxTouchPoints > 1);
		}
		self.likelyTouchDevice = _likelyTouchDevice; // make variable public
		
		// disable show/hide effects on old browsers that don't support CSS animations or transforms (like IE8-9), 
		// old IOS, Android and Opera mobile. Blackberry seems to work fine, even older models.
		if(!_features.animationName || !_features.transform || _features.isOldIOSPhone || _features.isOldAndroid || _features.isMobileOpera ) {
			_options.showAnimationDuration = _options.hideAnimationDuration = 0;
		}

		for(i = 0; i < _modules.length; i++) {
			self['init' + _modules[i]]();
		}
		
		if(UiClass) {
			var ui = self.ui = new UiClass(self, framework);
			ui.init();
		}

		if(!_likelyTouchDevice) {
			// don't allow pan to next slide from zoomed state on Desktop
			_options.allowPanToNext = false;
		}
		
		// Setup events
		_globalEventHandlers = {
			resize: self.updateSize,
			scroll: function() {

				_scrollChanged = true;

				// "close" on scroll works only on desktop devices, or when mouse is used
				if(_options.closeOnScroll && _isOpen && (!self.likelyTouchDevice || _options.mouseUsed) ) { 

					if(Math.abs(framework.getScrollY() - _initalWindowScrollY) > 2) { // if scrolled for more than 2px
						_closedByScroll = true;
						self.close();
					}
					
				}
			},
			keyup: function(e) {
				if(_options.escKey && e.keyCode === 27) { // esc key
					self.close();
				}
			},
			keydown: function(e) {
				if(_options.arrowKeys) {
					if(e.keyCode === 37) {
						self.prev();
					} else if(e.keyCode === 39) {
						self.next();
					}
				}
			}
		};
		_globalEventHandlers[_dragStartEvent] = _onDragStart;
		_globalEventHandlers[_dragMoveEvent] = _onDragMove;
		_globalEventHandlers[_dragEndEvent] = _onDragRelease; // the Kraken


		if(_dragCancelEvent) {
			_globalEventHandlers[_dragCancelEvent] = _globalEventHandlers[_dragEndEvent];
		}


		// Bind mouse events on device with detected hardware touch support, in case it supports multiple types of input.
		if(_features.touch) {
			_downEvents += ' mousedown';
			_upMoveEvents += 'mousemove mouseup';
			_globalEventHandlers.mousedown = _globalEventHandlers[_dragStartEvent];
			_globalEventHandlers.mousemove = _globalEventHandlers[_dragMoveEvent];
			_globalEventHandlers.mouseup = _globalEventHandlers[_dragEndEvent];
		}

		_shout('firstUpdate');
		_currentItemIndex = _currentItemIndex || _options.index || 0;
		// validate index
		if( isNaN(_currentItemIndex) || _currentItemIndex < 0 || _currentItemIndex >= _getNumItems() ) {
			_currentItemIndex = 0;
		}
		self.currItem = _getItemAt( _currentItemIndex );

		
		if(_features.isOldIOSPhone || _features.isOldAndroid) {
			_isFixedPosition = false;
		}
		
		if(_options.modal) {
			template.setAttribute('aria-hidden', 'false');
			if(!_isFixedPosition) {
				template.style.position = 'absolute';
				template.style.top = framework.getScrollY() + 'px';
			} else {
				template.style.position = 'fixed';
			}
		}

		if(_currentWindowScrollY === undefined) {
			_shout('initialLayout');
			_currentWindowScrollY = _initalWindowScrollY = framework.getScrollY();
		}
		
		// add classes to root element of PhotoSwipe
		var rootClasses = 'pswp--open ';
		if(_options.mainClass) {
			rootClasses += _options.mainClass + ' ';
		}
		if(_options.showHideOpacity) {
			rootClasses += 'pswp--animate_opacity ';
		}
		rootClasses += _likelyTouchDevice ? 'pswp--touch' : 'pswp--notouch';
		rootClasses += _features.animationName ? ' pswp--css_animation' : '';
		rootClasses += _features.svg ? ' pswp--svg' : '';
		framework.addClass(template, rootClasses);

		self.updateSize();
		

		// initial update
		_containerShiftIndex = -1;
		_indexDiff = null;
		for(i = 0; i < NUM_HOLDERS; i++) {
			_setTranslateX( (i+_containerShiftIndex) * _slideSize.x, _itemHolders[i].el.style);
		}



		if(!_oldIE) {
			framework.bind(self.scrollWrap, _downEvents, self); // no dragging for old IE
		}	

		_listen('initialZoomInEnd', function() {
			self.setContent(_itemHolders[0], _currentItemIndex-1);
		 	self.setContent(_itemHolders[2], _currentItemIndex+1);

		 	_itemHolders[0].el.style.display = _itemHolders[2].el.style.display = 'block';

		 	if(_options.focus) {
		 		// focus causes layout, which causes lag during animation, that's why we delay it till the initial zoom transition ends
				template.focus();
		 	}
		 	 

			_bindEvents();
		});

		self.setContent(_itemHolders[1], _currentItemIndex);
		
		self.updateCurrItem();

		_shout('afterInit');

		if(!_isFixedPosition) {
			// On all versions of iOS lower than 8.0, we check size of viewport every second
			// This is done to detect when Safari top & bottom bars appear, as this action doesn't trigger any events (like resize). 
			// On iOS8 they fixed this.
			// 10 Nov 2014: iOS 7 usage ~40%. iOS 8 usage 56%.
			_updateSizeInterval = setInterval(function() {
				if(!_numAnimations && !_isDragging && !_isZooming && (_currZoomLevel === self.currItem.initialZoomLevel)  ) {
					self.updateSize();
				}
			}, 1000);
		}

		framework.addClass(template, 'pswp--visible');
	},

	// Closes the gallery, then destroy it
	close: function() {
		if(!_isOpen) return;

		_isOpen = false;
		_isDestroying = true;
		_shout('close');
		_unbindEvents();

		_showOrHide( self.currItem, null, true, self.destroy);
	},

	// destroys gallery (unbinds events, cleans up intervals and timeouts to avoid memory leaks)
	destroy: function() {
		_shout('destroy');

		if(_showOrHideTimeout) {
			clearTimeout(_showOrHideTimeout);
		}
		
		if(_options.modal) {
			template.setAttribute('aria-hidden', 'true');
			template.className = _initalClassName;
		}

		if(_updateSizeInterval) {
			clearInterval(_updateSizeInterval);
		}

		framework.unbind(self.scrollWrap, _downEvents, self);

		// we unbind lost event at the end, as closing animation may depend on it
		framework.unbind(window, 'scroll', self);

		_stopDragUpdateLoop();

		_stopAllAnimations();

		_listeners = null;
	},

	// TODO: pan via mousemove instead of drag?
	// mouseMovePan: function(x,y) {
	// 
	// 	if(!isMouseMoving) {
	// 		forceRenderMovement = true;
	// 		isMouseMoving = true;
	// 	}
	// 	// 60 px is the starting coordinate
	// 	// e.g. if width of window is 1024px, mouse move will work from 60px to 964px (1024 - 60)
	// 	var DIST = 60;  
	// 	var percentX = 1 - x / (_viewportSize.x - DIST*2) + DIST/(_viewportSize.x-DIST*2),
	// 		percentY = 1 - y / (_viewportSize.y - DIST*2) + DIST/(_viewportSize.y-DIST*2);
	// 	mouseMovePos.x = (_currPanBounds.min.x - _currPanBounds.max.x) * percentX - _currPanBounds.min.x;
	// 	mouseMovePos.y = (_currPanBounds.min.y - _currPanBounds.max.y) * percentY - _currPanBounds.min.y;
	// },

	/**
	 * Pan image to position
	 * @param  {Number}  x     
	 * @param  {Number}  y     
	 * @param  {Boolean} force 	Will ignore bounds if set to true.
	 */
	panTo: function(x,y,force) {
		if(!force) {
			if(x > _currPanBounds.min.x) {
				x = _currPanBounds.min.x;
			} else if(x < _currPanBounds.max.x) {
				x = _currPanBounds.max.x;
			}

			if(y > _currPanBounds.min.y) {
				y = _currPanBounds.min.y;
			} else if(y < _currPanBounds.max.y) {
				y = _currPanBounds.max.y;
			}
		}
		
		_panOffset.x = x;
		_panOffset.y = y;
		_applyCurrentZoomPan();
	},
	
	handleEvent: function (e) {
		e = e || window.event;
		if(_globalEventHandlers[e.type]) {
			_globalEventHandlers[e.type](e);
		}
	},


	goTo: function(index) {

		index = _getLoopedId(index);

		var diff = index - _currentItemIndex;
		_indexDiff = diff;

		_currentItemIndex = index;
		self.currItem = _getItemAt( _currentItemIndex );
		_currPositionIndex -= diff;
		
		_moveMainScroll(_slideSize.x * _currPositionIndex);
		

		_stopAllAnimations();
		_mainScrollAnimating = false;

		self.updateCurrItem();
	},
	next: function() {
		self.goTo( _currentItemIndex + 1);
	},
	prev: function() {
		self.goTo( _currentItemIndex - 1);
	},

	updateCurrItem: function(beforeAnimation) {

		if(_indexDiff === 0) {
			return;
		}

		var diffAbs = Math.abs(_indexDiff),
			tempHolder;

		if(beforeAnimation && diffAbs < 2) {
			return;
		}


		self.currItem = _getItemAt( _currentItemIndex );
		
		_shout('beforeChange', _indexDiff);

		if(diffAbs >= NUM_HOLDERS) {
			_containerShiftIndex += _indexDiff + (_indexDiff > 0 ? -NUM_HOLDERS : NUM_HOLDERS);
			diffAbs = NUM_HOLDERS;
		}
		for(var i = 0; i < diffAbs; i++) {
			if(_indexDiff > 0) {
				tempHolder = _itemHolders.shift();
				_itemHolders[NUM_HOLDERS-1] = tempHolder; // move first to last

				_containerShiftIndex++;
				_setTranslateX( (_containerShiftIndex+2) * _slideSize.x, tempHolder.el.style);
				self.setContent(tempHolder, _currentItemIndex - diffAbs + i + 1 + 1);
			} else {
				tempHolder = _itemHolders.pop();
				_itemHolders.unshift( tempHolder ); // move last to first

				_containerShiftIndex--;
				_setTranslateX( _containerShiftIndex * _slideSize.x, tempHolder.el.style);
				self.setContent(tempHolder, _currentItemIndex + diffAbs - i - 1 - 1);
			}
			
		}

		// reset zoom/pan on previous item
		if(_currZoomElementStyle && Math.abs(_indexDiff) === 1) {

			var prevItem = _getItemAt(_prevItemIndex);
			if(prevItem.initialZoomLevel !== _currZoomLevel) {
				_calculateItemSize(prevItem , _viewportSize );
				_applyZoomPanToItem( prevItem ); 

			}

		}

		// itemHolder[1] is middle (current) item
		if(_itemHolders[1].el.children.length) {
			var zoomElement = _itemHolders[1].el.children[0];
			if( framework.hasClass(zoomElement, 'pswp__zoom-wrap') ) {
				_currZoomElementStyle = zoomElement.style;
			} else {
				_currZoomElementStyle = null;
			}
		} else {
			_currZoomElementStyle = null;
		}

		// reset diff after update
		_indexDiff = 0;
		
		_currPanBounds = self.currItem.bounds;	
		_startZoomLevel = _currZoomLevel = self.currItem.initialZoomLevel;

		_panOffset.x = _currPanBounds.center.x;
		_panOffset.y = _currPanBounds.center.y;

		_prevItemIndex = _currentItemIndex;

		_shout('afterChange');
	},




	updateSize: function(force) {
		
		if(!_isFixedPosition) {
			var windowScrollY = framework.getScrollY();
			if(_currentWindowScrollY !== windowScrollY) {
				template.style.top = windowScrollY + 'px';
				_currentWindowScrollY = windowScrollY;
			}
			if(!force && _windowVisibleSize.x === window.innerWidth && _windowVisibleSize.y === window.innerHeight) {
				return;
			}
			_windowVisibleSize.x = window.innerWidth;
			_windowVisibleSize.y = window.innerHeight;

			//template.style.width = _windowVisibleSize.x + 'px';
			template.style.height = _windowVisibleSize.y + 'px';
		}

		_viewportSize.x = self.scrollWrap.clientWidth;
		_viewportSize.y = self.scrollWrap.clientHeight;

		
		_offset = {x:0,y:_currentWindowScrollY};//framework.getOffset(template); 

		_slideSize.x = _viewportSize.x + Math.round(_viewportSize.x * _options.spacing);
		_slideSize.y = _viewportSize.y;

		_moveMainScroll(_slideSize.x * _currPositionIndex);

		// don't re-calculate size on inital size update
		if(_containerShiftIndex !== undefined) {
			for(var i = 0; i < NUM_HOLDERS; i++) {
				_setTranslateX( (i+_containerShiftIndex) * _slideSize.x, _itemHolders[i].el.style);

				// update zoom level on items
				var index = _getLoopedId( _currentItemIndex - 1 + i );
				var item = _getItemAt(index);
				if(item && item.container) {
					_calculateItemSize(item, _viewportSize);
					_applyZoomPanToItem( item );
				}
				
			}
		}	

		_startZoomLevel = _currZoomLevel = self.currItem.initialZoomLevel;
		_currPanBounds = self.currItem.bounds;

		if(_currPanBounds) {
			_panOffset.x = _currPanBounds.center.x;
			_panOffset.y = _currPanBounds.center.y;
			_applyCurrentZoomPan();
		}
		
		_shout('resize');
	},
	
	//Zoom current item to
	zoomTo: function(destZoomLevel, centerPoint, speed, easingFn, updateFn) {
		
		// if(destZoomLevel == 'fit') {
		// 	destZoomLevel = self.currItem.fitRatio;
		// } else if(destZoomLevel == 'fill') {
		// 	destZoomLevel = self.currItem.fillRatio;
		// }

		if(centerPoint) {
			_startZoomLevel = _currZoomLevel;
			_midZoomPoint.x = Math.abs(centerPoint.x) - _panOffset.x ;
			_midZoomPoint.y = Math.abs(centerPoint.y) - _panOffset.y ;
			_equalizePoints(_startPanOffset, _panOffset);
		}

		var destPanBounds = _calculatePanBounds(destZoomLevel, false),
			destPanOffset = {};

		_isOutOfBounds('x', destPanBounds, destPanOffset, destZoomLevel),
		_isOutOfBounds('y', destPanBounds, destPanOffset, destZoomLevel);

		var initialZoomLevel = _currZoomLevel;
		var initialPanOffset = {
			x: _panOffset.x,
			y: _panOffset.y
		};

		//_startZoomLevel = destZoomLevel;
		var onUpdate = function(now) {
			if(now === 1) {
				_currZoomLevel = destZoomLevel;
				_panOffset.x = destPanOffset.x;
				_panOffset.y = destPanOffset.y;
			} else {
				_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
				_panOffset.x = (destPanOffset.x - initialPanOffset.x) * now + initialPanOffset.x;
				_panOffset.y = (destPanOffset.y - initialPanOffset.y) * now + initialPanOffset.y;
			}

			if(updateFn) {
				updateFn(now);
			}

			_applyCurrentZoomPan();
		};

		if(speed) {
			_animateProp('customZoomTo', 0, 1, speed, easingFn || framework.easing.sine.inOut, onUpdate);
		} else {
			onUpdate(1);
		}
	}


};




