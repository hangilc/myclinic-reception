var Wqueue = require("./wqueue.js");
var service = require("myclinic-service-api");
var conti = require("conti");
var modal = require("../myclinic-modal.js");
var StartVisit = require("./start-visit.js");
var rUtil = require("../reception-util.js");
var PatientInfo = require("./patient-info.js");
var NewPatientPanel = require("./new-patient-panel.js");
var RecentlyEnteredPatientsPanel = require("./recently-registered-patients.js");
var SearchPatient = require("./search-patient.js");
var Panel = require("./panel");
var doStartVisit = require("./do-start-visit.js");

var domUpdateWqueueButton = document.getElementById("update-wqueue-button");
var domWqueueTable = document.getElementById("wqueue-table");
var domPatientIdInput = document.getElementById("patient-id-input");
var domStartVisitButton = document.getElementById("start-visit-button");
var domPatientInfoLink = document.querySelector(".patient-info-button");
var domNewPatientLink = document.querySelector(".new-patient-button");
var domRecentlyEnteredPatientsLink = document.querySelector(".recently-registered-patients");
var domSearchPatientsLink = document.querySelector(".search-patient");

updateWqueue();

domUpdateWqueueButton.addEventListener("click", updateWqueue);

function updateWqueue(){
	var dom = domWqueueTable;
	var wqueue;
	conti.exec([
		function(done){
			service.listFullWqueue(function(err, result){
				if( err ){
					done(err);
					return;
				}
				wqueue = result;
				done();
			});
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		Wqueue.render(dom, wqueue);
	});
}

domStartVisitButton.addEventListener("click", function(){
	var patientId = domPatientIdInput.value;
	if( patientId === "" ){
		alert("患者番号が入力されていません。");
		return;
	}
	if( !(patientId.match(/^\d+$/)) ){
		alert("患者番号が不適切です。");
		return;
	}
	patientId = +patientId;
	doStartVisit(patientId, function(err){
		if( err === "cancel" ){
			; // nop
		} else if( err ){
			alert(err);
		} else {
			domPatientIdInput.value = "";
		}
	});
});

document.body.addEventListener("new-visit", function(){
	updateWqueue();
});

function doPatientInfo(patientId, done){
	var seltor = ".workarea-panel.patient-info[data-patient-id='" + patientId + "']";
	var current = Panel.container.querySelector(seltor);
	if( current ){
		current.parentNode.removeChild(current);
		Panel.prepend(current);
		done();
	} else {
		fetchPatientInfo(patientId, rUtil.todayAsSqlDate(), function(err, result){
			if( err ){
				done(err);
				return;
			}
			Panel.prepend(PatientInfo.create(result.patient, result.hoken));
			done();
		});
	}
}

domPatientInfoLink.addEventListener("click", function(){
	var patientId = domPatientIdInput.value;
	if( patientId === "" ){
		alert("患者番号が入力されていません。");
		return;
	}
	if( !(patientId.match(/^\d+$/)) ){
		alert("患者番号が不適切です。");
		return;
	}
	patientId = +patientId;
	doPatientInfo(patientId, function(err){
		if( err ){
			alert(err);
			return;
		}
		domPatientIdInput.value = "";
	});
});

function fetchPatientInfo(patientId, at, cb){
	var data = {};
	conti.exec([
		function(done){
			service.getPatient(patientId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				data.patient = result;
				done();
			});
		},
		function(done){
			service.listAvailableHoken(patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				data.hoken = result;
				done();
			});
		}
	], function(err){
		if( err ){
			cb(err);
			return;
		}
		cb(undefined, data);
	});
}

domNewPatientLink.addEventListener("click", function(){
	var panel = NewPatientPanel.create();
	Panel.prepend(panel);
});

domRecentlyEnteredPatientsLink.addEventListener("click", function(){
	service.listRecentlyEnteredPatients(20, function(err, result){
		if( err ){
			alert(err);
			return;
		}
		var panel = RecentlyEnteredPatientsPanel.create(result, {
			onStartVisit: function(patientId){
				doStartVisit(patientId, function(err){
					if( err === "cancel" ){
						; // nop
					} else if( err ){
						alert(err);
					} else {
						rUtil.removeNode(panel);
					}
				});
			},
			onPatientInfo: function(patientId){
				doPatientInfo(patientId, function(err){
					if( err ){
						alert(err);
						return;
					}
					rUtil.removeNode(panel);
				});
			},
			onClose: function(){
				rUtil.removeNode(panel);
			}
		});
		Panel.prepend(panel);
	});
});

domSearchPatientsLink.addEventListener("click", function(){
	var search;
	var panel = Panel.create("患者検索", function(content){
		search = SearchPatient.create({
			onStartVisit: function(patientId){
				doStartVisit(patientId, function(err){
					if( err === "cancel" ){
						; // nop
					} else if( err ){
						alert(err);
						return;
					} else {
						rUtil.removeNode(panel);
					}
				});
			},
			onPatientInfo: function(patientId){
				doPatientInfo(patientId, function(err){
					if( err ){
						alert(err);
						return;
					}
					rUtil.removeNode(panel);
				});
			},
			onClose: function(){
				rUtil.removeNode(panel);
			}
		});
		content.appendChild(search);
	});
	Panel.prepend(panel);
	SearchPatient.setupFocus(search);
});

function broadcast(selector, event){
	var doms = document.querySelectorAll(selector);
	for(var i=0;i<doms.length;i++){
		var dom = doms[i];
		dom.dispatchEvent(event);
	}
}

document.addEventListener("broadcast-shahokokuho-entered", function(event){
	var shahokokuho = event.detail;
	var e = new CustomEvent("shahokokuho-entered", { detail: shahokokuho });
	var doms = document.querySelectorAll(".listening-to-shahokokuho-entered");
	for(var i=0;i<doms.length;i++){
		var dom = doms[i];
		dom.dispatchEvent(e);
	}
});

document.addEventListener("broadcast-shahokokuho-deleted", function(event){
	var e = new CustomEvent("shahokokuho-deleted", { detail: event.detail });
	broadcast(".listening-to-shahokokuho-deleted", e);
});

document.addEventListener("broadcast-koukikourei-entered", function(event){
	var koukikourei = event.detail;
	var e = new CustomEvent("koukikourei-entered", { detail: koukikourei });
	var doms = document.querySelectorAll(".listening-to-koukikourei-entered");
	for(var i=0;i<doms.length;i++){
		var dom = doms[i];
		dom.dispatchEvent(e);
	}
});

document.addEventListener("broadcast-koukikourei-deleted", function(event){
	var e = new CustomEvent("koukikourei-deleted", { detail: event.detail });
	broadcast(".listening-to-koukikourei-deleted", e);
});

document.addEventListener("broadcast-roujin-deleted", function(event){
	var e = new CustomEvent("roujin-deleted", { detail: event.detail });
	broadcast(".listening-to-roujin-deleted", e);
});

document.addEventListener("broadcast-kouhi-entered", function(event){
	var kouhi = event.detail;
	var e = new CustomEvent("kouhi-entered", { detail: kouhi });
	var doms = document.querySelectorAll(".listening-to-kouhi-entered");
	for(var i=0;i<doms.length;i++){
		var dom = doms[i];
		dom.dispatchEvent(e);
	}
});

document.addEventListener("broadcast-kouhi-deleted", function(event){
	var e = new CustomEvent("kouhi-deleted", { detail: event.detail });
	broadcast(".listening-to-kouhi-deleted", e);
});

document.getElementById("patient-id-input").focus();
