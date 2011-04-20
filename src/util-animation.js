// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function (Util) {
	
	Util.extend(Util, {
		
		
		Animation: {
			
			_applyTransitionDelay: 50,
			
			/*
			 * Function: _setTransition
			 * Sets animation transitions on the element
			 */
			_setTransition: function(el, property, duration, timingFunction, delay, callback){
				
				var 
					transitionPrefix = Util.Animation._getTransitionPrefix(),
					p = Util.coalesce(property, ''),
					d = Util.coalesce(duration, ''),
					t, de, c;
				
				if (Util.isFunction(timingFunction)){
					c = timingFunction;
					t = '';
					de = '';
				}
				else{
					c = callback;
					t = Util.coalesce(timingFunction, '');
					de = Util.coalesce(delay, '');
				}
				
				var transitionValues = {};
				transitionValues[transitionPrefix + 'Property'] = p;
				transitionValues[transitionPrefix + 'Duration'] = d;
				transitionValues[transitionPrefix + 'TimingFunction'] = t;
				transitionValues[transitionPrefix + 'Delay'] = de;
								
				Util.DOM.setStyle(el, transitionValues);
								
				// Wait for the above transitions to get applied
				if (Util.isFunction(c)){
					window.setTimeout(
						function(){
							c(el);
						},
						Util.Animation._applyTransitionDelay
					);
				}
				
			},
			
			
			/*
			 * Function: _setTransitionEndEventListener
			 * Sets an event listener on transition end. This will:
			 * - Remove the transitionEnd event hander
			 * - Fire any animation end callback you specified
			 *
			 * The function stores a pointer to the event handler functions
			 * on the element object itself (using Util.setElementData)
			 *
			 * This gives us a reference when removing the event listener
			 */
			_setTransitionEndEventListener: function(el){
			
				Util.setElementData(el, 'transitionEndEvent', function(e){
					
					var el = e.target;
					
					Util.DOM.removeEventListener(el, Util.Animation._getTransitionEndEventLabel(), Util.getElementData(el, 'transitionEndEvent'));
					Util.removeElementData(el, 'transitionEndEvent');
									
					var callback = Util.getElementData(el, 'transitionEndCallback');
					Util.removeElementData(el, 'transitionEndCallback');
				
					// Remove the tranistion
					Util.Animation._removeTransitions(el);
					
					if (Util.isFunction(callback)){
						
						window.setTimeout(
							function(){
								callback(e);
							},
							Util.Animation._applyTransitionDelay
						);
				
					}
					
				});
				
				
				Util.DOM.addEventListener(el, Util.Animation._getTransitionEndEventLabel(), Util.getElementData(el, 'transitionEndEvent'));
			
			},
			
			
			/*
			 * Function: _removeTransitions
			 */
			_removeTransitions: function(el){
				
				var transitionPrefix = Util.Animation._getTransitionPrefix();
				
				var transitionValues = {};
				transitionValues[transitionPrefix + 'Property'] = '';
				transitionValues[transitionPrefix + 'Duration'] = '';
				transitionValues[transitionPrefix + 'TimingFunction'] = '';
				transitionValues[transitionPrefix + 'Delay'] = '';
								
				Util.DOM.setStyle(el, transitionValues);
								
			},
			
			
			/*
			 * Function: _getTransitionEndEventLabel
			 */
			_getTransitionEndEventLabel: function(){
				
				return (document.documentElement.style.WebkitTransition !== undefined) ? "webkitTransitionEnd" : "transitionend";
				
			},
			
			
			_getTransitionPrefix: function(){
				
				return (document.documentElement.style.WebkitTransition !== undefined) ? "webkitTransition" : (document.documentElement.style.MozTransition !== undefined) ? "MozTransition" : "transition";
				
			},
			
			
			/*
			 * Function: stopFade
			 */
			stopFade: function(el){
				
				var fadeCallback = Util.getElementData(el, 'transitionEndEvent');
				if (Util.isNothing(fadeCallback)){
					return;
				}
				
				Util.DOM.removeEventListener(
					el, 
					Util.Animation._getTransitionEndEventLabel(), 
					Util.getElementData(el, 'transitionEndEvent')
				);
				
				var currentOpacity = window.getComputedStyle(el,'').getPropertyValue('opacity');
							
				Util.Animation._removeTransitions(el);
				
				Util.DOM.setStyle(el, 'opacity', currentOpacity);
				
			},
			
			
			/*
			 * Function: fadeIn
			 * Fades an element in.
			 * Make sure the element is displayed before calling
			 */
			fadeIn: function(el, opacity, duration, callback){
					
				opacity = Util.coalesce(opacity, 1);
				duration = Util.coalesce(duration, 500);
				
				Util.setElementData(el, 'transitionEndCallback', callback);
				
				Util.Animation._setTransition(el, 'opacity', duration + 'ms', function(el){
					
					Util.Animation._setTransitionEndEventListener(el);
					Util.DOM.setStyle(el, 'opacity', opacity);
					
				});
				
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
				
				Util.setElementData(el, 'transitionEndCallback', callback);
				
				Util.Animation._setTransition(el, 'opacity', duration + 'ms', function(el){
					
					Util.Animation._setTransitionEndEventListener(el);
					Util.DOM.setStyle(el, 'opacity', 0);
				
				});
				
			},
			
			
			
			/*
			 * Function: slideTo
			 * Slides an element by an x,y position
			 */
			slideBy: function(el, xPos, yPos, duration, callback){
				
				if (Util.isNothing(duration)){
					duration = 500;
				}
				
				/* Store some values against the element for later use */
				Util.setElementData(el, 'transitionEndCallback', Util.Animation._onSlideByEnd);
				Util.setElementData(el, 'slideByCallback', callback);
				Util.setElementData(el, 'slideByXPos', xPos);
				Util.setElementData(el, 'slideByYPos', yPos);
				
				//ease-in-out
				Util.Animation._setTransition(el, 'all', duration + 'ms', 'ease-in', 0, function(el){
					
					Util.Animation._setTransitionEndEventListener(el);
					
					var 
						xPos = Util.getElementData(el, 'slideByXPos'),
						yPos = Util.getElementData(el, 'slideByYPos');
					
					Util.removeElementData(el, 'slideByXPos');
					Util.removeElementData(el, 'slideByYPos');
				
					Util.DOM.setStyle(el, {
						webkitTransform: (Util.browser.mobileSafari3dSupported) ? 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)' : 'translate(' + xPos + 'px, ' + yPos + 'px)',
						MozTransform: 'translate(' + xPos + 'px, ' + yPos + 'px)',
						transform: 'translate(' + xPos + 'px, ' + yPos + 'px)'
					});
										
				});
				
			},
			
			
			
			_onSlideByEnd: function(e){
				
				// Reset the real css top and left after the transformation
				var 
					el = e.target,
					
					callback = Util.getElementData(el, 'slideByCallback'),
					
					transform = Util.coalesce(el.style.webkitTransform, el.style.MozTransform, el.style.transform),
					
					transformExploded = transform.match( /\((.*?)\)/ )[1].split(', '),
					
					transformedX = window.parseInt(transformExploded[0]),
					
					transformedY = window.parseInt(transformExploded[1]),
					
					domX = window.parseInt(Util.DOM.getStyle(el, 'left')),
					
					domY = window.parseInt(Util.DOM.getStyle(el, 'top'));
				
				Util.DOM.setStyle(el, {
					webkitTransform: '',
					MozTransform: '',
					transform: '',
					left: (domX + transformedX) + 'px',
					top: (domY + transformedY) + 'px'
				});
				
				
				Util.removeElementData(el, 'slideByCallback');
				Util.removeElementData(el, 'slideByXPos');
				Util.removeElementData(el, 'slideByYPos');
				
				if (Util.isFunction(callback)){
					window.setTimeout(
						function(){
							callback(e);
						},
						Util.Animation._applyTransitionDelay
					);
					//window.setTimeout(callback, Util.Animation._applyTransitionDelay, e);
				}
				
			}
			
			
		}
		
		
	});
	
	
})(Code.PhotoSwipe.Util);
