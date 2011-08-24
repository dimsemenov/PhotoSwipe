// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function (window, $, Util) {
	
	Util.extend(Util, {
		
		DOM: {
		
			
			/*
			 * Function: setData
			 */
			setData: function(el, key, value){
			
				Util.DOM.setAttribute(el, 'data-' + key, value);
			
			},
			
			
			
			/*
			 * Function: getData
			 */
			getData: function(el, key, defaultValue){
				
				return Util.DOM.getAttribute(el, 'data-' + key, defaultValue);
				
			},
			
			
			
			/*
			 * Function: removeData
			 */
			removeData: function(el, key){
			
				Util.DOM.removeAttribute(el, 'data-' + key);
				
			},
			
			
			
			/*
			 * Function: isChildOf
			 */
			isChildOf: function(childEl, parentEl)
			{
				if (parentEl === childEl){ 
					return false; 
				}
				while (childEl && childEl !== parentEl)
				{ 
					childEl = childEl.parentNode; 
				}

				return childEl === parentEl;
			},
			
			
			
			/*
			 * Function: find
			 */
			find: function(selectors, contextEl){
				if (Util.isNothing(contextEl)){
					contextEl = window.document;
				}
				var 
					els = $(selectors, contextEl),
					retval = [],
					i;
				
				for (i=0; i<els.length; i++){
					retval.push(els[i]);
				}
				return retval;
			},
			
			
		
			/*
			 * Function: createElement
			 */
			createElement: function(type, attributes, content){
				
				var retval = $('<' + type +'></' + type + '>');
				retval.attr(attributes);
				retval.append(content);
				
				return retval[0];
				
			},
			
			
			
			/*
			 * Function: appendChild
			 */
			appendChild: function(childEl, parentEl){
				
				$(parentEl).append(childEl);
				
			},
			
			
			
			/*
			 * Function: insertBefore
			 */
			insertBefore: function(newEl, refEl, parentEl){
				
				$(newEl).insertBefore(refEl);
				
			},
			
			
			
			/*
			 * Function: appendText
			 */
			appendText: function(text, parentEl){
				
				$(parentEl).text(text);
				
			},
			
			
			
			/*
			 * Function: appendToBody
			 */
			appendToBody: function(childEl){
				
				$('body').append(childEl);
				
			},
			
			
			
			/*
			 * Function: removeChild
			 */
			removeChild: function(childEl, parentEl){
				
				$(childEl).empty().remove();
				
			},
			
			
			
			/*
			 * Function: removeChildren
			 */
			removeChildren: function(parentEl){
				
				$(parentEl).empty();
			
			},
			
			
			
			/*
			 * Function: hasAttribute
			 */
			hasAttribute: function(el, attributeName){
				
				return !Util.isNothing( $(el).attr(attributeName) );
			
			},
			
			
			
			/*
			 * Function: getAttribute
			 */
			getAttribute: function(el, attributeName, defaultValue){
				
				var retval = $(el).attr(attributeName);
				if (Util.isNothing(retval) && !Util.isNothing(defaultValue)){
					retval = defaultValue;
				}
				return retval;
			
			},
			
			
			
			/*
			 * Function: el, attributeName
			 */
			setAttribute: function(el, attributeName, value){
				
				$(el).attr(attributeName, value);
				
			},
			
			
			
			/*
			 * Function: removeAttribute
			 */
			removeAttribute: function(el, attributeName){
				
				$(el).removeAttr(attributeName);
				
			},
			
			
			
			/*
			 * Function: addClass
			 */
			addClass: function(el, className){
				
				$(el).addClass(className);
				
			},
			
			
			
			/*
			 * Function: removeClass
			 */
			removeClass: function(el, className){
			
				$(el).removeClass(className);
				
			},
			
			
			
			/*
			 * Function: hasClass
			 */
			hasClass: function(el, className){
				
				$(el).hasClass(className);
				
			},
			
			
			
			/*
			 * Function: setStyle
			 */
			setStyle: function(el, style, value){
				
				var prop;
				
				if (Util.isObject(style)) {
					for(prop in style) {
						if(Util.objectHasProperty(style, prop)){
							if (prop === 'width'){
								Util.DOM.width(el, style[prop]);
							}
							else if (prop === 'height'){
								Util.DOM.height(el, style[prop]);
							}
							else{
								$(el).css(prop, style[prop]);
								el.style[prop] = style[prop];
							}
						}
					}
				}
				else {
					$(el).css(style, value);
				}
				
			},
			
			
			
			/*
			 * Function: getStyle
			 */
			getStyle: function(el, styleName){
				
				return $(el).css(styleName);
				
			},
			
			
			
			/*
			 * Function: hide
			 */
			hide: function(el){
				
				$(el).hide();
			
			},
			
			
			
			/*
			 * Function: show
			 */
			show: function(el){
				
				$(el).show();
				
			},
			
			
			
			/*
			 * Function: width 
			 * Content width, exludes padding
			 */
			width: function(el, value){
				
				if (!Util.isNothing(value)){
					$(el).width(value);
				}
				
				return $(el).width();
				
			},
			
			
			
			/*
			 * Function: outerWidth
			 */
			outerWidth: function(el){
				
				return $(el).outerWidth();
			
			},
			
			
			
			/*
			 * Function: height 
			 * Content height, excludes padding
			 */
			height: function(el, value){
				
				if (!Util.isNothing(value)){
					$(el).height(value);
				}
				
				return $(el).height();
				
			},
			
			
			
			/*
			 * Function: outerHeight
			 */
			outerHeight: function(el){
				
				return $(el).outerHeight();
				
			},
			
			
			
			/*
			 * Function: documentWidth
			 */
			documentWidth: function(){
				
				return $(document.documentElement).width();
				
			},

			
			
			/*
			 * Function: documentHeight
			 */
			documentHeight: function(){
				
				return $(document.documentElement).height();
				
			},
			
			
			
			/*
			 * Function: documentOuterWidth
			 */
			documentOuterWidth: function(){
				
				return Util.DOM.width(document.documentElement);
				
			},

			
			
			/*
			 * Function: documentOuterHeight
			 */
			documentOuterHeight: function(){
				
				return Util.DOM.outerHeight(document.documentElement);
				
			},
			
			
			
			/*
			 * Function: bodyWidth
			 */
			bodyWidth: function(){
				
				return $(document.body).width();
			
			},
			
			
			
			/*
			 * Function: bodyHeight
			 */
			bodyHeight: function(){
				
				return $(document.body).height();
			
			},
			
			
			
			/*
			 * Function: bodyOuterWidth
			 */
			bodyOuterWidth: function(){
				
				return Util.DOM.outerWidth(document.body);
			
			},
			
			
			
			/*
			 * Function: bodyOuterHeight
			 */
			bodyOuterHeight: function(){
				
				return Util.DOM.outerHeight(document.body);
			
			},
			
			
			
			/*
			 * Function: windowWidth
			 */
			windowWidth: function(){
				//IE
				if(!window.innerWidth) {
					return $(window).width();
				}
				//w3c
				return window.innerWidth;
			},
			
			
			
			/*
			 * Function: windowHeight
			 */
			windowHeight: function(){
				//IE
				if(!window.innerHeight) {
					return $(window).height();
				}
				//w3c
				return window.innerHeight;
			},
			
			
			
			/*
			 * Function: windowScrollLeft
			 */
			windowScrollLeft: function(){
				//IE
				if(!window.pageXOffset) {
					return $(window).scrollLeft();
				}
				//w3c
				return window.pageXOffset;
			},
			
			
			
			/*
			 * Function: windowScrollTop
			 */
			windowScrollTop: function(){
				//IE
				if(!window.pageYOffset) {
					return $(window).scrollTop();
				}
				//w3c
				return window.pageYOffset;
			}
			
		}
	
		
	});
	
	
}
(
	window,
	window.jQuery,
	window.Code.Util
));
