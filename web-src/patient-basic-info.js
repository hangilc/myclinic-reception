"use strict";

var hogan = require("hogan.js");
var dispTmplSrc = require("raw!./patient-basic-info.html");
var dispTmpl = hogan.compile(dispTmplSrc);
var rUtil = require("../reception-util.js");
var Subpanel = require("./subpanel.js");
var Form = require("./patient-form.js");

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

		});
		form.classList.add("form-wrapper");
		dom.style.display = "none";
		dom.parentNode.insertBefore(form, dom);
	});
	return dom;
};

