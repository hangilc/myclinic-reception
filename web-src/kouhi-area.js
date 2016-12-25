"use strict";

var Disp = require("./kouhi-disp.js");
var Subpanel = require("./subpanel.js");
var rUtil = require("../reception-util.js");

exports.setup = function(wrapper, hoken_list, patient){
	wrapper.innerHTML = "";
	var sub = Subpanel.create("公費", function(subdom){
		hoken_list.forEach(function(hoken){
			var disp = Disp.create(hoken, patient);
			subdom.appendChild(disp);
		});

		subdom.classList.add("listening-to-kouhi-entered");

		subdom.addEventListener("kouhi-entered", function(event){
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

		subdom.classList.add("listening-to-kouhi-deleted");

		subdom.addEventListener("kouhi-deleted", function(event){
			var kouhi = event.detail;
			if( kouhi.patient_id !== patient.patient_id ){
				return;
			}
			console.log(kouhi);
			var relNodes = subdom.querySelectorAll("*[data-kouhi-id='" + kouhi.kouhi_id + "']");
			console.log(relNodes);
			var i, n;
			n = relNodes.length;
			for(i=0;i<n;i++){
				rUtil.removeNode(relNodes.item(i));
			}
			var nodes = subdom.querySelectorAll(".kouhi-disp");
			if( nodes.length === 0 ){
				sub.style.display = "none";
			}
		});
	});
	if( hoken_list.length === 0 ){
		sub.style.display = "none";
	}
	wrapper.append(sub);
};

