'use strict';

const xkcd = require('./controller/xkcd');

/** @type {RegExp} grabs the first digits from a path */
const getId = /\d+/;
/** @type {RegExp} finds valid, non-root path */
const validPath = /\/\d+\/?$/;

/**
 * isValid checks if it's a valid path
 * @param  {*}  path path to check
 * @return {Boolean}
 */
function isValid (path) {
	return typeof path === 'string' && (path === '/' || validPath.test(path));
}

/**
 * [parseId description]
 * @param  {String} path
 * @return {String|null}
 */
function parseId (path) {
	let location = path.match(getId);
	return (location && location[0]) || '';
}

/**
 * Renders the entire page
 * @param  {Object} props required props for page render
 * @return {String}
 */
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
			<div class="navigation">
				<a href="/1">First</a>|
				<a href="${props.prev}">Previous</a>|
				<a href="${props.next}">Next</a>|
				<a href="/">Latest</a>
			</div>
			<div class="printable">
				${props.src ? renderPrintable(props) : renderUnavailable(props)}
			</div>
			<div class="navigation">
				<a href="/1">First</a>|
				<a href="${props.prev}">Previous</a>|
				<a href="${props.next}">Next</a>|
				<a href="/">Latest</a>
			</div>
		</div>
		<div class="footer">
			<div class="attribution">An homage to <a href="${props.url}">xkcd</a> which is written by Randall Monroe.</div>
			<div class="about">
				<div>Made by <a href="http://devnimlos.com/professional/a-tribute-to-xkcd-on-nodejs" role="navigation">James Nimlos</a>.</div>
				<div>The source code can be found on <a href="https://github.com/JamesNimlos/xkcd-print">Github</a>.</div>
			</div>
		</div>
		<script src="/scripts.js"></script>
	</body>
</html>
`;
}

/**
 * Renders the image and alternative text
 * @param  {Object} props
 * @return {String}
 */
function renderPrintable (props) {
	return `
		<h1>${props.title}</h1>
		<a href="${props.url}" alt="${props.title}">
			<img id="comic_image" src="${props.src}" title="${props.alt}" />
		</a>
		<p id="alt_text" class="alt_text">${props.alt}</p>
	`;
}

/**
 * Renders if the image source wasn't found
 * @param  {Object} props
 * @return {String}
 */
function renderUnavailable (props) {
	return `
		<h1>${props.title}</h1>
		<p id="alt_text" class="alt_text">
			Oh no! This comic can't be rendered for printing. Try the previous or next links below.
		</p>
	`;
}

/** Render function with logic */
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