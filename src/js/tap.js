/* Module dispatches tap event (pswpTap), and manages double-tap */


var tapTimer,
	tapReleasePoint = {},
	_dispatchTapEvent = function(origEvent, releasePoint, pointerType) {		
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( 'pswpTap', true, true, {origEvent:origEvent, target:origEvent.target, releasePoint: releasePoint, pointerType:pointerType || 'touch'} );
		origEvent.target.dispatchEvent( evt );
	};

_registerModule('Tap', {

	publicMethods: {

		initTap: function() {
			_listen('firstTouchStart', self.onTapStart);
			_listen('touchRelease', self.onTapRelease);
			_listen('destroy', function() {
				tapReleasePoint = {};
				tapTimer = null;
			});
		},
		onTapStart: function(touchList) {

			if(touchList.length > 1) {
				clearTimeout(tapTimer);
				tapTimer = null;
			}
		},
		onTapRelease: function(e, releasePoint) {

			if(!releasePoint) {
				return;
			}

			if(!_moved && !_isMultitouch && !_numAnimations) {

				var p0 = releasePoint;
				if(tapTimer) {
					clearTimeout(tapTimer);
					tapTimer = null;

					// Check if taped on the same place
					if ( _isNearbyPoints(p0, tapReleasePoint) ) {
						//self.onDoubleTap(p0);
						_shout('doubleTap', p0);
						return;
					}
				}
				
				var clickedTagName = e.target.tagName.toLowerCase();

				if(releasePoint.type === 'mouse') {
					_dispatchTapEvent(e, releasePoint, 'mouse');
					return;
				}

				// avoid double tap delay on buttons and elements that have class pswp__single-tap
				if(clickedTagName === 'button' || framework.hasClass(e.target, 'pswp__single-tap') ) {
					//_shout('tap', data);
					_dispatchTapEvent(e, releasePoint);
					return;
				}



				_equalizePoints(tapReleasePoint, p0);

				tapTimer = setTimeout(function() {
					_dispatchTapEvent(e, releasePoint);
					tapTimer = null;
				}, 300);
			}
		}

	}
});
