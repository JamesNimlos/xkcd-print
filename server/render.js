'use strict';

const xkcd = require('./controller/xkcd');
const matcher = /\d+/;

function parseId (path) {
	let location = path.match(matcher);
	return (location && location[0]) || '';
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
						<h1>${props.title}</h1>
						<a href="${props.url}" alt="${props.title}">
							<img src="${props.src}" title="${props.alt}" />
						</a>
						<p class="alt_text">${props.alt}</p>
					</div>
					<div class="navigation">
						<a href="${props.prev}">Previous</a>|<a href="${props.next}">Next</a>
					</div>
				</div>
			</body>
		</html>
	`;
}

module.exports = function render (req, res) {
	xkcd(parseId(req.path)).then((props) => {
		res.status(200).end(renderFullPage(props))
	}).catch((err) => res.status(500).send(err));
}