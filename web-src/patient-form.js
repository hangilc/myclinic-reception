"use strict";

var hogan = require("hogan.js");
var tmplSrc = require("raw!./patient-form.html");
var tmpl = hogan.compile(tmplSrc);
var rUtil = require("../reception-util.js");

exports.create = function(patient, callbacks){
	var data = {

	};
	Object.keys(patient).forEach(function(key){
		data[key] = patient[key];
	});
	var html = tmpl.render(data);
	var dom = rUtil.makeNode(html);

	return dom;
};
