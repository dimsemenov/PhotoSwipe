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
	
	
})();