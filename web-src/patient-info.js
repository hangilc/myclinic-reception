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
var CommandBox = require("./patient-info-command-box.js");
var ShahokokuhoForm = require("./shahokokuho-form.js");

exports.add = function(data){
	var patient = data.patient;
	var hoken = data.hoken;
	Panel.add("患者情報", function(dom, wrapper){
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
		var commandBox = CommandBox.create(patient.patient_id, {
			onNewShahokokuho: function(){
				newShahokokuho(patient, wrapper);
			},
			onNewKoukikourei: function(){
				console.log("new-koukikourei");
			},
			onNewKouhi: function(){
				console.log("new-kouhi");

			},
			onEditAllHoken: function(){
				console.log("edit-all-hoken");
			},
			onStartVisit: function(){
				console.log("start-visit");

			},
			onClose: function(){
				wrapper.parentNode.removeChild(wrapper);	
			}
		});
		dom.appendChild(commandBox);
	});
};

function newShahokokuho(patient, wrapper){
	var sub = Subpanel.create("新規社保・国保入力", function(dom){
		var form = ShahokokuhoForm.create({
			honnin: false,
			kourei: 0	
		}, {
			onEntered: function(shahokokuho){
				console.log(shahokokuho);
				sub.parentNode.removeChild(sub);
			},
			onCancel: function(){
				sub.parentNode.removeChild(sub);
			}
		});
		dom.appendChild(form);
	});
	var commands = wrapper.querySelector("[data-role=patient-info-commands]");
	commands.parentNode.insertBefore(sub, commands);
}

