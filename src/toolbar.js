// Copyright (c) %%year%% by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: %%version%%

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.Toolbar');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	PhotoSwipe.Toolbar.CssClasses = {
		toolbar: 'ps-toolbar',
		toolbarContent: 'ps-toolbar-content',
		toolbarTop: 'ps-toolbar-top',
		caption: 'ps-caption',
		captionBottom: 'ps-caption-bottom',
		captionContent: 'ps-caption-content',
		close: 'ps-toolbar-close',
		play: 'ps-toolbar-play',
		previous: 'ps-toolbar-previous',
		previousDisabled: 'ps-toolbar-previous-disabled',
		next: 'ps-toolbar-next',
		nextDisabled: 'ps-toolbar-next-disabled'
	};
	
	
	
	PhotoSwipe.Toolbar.ToolbarAction = {
		close: 'close',
		play: 'play',
		next: 'next',
		previous: 'previous',
		none: 'none'
	};
	
	
	
	PhotoSwipe.Toolbar.EventTypes = {
		onTap: 'PhotoSwipeToolbarOnClick',
		onBeforeShow: 'PhotoSwipeToolbarOnBeforeShow',
		onShow: 'PhotoSwipeToolbarOnShow',
		onBeforeHide: 'PhotoSwipeToolbarOnBeforeHide',
		onHide: 'PhotoSwipeToolbarOnHide'
	};
	
	
	
	PhotoSwipe.Toolbar.getToolbar = function(){
		
		return '<div class="' + PhotoSwipe.Toolbar.CssClasses.close + '"><div class="' + PhotoSwipe.Toolbar.CssClasses.toolbarContent + '"></div></div><div class="' + PhotoSwipe.Toolbar.CssClasses.play + '"><div class="' + PhotoSwipe.Toolbar.CssClasses.toolbarContent + '"></div></div><div class="' + PhotoSwipe.Toolbar.CssClasses.previous + '"><div class="' + PhotoSwipe.Toolbar.CssClasses.toolbarContent + '"></div></div><div class="' + PhotoSwipe.Toolbar.CssClasses.next + '"><div class="' + PhotoSwipe.Toolbar.CssClasses.toolbarContent + '"></div></div>';
		
	};
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));