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
			
			this.settings = {
				maxZoom: 5.0,
				minZoom: 0.5,
				adjustPanToZoom: true
			};
			
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
				position: 'absolute',
				// Odd, for Android 2.2 & above, if you don't specify a zIndex, scaling does not work!
				zIndex: 1 
			});
			Util.DOM.width(this.el, Util.DOM.bodyOuterWidth());
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
			
			if (Util.browser.isiOS){
				Util.DOM.resetTranslate(this.containerEl);
				Util.DOM.resetTranslate(this.imageEl);
			}
			
		},
		
		
		
		/*
		 * Function: setStartingTranslateFromCurrentTranform
		 */
		setStartingTranslateFromCurrentTranform: function(){
			
			var 
				transformValue = Util.coalesce(this.containerEl.style.webkitTransform, this.containerEl.style.MozTransform, this.containerEl.style.transform);
			
			if (!Util.isNothing(transformValue)){
				
				var transformExploded = transformValue.match( /translate\((.*?)\)/ );
				
				if (!Util.isNothing(transformExploded)){
				
					transformExploded = transformExploded[1].split(', ');
					this.transformSettings.startingTranslateX = window.parseInt(transformExploded[0], 10);
					this.transformSettings.startingTranslateY = window.parseInt(transformExploded[1], 10);
				
				}
			
			}
			
		},
		
		
		
		/*
		 * Function: getScale
		 */
		getScale: function(scaleValue){
			
			var scale = this.transformSettings.startingScale * scaleValue;
			
			if (this.settings.minZoom !== 0 && scale < this.settings.minZoom){
				scale = this.settings.minZoom;
			}
			else if (this.settings.maxZoom !== 0 && scale > this.settings.maxZoom){
				scale = this.settings.maxZoom;
			}
			
			return scale;
			
		},
		
		
		
		/*
		 * Function: setStartingScaleAndRotation
		 */
		setStartingScaleAndRotation: function(scaleValue, rotationValue){
						
			this.transformSettings.startingScale = this.getScale(scaleValue);
			
			this.transformSettings.startingRotation = 
				(this.transformSettings.startingRotation + rotationValue) % 360;
				
		},
		
		
		
		/*
		 * Function: zoomRotate
		 */
		zoomRotate: function(scaleValue, rotationValue){
									
			this.transformSettings.scale = this.getScale(scaleValue);;
									
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
				dy = point.y - this.panStartingPoint.y,
				dxScaleAdjust = (this.settings.adjustPanToZoom) ? dx / this.transformSettings.scale : dx,
        dyScaleAdjust = dy / this.transformSettings.scale ? dy / this.transformSettings.scale : dy ;
			
			
			this.transformSettings.translateX = 
				this.transformSettings.startingTranslateX + dxScaleAdjust;

			this.transformSettings.translateY = 
				this.transformSettings.startingTranslateY + dyScaleAdjust;

			this.applyTransform();
			
		},
		
		
		/*
		 * Function: zoomAndPanToPoint
		 */
		zoomAndPanToPoint: function(scaleValue, point){
			
			/*
			var self = this;
			setTimeout(function(){
				
				Util.DOM.setStyle(self.containerEl, {
					background: 'blue',
					webkitTransform: 'scale(2.0)',
					MozTransform: 'scale(2.0)'
				});
				
			}, 500);
			*/
			
			this.panStart({
				x: Util.DOM.bodyWidth() / 2,
				y: Util.DOM.windowHeight() / 2
			});
		
			var 
				dx = point.x - this.panStartingPoint.x,
				dy = point.y - this.panStartingPoint.y,
				dxScaleAdjust = (this.settings.adjustPanToZoom) ? dx / this.transformSettings.scale : dx,
        dyScaleAdjust = dy / this.transformSettings.scale ? dy / this.transformSettings.scale : dy;
			
			this.transformSettings.translateX = 
				(this.transformSettings.startingTranslateX + dxScaleAdjust) * -1;

			this.transformSettings.translateY = 
				(this.transformSettings.startingTranslateY + dyScaleAdjust) * -1;
			
			this.setStartingScaleAndRotation(scaleValue, 0);
			this.transformSettings.scale = this.transformSettings.startingScale;
			
			this.transformSettings.rotation = 0;
			
			this.applyTransform();
			
		},
				
				
		
		/*
		 * Function: applyTransform
		 */
		applyTransform: function(){
			
			var transform = 'scale(' + this.transformSettings.scale + ') rotate(' + (this.transformSettings.rotation % 360) + 'deg) translate(' + window.parseInt(this.transformSettings.translateX, 10) + 'px, ' + window.parseInt(this.transformSettings.translateY, 10) + 'px)';
			
			Util.DOM.setStyle(this.containerEl, {
				webkitTransform: transform,
				MozTransform: transform,
				msTransform: transform,
				transform: transform
			});
			
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
