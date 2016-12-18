var Wqueue = require("./wqueue.js");
var service = require("myclinic-service-api");
var conti = require("conti");
var modal = require("../myclinic-modal.js");
var StartVisit = require("./start-visit.js");
var Util = require("../reception-util.js");
var PatientInfo = require("./patient-info.js");

var domUpdateWqueueButton = document.getElementById("update-wqueue-button");
var domWqueueTable = document.getElementById("wqueue-table");
var domPatientIdInput = document.getElementById("patient-id-input");
var domStartVisitButton = document.getElementById("start-visit-button");
var domPatientInfoLink = document.querySelector(".patient-info-button");

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
	service.getPatient(+patientId, function(err, patient){
		if( err ){
			alert(err);
			return;
		}
		modal.startModal({
			title: "患者受付",
			init: function(content, close){
				StartVisit.render(content, patient, {
					onClose: close,
					onError: function(err){
						alert(err);
						close();
					},
					onEnter: function(){
						var e = new Event("new-visit", { bubbles: true });
						domStartVisitButton.dispatchEvent(e);
						domPatientIdInput.value = "";
						close();
					}
				});
			}
		});
	});
});

document.body.addEventListener("new-visit", function(){
	updateWqueue();
});

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
	fetchPatientInfo(patientId, Util.todayAsSqlDate(), function(err, result){
		if( err ){
			alert(err);
			return;
		}
		PatientInfo.add(result);
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

document.addEventListener("broadcast-shahokokuho-entered", function(event){
	var shahokokuho = event.detail;
	var e = new CustomEvent("shahokokuho-entered", { detail: shahokokuho });
	var doms = document.querySelectorAll(".listening-to-shahokokuho-entered");
	for(var i=0;i<doms.length;i++){
		var dom = doms[i];
		dom.dispatchEvent(e);
	}
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

document.addEventListener("broadcast-kouhi-entered", function(event){
	var kouhi = event.detail;
	var e = new CustomEvent("kouhi-entered", { detail: kouhi });
	var doms = document.querySelectorAll(".listening-to-kouhi-entered");
	for(var i=0;i<doms.length;i++){
		var dom = doms[i];
		dom.dispatchEvent(e);
	}
});


