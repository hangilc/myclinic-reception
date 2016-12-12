var hogan = require("hogan.js");
var tmplSrc = require("raw!./shahokokuho-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("myclinic-util");

exports.render = function(dom, shahokokuho){
	var rep = mUtil.shahokokuhoRep(shahokokuho.hokensha_bangou);
	if( shahokokuho.kourei > 0 ){
		rep += "・" + shahokokuho.kourei + "割";	
	}
	dom.innerHTML = tmpl.render({ label: rep });
}
