// PhotoSwipe - http://www.photoswipe.com/
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
	

})();