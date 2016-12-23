var hogan = require("hogan.js");
var tmplSrc = require("raw!./roujin-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("myclinic-util");
var rUtil = require("../reception-util.js");
var Detail = require("./roujin-detail.js");
var Form = require("./roujin-form.js");
var service = require("myclinic-service-api");
var conti = require("conti");

exports.create = function(roujin, patient){
	var rep = "老人（" + roujin.futan_wari + "割）";
	var html = tmpl.render({ label: rep });
	var dom = rUtil.makeNode(html);
	bindDetail(dom, roujin, patient);
	return dom;
}

function bindDetail(dom, roujin, patient){
	dom.querySelector(".detail").addEventListener("click", function(){
		var detail = Detail.create(roujin, patient, {
			onClose: function(){
				rUtil.removeNode(detail);
				dom.style.display = "block";	
			},
			onEdit: function(){
				rUtil.removeNode(detail);
				doEdit(dom, roujin, patient);
			},
			onDelete: function(){
				doDelete(dom, detail, roujin);
			}
		});
		detail.style.border = "1px solid #999";
		detail.style.padding = "4px";
		dom.style.display = "none";
		dom.parentNode.insertBefore(detail, dom);
	});
}

function doEdit(disp, roujin, patient){
	var data = {
		roujin: roujin,
		patient: patient
	};
	var form = Form.create(data, {
		onEnter: function(values){
			values.roujin_id = roujin.roujin_id;
			values.patient_id = patient.patient_id;
			var updatedRoujin;
			conti.exec([
				function(done){
					service.updateRoujin(values, done);	
				},
				function(done){
					service.getRoujin(values.roujin_id, function(err, result){
						if( err ){
							done(err);
							return;
						}
						updatedRoujin = result;
						done();
					});
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				var newDisp = exports.create(updatedRoujin, patient);
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

function doDelete(disp, detail, roujin){
	if( !confirm("この老人保険を削除していいですか？") ){
		return;
	}
	service.deleteRoujin(roujin.roujin_id, function(err){
		if( err ){
			alert(err);
			return;
		}
		var parentNode = disp.parentNode;
		rUtil.removeNode(detail);
		rUtil.removeNode(disp);
		var e = new CustomEvent("broadcast-roujin-deleted", {
			bubbles: true,
			detail: {patient_id: roujin.patient_id}
		});
		parentNode.dispatchEvent(e);
	});
}
