var hogan = require("hogan.js");
var tmplSrc = require("raw!./kouhi-form.html");
var tmpl = hogan.compile(tmplSrc);
var rUtil = require("../reception-util.js");
var dateInputTmplSrc = require("raw!./date-input.html");
var dateInputTmpl = hogan.compile(dateInputTmplSrc);
var DateInput = require("./date-input.js");
var conti = require("conti");
var service = require("myclinic-service-api");

exports.create = function(data, callbacks){
	var patient = data.patient;
	var hoken = data.kouhi;
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
	var validFromInput = new DateInput(dom.querySelector(".valid-from-element"));
	validFromInput.setGengou("平成");
	var validUptoInput = new DateInput(dom.querySelector(".valid-upto-element"));
	validUptoInput.setGengou("平成");
	dom.querySelector(".enter").addEventListener("click", function(event){
		var errors = [];
		var values = formValues(dom, errors);
		if( errors.length > 0 ){
			setError(dom, errors);
			return;
		}
		values.patient_id = patient.patient_id;
		var enteredKouhi;
		conti.exec([
			function(done){
				service.enterKouhi(values, done);	
			},
			function(done){
				service.getKouhi(values.kouhi_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					enteredKouhi = result;
					done();
				});
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			callbacks.onEntered(enteredKouhi);
		});
	});
	dom.querySelector(".cancel").addEventListener("click", function(event){
		callbacks.onCancel();
	});
	return dom;
};

function futanshaValue(dom, errs){
	var value = dom.querySelector("input[name='futansha']").value;
	if( value === "" ){
		errs.push("負担者番号が入力されていません。");
	} else if( value.match(/^\d+$/) ){
		value = +value;
	} else {
		errs.push("負担者番号の入力が不適切です。");
	}
	return value;
}

function jukyuushaValue(dom, errs){
	var value = dom.querySelector("input[name='jukyuusha']").value;
	if( value === "" ){
		errs.push("受給者番号が入力されていません。");
	} else if( value.match(/^\d+$/) ){
		value = +value;
	} else {
		errs.push("受給者番号の入力が不適切です。");
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

function formValues(dom, errs){
	return {
		futansha: futanshaValue(dom, errs),
		jukyuusha: jukyuushaValue(dom, errs),
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

