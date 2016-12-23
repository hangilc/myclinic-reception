var Panel = require("./panel.js");
var Subpanel = require("./subpanel.js");
var hogan = require("hogan.js");
var Util = require("../reception-util.js");
var BasicInfo = require("./patient-basic-info.js");
var mUtil = require("myclinic-util");
var ShahokokuhoArea = require("./shahokokuho-area.js");
var KoukikoureiArea = require("./koukikourei-area.js");
var RoujinArea = require("./roujin-area.js");
var KouhiArea = require("./kouhi-area.js");
var CommandBox = require("./patient-info-command-box.js");
var ShahokokuhoForm = require("./shahokokuho-form.js");
var KoukikoureiForm = require("./koukikourei-form.js");
var KouhiForm = require("./kouhi-form.js");
var tmplSrc = require("raw!./patient-info.html");
var conti = require("conti");
var service = require("myclinic-service-api");

exports.add = function(data){
	var patient = data.patient;
	var hoken = data.hoken;
	var sub;
	Panel.add("患者情報", function(dom, wrapper){
		dom.innerHTML = tmplSrc;
		sub = Subpanel.create("基本情報", function(subdom){
			BasicInfo.render(subdom, patient);
		});
		dom.querySelector(".basic-info-wrapper").appendChild(sub);
		if( hoken.shahokokuho_list.length > 0 ){
			sub = Subpanel.create("社保・国保", function(subdom){
				ShahokokuhoArea.render(subdom, hoken.shahokokuho_list, patient);
			});
			dom.querySelector(".shahokokuho-wrapper").appendChild(sub);
		}
		if( hoken.koukikourei_list.length > 0 ){
			sub = Subpanel.create("後期高齢", function(subdom){
				KoukikoureiArea.render(subdom, hoken.koukikourei_list);
			});
			dom.querySelector(".koukikourei-wrapper").appendChild(sub);
		}
		if( hoken.roujin_list.length > 0 ){
			sub = Subpanel.create("老人保険", function(subdom){
				RoujinArea.render(subdom, hoken.roujin_list);
			});
			dom.querySelector(".roujin-wrapper").appendChild(sub);
		}
		if( hoken.kouhi_list.length > 0) {
			sub = Subpanel.create("公費", function(subdom){
				KouhiArea.render(subdom, hoken.kouhi_list);
			});
			dom.querySelector(".kouhi-wrapper").appendChild(sub);
		}
		var commandBox = CommandBox.create(patient.patient_id, {
			onNewShahokokuho: function(){
				newShahokokuho(patient, wrapper);
			},
			onNewKoukikourei: function(){
				newKoukikourei(patient, wrapper);
			},
			onNewKouhi: function(){
				newKouhi(patient, wrapper);
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
		var form = new ShahokokuhoForm({
			patient_id: patient.patient_id,
			honnin: 0,
			kourei: 0	
		}, patient);
		dom.appendChild(form.createDom({
			onEnter: function(){
				var errs = [];
				var values = form.getValues(errs);
				if( errs.length > 0 ){
					form.setError(errs);
					return;
				}
				values.patient_id = patient.patient_id;
				var enteredShahokokuho;
				conti.exec([
					function(done){
						service.enterShahokokuho(values, done);
					},
					function(done){
						service.getShahokokuho(values.shahokokuho_id, function(err, result){
							if( err ){
								done(err);
								return;
							}
							enteredShahokokuho = result;
							done();
						});
					}
				], function(err){
					if( err ){
						alert(err);
						return;
					}
					var e = new CustomEvent("broadcast-shahokokuho-entered", { 
						bubbles: true, 
						detail: enteredShahokokuho
					});
					wrapper.dispatchEvent(e);
					sub.parentNode.removeChild(sub);
				});
			},
			onCancel: function(){
				sub.parentNode.removeChild(sub);
			}
		}));
	});
	var commands = wrapper.querySelector("[data-role=patient-info-commands]");
	commands.parentNode.insertBefore(sub, commands);
}

function newKoukikourei(patient, wrapper){
	var sub = Subpanel.create("新規後期高齢入力", function(dom){
		var data = {
			patient: patient,
			koukikourei: {
				futan_wari: 1
			}
		};
		var form = KoukikoureiForm.create(data, {
			onEntered: function(koukikourei){
				var e = new CustomEvent("broadcast-koukikourei-entered", {
					bubbles: true,
					detail: koukikourei
				});
				wrapper.dispatchEvent(e);
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

function newKouhi(patient, wrapper){
	var sub = Subpanel.create("新規公費入力", function(dom){
		var data = {
			patient: patient,
			kouhi: {
				futan_wari: 1
			}
		};
		var form = KouhiForm.create(data, {
			onEntered: function(kouhi){
				var e = new CustomEvent("broadcast-kouhi-entered", {
					bubbles: true,
					detail: kouhi
				});
				wrapper.dispatchEvent(e);
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

