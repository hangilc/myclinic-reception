var Panel = require("./panel.js");
var Subpanel = require("./subpanel.js");
var hogan = require("hogan.js");
var tmplSrc = require("raw!./patient-basic-info.html");
var tmpl = hogan.compile(tmplSrc);
var Util = require("../reception-util.js");

exports.add = function(patient){
	Panel.add("患者情報", function(dom){
		var data = {
			birth_day_as_kanji: Util.birthdayAsKanji(patient.birth_day),
			age: Util.calcAge(patient.birth_day),
			sex_as_kanji: Util.sexAsKanji(patient.sex)
		};
		Object.keys(patient).forEach(function(key){
			data[key] = patient[key];
		});
		var sub = Subpanel.create("基本情報", function(subdom){
			subdom.innerHTML = tmpl.render(data);
		});
		dom.appendChild(sub);
	});
};
