"use strict";

var tmplSrc = require("raw!./search-patient.html");
var rUtil = require("../reception-util.js");

exports.create = function(){
	var html = tmplSrc;
	var dom = rUtil.makeNode(html);
	bindSearch(dom);
	return dom;
};

function bindSearch(dom){
	dom.querySelector("");
}
