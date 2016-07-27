/**
 *
 * animate-slide.js
 *
 * - Adds public methods prevAnim() and nextAnim() which animates
 *   the slide transition when switching to the previous or next
 *   slide respectively
 *
 */

var slideAnim = function(dir) {

	var itemsDiff = dir,
		itemChanged,
		nextCircle;

	if(!_mainScrollAnimating) {
		_currZoomedItemIndex = _currentItemIndex;
	}

	if(itemsDiff) {

		_currentItemIndex += itemsDiff;

		if(_currentItemIndex < 0) {
			_currentItemIndex = _options.loop ? _getNumItems()-1 : 0;
			nextCircle = true;
		} else if(_currentItemIndex >= _getNumItems()) {
			_currentItemIndex = _options.loop ? 0 : _getNumItems()-1;
			nextCircle = true;
		}

		if(!nextCircle || _options.loop) {
			_indexDiff += itemsDiff;
			_currPositionIndex -= itemsDiff;
			itemChanged = true;
		}
	}

	var animateToX = _slideSize.x * _currPositionIndex;
	var animateToDist = Math.abs( animateToX - _mainScrollPos.x );
	var finishAnimDuration = (animateToDist > 4000) ? 400 : 300;

	if(_currZoomedItemIndex === _currentItemIndex) {
		itemChanged = false;
	}

	_mainScrollAnimating = true;

	_shout('mainScrollAnimStart');

	_animateProp('mainScroll', _mainScrollPos.x, animateToX, finishAnimDuration, framework.easing.cubic.out,
		_moveMainScroll,
		function() {
			_stopAllAnimations();
			_mainScrollAnimating = false;
			_currZoomedItemIndex = -1;

			if(itemChanged || _currZoomedItemIndex !== _currentItemIndex) {
				self.updateCurrItem();
			}

			_shout('mainScrollAnimComplete');
		}
	);

	if(itemChanged) {
		self.updateCurrItem(true);
	}

	return itemChanged;
};


_registerModule('AnimateSlide', {

	publicMethods: {

		initAnimateSlide: function() {},

		nextAnim: function(){
			slideAnim(1);
		},

		prevAnim: function(){
			slideAnim(-1);
		}
	}
});