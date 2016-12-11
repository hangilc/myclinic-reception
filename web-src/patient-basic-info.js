var hogan = require("hogan.js");
var tmplSrc = require("raw!./patient-basic-info.html");
var tmpl = hogan.compile(tmplSrc);
var Util = require("../reception-util.js");

exports.render = function(dom, patient){
	var data = {
		birth_day_as_kanji: Util.birthdayAsKanji(patient.birth_day),
		age: Util.calcAge(patient.birth_day),
		sex_as_kanji: Util.sexAsKanji(patient.sex)
	};
	Object.keys(patient).forEach(function(key){
		data[key] = patient[key];
	});
	var html = tmpl.render(data);
	dom.innerHTML = html;
};
