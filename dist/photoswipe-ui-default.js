/*! PhotoSwipe Default UI - 4.0.0 - 2014-12-05
* http://photoswipe.com
* Copyright (c) 2014 Dmitry Semenov; */
/**
*
* UI on top of main sliding area (caption, arrows, close button, etc.).
* Built just using public methods/properties of PhotoSwipe.
* 
*/
(function (root, factory) { 
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory;
	} else {
		root.PhotoSwipeUI_Default = factory();
	}
})(this, function () {

	'use strict';



var PhotoSwipeUI_Default =
 function(pswp, framework) {
	var ui = this;
	var _overlayUIUpdated = false,
		_controlsVisible = true,
		_fullscrenAPI,
		_controls,
		_captionContainer,
		_fakeCaptionContainer,
		_indexIndicator,
		_shareButton,
		_shareModal,
		_shareModalHidden = true,
		_initalCloseOnScrollValue,
		_isIdle,

		_loadingIndicator,
		_loadingIndicatorHidden,
		_loadingIndicatorTimeout,

		_options = {
			barsSize: {top:44, bottom:'auto'},
			closeElClasses: ['item', 'caption', 'zoom-wrap', 'ui', 'top-bar'], 
			timeToIdle: 4000, 
			timeToIdleOutside: 1000,
			loadingIndicatorDelay: 1000, // 2s
			
			addCaptionHTMLFn: function(item, captionEl, isFake) {
				if(!item.title) {
					captionEl.children[0].innerHTML = '';
					return false;
				}
				captionEl.children[0].innerHTML = item.title;
				return true;
			},

			closeEl:true,
			captionEl: true,
			fullscreenEl: true,
			zoomEl: true,
			shareEl: true,
			counterEl: true,
			arrowEl: true,
			preloaderEl: true,

			tapToClose: false,
			tapToToggleControls: true,

			shareButtons: [
				{id:'facebook', label:'Share on Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}'},
				{id:'twitter', label:'Tweet', url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
				{id:'pinterest', label:'Pin it', url:'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'},
				{id:'download', label:'Download image', url:'{{raw_image_url}}', download:true}
			],
			indexIndicatorSep: ' / '

		},
		_blockControlsTap,
		_blockControlsTapTimeout;




	var _onControlsTap = function(e) {


			if(_blockControlsTap) {
				return true;
			}


			e = e || window.event;


			var target = e.target || e.srcElement,
				uiElement,
				clickedClass = target.className,
				found;

			for(var i = 0; i < _uiElements.length; i++) {
				uiElement = _uiElements[i];
				if(uiElement.onTap && clickedClass.indexOf('pswp__' + uiElement.name ) > -1 ) {
					uiElement.onTap();
					found = true;

				}
			}

			if(found) {
				if(e.stopPropagation) {
					e.stopPropagation();
				}
				_blockControlsTap = true;
				_blockControlsTapTimeout = setTimeout(function() {
					_blockControlsTap = false;
				}, 30 );
			}

		},
		_fitControlsInViewport = function() {
			return !pswp.likelyTouchDevice || pswp.options.mouseUsed || screen.width > 1200;
		},
		_toggleShareModal = function() {

			_shareModalHidden = !_shareModalHidden;
			
			
			if(!_shareModalHidden) {
				framework[ (_shareModalHidden ? 'add' : 'remove') + 'Class'](_shareModal, 'pswp__share-modal--hidden');
				setTimeout(function() {
					if(!_shareModalHidden) {
						framework.addClass(_shareModal, 'pswp__share-modal--fade-in');
					}
				}, 30);
			} else {
				framework.removeClass(_shareModal, 'pswp__share-modal--fade-in');
				setTimeout(function() {
					if(_shareModalHidden) {
						framework[ (_shareModalHidden ? 'add' : 'remove') + 'Class'](_shareModal, 'pswp__share-modal--hidden');
					}
				}, 300);
			}
			
			if(!_shareModalHidden) {
				_updateShareURLs();
			}
			return false;
		},
		_openWindowPopup = function(e) {
			e = e || window.event;
			var target = e.target || e.srcElement;

			if(!target.href) {
				return false;
			}

			if( target.hasAttribute('download') ) {
				return true;
			}

			//if( !pswp.options.mouseUsed ) {
			//	target.setAttribute('target', '_self');
			//	return true;
			//}

			window.open(target.href, "pswp_share", "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,top=100,left=" + (window.screen ? Math.round(screen.width / 2 - 275) : 100)  );
			if(!_shareModalHidden) {
				_toggleShareModal();
			}

			
			
			return false;
		},
		_updateShareURLs = function() {
			var shareButtonOut = '',
				shareButtonData,
				shareURL;

			for(var i = 0; i < pswp.options.shareButtons.length; i++) {
				shareButtonData = pswp.options.shareButtons[i];

				shareURL = shareButtonData.url.replace('{{url}}', encodeURIComponent(window.location.href) )
									.replace('{{image_url}}', encodeURIComponent(pswp.currItem.src || '') )
									.replace('{{raw_image_url}}', pswp.currItem.src || '' )
									.replace('{{text}}', encodeURIComponent(pswp.currItem.title || '') );

				shareButtonOut += '<a href="' + shareURL + '" target="_blank" class="pswp__share--' + shareButtonData.id + '"' + (shareButtonData.download ? 'download' : '') + '>' + shareButtonData.label + '</a>';
			}
			_shareModal.children[0].innerHTML = shareButtonOut;
			_shareModal.children[0].onclick = _openWindowPopup;

		},
		_hasCloseClass = function(target) {
			for(var  i = 0; i < pswp.options.closeElClasses.length; i++) {
				if( framework.hasClass(target, 'pswp__' + pswp.options.closeElClasses[i]) ) {
					return true;
				}
			}
		},
		_idleInterval,
		_idleTimer,
		_idleIncrement = 0,
		_onIdleMouseMove = function() {
			clearTimeout(_idleTimer);
			_idleIncrement = 0;
			if(_isIdle) {
				ui.setIdle(false);
			}
		},
		_onMouseLeaveWindow = function(e) {
			e = e ? e : window.event;
	        var from = e.relatedTarget || e.toElement;
	        if (!from || from.nodeName == "HTML") {
	        	clearTimeout(_idleTimer);
	        	_idleTimer = setTimeout(function() {
	        		ui.setIdle(true);
	        	}, pswp.options.timeToIdleOutside);
	        }
		},
		_toggleLoadingIndicator = function(hide) {

			if( /*pswp.likelyTouchDevice*/ _loadingIndicatorHidden !== hide ) {
				framework[ (hide ? 'remove' : 'add') + 'Class' ](_loadingIndicator, 'pswp__preloader--active');
				_loadingIndicatorHidden = hide;
			}
		};



	var _uiElements = [
		{ 
			name: 'caption', 
			option: 'captionEl',
			onInit: function(el) {  
				_captionContainer = el; 
			} 
		},
		{ 
			name: 'share-modal', 
			option: 'shareEl',
			onInit: function(el) {  
				_shareModal = el;
			},
			onTap: function() {
				_toggleShareModal();
			} 
		},
		{ 
			name: 'button--share', 
			option: 'shareEl',
			onInit: function(el) { 
				_shareButton = el;
			},
			onTap: function() {
				_toggleShareModal();
			} 
		},
		{ 
			name: 'button--zoom', 
			option: 'zoomEl',
			onTap: pswp.toggleDesktopZoom
		},
		{ 
			name: 'counter', 
			option: 'counterEl',
			onInit: function(el) {  
				_indexIndicator = el;
			} 
		},
		{ 
			name: 'button--close', 
			option: 'closeEl',
			onTap: pswp.close
		},
		{ 
			name: 'button--arrow--left', 
			option: 'arrowEl',
			onTap: pswp.prev
		},
		{ 
			name: 'button--arrow--right', 
			option: 'arrowEl',
			onTap: pswp.next
		},
		{ 
			name: 'button--fs', 
			option: 'fullscreenEl',
			onTap: function() {  
				if(_fullscrenAPI.isFullscreen()) {
					_fullscrenAPI.exit();
				} else {
					_fullscrenAPI.enter();
				}
			} 
		},
		{ 
			name: 'preloader', 
			option: 'preloaderEl',
			onInit: function(el) {  
				_loadingIndicator = el;
			} 
		}

	];



	

	ui.init = function() {
		//return;


		//window.pswp = pswp;

		framework.extend(pswp.options, _options, true);
		_controls = pswp.scrollWrap.children[1];//pswp.template.children[2];
		

		
		var _listen = pswp.listen;

		
		// Hide controls on vertical drag
		_listen('onVerticalDrag', function(now) {

			if(_controlsVisible && now < 0.95) {
				ui.hideControls();
			} else if(!_controlsVisible && now >= 0.95) {
				ui.showControls();
			}
			
		});

		// Hide controls when pinching to close
		var pinchControlsHidden;
		_listen('onPinchClose' , function(now) {
			if(_controlsVisible && now < 0.9) {
				ui.hideControls();
				pinchControlsHidden = true;
			} else if(pinchControlsHidden && !_controlsVisible && now > 0.9) {
				ui.showControls();
			}
		});
		_listen('zoomGestureEnded', function() {
			pinchControlsHidden = false;
			if(pinchControlsHidden && !_controlsVisible) {
				ui.showControls();
			}
			
		});

		_listen('beforeChange', ui.update);


		//
		// _listen('zoomGestureStarted', function() {

		// 	if(pswp.options.tapToToggleControls ) {
		// 		ui.hideControls();
		// 	}
			
		// });

		// _listen('zoomGestureEnded', function() {

		// 	if(pswp.options.tapToToggleControls && pswp.getZoomLevel() <= pswp.currItem.fitRatio ) {
		// 		ui.showControls();
		// 	}
			
		// });

		_listen('doubleTap', function(point) {

			//pswp.toggleDesktopZoom(point);
			// toggleDesktopZoom



			var initialZoomLevel = pswp.currItem.initialZoomLevel;
			if(pswp.getZoomLevel() !== initialZoomLevel) {
				pswp.zoomTo(initialZoomLevel, point, 333);
			} else {
				pswp.zoomTo(pswp.currItem.doubleTapZoom, point, 333);
			}
		});






		_listen('bindEvents', function() {
			framework.bind(_controls, 'pswpTap click', _onControlsTap);
			framework.bind(pswp.scrollWrap, 'pswpTap', ui.onGlobalTap);

			if(!pswp.likelyTouchDevice) {
				framework.bind(pswp.scrollWrap, 'mouseover', ui.onMouseOver);
			}

			
		});
		

		if(pswp.options.timeToIdle) {
			_listen('mouseUsed', function() {
				
				framework.bind(document, 'mousemove', _onIdleMouseMove);
				framework.bind(document, 'mouseout', _onMouseLeaveWindow);

				_idleInterval = setInterval(function() {
					_idleIncrement++;
					if(_idleIncrement === 2) {
						ui.setIdle(true);
					}
				}, pswp.options.timeToIdle / 2);
			});
		}
		


		_listen('preventDragEvent', function(e, isDown, preventObj) {
			var t = e.target || e.srcElement;
			if(t && t.className && e.type.indexOf('mouse') > -1 && ( t.className.indexOf('__caption') > 0 || (/(SMALL|STRONG|EM)/i).test(t.tagName) ) ) {
				preventObj.prevent = false;
			}
		});


		_listen('unbindEvents', function() {
			if(!_shareModalHidden) {
				_toggleShareModal();
			}

			if(_idleInterval) {
				clearInterval(_idleInterval);
			}
			framework.unbind(document, 'mouseout', _onMouseLeaveWindow);
			framework.unbind(document, 'mousemove', _onIdleMouseMove);
			framework.unbind(_controls, 'pswpTap click', _onControlsTap);
			framework.unbind(pswp.scrollWrap, 'pswpTap', ui.onGlobalTap);
			framework.unbind(pswp.scrollWrap, 'mouseover', ui.onMouseOver);

			if(_fullscrenAPI) {
				framework.unbind(document, _fullscrenAPI.eventK, ui.updateFullscreen);
				if(_fullscrenAPI.isFullscreen()) {
					_options.hideAnimationDuration = 0;
					_fullscrenAPI.exit();
				}
				_fullscrenAPI = null;
			}
		});


		_listen('destroy', function() {


			if(pswp.options.captionEl) {
				if(_fakeCaptionContainer) {
					_controls.removeChild(_fakeCaptionContainer);
				}

				framework.removeClass(_captionContainer, 'pswp__caption--empty');
			}
			

			if(_shareModal) {
				_shareModal.children[0].onclick = null;
			}
			framework.removeClass(_controls, 'pswp__ui--over-close');
			framework.addClass( _controls, 'pswp__ui--hidden');
			ui.setIdle(false);

		});
		

		if(!pswp.options.showAnimationDuration) {
			framework.removeClass( _controls, 'pswp__ui--hidden');
		}
		_listen('initialZoomIn', function() {
			if(pswp.options.showAnimationDuration) {
				framework.removeClass( _controls, 'pswp__ui--hidden');
			}
		});
		_listen('initialZoomOut', function() {
			framework.addClass( _controls, 'pswp__ui--hidden');
		});

		

		_listen('parseVerticalMargin', function(item) {
			var gap = item.vGap;
			// if(pswp.options.customGap) {
			// 	gap.top = pswp.options.customGap.top;
			// 	gap.bottom = pswp.options.customGap.bottom;
			// 	return;
			// }
			if( _fitControlsInViewport() /* !pswp.likelyTouchDevice || pswp.options.mouseUsed || screen.width > 1200 */ /* pswp.viewportSize.y > 800 */) {
				
				var bars = pswp.options.barsSize; 
				if(pswp.options.captionEl && bars.bottom === 'auto') {
					if(!_fakeCaptionContainer) {
						_fakeCaptionContainer = framework.createEl('pswp__caption pswp__caption--fake');
						_fakeCaptionContainer.appendChild( framework.createEl('pswp__caption__center') );
						_controls.insertBefore(_fakeCaptionContainer, _captionContainer);
						framework.addClass(_controls, 'pswp__ui--fit');
					}
					if( pswp.options.addCaptionHTMLFn(item, _fakeCaptionContainer, true) ) {

						var captionSize = _fakeCaptionContainer.clientHeight;
						gap.bottom = parseInt(captionSize,10) || 44;
					} else {
						gap.bottom = bars.top; // if no caption, set size of bottom gap to size of top
					}
				} else {
					gap.bottom = bars.bottom;
				}
				
				// height of top bar is static, no need to calculate it
				gap.top = bars.top;
			} else {
				gap.top = gap.bottom = 0;
			}
		});


	  
		var item,
			classAttr,
			uiElement;

		

	  	var loopThroughChildElements = function(sChildren) {
	  		var l = sChildren.length;
			for(var i = 0; i < l; i++) {
				item = sChildren[i];
				classAttr = item.className;

				for(var a = 0; a < _uiElements.length; a++) {
					uiElement = _uiElements[a];

					
						if(classAttr.indexOf('pswp__' + uiElement.name) > -1  ) {

							if( pswp.options[uiElement.option] ) { // if element is not disabled from options
								
								framework.removeClass(item, 'pswp__element--disabled');
								if(uiElement.onInit) {
									uiElement.onInit(item);
								}
								
								//item.style.display = 'block';
							} else {
								framework.addClass(item, 'pswp__element--disabled');
								//item.style.display = 'none';
							}

							

						}
				}
			}
	  	};
	  	loopThroughChildElements(_controls.children);
	  	loopThroughChildElements(_controls.children[0].children);
		

		if(pswp.options.shareEl && _shareButton && _shareModal) {
			_shareModalHidden = true;
		}


		if(pswp.options.fullscreenEl) {
			if(!_fullscrenAPI) {
				_fullscrenAPI = ui.getFullscreenAPI();
			}
			if(_fullscrenAPI) {
				framework.bind(document, _fullscrenAPI.eventK, ui.updateFullscreen);
				ui.updateFullscreen();
				framework.addClass(pswp.template, 'pswp--supports-fs');
			} else {
				framework.removeClass(pswp.template, 'pswp--supports-fs');
			}
		}


		

		// Setup loading indicator
		if(pswp.options.preloaderEl) {
		
			_toggleLoadingIndicator(true);

			_listen('beforeChange', function() {

				clearTimeout(_loadingIndicatorTimeout);

				// display loading indicator with delay
				_loadingIndicatorTimeout = setTimeout(function() {

					if(pswp.currItem && pswp.currItem.loading) {

						if( !pswp.allowProgressiveImg() || (pswp.currItem.img && !pswp.currItem.img.naturalWidth)  ) {
							_toggleLoadingIndicator(false); // show preloader if progressive loading is not enabled, or image width is not defined yet (because of slow connection)
							// items-controller.js function allowProgressiveImg
						}
						
					} else {
						_toggleLoadingIndicator(true); // hide preloader
					}

				}, pswp.options.loadingIndicatorDelay);
				
			});
			_listen('imageLoadComplete', function(index, item) {
				if(pswp.currItem === item) {
					_toggleLoadingIndicator(true);
				}
			});

		}




		
	};

	ui.setIdle = function(isIdle) {
		_isIdle = isIdle;
		framework[ (isIdle ? 'add' : 'remove') + 'Class' ](_controls, 'pswp__ui--idle');
	};

	ui.update = function() {
		// Don't update UI if it's hidden
		if(_controlsVisible && pswp.currItem) {
			
				
			ui.updateIndexIndicator();

			if(pswp.options.captionEl) {
				pswp.options.addCaptionHTMLFn(pswp.currItem, _captionContainer);

				if(!pswp.currItem.title) {
					framework.addClass(_captionContainer, 'pswp__caption--empty');
				} else {
					framework.removeClass(_captionContainer, 'pswp__caption--empty');
				}
			}

			_overlayUIUpdated = true;

				
		} else {
			_overlayUIUpdated = false;
		}
	};
	ui.updateFullscreen = function() {
		framework[ (_fullscrenAPI.isFullscreen() ? 'add' : 'remove') + 'Class' ](pswp.template, 'pswp--fs');
	};
	ui.updateIndexIndicator = function() {
		if(pswp.options.counterEl) {
			// +1, because human-friendly index starts from one.
			_indexIndicator.innerHTML = (pswp.getCurrentIndex()+1) + pswp.options.indexIndicatorSep + pswp.options.getNumItemsFn();
		}
		
	};
	
	ui.onGlobalTap = function(e) {
		e = e || window.event;
		var target = e.target || e.srcElement;


		if(_blockControlsTap) {
			return;
		}

		// if(e.detail.pointerType !== 'touch' && framework.hasClass(target, 'pswp__img') ) { 		


		if(e.detail && e.detail.pointerType === 'mouse') {

			// close gallery if clicked outside of the image
			if(_hasCloseClass(target)) {
				pswp.close();
			}

			if(framework.hasClass(target, 'pswp__img')) {
				if(pswp.getZoomLevel() === 1 && pswp.getZoomLevel() <= pswp.currItem.fitRatio) {
					pswp.close();
				} else {
					pswp.toggleDesktopZoom(e.detail.releasePoint);
				}
			}
			
		} else {

			// tap anywhere (except buttons) to toggle visibility of controls
	
			if(pswp.options.tapToToggleControls) {
				if(_controlsVisible) {
					ui.hideControls();
				} else {
					ui.showControls();
				}
			}

			// tap to close gallery
			if(pswp.options.tapToClose && (framework.hasClass(target, 'pswp__img') || _hasCloseClass(target)) ) {
				pswp.close();
				return;
			}
			
		}

		

	};
	ui.onMouseOver = function(e) {
		e = e || window.event;
		var target = e.target || e.srcElement;

		// apply class when mouse is over an element that should close the gallery
		if(_hasCloseClass(target)) {
			framework.addClass(_controls, 'pswp__ui--over-close');
		} else {
			framework.removeClass(_controls, 'pswp__ui--over-close');
		}

		// if(_overImage) {

		// }
	};

	ui.hideControls = function() {
		framework.addClass(_controls,'pswp__ui--hidden');
		_controlsVisible = false;
	};

	ui.showControls = function() {
		_controlsVisible = true;
		if(!_overlayUIUpdated) {
			ui.update();
		}
		framework.removeClass(_controls,'pswp__ui--hidden');
	};

	ui.supportsFullscreen = function() {
		var d = document;
		return !!(d.exitFullscreen || d.mozCancelFullScreen || d.webkitExitFullscreen || d.msExitFullscreen);
	};

	ui.getFullscreenAPI = function() {
		var dE = document.documentElement,
			api,
			tF = 'fullscreenchange';

	  	if (dE.requestFullscreen) {
			api = {
				enterK: 'requestFullscreen',
				exitK: 'exitFullscreen',
				elementK: 'fullscreenElement',
				eventK: tF
			};

		} else if(dE.mozRequestFullScreen ) {
			api = {
				enterK: 'mozRequestFullScreen',
				exitK: 'mozCancelFullScreen',
				elementK: 'mozFullScreenElement',
				eventK: 'moz' + tF
			};

			

		} else if(dE.webkitRequestFullscreen) {
			api = {
				enterK: 'webkitRequestFullscreen',
				exitK: 'webkitExitFullscreen',
				elementK: 'webkitFullscreenElement',
				eventK: 'webkit' + tF
			};

		} else if(dE.msRequestFullscreen) {
			api = {
				enterK: 'msRequestFullscreen',
				exitK: 'msExitFullscreen',
				elementK: 'msFullscreenElement',
				eventK: 'MSFullscreenChange'
			};
		}

		if(api) {
			api.enter = function() { 
				// disable close-on-scroll in fullscreen
				_initalCloseOnScrollValue = pswp.options.closeOnScroll; 
				pswp.options.closeOnScroll = false; 

				return pswp.template[this.enterK]( Element.ALLOW_KEYBOARD_INPUT ); 
			};
			api.exit = function() { 
				pswp.options.closeOnScroll = _initalCloseOnScrollValue;

				return document[this.exitK](); 

			};
			api.isFullscreen = function() { return document[this.elementK]; };
		}

		return api;
	};



};
return PhotoSwipeUI_Default;


});
