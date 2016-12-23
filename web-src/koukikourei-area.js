"use strict";

var Disp = require("./koukikourei-disp.js");
var Subpanel = require("./subpanel.js");
var rUtil = require("../reception-util.js");

exports.setup = function(wrapper, hoken_list, patient){
	var sub = Subpanel.create("後期高齢", function(subdom){
		hoken_list.forEach(function(hoken){
			var disp = Disp.create(hoken, patient);
			subdom.appendChild(disp);
		});

		subdom.classList.add("listening-to-koukikourei-entered");

		subdom.addEventListener("koukikourei-entered", function(event){
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

		subdom.classList.add("listening-to-koukikourei-deleted");

		subdom.addEventListener("koukikourei-deleted", function(event){
			var koukikourei = event.detail;
			if( koukikourei.patient_id !== patient.patient_id ){
				return;
			}
			var relNodes = subdom.querySelectorAll("*[data-koukikourei-id='" + koukikourei.koukikourei_id + "']");
			var i, n;
			n = relNodes.length;
			for(i=0;i<n;i++){
				rUtil.removeNode(relNodes.item(i));
			}
			var nodes = subdom.querySelectorAll(".koukikourei-disp");
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
