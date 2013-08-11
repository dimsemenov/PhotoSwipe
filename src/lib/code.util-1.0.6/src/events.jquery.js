// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function (window, $, Util) {
	
	Util.extend(Util, {
		
		Events: {
			
			
			/*
			 * Function: add
			 * Add an event handler
			 */
			add: function(obj, type, handler){
				
				if (type === 'mousewheel'){
					type = this._normaliseMouseWheelType();
				}
				
				$(obj).bind(type, handler);
				
			},
			
			
			
			/*
			 * Function: remove
			 * Removes a handler or all handlers associated with a type
			 */
			remove: function(obj, type, handler){
				
				if (type === 'mousewheel'){
					type = this._normaliseMouseWheelType();
				}
	
				$(obj).unbind(type, handler);
				
			},
			
			
			/*
			 * Function: fire
			 * Fire an event
			 */
			fire: function(obj, type){
				
				var 
					event,
					args = Array.prototype.slice.call(arguments).splice(2);
				
				if (type === 'mousewheel'){
					type = this._normaliseMouseWheelType();
				}
				
				if (typeof type === "string"){
					event = { type: type };
				}
				else{
					event = type;
				}
				
				$(obj).trigger( $.Event(event.type, event),  args);
				
			},
			
			
			/*
			 * Function: getMousePosition
			 */
			getMousePosition: function(event){
				
				var retval = {
					x: event.pageX,
					y: event.pageY
				};
				
				return retval;
				
			},
			
			
			/*
			 * Function: getTouchEvent
			 */
			getTouchEvent: function(event){
				
				return event.originalEvent;
				
			},
			
			
			
			/*
			 * Function: getWheelDelta
			 */
			getWheelDelta: function(event){
				
				var delta = 0;
				
				if (!Util.isNothing(event.originalEvent.deltaY)){
					delta = -event.originalEvent.deltaY;
				}
				else if (!Util.isNothing(event.originalEvent.wheelDelta)){
					delta = event.originalEvent.wheelDelta / 120;
				}
				else if (!Util.isNothing(event.originalEvent.detail)){
					delta = -event.originalEvent.detail / 3;
				}
				
				return delta;
				
			},
			
			
			/*
			 * Function: domReady
			 */
			domReady: function(handler){
				
				$(document).ready(handler);
				
			},
			
			_normaliseMouseWheelType: function(){
				
				if (Util.Browser.isEventSupported('wheel')){
					return 'wheel';
				}
				else if (Util.Browser.msie && document.documentMode > 8){
					return 'wheel';
				}
				else if (Util.Browser.isEventSupported('mousewheel')){
					return 'mousewheel';
				}
				return 'DOMMouseScroll';
				
			}
			
			
		}
	
		
	});
	
	
}
(
	window,
	window.jQuery,
	window.Code.Util
));