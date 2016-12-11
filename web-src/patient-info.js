var Panel = require("./panel.js");
var Subpanel = require("./subpanel.js");
var hogan = require("hogan.js");
var Util = require("../reception-util.js");
var BasicInfo = require("./patient-basic-info.js");

exports.add = function(data){
	var patient = data.patient;
	var hoken = data.hoken;
	Panel.add("患者情報", function(dom){
		var sub = Subpanel.create("基本情報", function(subdom){
			BasicInfo.render(subdom, patient);
		});
		dom.appendChild(sub);
		if( hoken.shahokokuho_list.length > 0 ){
			sub = Subpanel.create("社保・国保", function(subdom){
				
			});
			dom.appendChild(sub);
		}
	});
};
