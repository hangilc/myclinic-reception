var hogan = require("hogan.js");
var tmplSrc = require("raw!./koukikourei-form.html");
var tmpl = hogan.compile(tmplSrc);
var rUtil = require("../reception-util.js");
var dateInputTmplSrc = require("raw!./date-input.html");
var dateInputTmpl = hogan.compile(dateInputTmplSrc);
var DateInput = require("./date-input.js");

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
	var validUptoInput = new DateInput(dom.querySelector(".valid-upto-element"));
	validUptoInput.setGengou("平成");
	dom.querySelector(".cancel").addEventListener("click", function(event){
		callbacks.onCancel();
	});
	return dom;
};

function setFutanWari(dom, futanWari){
	dom.querySelector('input[type="radio"][name="futan_wari"][value="' + futanWari + '"]').checked = true;
}
