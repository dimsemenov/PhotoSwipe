// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function (window, Util) {
	
	Util.extend(Util, {
		
		Animation: {
				
			_applyTransitionDelay: 50,
			
			_transitionEndLabel: (window.document.documentElement.style.webkitTransition !== undefined) ? "webkitTransitionEnd" : (window.document.documentElement.style.OTransition !== undefined) ? "oTransitionEnd otransitionend" : "transitionend",
			
			_transitionEndHandler: null,
			
			_transitionPrefix: (window.document.documentElement.style.webkitTransition !== undefined) ? "webkitTransition" : (window.document.documentElement.style.MozTransition !== undefined) ? "MozTransition" : (window.document.documentElement.style.OTransition !== undefined) ? "OTransition" : "transition",
			
			_transformLabel: (window.document.documentElement.style.webkitTransform !== undefined) ? "webkitTransform" : (window.document.documentElement.style.MozTransform !== undefined) ? "MozTransform" : (window.document.documentElement.style.OTransform !== undefined) ? "OTransform" : "transform",
						
			
			/*
			 * Function: _getTransitionEndHandler
			 */
			_getTransitionEndHandler: function(){
			
				if (Util.isNothing(this._transitionEndHandler)){
					this._transitionEndHandler = this._onTransitionEnd.bind(this);
				}
				
				return this._transitionEndHandler;
			
			},
			
			
			
			/*
			 * Function: stop
			 */
			stop: function(el){
				
				if (Util.Browser.isCSSTransformSupported){
					var 
						property = el.style[this._transitionPrefix + 'Property'],
						callbackLabel = (property !== '') ? 'ccl' + property + 'callback' : 'cclallcallback',
						style = {};
					
					Util.Events.remove(el, this._transitionEndLabel, this._getTransitionEndHandler());
					if (Util.isNothing(el.callbackLabel)){
						delete el.callbackLabel;
					}
					
					style[this._transitionPrefix + 'Property'] = '';
					style[this._transitionPrefix + 'Duration'] = '';
					style[this._transitionPrefix + 'TimingFunction'] = '';
					style[this._transitionPrefix + 'Delay'] = '';
					style[this._transformLabel] = '';
					
					Util.DOM.setStyle(el, style);
				}
				else if (!Util.isNothing(window.jQuery)){
				
					window.jQuery(el).stop(true, true);
				
				}
				
			
			},
			
			
			
			/*
			 * Function: fadeIn
			 */
			fadeIn: function(el, speed, callback, timingFunction, opacity){
				
				opacity = Util.coalesce(opacity, 1);
				if (opacity <= 0){
					opacity = 1;
				}
				
				if (speed <= 0){
					Util.DOM.setStyle(el, 'opacity', opacity);
					if (!Util.isNothing(callback)){
						callback(el);
						return;
					}
				}
				
				var currentOpacity = Util.DOM.getStyle(el, 'opacity');
				
				if (currentOpacity >= 1){
					Util.DOM.setStyle(el, 'opacity', 0);
				}
				
				if (Util.Browser.isCSSTransformSupported){
					this._applyTransition(el, 'opacity', opacity, speed, callback, timingFunction);
				}
				else if (!Util.isNothing(window.jQuery)){
					window.jQuery(el).fadeTo(speed, opacity, callback);
				}
				
			},
			
			
			
			/*
			 * Function: fadeTo
			 */
			fadeTo: function(el, opacity, speed, callback, timingFunction){
				this.fadeIn(el, speed, callback, timingFunction, opacity);
			},
			
			
			
			/*
			 * Function: fadeOut
			 */
			fadeOut: function(el, speed, callback, timingFunction){
				
				if (speed <= 0){
					Util.DOM.setStyle(el, 'opacity', 0);
					if (!Util.isNothing(callback)){
						callback(el);
						return;
					}
				}
				
				if (Util.Browser.isCSSTransformSupported){
				
					this._applyTransition(el, 'opacity', 0, speed, callback, timingFunction);
					
				}
				else{
				
					window.jQuery(el).fadeTo(speed, 0, callback);
				
				}
				
			},
			
			
			
			/*
			 * Function: slideBy
			 */
			slideBy: function(el, x, y, speed, callback, timingFunction){
			
				var style = {};
				
				x = Util.coalesce(x, 0);
				y = Util.coalesce(y, 0);
				timingFunction = Util.coalesce(timingFunction, 'ease-out');
				
				style[this._transitionPrefix + 'Property'] = 'all';
				style[this._transitionPrefix + 'Delay'] = '0';
				
				if (speed === 0){
					style[this._transitionPrefix + 'Duration'] = '';
					style[this._transitionPrefix + 'TimingFunction'] = '';
				}
				else{
					style[this._transitionPrefix + 'Duration'] = speed + 'ms';
					style[this._transitionPrefix + 'TimingFunction'] = Util.coalesce(timingFunction, 'ease-out');
					
					Util.Events.add(el, this._transitionEndLabel, this._getTransitionEndHandler());
					
				}
				
				style[this._transformLabel] = (Util.Browser.is3dSupported) ? 'translate3d(' + x + 'px, ' + y + 'px, 0px)' : 'translate(' + x + 'px, ' + y + 'px)';
				
				if (!Util.isNothing(callback)){
					el.cclallcallback = callback;
				}
				
				Util.DOM.setStyle(el, style);
				
				if (speed === 0){
					window.setTimeout(function(){
						this._leaveTransforms(el);
					}.bind(this), this._applyTransitionDelay);
				}
				
			},
			
			
			
			/*
			 * Function: 
			 */
			resetTranslate: function(el){
				
				var style = {};
				style[this._transformLabel] = style[this._transformLabel] = (Util.Browser.is3dSupported) ? 'translate3d(0px, 0px, 0px)' : 'translate(0px, 0px)';
				Util.DOM.setStyle(el, style);
			
			},
			
			
			
			/*
			 * Function: _applyTransition
			 */
			_applyTransition: function(el, property, val, speed, callback, timingFunction){
					
				var style = {};
				
				timingFunction = Util.coalesce(timingFunction, 'ease-in');
				
				style[this._transitionPrefix + 'Property'] = property;
				style[this._transitionPrefix + 'Duration'] = speed + 'ms';
				style[this._transitionPrefix + 'TimingFunction'] = timingFunction;
				style[this._transitionPrefix + 'Delay'] = '0';
				
				Util.Events.add(el, this._transitionEndLabel, this._getTransitionEndHandler());
				
				Util.DOM.setStyle(el, style);
				
				if (!Util.isNothing(callback)){
					el['ccl' + property + 'callback'] = callback;
				}
				
				window.setTimeout(function(){
					Util.DOM.setStyle(el, property, val);
				}, this._applyTransitionDelay);	
				
			},
			
			
			
			/*
			 * Function: _onTransitionEnd
			 */
			_onTransitionEnd: function(e){
				
				Util.Events.remove(e.currentTarget, this._transitionEndLabel, this._getTransitionEndHandler());
				this._leaveTransforms(e.currentTarget);
			
			},
			
			
			
			/*
			 * Function: _leaveTransforms
			 */
			_leaveTransforms: function(el){
				
				var 
						property = el.style[this._transitionPrefix + 'Property'],
						callbackLabel = (property !== '') ? 'ccl' + property + 'callback' : 'cclallcallback',
						callback,
						transform = Util.coalesce(el.style.webkitTransform, el.style.MozTransform, el.style.OTransform, el.style.transform),
						transformMatch, 
						transformExploded,
						domX = window.parseInt(Util.DOM.getStyle(el, 'left'), 0),
						domY = window.parseInt(Util.DOM.getStyle(el, 'top'), 0),
						transformedX,
						transformedY,
						style = {};
					
				if (transform !== ''){
					if (Util.Browser.is3dSupported){
						transformMatch = transform.match( /translate3d\((.*?)\)/ );
					}
					else{
						transformMatch = transform.match( /translate\((.*?)\)/ );
					}
					if (!Util.isNothing(transformMatch)){
						transformExploded = transformMatch[1].split(', ');
						transformedX = window.parseInt(transformExploded[0], 0);
						transformedY = window.parseInt(transformExploded[1], 0);
					}
				}
				
				style[this._transitionPrefix + 'Property'] = '';
				style[this._transitionPrefix + 'Duration'] = '';
				style[this._transitionPrefix + 'TimingFunction'] = '';
				style[this._transitionPrefix + 'Delay'] = '';
				
				Util.DOM.setStyle(el, style);
				
				window.setTimeout(function(){
					
					if(!Util.isNothing(transformExploded)){
						
						style = {};
						style[this._transformLabel] = '';
						style.left = (domX + transformedX) + 'px';
						style.top = (domY + transformedY) + 'px';
						
						Util.DOM.setStyle(el, style);
						
					}
					
					if (!Util.isNothing(el[callbackLabel])){
						callback = el[callbackLabel];
						delete el[callbackLabel];
						callback(el);
					}
					
				}.bind(this), this._applyTransitionDelay);
				
			}
			
			
		}
		
		
	});
	
	
}
(
	window,
	window.Code.Util
));
