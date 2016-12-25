"use strict";

var hogan = require("hogan.js");
var tmplSrc = require("raw!./patient-form.html");
var tmpl = hogan.compile(tmplSrc);
var rUtil = require("../reception-util.js");
var dateInputTmplSrc = require("raw!./date-input.html");
var dateInputTmpl = hogan.compile(dateInputTmplSrc);
var DateInput = require("./date-input.js");

exports.create = function(patient, callbacks){
	var data = {

	};
	Object.keys(patient).forEach(function(key){
		data[key] = patient[key];
	});
	var html = tmpl.render(data, {
		"date-input": dateInputTmpl	
	});
	var dom = rUtil.makeNode(html);
	if( patient.birth_day && patient.birth_day !== "0000-00-00" ){
		var dateInput = new DateInput(dom.querySelector(".birth-day-element"));		
		dateInput.set(patient.birth_day);
	} else {
		var dateInput = new DateInput(dom.querySelector(".birth-day-element"));		
		dateInput.setGengou("昭和");
	}
	dom.querySelector(".enter").addEventListener("click", function(event){
		event.target.disabled = true;
		var errs = [];
		var values = getValues(dom, errs);
		if( errs.length > 0 ){
			event.target.disabled = false;
			setError(dom, errs);
		} else {
			callbacks.onEnter(values);
		}
	});
	dom.querySelector(".cancel").addEventListener("click", function(){
		callbacks.onCancel();
	});
	setSex(dom, patient.sex || "F");
	return dom;
};

function setSex(dom, sex){
	dom.querySelector("input[type='radio'][name='sex'][value='" + sex + "']").checked = true;
}

function getOptionalField(dom, errs, seltor, name){
	return dom.querySelector(seltor).value;
}

function getRequiredField(dom, errs, seltor, name){
	var value = dom.querySelector(seltor).value;
	if( value === "" ){
		var msg = name + "が入力されていません。";	
		errs.push(msg);
	}
	return value;
}

function getValidDateField(dom, errs, seltor, name){
	var dateInput = new DateInput(dom);
	var value = dateInput.getSqlDate();
	if( value === "0000-00-00" ){
		errs.push(name + "が入力されていません。");
	} else if( dateInput.errors.length > 0 ){
		var msg = name + "の入力が不適切です。";
		msg += "（" + dateInput.errors.join("") + "）";
		errs.push(msg);
	}
	return value;
}

function getOneOfField(dom, errs, seltor, name, choices){
	var value = getRequiredField(dom, errs, seltor, name);
	if( !value ){
		return null;
	}
	if( choices.indexOf(value) < 0 ){
		errs.push(name + "の入力が不適切です。");
		return null;
	}
	return value;
}

function getValues(dom, errs){
	return {
		last_name: getRequiredField(dom, errs, "input[name='last_name']", "姓"),
		first_name: getRequiredField(dom, errs, "input[name='first_name']", "名"),
		last_name_yomi: getRequiredField(dom, errs, "input[name='last_name_yomi']", "姓のよみ"),
		first_name_yomi: getRequiredField(dom, errs, "input[name='first_name_yomi']", "名のよみ"),
		birth_day: getValidDateField(dom, errs, "birth-day-element", "生年月日"),
		sex: getOneOfField(dom, errs, "input[type='radio'][name='sex']:checked", "性別", ["M", "F"]),
		address: getOptionalField(dom, errs, "input[name='address']", "住所"),
		phone: getOptionalField(dom, errs, "input[name='phone']", "電話番号"),
	};
}

function setError(dom, errs){
	var box = dom.querySelector(".error");
	box.innerHTML = "";
	errs.forEach(function(err){
		var d = document.createElement("div");
		var t = document.createTextNode(err);
		d.appendChild(t);
		box.appendChild(d);
	});
	box.style.display = "block";
}

