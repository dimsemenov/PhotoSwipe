// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

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
	
	
})(Code.PhotoSwipe.Util);
