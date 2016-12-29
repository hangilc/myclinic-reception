"use strict";

var service = require("myclinic-service-api");
var modal = require("../myclinic-modal.js");
var StartVisit = require("./start-visit.js");

function doStartVisit(patientId, done){
	service.getPatient(+patientId, function(err, patient){
		if( err ){
			done(err);
			return;
		}
		modal.startModal({
			title: "患者受付",
			init: function(content, close){
				StartVisit.render(content, patient, {
					onClose: function(){
						close();
						done("cancel");
					},
					onError: function(err){
						close();
						done(err);
					},
					onEnter: function(){
						var e = new Event("new-visit", { bubbles: true });
						document.body.dispatchEvent(e);
						close();
						done();
					}
				});
			},
			position: "fixed"
		});
	});
}

module.exports = doStartVisit;