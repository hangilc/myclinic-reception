var Disp = require("./shahokokuho-disp.js");

exports.render = function(dom, shahokokuhoList, patient){
	shahokokuhoList.forEach(function(hoken){
		var node = Disp.create(hoken, patient);
		dom.appendChild(node);
	});

	dom.classList.add("listening-to-shahokokuho-entered");

	dom.addEventListener("shahokokuho-entered", function(event){
		var hoken = event.detail;
		var node = Disp.create(hoken, patient);
		dom.appendChild(node);
	});
};


