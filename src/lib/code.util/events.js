// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function (window, Util) {
	
	Util.extend(Util, {
		
		Events: {
			
			
			/*
			 * Function: add
			 * Add an event handler
			 */
			add: function(obj, type, handler){
				
				this._checkHandlersProperty(obj);
				
				if (type === 'mousewheel'){
					type = this._normaliseMouseWheelType();
				}
				
				if (typeof obj.__eventHandlers[type] === 'undefined'){
					obj.__eventHandlers[type] = [];
				}
				obj.__eventHandlers[type].push(handler);
				
				// DOM element 
				if (this._isBrowserObject(obj)){
					obj.addEventListener(type, handler, false);
				}
				
			},
			
			
			
			/*
			 * Function: remove
			 * Removes a handler or all handlers associated with a type
			 */
			remove: function(obj, type, handler){
				
				this._checkHandlersProperty(obj);
				
				if (type === 'mousewheel'){
					type = this._normaliseMouseWheelType();
				}
				
				if (obj.__eventHandlers[type] instanceof Array){
					
					var
						i,
						len,
						handlers = obj.__eventHandlers[type];
					
					// Removing all handlers for a type
					if (Util.isNothing(handler)){
						
						if (this._isBrowserObject(obj)){
							for (i=0; i<handlers.length; i++){
								obj.removeEventListener(type, handlers[i], false);
							}
						}
						
						obj.__eventHandlers[type] = [];
						return;
					}
					
					// Removing a specific handler
					for (i=0, len=handlers.length; i < len; i++){
						if (handlers[i] === handler){
							handlers.splice(i, 1);
							break;
						}
					}
					
					// DOM element 
					if (this._isBrowserObject(obj)){
						obj.removeEventListener(type, handler, false);
						return;
					}
				
				}
			
			},
			
			
			/*
			 * Function: fire
			 * Fire an event
			 */
			fire: function(obj, type){
				
				var 
					i,
					len,
					event,
					listeners,
					listener,
					args = Array.prototype.slice.call(arguments).splice(2),
					isNative;
				
				
				if (type === 'mousewheel'){
					type = this._normaliseMouseWheelType();
				}
				
				
				// DOM element 
				if (this._isBrowserObject(obj)){
				
					if (typeof type !== "string"){
						throw 'type must be a string for DOM elements';
					}
					
					isNative = this._NATIVE_EVENTS[type];
					event = document.createEvent(isNative ? "HTMLEvents" : "UIEvents"); 
					event[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, window, 1);
					
					// Fire an event on an element that has no extra arguments
					if (args.length < 1){
						obj.dispatchEvent(event);
						return;
					}
				
				}
				
				this._checkHandlersProperty(obj);
				
				if (typeof type === "string"){
					event = { type: type };
				}
				else{
					event = type;
				}
				if (!event.target){
					event.target = obj;
				}

				if (!event.type){ 
					throw new Error("Event object missing 'type' property.");
				}

				if (obj.__eventHandlers[event.type] instanceof Array){
					listeners = obj.__eventHandlers[event.type];
					args.unshift(event);
					for (i=0, len=listeners.length; i < len; i++){
						listener = listeners[i];
						if (!Util.isNothing(listener)){
							listener.apply(obj, args);
						}
					}
				}
				
			},
			
			
			/*
			 * Function: getMousePosition
			 */
			getMousePosition: function(event){
				
				var retval = {
					x: 0,
					y: 0
				};
				
				if (event.pageX) {
					retval.x = event.pageX;
				}
				else if (event.clientX) {
					retval.x = event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
				}
			
				if (event.pageY) {
					retval.y = event.pageY;
				}
				else if (event.clientY) {
					retval.y = event.clientY + ( document.documentElement.scrollTop || document.body.scrollTop);
				}
				
				return retval;
			},
			
			
			/*
			 * Function: getTouchEvent
			 */
			getTouchEvent: function(event){
				
				return event;
			
			},
			
			
			
			/*
			 * Function: getWheelDelta
			 */
			getWheelDelta: function(event){
				
				var delta = 0;
				
				if (!Util.isNothing(event.wheelDelta)){
					delta = event.wheelDelta / 120;
				}
				else if (!Util.isNothing(event.detail)){
					delta = -event.detail / 3;
				}
				
				return delta;
				
			},
			
			
			/*
			 * Function: domReady
			 */
			domReady: function(handler){
				
				document.addEventListener('DOMContentLoaded', handler, false);
			
			},
			
			
			_checkHandlersProperty: function(obj){
				
				if (Util.isNothing(obj.__eventHandlers)){
					Util.extend(obj, {
						__eventHandlers: { }
					});
				}
			
			},
			
			
			_isBrowserObject: function(obj){
				if (obj === window || obj === window.document){
					return true;
				}
				return this._isElement(obj) || this._isNode(obj);
			},
			
			
			_isElement: function(obj){
				return (
					typeof window.HTMLElement === "object" ? obj instanceof window.HTMLElement : //DOM2
					typeof obj === "object" && obj.nodeType === 1 && typeof obj.nodeName==="string"
				);
			},
			
			
			
			_isNode: function(obj){
				return (
					typeof window.Node === "object" ? obj instanceof window.Node : 
					typeof obj === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName==="string"
				);
			},
			
			
			
			_normaliseMouseWheelType: function(){
				
				if (Util.Browser.isEventSupported('mousewheel')){
					return 'mousewheel';
				}
				return 'DOMMouseScroll';
				
			},
			
			
			
			_NATIVE_EVENTS: { 
				click: 1, dblclick: 1, mouseup: 1, mousedown: 1, contextmenu: 1, //mouse buttons
				mousewheel: 1, DOMMouseScroll: 1, //mouse wheel
				mouseover: 1, mouseout: 1, mousemove: 1, selectstart: 1, selectend: 1, //mouse movement
				keydown: 1, keypress: 1, keyup: 1, //keyboard
				orientationchange: 1, // mobile
				touchstart: 1, touchmove: 1, touchend: 1, touchcancel: 1, // touch
				gesturestart: 1, gesturechange: 1, gestureend: 1, // gesture
				focus: 1, blur: 1, change: 1, reset: 1, select: 1, submit: 1, //form elements
				load: 1, unload: 1, beforeunload: 1, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
				error: 1, abort: 1, scroll: 1 
			}
			
		}
	
		
	});
	
	
}
(
	window,
	window.Code.Util
));