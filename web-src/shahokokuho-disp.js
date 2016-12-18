var hogan = require("hogan.js");
var tmplSrc = require("raw!./shahokokuho-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("myclinic-util");
var rUtil = require("../reception-util.js");

exports.create = function(shahokokuho){
	var rep = mUtil.shahokokuhoRep(shahokokuho.hokensha_bangou);
	if( shahokokuho.kourei > 0 ){
		rep += "・" + shahokokuho.kourei + "割";	
	}
	return rUtil.makeNode(tmpl.render({ label: rep }));
};
