var Panel = require("./panel.js");
var Subpanel = require("./subpanel.js");
var hogan = require("hogan.js");
var Util = require("../reception-util.js");
var BasicInfo = require("./patient-basic-info.js");
var mUtil = require("myclinic-util");
var ShahokokuhoDisp = require("./shahokokuho-disp.js");
var KoukikoureiDisp = require("./koukikourei-disp.js");
var RoujinDisp = require("./roujin-disp.js");
var KouhiDisp = require("./kouhi-disp.js");

exports.add = function(data){
	var patient = data.patient;
	var hoken = data.hoken;
	console.log(hoken);
	Panel.add("患者情報", function(dom){
		var sub = Subpanel.create("基本情報", function(subdom){
			BasicInfo.render(subdom, patient);
		});
		dom.appendChild(sub);
		if( hoken.shahokokuho_list.length > 0 ){
			sub = Subpanel.create("社保・国保", function(subdom){
				ShahokokuhoDisp.render(subdom, hoken.shahokokuho_list[0]);
			});
			dom.appendChild(sub);
		}
		if( hoken.koukikourei_list.length > 0 ){
			sub = Subpanel.create("後期高齢", function(subdom){
				KoukikoureiDisp.render(subdom, hoken.koukikourei_list[0]);
			});
			dom.appendChild(sub);
		}
		if( hoken.roujin_list.length > 0 ){
			sub = Subpanel.create("老人保険", function(subdom){
				RoujinDisp.render(subdom, hoken.roujin_list[0]);
			});
			dom.appendChild(sub);
		}
		hoken.kouhi_list.forEach(function(kouhi, index){
			sub = Subpanel.create("公費(" + (index+1) + ")", function(subdom){
				KouhiDisp.render(subdom, kouhi);
			});
			dom.appendChild(sub);
		});
	});
};
