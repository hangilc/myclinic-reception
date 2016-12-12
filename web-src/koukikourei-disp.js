var hogan = require("hogan.js");
var tmplSrc = require("raw!./koukikourei-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("myclinic-util");

exports.render = function(dom, koukikourei){
	var rep = mUtil.koukikoureiRep(koukikourei.futan_wari);
	dom.innerHTML = tmpl.render({ label: rep });
}
