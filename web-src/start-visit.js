var hogan = require("hogan.js");
var tmplSrc = require("raw!./start-visit.html");
var tmpl = hogan.compile(tmplSrc);

exports.render = function(dom, patient, handlers){
	var data = patient;
	var html = tmpl.render(data);
	dom.innerHTML = html
	dom.querySelector(".cancel").addEventListener("click", function(){
		handlers.onClose();
	});
};
