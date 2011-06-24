// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function (window, Util) {
	
	Util.extend(Util, {
		
		DOM: {
		
			
			/*
			 * Function: resetTranslate
			 * Required for smoother transition on iOS
			 */
			resetTranslate: function(el){
				
				if (Util.browser.webkit){
					if (Util.browser.is3dSupported){
						Util.DOM.setStyle(el, { webkitTransform: 'translate3d(0px, 0px, 0px)'});
					}
					else{
						Util.DOM.setStyle(el, { webkitTransform: 'translate(0px, 0px)'});
					}
				}
				else{
					Util.DOM.setStyle(el, {
						webkitTransform: 'translate(0px, 0px)',
						MozTransform: 'translate(0px, 0px)',
						transform: 'translate(0px, 0px)'
					});
				}
				
			},
		
		
			/*
			 * Function: createElement
			 */
			createElement: function(type, attributes, content){
				
				var retval = document.createElement(type);
					
				for(var attribute in attributes) {
					if(attributes.hasOwnProperty(attribute)){
						retval.setAttribute(attribute, attributes[attribute]);
					}
				}
    
				retval.innerHTML = content || '';
				
				return retval;
				
			},
			
			
			/*
			 * Function: appendChild
			 */
			appendChild: function(childEl, parentEl){
				
				parentEl.appendChild(childEl);
				
			},
			
			
			/*
			 * Function: appendText
			 */
			appendText: function(text, parentEl){
				
				var textNode = document.createTextNode(text);
				Util.DOM.appendChild(textNode, parentEl);
				
			},
			
			
			/*
			 * Function: appendToBody
			 */
			appendToBody: function(childEl){
				
				this.appendChild(childEl, document.body);
				
			},
			
			
			/*
			 * Function: removeChild
			 */
			removeChild: function(childEl, parentEl){
			
				parentEl.removeChild(childEl);
				
			},
			
			
			
			/*
			 * Function: removeChildren
			 */
			removeChildren: function(parentEl){
				
				if (parentEl.hasChildNodes()){
					
					while (parentEl.childNodes.length >= 1){
						parentEl.removeChild(parentEl.childNodes[parentEl.childNodes.length -1]);
					}
					
				}
			
			},
			
			
			
			/*
			 * Function: hasAttribute
			 */
			hasAttribute: function(el, attributeName){
			
				return el.getAttribute(attributeName);
			
			},
			
			
			/*
			 * Function: getAttribute
			 */
			getAttribute: function(el, attributeName){
				
				if(!this.hasAttribute(el, attributeName)){
					return '';
				}
				
				return el.getAttribute(attributeName);
			
			},
			
			
			/*
			 * Function: el, attributeName
			 */
			setAttribute: function(el, attributeName, value){
				
				el.setAttribute(attributeName, value);
				
			},
			
			
			/*
			 * Function: removeAttribute
			 */
			removeAttribute: function(el, attributeName){
				
				if (this.hasAttribute(el, attributeName)){
				
					el.removeAttribute(attributeName);
					
				}
			
			},
			
			
			/*
			 * Function: addClass
			 */
			addClass: function(el, className){
				
				var currentClassValue = Util.DOM.getAttribute(el, 'class');
				
				var re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
				
				if ( ! re.test(currentClassValue) ){
					if (currentClassValue !== ''){
						currentClassValue = currentClassValue + ' ';
					}
					currentClassValue = currentClassValue + className;
					Util.DOM.setAttribute(el, 'class', currentClassValue);
				}
       
			},
			
			
			/*
			 * Function: removeClass
			 */
			removeClass: function(el, className){
			
				var currentClassValue = Util.DOM.getAttribute(el, 'class');
				
				var re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
				
				if (re.test(currentClassValue)){
					
					currentClassValue = currentClassValue.replace(re, ' ');
					
					Util.DOM.setAttribute(el, 'class', currentClassValue);
					Util.DOM.removeClass(el, className);
					
				}
				else{
					currentClassValue = Util.trim(currentClassValue);
					if (currentClassValue === ''){
						Util.DOM.removeAttribute(el, 'class');
					}
					else{
						Util.DOM.setAttribute(el, 'class', currentClassValue);
					}
				}
				
			},
			
			
			/*
			 * Function: hasClass
			 */
			hasClass: function(el, className){
				
				var re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
        return re.test(Util.DOM.getAttribute(el, 'class'));
				
			},
			
			
			/*
			 * Function: setStyle
			 */
			setStyle: function(el, style, value){
				
				if (Util.isObject(style)) {
					for(var propertyName in style) {
						if(style.hasOwnProperty(propertyName)){
							el.style[propertyName] = style[propertyName];
						}
					}
				}
				else {
					el.style[style] = value;
				}
			},
			
			
			/*
			 * Function: getStyle
			 */
			getStyle: function(el, styleName){
				
				return window.getComputedStyle(el,'').getPropertyValue(styleName);
				
			},
			
			
			/*
			 * Function: hide
			 */
			hide: function(el){
				
				// Store the current display value if we use show
				Util.setElementData(el, 'oldDisplayValue', Util.DOM.getStyle(el, 'display'));
				Util.DOM.setStyle(el, 'display', 'none');
			
			},
			
			
			/*
			 * Function: show
			 */
			show: function(el){
				
				if (Util.DOM.getStyle(el, 'display') == 'none'){
					var oldDisplayValue = Util.getElementData(el, 'oldDisplayValue', 'block');
					if (oldDisplayValue === 'none'){
						oldDisplayValue = 'block';
					}
					Util.DOM.setStyle(el, 'display', oldDisplayValue);
				}
				
			},
			
			
			/*
			 * Function: width 
			 * Content width, excludes padding
			 */
			width: function(el, value){
				
				if (!Util.isNothing(value)){
					if (Util.isNumber(value)){
						value = value + 'px';
					}
					el.style.width = value;
				}
				
				return this._getDimension(el, 'width');
				
			},
			
			
			/*
			 * Function: outerWidth
			 */
			outerWidth: function(el){
				
				var retval = Util.DOM.width(el);
				
				retval += parseInt(Util.DOM.getStyle(el, 'padding-left'), 10) + parseInt(Util.DOM.getStyle(el, 'padding-right'), 10); 
				retval += parseInt(Util.DOM.getStyle(el, 'margin-left'), 10) + parseInt(Util.DOM.getStyle(el, 'margin-right'), 10); 
				retval += parseInt(Util.DOM.getStyle(el, 'border-left-width'), 10) + parseInt(Util.DOM.getStyle(el, 'border-right-width'), 10); 
				return retval;
			
			},
			
			
			/*
			 * Function: height 
			 * Content height, excludes padding
			 */
			height: function(el, value){
				
				if (!Util.isNothing(value)){
					if (Util.isNumber(value)){
						value = value + 'px';
					}
					el.style.height = value;
				}
				
				return this._getDimension(el, 'height');
				
			},
			
			
			/*
			 * Function: _getDimension
			 */
			_getDimension: function(el, dimension){
				
				var retval = window.parseInt(window.getComputedStyle(el,'').getPropertyValue(dimension));
				
				if (isNaN(retval)){
					
					// If this is the case, chances are the element is not displayed and we can't get
					// the width and height. This temporarily shows and hides to get the value
					var styleBackup = { 
						display: el.style.display,
						left: el.style.left
					};
					
					el.style.display = 'block';
					el.style.left = '-1000000px';
					
					retval = window.parseInt(window.getComputedStyle(el,'').getPropertyValue(dimension));
					
					el.style.display = styleBackup.display;
					el.style.left = styleBackup.left;
				}
				return retval;
				
			},
			
			
			
			/*
			 * Function: outerHeight
			 */
			outerHeight: function(el){
				
				var retval = Util.DOM.height(el);
				
				retval += parseInt(Util.DOM.getStyle(el, 'padding-top'), 10) + parseInt(Util.DOM.getStyle(el, 'padding-bottom'), 10); 
				retval += parseInt(Util.DOM.getStyle(el, 'margin-top'), 10) + parseInt(Util.DOM.getStyle(el, 'margin-bottom'), 10); 
				retval += parseInt(Util.DOM.getStyle(el, 'border-top-width'), 10) + parseInt(Util.DOM.getStyle(el, 'border-bottom-width'), 10); 
								
				return retval;
			
			},
			
			
			/*
			 * Function: documentWidth
			 */
			documentWidth: function(){
				
				return Util.DOM.width(document.documentElement);
				
			},

			
			/*
			 * Function: documentHeight
			 */
			documentHeight: function(){
				
				return Math.round(Util.DOM.height(document.documentElement));
				
			},
			
			
			/*
			 * Function: bodyWidth
			 */
			bodyWidth: function(){
				
				return Util.DOM.width(document.body);
			
			},
			
			
			/*
			 * Function: bodyHeight
			 */
			bodyHeight: function(){
				
				return Util.DOM.height(document.body);
			
			},
			
			
			/*
			 * Function: windowWidth
			 */
			windowWidth: function(){
			
				return window.innerWidth;
			
			},
			
			
			/*
			 * Function: windowHeight
			 */
			windowHeight: function(){
			
				return window.innerHeight;
			
			},
			
			
			/*
			 * Function: windowScrollLeft
			 */
			windowScrollLeft: function(){
			
				return window.pageXOffset;
			
			},
			
			
			/*
			 * Function: windowScrollTop
			 */
			windowScrollTop: function(){
			
				return window.pageYOffset;
			
			}
			
		}
	
		
	});
	
	
})
(
	window,
	Code.PhotoSwipe.Util
);
