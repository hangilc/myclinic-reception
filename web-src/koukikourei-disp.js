var hogan = require("hogan.js");
var tmplSrc = require("raw!./koukikourei-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("myclinic-util");
var rUtil = require("../reception-util.js");
var Detail = require("./koukikourei-detail.js");

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
				console.log("ON-EDIT");	

			},
			onDelete: function(){
				console.log("ON-DELETE");	

			}
		});
		detail.style.border = "1px solid #999";
		detail.style.padding = "4px";
		dom.style.display = "none";
		dom.parentNode.insertBefore(detail, dom);
	});
}
