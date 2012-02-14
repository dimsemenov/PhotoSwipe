// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.UILayer');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	PhotoSwipe.UILayer.UILayerClass = Util.TouchElement.TouchElementClass.extend({
		
		
		
		el: null,
		settings: null,
		
		
		
		/*
		 * Function: dispose
		 */
		dispose: function(){
		
			var prop;
			
			this.removeEventHandlers();
			
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
		initialize: function(options){
			
			this.settings = options;
			
			// Main container 
			this.el = Util.DOM.createElement(
				'div', 
				{ 
					'class': PhotoSwipe.UILayer.CssClasses.uiLayer
				}, 
				''
			);
			Util.DOM.setStyle(this.el, {
				display: 'block',
				position: 'absolute',
				left: 0,
				top: 0,
				overflow: 'hidden',
				zIndex: this.settings.zIndex,
				opacity: 0
			});
			Util.DOM.hide(this.el);
			
			if (this.settings.target === window){
				Util.DOM.appendToBody(this.el);
			}
			else{
				Util.DOM.appendChild(this.el, this.settings.target);
			}
			
			this.supr(this.el, {
				swipe: true,
				move: true,
				gesture: Util.Browser.iOS,
				doubleTap: true,
				preventDefaultTouchEvents: this.settings.preventDefaultTouchEvents,
				allowVerticalScroll: this.settings.allowVerticalScroll
			});
			
		},
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			// Set the height and width to fill the document
			if (this.settings.target === window){
				Util.DOM.setStyle(this.el, {
					top: Util.DOM.windowScrollTop()  + 'px',
					width: Util.DOM.windowWidth(),
					height: Util.DOM.windowHeight()
				});	
			}
			else{
				Util.DOM.setStyle(this.el, {
					top: '0px',
					width: Util.DOM.width(this.settings.target),
					height: Util.DOM.height(this.settings.target)
				});
			}
			
		},
		
		
		
		/*
		 * Function: show
		 */
		show: function(){
			
			this.resetPosition();
			Util.DOM.show(this.el);
			this.addEventHandlers();
			
		},
		
		
		
		/*
		 * Function: addEventHandlers
		 */
		addEventHandlers: function(){
			
			this.supr();
			
		},
		
		
		
		/*
		 * Function: removeEventHandlers
		 */
		removeEventHandlers: function(){
		
			this.supr();
		
		}
		
		
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));