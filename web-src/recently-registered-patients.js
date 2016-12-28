"use strict";

var Panel = require("./panel");
var hogan = require("hogan.js");
var tmplSrc = require("raw!./recently-registered-patients.html");
var tmpl = hogan.compile(tmplSrc);
var rUtil = require("../reception-util.js");

exports.create = function(patients, callbacks){
	var panel = Panel.create("最近登録した患者", function(content){
		var list = patients.map(function(patient){
			var item = {};
			Object.keys(patient).forEach(function(key){
				item[key] = patient[key];
				item.patient_id_rep = rUtil.padNumber(patient.patient_id, 4, "0");
			});
			return item;
		});
		var html = tmpl.render({ patients: list });
		var dom = rUtil.makeNode(html);
		dom.querySelector(".close").addEventListener("click", function(){
			callbacks.onClose();
		});
		bindStartVisit(dom, callbacks.onStartVisit);
		bindPatientInfo(dom, callbacks.onPatientInfo);
		content.appendChild(dom);
	});
	panel.classList.add("recently-entered-patients");
	return panel;
};

function bindStartVisit(dom, callback){
	dom.addEventListener("click", function(event){
		var target = event.target;
		if( target.tagName === "A" && target.classList.contains("start-visit") ){
			var patientId = target.getAttribute("data-patient-id");
			callback(patientId);
		}
	});
};

function bindPatientInfo(dom, callback){
	dom.addEventListener("click", function(event){
		var target = event.target;
		if( target.tagName === "A" && target.classList.contains("patient-info") ){
			var patientId = target.getAttribute("data-patient-id");
			callback(patientId);
		}
	});
};
