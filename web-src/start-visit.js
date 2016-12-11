var hogan = require("hogan.js");
var tmplSrc = require("raw!./start-visit.html");
var tmpl = hogan.compile(tmplSrc);
var Util = require("../reception-util.js");
var service = require("myclinic-service-api");
var moment = require("moment");

exports.render = function(dom, patient, handlers){
	var data = {};
	Object.keys(patient).forEach(function(key){
		data[key] = patient[key];
	});
	data.birth_day_as_kanji = Util.birthdayAsKanji(patient.birth_day);
	data.age = Util.calcAge(patient.birth_day);
	var html = tmpl.render(data);
	dom.innerHTML = html
	dom.querySelector(".cancel").addEventListener("click", function(){
		handlers.onClose();
	});
	dom.querySelector(".enter").addEventListener("click", function(){
		var at = moment().format("YYYY-MM-DD HH:mm:ss");
		service.startVisit(patient.patient_id, at, function(err){
			if( err ){
				handlers.onError(err);
				return;
			}
			handlers.onEnter();
		});
	});
};
