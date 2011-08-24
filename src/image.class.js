// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.Image');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	
	PhotoSwipe.Image.ImageClass = klass({
		
		
		
		refObj: null,
		imageEl: null,
		src: null,
		caption: null,
		metaData: null,
		naturalWidth: null,
		naturalHeight: null,
		isLandscape: null,
		isLoading: null,
		imageLoadHandler: null,
		
		
		
		/*
		 * Function: dispose
		 */
		dispose: function(){
		
			var prop, i;
			
			this.shrinkImage();
			
			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}
		
		},
		
		
		
		/*
		 * Function: initialize
		 */
		initialize: function(refObj, src, caption, metaData){
			
			this.refObj = refObj;
			this.src = src;
			this.caption = caption;
			this.metaData = metaData;
			this.naturalWidth = 0;
			this.naturalHeight = 0;
			this.isLandscape = false;
			this.isLoading = false;
			
			this.imageEl = new window.Image();
			
			this.imageLoadHandler = this.onImageLoad.bind(this);
			
		},
		
		
		
		/*
		 * Function: load
		 */
		load: function(){
			
			if (this.imageEl.src.indexOf(this.src) > -1){
				Util.Events.fire(this, {
					type: PhotoSwipe.Image.EventTypes.onLoad,
					target: this
				});
				return;
			}
			
			this.imageEl.isLoading = true;
			this.imageEl.onload = this.imageLoadHandler;
			this.imageEl.src = this.src;
			
		},
		
		
		
		/*
		 * Function: shrinkImage
		 */
		shrinkImage: function(){
		
			if (Util.isNothing(this.imageEl)){
				return;
			}
			
			if (this.imageEl.src.indexOf(this.src) > -1){
				this.imageEl.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
				if (!Util.isNothing(this.imageEl.parentNode)){
					Util.DOM.removeChild(this.imageEl, this.imageEl.parentNode);
				}
			}
		
		},
		
		
		
		/*
		 * Function: onImageLoad
		 */
		onImageLoad: function(e){
			
			this.imageEl.onload = null;
			this.imageEl.naturalWidth = Util.coalesce(this.imageEl.naturalWidth, this.imageEl.width);
			this.imageEl.naturalHeight = Util.coalesce(this.imageEl.naturalHeight, this.imageEl.height);
			this.imageEl.isLandscape = (this.imageEl.naturalWidth > this.imageEl.naturalHeight);
			this.imageEl.isLoading = false;
			
			Util.Events.fire(this, {
				type: PhotoSwipe.Image.EventTypes.onLoad,
				target: this
			});
			
		}
		
		
		
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));