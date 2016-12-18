var hogan = require("hogan.js");
var tmplSrc = require("raw!./roujin-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("myclinic-util");
var rUtil = require("../reception-util.js");

exports.create = function(roujin){
	var rep = mUtil.roujinRep(roujin.futan_wari);
	var html = tmpl.render({ label: rep });
	return rUtil.makeNode(html);
}
