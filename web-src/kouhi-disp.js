var hogan = require("hogan.js");
var tmplSrc = require("raw!./kouhi-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("myclinic-util");

exports.render = function(dom, kouhi){
	var rep = mUtil.kouhiRep(kouhi.futansha_bangou);
	dom.innerHTML = tmpl.render({ label: rep });
}
