var hogan = require("hogan.js");
var tmplSrc = require("raw!./shahokokuho-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("myclinic-util");
var rUtil = require("../reception-util.js");
var ShahokokuhoForm = require("./shahokokuho-form.js");

exports.create = function(shahokokuho, patient){
	var rep = mUtil.shahokokuhoRep(shahokokuho.hokensha_bangou);
	if( shahokokuho.kourei > 0 ){
		rep += "・" + shahokokuho.kourei + "割";	
	}
	var dom = rUtil.makeNode(tmpl.render({ 
		label: rep,
	}));
	dom.querySelector(".edit").addEventListener("click", function(){
		var form = ShahokokuhoForm.create({
			patient: patient,
			shahokokuho: shahokokuho
		}, {
			onCancel: function(){
				domWrapper.parentNode.removeChild(domWrapper);
				dom.style.display = "block";
			}
		});
		var formWrapper = document.createElement("div");
		formWrapper.style.border = "1px solid #999";
		formWrapper.style.padding = "4px";
		formWrapper.appendChild(form);
		dom.style.display = "none";
		dom.parentNode.insertBefore(formWrapper, dom);
	});
	return dom;
};
