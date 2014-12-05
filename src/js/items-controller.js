/**
*
* Controller manages gallery items, their dimensions, and their content.
* 
*/

var _items,
	_tempPanAreaSize = {},
	_tempRealElSize = {},
	_imagesToAppendPool = [],
	_initialContentSet,
	_initialZoomRunning,
	_controllerDefaultOptions = {
		index: 0,
		errorMsg: '<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',
		forceProgressiveLoading: false, // TODO
		preload: [1,1],
		getNumItemsFn: function() {
			return _items.length;
		}
	};


var _getItemAt,
	_getNumItems,
	_initialIsLoop,
	_calculateItemSize = function(item, viewportSize, zoomLevel) {

		if (item.src) {
			var isInitial = !zoomLevel;
			
			if(isInitial) {
				if(!item.vGap) {
					item.vGap = {top:0,bottom:0};
				}
				// allows overriding vertical margin for individual items
				_shout('parseVerticalMargin', item);
			}


			_tempPanAreaSize.x = viewportSize.x;
			_tempPanAreaSize.y = viewportSize.y - item.vGap.top - item.vGap.bottom;

			if (isInitial) {
				var hRatio = _tempPanAreaSize.x / item.w;
				var vRatio = _tempPanAreaSize.y / item.h;

				item.fitRatio = hRatio < vRatio ? hRatio : vRatio;
				item.fillRatio = hRatio > vRatio ? hRatio : vRatio;

				var scaleMode = _options.scaleMode;

				if (scaleMode == 'orig') {
					zoomLevel = 1;
				} else if (scaleMode == 'fit') {
					zoomLevel = item.fitRatio;
				} else if (scaleMode == 'fill') {
					zoomLevel = item.fillRatio;
				}

				if (zoomLevel > 1) {
					zoomLevel = 1;
				}
				item.initialZoomLevel = zoomLevel;
				item.maxZoom = 2;
				item.doubleTapZoom = zoomLevel * 2 > 1 ? zoomLevel * 2 : 1;
				item.minZoom = zoomLevel;
				
				if(!item.bounds) {
					item.bounds = { center:{}, max:{}, min:{} }; // reuse bounds object
				}

				
			}

			if(!zoomLevel) {
				return;
			}


			_tempRealElSize.x = item.w * zoomLevel;
			_tempRealElSize.y = item.h * zoomLevel;


			var bounds = item.bounds;

			// position of element when it's centered
			bounds.center.x = Math.round((_tempPanAreaSize.x - _tempRealElSize.x) / 2);
			bounds.center.y = Math.round((_tempPanAreaSize.y - _tempRealElSize.y) / 2) + item.vGap.top;


			// maximum pan position
			bounds.max.x = (_tempRealElSize.x > _tempPanAreaSize.x) ? Math.round(_tempPanAreaSize.x - _tempRealElSize.x) : bounds.center.x;
			bounds.max.y = (_tempRealElSize.y > _tempPanAreaSize.y) ? Math.round(_tempPanAreaSize.y - _tempRealElSize.y) + item.vGap.top : bounds.center.y;
			
			// minimum pan position
			bounds.min.x = (_tempRealElSize.x > _tempPanAreaSize.x) ? 0 : bounds.center.x;
			bounds.min.y = (_tempRealElSize.y > _tempPanAreaSize.y) ? item.vGap.top : bounds.center.y;

			if (isInitial && zoomLevel === item.initialZoomLevel) {
				item.initialPosition = bounds.center;
			}

			return bounds;
		} else {
			// has no img TODO
		} 

		return false;
	},

	


	_appendImage = function(index, item, baseDiv, img, preventAnimation, keepPlaceholder) {
		var animate;

		// fade in loaded image only when current holder is active, or might be visible
		if(!preventAnimation && (_likelyTouchDevice || _options.alwaysFadeIn) && (index === _currentItemIndex || self.isMainScrollAnimating() || (self.isDragging() && !self.isZooming()) ) ) {
			animate = true;
		}

		if(img) {
			if(animate) {
				img.style.opacity = 0;
			}

			item.imageAppended = true;

			baseDiv.appendChild(img);



			if(animate) {
				setTimeout(function() {
				 	img.style.opacity = 1;
				 	if(keepPlaceholder) {
				 		setTimeout(function() {
							// hide image placeholder "behind"
							if(item && item.loaded && item.placeholder) {
								item.placeholder.style.display = 'none';
								item.placeholder = null;
							}
						}, 500);
				 	}
					
				 }, 50);
			}
		}
	},
	


	_preloadImage = function(item) {
		item.loading = true;
		item.loaded = false;
		var img = item.img = framework.createEl('pswp__img', 'img');
		var onComplete = function() {
			item.loading = false;
			item.loaded = true;

			if(item.loadComplete) {
				item.loadComplete(item);
			} else {
				item.img = null; // no need to store image object
			}
			img.onload = img.onerror = null;
			img = null;
		};
		img.onload = onComplete;
		img.onerror = function() {
			item.loadError = true;
			onComplete();
		};
		

		img.src = item.src;// + '?a=' + Math.random();

		return img;
	},
	_displayError = function(item, holder) {
		if(item.loadError) {
			holder.el.innerHTML = _options.errorMsg.replace('%url%',  item.src );
			return true;
		}
	},
	_appendImagesPool = function() {

		if(_imagesToAppendPool.length) {
			var poolItem;

			for(var i = 0; i < _imagesToAppendPool.length; i++) {
				poolItem = _imagesToAppendPool[i];
				if( poolItem.holder.index === poolItem.index ) {
					_appendImage(poolItem.index, poolItem.item, poolItem.baseDiv, poolItem.img);
				}
			}
			_imagesToAppendPool = [];
		}
	};
	


