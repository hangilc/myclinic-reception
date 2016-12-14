var hogan = require("hogan.js");
var tmplSrc = require("raw!./panel.html");
var tmpl = hogan.compile(tmplSrc);

var container = document.querySelector(".workarea-panel-container");

exports.add = function(title, render){
	var dom = document.createElement("div");
	dom.innerHTML = tmpl.render({ title: title });
	render(dom.querySelector(".content"), dom.firstChild);
	if( container.firstChild ){
		container.insertBefore(dom.firstChild, container.firstChild);
	} else {
		container.appendChild(dom.firstChild);
	}
	dom.innerHTML = "";
};
