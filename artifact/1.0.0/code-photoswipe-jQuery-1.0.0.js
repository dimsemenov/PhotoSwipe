// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function () {
	
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
	if (!Function.prototype.bind ) {

		Function.prototype.bind = function( obj ) {
			var slice = [].slice,
					args = slice.call(arguments, 1), 
					self = this, 
					nop = function () {}, 
					bound = function () {
						return self.apply( this instanceof nop ? this : ( obj || {} ), 
																args.concat( slice.call(arguments) ) );    
					};

			nop.prototype = self.prototype;

			bound.prototype = new nop();

			return bound;
		};
	}


	if (typeof Code === "undefined") {
		Code = {};
		Code.PhotoSwipe = {};
	}
	
	
	
	Code.PhotoSwipe.Util = {
		
		browser: {
    	version: (navigator.userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
    	webkit: /webkit/.test(navigator.userAgent),
    	opera: /opera/.test(navigator.userAgent), // untested
    	msie: /msie/.test(navigator.userAgent) && !/opera/.test(navigator.userAgent), 
    	mozilla: /mozilla/.test(navigator.userAgent) && !/(compatible|webkit)/.test(navigator.userAgent),
      mobileSafari: /Mac OS X.*Mobile.*Safari/.test(navigator.userAgent)
    },
	
	
		/*
		 * Function: setElementData
		 */
		setElementData: function(el, key, value){
			
			if ( this.isNothing(el.UtilData) ){
				el.UtilData = { };
			}
			
			el.UtilData[key] = value;
		},
		
		
		/*
		 * Function: getElementData
		 */
		getElementData: function(el, key, defaultValue){
			
			if (typeof defaultValue === "undefined"){
				defaultValue = null;
			}
			
			if ( this.isNothing(el.UtilData) ){
				return defaultValue;
			}
			
			if ( this.isNothing(el.UtilData[key]) ){
				return defaultValue;
			}
			
			return el.UtilData[key];
			
		},
		
		
		/*
		 * Function: removeElementData
		 */
		removeElementData: function(el, key){
		
			delete el.UtilData[key];
			
		},
		
		
		/*
		 * Function: coalesce
		 * Takes any number of arguments and returns the first non Null / Undefined argument.
			*/
		coalesce: function () {
			var i;
			for (i = 0; i < arguments.length; i++) {
				if (!this.isNothing(arguments[i])) {
					return arguments[i];
				}
			}
			return null;
		},
		
		
		
		/*
		 * Function: registerNamespace
		 */			
		registerNamespace: function () {
			var args = arguments, obj = null, i, j;
			for (i = 0; i < args.length; ++i) {
				var ns = args[i];
				var nsParts = ns.split(".");
				var root = nsParts[0];
				eval('if (typeof ' + root + ' == "undefined"){' + root + ' = {};} obj = ' + root + ';');
				for (j = 1; j < nsParts.length; ++j) {
					obj[nsParts[j]] = obj[nsParts[j]] || {};
					obj = obj[nsParts[j]];
				}
			}
		},
		
		
		
		/*
		 * Function: extend
		 */
		extend: function(destination, source, overwriteProperties){
			if (this.isNothing(overwriteProperties)){
				overwriteProperties = true;
			}
			if (destination && source && this.isObject(source)){
				for(var prop in source){
					if (overwriteProperties){
						destination[prop] = source[prop];
					}
					else{
						if(typeof destination[prop] == "undefined"){ 
							destination[prop] = source[prop]; 
						}
					}
				}
			}
		},
		
		
		/*
		 * Function: swapArrayElements
		 */
		swapArrayElements: function(arr, i, j){
			
			var temp = arr[i]; 
			arr[i] = arr[j];
			arr[j] = temp;
		
		},
		
		
		/*
		 * Function: isObject
		 */
		isObject: function(obj){
			return typeof obj == "object";
		},
		
		
		
		/*
		 * Function: isNothing
		 */
		isNothing: function (obj) {
			if (typeof obj === "undefined" || obj === null) {
				return true;
			}	
			return false;
		},
		
		
		
		/*
		 * Function: isFunction
		 */
		isFunction: function(obj){
			return typeof obj == "function";
		},
		
		
		
		/*
		 * Function: isArray
		 */
		isArray: function(obj){
			return obj && Code.PhotoSwipe.Util.isFunction(obj.pop);
		},
		
		
		
		/*
		 * Function: isNumber
		 */
		isNumber: function(obj){
			return typeof obj == "number";
		},
		
		
		/*
		 * Function: isString
		 */
		isString: function(obj){
			return typeof obj == "string";
		},
		
		
		
		/*
		 * Function: trim
		 */
		trim: function(val) {
			var re = new RegExp(/\s+?/);
			return val.replace(re, '');
    }
		
	};
	
	
})();// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function (Util) {
	
	Util.extend(Util, {
		
		DOM: {
		
			/*
			 * Function: resetTranslate
			 * Required for smoother transition on iOS
			 */
			resetTranslate: function(el){
				
				if (Util.browser.mobileSafari){
					$(el).css('-webkit-transform', 'translate3d(0px,0px,0px)');
				}
				
			},
		
		
			/*
			 * Function: createElement
			 */
			createElement: function(type, attributes, content){
				
				var retval = $('<' + type +'></' + type + '>');
				retval.attr(attributes);
				retval.append(content);
				
				return retval[0];
				
			},
			
			
			/*
			 * Function: appendChild
			 */
			appendChild: function(childEl, parentEl){
				
				$(parentEl).append(childEl);
				
			},
			
			
			/*
			 * Function: appendText
			 */
			appendText: function(text, parentEl){
				
				$(parentEl).text(text);
				
			},
			
			
			/*
			 * Function: appendToBody
			 */
			appendToBody: function(childEl){
				
				$('body').append(childEl);
				
			},
			
			
			/*
			 * Function: removeChild
			 */
			removeChild: function(childEl, parentEl){
			
				$(parentEl).remove(childEl);
				
			},
			
			
			
			/*
			 * Function: removeChildren
			 */
			removeChildren: function(parentEl){
				
				$(parentEl).empty();
			
			},
			
			
			
			/*
			 * Function: hasAttribute
			 */
			hasAttribute: function(el, attributeName){
				
				return Util.isNothing( $(el).attr(attributeName) );
			
			},
			
			
			/*
			 * Function: getAttribute
			 */
			getAttribute: function(el, attributeName){
				
				return $(el).attr(attributeName);
			
			},
			
			
			/*
			 * Function: el, attributeName
			 */
			setAttribute: function(el, attributeName, value){
				
				$(el).attr(attributeName, value);
				
			},
			
			
			/*
			 * Function: removeAttribute
			 */
			removeAttribute: function(el, attributeName){
				
				$(el).removeAttr(attributeName);
				
			},
			
			
			/*
			 * Function: addClass
			 */
			addClass: function(el, className){
				
				$(el).addClass(className);
				
			},
			
			
			/*
			 * Function: removeClass
			 */
			removeClass: function(el, className){
			
				$(el).removeClass(className);
				
			},
			
			
			/*
			 * Function: hasClass
			 */
			hasClass: function(el, className){
				
				$(el).hasClass(className);
				
			},
			
			
			/*
			 * Function: setStyle
			 */
			setStyle: function(el, style, value){
				
				if (Util.isObject(style)) {
					$(el).css(style);
				}
				else {
					$(el).css(style, value);
				}
				
			},
			
			
			/*
			 * Function: getStyle
			 */
			getStyle: function(el, styleName){
				
				return $(el).css(styleName);
				
			},
			
			
			/*
			 * Function: hide
			 */
			hide: function(el){
				
				$(el).hide();
			
			},
			
			
			/*
			 * Function: show
			 */
			show: function(el){
				
				$(el).show();
				
			},
			
			
			/*
			 * Function: width 
			 * Content width, exludes padding
			 */
			width: function(el, value){
				
				if (!Util.isNothing(value)){
					$(el).width(value);
				}
				
				return $(el).width();
				
			},
			
			
			/*
			 * Function: outerWidth
			 */
			outerWidth: function(el){
				
				return $(el).outerWidth();
			
			},
			
			
			/*
			 * Function: height 
			 * Content height, excludes padding
			 */
			height: function(el, value){
				
				if (!Util.isNothing(value)){
					$(el).height(value);
				}
				
				return $(el).height();
				
			},
			
			
			/*
			 * Function: outerHeight
			 */
			outerHeight: function(el){
				
				return $(el).outerHeight();
				
			},
			
			
			/*
			 * Function: documentWidth
			 */
			documentWidth: function(){
				
				return $(document.documentElement).width();
				
			},

			
			/*
			 * Function: documentHeight
			 */
			documentHeight: function(){
				
				return $(document.documentElement).height();
				
			},
			
			
			/*
			 * Function: bodyWidth
			 */
			bodyWidth: function(){
				
				return $(document.body).width();
			
			},
			
			
			/*
			 * Function: bodyHeight
			 */
			bodyHeight: function(){
				
				return $(document.body).height();
			
			},
			
			
			/*
			 * Function: windowWidth
			 */
			windowWidth: function(){
				
				return $(window).width();
			
			},
			
			
			/*
			 * Function: windowHeight
			 */
			windowHeight: function(){
			
				return $(window).height();
			
			},
			
			
			/*
			 * Function: windowScrollLeft
			 */
			windowScrollLeft: function(){
			
				return $(window).scrollLeft();
			
			},
			
			
			/*
			 * Function: windowScrollTop
			 */
			windowScrollTop: function(){
				
				return $(window).scrollTop();
			
			},
			
			
			/*
			 * Function: addEventListener
			 */
			addEventListener: function(el, type, listener){
				
				$(el).bind( type,  listener );
			
			},
			
			
			/*
			 * Function: removeEventListener
			 */
			removeEventListener: function(el, type, listener){
				
				$(el).unbind( type,  listener );
			
			},
			
			
			/*
			 * Function: getMousePosition
			 */
			getMousePosition: function(event){
				
				var retval = {
					x: event.pageX,
					y: event.pageY
				}
				
				return retval;
			},
			
			
			/*
			 * Function: getTouchEvent
			 */
			getTouchEvent: function(event){
				
				return event.originalEvent;
			
			}
			
		}
	
		
	});
	
	
})(Code.PhotoSwipe.Util);// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function (Util) {
	
	Util.extend(Util, {
		
		
		Animation: {
			
			
			/*
			 * Function: stopFade
			 */
			stopFade: function(el){
				
				$(el).stop(true, true);
				
			},
			
			
			/*
			 * Function: fadeIn
			 * Fades an element in.
			 * Make sure the element is displayed before calling
			 */
			fadeIn: function(el, opacity, duration, callback){
				
				opacity = Util.coalesce(opacity, 1);
				duration = Util.coalesce(duration, 500);
				
				$(el).fadeTo(duration, opacity, callback);
				
			},
			
			
			/*
			 * Function: fadeOut
			 * Fades an element out
			 * Make sure the element is displayed before calling
			 * Does not "hide" the element when animation is over
			 */
			fadeOut: function(el, duration, callback){
				
				if (Util.isNothing(duration)){
					duration = 500;
				}
				
				$(el).fadeTo(duration, 0, callback);
				
			},
			
			
			
			/*
			 * Function: slideTo
			 * Slides an element by an x,y position
			 */
			slideBy: function(el, xPos, yPos, duration, callback){
				
				if (Util.isNothing(duration)){
					duration = 500;
				}
				
				
				$(el).animate(
					{
						left: '+=' + xPos + 'px',
						top: '+=' + yPos + 'px'
					}, 
					duration, 
					callback
				);
			
			}
		
		}
		
	});
	
	
})(Code.PhotoSwipe.Util);// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function () {
	
	// Based on http://www.javascriptbank.com/how-build-custom-events-javascript.html
	Code.PhotoSwipe.EventClass = Class.extend({
		
		_listeners: null,
		
		init: function(){
			
			this._listeners = {};
		
		},
		
		
		addEventListener: function(type, listener){
			
			if (typeof this._listeners[type] === 'undefined'){
				this._listeners[type] = [];
 			}
			this._listeners[type].push(listener);
			
		},
		
		
		dispatchEvent: function(event){
			if (typeof event == "string"){
				event = { type: event };
			}
			if (!event.target){
				event.target = this;
			}

			if (!event.type){ 
				throw new Error("Event object missing 'type' property.");
			}

			if (this._listeners[event.type] instanceof Array){
				var listeners = this._listeners[event.type];
				for (var i=0, len=listeners.length; i < len; i++){
					listeners[i].call(this, event);
				}
			}
		},
		

		removeEventListener: function(type, listener){
			if (this._listeners[type] instanceof Array){
				var listeners = this._listeners[type];
				for (var i=0, len=listeners.length; i < len; i++){
					if (listeners[i] === listener){
						listeners.splice(i, 1);
						break;
					}
				}
			}
		}
		
	});
	

})();// PhotoSwipe - http://www.photoswipe.com/
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
		
		fadeInHandler: null,
		fadeOutHandler: null,
		
		
		/*
		 * Function: init
		 */
		init: function(options){
			
			this._super();
			
			this.settings = {
				opacity: 1,
				fadeSpeed: 500
			};
			
			Util.extend(this.settings, options);
			
			this.isFading = false;
			
			this.fadeInHandler = this.postFadeIn.bind(this);
			this.fadeOutHandler = this.postFadeOut.bind(this);
			
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
			
			this.stopFade();		
			
			// Set position
			this.resetPosition();
			
			// Show
			Util.DOM.setStyle(this.el, 'opacity', this.settings.opacity);
			Util.DOM.show(this.el);
			
			this.postShow();
			
		},
		
		
		
		/*
		 * Function: postShow
		 * Overide this 
		 */
		postShow: function(){
			
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
			
			this.stopFade();
			
			this.isFading = true;
			
			// Set position
			this.resetPosition();
			
			// Fade in
			Util.DOM.show(this.el);
			Util.Animation.fadeIn(
				this.el, 
				this.settings.opacity, 
				this.settings.fadeSpeed, 
				this.fadeInHandler
			);
			
		},
		
				
		/*
		 * Function: postFadeIn
		 */
		postFadeIn: function(e){
			
			this.isFading = false;
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
			
			this.removeEventListeners();	
			this.dispatchEvent(Code.PhotoSwipe.ElementClass.EventTypes.onHide);
			
		},
		
		
		/*
		 * Fuction: fadeOut
		 */
		fadeOut: function(){
			
			this.stopFade();
			
			this.isFading = true;
			
			Util.Animation.fadeOut(this.el, this.settings.fadeSpeed, this.fadeOutHandler);
			
		},
		
		
		/*
		 * Function: preFadeOut
		 */
		postFadeOut: function(e){
			
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
	

})(Code.PhotoSwipe.Util);// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function(Util){
	
	
	/*
	 * Class: Code.PhotoSwipe.FullSizeImageClass
	 */
	Code.PhotoSwipe.FullSizeImageClass = Code.PhotoSwipe.EventClass.extend({
		
		el: null,
		index: null,
		
		// The naturalWidth and naturalHeight of the image as loaded from the server
		// This maybe different from the width and height set on the img element
		// We need this to scale the image correctly
		naturalWidth: null,
		naturalHeight: null,
		src: null,
		caption: null,
		scaleMethod: null,
		isLandscape: null,
		isLoading: null,
		hasLoaded: null,
		
		loadEventHandler: null,
		
		
		/*
		 * Function: init
		 */
		init: function(index, scaleMethod, src, caption){
			
			this._super();
			
			this.index = index;
			this.naturalWidth = 0;
			this.naturalHeight = 0;
			this.src = src;
			this.caption = caption;
			this.isLandscape = false;
			this.isLoading = false;
			this.hasLoaded = false;
			this.scaleMethod = scaleMethod;
			
			this.loadEventHandler = this.onLoad.bind(this);
			
		},
		
		
		/*
		 * Function: load
		 */
		load: function(){
			
			// Load in the image
			this.isLoading = true;
			
			this.el = new Image();
			Util.DOM.addClass(this.el, 'ps-full-size-image');
			this.el.onload = this.loadEventHandler;
			this.el.src = this.src;
			
		},
		
		
		/*
		 * Function: onLoad
		 */
		onLoad: function(){
			
			this.naturalWidth = Util.coalesce(this.el.naturalWidth, this.el.width);
			this.naturalHeight = Util.coalesce(this.el.naturalHeight, this.el.height);
			this.isLandscape = (this.naturalWidth > this.naturalHeight);
			this.isLoading = false;
			this.hasLoaded = true;
			
			this.dispatchEvent(Code.PhotoSwipe.FullSizeImageClass.EventTypes.onLoad);
			
		}
	
	
	});
	
	
	Code.PhotoSwipe.FullSizeImageClass.EventTypes = {
		onLoad: 'onLoad'
	};
	

})(Code.PhotoSwipe.Util);// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function(Util){
	
	/*
	 * Class: Code.PhotoSwipe.DocumentOverlayClass
	 */
	Code.PhotoSwipe.DocumentOverlayClass = Code.PhotoSwipe.ElementClass.extend({
		
		/*
		 * Function: init
		 */
		init: function(options){
			
			this._super(options);
			
			// Create element and append to body
			this.el = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.DocumentOverlayClass.CssClasses.documentOverlay }, '');
			Util.DOM.setStyle(this.el, {
				left: 0,
				position: 'absolute',
				top: 0
			});
			Util.DOM.hide(this.el);
			Util.DOM.appendToBody(this.el);
			
		},
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			// Set the height and width to fill the document
			Util.DOM.width(this.el, Util.DOM.bodyWidth());
			Util.DOM.height(this.el, Util.DOM.bodyHeight());
			
		}
	
	});
	
	
	Code.PhotoSwipe.DocumentOverlayClass.CssClasses = {
		documentOverlay: 'ps-document-overlay'
	};

})(Code.PhotoSwipe.Util);// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function(Util){
	
	/*
	 * Class: Code.PhotoSwipe.ViewportClass
	 */
	Code.PhotoSwipe.ViewportClass = Code.PhotoSwipe.ElementClass.extend({
		
		touchStartPoint: null,
		touchFingerCount: null,
		touchCancelsMouseEvents: null,
		
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
				swipeThreshold: 500
			};
			
			Util.extend(this.settings, options);
			
			this._super(this.settings);
			
			this.touchFingerCount = 0;
			this.touchStartPoint = { x: 0, y: 0 };
			this.touchCancelsMouseEvents = false;
			
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
				if (this.touchCancelsMouseEvents){
				return;
			}
			
			this.touchStartPoint = Util.DOM.getMousePosition(e);
		
		},
		
		
		
		/*
		 * Function: onMouseUp
		 */
		onMouseUp: function(e){
		
			e.preventDefault();
			if (this.touchCancelsMouseEvents){
				return;
			}
			
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

// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function(Util, FullSizeImageClass){

	/*
	 * Class: Code.PhotoSwipe.SliderItemClass
	 */
	Code.PhotoSwipe.SliderItemClass = Code.PhotoSwipe.EventClass.extend({
		
		el: null,
		imageEl: null,
		parentEl: null,
		fullSizeImage: null,
		
		fullSizeImageLoadEventHandler: null,
		
		/*
		 * Function: init
		 */
		init: function(parentEl){
			
			this._super();
			
			this.parentEl = parentEl;	
			
			this.fullSizeImageLoadEventHandler = this.onFullSizeImageLoad.bind(this);
			
			// Create element and append to parentEl
			this.el = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.SliderItemClass.CssClasses.item + ' ' + Code.PhotoSwipe.SliderItemClass.CssClasses.loading }, '');
			Util.DOM.setStyle(this.el, {
				position: 'absolute',
				top: 0
			});
			Util.DOM.resetTranslate(this.el);
			Util.DOM.appendChild(this.el, this.parentEl);
			
			// Create image element and append to slider item
			this.imageEl = new Image();
			Util.DOM.setStyle(this.imageEl, {
				display: 'block',
				position: 'absolute',
				margin: 0,
				padding: 0
			});
			Util.DOM.hide(this.imageEl);
			Util.DOM.appendChild(this.imageEl, this.el);
			
		},
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(width, height, xPos){
			
			Util.DOM.width(this.el, width);
			Util.DOM.height(this.el, height);
			Util.DOM.setStyle(this.el, 'left', xPos + 'px');
			
			this.resetImagePosition();
			
		},
		
		
		
		/*
		 * Function: resetImagePosition
		 */
		resetImagePosition: function(){
			
			if (Util.isNothing(this.fullSizeImage)){
				return;
			}
			
			var src = Util.DOM.getAttribute(this.imageEl, 'src');
			
			var 
				scale, 
				newWidth, 
				newHeight, 
				newTop, 
				newLeft,
				maxWidth = Util.DOM.width(this.el),
				maxHeight = Util.DOM.height(this.el);
			
			if (this.fullSizeImage.isLandscape) {
				// Ensure the width fits the screen
				scale = maxWidth / this.fullSizeImage.naturalWidth;
			}
			else {
				// Ensure the height fits the screen
				scale = maxHeight / this.fullSizeImage.naturalHeight;
			}
			
			newWidth = Math.round(this.fullSizeImage.naturalWidth * scale);
			newHeight = Math.round(this.fullSizeImage.naturalHeight * scale);
			
			if (this.fullSizeImage.scaleMethod === 'fit') {
				// Rescale again to ensure full image fits into the viewport
				scale = 1;
				if (newWidth > maxWidth) {
					scale = maxWidth / newWidth;
				}
				else if (newHeight > maxHeight) {
					scale = maxHeight / newHeight;
				}
				if (scale !== 1) {
					newWidth = Math.round(newWidth * scale);
					newHeight = Math.round(newHeight * scale);
				}
			}
			
			newTop = ((maxHeight - newHeight) / 2) + 'px';
			newLeft = ((maxWidth - newWidth) / 2) + 'px';
			
			Util.DOM.width(this.imageEl, newWidth);
			Util.DOM.height(this.imageEl, newHeight);
			Util.DOM.setStyle(this.imageEl, {
				top: newTop,
				left: newLeft
			});
			
			Util.DOM.show(this.imageEl);
			
		},
		
		
		
		/*
		 * Function: setFullSizeImage
		 */
		setFullSizeImage: function(fullSizeImage){
			
			this.fullSizeImage = fullSizeImage;
			
			Util.DOM.removeClass(this.el, Code.PhotoSwipe.SliderItemClass.CssClasses.loading);
			Util.DOM.removeClass(this.el, Code.PhotoSwipe.SliderItemClass.CssClasses.imageError);
			
			// Something is wrong!
			if (Util.isNothing(this.fullSizeImage)) {
				this.fullSizeImage = null;
				Util.DOM.addClass(this.el, Code.PhotoSwipe.SliderItemClass.CssClasses.imageError);
				this.hideImage();
				return;
			}
						
			// Still loading
			if (!this.fullSizeImage.hasLoaded) {
				
				Util.DOM.addClass(this.el, Code.PhotoSwipe.SliderItemClass.CssClasses.loading);
				this.hideImage();
				
				if (!this.fullSizeImage.isLoading){
				
					// Trigger off the load
					this.fullSizeImage.addEventListener(
						FullSizeImageClass.EventTypes.onLoad, 
						this.fullSizeImageLoadEventHandler
					);
				
				
					this.fullSizeImage.load();
					
				}
				
				return;
			
			}
			
			// Loaded so show the image
			Util.DOM.setAttribute(this.imageEl, 'src', this.fullSizeImage.src);
			
			this.resetImagePosition();
	
			this.dispatchEvent(Code.PhotoSwipe.SliderItemClass.EventTypes.onFullSizeImageDisplay);
			
		},
		
		
		/*
		 * Function: onFullSizeImageLoad
		 */
		onFullSizeImageLoad: function(e){
			
			e.target.removeEventListener(FullSizeImageClass.EventTypes.onLoad, this.fullSizeImageLoadEventHandler);
			
			if (Util.isNothing(this.fullSizeImage) || e.target.index !== this.fullSizeImage.index){
				// Chances are the user has moved the slider
				// and the image to display in the item has now changed
				// from when the item originally called the fullSizeImage
				// to load. If that's the case, rethrow the event, the 
				// slider will be listening for this and can find a
				// relevant slideitem for the loaded image
				this.dispatchEvent({ 
					type: Code.PhotoSwipe.SliderItemClass.EventTypes.onFullSizeImageLoadAnomaly, 
					target: this, 
					fullSizeImage: e.target 
				});
			}
			else{
				this.setFullSizeImage(e.target);
			}
			
		},
		
		
		/*
		 * Function: hideImage
		 */
		hideImage: function(){
			
			Util.DOM.removeAttribute(this.imageEl, 'src');
			Util.DOM.hide(this.imageEl);
			
		}
	
	
	});

	
	Code.PhotoSwipe.SliderItemClass.CssClasses = {
		item: 'ps-slider-item',
		loading: 'ps-slider-item-loading',
		imageError: 'ps-slider-item-image-error'
	};

	
	Code.PhotoSwipe.SliderItemClass.EventTypes = {
		onFullSizeImageDisplay: 'onFullSizeImageDisplay',
		onFullSizeImageLoadAnomaly: 'onFullSizeImageLoadAnomaly'
	};
	
	
})(Code.PhotoSwipe.Util, Code.PhotoSwipe.FullSizeImageClass);// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function(Util, SliderItemClass){

	/*
	 * Class: Code.PhotoSwipe.SliderClass
	 */
	Code.PhotoSwipe.SliderClass = Code.PhotoSwipe.ElementClass.extend({
		
		parentEl: null,
		parentElWidth: null,
		parentElHeight: null,
		items: null,
		
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
	
	
})(Code.PhotoSwipe.Util, Code.PhotoSwipe.SliderItemClass);// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function(Util){
	
	/*
	 * Class: Code.PhotoSwipe.CaptionClass
	 */
	Code.PhotoSwipe.CaptionClass = Code.PhotoSwipe.ElementClass.extend({
		
		contentEl: null,
		
		fadeOutTimeout: null,
		
		touchStartHandler: null,
		
		/*
		 * Function: init
		 */
		init: function(options){
			
			this.settings = {
				captionDelay: 4000,
				position: 'bottom'
			};
			
			Util.extend(this.settings, options);
			
			this._super(options);
			
			this.touchStartHandler = this.onTouchStart.bind(this);
			
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
				zIndex: 1000
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
			
			try{
				Util.DOM.addEventListener(this.el, 'touchstart', this.touchStartHandler);
			}
			catch (err){ }
			
		},
		
		
		/*
		 * Function: removeEventListeners
		 */
		removeEventListeners: function(){
			
			try{
				Util.DOM.removeEventListener(this.el, 'touchstart', this.touchStartHandler);
			}
			catch (err){ }
			
		},
		
		
		/*
		 * Function: onTouch
		 */
		onTouchStart: function(e){
			
			e.preventDefault();
			
		},
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			var top;
			
			if (this.settings.position === 'bottom') {
				top = Util.DOM.windowHeight() - Util.DOM.height(this.el) + Util.DOM.windowScrollTop();
			}
			else {
				top = Util.DOM.windowScrollTop();
			}
			
			Util.DOM.setStyle(this.el, 'top', top + 'px');
			Util.DOM.width(this.el, Util.DOM.bodyWidth());
			
		},
		
		
		
		/*
		 * Function: captionToShow
		 */
		show: function(captionValue){
			
			this.stopFade();
			
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
			
			Util.DOM.setStyle(this.el, 'opacity', this.settings.opacity);
			Util.DOM.show(this.el);
			
				// Set position
			this.resetPosition();
			
			this.postShow();
		
		},
		
		
		
		/*
		 * Function: setEmptyCaption
		 */
		setEmptyCaption: function(){
			
			Util.DOM.removeChildren(this.contentEl);
			Util.DOM.appendText('\u00A0', this.contentEl);	
			
		},
		
		
		
		/*
		 * Function: stopFade
		 */
		stopFade: function(){
		
			window.clearTimeout(this.fadeOutTimeout);
			this._super();
			
		},
		
		
		/*
		 * Function: postShow
		 */
		postShow: function(){
			
			if (this.settings.captionDelay > 0){
				
				this.fadeOutTimeout = window.setTimeout(
					this.fadeOut.bind(this),
					this.settings.captionDelay
				);
				
			}
			
			this._super();
			
		}
	
	});
	
	
	Code.PhotoSwipe.CaptionClass.CssClasses = {
		caption: 'ps-caption',
		bottom: 'ps-caption-bottom',
		content: 'ps-caption-content'
	};

})(Code.PhotoSwipe.Util);// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function(Util){
	
	/*
	 * Class: Code.PhotoSwipe.ToolbarClass
	 */
	Code.PhotoSwipe.ToolbarClass = Code.PhotoSwipe.ElementClass.extend({
		
		closeEl: null,
		previousEl: null, 
		nextEl: null,
		playEl: null,
		
		clickHandler: null,
		
		fadeOutTimeout: null,
		isNextActive: null,
		isPreviousActive: null,
		
		
		/*
		 * Function: init
		 */
		init: function(options){
			
			this.settings = {
				toolbarDelay: 4000,
				position: 'bottom'
			};
			
			Util.extend(this.settings, options);
			
			this._super(options);
			
			this.isNextActive = true;
			this.isPreviousActive = true;
			
			this.clickHandler = this.onClick.bind(this);
			
			// Create element and append to body
			var cssClass = Code.PhotoSwipe.ToolbarClass.CssClasses.caption;
			if (this.settings.position === 'top'){
				cssClass = cssClass + ' ' + Code.PhotoSwipe.ToolbarClass.CssClasses.top;
			}
			
			this.el = Util.DOM.createElement('div', { 'class': cssClass }, '');
			Util.DOM.setStyle(this.el, {
				left: 0,
				position: 'absolute',
				overflow: 'hidden',
				zIndex: 1001,
				display: 'table'
			});
			Util.DOM.hide(this.el);
			Util.DOM.appendToBody(this.el);
			
			// Close
			this.closeEl = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.ToolbarClass.CssClasses.close }, '<div class="' + Code.PhotoSwipe.ToolbarClass.CssClasses.content + '"></div>');
			Util.DOM.appendChild(this.closeEl, this.el);
			
			// Play
			this.playEl = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.ToolbarClass.CssClasses.play }, '<div class="' + Code.PhotoSwipe.ToolbarClass.CssClasses.content + '"></div>');
			Util.DOM.appendChild(this.playEl, this.el);
			
			// Previous
			this.previousEl = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.ToolbarClass.CssClasses.previous }, '<div class="' + Code.PhotoSwipe.ToolbarClass.CssClasses.content + '"></div>');
			Util.DOM.appendChild(this.previousEl, this.el);
			
			// Next
			this.nextEl = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.ToolbarClass.CssClasses.next }, '<div class="' + Code.PhotoSwipe.ToolbarClass.CssClasses.content + '"></div>');
			Util.DOM.appendChild(this.nextEl, this.el);
			
		},
		
		
		/*
		 * Function: addEventListeners
		 */
		addEventListeners: function(){
			
			Util.DOM.addEventListener(this.el, 'click', this.clickHandler);
			
		},
		
		
		/*
		 * Function: removeEventListeners
		 */
		removeEventListeners: function(){
			
			Util.DOM.removeEventListener(this.el, 'click', this.clickHandler);
			
		},
		
		
		/*
		 * Function: onClick
		 */
		onClick: function(e){
			
			var action;
		
			switch(e.target.parentNode){
				
				case this.previousEl:
					if (this.isPreviousActive){
						action = Code.PhotoSwipe.ToolbarClass.Actions.previous;
					}
					break;
					
				case this.nextEl:
					if (this.isNextActive){
						action = Code.PhotoSwipe.ToolbarClass.Actions.next;
					}
					break;
				
				case this.playEl:
					action = Code.PhotoSwipe.ToolbarClass.Actions.play;
					break;
				
				case this.closeEl:
					action = Code.PhotoSwipe.ToolbarClass.Actions.close;
					break;
			}
			
			if (Util.isNothing(action)){
				return;
			}
			
			this.dispatchEvent({ 
				type: Code.PhotoSwipe.ToolbarClass.EventTypes.onClick, 
				target: this, 
				action: action 
			});
			
		},
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			var top;
			
			if (this.settings.position === 'bottom') {
				top = Util.DOM.windowHeight() - Util.DOM.height(this.el) + Util.DOM.windowScrollTop();
			}
			else {
				top = Util.DOM.windowScrollTop();
			}
			
			Util.DOM.setStyle(this.el, 'top', top + 'px');
			Util.DOM.width(this.el, Util.DOM.bodyWidth());
			
		},
		
		
		
		/*
		 * Function: stopFade
		 */
		stopFade: function(){
		
			window.clearTimeout(this.fadeOutTimeout);
			this._super();
			
		},
		
		
		
		/*
		 * Function: postShow
		 */
		postShow: function(){
			
			if (this.settings.toolbarDelay > 0){
				
				this.fadeOutTimeout = window.setTimeout(
					this.fadeOut.bind(this),
					this.settings.toolbarDelay
				);
				
			}
			
			this._super();
			
		},
		
		
		/*
		 * Function: setNextState
		 */
		setNextState: function (disable) {
			
			if (disable) {
				Util.DOM.addClass(this.nextEl, Code.PhotoSwipe.ToolbarClass.CssClasses.nextDisabled);
				this.isNextActive = false;
			}
			else {
				Util.DOM.removeClass(this.nextEl, Code.PhotoSwipe.ToolbarClass.CssClasses.nextDisabled);
				this.isNextActive = true;
			}
			
		},
		
		
		/*
		 * Function: setPreviousState
		 */
		setPreviousState: function (disable) {
			
			if (disable) {
				Util.DOM.addClass(this.previousEl, Code.PhotoSwipe.ToolbarClass.CssClasses.previousDisabled);
				this.isPreviousActive = false;
			}
			else {
				Util.DOM.removeClass(this.previousEl, Code.PhotoSwipe.ToolbarClass.CssClasses.previousDisabled);
				this.isPreviousActive = true;
			}
			
		}
		
	});
	
	
	
	Code.PhotoSwipe.ToolbarClass.CssClasses = {
		caption: 'ps-toolbar',
		top: 'ps-toolbar-top',
		close: 'ps-toolbar-close',
		previous: 'ps-toolbar-previous',
		previousDisabled: 'ps-toolbar-previous-disabled',
		next: 'ps-toolbar-next',
		nextDisabled: 'ps-toolbar-next-disabled',
		play: 'ps-toolbar-play',
		content: 'ps-toolbar-content'
	};
	
	
	
	Code.PhotoSwipe.ToolbarClass.Actions = {
		close: 'close',
		previous: 'previous',
		next: 'next',
		play: 'play'
	};
	
	
	Code.PhotoSwipe.ToolbarClass.EventTypes = {
		onClick: 'onClick'
	};

})(Code.PhotoSwipe.Util);
	// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function(Util, ElementClass, DocumentOverlayClass, FullSizeImageClass, ViewportClass, SliderClass, CaptionClass, ToolbarClass){

	var photoSwipe = Code.PhotoSwipe.EventClass.extend({
		
		fullSizeImages: null,
		
		documentOverlay: null,
		viewport: null,
		slider: null,
		caption: null,
		toolbar: null,
		
		settings: null,
		slideShowSettingsSaved: null,
		currentIndex: null,	
		isBusy: null,
		
		slideshowTimeout: null,
		
		
		documentOverlayFadeInEventHandler: null,
		windowResizeEventHandler: null,
		windowOrientationChangeEventHandler: null,
		windowScrollEventHandler: null,
		keyDownEventHandler: null,
		viewportTouchEventHandler: null,
		viewportFadeOutEventHandler: null,
		sliderDisplayCurrentFullSizeImageEventHandler: null,
		toolbarClickEventHandler: null,
		
		
		/*
		 * Function: init
		 */
		init: function(){
			
			this._super();
						
			this.currentIndex = 0;
			this.isBusy = false;
			
			this.settings = { 
				getImageSource: Code.PhotoSwipe.GetImageSource,
				getImageCaption: Code.PhotoSwipe.GetImageCaption,
				fadeSpeed: 400,
				slideSpeed: 250,
				swipeThreshold: 50,
				loop: true,
				
				flipCaptionAndToolbar: false,
				
				captionDelay: 3000,
				captionOpacity: 0.8,
				hideCaption: false,
				showEmptyCaptions: true,
				
				toolbarDelay: 3000,
				toolbarOpacity: 0.8,
				hideToolbar: false,
				
				slideshowDelay: 3000,
				
				imageScaleMethod: 'fit' // Either "fit" or "zoom"
			};
			
			// Set pointers to event handlers
			this.documentOverlayFadeInEventHandler = this.onDocumentOverlayFadeIn.bind(this);
			this.windowResizeEventHandler = this.onWindowResize.bind(this);
			this.windowOrientationChangeEventHandler = this.onWindowOrientationChange.bind(this);
			this.windowScrollEventHandler = this.onWindowScroll.bind(this);
			this.keyDownEventHandler = this.onKeyDown.bind(this);
			this.viewportTouchEventHandler = this.onViewportTouch.bind(this);
			this.viewportFadeOutEventHandler = this.onViewportFadeOut.bind(this);
			this.sliderDisplayCurrentFullSizeImageEventHandler = this.onSliderDisplayCurrentFullSizeImage.bind(this);
			this.toolbarClickEventHandler = this.onToolbarClick.bind(this);
			
		},
		
		
		
		/*
		 * Function: setOptions
		 */
		setOptions: function(options){
			
			Util.extend(this.settings, options);
			
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
					this.settings.getImageCaption(thumbEl)
				);
				
				// Add it to our internal array
				this.fullSizeImages.push(fullSizeImage);
				
			}
			
		},
		
		
		
		/*
		 * Function: show
		 */
		show: function(startingIndex){
			
			if (this.isBusy){
				return;
			}
			
			if (!Util.isNumber(startingIndex)){
				throw "startingIndex must be a number";
			}
			
			if (Util.isNothing(this.fullSizeImages)){
				throw "need to set images before showing the gallery";
			}
			
			this.isBusy = true;
			
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
			
			// Fade in the document overlay,
			// then show the viewport, slider and toolbar etc
			this.documentOverlay.addEventListener(
				ElementClass.EventTypes.onFadeIn,
				this.documentOverlayFadeInEventHandler
			);
			
			this.documentOverlay.fadeIn();
			
		},
		
		
		
		/*
		 * Function: build
		 */
		build: function(){
			
			// Create the document overlay
			this.documentOverlay = new DocumentOverlayClass({ 
				opacity: 1, 
				fadeSpeed: this.settings.fadeSpeed 
			});
			
			// Create the viewport
			this.viewport = new ViewportClass({ 
				opacity: 1, 
				fadeSpeed: this.settings.fadeSpeed, 
				swipeThreshold: this.settings.swipeThreshold 
			});
			
			// Create the slider
			this.slider = new SliderClass(
				{
					opacity: 1, 
					fadeSpeed: this.settings.fadeSpeed,
					slideSpeed: this.settings.slideSpeed
				}, 
				this.viewport.el
			);
			
			// Create the caption bar
			this.caption = new CaptionClass({
				opacity: this.settings.captionOpacity,
				fadeSpeed: this.settings.fadeSpeed,
				captionDelay: this.settings.captionDelay,
				position: (this.settings.flipCaptionAndToolbar) ? 'bottom' : 'top'
			});
			
				
			// Create the toolbar
			this.toolbar = new ToolbarClass({
				opacity: this.settings.toolbarOpacity,
				fadeSpeed: this.settings.fadeSpeed,
				toolbarDelay: this.settings.toolbarDelay,
				position: (this.settings.flipCaptionAndToolbar) ? 'top' : 'bottom'
			});
			
		},
		
		
		
		/*
		 * Function: addEventListeners
		 */
		addEventListeners: function(){
			
			// Set window size handlers
			if (!Util.isNothing(window.orientation)){
				Util.DOM.addEventListener(window, 'orientationchange', this.windowOrientationChangeEventHandler);
			}
			Util.DOM.addEventListener(window, 'resize', this.windowResizeEventHandler);
			
			Util.DOM.addEventListener(window, 'scroll', this.windowScrollEventHandler);
			
			// Set keydown event handlers for desktop browsers
			Util.DOM.addEventListener(document, 'keydown', this.keyDownEventHandler);
			
			// Set viewport handlers
			this.viewport.addEventListener(ViewportClass.EventTypes.onTouch, this.viewportTouchEventHandler);
			
			// Set slider handlers
			this.slider.addEventListener(SliderClass.EventTypes.onDisplayCurrentFullSizeImage, this.sliderDisplayCurrentFullSizeImageEventHandler);
			
			// Set toolbar handlers
			this.toolbar.addEventListener(ToolbarClass.EventTypes.onClick, this.toolbarClickEventHandler);
			
		},
		
		
		
		/*
		 * Function: removeEventListeners
		 */
		removeEventListeners: function(){
			
			// Remove window size handlers
			if (!Util.isNothing(window.orientation)){
				Util.DOM.removeEventListener(window, 'orientationchange', this.windowOrientationChangeEventHandler);
			}
			
			Util.DOM.removeEventListener(window, 'resize', this.windowResizeEventHandler);
			
			Util.DOM.removeEventListener(window, 'scroll', this.windowScrollEventHandler);
			
			// Remove keydown event handlers for desktop browsers
			Util.DOM.removeEventListener(document, 'keydown', this.keyDownEventHandler);
			
			// Remove viewport handlers
			this.viewport.removeEventListener(ViewportClass.EventTypes.onTouch, this.viewportTouchEventHandler);
			
			// Remove slider handlers
			this.slider.removeEventListener(SliderClass.EventTypes.onDisplayCurrentFullSizeImage, this.sliderDisplayCurrentFullSizeImageEventHandler);
			
			// Remove toolbar handlers
			this.toolbar.removeEventListener(ToolbarClass.EventTypes.onClick, this.toolbarClickEventHandler);
			
		},
		
		
		
		/*
		 * Function: onDocumentOverlayFadeIn
		 */
		onDocumentOverlayFadeIn: function(e){
			
			// Remove the ElementClass.EventTypes.onFadeIn
			// event handler
			this.documentOverlay.removeEventListener(
				ElementClass.EventTypes.onFadeIn,
				this.documentOverlayFadeInEventHandler
			);
			
			this.viewport.show();
			
			this.slider.show();
			
			this.toolbar.show();
			
			this.addEventListeners();
			
			this.slider.setCurrentFullSizeImage(this.fullSizeImages[this.currentIndex]);
			
			this.isBusy = false;
			
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
		 * Function: onWindowResize
		 */
		onWindowResize: function(e){
			
			this.resetPosition();
		
		},
		
		
		
		/*
		 * Function: onKeyDown
		 */
		onKeyDown: function(e){
			
			if (e.keyCode === 37) { // Left
				e.preventDefault();
				this.showPrevious();
			}
			else if (e.keyCode === 39) { // Right
				e.preventDefault();
				this.showNext();
			}
			else if (e.keyCode === 38 || e.keyCode === 40) { // Up and down
				e.preventDefault();
			}
			else if (e.keyCode === 27) { // Escape
				e.preventDefault();
				//this.pause();
				this.hide();
			}
			else if (e.keyCode === 32) { // Spacebar
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
		 * Function: resetPosition
		 */
		resetPosition: function(){
		
			if (this.isBusy){
				return;
			}
			
			this.documentOverlay.resetPosition();
			this.viewport.resetPosition();
			this.slider.resetPosition();
			this.caption.resetPosition();
			this.toolbar.resetPosition();
			
		},
		
		
		
		/*
		 * Function: onViewportClick
		 */
		onViewportTouch: function(e){
			
			switch(e.action){
			
				case ViewportClass.Actions.swipeLeft:
					this.showNext();
					break;
					
				case ViewportClass.Actions.swipeRight:
					this.showPrevious();
					break;
				
				default:
					if (this.isSlideShowActive() || !this.settings.hideToolbar){
						this.showCaptionAndToolbar();
					}
					else{
						this.hide();
					}
					break;
					
			}
			
		},
		
		
		
		/*
		 * Function: onViewportFadeOut
		 */
		onViewportFadeOut: function(e){
			
			this.viewport.removeEventListener(ElementClass.EventTypes.onFadeOut, this.viewportFadeOutEventHandler);
			
			this.isBusy = false;
			
		},
		
		
		
		/*
		 * Function: hide
		 */
		hide: function(){
			
			if (this.isBusy){
				return;
			}
			
			this.isBusy = true;
			
			this.removeEventListeners();
			
			this.documentOverlay.hide();
			this.caption.hide();
			this.toolbar.hide();
			this.slider.hide();
			
			Util.DOM.removeClass(document.body, Code.PhotoSwipe.CssClasses.activeBody);
			
			this.viewport.addEventListener(ElementClass.EventTypes.onFadeOut, this.viewportFadeOutEventHandler);
			
			this.viewport.fadeOut();
			
		},
		
		
		
		/*
		 * Function: showNext
		 */
		showNext: function(){
			
			if (this.isBusy){
				return;
			}
			
			this.isBusy = true;
			
			this.caption.setEmptyCaption();
			
			this.slider.showNext();
		
		},
		
		
		
		/*
		 * Function: showPrevious
		 */
		showPrevious: function(){
			
			if (this.isBusy){
				return;
			}
			
			this.isBusy = true;
			
			this.caption.setEmptyCaption();
			
			this.slider.showPrevious();
		
		},
		
	
		
		
		/*
		 * Function: onSliderDisplayCurrentFullSizeImage
		 */
		onSliderDisplayCurrentFullSizeImage: function(e){
			
			this.currentIndex = e.fullSizeImage.index;
			
			// Set the previous and next images for the slider
			this.setSliderPreviousAndNextFullSizeImages();
			
			this.isBusy = false;
			
			if (this.isSlideShowActive()){
				if (!this.settings.loop && this.currentIndex === this.fullSizeImages.length-1){
					// Slideshow as reached the end
					this.slideshowTimeout = window.setTimeout(
						this.showCaptionAndToolbar.bind(this),
						this.settings.slideshowDelay
					);
				}
				else{
					this.fireSlideshowTimeout();
				}
			}
			else{
				this.showCaptionAndToolbar();
			}
			
		},
		
		
		/*
		 * Function: showCaptionAndToolbar
		 */
		showCaptionAndToolbar: function(captionValue){
			
			this.stopSlideshow();
			
	
			// Caption
			if (this.settings.hideCaption){
				this.caption.hide();
			}
			else{
				captionValue = Util.coalesce(captionValue, this.fullSizeImages[this.currentIndex].caption);
			
				if ( (Util.isNothing(captionValue) || captionValue === '') && !this.settings.showEmptyCaptions ){
					this.caption.hide();
					return;
				}
								
				this.caption.show(captionValue);
			}
			
			
			
			// Toolbar
			if (this.settings.hideToolbar){
				this.toolbar.hide();
			}
			else{
				if (this.settings.loop) {
					this.toolbar.setNextState(false);
					this.toolbar.setPreviousState(false);
				}
				else{
					if (this.currentIndex >= this.fullSizeImages.length - 1) {
						this.toolbar.setNextState(true);
					}
					else {
						this.toolbar.setNextState(false);
					}
					
					if (this.currentIndex < 1) {
						this.toolbar.setPreviousState(true);
					}
					else {
						this.toolbar.setPreviousState(false);
					}
				}
				
				this.toolbar.show();
			}
			
		},
		
		
		
		/*
		 * Function: onToolbarClick
		 */
		onToolbarClick: function(e){
		
			switch (e.action){
				
				case ToolbarClass.Actions.previous:
					this.showPrevious();
					break;
					
				case ToolbarClass.Actions.next:
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
			
			window.clearTimeout(this.slideshowTimeout);
			
			this.slideShowSettingsSaved = {
				hideCaption: this.settings.hideCaption,
				hideToolbar: this.settings.hideToolbar
			};
			
			this.settings.hideCaption = true;
			this.settings.hideToolbar = true;
			
			this.caption.fadeOut();
			this.toolbar.fadeOut();
			
			this.fireSlideshowTimeout();
			
		},
		
		
		
		/*
		 * Function: stopSlideshow
		 */
		stopSlideshow: function(){
			
			if (!this.isSlideShowActive()){
				return;
			}
			
			window.clearTimeout(this.slideshowTimeout);
			
			this.settings.hideCaption = this.slideShowSettingsSaved.hideCaption;
			this.settings.hideToolbar = this.slideShowSettingsSaved.hideToolbar;
			
			this.slideShowSettingsSaved = null;
			
		},
		
		
		/*
		 * Function: isSlideShowActive
		 */
		isSlideShowActive: function(){
			
			return (!Util.isNothing(this.slideShowSettingsSaved));
					
		},
		
		
		/*
		 * Function: fireSlideshowTimeout
		 */
		fireSlideshowTimeout: function(){
		
			this.slideshowTimeout = window.setTimeout(
				this.showNext.bind(this),
				this.settings.slideshowDelay
			);
			
		}
		
		
	});
	
	
	Code.PhotoSwipe.CssClasses = {
		activeBody: 'ps-active'
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
		return Util.DOM.getAttribute(el.firstChild, 'alt'); 
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
										
					return findNode(clickedEl.parentNode, targetNodeName, stopAtEl)
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
				thumbEl.addEventListener('click', function(e){
					
					e.preventDefault();
					
					showPhotoSwipe(e.currentTarget);
				
				}, false);
				
			}
		
		}
		
		
		var showPhotoSwipe = function(clickedEl){
			
			var startingIndex = 0;
			for (startingIndex; startingIndex < thumbEls.length; startingIndex++){
				if (thumbEls[startingIndex] === clickedEl){
					break;
				}
			}
			
			Code.PhotoSwipe.Current.show(startingIndex);
				
		};
			
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
	Code.PhotoSwipe.Util, 
	Code.PhotoSwipe.ElementClass,
	Code.PhotoSwipe.DocumentOverlayClass,
	Code.PhotoSwipe.FullSizeImageClass,
	Code.PhotoSwipe.ViewportClass,
	Code.PhotoSwipe.SliderClass,
	Code.PhotoSwipe.CaptionClass,
	Code.PhotoSwipe.ToolbarClass
);