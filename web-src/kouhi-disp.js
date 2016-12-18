var hogan = require("hogan.js");
var tmplSrc = require("raw!./kouhi-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("myclinic-util");
var rUtil = require("../reception-util.js");

exports.create = function(kouhi){
	var rep = mUtil.kouhiRep(kouhi.futansha_bangou);
	var html = tmpl.render({ label: rep });
	return rUtil.makeNode(html);
}
