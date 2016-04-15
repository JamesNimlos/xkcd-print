'use strict';

const path = require('path');
require('es6-promise').polyfill();

const express = require('express');
const render = require('./server/render');

const app = express();

app.set('port', process.env.PORT || 8080);

app.disable('x-powered-by');

app.use(express.static(path.resolve('public')));

app.get('*', function (req, res, next) {
  render(req, res);
});

app.listen(app.get('port'));