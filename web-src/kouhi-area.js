var Disp = require("./kouhi-disp.js");

exports.render = function(dom, hokenList){
	hokenList.forEach(function(hoken){
		var node = Disp.create(hoken);
		dom.appendChild(node);
	});

	dom.classList.add("listening-to-kouhi-entered");

	dom.addEventListener("kouhi-entered", function(event){
		var hoken = event.detail;
		var node = Disp.create(hoken);
		dom.appendChild(node);
	});
};

