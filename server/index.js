var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var config = require('./config');
// Database
var mongoose = require('mongoose');
mongoose.connect(config.database.url);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extend: true
}));

// Routes
var category_router = require("./routes/category")(express, app);
var card_router = require("./routes/card")(express, app);

// Server
var server = app.listen(config.site.port, function () {
    console.log("Listening to %s:%s", config.site.host, config.site.port);
});
