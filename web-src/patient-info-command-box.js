var hogan = require("hogan.js");
var tmplSrc = require("raw!./patient-info-command-box.html");
var tmpl = hogan.compile(tmplSrc);
var doStartVisit = require("./do-start-visit.js");

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
	dom.addEventListener("change", function(event){
		var target = event.target;
		if( target.name === "hoken-list-type" ){
			callbacks.onHokenListChange(target.value);
		}
	});
	dom.querySelector(".start-visit").addEventListener("click", function(event){
		event.target.disabled = true;
		doStartVisit(patient.patient_id, function(err){
			if( err === "cancel" ){
				event.target.disabled = false;
			} else if( err ) {
				alert(err);
				event.target.disabled = false;
			} else {
				callbacks.onVisitStarted();
			}
		});
	});
	dom.querySelector(".close-panel").addEventListener("click", function(){
		if( callbacks.onClose ){
			callbacks.onClose();
		}
	});
	return dom;
};

