// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.ZoomPanRotate');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	PhotoSwipe.ZoomPanRotate.ZoomPanRotateClass = klass({
	
		el: null,
		settings: null,
		containerEl: null,
		imageEl: null,
		transformSettings: null,
		panStartingPoint: null,
		transformEl: null,
		
		
		
		/*
		 * Function: dispose
		 */
		dispose: function(){
		
			var prop;
			
			Util.DOM.removeChild(this.el, this.el.parentNode);
			
			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}
		
		},
		
		
		
		/*
		 * Function: initialize
		 */
		initialize: function(options, cacheImage, uiLayer){
			
			var parentEl, width, height, top;
			
			this.settings = options;
			
			if (this.settings.target === window){
				parentEl = document.body;
				width = Util.DOM.windowWidth();
				height = Util.DOM.windowHeight();
				top = Util.DOM.windowScrollTop() + 'px';
			}
			else{
				parentEl = this.settings.target;
				width = Util.DOM.width(parentEl);
				height = Util.DOM.height(parentEl);
				top = '0px';
			}
			
			this.imageEl = cacheImage.imageEl.cloneNode(false);
			Util.DOM.setStyle(this.imageEl, {
				
				zIndex: 1
				
			});
			
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
			
			
			this.el = Util.DOM.createElement(
				'div', 
				{ 
					'class': PhotoSwipe.ZoomPanRotate.CssClasses.zoomPanRotate
				}, 
				''
			);
			Util.DOM.setStyle(this.el, {
				left: 0,
				top: top,
				position: 'absolute',
				width: width,
				height: height,
				zIndex: this.settings.zIndex,
				display: 'block'
			});
			
			Util.DOM.insertBefore(this.el, uiLayer.el, parentEl);
			
			if (Util.Browser.iOS){
				this.containerEl = Util.DOM.createElement('div','','');
				Util.DOM.setStyle(this.containerEl, {
					left: 0,
					top: 0,
					width: width,
					height: height,
					position: 'absolute',
					zIndex: 1
				});
				Util.DOM.appendChild(this.imageEl, this.containerEl);
				Util.DOM.appendChild(this.containerEl, this.el);
				Util.Animation.resetTranslate(this.containerEl);
				Util.Animation.resetTranslate(this.imageEl);
				this.transformEl = this.containerEl;
			}
			else{
				Util.DOM.appendChild(this.imageEl, this.el);
				this.transformEl = this.imageEl;
			}
			
		},
		
		
		
		/*
		 * Function: setStartingTranslateFromCurrentTransform
		 */
		setStartingTranslateFromCurrentTransform: function(){
			
			var 
				transformValue = Util.coalesce(this.transformEl.style.webkitTransform, this.transformEl.style.MozTransform, this.transformEl.style.OTransform, this.transformEl.style.transform),
				transformExploded;
			
			if (!Util.isNothing(transformValue)){
				
				transformExploded = transformValue.match( /translate\((.*?)\)/ );
				
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
			
			if (this.settings.minUserZoom !== 0 && scale < this.settings.minUserZoom){
				scale = this.settings.minUserZoom;
			}
			else if (this.settings.maxUserZoom !== 0 && scale > this.settings.maxUserZoom){
				scale = this.settings.maxUserZoom;
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
			
			this.transformSettings.scale = this.getScale(scaleValue);
			
			this.transformSettings.rotation = 
				this.transformSettings.startingRotation + rotationValue;
			
			this.applyTransform();
			
		},
		
		
		
		/*
		 * Function: panStart
		 */
		panStart: function(point){
			
			this.setStartingTranslateFromCurrentTransform();
			
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
				dxScaleAdjust = dx / this.transformSettings.scale ,
        dyScaleAdjust = dy / this.transformSettings.scale;
			
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
			
			
			if (this.settings.target === window){
				
				this.panStart({
					x: Util.DOM.windowWidth() / 2,
					y: Util.DOM.windowHeight() / 2
				});
				
				var 
					dx = point.x - this.panStartingPoint.x,
					dy = point.y - this.panStartingPoint.y,
					dxScaleAdjust = dx / this.transformSettings.scale,
					dyScaleAdjust = dy / this.transformSettings.scale;
					
				this.transformSettings.translateX = 
					(this.transformSettings.startingTranslateX + dxScaleAdjust) * -1;
				
				this.transformSettings.translateY = 
					(this.transformSettings.startingTranslateY + dyScaleAdjust) * -1;
					
			}
			
			
			this.setStartingScaleAndRotation(scaleValue, 0);
			this.transformSettings.scale = this.transformSettings.startingScale;
			
			this.transformSettings.rotation = 0;
			
			this.applyTransform();
			
		},
		
		
		
		/*
		 * Function: applyTransform
		 */
		applyTransform: function(){
			
			var 
				rotationDegs = this.transformSettings.rotation % 360,
				translateX = window.parseInt(this.transformSettings.translateX, 10),
				translateY = window.parseInt(this.transformSettings.translateY, 10),
				transform = 'scale(' + this.transformSettings.scale + ') rotate(' + rotationDegs + 'deg) translate(' + translateX + 'px, ' + translateY + 'px)';
			
			Util.DOM.setStyle(this.transformEl, {
				webkitTransform: transform,
				MozTransform: transform,
				msTransform: transform,
				OTransform: transform,
				transform: transform
			});
			
			Util.Events.fire(this, {
				target: this,
				type: PhotoSwipe.ZoomPanRotate.EventTypes.onTransform,
				scale: this.transformSettings.scale,
				rotation: this.transformSettings.rotation,
				rotationDegs: rotationDegs,
				translateX: translateX,
				translateY: translateY
			});
			
		}
	
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));