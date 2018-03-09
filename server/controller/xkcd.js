"use strict";

const request = require("request");
const cheerio = require("cheerio");
const escapeHtml = require("escape-html");

/**
 * Generate the url on the xkcd page to scrape
 * @param  {Number|String} id - comic id
 * @return {String}
 */
function getXkcdUrl(id) {
  return `https://xkcd.com/${id}`;
}

function getExplainXkcdUrl(id) {
  return `https://explainxkcd.com/${id}`;
}

/**
 * Scrapes the necessary data from the returned html
 * @param  {String} html
 * @return {Object}
 */
function getXkcdProps(html) {
  const $ = cheerio.load(html);
  const $img = $("#comic img");
  const src = $img.attr("src");
  const alt = $img.attr("title");
  const title = $("title")
    .first()
    .text();
  const prev = $('a[rel="prev"]').attr("href");
  const next = $('a[rel="next"]').attr("href");

  const xkcdProps = {
    alt,
    next,
    prev,
    src,
    title
  };

  return Object.keys(xkcdProps).reduce((accumulator, key) => {
    accumulator[key] = escapeHtml(xkcdProps[key]);
    return accumulator;
  }, {});
}

/**
 * Gets data and returns a Promise which resolves with necessary data to render
 * @param  {Number|String} id
 * @return {Promise}
 */
module.exports = function(id) {
  const url = getXkcdUrl(id);
  const explainUrl = getExplainXkcdUrl(id);

  return new Promise(function(resolve, reject) {
    request(url, function(err, response, body) {
      if (!err && response.statusCode === 200) {
        return resolve(
          Object.assign(
            {
              id: id,
              url: url,
              explainUrl: explainUrl
            },
            getXkcdProps(body)
          )
        );
      }
      reject(JSON.stringify(response));
    });
  });
};
