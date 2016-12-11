var Wqueue = require("./wqueue.js");
var service = require("myclinic-service-api");
var conti = require("conti");
var modal = require("../myclinic-modal.js");
var StartVisit = require("./start-visit.js");
var Util = require("../reception-util.js");

var domUpdateWqueueButton = document.getElementById("update-wqueue-button");
var domWqueueTable = document.getElementById("wqueue-table");
var domPatientIdInput = document.getElementById("patient-id-input");
var domStartVisitButton = document.getElementById("start-visit-button");

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
					onClose: close	
				});
			}
		});
	});
});

