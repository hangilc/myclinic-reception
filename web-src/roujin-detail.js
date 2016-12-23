"use strict";

var hogan = require("hogan.js");
var tmplSrc = require("raw!./roujin-detail.html");
var tmpl = hogan.compile(tmplSrc);
var rUtil = require("../reception-util.js");

exports.create = function(roujin, patient, callbacks){
	var data = {
		valid_from_as_kanji: rUtil.validFromAsKanji(roujin.valid_from),
		valid_upto_as_kanji: rUtil.validUptoAsKanji(roujin.valid_upto)
	};
	Object.keys(roujin).forEach(function(key){
		data[key] = roujin[key];
	});
	var html = tmpl.render(data);
	var dom = rUtil.makeNode(html);
	linkCallbacks(dom, callbacks);
	return dom;
};

function linkCallbacks(dom, callbacks){
	dom.querySelector(".close-roujin").addEventListener("click", function(){
		callbacks.onClose();
	});
	dom.querySelector(".edit-roujin").addEventListener("click", function(){
		callbacks.onEdit();
	});
	dom.querySelector(".delete-roujin").addEventListener("click", function(){
		callbacks.onDelete();
	});
}
