var Disp = require("./koukikourei-disp.js");

exports.render = function(dom, hokenList){
	hokenList.forEach(function(hoken){
		var node = Disp.create(hoken);
		dom.appendChild(node);
	});

	dom.classList.add("listening-to-koukikourei-entered");

	dom.addEventListener("koukikourei-entered", function(event){
		var hoken = event.detail;
		var node = Disp.create(hoken);
		dom.appendChild(node);
	});
};