_registerModule('Controller', {

	publicMethods: {

		lazyLoadItem: function(index) {
			index = _getLoopedId(index);
			var item = _getItemAt(index);

			if(!item || item.loaded || item.loading) {
				return;
			}

			_shout('gettingData', index, item);
			_preloadImage(item);
		},
		initController: function() {
			framework.extend(_options, _controllerDefaultOptions, true);
			self.items = _items = items;
			_getItemAt = self.getItemAt;
			_getNumItems = _options.getNumItemsFn; //self.getNumItems;



			_initialIsLoop = _options.loop;
			if(_getNumItems() < 3) {
				_options.loop = false; // disable loop if less then 3 items
			}

			_listen('beforeChange', function(diff) {

				var p = _options.preload,
					isNext = diff === null ? true : (diff > 0),
					preloadBefore = Math.min(p[0], _getNumItems() ),
					preloadAfter = Math.min(p[1], _getNumItems() ),
					i;


				for(i = 1; i <= (isNext ? preloadAfter : preloadBefore); i++) {
					self.lazyLoadItem(_currentItemIndex+i);
				}
				for(i = 1; i <= (isNext ? preloadBefore : preloadAfter); i++) {
					self.lazyLoadItem(_currentItemIndex-i);
				}
			});

			_listen('initialLayout', function() {
				self.currItem.initialLayout = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
			});

			_listen('mainScrollAnimComplete', _appendImagesPool);
			_listen('initialZoomInEnd', _appendImagesPool);



			_listen('destroy', function() {
				var item;
				for(var i = 0; i < _items.length; i++) {
					item = _items[i];
					// remove reference to DOM elements, for GC
					if(item.container) {
						item.container = null; 
					}
					if(item.placeholder) {
						item.placeholder = null;
					}
					if(item.img) {
						item.img = null;
					}
					if(item.preloader) {
						item.preloader = null;
					}
					if(item.loadError) {
						item.loaded = item.loadError = false;
					}
				}
				_imagesToAppendPool = null;
			});
		},


		getItemAt: function(index) {
			if (index >= 0) {
				return _items[index];
			}
			return false;
		},

		

		allowProgressiveImg: function() {

			// 1. Progressive image loading isn't working on webkit/blink when hw-acceleration (e.g. translateZ) is applied to IMG element.
			//    That's why in PhotoSwipe parent element gets zoom transform, not image itself.
			//    
			// 2. Progressive image loading sometimes blinks in webkit/blink when applying animation to parent element.
			//    That's why it's disabled on touch devices (mainly because of swipe transition)
			//    
			// 3. Progressive image loading sometimes doesn't work in IE (up to 11).

			// Don't allow progressive loading on non-large touch devices
			return _options.forceProgressiveLoading || !_likelyTouchDevice || _options.mouseUsed || screen.width > 1200; // 1200 to eliminate touch devices with large screen (like Chromebook Pixel)
		},

		setContent: function(holder, index) {

			if(_options.loop) {
				index = _getLoopedId(index);
			}
	
			var item = self.getItemAt(index),
				img;

			
			if(item) {

				// allow to override data
				_shout('gettingData', index, item);

//				holder.setAttribute('data-pswp-id', index);
				holder.index = index;

				if( _displayError(item, holder) ) {
					item.initialPosition.x = item.initialPosition.y = 0;
					item.initialZoomLevel = item.maxZoom = item.minZoom = 1;
					_currZoomElementStyle = null;
					item.w = 50;
					item.h = 50;
					_applyZoomPanToItem(item);
					return;
				}
				

				// base container DIV is created only once for each of 3 holders
				var baseDiv;// = (prevItem && prevItem.container)  ? prevItem.container : framework.createEl('pswp__zoom-wrap');
				// if(prevItem && prevItem.container) {
				// 	baseDiv = prevItem.container;
				// 	if(baseDiv.parentNode) {
				// 		baseDiv.parentNode.removeChild(baseDiv);
				// 	}
				// 	baseDiv.innerHTML = '';
				// 	prevItem.container = null;
				// } else {
				// 	baseDiv = framework.createEl('pswp__zoom-wrap');
				// }
				// if(!holder.wrap) {
				// 	holder.wrap = framework.createEl('pswp__zoom-wrap');
				// } else {

				// 	holder.removeChild(holder.wrap);
				// 	holder.wrap.innerHTML = '';
				// }
				baseDiv = framework.createEl('pswp__zoom-wrap');//holder.wrap;

				// allow to override image source, size, etc.
				// if(_options.assignItemData) {
				// 	_options.assignItemData(item);
				// }


				// if(prevItem) {
				// 	prevItem.container = null;
				// 	baseDiv.parentNode.removeChild(baseDiv);
				// 	baseDiv.innerHTML = '';
				// }

				item.container = baseDiv;
				
				if(!item.loaded) {

					item.loadComplete = function(item) {

						// gallery closed before image finished loading
						if(!_isOpen) {
							return;
						}

						// if(!_initialZoomRunning && item.placeholder) {
						// 	item.placeholder.style.display = 'none';
						// }

						if(!img) {
							img = item.img;
						}
						// Apply hw-acceleration only after image is loaded.
						// This is webkit progressive image loading bugfix.
						// https://bugs.webkit.org/show_bug.cgi?id=108630
						// https://code.google.com/p/chromium/issues/detail?id=404547
						img.style.webkitBackfaceVisibility = 'hidden';

						

						// check if holder hasn't changed while image was loading
						if( holder.index === index ) {
							if( _displayError(item, holder) ) {
								return;
							}
							if( !item.imageAppended /*_likelyTouchDevice*/ ) {
								if(_mainScrollAnimating || _initialZoomRunning) {
									_imagesToAppendPool.push({item:item, baseDiv:baseDiv, img:img, index:index, holder:holder});
								} else {
									_appendImage(index, item, baseDiv, img, _mainScrollAnimating || _initialZoomRunning);
								}
							} else {
								// remove preloader & mini-img
								if(!_initialZoomRunning && item.placeholder) {
									item.placeholder.style.display = 'none';
									item.placeholder = null;
								}
							}
						}

						item.loadComplete = null;

						_shout('imageLoadComplete', index, item);
					};



					img = item.img;

					if(framework.features.transform) {
						
						var placeholder = framework.createEl('pswp__img pswp__img--placeholder' + (item.msrc ? '' : ' pswp__img--placeholder--blank') , item.msrc ? 'img' : '');
						if(item.msrc) {
							placeholder.src = item.msrc;
						}
						
						placeholder.style.width = item.w + 'px';
						placeholder.style.height = item.h + 'px';

						baseDiv.appendChild(placeholder);
						item.placeholder = placeholder;

					}
					

					

					if(!item.loading) {
						_preloadImage(item);
					}


					if( self.allowProgressiveImg() ) {
						// just append image
						if(!_initialContentSet) {
							_imagesToAppendPool.push({item:item, baseDiv:baseDiv, img:(img || item.img), index:index, holder:holder});
						} else {
							_appendImage(index, item, baseDiv, (img || item.img), true, true);
						}
					}
					
					

					
					
				} else {
					// image object is created every time, due to bugs of image loading & delay when switching images
					img = framework.createEl('pswp__img', 'img');
					img.style.webkitBackfaceVisibility = 'hidden';
					img.style.opacity = 1;
					img.src = item.src;
					_appendImage(index, item, baseDiv, img, true);
				}
				
				_calculateItemSize(item, _viewportSize);
				

				if(!_initialContentSet && index === _currentItemIndex) {
					_currZoomElementStyle = baseDiv.style;
					_showOrHide(item, img);
				} else {
					_applyZoomPanToItem(item);
				}
				
				holder.el.innerHTML = '';
				holder.el.appendChild(baseDiv);

			} else {
				holder.el.innerHTML = '';
			}

		}



		


	}
});



// TODO: use webworker to lazy-load images?
// 
// 		var blob = new Blob([ ""+
// "   onmessage = function(e) {"+
// "		var urls = e.data,"+
// "        	done = urls.length,"+
// "        	onload = function () {"+
// "            	if (--done === 0) {"+
// "                	self.postMessage('Done!');"+
// "                self.close();"+
// "            	}"+
// "        	};"+
 
// "    	urls.forEach(function (url) {"+
// "        	var xhr = new XMLHttpRequest();"+
// "        	xhr.responseType = 'blob';"+
// "        	xhr.onload = xhr.onerror = onload;"+
// "        	xhr.open('GET', url, true);"+
// "        	xhr.send();"+
// "    	});"+
// " 	}" ]);

// 		var blobURL = window.URL.createObjectURL(blob);

// 		var imgs = [];
//         for(var i = 0; i < items.length; i++) {
//         	imgs.push(items[i].src);
//         }

// 		_worker = new Worker(blobURL);
// 		_worker.onmessage = function(e) {
// 		};
// 		_worker.postMessage(imgs); 

  //       for(var i = 0; i < items.length; i++) {
  //       	var img = new Image();
  //       	img.src = items[i].src;
  //       }
