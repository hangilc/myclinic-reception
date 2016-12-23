"use strict";

var hogan = require("hogan.js");
var tmplSrc = require("raw!./kouhi-detail.html");
var tmpl = hogan.compile(tmplSrc);
var rUtil = require("../reception-util.js");

exports.create = function(kouhi, patient, callbacks){
	var data = {
		valid_from_as_kanji: rUtil.validFromAsKanji(kouhi.valid_from),
		valid_upto_as_kanji: rUtil.validUptoAsKanji(kouhi.valid_upto)
	};
	Object.keys(kouhi).forEach(function(key){
		data[key] = kouhi[key];
	});
	var html = tmpl.render(data);
	var dom = rUtil.makeNode(html);
	linkCallbacks(dom, callbacks);
	return dom;
};

function linkCallbacks(dom, callbacks){
	dom.querySelector(".close-kouhi").addEventListener("click", function(){
		callbacks.onClose();
	});
	dom.querySelector(".edit-kouhi").addEventListener("click", function(){
		callbacks.onEdit();
	});
	dom.querySelector(".delete-kouhi").addEventListener("click", function(){
		callbacks.onDelete();
	});
}
