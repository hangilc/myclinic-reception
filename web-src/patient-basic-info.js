"use strict";

var hogan = require("hogan.js");
var dispTmplSrc = require("raw!./patient-basic-info.html");
var dispTmpl = hogan.compile(dispTmplSrc);
var rUtil = require("../reception-util.js");
var Subpanel = require("./subpanel.js");
var Form = require("./patient-form.js");
var conti = require("conti");
var service = require("myclinic-service-api");

exports.setup = function(wrapper, patient){
	var sub = Subpanel.create("基本情報", function(subdom){
		subdom.appendChild(createDisp(patient));
	});
	wrapper.appendChild(sub);
};

function createDisp(patient){
	var data = {
		birth_day_as_kanji: rUtil.birthdayAsKanji(patient.birth_day),
		age: rUtil.calcAge(patient.birth_day),
		sex_as_kanji: rUtil.sexAsKanji(patient.sex)
	};
	Object.keys(patient).forEach(function(key){
		data[key] = patient[key];
	});
	var html = dispTmpl.render(data);
	var dom = rUtil.makeNode(html);
	dom.querySelector(".edit-basic").addEventListener("click", function(){
		var form = Form.create(patient, {
			onEnter: function(values){
				doEnter(dom, form, patient, values);
			},
			onCancel: function(){
				rUtil.removeNode(form);
				dom.style.display = savedDomStyleDisplay;
			}
		});
		form.classList.add("form-wrapper");
		var savedDomStyleDisplay = dom.style.display;
		dom.style.display = "none";
		dom.parentNode.insertBefore(form, dom);
	});
	return dom;
};

function doEnter(dom, form, patient, values){
	values.patient_id = patient.patient_id;
	var updatedPatient;
	conti.exec([
		function(done){
			service.updatePatient(values, done);
		},
		function(done){
			service.getPatient(patient.patient_id, function(err, result){
				if( err ){
					done(err);
					return;
				}
				updatedPatient = result;
				done();
			});
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		rUtil.removeNode(form);
		var newDom = createDisp(updatedPatient);
		dom.parentNode.replaceChild(newDom, dom);
	});
}



