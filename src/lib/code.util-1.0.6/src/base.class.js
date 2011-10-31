// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, klass, Util){
	
	Util.BaseClass = klass({
		
		
		/*
		 * Function: dispose
		 */
		dispose: function(){
		
			var prop;
		
			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}
		
		}
		
		
	});
		
}
(
	window, 
	window.klass, 
	window.Code.Util
));