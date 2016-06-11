!(function (props) {
	'use strict';
	var PAGE_PROPS = Object.assign({}, props);

	if (document.readyState === 'interactive' || document.readystate === 'completed') {
		resizeAltText();
	} else {
		document.addEventListener('DOMContentLoaded', resizeAltText);
	}

	document.addEventListener('keyup', onKeyUp);
	window.addEventListener('resize', debounce(resizeAltText, 300));

	function debounce (func, delay) {
		var wait;

		return function () {
			if (wait) {
				clearTimeout(wait);
			}

			wait = setTimeout(func, delay);
		}
	}

	function resizeAltText () {
		var image = document.getElementById('comic_image');

		if (image) {
			var cacheImage = new Image();

			cacheImage.addEventListener('load', function () {
				document.getElementById('alt_text').style.maxWidth = image.width + 'px';
			})

			cacheImage.src = image.src;
		}
	}

	function onKeyUp (e) {
		if (PAGE_PROPS) {

			if (e.which === 37) {
				// left
				window.location.href = PAGE_PROPS.prev;
			}
			else if (e.which === 39) {
				// right
				window.location.href = PAGE_PROPS.next;
			}
			else if (e.which === 191 && e.shiftKey) {
				window.location.href = PAGE_PROPS.explainUrl;
			}
		}
	}
})(window.PAGE_PROPS);