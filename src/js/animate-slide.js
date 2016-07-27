
var slideAnim = function(dir) {

	var __dummyAnimData = { lastFlickDist: 50, lastFlickOffset: 50, lastFlickSpeed: 10 };

	var itemChanged;
	if(!_mainScrollAnimating) {
		_currZoomedItemIndex = _currentItemIndex;
	}

	var itemsDiff = dir;

	var nextCircle;

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
	var finishAnimDuration;


	if(!itemChanged && animateToX > _mainScrollPos.x !== __dummyAnimData.lastFlickSpeed.x > 0) {
		// "return to current" duration, e.g. when dragging from slide 0 to -1
		finishAnimDuration = 333;
	} else {
		finishAnimDuration = Math.abs(__dummyAnimData.lastFlickSpeed.x) > 0 ?
								animateToDist / Math.abs(__dummyAnimData.lastFlickSpeed.x) :
								333;

		finishAnimDuration = Math.min(finishAnimDuration, 400);
		finishAnimDuration = Math.max(finishAnimDuration, 250);
	}

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
}


_registerModule('AnimateSlide', {

    publicMethods: {

         initAnimateSlide: function(){}

		,nextAnim: function(){
			slideAnim(1);
		}
		,prevAnim: function(){
			slideAnim(-1);
		}
    }
});