var hogan = require("hogan.js");
var tmplSrc = require("raw!./shahokokuho-form.html");
var tmpl = hogan.compile(tmplSrc);
var dateInputTmplSrc = require("raw!./date-input.html");
var dateInputTmpl = hogan.compile(dateInputTmplSrc);
var DateInput = require("./date-input.js");
var conti = require("conti");
var service = require("myclinic-service-api");
var rUtil = require("../reception-util.js");

function Form(shahokokuho, patient){
	this.shahokokuho = shahokokuho;
	this.patient = patient;
}

Form.prototype.createDom = function(callbacks){
	var patient = this.patient;
	var shahokokuho = this.shahokokuho;
	var data = {
		last_name: patient.last_name,
		first_name: patient.first_name
	};
	Object.keys(shahokokuho).forEach(function(key){
		data[key] = shahokokuho[key];
	});
	var html = tmpl.render(data, {
		"date-input": dateInputTmpl
	});
	this.dom = rUtil.makeNode(html);
	var dom = this.dom;
	var validFromInput = new DateInput(dom.querySelector(".valid-from-element"));
	validFromInput.setGengou("平成");
	if( shahokokuho.valid_from ){
		validFromInput.set(shahokokuho.valid_from);
	}
	var validUptoInput = new DateInput(dom.querySelector(".valid-upto-element"));
	validUptoInput.setGengou("平成");
	if( shahokokuho.valid_upto ){
		validUptoInput.set(shahokokuho.valid_upto);
	}
	setKourei(dom, shahokokuho.kourei);
	dom.querySelector(".enter").addEventListener("click", function(){
		callbacks.onEnter();
	});
	dom.querySelector(".cancel").addEventListener("click", function(){
		callbacks.onCancel();
	});
	return this.dom;
};

Form.prototype.getValues = function(errs){
	var dom = this.dom;
	return {
		hokensha_bangou: hokenshaBangouValue(dom, errs),
		hihokensha_kigou: hihokenshaKigouValue(dom, errs),
		hihokensha_bangou: hihokenshaBangouValue(dom, errs),
		honnin: honninValue(dom, errs),
		valid_from: validFromValue(dom, errs),
		valid_upto: validUptoValue(dom, errs),
		kourei: koureiValue(dom, errs)
	};
};

Form.prototype.setError = function(errs){
	var box = this.dom.querySelector(".error");
	box.innerHTML = "";
	errs.forEach(function(err){
		var row = document.createElement("div");
		var t = document.createTextNode(err);
		row.appendChild(t);
		box.appendChild(row);
	});
	box.style.display = "block";
};

function hokenshaBangouValue(dom, errs){
	var value = dom.querySelector("input[name='hokensha_bangou']").value;
	if( value === "" ){
		errs.push("保険者番号が入力されていません。");
	} else if( value.match(/^\d+$/) ){
		value = +value;
	} else {
		errs.push("保険者番号の入力が不適切です。");
		value = null;
	} 
	return value;
}

function hihokenshaKigouValue(dom, errs){
	return dom.querySelector("input[name='hihokensha_kigou']").value;
}

function hihokenshaBangouValue(dom, errs){
	var value = dom.querySelector("input[name='hihokensha_bangou']").value;
	if( value === "" ){
		var kigou = dom.querySelector("input[name='hihokensha_kigou']").value;
		if( kigou === "" ){
			errs.push("被保険者記号・番号が入力されていません。");
		}
	}
	return value;
}

function honninValue(dom, errs){
	var value = dom.querySelector("input[name='honnin']:checked").value;
	if( value === "0" || value === "1" ){
		value = +value;
	} else {
		errs.push("本人・家族の入力が不適切です。");	
	}
	return value;
}

function validFromValue(dom, errs){
	var dateInput = new DateInput(dom.querySelector(".valid-from-element"));
	var value = dateInput.getSqlDate();
	if( !value ){
		var msg = "有効期限（から）の入力が不適切です。（";
		msg += dateInput.errors.join("");
		msg += "）";
		errs.push(msg);
	} else if( value === "0000-00-00" ){
		errs.push("有効期限（から）が入力されていません。");
		value = null;
	}
	return value;
}

function validUptoValue(dom, errs){
	var dateInput = new DateInput(dom.querySelector(".valid-upto-element"));
	var value = dateInput.getSqlDate();
	if( !value ){
		var msg = "有効期限（まで）の入力が不適切です。（";
		msg += dateInput.errors.join("");
		msg += "）";
		errs.push(msg);
	}
	return value;
}

function koureiValue(dom, errs){
	var value = dom.querySelector("input[name='kourei']:checked").value;
	if( value.match(/^\d+$/) ){
		value = +value;
	} else {
		errs.push("高齢の入力が不適切です。");
	}
	return value;
}

function setKourei(dom, value){
	dom.querySelector('input[name=kourei][value="' + value + '"]').checked = true;
}

module.exports = Form;
