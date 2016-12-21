var hogan = require("hogan.js");
var tmplSrc = require("raw!./shahokokuho-detail.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("myclinic-util");
var kanjidate = require("kanjidate");
var rUtil = require("../reception-util.js");

exports.create = function(shahokokuho, callbacks){
	var dom = document.createElement("div");
	var data = {
		rep: mUtil.shahokokuhoRep(shahokokuho.hokensha_bangou),
		honnin_as_kanji: +shahokokuho.honnin === 0 ? "家族" : "本人",
		valid_from_as_kanji: kanjidate.format(kanjidate.f2, shahokokuho.valid_from),
		valid_upto_as_kanji: rUtil.validUptoAsKanji(shahokokuho.valid_upto),
		kourei_as_kanji: koureiAsKanji(shahokokuho.kourei),
	};
	Object.keys(shahokokuho).forEach(function(key){
		data[key] = shahokokuho[key];
	});
	data
	var html = tmpl.render(data);
	dom.innerHTML = tmpl.render(data);
	bindClose(dom, callbacks.onClose);
	bindEdit(dom, callbacks.onEdit);
	bindDelete(dom, callbacks.onDelete);
	return dom;
};

function koureiAsKanji(kourei){
	kourei = +kourei;
	if( kourei === 0 ){
		return "（高齢でない）";
	} else {
		return "高齢" + kourei + "割";
	}
}

function bindClose(dom, callback){
	dom.querySelector(".close").addEventListener("click", function(){
		callback();
	});
}

function bindEdit(dom, callback){
	dom.querySelector(".edit").addEventListener("click", function(){
		callback();
	});
}

function bindDelete(dom, callback){
	dom.querySelector(".delete").addEventListener("click", function(){
		callback();
	});
}



