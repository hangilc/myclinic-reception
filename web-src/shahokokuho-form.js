var hogan = require("hogan.js");
var tmplSrc = require("raw!./shahokokuho-form.html");
var tmpl = hogan.compile(tmplSrc);
var dateInputTmplSrc = require("raw!./date-input.html");
var dateInputTmpl = hogan.compile(dateInputTmplSrc);
var DateInput = require("./date-input.js");

exports.create = function(shahokokuho, callbacks){
	var dom = document.createElement("div");
	var data = shahokokuho;
	dom.innerHTML = tmpl.render(data, {
		"date-input": dateInputTmpl
	});
	var validFrom = new DateInput(dom.querySelector(".valid-from-element"));
	validFrom.setGengou("平成");
	var validUpto = new DateInput(dom.querySelector(".valid-upto-element"));
	validUpto.setGengou("平成");
	dom.querySelector('input[name=kourei][value="' + shahokokuho.kourei + '"]').checked = true;
	dom.querySelector(".enter").addEventListener("click", function(){
		var values = formValues(dom, validFrom, validUpto);
		var validFromValue = validFrom.getSqlDate();
		var validUptoValue = validUpto.getSqlDate();
		var data = {};
		var errors = [];
		if( !values.hokensha_bangou.match(/^\d+$/ ) ){
			errors.push("保険者番号の入力が適切でありません。");
		} else {
			data.hokensha_bangou = +values.hokensha_bangou;
		}
		if( values.hihokensha_kigou === "" && values.hihokensha_bangou === "" ){
			errors.push("被保険者記号・番号が入力されていません。");
		} else {
			data.hihokensha_kigou = values.hihokensha_kigou;
			data.hihokensha_bangou = values.hihokensha_bangou;
		}
		console.log(data);
		console.log(errors);
	});
	dom.querySelector(".cancel").addEventListener("click", function(){
		callbacks.onCancel();
	});
	return dom;
};

function formValues(dom, validFrom, validUpto){
	return {
		"hokensha_bangou": dom.querySelector("input[name='hokensha_bangou']").value,
		"hihokensha_kigou": dom.querySelector("input[name='hihokensha_kigou']").value,
		"hihokensha_bangou": dom.querySelector("input[name='hihokensha_bangou']").value,
		"honnin": dom.querySelector("input[name='honnin']:checked").value,
		"kourei": dom.querySelector("input[name='kourei']:checked").value
	};
}

