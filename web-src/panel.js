var hogan = require("hogan.js");
var tmplSrc = require("raw!./panel.html");
var tmpl = hogan.compile(tmplSrc);
var rUtil = require("../reception-util.js");

var container = document.querySelector(".workarea-panel-container");

exports.create = function(title, render){
	var dom = rUtil.makeNode(tmpl.render({ title: title }));
	render(dom.querySelector(".content"), dom);
	return dom;
};

exports.prepend = function(panel){
	rUtil.prepend(container, panel);
};

exports.append = function(panel){
	container.appendChild(panel);
};

exports.container = container;
