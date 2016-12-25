"use strict";

var Panel = require("./panel.js");
var Subpanel = require("./subpanel.js");
var PatientForm = require("./patient-form.js");
var rUtil = require("../reception-util.js");

exports.create = function(){
	return Panel.create("新規患者入力", function(dom, panel){
		var patient = {
			sex: "F"
		};
		var form = PatientForm.create(patient, {
			onCancel: function(){
				rUtil.removeNode(panel);	
			}
		});
		dom.appendChild(form);
	});
};
