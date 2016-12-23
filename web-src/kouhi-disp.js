var hogan = require("hogan.js");
var tmplSrc = require("raw!./kouhi-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("myclinic-util");
var rUtil = require("../reception-util.js");
var Detail = require("./kouhi-detail.js");
var Form = require("./kouhi-form.js");
var service = require("myclinic-service-api");
var conti = require("conti");

exports.create = function(kouhi, patient){
	var rep = mUtil.kouhiRep(kouhi.futansha);
	var html = tmpl.render({ label: rep });
	var dom = rUtil.makeNode(html);
	bindDetail(dom, kouhi, patient);
	return dom;
}

function bindDetail(dom, kouhi, patient){
	dom.querySelector(".detail").addEventListener("click", function(){
		var detail = Detail.create(kouhi, patient, {
			onClose: function(){
				rUtil.removeNode(detail);
				dom.style.display = "block";	
			},
			onEdit: function(){
				rUtil.removeNode(detail);
				doEdit(dom, kouhi, patient);
			},
			onDelete: function(){
				doDelete(dom, detail, kouhi);
			}
		});
		detail.style.border = "1px solid #999";
		detail.style.padding = "4px";
		dom.style.display = "none";
		dom.parentNode.insertBefore(detail, dom);
	});
}

function doEdit(disp, kouhi, patient){
	var data = {
		kouhi: kouhi,
		patient: patient
	};
	var form = Form.create(data, {
		onEnter: function(values){
			values.kouhi_id = kouhi.kouhi_id;
			values.patient_id = patient.patient_id;
			var updatedKouhi;
			conti.exec([
				function(done){
					service.updateKouhi(values, done);	
				},
				function(done){
					service.getKouhi(values.kouhi_id, function(err, result){
						if( err ){
							done(err);
							return;
						}
						updatedKouhi = result;
						done();
					});
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				var newDisp = exports.create(updatedKouhi, patient);
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

function doDelete(disp, detail, kouhi){
	if( !confirm("この公費を削除していいですか？") ){
		return;
	}
	service.deleteKouhi(kouhi.kouhi_id, function(err){
		if( err ){
			alert(err);
			return;
		}
		var parentNode = disp.parentNode;
		rUtil.removeNode(detail);
		rUtil.removeNode(disp);
		var e = new CustomEvent("broadcast-kouhi-deleted", {
			bubbles: true,
			detail: {patient_id: kouhi.patient_id}
		});
		parentNode.dispatchEvent(e);
	});
}
