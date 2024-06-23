const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use("/", (req, res) => {
  res.send("<h1>hello</h1>");
});

module.exports = app;
