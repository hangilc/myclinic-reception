var hogan = require("hogan.js");
var tmplSrc = require("raw!./koukikourei-form.html");
var tmpl = hogan.compile(tmplSrc);
var rUtil = require("../reception-util.js");
var dateInputTmplSrc = require("raw!./date-input.html");
var dateInputTmpl = hogan.compile(dateInputTmplSrc);
var DateInput = require("./date-input.js");
var conti = require("conti");
var service = require("myclinic-service-api");

exports.create = function(data, callbacks){
	var patient = data.patient;
	var hoken = data.koukikourei;
	var data = {
		last_name: patient.last_name,
		first_name: patient.first_name
	};
	Object.keys(hoken).forEach(function(key){
		data[key] = hoken[key];
	});
	var dom = rUtil.makeNode(tmpl.render(data, {
		"date-input": dateInputTmpl	
	}));
	setFutanWari(dom, hoken.futan_wari);
	var validFromInput = new DateInput(dom.querySelector(".valid-from-element"));
	validFromInput.setGengou("平成");
	if( hoken.valid_from ){
		validFromInput.set(hoken.valid_from);
	}
	var validUptoInput = new DateInput(dom.querySelector(".valid-upto-element"));
	validUptoInput.setGengou("平成");
	if( hoken.valid_upto && hoken.valid_upto !== "0000-00-00" ){
		validUptoInput.set(hoken.valid_upto);
	}
	bindEnter(dom, hoken, callbacks.onEnter);
	dom.querySelector(".cancel").addEventListener("click", function(event){
		callbacks.onCancel();
	});
	return dom;
};

function bindEnter(dom, hoken, onEnter){
	dom.querySelector(".enter").addEventListener("click", function(event){
		var errors = [];
		var values = formValues(dom, errors);
		if( errors.length > 0 ){
			setError(dom, errors);
			return;
		}
		onEnter(values);
	});
}

function setFutanWari(dom, futanWari){
	dom.querySelector('input[type="radio"][name="futan_wari"][value="' + futanWari + '"]').checked = true;
}

function hokenshaBangouValue(dom, errs){
	var value = dom.querySelector("input[name='hokensha_bangou']").value;
	if( value === "" ){
		errs.push("保険者番号が入力されていません。");
	} else if( value.match(/^\d+$/) ){
		; // nop
	} else {
		errs.push("保険者番号の入力が不適切です。");
	}
	return value;
}

function hihokenshaBangouValue(dom, errs){
	var value = dom.querySelector("input[name='hihokensha_bangou']").value;
	if( value === "" ){
		errs.push("被保険者番号が入力されていません。");
	} else if( value.match(/^\d+$/) ){
		; // nop
	} else {
		errs.push("被保険者番号の入力が不適切です。");
	}
	return value;
}

function futanWariValue(dom, errs){
	var value = dom.querySelector("input[type='radio'][name='futan_wari']:checked").value;
	if( value.match(/^\d+$/) ){
		return +value;
	} else {
		errs.push("負担割の入力が不適切です。");
		return value;
	}
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

function formValues(dom, errs){
	return {
		hokensha_bangou: hokenshaBangouValue(dom, errs),
		hihokensha_bangou: hihokenshaBangouValue(dom, errs),
		futan_wari: futanWariValue(dom, errs),
		valid_from: validFromValue(dom, errs),
		valid_upto: validUptoValue(dom, errs),
	};
}

function setError(dom, errs){
	var box = dom.querySelector(".error");
	errs.forEach(function(err){
		var d = document.createElement("div");
		var t = document.createTextNode(err);
		d.appendChild(t);
		box.appendChild(d);
	});
	box.style.display = "block";
}

