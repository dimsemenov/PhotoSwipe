// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.TouchElement');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	PhotoSwipe.TouchElement.EventTypes = {
	
		onTouch: 'CodePhotoSwipeTouchElementOnTouch'
	
	};
	
	
	PhotoSwipe.TouchElement.ActionTypes = {
		
		touchStart: 'touchStart',
		touchMove: 'touchMove',
		touchEnd: 'touchEnd',
		tap: 'tap',
		doubleTap: 'doubleTap',
		swipeLeft: 'swipeLeft',
		swipeRight: 'swipeRight',
		swipeUp: 'swipeUp',
		swipeDown: 'swipeDown',
		gestureStart: 'gestureStart',
		gestureChange: 'gestureChange',
		gestureEnd: 'gestureEnd'
	
	};
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));