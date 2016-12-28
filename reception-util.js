var kanjidate = require("kanjidate");
var moment = require("moment");

exports.padNumber = function(num, ncols, pad){
	if( pad === undefined ){
		pad = "0";
	}
	var rep = "" + num;
	var rem = ncols - rep.length;
	var lead = "";
	while( rem > 0 ){
		lead += pad;
		rem--;
	}
	return lead + rep;
}

exports.birthdayAsKanji = function(birthday){
	if( !birthday || birthday === "0000-00-00" ){
		return "???";
	}
	return kanjidate.format(kanjidate.f2, birthday);
};

exports.calcAge = function(birthday){
	if( !birthday || birthday === "0000-00-00" ){
		return "??";
	}
	var bd = moment(birthday);
	return moment().diff(bd, "years");
};

exports.sexAsKanji = function(sex){
	switch(sex){
		case "M": return "男";
		case "F": return "女";
		default: return "??";
	}
};

exports.todayAsSqlDate = function(){
	return moment().format("YYYY-MM-DD");
};

exports.nowAsSqlDateTime = function(){
	return moment().format("YYYY-MM-DD HH:mm:ss");
};

exports.validFromAsKanji = function(d){
	return kanjidate.format(kanjidate.f2, d);
};

exports.validUptoAsKanji = function(d){
	if( d === "0000-00-00" ){
		return "（期限なし）";
	} else {
		return kanjidate.format(kanjidate.f2, d);
	}
};

exports.makeNode = function(html){
	var dom = document.createElement("div");
	dom.innerHTML = html;
	return dom.firstChild;
};

exports.removeNode = function(node){
	node.parentNode.removeChild(node);
};

exports.prepend = function(wrapper, dom){
	if( wrapper.firstChild ){
		wrapper.insertBefore(dom, wrapper.firstChild);
	} else {
		wrapper.appendChild(dom);
	}
};
