"use strict";

var hogan = require("hogan.js");
var tmplSrc = require("raw!./koukikourei-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("myclinic-util");
var rUtil = require("../reception-util.js");
var Detail = require("./koukikourei-detail.js");
var Form = require("./koukikourei-form.js");
var service = require("myclinic-service-api");
var conti = require("conti");

exports.create = function(koukikourei, patient){
	var rep = "後期高齢（" + koukikourei.futan_wari + "割）";
	var html = tmpl.render({ label: rep });
	var dom = rUtil.makeNode(html);
	bindDetail(dom, koukikourei, patient);
	return dom;
}

function bindDetail(dom, koukikourei, patient){
	dom.querySelector(".detail").addEventListener("click", function(){
		var detail = Detail.create(koukikourei, patient, {
			onClose: function(){
				rUtil.removeNode(detail);
				dom.style.display = "block";	
			},
			onEdit: function(){
				rUtil.removeNode(detail);
				doEdit(dom, koukikourei, patient);
			},
			onDelete: function(){
				doDelete(dom, detail, koukikourei);
			}
		});
		detail.style.border = "1px solid #999";
		detail.style.padding = "4px";
		dom.style.display = "none";
		dom.parentNode.insertBefore(detail, dom);
	});
}

function doEdit(disp, koukikourei, patient){
	var data = {
		koukikourei: koukikourei,
		patient: patient
	};
	var form = Form.create(data, {
		onEnter: function(values){
			values.koukikourei_id = koukikourei.koukikourei_id;
			values.patient_id = patient.patient_id;
			var updatedKoukikourei;
			conti.exec([
				function(done){
					service.updateKoukikourei(values, done);	
				},
				function(done){
					service.getKoukikourei(values.koukikourei_id, function(err, result){
						if( err ){
							done(err);
							return;
						}
						updatedKoukikourei = result;
						done();
					});
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				var newDisp = exports.create(updatedKoukikourei, patient);
				rUtil.removeNode(formWrapper);
				disp.parentNode.replaceChild(newDisp, disp);
			});
		},
		onCancel: function(){
			rUtil.removeNode(formWrapper);
			disp.style.display = "block";
		}
	});
	var formWrapper = document.createElement("div");
	formWrapper.classList.add("form-wrapper");
	formWrapper.appendChild(form);
	disp.parentNode.insertBefore(formWrapper, disp);
}

function doDelete(disp, detail, koukikourei){
	if( !confirm("この後期高齢を削除していいですか？") ){
		return;
	}
	service.deleteKoukikourei(koukikourei.koukikourei_id, function(err){
		if( err ){
			alert(err);
			return;
		}
		var parentNode = disp.parentNode;
		rUtil.removeNode(detail);
		rUtil.removeNode(disp);
		var e = new CustomEvent("broadcast-koukikourei-deleted", {
			bubbles: true,
			detail: {patient_id: koukikourei.patient_id}
		});
		parentNode.dispatchEvent(e);
	});
}
