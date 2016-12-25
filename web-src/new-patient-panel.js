"use strict";

var Panel = require("./panel.js");
var Subpanel = require("./subpanel.js");
var PatientForm = require("./patient-form.js");
var rUtil = require("../reception-util.js");
var service = require("myclinic-service-api");
var PatientInfo = require("./patient-info.js");

exports.create = function(){
	var panel = Panel.create("新規患者入力", function(dom, panel){
		var patient = {
			sex: "F"
		};
		var form = PatientForm.create(patient, {
			onEnter: function(values){
				service.enterPatient(values, function(err){
					if( err ){
						alert(err);
						return;
					}
					var infoPanel = PatientInfo.create(values, blankHoken());
					panel.parentNode.replaceChild(infoPanel, panel);
				});
			},
			onCancel: function(){
				rUtil.removeNode(panel);	
			}
		});
		dom.appendChild(form);
	});
	return panel;
};

function blankHoken(){
	return {
		shahokokuho_list: [],
		koukikourei_list: [],
		roujin_list: [],
		kouhi_list: []
	};
}
