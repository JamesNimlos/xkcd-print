'use strict';

const request = require('request');
const cheerio = require('cheerio');

function getXkcdUrl (id) {
	return `https://xkcd.com/${id}`;
}

function getXkcdProps (html) {
	const $ = cheerio.load(html);
	const $img = $('#comic img');
	const src = $img.attr('src');
	const alt = $img.attr('title');
	const title = $('title').first().text();
	const prev = $('a[rel="prev"]').attr('href');
	const next = $('a[rel="next"]').attr('href');

	return {
		alt: alt,
		next: next,
		prev: prev,
		src: src,
		title: title
	};
}

module.exports = function (id) {
	const url = getXkcdUrl(id);

	return new Promise(function (resolve, reject) {
		request(url, function (err, response, body) {
			if (!err && response.statusCode == 200) {
		    return resolve(Object.assign(
		    	{
		    		id: id,
		    		url: url
		    	}, 
		    	getXkcdProps(body)
	    	));
		  }
		  reject(JSON.stringify(response));
		});
	});
}