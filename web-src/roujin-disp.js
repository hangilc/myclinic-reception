var hogan = require("hogan.js");
var tmplSrc = require("raw!./roujin-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("myclinic-util");

exports.render = function(dom, roujin){
	var rep = mUtil.roujinRep(roujin.futan_wari);
	dom.innerHTML = tmpl.render({ label: rep });
}
