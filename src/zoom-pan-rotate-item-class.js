// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(Util){
	
	/*
	 * Class: Code.PhotoSwipe.ZoomPanRotateItemClass
	 */
	Code.PhotoSwipe.ZoomPanRotateItemClass = Code.PhotoSwipe.ElementClass.extend({
		
		parentEl: null,
		transformSettings: null,
		panStartingPoint: null,
		
		
		/*
		 * Function: init
		 */
		init: function(options, elToClone, parentEl){
			
			/*
			this.settings = {
			};
			
			Util.extend(this.settings, options);
			*/
			
			this._super(options);
			
			this.parentEl = parentEl;
			
			this.transformSettings = {
				
				startingScale: 1.0,
				scale: 1.0,
				startingRotation: 0,
				rotation: 0,
				startingTranslateX: 0,
				startingTranslateY: 0,
				translateX: 0,
				translateY: 0
			
			};
			
			this.el = elToClone.cloneNode(true);
			
			Util.DOM.appendChild(this.el, this.parentEl);
		},
		
		
		
		/*
		 * Function: setStartingTranslateFromCurrentTranform
		 */
		setStartingTranslateFromCurrentTranform: function(){
			
			var transformExploded = this.el.style.webkitTransform.match( /translate\((.*?)\)/ );
			
			if (!Util.isNothing(transformExploded)){
				
				transformExploded = transformExploded[1].split(', ');
				this.transformSettings.startingTranslateX = window.parseInt(transformExploded[0]);
				this.transformSettings.startingTranslateY = window.parseInt(transformExploded[1]);
			
			}
			
		},
		
		
		
		/*
		 * Function: setStartingScale
		 */
		setStartingScale: function(scaleValue){
			
			this.transformSettings.startingScale *= scaleValue;
			
		},
		
		
		
		/*
		 * Function: setStatingRotation
		 */
		setStatingRotation: function(rotationValue){
		
			this.transformSettings.startingRotation = 
				(this.transformSettings.startingRotation + rotationValue) % 360;
		
		},
		
		
		
		/*
		 * Function: zoom
		 */
		zoom: function(scaleValue, rotationValue){
			
			this.transformSettings.scale = 
				this.transformSettings.startingScale * scaleValue;
			
			this.transformSettings.rotation = 
				this.transformSettings.startingRotation + rotationValue;
			
			this.applyTransform();
			
		},
		
		
		
		/*
		 * Function: panStart
		 */
		panStart: function(point){
			
			this.setStartingTranslateFromCurrentTranform();
			
			this.panStartingPoint = {
				x: point.x,
				y: point.y
			}
		
		},
		
		
		
		/*
		 * Function: pan
		 */
		pan: function(point){
			
			var 
				dx = point.x - this.panStartingPoint.x,
				dy = point.y - this.panStartingPoint.y;
			
			this.transformSettings.translateX = 
				this.transformSettings.startingTranslateX + dx;
				
			this.transformSettings.translateY = 
				this.transformSettings.startingTranslateY + dy;;
			
			this.applyTransform();
			
		},
		
		
		
		/*
		 * Function: applyTransform
		 */
		applyTransform: function(){
			 
			this.el.style.webkitTransform = 'scale(' + this.transformSettings.scale + ') rotate(' + (this.transformSettings.rotation % 360) + 'deg) translate(' + this.transformSettings.translateX + 'px, ' + this.transformSettings.translateY + 'px)';
			
		},
		
		
		
		/*
		 * Function: remove
		 */
		removeFromDOM: function(){
		
			Util.DOM.removeChild(this.el, this.parentEl);
			
		}
	
	});
	

})(Code.PhotoSwipe.Util);
