// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, Util){
	
	/*
	 * Class: Code.PhotoSwipe.ZoomPanRotateClass
	 */
	Code.PhotoSwipe.ZoomPanRotateClass = Code.PhotoSwipe.ElementClass.extend({
		
		containerEl: null,
		imageEl: null,
		parentEl: null,
		transformSettings: null,
		panStartingPoint: null,
		
		
		/*
		 * Function: init
		 */
		init: function(options, parentEl, imageEl){
			
			this.settings = {};
			
			Util.extend(this.settings, options);
		
			this._super(options);
			
			this.parentEl = parentEl;
			this.imageEl = imageEl.cloneNode(false);
			
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
			
			// Create element and append to body
			this.el = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.ZoomPanRotateClass.CssClasses.documentOverlay }, '');
			Util.DOM.setStyle(this.el, {
				left: 0,
				top: 0,
				position: 'absolute'
			});
			Util.DOM.width(this.el, Util.DOM.bodyWidth());
			Util.DOM.height(this.el, Util.DOM.windowHeight());
			
			this.containerEl = Util.DOM.createElement('div');
			Util.DOM.setStyle(this.containerEl, {
				left: 0,
				top: 0,
				position: 'absolute'
			});
			Util.DOM.width(this.containerEl, Util.DOM.bodyWidth());
			Util.DOM.height(this.containerEl, Util.DOM.windowHeight());
			
			Util.DOM.appendChild(this.imageEl, this.containerEl);
			Util.DOM.appendChild(this.containerEl, this.el);
			Util.DOM.appendChild(this.el, this.parentEl);
			
		},
		
		
		/*
		 * Function: setStartingTranslateFromCurrentTranform
		 */
		setStartingTranslateFromCurrentTranform: function(){
			
			var transformExploded = this.containerEl.style.webkitTransform.match( /translate\((.*?)\)/ );
			
			if (!Util.isNothing(transformExploded)){
				
				transformExploded = transformExploded[1].split(', ');
				this.transformSettings.startingTranslateX = window.parseInt(transformExploded[0]);
				this.transformSettings.startingTranslateY = window.parseInt(transformExploded[1]);
			
			}
			
		},
		
		
		
		/*
		 * Function: setStartingScaleAndRotation
		 */
		setStartingScaleAndRotation: function(scaleValue, rotationValue){
			
			this.transformSettings.startingScale *= scaleValue;
			
			this.transformSettings.startingRotation = 
				(this.transformSettings.startingRotation + rotationValue) % 360;
				
		},
		
		
		
		/*
		 * Function: zoomRotate
		 */
		zoomRotate: function(scaleValue, rotationValue){
			
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
			};
			
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
				this.transformSettings.startingTranslateY + dy;
			
			this.applyTransform();
			
		},
		
		
		
		/*
		 * Function: applyTransform
		 */
		applyTransform: function(){
			 
			this.containerEl.style.webkitTransform = 'scale(' + this.transformSettings.scale + ') rotate(' + (this.transformSettings.rotation % 360) + 'deg) translate(' + this.transformSettings.translateX + 'px, ' + this.transformSettings.translateY + 'px)';
			
		},
			
		
		
		/*
		 * Function: removeFromDOM
		 */
		removeFromDOM: function(){
		
			Util.DOM.removeChild(this.el, this.parentEl);
		
		}
	
	});
	
	
	Code.PhotoSwipe.ZoomPanRotateClass.CssClasses = {
		documentOverlay: 'ps-zoom-pan-rotate'
	};

})
(
	window,
	Code.PhotoSwipe.Util
);
