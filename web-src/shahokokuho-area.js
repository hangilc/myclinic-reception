"use strict";

var Disp = require("./shahokokuho-disp.js");
var Subpanel = require("./subpanel.js");
var rUtil = require("../reception-util.js");

/**
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
**/

exports.setup = function(wrapper, hoken_list, patient){
	wrapper.innerHTML = "";
	var sub = Subpanel.create("社保・国保", function(subdom){
		hoken_list.forEach(function(hoken){
			var disp = Disp.create(hoken, patient);
			subdom.appendChild(disp);
		});

		subdom.classList.add("listening-to-shahokokuho-entered");

		subdom.addEventListener("shahokokuho-entered", function(event){
			var hoken = event.detail;
			if( hoken.patient_id !== patient.patient_id ){
				return;
			}
			var node = Disp.create(hoken, patient);
			subdom.appendChild(node);
			if( sub.style.display === "none" ){
				sub.style.display = "block";
			}
		});

		subdom.classList.add("listening-to-shahokokuho-deleted");

		subdom.addEventListener("shahokokuho-deleted", function(event){
			var shahokokuho = event.detail;
			if( shahokokuho.patient_id !== patient.patient_id ){
				return;
			}
			var relNodes = subdom.querySelectorAll("*[data-shahokokuho-id='" + shahokokuho.shahokokuho_id + "']");
			var i, n;
			n = relNodes.length;
			for(i=0;i<n;i++){
				rUtil.removeNode(relNodes.item(i));
			}
			var nodes = subdom.querySelectorAll(".shahokokuho-disp");
			if( nodes.length === 0 ){
				sub.style.display = "none";
			}
		});
	});
	if( hoken_list.length === 0 ){
		sub.style.display = "none";
	}
	wrapper.append(sub);
}
