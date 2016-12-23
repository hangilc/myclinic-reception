var hogan = require("hogan.js");
var tmplSrc = require("raw!./koukikourei-detail.html");
var tmpl = hogan.compile(tmplSrc);
var rUtil = require("../reception-util.js");

exports.create = function(koukikourei, patient, callbacks){
	var data = {
		valid_from_as_kanji: rUtil.validFromAsKanji(koukikourei.valid_from),
		valid_upto_as_kanji: rUtil.validUptoAsKanji(koukikourei.valid_upto)
	};
	Object.keys(koukikourei).forEach(function(key){
		data[key] = koukikourei[key];
	});
	var html = tmpl.render(data);
	var dom = rUtil.makeNode(html);
	linkCallbacks(dom, callbacks);
	return dom;
};

function linkCallbacks(dom, callbacks){
	dom.querySelector(".close-koukikourei").addEventListener("click", function(){
		callbacks.onClose();
	});
	dom.querySelector(".edit-koukikourei").addEventListener("click", function(){
		callbacks.onEdit();
	});
	dom.querySelector(".delete-koukikourei").addEventListener("click", function(){
		callbacks.onDelete();
	});
}
