'use strict';

const xkcd = require('./controller/xkcd');
const getId = /\d+/;
const validPath = /\/\d+\/?$/;

function isValid (path) {
	return typeof path === 'string' && (path === '/' || validPath.test(path));
}

function parseId (path) {
	let location = path.match(getId);
	return (location && location[0]) || '';
}

function renderUnavailable (props) {
	return `
		<h1>${props.title}</h1>
		<p class="alt_text">
			Oh no! This comic can't be rendered for printing. Try the previous or next links below.
		</p>
	`;
}

function renderPrintable (props) {
	return `
		<h1>${props.title}</h1>
		<a href="${props.url}" alt="${props.title}">
			<img src="${props.src}" title="${props.alt}" />
		</a>
		<p class="alt_text">${props.alt}</p>
	`;
}

function renderFullPage (props) {
	return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta http-equiv="X-UA-Compatible" content="IE=edge"> 
				<title>${props.title}</title>

				<link href="/styles.css" rel="stylesheet" />
			</head>
			<body>
				<div class="content">
					<div class="logo"><a href="//xkcd.com"><img src="//imgs.xkcd.com/static/terrible_small_logo.png" /></a></div>
					<div class="printable">
						${props.src ? renderPrintable(props) : renderUnavailable(props)}
					</div>
					<div class="navigation">
						<a href="/1">First</a>|
						<a href="${props.prev}">Previous</a>|
						<a href="${props.next}">Next</a>|
						<a href="/">Last</a>
					</div>
				</div>
			</body>
		</html>
	`;
}

module.exports = function render (req, res) {
	if (isValid(req.path)) {
		xkcd(parseId(req.path)).then((props) => {

			return res.status(200).end(renderFullPage(props));
		}).catch((err) => res.status(500).send(err));
	} else {

		const id = parseId(req.path);
		if (id) {
			return res.redirect(`/${id}`);
		}

		return res.redirect('/');
	}
}