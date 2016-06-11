'use strict';

document.addEventListener('DOMContentLoaded', resizeAltText);
window.addEventListener('resize', function () {
	var wait;

	return function () {
		if (wait) {
			clearTimeout(wait);
		}

		wait = setTimeout(resizeAltText, 300);
	}
}());

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