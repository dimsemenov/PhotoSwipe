// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(Util){
	
	
	/*
	 * Class: Code.PhotoSwipe.FullSizeImageClass
	 */
	Code.PhotoSwipe.FullSizeImageClass = Code.PhotoSwipe.EventClass.extend({
		
		el: null,
		index: null,
		
		// The naturalWidth and naturalHeight of the image as loaded from the server
		// This maybe different from the width and height set on the img element
		// We need this to scale the image correctly
		naturalWidth: null,
		naturalHeight: null,
		src: null,
		caption: null,
		metaData: null,
		scaleMethod: null,
		isLandscape: null,
		isLoading: null,
		hasLoaded: null,
		
		loadEventHandler: null,
		
		
		/*
		 * Function: init
		 */
		init: function(index, scaleMethod, src, caption, metaData){
			
			this._super();
			
			this.index = index;
			this.naturalWidth = 0;
			this.naturalHeight = 0;
			this.src = src;
			this.caption = caption;
			this.metaData = Util.coalesce(metaData, {});
			this.isLandscape = false;
			this.isLoading = false;
			this.hasLoaded = false;
			this.scaleMethod = scaleMethod;
			
			this.loadEventHandler = this.onLoad.bind(this);
			
		},
		
		
		/*
		 * Function: load
		 */
		load: function(){
			
			// Load in the image
			this.isLoading = true;
			
			this.el = new Image();
			Util.DOM.addClass(this.el, 'ps-full-size-image');
			this.el.onload = this.loadEventHandler;
			this.el.src = this.src;
			
		},
		
		
		/*
		 * Function: onLoad
		 */
		onLoad: function(){
			
			this.naturalWidth = Util.coalesce(this.el.naturalWidth, this.el.width);
			this.naturalHeight = Util.coalesce(this.el.naturalHeight, this.el.height);
			this.isLandscape = (this.naturalWidth > this.naturalHeight);
			this.isLoading = false;
			this.hasLoaded = true;
			
			this.dispatchEvent(Code.PhotoSwipe.FullSizeImageClass.EventTypes.onLoad);
			
		}
	
	
	});
	
	
	Code.PhotoSwipe.FullSizeImageClass.EventTypes = {
		onLoad: 'onLoad'
	};
	

})(Code.PhotoSwipe.Util);
