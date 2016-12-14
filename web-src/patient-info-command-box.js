var hogan = require("hogan.js");
var tmplSrc = require("raw!./patient-info-command-box.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(patient, callbacks){
	var dom = document.createElement("div");
	dom.innerHTML = tmpl.render({});
	dom.querySelector(".new-shahokokuho").addEventListener("click", function(){
		if( callbacks.onNewShahokokuho ){
			callbacks.onNewShahokokuho();
		}
	});
	dom.querySelector(".new-koukikourei").addEventListener("click", function(){
		if( callbacks.onNewKoukikourei ){
			callbacks.onNewKoukikourei();
		}
	});
	dom.querySelector(".new-kouhi").addEventListener("click", function(){
		if( callbacks.onNewKouhi ){
			callbacks.onNewKouhi();
		}
	});
	dom.querySelector(".edit-all-hoken").addEventListener("click", function(){
		if( callbacks.onEditAllHoken ){
			callbacks.onEditAllHoken();
		}
	});
	dom.querySelector(".start-visit").addEventListener("click", function(){
		if( callbacks.onStartVisit ){
			callbacks.onStartVisit();
		}
	});
	dom.querySelector(".close-panel").addEventListener("click", function(){
		if( callbacks.onClose ){
			callbacks.onClose();
		}
	});
	return dom;
};
