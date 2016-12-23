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
	var data = {
		label: rep
	};
	Object.keys(shahokokuho).forEach(function(key){
		data[key] = shahokokuho[key];
	});
	var dom = rUtil.makeNode(tmpl.render(data));
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
					var e = new CustomEvent("broadcast-shahokokuho-deleted", {
						bubbles: true,
						detail: shahokokuho
					});
					dom.dispatchEvent(e);
				});
			}
		});
		detail.classList.add("form-wrapper");
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
				formDom.parentNode.removeChild(formDom);
				dom.parentNode.replaceChild(newDom, dom);
			});
		},
		onCancel: function(){
			formDom.parentNode.removeChild(formDom);
			dom.style.display = "block";
		}
	});
	formDom.classList.add("form-wrapper");
	dom.style.display = "none";
	dom.parentNode.insertBefore(formDom, dom);
}
