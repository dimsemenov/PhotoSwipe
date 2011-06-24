// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, Util){
	
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
		touchMoveHandler: null,
		touched: null,
		
		isNextActive: null,
		isPreviousActive: null,
		
		
		/*
		 * Function: init
		 */
		init: function(options){
			
			this.settings = {
				position: 'bottom',
				hideClose: false,
				zIndex: 1000
			};
			
			Util.extend(this.settings, options);
			
			this._super(this.settings);
			
			this.isNextActive = true;
			this.isPreviousActive = true;
			this.touched = false;
			
			this.clickHandler = this.onClick.bind(this);
			
			if (Util.browser.touchSupported){
				this.touchMoveHandler = this.onTouchMove.bind(this);
				this.touchStartHandler = this.onTouchStart.bind(this);
			}
			
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
				zIndex: this.settings.zIndex,
				display: 'table',
				opacity: 0
			});
			Util.DOM.hide(this.el);
			Util.DOM.appendToBody(this.el);
			
			
			// Close
			this.closeEl = Util.DOM.createElement('div', { 'class': Code.PhotoSwipe.ToolbarClass.CssClasses.close }, '<div class="' + Code.PhotoSwipe.ToolbarClass.CssClasses.content + '"></div>');
			
			if (this.settings.hideClose){
				Util.DOM.hide(this.closeEl);
			}
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
		 * Function: postFadeIn
		 */
		postFadeIn: function(e){
			
			if (this.isHidden){
				return;
			}
			
			Util.DOM.setStyle(this.el, { display: 'table' });
			
			this._super(this.settings);
						
		},
		
		
		/*
		 * Function: addEventHandlers
		 */
		addEventHandlers: function(){
					
			if (Util.browser.touchSupported){
				// Had an issue with touchstart, animation and Blackberry. BB will default to click
				if (!Util.browser.isBlackberry){
					Util.Events.add(this.el, 'touchstart', this.touchStartHandler);
				}
				Util.Events.add(this.el, 'touchmove', this.touchMoveHandler);
			}
			
			Util.Events.add(this.el, 'click', this.clickHandler);
			
		},
		
				
		/*
		 * Function: removeEventHandlers
		 */
		removeEventHandlers: function(){
			
			if (Util.browser.touchSupported){
				if (!Util.browser.isBlackberry){
					Util.Events.remove(this.el, 'touchstart', this.touchStartHandler);
				}
				Util.Events.remove(this.el, 'touchmove', this.touchMoveHandler);
			}
			Util.Events.remove(this.el, 'click', this.clickHandler);
			
		},
		
		
		/*
		 * Function: onTouchStart
		 */
		onTouchStart: function(e){
			
			e.preventDefault();
			
			this.touched = true;
			this.handleClick(e);
			
		},
		
		
		/*
		 * Function: onTouchMove
		 */
		onTouchMove: function(e){
			
			e.preventDefault();
						
		},
		
		
		/*
		 * Function: onClick
		 */
		onClick: function(e){
			
			if (this.touched){
				return;
			}
			
			this.handleClick(e);
			
		},
		
		
		
		/*
		 * Function: handleClick
		 */
		handleClick: function(e){
						
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
			
			Util.Events.fire(this, { 
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
				top = Util.DOM.windowHeight() - Util.DOM.outerHeight(this.el) + Util.DOM.windowScrollTop();
			}
			else {
				top = Util.DOM.windowScrollTop();
			}
					
			Util.DOM.setStyle(this.el, 'top', top + 'px');
			Util.DOM.width(this.el, Util.DOM.bodyWidth());
						
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
		onClick: 'PhotoSwipeToolbarClassOnClick'
	};

})
(
	window,
	Code.PhotoSwipe.Util
);
	