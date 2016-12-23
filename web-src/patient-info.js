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
var rUtil = require("../reception-util.js");

exports.add = function(data){
	var patient = data.patient;
	var hoken = data.hoken;
	var sub;
	var title = "患者情報（" + patient.last_name + patient.first_name + "）";
	Panel.add(title, function(dom, wrapper){
		dom.innerHTML = tmplSrc;
		sub = Subpanel.create("基本情報", function(subdom){
			BasicInfo.render(subdom, patient);
		});
		dom.querySelector(".basic-info-wrapper").appendChild(sub);
		ShahokokuhoArea.setup(dom.querySelector(".shahokokuho-wrapper"), hoken.shahokokuho_list, patient);
		KoukikoureiArea.setup(dom.querySelector(".koukikourei-wrapper"), hoken.koukikourei_list, patient);
		RoujinArea.setup(dom.querySelector(".roujin-wrapper"), hoken.roujin_list, patient);
		KouhiArea.setup(dom.querySelector(".kouhi-wrapper"), hoken.kouhi_list, patient);
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
		var form = ShahokokuhoForm.create({
			patient: patient,
			shahokokuho: {
				honnin: 0,
				kourei: 0
			}
		}, {
			onEnter: function(values){
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
					rUtil.removeNode(sub);
				});
			},
			onCancel: function(){
				rUtil.removeNode(sub);
			}
		});
		dom.appendChild(form);
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
			onEnter: function(values){
				values.patient_id = patient.patient_id;
				var enteredKoukikourei;
				conti.exec([
					function(done){
						service.enterKoukikourei(values, done);	
					},
					function(done){
						service.getKoukikourei(values.koukikourei_id, function(err, result){
							if( err ){
								done(err);
								return;
							}
							enteredKoukikourei = result;
							done();
						});
					}
				], function(err){
					if( err ){
						alert(err);
						return;
					}
					var e = new CustomEvent("broadcast-koukikourei-entered", {
						bubbles: true,
						detail: enteredKoukikourei
					});
					wrapper.dispatchEvent(e);
					sub.parentNode.removeChild(sub);
				});
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
			onEnter: function(values){
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
					var e = new CustomEvent("broadcast-kouhi-entered", {
						bubbles: true,
						detail: enteredKouhi
					});
					wrapper.dispatchEvent(e);
					sub.parentNode.removeChild(sub);
				});
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

