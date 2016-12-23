var hogan = require("hogan.js");
var tmplSrc = require("raw!./shahokokuho-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("myclinic-util");
var rUtil = require("../reception-util.js");
var ShahokokuhoForm = require("./shahokokuho-form.js");
var conti = require("conti");
var service = require("myclinic-service-api");
var Detail = require("./shahokokuho-detail.js");

exports.create = function(shahokokuho, patient){
	var rep = mUtil.shahokokuhoRep(shahokokuho.hokensha_bangou);
	if( shahokokuho.kourei > 0 ){
		rep += "（高齢・" + shahokokuho.kourei + "割）";	
	}
	var dom = rUtil.makeNode(tmpl.render({ 
		label: rep,
	}));
	bindDetail(dom, shahokokuho, patient);
	return dom;
};

function bindDetail(dom, shahokokuho, patient){
	dom.querySelector(".detail").addEventListener("click", function(){
		var detail = Detail.create(shahokokuho, {
			onClose: function(){
				detail.parentNode.removeChild(detail);
				dom.style.display = "block";	
			},
			onEdit: function(){
				detail.parentNode.removeChild(detail);
				doEdit(dom, shahokokuho, patient);
			},
			onDelete: function(){
				if( !confirm("この社保・国保を削除しますか？") ){
					return;
				}
				service.deleteShahokokuho(shahokokuho.shahokokuho_id, function(err, result){
					if( err ){
						alert(err);
						return;
					}
					var parentNode = dom.parentNode;
					detail.parentNode.removeChild(detail);
					dom.parentNode.removeChild(dom);
					var e = new CustomEvent("broadcast-shahokokuho-deleted", {
						bubbles: true,
						detail: { patient_id: shahokokuho.patient_id }
					});
					parentNode.dispatchEvent(e);
				});
			}
		});
		detail.style.border = "1px solid #999";
		detail.style.padding = "4px";
		dom.style.display = "none";
		dom.parentNode.insertBefore(detail, dom);
	});
}

function doEdit(dom, shahokokuho, patient){
	dom.style.display = "none";
	var form = new ShahokokuhoForm(shahokokuho, patient);
	var formDom = form.createDom({
		onEnter: function(){
			var errs = [];
			var values = form.getValues(errs);
			if( errs.length > 0 ){
				form.setError(errs);
				return;
			}
			values.shahokokuho_id = shahokokuho.shahokokuho_id;
			values.patient_id = shahokokuho.patient_id;
			var updatedShahokokuho;
			conti.exec([
				function(done){
					service.updateShahokokuho(values, done);
				},
				function(done){
					service.getShahokokuho(values.shahokokuho_id, function(err, result){
						if( err ){
							done(err);
							return;
						}
						updatedShahokokuho = result;
						done();
					});
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				var newDom = exports.create(updatedShahokokuho, patient);
				formWrapper.parentNode.removeChild(formWrapper);
				dom.parentNode.replaceChild(newDom, dom);
			});
		},
		onCancel: function(){
			formWrapper.parentNode.removeChild(formWrapper);
			dom.style.display = "block";
		}
	});
	var formWrapper = document.createElement("div");
	formWrapper.classList.add("form-wrapper");
	formWrapper.appendChild(formDom);
	dom.style.display = "none";
	dom.parentNode.insertBefore(formWrapper, dom);
}

function bindEdit(dom, shahokokuho, patient){
	dom.querySelector(".edit").addEventListener("click", function(){
		var form = new ShahokokuhoForm(shahokokuho, patient);
		var formDom = form.createDom({
			onEnter: function(){
				var errs = [];
				var values = form.getValues(errs);
				if( errs.length > 0 ){
					form.setError(errs);
					return;
				}
				values.shahokokuho_id = shahokokuho.shahokokuho_id;
				values.patient_id = shahokokuho.patient_id;
				var updatedShahokokuho;
				conti.exec([
					function(done){
						service.updateShahokokuho(values, done);
					},
					function(done){
						service.getShahokokuho(values.shahokokuho_id, function(err, result){
							if( err ){
								done(err);
								return;
							}
							updatedShahokokuho = result;
							done();
						});
					}
				], function(err){
					if( err ){
						alert(err);
						return;
					}
					var newDom = exports.create(updatedShahokokuho, patient);
					formWrapper.parentNode.removeChild(formWrapper);
					dom.parentNode.replaceChild(newDom, dom);
				});
			},
			onCancel: function(){
				formWrapper.parentNode.removeChild(formWrapper);
				dom.style.display = "block";
			}
		});
		var formWrapper = document.createElement("div");
		formWrapper.style.border = "1px solid #999";
		formWrapper.style.padding = "4px";
		formWrapper.appendChild(formDom);
		dom.style.display = "none";
		dom.parentNode.insertBefore(formWrapper, dom);
	});
}
