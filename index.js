"use strict";

const path = require("path");
const express = require("express");
const helmet = require("helmet");
const render = require("./server/render");

const app = express();

app.set("port", process.env.PORT || 8080);

app.use(helmet());

app.use(express.static(path.resolve("public")));

app.get("*", function(req, res) {
  render(req, res);
});

app.listen(app.get("port"));

console.log(`The app is now listening on port ${app.get("port")}`);
