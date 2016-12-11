var hogan = require("hogan.js");
var tmplSrc = require("raw!./subpanel.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(legend, render){
	var dom = document.createElement("div");
	dom.innerHTML = tmpl.render({ legend: legend });
	render(dom.querySelector(".content"));
	var e = dom.removeChild(dom.firstChild);
	dom.innerHTML = "";
	dom = null;
	return e;
};
