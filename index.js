"use strict";

var path = require("path");

exports.staticDir = path.join(__dirname, "static");

exports.initApp = function(app, config){
	app.get("/config", function(req, res){
		res.set({
			"Content-Type": "text/javascript"
		});
		res.send("var config = " + JSON.stringify(config) + ";");
	});
};
