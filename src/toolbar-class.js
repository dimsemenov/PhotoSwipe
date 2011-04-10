// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function(Util){
	
	/*
	 * Class: Code.PhotoSwipe.ToolbarClass
	 */
	Code.PhotoSwipe.ToolbarClass = Code.PhotoSwipe.ElementClass.extend({
		
		closeEl: null,
		previousEl: null, 
		nextEl: null,
		playEl: null,
		
		clickHandler: null,
		touchStartHandler: null,
		
		fadeOutTimeout: null,
		isNextActive: null,
		isPreviousActive: null,
		
		
		/*
		 * Function: init
		 */
		init: function(options){
			
			this.settings = {
				toolbarDelay: 4000,
				position: 'bottom'
			};
			
			Util.extend(this.settings, options);
			
			this._super(options);
			
			this.isNextActive = true;
			this.isPreviousActive = true;
			
			this.clickHandler = this.onClick.bind(this);
			this.touchStartHandler = this.onTouchStart.bind(this);
			
			// Create element and append to body
			var cssClass = Code.PhotoSwipe.ToolbarClass.CssClasses.caption;
			if (this.settings.position === 'top'){
				cssClass = cssClass + ' ' + Code.PhotoSwipe.ToolbarClass.CssClasses.top;
			}
			
			this.el = Util.DOM.createElement('div', { 'class': cssClass }, '');
			Util.DOM.setStyle(this.el, {
				left: 0,
				position: 'absolute',
				overflow: 'hidden',
				zIndex: 1001,
				display: 'table'
			});
			Util.DOM.hide(this.el);
			Util.DOM.appendToBody(this.el);
			
			// Close
			this.closeEl = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.ToolbarClass.CssClasses.close }, '<div class="' + Code.PhotoSwipe.ToolbarClass.CssClasses.content + '"></div>');
			Util.DOM.appendChild(this.closeEl, this.el);
			
			// Play
			this.playEl = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.ToolbarClass.CssClasses.play }, '<div class="' + Code.PhotoSwipe.ToolbarClass.CssClasses.content + '"></div>');
			Util.DOM.appendChild(this.playEl, this.el);
			
			// Previous
			this.previousEl = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.ToolbarClass.CssClasses.previous }, '<div class="' + Code.PhotoSwipe.ToolbarClass.CssClasses.content + '"></div>');
			Util.DOM.appendChild(this.previousEl, this.el);
			
			// Next
			this.nextEl = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.ToolbarClass.CssClasses.next }, '<div class="' + Code.PhotoSwipe.ToolbarClass.CssClasses.content + '"></div>');
			Util.DOM.appendChild(this.nextEl, this.el);
			
		},
		
		
		/*
		 * Function: addEventListeners
		 */
		addEventListeners: function(){
			
			try{
				Util.DOM.addEventListener(this.el, 'touchstart', this.touchStartHandler);
			}
			catch (err){ }
			
			Util.DOM.addEventListener(this.el, 'click', this.clickHandler);
			
		},
		
		
		/*
		 * Function: removeEventListeners
		 */
		removeEventListeners: function(){
			
			try{
				Util.DOM.removeEventListener(this.el, 'touchstart', this.touchStartHandler);
			}
			catch (err){ }
			Util.DOM.removeEventListener(this.el, 'click', this.clickHandler);
			
		},
		
		
		/*
		 * Function: onTouch
		 */
		onTouchStart: function(e){
			
			e.preventDefault();
			
			this.onClick(e);
			
		},
		
		
		/*
		 * Function: onClick
		 */
		onClick: function(e){
			
			var action;
		
			switch(e.target.parentNode){
				
				case this.previousEl:
					if (this.isPreviousActive){
						action = Code.PhotoSwipe.ToolbarClass.Actions.previous;
					}
					break;
					
				case this.nextEl:
					if (this.isNextActive){
						action = Code.PhotoSwipe.ToolbarClass.Actions.next;
					}
					break;
				
				case this.playEl:
					action = Code.PhotoSwipe.ToolbarClass.Actions.play;
					break;
				
				case this.closeEl:
					action = Code.PhotoSwipe.ToolbarClass.Actions.close;
					break;
			}
			
			if (Util.isNothing(action)){
				return;
			}
			
			this.dispatchEvent({ 
				type: Code.PhotoSwipe.ToolbarClass.EventTypes.onClick, 
				target: this, 
				action: action 
			});
			
		},
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			var top;
			
			if (this.settings.position === 'bottom') {
				top = Util.DOM.windowHeight() - Util.DOM.height(this.el) + Util.DOM.windowScrollTop();
			}
			else {
				top = Util.DOM.windowScrollTop();
			}
			
			Util.DOM.setStyle(this.el, 'top', top + 'px');
			Util.DOM.width(this.el, Util.DOM.bodyWidth());
			
		},
		
		
		
		/*
		 * Function: stopFade
		 */
		stopFade: function(){
		
			window.clearTimeout(this.fadeOutTimeout);
			this._super();
			
		},
		
		
		
		/*
		 * Function: postShow
		 */
		postShow: function(){
			
			this.setFadeOutTimeout();
			this._super();
			
		},
		
		
		/*
		 * Function: postFadeIn
		 */
		postFadeIn: function(){
			
			this.setFadeOutTimeout();
			this._super();
			
		},
		
		
		
		/*
		 * Function: setFadeOutTimeout
		 */
		setFadeOutTimeout: function(){
			
			window.clearTimeout(this.fadeOutTimeout);
			
			if (this.settings.toolbarDelay > 0){
				
				this.fadeOutTimeout = window.setTimeout(
					this.fadeOut.bind(this),
					this.settings.toolbarDelay
				);
				
			}
			
		},
		
		
		
		/*
		 * Function: setNextState
		 */
		setNextState: function (disable) {
			
			if (disable) {
				Util.DOM.addClass(this.nextEl, Code.PhotoSwipe.ToolbarClass.CssClasses.nextDisabled);
				this.isNextActive = false;
			}
			else {
				Util.DOM.removeClass(this.nextEl, Code.PhotoSwipe.ToolbarClass.CssClasses.nextDisabled);
				this.isNextActive = true;
			}
			
		},
		
		
		/*
		 * Function: setPreviousState
		 */
		setPreviousState: function (disable) {
			
			if (disable) {
				Util.DOM.addClass(this.previousEl, Code.PhotoSwipe.ToolbarClass.CssClasses.previousDisabled);
				this.isPreviousActive = false;
			}
			else {
				Util.DOM.removeClass(this.previousEl, Code.PhotoSwipe.ToolbarClass.CssClasses.previousDisabled);
				this.isPreviousActive = true;
			}
			
		}
		
	});
	
	
	
	Code.PhotoSwipe.ToolbarClass.CssClasses = {
		caption: 'ps-toolbar',
		top: 'ps-toolbar-top',
		close: 'ps-toolbar-close',
		previous: 'ps-toolbar-previous',
		previousDisabled: 'ps-toolbar-previous-disabled',
		next: 'ps-toolbar-next',
		nextDisabled: 'ps-toolbar-next-disabled',
		play: 'ps-toolbar-play',
		content: 'ps-toolbar-content'
	};
	
	
	
	Code.PhotoSwipe.ToolbarClass.Actions = {
		close: 'close',
		previous: 'previous',
		next: 'next',
		play: 'play'
	};
	
	
	Code.PhotoSwipe.ToolbarClass.EventTypes = {
		onClick: 'onClick'
	};

})(Code.PhotoSwipe.Util);
	