"use strict";

var hogan = require("hogan.js");
var tmplSrc = require("raw!./patient-search-result.html");
var tmpl = hogan.compile(tmplSrc);
var rUtil = require("../reception-util.js");

exports.create = function(patients, callbacks){
	var list = patients.map(function(patient){
		var data = {
			patient_id_rep: rUtil.padNumber(patient.patient_id, 4, "0")
		};
		Object.keys(patient).forEach(function(key){
			data[key] = patient[key];
		});
		return data;
	});
	var html = tmpl.render({ patients: list });
	var dom = document.createElement("div");
	dom.innerHTML = html;
	dom.style.fontSize = "100%";
	dom.style.padding = "4px 0";
	dom.style.maxHeight = "200px";
	dom.style.overflowY = "auto";
	dom.addEventListener("click", function(event){
		var target = event.target;
		if( target.tagName === "A" ){
			if( target.classList.contains("start-visit") ){
				var patientId = +target.getAttribute("data-patient-id");
				callbacks.onStartVisit(patientId);
			} else if( target.classList.contains("patient-info") ){
				var patientId = +target.getAttribute("data-patient-id");
				callbacks.onPatientInfo(patientId);
			}
		}
	});
	return dom;
};

